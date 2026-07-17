import React, { useState } from 'react';

type Tab = 'overview' | 'bot' | 'agents' | 'ui' | 'deploy' | 'setup';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'bot',      label: 'Telegram Bot' },
  { id: 'agents',   label: '7 Agents' },
  { id: 'ui',       label: 'CortexaOS UI' },
  { id: 'deploy',   label: 'Deploy' },
  { id: 'setup',    label: 'Pending Setup' },
];

const Code: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <pre className="bg-[#111] border border-[#1E1E1E] rounded-lg px-4 py-3 text-[11px] font-mono text-[#909090] whitespace-pre-wrap leading-relaxed my-3 overflow-x-auto">
    {children}
  </pre>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[9px] font-semibold text-[#383838] uppercase tracking-[0.2em] mt-6 mb-2 first:mt-0">{children}</p>
);

const Card: React.FC<{ accent?: boolean; children: React.ReactNode }> = ({ accent, children }) => (
  <div className={`rounded-xl border p-4 mb-3 ${accent ? 'border-[#CD3D35]/30 bg-[#CD3D35]/5' : 'border-[#1E1E1E] bg-[#111]'}`}>
    {children}
  </div>
);

const Row: React.FC<{ cmd: string; desc: string }> = ({ cmd, desc }) => (
  <div className="flex gap-3 py-2 border-b border-[#1A1A1A] last:border-0 items-baseline">
    <span className="font-mono text-[11px] text-[#EF9F27] min-w-[140px] shrink-0">{cmd}</span>
    <span className="text-[12px] text-[#909090] leading-relaxed">{desc}</span>
  </div>
);

const AgentRow: React.FC<{ num: string; name: string; trigger: string; desc: string }> = ({ num, name, trigger, desc }) => (
  <div className="flex gap-3 py-3 border-b border-[#1A1A1A] last:border-0">
    <span className="font-mono text-[10px] text-[#383838] w-6 shrink-0 mt-0.5">{num}</span>
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-mono text-[11px] text-[#F2F2F2] font-medium">{name}</span>
        <span className="font-mono text-[10px] text-[#383838]">{trigger}</span>
      </div>
      <p className="text-[12px] text-[#909090] leading-relaxed">{desc}</p>
    </div>
  </div>
);

const Step: React.FC<{ n: number; title: string; children: React.ReactNode }> = ({ n, title, children }) => (
  <div className="flex gap-3 mb-5">
    <div className="w-6 h-6 rounded-full bg-[#CD3D35] text-white text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">{n}</div>
    <div className="flex-1">
      <p className="text-[13px] font-medium text-[#F2F2F2] mb-1">{title}</p>
      {children}
    </div>
  </div>
);

const Rule: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
  <div className="border-l-2 border-[#CD3D35] pl-3 mb-3">
    <p className="text-[12px] font-medium text-[#F2F2F2]">{title}</p>
    <p className="text-[11px] text-[#555] mt-0.5">{desc}</p>
  </div>
);

const Instructions: React.FC = () => {
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <div className="h-full flex flex-col bg-[#0A0A0A] overflow-hidden">
      {/* Tab bar */}
      <div className="flex gap-0.5 border-b border-[#1A1A1A] px-6 pt-4 shrink-0">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 text-[11px] font-medium border-b-2 transition-colors ${
              tab === t.id
                ? 'border-[#CD3D35] text-[#F2F2F2]'
                : 'border-transparent text-[#555] hover:text-[#909090]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div>
            <p className="text-[13px] text-[#909090] leading-relaxed mb-5">
              Three layers work together. Data lives in Supabase. Agents read/write it via Python. CortexaOS displays it live.
            </p>
            <Card accent>
              <p className="text-[12px] font-medium text-[#F2F2F2] mb-1">Layer 1 — Context <span className="font-mono text-[10px] text-[#555]">agency-os/context/</span></p>
              <p className="text-[12px] text-[#909090]">8 .md files agents load as working memory: business overview, offer tiers, ICP per niche, voice rules, 14-day outreach sequence, locked decisions, CRM stage definitions.</p>
            </Card>
            <Card accent>
              <p className="text-[12px] font-medium text-[#F2F2F2] mb-1">Layer 2 — Data <span className="font-mono text-[10px] text-[#555]">Supabase</span></p>
              <p className="text-[12px] text-[#909090]">Agents read/write via <code className="font-mono text-[10px] bg-[#1A1A1A] px-1 rounded">tools/db.py</code>. Tables: leads, campaigns, agent_runs, intelligence_items, daily_briefs. CortexaOS subscribes to real-time changes.</p>
            </Card>
            <Card accent>
              <p className="text-[12px] font-medium text-[#F2F2F2] mb-1">Layer 3 — Function <span className="font-mono text-[10px] text-[#555]">Claude CLI agents</span></p>
              <p className="text-[12px] text-[#909090]">7 agents, each a .md file with a full system prompt. Triggered from Telegram, slash commands in Claude, or scheduled. Run via <code className="font-mono text-[10px] bg-[#1A1A1A] px-1 rounded">claude --print</code> from agency-os/ directory.</p>
            </Card>
            <SectionTitle>File locations</SectionTitle>
            <Code>{`cortexalabs/
├── agency-os/
│   ├── CLAUDE.md          ← master OS context (auto-loads)
│   ├── os-state.json      ← gate tracking
│   ├── agents/            ← 7 agent .md files
│   ├── context/           ← 8 business context files
│   ├── skills/            ← 9 skill definitions
│   ├── lessons/           ← ledger.jsonl (learning log)
│   └── tools/
│       ├── db.py          ← Supabase CLI bridge
│       └── .env.local     ← all API keys
├── telegram-bot/
│   └── bot.py             ← the bot
└── .claude/commands/      ← 7 slash shortcuts`}</Code>
          </div>
        )}

        {/* BOT */}
        {tab === 'bot' && (
          <div>
            <div className="rounded-xl border border-[#3b6d11] bg-[#0a1f0a] px-4 py-3 text-[12px] text-[#97c459] mb-5">
              Start: <code className="font-mono text-[11px]">python telegram-bot/bot.py</code> from cortexalabs/ root
            </div>
            <SectionTitle>Commands</SectionTitle>
            <Row cmd="/brief"            desc="Morning brief — priorities, pipeline health, revenue. Runs Boss agent." />
            <Row cmd="/status"           desc="Quick KPI snapshot — counts, today's activity, anything urgent." />
            <Row cmd="/pipeline"         desc="Pipeline overview — counts per stage, conversion, stalled leads." />
            <Row cmd="/leads"            desc="Leads report — new today, hot leads, who needs follow-up." />
            <Row cmd="/run scout"        desc="Run any agent: scout | setter | sales | analyst | content | factory" />
            <Row cmd="/brief_time 08:30" desc="Change daily brief fire time. Default is 09:00 AM." />
            <Row cmd="/reset"            desc="Clear stuck task + queue. Always works — bypasses the lock." />
            <Row cmd="YouTube link"      desc="Paste any YT URL → Analyst auto-runs, stores in intelligence_items, sends summary." />
            <Row cmd="make a change..."  desc="OS keywords → Claude Code runs on the codebase, notifies when done." />
            <Row cmd="anything else"     desc="Free-form chat → Boss agent responds. Short casual messages reply instantly." />
            <SectionTitle>Task queue</SectionTitle>
            <p className="text-[12px] text-[#909090] leading-relaxed">One agent runs at a time. Extra messages queue (max 10). You see "position N". When it finishes, next auto-starts. Send /reset anytime to cancel everything.</p>
            <SectionTitle>Scheduled brief</SectionTitle>
            <p className="text-[12px] text-[#909090] leading-relaxed">Fires at 09:00 AM daily. Runs /brief → Boss agent → sends to Telegram. Also stored in daily_briefs table. Change time with /brief_time.</p>
          </div>
        )}

        {/* AGENTS */}
        {tab === 'agents' && (
          <div>
            <p className="text-[13px] text-[#909090] leading-relaxed mb-4">
              Each agent is a .md file. Trigger from Telegram or open Claude at <code className="font-mono text-[11px] bg-[#1A1A1A] px-1 rounded">cortexalabs/agency-os/</code> and use slash commands.
            </p>
            <Card>
              <AgentRow num="00" name="boss" trigger="/boss · /brief /status /pipeline /leads" desc="Command center. Generates briefs, reads all agent outputs, answers free-form questions. Orchestrates all others." />
              <AgentRow num="01" name="scout" trigger="/scout · /run scout [niche] [city] [count]" desc="Scrapes leads via Apify, scores ICP (no website = +25 pts), only inserts qualified leads. Creates or assigns campaigns." />
              <AgentRow num="02" name="setter" trigger="/setter · /run setter" desc="Manages the 14-day follow-up sequence, writes DM copy per day, tracks follow_up_day, books calls via Cal.com." />
              <AgentRow num="03" name="sales" trigger="/sales · /run sales" desc="Handles inbound reply qualification, stages leads through pipeline, generates pre-call briefs from lead profile." />
              <AgentRow num="04" name="factory" trigger="/factory · /run factory" desc="Tracks active builds in AIW2 repo, updates project status, manages delivery milestones. Links builds to leads." />
              <AgentRow num="05" name="analyst" trigger="/analyst · paste YouTube URL in Telegram" desc="Analyzes YouTube + competitor sites. Extracts tactics, stores in intelligence_items by category." />
              <AgentRow num="06" name="content" trigger="/content · /run content" desc="Writes personal brand scripts for YouTube/Reels. Pulls intel from intelligence_items, applies voice rules." />
            </Card>
            <SectionTitle>Using agents in Claude sessions</SectionTitle>
            <Code>{`# Open Claude at cortexalabs/ root, then use shortcuts:
/boss     → Boss agent context
/scout    → Scout agent context
/analyst  → Analyst agent context
# ...same for setter, sales, factory, content`}</Code>
          </div>
        )}

        {/* UI */}
        {tab === 'ui' && (
          <div>
            <SectionTitle>CortexaOS changes</SectionTitle>
            <Card>
              <p className="text-[12px] font-medium text-[#F2F2F2] mb-1">Nav cleanup</p>
              <p className="text-[12px] text-[#909090]">Removed: Dialer, DM Sender, Marketing, Recordings. Added: Calendar (Cal.com bookings, Upcoming/Past tabs). Active state is now a thin red left border.</p>
            </Card>
            <Card>
              <p className="text-[12px] font-medium text-[#F2F2F2] mb-1">Dashboard redesign</p>
              <p className="text-[12px] text-[#909090]">KPI cards are flat monospace on dark (#111111) surfaces. Pipeline progress bars are 3px. AgentActivity card shows last 10 agent runs with colored badges, refreshes every 30s.</p>
            </Card>
            <Card>
              <p className="text-[12px] font-medium text-[#F2F2F2] mb-1">Insights — Intelligence tab</p>
              <p className="text-[12px] text-[#909090]">Shows all rows from intelligence_items table. Filter by source type (YouTube, competitor) and category. Cards expand inline. Toggle Applied to mark used tactics.</p>
            </Card>
            <Card>
              <p className="text-[12px] font-medium text-[#F2F2F2] mb-1">Real-time pipeline</p>
              <p className="text-[12px] text-[#909090]">Pipeline subscribes to Supabase postgres_changes on the leads table. Stage counts update live when an agent moves a lead — no refresh needed.</p>
            </Card>
            <SectionTitle>New Supabase tables (requires migration 002 + 003)</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['agent_runs', 'One row per agent execution — agent name, command, status, metrics JSON, timestamps.'],
                ['intelligence_items', 'Analyst stores extracted intel — source, category, key_tactics JSON, quality score.'],
                ['daily_briefs', 'Boss writes one per day — full text, metrics snapshot, sent_to_telegram flag.'],
                ['leads (new columns)', 'address, google_maps_url, source, loom_brief, follow_up_day, cal_booking_id, icp_score.'],
              ].map(([title, desc]) => (
                <Card key={title}>
                  <p className="font-mono text-[11px] text-[#F2F2F2] mb-1">{title}</p>
                  <p className="text-[11px] text-[#555]">{desc}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* DEPLOY */}
        {tab === 'deploy' && (
          <div>
            <p className="text-[13px] text-[#909090] leading-relaxed mb-5">
              Desktop and web share the same source. Edit <code className="font-mono text-[11px] bg-[#1A1A1A] px-1 rounded">cortexalabs/</code>, run these 3 commands, both update.
            </p>
            <Step n={1} title="Build React app">
              <Code>{`cd "C:\\Users\\Ayaan\\Desktop\\cortexalabs"\nnpm run build`}</Code>
            </Step>
            <Step n={2} title="Package Electron installer">
              <Code>{`cd "C:\\Users\\Ayaan\\Desktop\\cortexalabs-desktop"\nnpm run dist`}</Code>
            </Step>
            <Step n={3} title="Silent install (updates in-place, no prompts)">
              <Code>{`powershell.exe -NoProfile -Command "& 'C:\\Users\\Ayaan\\Desktop\\cortexalabs-desktop\\dist-electron\\CortexaOS Setup 1.0.0.exe' /S"`}</Code>
            </Step>
            <SectionTitle>Hard rules</SectionTitle>
            <Rule title="Only edit cortexalabs/ — never cortexalabs-desktop/src/" desc="Desktop imports from cortexalabs via @web alias. Same source, both apps." />
            <Rule title="Always run all 3 commands after any change" desc="Even a one-line edit. Otherwise web and desktop diverge." />
            <Rule title="Brand color is #CD3D35 — never introduce #3B82F6 blue" desc="In any CRM component file." />
            <Rule title="No alert() — use inline state feedback" desc="Flash a checkmark, toast, or inline text instead." />
            <Rule title="No new Supabase tables without checking 001_unified_schema.sql" desc="Use localStorage or electronAPI.readAppData/writeAppData when possible." />
          </div>
        )}

        {/* SETUP */}
        {tab === 'setup' && (
          <div>
            <div className="rounded-xl border border-[#854f0b] bg-[#1f140a] px-4 py-3 text-[12px] text-[#ef9f27] mb-5">
              These must be done before the system is fully operational.
            </div>
            <Step n={1} title="Run Supabase migration 002 + 003">
              <p className="text-[12px] text-[#909090] mb-2">Without this, AgentActivity and Intelligence tab show nothing. Agent runs can't log.</p>
              <p className="text-[12px] text-[#909090] mb-2">Go to <strong className="text-[#F2F2F2]">Supabase Dashboard → SQL Editor → New Query</strong> and run each file:</p>
              <Code>{`cortexalabs/supabase/migrations/002_agent_intelligence.sql\ncortexalabs/supabase/migrations/003_scout_lead_columns.sql`}</Code>
            </Step>
            <Step n={2} title="Add Apify API token (Scout agent)">
              <p className="text-[12px] text-[#909090] mb-2">Scout can't scrape leads without it. Get it at apify.com → Settings → Integrations.</p>
              <Code>{`cortexalabs/agency-os/tools/.env.local\n\nAPIPY_API_TOKEN=   ← add your token here`}</Code>
            </Step>
            <Step n={3} title="Populate skill files from YouTube scraping">
              <p className="text-[12px] text-[#909090] mb-2">7 skill files are scaffolded, marked [POPULATE FROM YOUTUBE SCRAPE]:</p>
              <Code>{`dm-copy / loom-personalization / follow-up-sequences\ncall-structure / objection-handling / offer-design / proposal-close`}</Code>
              <p className="text-[12px] text-[#909090]">Paste YouTube links in Telegram → Analyst runs → intel goes to intelligence_items → run Content agent to populate skills.</p>
            </Step>
            <SectionTitle>What's working now</SectionTitle>
            <div className="rounded-xl border border-[#3b6d11] bg-[#0a1f0a] px-4 py-2.5 text-[12px] text-[#97c459] mb-2">Telegram bot — casual replies, YouTube detection, OS change routing, task queue, /reset, scheduled 9AM brief</div>
            <div className="rounded-xl border border-[#3b6d11] bg-[#0a1f0a] px-4 py-2.5 text-[12px] text-[#97c459] mb-2">CortexaOS — redesigned UI, cleaned nav, Calendar view, real-time pipeline, Intelligence tab</div>
            <div className="rounded-xl border border-[#3b6d11] bg-[#0a1f0a] px-4 py-2.5 text-[12px] text-[#97c459]">7 agent .md files + CLAUDE.md + slash commands — all written, ready from any Claude session at cortexalabs/</div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Instructions;
