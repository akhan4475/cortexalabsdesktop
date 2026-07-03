Run the Sales agent — reply qualification, stage updates, pre-call briefs.

Usage: /sales /qualify-reply [lead_id] "[reply]" | /pre-call-brief [lead_id] | /objection [lead_id] "[text]" | /closed-won [lead_id] [amount]

```bash
claude -p "$(cat agency-os/agents/03-sales.md)" --print "$ARGUMENTS"
```
