"""
CortexaLabs Agency OS — Telegram Bot (v2)

Features:
  - Free-form chat: any message routed to Boss agent for natural conversation
  - YouTube auto-detection: paste a YT link → Analyst runs automatically
  - Background task execution: long tasks run in threads, notify when done
  - Scheduled briefs: daily brief at configured time (default 9:00 AM)
  - OS changes: "make X change to the app" → runs Claude in cortexalabs root
  - Task queue: messages queue while an agent is running

Run: python telegram-bot/bot.py
"""

import json
import os
import re
import subprocess
import sys
import threading
import time
from collections import deque
from datetime import datetime
from pathlib import Path

# ── Env ───────────────────────────────────────────────────────────────────────

ENV_PATH = Path(__file__).parent.parent / "agency-os" / "tools" / ".env.local"

def load_env(path: Path):
    if not path.exists():
        return
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, val = line.partition("=")
            os.environ.setdefault(key.strip(), val.strip())

load_env(ENV_PATH)

BOT_TOKEN  = os.getenv("TELEGRAM_BOT_TOKEN", "")
CHAT_ID    = os.getenv("TELEGRAM_CHAT_ID", "")
WORK_DIR   = Path(__file__).parent.parent   # cortexalabs root
AGENCY_DIR = WORK_DIR / "agency-os"

# Claude CLI path — npm global installs land in AppData\Roaming\npm on Windows
_NPM_BIN = Path(os.environ.get("APPDATA", "")) / "npm"
CLAUDE_CMD = (
    str(_NPM_BIN / "claude.cmd")
    if (_NPM_BIN / "claude.cmd").exists()
    else "claude"
)

BASE_URL = f"https://api.telegram.org/bot{BOT_TOKEN}"

# Daily brief schedule — 24h format, "HH:MM"
BRIEF_TIME = os.getenv("BRIEF_TIME", "09:00")

# ── State ─────────────────────────────────────────────────────────────────────

task_lock   = threading.Lock()
task_active = False                 # True while an agent is running
task_queue  = deque(maxlen=10)      # queued (chat_id, text) pairs

# ── Telegram helpers ──────────────────────────────────────────────────────────

def tg_get(method: str, params: dict = None):
    import urllib.request, urllib.parse
    url = f"{BASE_URL}/{method}"
    if params:
        url += "?" + urllib.parse.urlencode(params)
    try:
        with urllib.request.urlopen(url, timeout=15) as r:
            return json.loads(r.read())
    except Exception as e:
        print(f"[TG GET ERROR] {method}: {e}", file=sys.stderr)
        return None


def tg_post(method: str, data: dict):
    import urllib.request
    url  = f"{BASE_URL}/{method}"
    body = json.dumps(data).encode()
    req  = urllib.request.Request(url, data=body,
                                   headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read())
    except Exception as e:
        print(f"[TG POST ERROR] {method}: {e}", file=sys.stderr)
        return None


def send(chat_id: str, text: str, silent: bool = False):
    """Send a message, splitting at 4000 chars if needed."""
    text = text.strip() or "(no output)"
    chunks = [text[i:i+4000] for i in range(0, len(text), 4000)]
    for chunk in chunks:
        tg_post("sendMessage", {
            "chat_id":              chat_id,
            "text":                 chunk,
            "parse_mode":           "Markdown",
            "disable_notification": silent,
        })


def typing(chat_id: str):
    tg_post("sendChatAction", {"chat_id": chat_id, "action": "typing"})

# ── Agent runner ──────────────────────────────────────────────────────────────

AGENTS = {
    "boss":    "agents/00-boss.md",
    "scout":   "agents/01-scout.md",
    "setter":  "agents/02-setter.md",
    "sales":   "agents/03-sales.md",
    "factory": "agents/04-factory.md",
    "analyst": "agents/05-analyst.md",
    "content": "agents/06-content.md",
}


def run_agent(agent_key: str, prompt: str, timeout: int = 300) -> str:
    """Run a Claude CLI agent synchronously, return output string."""
    agent_file = AGENTS.get(agent_key)
    if not agent_file:
        return f"Unknown agent: {agent_key}"

    agent_path = AGENCY_DIR / agent_file
    if not agent_path.exists():
        return f"Agent file not found: {agent_path}"

    cmd = [CLAUDE_CMD, "-p", agent_path.read_text(encoding="utf-8"), "--print", prompt]

    try:
        result = subprocess.run(
            cmd, capture_output=True, text=True,
            timeout=timeout, cwd=str(WORK_DIR),
        )
        out = result.stdout.strip()
        if result.returncode != 0 and result.stderr:
            return f"Agent error:\n{result.stderr[:800]}"
        return out or "(Agent returned no output)"
    except subprocess.TimeoutExpired:
        return f"Agent timed out after {timeout}s."
    except FileNotFoundError:
        return "ERROR: `claude` CLI not found. Make sure Claude Code is installed and in PATH."
    except Exception as e:
        return f"ERROR: {e}"


def run_os_change(instruction: str, timeout: int = 600) -> str:
    """
    Run Claude Code in the cortexalabs root to make app changes.
    Uses claude --print with the instruction directly (no agent file).
    """
    cmd = [CLAUDE_CMD, "--print", instruction]
    try:
        result = subprocess.run(
            cmd, capture_output=True, text=True,
            timeout=timeout, cwd=str(WORK_DIR),
        )
        out = result.stdout.strip()
        if result.returncode != 0 and result.stderr:
            return f"Error making changes:\n{result.stderr[:800]}"
        return out or "(No output from Claude)"
    except subprocess.TimeoutExpired:
        return "OS change timed out. The task may still be running — check the terminal."
    except FileNotFoundError:
        return "ERROR: `claude` CLI not found."
    except Exception as e:
        return f"ERROR: {e}"

# ── Task dispatcher (background) ──────────────────────────────────────────────

def dispatch(chat_id: str, text: str):
    """
    Route a message to the right handler in a background thread.
    Sets task_active while running; on finish, drains the queue.
    """
    global task_active

    def worker():
        global task_active
        try:
            _route(chat_id, text)
        except Exception as e:
            send(chat_id, f"Unexpected error: {e}")
        finally:
            with task_lock:
                task_active = False
            # Drain one queued task if waiting
            try:
                next_chat, next_text = task_queue.popleft()
                dispatch(next_chat, next_text)
            except IndexError:
                pass

    with task_lock:
        if task_active:
            task_queue.append((chat_id, text))
            send(chat_id,
                 f"_One agent is already running. Your message is queued "
                 f"(position {len(task_queue)})._")
            return
        task_active = True

    t = threading.Thread(target=worker, daemon=True)
    t.start()


def _route(chat_id: str, text: str):
    """Synchronous router — called inside worker thread."""
    text_stripped = text.strip()
    lower = text_stripped.lower()

    # ── /help (no agent needed) ───────────────────────────────────────────────
    if lower == "/help":
        send(chat_id, HELP_TEXT)
        return

    # ── YouTube link detected → Analyst ──────────────────────────────────────
    yt_urls = extract_youtube_urls(text_stripped)
    if yt_urls:
        count = len(yt_urls)
        send(chat_id, f"Detected {count} YouTube link{'s' if count > 1 else ''}. Running Analyst...")
        typing(chat_id)
        for url in yt_urls:
            prompt = f"/analyze-video {url} auto"
            result = run_agent("analyst", prompt, timeout=300)
            send(chat_id, f"*Analysis complete for:*\n{url}\n\n{result}")
        return

    # ── OS change keywords → run Claude in app root ───────────────────────────
    OS_KEYWORDS = [
        "make a change", "make changes", "update the app", "update the ui",
        "change the", "add a", "add the", "fix the", "remove the",
        "refactor", "build a", "create a component", "update component",
        "modify", "edit the code", "update cortexaos", "in the app",
    ]
    if any(kw in lower for kw in OS_KEYWORDS):
        send(chat_id, "Got it — running Claude on the codebase now. I'll notify you when done.")
        typing(chat_id)
        result = run_os_change(text_stripped, timeout=600)
        send(chat_id, f"*Done!* Here's what changed:\n\n{result}")
        return

    # ── Explicit slash commands → Boss agent ─────────────────────────────────
    BOSS_SLASH = {
        "/brief":    "Generate the full morning brief: top priorities, pipeline health, leads needing action, revenue snapshot.",
        "/status":   "Generate a concise status snapshot: pipeline counts, today's activity, anything urgent.",
        "/pipeline": "Full pipeline overview: counts by stage, conversion rates, stalled leads, next actions.",
        "/leads":    "Leads report: new today, hot leads in demo/proposal stage, leads needing follow-up.",
    }
    if lower.startswith("/"):
        cmd = lower.split()[0]
        args = text_stripped[len(cmd):].strip()
        if cmd in BOSS_SLASH:
            typing(chat_id)
            prompt = BOSS_SLASH[cmd]
            if args:
                prompt += f" Additional context: {args}"
            result = run_agent("boss", prompt)
            send(chat_id, result)
            return
        if cmd == "/run":
            agent_key = args.lower().strip().split()[0] if args else ""
            extra     = args[len(agent_key):].strip()
            if agent_key not in AGENTS:
                send(chat_id, f"Unknown agent `{agent_key}`. Options: {', '.join(AGENTS)}")
                return
            typing(chat_id)
            send(chat_id, f"Running *{agent_key}* agent...")
            result = run_agent(agent_key, extra or "Run your standard workflow and report results.")
            send(chat_id, f"*{agent_key.capitalize()} done:*\n\n{result}")
            return
        if cmd == "/brief_time":
            # /brief_time HH:MM  — update schedule at runtime
            new_time = args.strip()
            if re.match(r"^\d{2}:\d{2}$", new_time):
                os.environ["BRIEF_TIME"] = new_time
                send(chat_id, f"Daily brief time updated to *{new_time}*.")
            else:
                send(chat_id, "Usage: /brief_time HH:MM  (e.g. /brief_time 08:30)")
            return
        send(chat_id, f"Unknown command `{cmd}`. Type /help for the full list.")
        return

    # ── Free-form chat → Boss agent ───────────────────────────────────────────
    typing(chat_id)
    prompt = (
        f"The user sent you a free-form message. Respond naturally and helpfully as the "
        f"CortexaLabs Agency OS. If the message implies an action (check leads, run follow-ups, "
        f"generate a brief, etc.) execute it. Here is their message:\n\n\"{text_stripped}\""
    )
    result = run_agent("boss", prompt)
    send(chat_id, result)

# ── YouTube URL detection ─────────────────────────────────────────────────────

YT_PATTERN = re.compile(
    r"(https?://(?:www\.)?(?:youtube\.com/watch\?v=|youtu\.be/)[\w\-?=&%]+)"
)

def extract_youtube_urls(text: str) -> list[str]:
    return YT_PATTERN.findall(text)

# ── Scheduled brief ───────────────────────────────────────────────────────────

def schedule_loop():
    """Runs in a daemon thread. Fires daily brief at BRIEF_TIME."""
    last_fired = None
    while True:
        now    = datetime.now()
        target = os.getenv("BRIEF_TIME", BRIEF_TIME)
        if re.match(r"^\d{2}:\d{2}$", target):
            h, m = int(target[:2]), int(target[3:])
            if now.hour == h and now.minute == m:
                today = now.strftime("%Y-%m-%d")
                if last_fired != today:
                    last_fired = today
                    print(f"[SCHEDULE] Firing daily brief at {target}")
                    dispatch(CHAT_ID, "/brief")
        time.sleep(30)

# ── Help text ─────────────────────────────────────────────────────────────────

HELP_TEXT = """*CortexaLabs Agency OS* 🤖

You can talk to me naturally — just type anything and I'll respond.

*Quick commands:*
/brief — morning brief (priorities, pipeline, revenue)
/status — quick KPI snapshot
/pipeline — pipeline stage overview
/leads — leads needing action
/run [agent] — run scout | setter | sales | analyst | content | factory
/brief\_time HH:MM — change daily brief time (default 09:00)
/help — this message

*Auto-detection:*
• Paste a YouTube link → Analyst runs and stores intelligence
• Say "make a change to..." → Claude edits the codebase and notifies you

*Scheduled:*
Daily brief fires at """ + os.getenv("BRIEF_TIME", BRIEF_TIME) + """ every morning.

_One task runs at a time — extras are queued._"""

# ── Poll loop ─────────────────────────────────────────────────────────────────

def poll_loop():
    print(f"[BOT] Starting — workdir: {WORK_DIR}")
    print(f"[BOT] Daily brief at: {os.getenv('BRIEF_TIME', BRIEF_TIME)}")

    me = tg_get("getMe")
    if me and me.get("ok"):
        print(f"[BOT] Connected as @{me['result'].get('username', '?')}")
    else:
        print("[BOT] WARNING: Could not verify bot token.")

    # Start scheduler thread
    sched_thread = threading.Thread(target=schedule_loop, daemon=True)
    sched_thread.start()

    send(CHAT_ID, "CortexaOS is online. Type /help or just talk to me.")

    offset = None
    while True:
        try:
            params = {"timeout": 4, "allowed_updates": json.dumps(["message"])}
            if offset is not None:
                params["offset"] = offset

            updates = tg_get("getUpdates", params)
            if updates and updates.get("ok"):
                for update in updates.get("result", []):
                    offset = update["update_id"] + 1
                    msg    = update.get("message", {})
                    if not msg:
                        continue

                    chat_id = str(msg.get("chat", {}).get("id", ""))
                    text    = msg.get("text", "").strip()

                    if chat_id != str(CHAT_ID):
                        print(f"[BOT] Ignoring unknown chat_id: {chat_id}")
                        continue

                    if text:
                        print(f"[BOT] Message: {text[:100]}")
                        dispatch(chat_id, text)

        except KeyboardInterrupt:
            print("\n[BOT] Shutting down.")
            break
        except Exception as e:
            print(f"[BOT] Poll error: {e}", file=sys.stderr)

        time.sleep(3)


if __name__ == "__main__":
    poll_loop()
