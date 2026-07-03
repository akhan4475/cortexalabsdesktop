"""
CortexaLabs Agency OS — Supabase bridge CLI
Usage:
  python tools/db.py log <agent> <command> '<metrics_json>'
  python tools/db.py leads list [niche] [limit]
  python tools/db.py leads get <lead_id>
  python tools/db.py leads update <lead_id> '<data_json>'
  python tools/db.py leads insert '<data_json>'
  python tools/db.py campaigns list [niche]
  python tools/db.py campaigns get <campaign_id>
  python tools/db.py intel insert '<data_json>'
  python tools/db.py intel list [category] [limit]
  python tools/db.py brief insert '<data_json>'
  python tools/db.py builds list
  python tools/db.py builds update <build_id> '<data_json>'
  python tools/db.py state get
  python tools/db.py state set '<data_json>'
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

# Load env from tools/.env.local
ENV_PATH = Path(__file__).parent / ".env.local"
if ENV_PATH.exists():
    from dotenv import load_dotenv
    load_dotenv(ENV_PATH)

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://zfjbpohfdoeougmhocfa.supabase.co")
SUPABASE_SERVICE_ROLE_KEY = os.getenv(
    "SUPABASE_SERVICE_ROLE_KEY",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmamJwb2hmZG9lb3VnbWhvY2ZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2MDk0OCwiZXhwIjoyMDgzMjM2OTQ4fQ.Vw6iZe2VJeCM5iR2tolirMvuf2XB-AMMqX16lE26jCQ",
)

STATE_FILE = Path(__file__).parent.parent / "os-state.json"


def get_client():
    try:
        from supabase import create_client
        return create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    except ImportError:
        print("ERROR: supabase package not installed. Run: pip install supabase==2.3.0", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"ERROR: Failed to connect to Supabase: {e}", file=sys.stderr)
        sys.exit(1)


def parse_json_arg(raw: str, label: str = "data") -> dict:
    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"ERROR: Invalid JSON for {label}: {e}", file=sys.stderr)
        sys.exit(1)


def out(data):
    print(json.dumps(data, indent=2, default=str))


# ---------------------------------------------------------------------------
# log
# ---------------------------------------------------------------------------

def cmd_log(args):
    metrics = parse_json_arg(args.metrics_json, "metrics") if args.metrics_json else {}
    client = get_client()
    row = {
        "agent": args.agent,
        "command": args.command,
        "status": "completed",
        "metrics": metrics,
        "completed_at": datetime.now(timezone.utc).isoformat(),
    }
    res = client.table("agent_runs").insert(row).execute()
    out({"ok": True, "inserted": res.data})


# ---------------------------------------------------------------------------
# leads
# ---------------------------------------------------------------------------

def cmd_leads(args):
    client = get_client()
    sub = args.leads_cmd

    if sub == "list":
        q = client.table("leads").select("*")
        if args.niche:
            q = q.eq("niche", args.niche)
        limit = int(args.limit) if args.limit else 50
        q = q.limit(limit)
        res = q.execute()
        out(res.data)

    elif sub == "get":
        res = client.table("leads").select("*").eq("id", args.lead_id).execute()
        if not res.data:
            print(f"ERROR: Lead {args.lead_id} not found", file=sys.stderr)
            sys.exit(1)
        out(res.data[0])

    elif sub == "update":
        data = parse_json_arg(args.data_json, "lead update data")
        data["updated_at"] = datetime.now(timezone.utc).isoformat()
        res = client.table("leads").update(data).eq("id", args.lead_id).execute()
        out({"ok": True, "updated": res.data})

    elif sub == "insert":
        data = parse_json_arg(args.data_json, "lead insert data")
        data.setdefault("created_at", datetime.now(timezone.utc).isoformat())
        res = client.table("leads").insert(data).execute()
        out({"ok": True, "inserted": res.data})

    else:
        print(f"ERROR: Unknown leads subcommand: {sub}", file=sys.stderr)
        sys.exit(1)


# ---------------------------------------------------------------------------
# campaigns
# ---------------------------------------------------------------------------

def cmd_campaigns(args):
    client = get_client()
    sub = args.campaigns_cmd

    if sub == "list":
        q = client.table("campaigns").select("*")
        if args.niche:
            q = q.eq("niche", args.niche)
        res = q.execute()
        out(res.data)

    elif sub == "get":
        res = client.table("campaigns").select("*").eq("id", args.campaign_id).execute()
        if not res.data:
            print(f"ERROR: Campaign {args.campaign_id} not found", file=sys.stderr)
            sys.exit(1)
        out(res.data[0])

    else:
        print(f"ERROR: Unknown campaigns subcommand: {sub}", file=sys.stderr)
        sys.exit(1)


# ---------------------------------------------------------------------------
# intel
# ---------------------------------------------------------------------------

def cmd_intel(args):
    client = get_client()
    sub = args.intel_cmd

    if sub == "insert":
        data = parse_json_arg(args.data_json, "intel insert data")
        data.setdefault("created_at", datetime.now(timezone.utc).isoformat())
        res = client.table("intel").insert(data).execute()
        out({"ok": True, "inserted": res.data})

    elif sub == "list":
        q = client.table("intel").select("*")
        if args.category:
            q = q.eq("category", args.category)
        limit = int(args.limit) if args.limit else 50
        q = q.limit(limit).order("created_at", desc=True)
        res = q.execute()
        out(res.data)

    else:
        print(f"ERROR: Unknown intel subcommand: {sub}", file=sys.stderr)
        sys.exit(1)


# ---------------------------------------------------------------------------
# brief
# ---------------------------------------------------------------------------

def cmd_brief(args):
    client = get_client()
    sub = args.brief_cmd

    if sub == "insert":
        data = parse_json_arg(args.data_json, "brief insert data")
        data.setdefault("created_at", datetime.now(timezone.utc).isoformat())
        res = client.table("briefs").insert(data).execute()
        out({"ok": True, "inserted": res.data})

    else:
        print(f"ERROR: Unknown brief subcommand: {sub}", file=sys.stderr)
        sys.exit(1)


# ---------------------------------------------------------------------------
# builds
# ---------------------------------------------------------------------------

def cmd_builds(args):
    client = get_client()
    sub = args.builds_cmd

    if sub == "list":
        res = client.table("builds").select("*").order("created_at", desc=True).execute()
        out(res.data)

    elif sub == "update":
        data = parse_json_arg(args.data_json, "build update data")
        data["updated_at"] = datetime.now(timezone.utc).isoformat()
        res = client.table("builds").update(data).eq("id", args.build_id).execute()
        out({"ok": True, "updated": res.data})

    else:
        print(f"ERROR: Unknown builds subcommand: {sub}", file=sys.stderr)
        sys.exit(1)


# ---------------------------------------------------------------------------
# state (local JSON file, not Supabase)
# ---------------------------------------------------------------------------

def cmd_state(args):
    sub = args.state_cmd

    if sub == "get":
        if STATE_FILE.exists():
            with open(STATE_FILE) as f:
                out(json.load(f))
        else:
            out({})

    elif sub == "set":
        data = parse_json_arg(args.data_json, "state data")
        # Merge with existing state
        existing = {}
        if STATE_FILE.exists():
            with open(STATE_FILE) as f:
                existing = json.load(f)
        existing.update(data)
        existing["updated_at"] = datetime.now(timezone.utc).isoformat()
        STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(STATE_FILE, "w") as f:
            json.dump(existing, f, indent=2, default=str)
        out({"ok": True, "state": existing})

    else:
        print(f"ERROR: Unknown state subcommand: {sub}", file=sys.stderr)
        sys.exit(1)


# ---------------------------------------------------------------------------
# Argument parser
# ---------------------------------------------------------------------------

def build_parser():
    parser = argparse.ArgumentParser(
        description="CortexaLabs Agency OS — Supabase bridge CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    subs = parser.add_subparsers(dest="cmd", required=True)

    # log
    p_log = subs.add_parser("log", help="Log an agent run to agent_runs table")
    p_log.add_argument("agent", help="Agent name (e.g. scout, setter)")
    p_log.add_argument("command", help="Command that was run")
    p_log.add_argument("metrics_json", nargs="?", default="{}", help="JSON metrics string")

    # leads
    p_leads = subs.add_parser("leads", help="Leads table operations")
    leads_subs = p_leads.add_subparsers(dest="leads_cmd", required=True)

    p_leads_list = leads_subs.add_parser("list")
    p_leads_list.add_argument("niche", nargs="?", help="Filter by niche")
    p_leads_list.add_argument("limit", nargs="?", default="50", help="Max results")

    p_leads_get = leads_subs.add_parser("get")
    p_leads_get.add_argument("lead_id")

    p_leads_upd = leads_subs.add_parser("update")
    p_leads_upd.add_argument("lead_id")
    p_leads_upd.add_argument("data_json")

    p_leads_ins = leads_subs.add_parser("insert")
    p_leads_ins.add_argument("data_json")

    # campaigns
    p_camps = subs.add_parser("campaigns", help="Campaigns table operations")
    camps_subs = p_camps.add_subparsers(dest="campaigns_cmd", required=True)

    p_camps_list = camps_subs.add_parser("list")
    p_camps_list.add_argument("niche", nargs="?")

    p_camps_get = camps_subs.add_parser("get")
    p_camps_get.add_argument("campaign_id")

    # intel
    p_intel = subs.add_parser("intel", help="Intel table operations")
    intel_subs = p_intel.add_subparsers(dest="intel_cmd", required=True)

    p_intel_ins = intel_subs.add_parser("insert")
    p_intel_ins.add_argument("data_json")

    p_intel_list = intel_subs.add_parser("list")
    p_intel_list.add_argument("category", nargs="?")
    p_intel_list.add_argument("limit", nargs="?", default="50")

    # brief
    p_brief = subs.add_parser("brief", help="Briefs table operations")
    brief_subs = p_brief.add_subparsers(dest="brief_cmd", required=True)

    p_brief_ins = brief_subs.add_parser("insert")
    p_brief_ins.add_argument("data_json")

    # builds
    p_builds = subs.add_parser("builds", help="Builds table operations")
    builds_subs = p_builds.add_subparsers(dest="builds_cmd", required=True)

    builds_subs.add_parser("list")

    p_builds_upd = builds_subs.add_parser("update")
    p_builds_upd.add_argument("build_id")
    p_builds_upd.add_argument("data_json")

    # state
    p_state = subs.add_parser("state", help="Read/write local os-state.json")
    state_subs = p_state.add_subparsers(dest="state_cmd", required=True)

    state_subs.add_parser("get")

    p_state_set = state_subs.add_parser("set")
    p_state_set.add_argument("data_json")

    return parser


def main():
    parser = build_parser()
    args = parser.parse_args()

    dispatch = {
        "log": cmd_log,
        "leads": cmd_leads,
        "campaigns": cmd_campaigns,
        "intel": cmd_intel,
        "brief": cmd_brief,
        "builds": cmd_builds,
        "state": cmd_state,
    }

    try:
        dispatch[args.cmd](args)
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
