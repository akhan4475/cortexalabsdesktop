"""
Apify token rotation manager.
Reads up to 10 tokens from .env.local, checks remaining credit via Apify API,
auto-rotates to the next token when current one drops below threshold.

Usage:
  python tools/apify_token.py get      — print active token (rotates if needed)
  python tools/apify_token.py status   — print credit balance for all tokens
  python tools/apify_token.py rotate   — force rotate to next token
"""

import json
import os
import sys
import urllib.request
import urllib.error
from pathlib import Path

ENV_PATH = Path(__file__).parent / ".env.local"
STATE_FILE = Path(__file__).parent.parent / "os-state.json"

ROTATE_BELOW_USD = 0.50  # rotate when remaining credit drops below this


def load_env():
    if not ENV_PATH.exists():
        return {}
    env = {}
    with open(ENV_PATH) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, val = line.partition("=")
            env[key.strip()] = val.strip()
    return env


def get_tokens(env: dict) -> list[str]:
    tokens = []
    for i in range(1, 11):
        t = env.get(f"APIFY_API_TOKEN_{i}", "").strip()
        if t:
            tokens.append(t)
    return tokens


def load_state() -> dict:
    if STATE_FILE.exists():
        with open(STATE_FILE) as f:
            return json.load(f)
    return {}


def save_state(state: dict):
    state_copy = dict(state)
    with open(STATE_FILE, "w") as f:
        json.dump(state_copy, f, indent=2, default=str)


def check_token_credit(token: str) -> dict:
    """Returns {"token_short": "...", "remaining": float, "used": float, "limit": float, "ok": bool}"""
    url = f"https://api.apify.com/v2/users/me?token={token}"
    try:
        req = urllib.request.Request(url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return {"token_short": token[:8] + "...", "remaining": 0.0, "ok": False, "error": str(e)}
    except Exception as e:
        return {"token_short": token[:8] + "...", "remaining": 0.0, "ok": False, "error": str(e)}

    user = data.get("data", {})
    plan = user.get("plan", {})
    usage = user.get("monthlyUsage", {})

    limit = float(plan.get("monthlyUsageCreditUsd", 5.0))
    used = float(usage.get("monthlyUsageCreditUsdTotal", 0.0))
    remaining = max(0.0, limit - used)

    return {
        "token_short": token[:8] + "...",
        "token": token,
        "remaining": round(remaining, 4),
        "used": round(used, 4),
        "limit": round(limit, 4),
        "ok": True,
    }


def get_active_index(state: dict, total: int) -> int:
    return int(state.get("apify_token_index", 0)) % total


def cmd_get(tokens: list[str], state: dict) -> str:
    """Return active token, rotating if needed."""
    if not tokens:
        print("ERROR: No APIFY_API_TOKEN_N found in .env.local", file=sys.stderr)
        sys.exit(1)

    idx = get_active_index(state, len(tokens))

    # Check current token's credit
    info = check_token_credit(tokens[idx])
    if info["ok"] and info["remaining"] < ROTATE_BELOW_USD:
        # Find next token with enough credit
        original_idx = idx
        for _ in range(len(tokens)):
            idx = (idx + 1) % len(tokens)
            next_info = check_token_credit(tokens[idx])
            if next_info["ok"] and next_info["remaining"] >= ROTATE_BELOW_USD:
                print(
                    f"[apify_token] Rotated from slot {original_idx + 1} "
                    f"(${info['remaining']:.2f} left) to slot {idx + 1} "
                    f"(${next_info['remaining']:.2f} left)",
                    file=sys.stderr,
                )
                state["apify_token_index"] = idx
                save_state(state)
                break
        else:
            print(
                f"[apify_token] WARNING: All tokens below ${ROTATE_BELOW_USD} threshold. "
                f"Using slot {idx + 1} anyway.",
                file=sys.stderr,
            )

    return tokens[idx]


def cmd_status(tokens: list[str], state: dict):
    if not tokens:
        print("No APIFY_API_TOKEN_N found in .env.local")
        return
    active_idx = get_active_index(state, len(tokens))
    print(f"{'Slot':<6} {'Token':<14} {'Used':>8} {'Limit':>8} {'Remaining':>10} {'Status'}")
    print("-" * 60)
    for i, token in enumerate(tokens):
        info = check_token_credit(token)
        active_marker = " ← ACTIVE" if i == active_idx else ""
        if info["ok"]:
            status = "OK" if info["remaining"] >= ROTATE_BELOW_USD else "LOW"
            print(
                f"{i+1:<6} {info['token_short']:<14} "
                f"${info['used']:>6.2f}   ${info['limit']:>6.2f}   "
                f"${info['remaining']:>8.2f}   {status}{active_marker}"
            )
        else:
            print(f"{i+1:<6} {info['token_short']:<14} {'ERROR':>36}   {info.get('error','')}{active_marker}")


def cmd_rotate(tokens: list[str], state: dict):
    if not tokens:
        print("No tokens configured.", file=sys.stderr)
        sys.exit(1)
    current = get_active_index(state, len(tokens))
    next_idx = (current + 1) % len(tokens)
    state["apify_token_index"] = next_idx
    save_state(state)
    print(f"Rotated: slot {current + 1} → slot {next_idx + 1}")
    print(tokens[next_idx])


def main():
    env = load_env()

    # Also support legacy single token
    tokens = get_tokens(env)
    if not tokens:
        legacy = env.get("APIFY_API_TOKEN", "").strip()
        if legacy:
            tokens = [legacy]

    state = load_state()

    cmd = sys.argv[1] if len(sys.argv) > 1 else "get"

    if cmd == "get":
        token = cmd_get(tokens, state)
        print(token)
    elif cmd == "status":
        cmd_status(tokens, state)
    elif cmd == "rotate":
        cmd_rotate(tokens, state)
    else:
        print(f"Unknown command: {cmd}. Use: get | status | rotate", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
