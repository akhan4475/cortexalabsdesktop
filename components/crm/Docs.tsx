import React, { useState } from 'react';
import {
  BookOpen, LayoutDashboard, Phone, Wrench,
  Brain, KeyRound, ChevronRight, ChevronDown, Zap,
  GitBranch, Sparkles, LayoutTemplate, Archive, Activity,
  Package, Monitor, Lightbulb, DollarSign, Terminal, BarChart3,
  Radio, Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DocPage { title: string; content: string; }
interface DocSection { id: string; icon: React.ElementType; title: string; color: string; pages: DocPage[]; }

const DOCS: DocSection[] = [
  {
    id: 'start',
    icon: Zap,
    title: 'Getting Started',
    color: '#CD3D35',
    pages: [
      {
        title: 'First-Time Setup',
        content: `CortexaOS is a desktop sales and content system for niche web agencies. Everything runs locally. Your data lives in Supabase.

Step 1: Add your API keys
Go to Credentials in the sidebar. You need:
- Anthropic Claude key (console.anthropic.com) — powers all AI features
- Apify token (console.apify.com) — powers lead scraping
- Twilio credentials — powers your dialer
- AssemblyAI key (optional) — powers call transcription

Step 2: Run the Supabase migration
If you have not already done this, go to your Supabase project > SQL Editor and run the migration file at supabase/migrations/001_unified_schema.sql.

Step 3: Pick your active niche
Use the niche selector in the top header. You have 8 niches: Pool, Roofing, Landscaping, Construction, Concrete, Trades, Painters, Remodelers. Switch between them any time.

Step 4: Scrape your first leads
Go to Lead Scraper, enter search queries, click Start Scrape. Score leads with AI before importing. They land directly in your Pipeline.

Step 5: Set up your content engine
Go to Library, fill your 7 context buckets especially My Voice and My Business. Then use Studio to generate scripts.`
      },
      {
        title: 'Niche Selector',
        content: `The niche selector in the top header filters the entire app to one niche.

When you switch niches:
- Pipeline and Dialer filter to that niche's campaigns and leads
- Studio generates scripts with that niche's context
- Library shows only that niche's context items
- Radar tracks signals for that niche
- Builds and Mockups show only that niche's factory work
- Dashboard metrics include only that niche

Your 8 niches are fixed: Pool, Roofing, Landscaping, Construction, Concrete, Trades, Painters, Remodelers.

Your selection persists across sessions via localStorage.`,
      },
    ],
  },

  {
    id: 'sales',
    icon: GitBranch,
    title: 'Sales',
    color: '#3B82F6',
    pages: [
      {
        title: 'Pipeline (12 Stages)',
        content: `The Pipeline is a horizontal kanban board with 12 stages:

1. Prospect: scraped but not yet contacted
2. Qualified: confirmed they match your ICP
3. DM Sent: first outreach made
4. Replied: they responded
5. Mockup Building: you are building their preview
6. Mockup Sent: preview sent, awaiting feedback
7. Approved: they like the mockup
8. Paid: deal closed and payment received
9. Launched: site is live
10. Review Req.: asked for a Google review
11. Closed: referred others or fully complete
12. Lost: deal did not happen

Moving to Paid: a modal appears asking for the upfront and monthly retainer amounts. Click Log Client to create a client record and track the revenue on your dashboard. Click Skip to just move the stage without logging.

Moving to Lost: a modal appears asking for the objection reason (Price, Timing, Competition, etc.) and optional notes. This data populates the lost breakdown in Analytics.

ICP Score badge: if a lead was scored by Claude in the Scraper, a colored score badge (1-10) appears on the card. Green is 8+, yellow is 5-7, red is below 5.`,
      },
      {
        title: 'Dialer',
        content: `The Dialer uses Twilio Voice SDK for in-browser calls.

Required Twilio setup in Credentials:
- Account SID and Auth Token
- API Key SID and API Secret
- TwiML App SID
- At least one Twilio phone number

Pre-Call Intel: when you select a lead in the right panel, a Pre-Call Intel card shows the lead's rating, review count, whether they have a website, and ICP score. Click Get AI Prep to generate 3 tactical call tips from Claude based on the business profile.

Call flow:
1. Select a campaign, then a lead
2. The phone number auto-fills
3. Hit the green call button
4. After the call, log a disposition and notes
5. Click Submit and Next Lead to advance

Each dial is recorded in your database and shows on the Dashboard performance calendar.`,
      },
      {
        title: 'Lead Scraper',
        content: `The Scraper pulls businesses from Google Maps via Apify.

To scrape:
1. Select or create a campaign
2. Add search queries (e.g. "roofing contractors Denver")
3. Set max results per query
4. Click Start Scrape and wait

After results come in:
- Click Score Leads with AI to have Claude rate each result 1-10 for ICP fit
- Scores consider: rating, review count, whether they have a website, and category match
- Scored leads show ICP badges on import
- Click Import to add all results to your campaign

ICP score logic:
- 8-10: established business, 20+ reviews, existing website, strong rating, clear niche
- 5-7: moderate fit
- 1-4: new business, no reviews, wrong category`,
      },
    ],
  },

  {
    id: 'content',
    icon: Sparkles,
    title: 'Content',
    color: '#8B5CF6',
    pages: [
      {
        title: 'Studio',
        content: `Studio is where you generate short-form video scripts.

To generate scripts:
1. Write a prompt describing what you want (topic, angle, hook idea)
2. Select format: Reel, Carousel, or Story
3. Select count: 1, 2, 3, or 5 scripts
4. Click Generate

Claude reads your Library context (especially My Voice and My Business) to write scripts that match your style and niche.

Each script includes: hook, body, call-to-action, caption, hashtags, and a "why it works" explanation.

Click Save on any script to send it to Script Board in the Idea column. Scripts saved here persist to your Supabase database.

Without an Anthropic key, you get stub responses that show the output structure.`,
      },
      {
        title: 'Script Board',
        content: `Script Board is a 5-stage kanban for tracking your content from idea to posted.

Stages:
1. Idea: scripts saved from Studio, not yet committed
2. Approved: you have reviewed and locked the script
3. Shot: you have filmed the content
4. Edited: content is edited and ready to post
5. Posted: published to your social channels

Stall alert: any script that has been in the same stage for more than 5 days gets a yellow border and an alert icon. This prevents scripts from getting stuck.

Move scripts by clicking the stage label on each card. You can also add scripts directly to any column using the inline add button at the top of each column.`,
      },
      {
        title: 'Library',
        content: `The Library stores the context Claude reads when generating scripts. It has 7 buckets:

1. Video Ideas: raw angles and topics you want to explore
2. Inspiration: reels and posts from creators that performed well — add Instagram or TikTok URLs
3. Expert Brain: your frameworks, methods, and teaching points
4. My Voice: past captions and scripts you have written — the more samples here, the more Claude sounds like you
5. My Business: your niche, avatar description, offer, and positioning
6. Instructions: rules for how Claude should write your content ("Never use em-dashes. Always write in second person.")
7. Feedback: post-mortems from published content

Adding items: click Add Item in any bucket. Choose source type (text, URL, YouTube, Instagram, TikTok). For text, Claude auto-summarizes long content. For URLs, it fetches and stores a summary.

Build My Voice and Expert Brain first. Those two buckets have the most impact on script quality.`,
      },
      {
        title: 'Radar',
        content: `Radar watches hashtags and creator handles for trending content in your niche.

Setup:
1. Go to Radar
2. Add watch items — hashtags like #poolservices or creator handles
3. Set the platform (Instagram or TikTok) for each

The velocity score is calculated as views relative to time since posting, compared to the creator's baseline. Higher score means faster growth.

For each signal you can:
- Script It: opens Studio pre-filled with the signal as inspiration
- Save: stores the signal in your Library as an Inspiration item
- Dismiss: removes it from the feed

Manual signal log: you can also paste URLs or describe signals you found manually using the log form on the right.`,
      },
    ],
  },

  {
    id: 'factory',
    icon: Wrench,
    title: 'Factory',
    color: '#F59E0B',
    pages: [
      {
        title: 'AIW Terminal',
        content: `The AIW Terminal connects CortexaOS to the AIW 2.0 Stack that runs Claude Code for building client websites.

Left panel: shows 15 stack state gates from the AIW 2.0 Stack's stack-state.json. A progress bar shows how far through the full research-to-deploy flow you are. Click any gate to see what it controls.

Right panel: the terminal output area. In the Electron desktop app, this runs a real terminal subprocess with the Claude Code CLI. In the browser, it shows a placeholder.

Quick launch buttons: the 8 most-used stack commands are shown as buttons. Click any to run it in the terminal.

To use the full AIW 2.0 Stack:
1. Open the AIW Terminal
2. Start with /setup to configure credentials
3. Follow the gate progression: /discovery → /score-niches → /research → /pick-niche → etc.

The stack handles niche research, offer crafting, website factory briefing, and content engine deployment.`,
      },
      {
        title: 'Builds',
        content: `Builds tracks every active website build for your clients.

Each build record shows:
- Client name and company
- Current factory stage (1-13)
- Progress bar (percentage complete)
- Site URL (fill in when deployed)
- Notes field for client context

The 13 factory stages are:
1. Intake → 2. Research → 3. SEO → 4. Assets → 5. Strategy → 6. Copy → 7. Brand DNA → 8. Brand Resonance → 9. Hero Image → 10. Build & QA → 11. Deploy → 12. Delivery → 13. Proposal

To create a build: click New Build, enter the client name and company, select the template to use.

To advance a stage: open the build, click Complete Stage once you have finished the work. The stage updates immediately and syncs to Supabase.

Add site URL and notes as you progress. Notes are client-facing context for reference during the build.`,
      },
      {
        title: 'Mockups',
        content: `Mockups shows all leads that are in the Mockup Building or Mockup Sent pipeline stages.

This view is specifically for managing the mockup phase of your sales process. Each card shows:
- Lead name and company
- Current stage (Building or Sent)
- Their website (click to open)
- Rating and review count

Actions from each card:
- Mark Sent: moves the lead from Mockup Building to Mockup Sent
- Approved: moves to the Approved stage (ready to pay)
- Back: steps back one stage

Clicking a card opens the detail panel with a scaled preview iframe of their existing website. Use this during your sales call to show the contrast between their current site and what you can build.`,
      },
    ],
  },

  {
    id: 'intelligence',
    icon: Brain,
    title: 'Intelligence',
    color: '#EC4899',
    pages: [
      {
        title: 'Memory',
        content: `The Memory System stores significant business events so Claude has context about your agency history.

8 memory types:
- Call Summary: key points from a sales call
- Lead Closed: when a prospect becomes a client
- Content Win: a post that performed above expectations
- Factory Complete: a client site delivered
- Post Mortem: what went wrong on a build or post
- Weekly Review: end-of-week reflection
- Decision: a strategic choice you made
- Note: anything else worth remembering

Memories are automatically created when you log calls with notes, mark leads as closed, or complete factory builds. You can also add them manually using the Add Memory button.

Every AI call in CortexaOS includes your last 30 memories as context. The more consistently you log, the more accurate and useful the AI outputs become over time.`,
      },
      {
        title: 'Insights',
        content: `Insights is your AI-powered business advisor. It has 4 tabs:

Daily Brief: click Generate Brief and Claude writes a 3-5 sentence synthesis of what has been happening in your business and what to focus on today. Reads your last 30 memory entries. Run this each morning.

What Is Working: Claude analyzes your pipeline, clients, and content data to identify patterns — which outreach stages convert best, which content formats get traction, which niche segments close fastest.

Patterns: longer-term pattern recognition across your business data. Identifies repeating behaviors, both good and bad.

Ask Anything: a full Claude chat with your business data as context. Type any question about your pipeline, revenue, content strategy, or next moves. Previous messages in the session are included as history.

All tabs require your Anthropic key. Without it you get stub responses.`,
      },
    ],
  },

  {
    id: 'business',
    icon: DollarSign,
    title: 'Business',
    color: '#22C55E',
    pages: [
      {
        title: 'Revenue',
        content: `The Revenue tab is your financial dashboard. It shows:

Top metrics:
- MRR: monthly recurring revenue from all active retainer clients
- ARR: MRR times 12
- Total Upfront: sum of all upfront payments received
- Monthly Revenue: MRR plus the upfront value amortized over the current month
- Active Clients: clients with active status
- Avg LTV/Year: average lifetime value per client based on monthly value

Revenue trend chart: monthly area chart showing upfront and MRR stacked by month for the last 12 months.

Client breakdown table: each client showing close date, upfront paid, monthly retainer, status (active/inactive), and total value.

Revenue data is created when you:
1. Move a lead to Paid in the Pipeline and log the deal amounts in the modal
2. Manually add a client in the Clients tab`,
      },
      {
        title: 'Analytics',
        content: `Analytics has 3 tabs:

Sales tab:
- KPI row: total leads, active pipeline count, paid leads count, lead-to-paid conversion rate
- Pipeline Distribution: bar chart showing how many leads are in each of the 12 stages
- Dials by Week: 8-week bar chart of your call activity
- Revenue by Month: stacked area chart of upfront plus MRR per month
- Lost Lead Analysis: if you have tagged lost leads with objection reasons in the Pipeline, this shows the top objection categories

Content tab:
- Total scripts, scripts this week, posted count, in-pipeline count
- Scripts by Stage: bar chart showing distribution across idea, approved, shot, edited, posted
- Stage Velocity: percentage bars showing what fraction of your scripts are at each stage

Attribution tab:
- Active clients with MRR and ARR roll-ups
- Client table with revenue and close date
- Link columns for connecting content pieces to closed deals (full attribution tracking being built out)`,
      },
      {
        title: 'Clients',
        content: `The Clients tab is the master record for all paying clients.

Each client record has:
- Name and company
- Close date
- Upfront value paid
- Monthly retainer amount
- Monthly retainer start date (for tracking when recurring revenue kicked in)
- Status: active or inactive

Adding clients: you can add a client manually using the Add Client button, or a client record is created automatically when you log a Paid deal in the Pipeline modal.

Editing clients: click any client to open the edit panel. Update any field and save.

Inactive clients: mark a client inactive when a retainer ends. Their monthly value drops out of your MRR calculation but historical data is preserved.`,
      },
    ],
  },

  {
    id: 'system',
    icon: Radio,
    title: 'System',
    color: '#6B7280',
    pages: [
      {
        title: 'Recordings',
        content: `Recordings stores all call recordings made through the Dialer when recording was enabled.

Recordings are organized by campaign. Click a campaign folder to see its recordings.

Each recording shows: lead name, phone number, duration, and date. Click the play button to listen directly in the app.

Transcription: click the microphone icon on any recording to transcribe it with AssemblyAI. The transcription runs in the background and appears below the recording row when complete. Requires your AssemblyAI key in Credentials.

AI Summary: once a transcript is available, click Summarize to have Claude extract: decision maker name, key objections, interest level, main pain points, and next steps. The summary appears below the transcript in a highlighted card.

Rename recordings: click the edit icon to rename a recording's display name. This is useful for recordings made to a direct number where the lead name was not auto-populated.`,
      },
      {
        title: 'Credentials',
        content: `Credentials stores all your API keys securely in Supabase. Keys are tied to your user account via Row Level Security.

Required credentials:
- Anthropic Claude: powers all AI features — script generation, ICP scoring, call prep, insights, summaries
- Apify: powers lead scraping from Google Maps
- Twilio: Account SID, Auth Token, API Key, API Secret, TwiML App SID — powers the in-browser dialer
- Twilio Phone Numbers: add at least one number for outbound calls

Optional credentials:
- AssemblyAI: powers call transcription in the Recordings tab

To add or update a key: click the field, enter the value, click Save. Keys are stored encrypted in your Supabase project.

Never share your Supabase service role key. The anon key is safe for client-side use because Row Level Security restricts access to your own data only.`,
      },
    ],
  },

  {
    id: 'keys',
    icon: KeyRound,
    title: 'API Keys Guide',
    color: '#555555',
    pages: [
      {
        title: 'Which Keys Do What',
        content: `Anthropic Claude (required for AI)
Where to get: console.anthropic.com > API Keys
Used for: script generation, ICP scoring, call prep, daily brief, insights, call summaries, content summarization
Cost: roughly $0.003 per 1000 tokens (haiku) to $0.015 per 1000 tokens (sonnet). Most operations cost under $0.01.

Apify (required for scraping)
Where to get: console.apify.com > Integrations
Used for: lead scraping from Google Maps, content radar monitoring
Cost: pay-per-use. Lead scraping typically costs $0.50-2 per 1000 results.

Twilio (required for Dialer)
Where to get: console.twilio.com
What you need: Account SID, Auth Token, API Key SID, API Secret, TwiML App SID, phone number
Used for: all outbound calls through the Dialer tab

AssemblyAI (optional)
Where to get: assemblyai.com > Dashboard
Used for: transcribing recorded calls
Cost: $0.37 per audio hour`,
      },
      {
        title: 'Security',
        content: `All API keys are stored in your Supabase database in the user_credentials table. Row Level Security ensures only your user account can read your own keys.

Keys are fetched once per session and cached in memory. Restarting the app or signing out clears the cache.

Key cache: the Anthropic key is cached globally in lib/ai.ts. If you update your key in Credentials, call clearKeyCache() or restart the app for the new key to take effect.

Never commit .env.local or any file containing your service role key. The anon key in the app is safe because Supabase RLS limits what it can access.

For production multi-user deployment: enable Supabase Vault for column-level encryption of API keys. For a single-user desktop app, standard RLS is sufficient.`,
      },
    ],
  },
];

// ── Docs component ────────────────────────────────────────────────────────────

const Docs: React.FC = () => {
  const [activeSection, setActiveSection] = useState(DOCS[0].id);
  const [activePage, setActivePage]       = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set([DOCS[0].id]));

  const section = DOCS.find(d => d.id === activeSection)!;
  const page    = section?.pages[activePage];

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectPage = (sectionId: string, pageIdx: number) => {
    setActiveSection(sectionId);
    setActivePage(pageIdx);
    setExpandedSections(prev => new Set([...prev, sectionId]));
  };

  return (
    <div className="flex gap-5 h-full p-5" style={{ minHeight: '600px' }}>
      {/* Sidebar */}
      <div className="w-52 shrink-0 space-y-0.5">
        {DOCS.map(s => {
          const Icon = s.icon;
          const expanded = expandedSections.has(s.id);
          return (
            <div key={s.id}>
              <button
                onClick={() => toggleSection(s.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all ${
                  activeSection === s.id ? 'bg-white/8 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/4'
                }`}
              >
                <Icon size={14} style={{ color: s.color }} className="shrink-0" />
                <span className="text-xs font-semibold flex-1">{s.title}</span>
                {expanded ? <ChevronDown size={11} className="text-gray-600" /> : <ChevronRight size={11} className="text-gray-600" />}
              </button>
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-6 space-y-0.5 py-0.5">
                      {s.pages.map((p, i) => (
                        <button
                          key={i}
                          onClick={() => selectPage(s.id, i)}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all ${
                            activeSection === s.id && activePage === i
                              ? 'font-semibold'
                              : 'text-gray-600 hover:text-gray-300'
                          }`}
                          style={activeSection === s.id && activePage === i ? { color: s.color } : {}}
                        >
                          {p.title}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-[#0c0c0e] border border-white/8 rounded-xl p-6 h-full overflow-y-auto crm-scroll">
          {page ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeSection}-${activePage}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: section.color }}>{section.title}</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-5">{page.title}</h2>
                <div className="space-y-4">
                  {page.content.split('\n\n').map((para, i) => {
                    if (!para.trim()) return null;
                    const lines = para.split('\n');
                    return (
                      <div key={i} className="space-y-1">
                        {lines.map((line, j) => {
                          if (!line.trim()) return null;
                          const isBullet = line.trim().startsWith('-');
                          const isNumbered = /^\d+\./.test(line.trim());
                          const isLabel  = line.includes(':') && !isBullet && !isNumbered && line.split(':')[0].length < 40 && !line.trim().startsWith('Step') && !line.trim().startsWith('For') && !line.trim().startsWith('The') && !line.trim().startsWith('To') && !line.trim().startsWith('Each') && !line.trim().startsWith('All');
                          if (isBullet) {
                            return (
                              <div key={j} className="flex items-start gap-2 pl-2">
                                <span className="text-[#CD3D35] mt-1.5 shrink-0">&#8226;</span>
                                <p className="text-sm text-gray-300 leading-relaxed">{line.replace(/^- /, '')}</p>
                              </div>
                            );
                          }
                          if (isNumbered) {
                            const match = line.match(/^(\d+)\.\s*(.*)/);
                            if (match) {
                              return (
                                <div key={j} className="flex items-start gap-2.5 pl-2">
                                  <span className="text-[10px] font-bold text-[#CD3D35] mt-1 shrink-0 w-4">{match[1]}.</span>
                                  <p className="text-sm text-gray-300 leading-relaxed">{match[2]}</p>
                                </div>
                              );
                            }
                          }
                          if (isLabel) {
                            const colonIdx = line.indexOf(':');
                            const label = line.slice(0, colonIdx);
                            const rest  = line.slice(colonIdx + 1);
                            return (
                              <p key={j} className="text-sm leading-relaxed">
                                <span className="text-white font-semibold">{label}:</span>
                                <span className="text-gray-400">{rest}</span>
                              </p>
                            );
                          }
                          return <p key={j} className="text-sm text-gray-300 leading-relaxed">{line}</p>;
                        })}
                      </div>
                    );
                  })}
                </div>

                {/* Prev / Next navigation */}
                <div className="flex items-center gap-3 mt-8 pt-5 border-t border-white/6">
                  {activePage > 0 && (
                    <button
                      onClick={() => setActivePage(p => p - 1)}
                      className="text-xs text-gray-500 hover:text-white transition-colors"
                    >
                      Previous: {section.pages[activePage - 1].title}
                    </button>
                  )}
                  {activePage < section.pages.length - 1 && (
                    <button
                      onClick={() => setActivePage(p => p + 1)}
                      className="ml-auto flex items-center gap-1 text-xs font-semibold transition-colors hover:text-white"
                      style={{ color: section.color }}
                    >
                      Next: {section.pages[activePage + 1].title} <ChevronRight size={13} />
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600">
              <div className="text-center">
                <BookOpen size={32} className="mx-auto mb-3 text-gray-800" />
                <p className="text-sm">Select a topic from the sidebar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Docs;
