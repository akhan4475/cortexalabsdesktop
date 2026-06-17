import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Terminal as TerminalIcon,
  RefreshCw, FolderPlus, FilePlus, Check, X,
  ChevronDown, Plus, Hash, GitBranch, Cpu, AlertCircle,
  Square, Send, Pencil, FileText,
} from 'lucide-react';

// ── Niche / project configs ────────────────────────────────────────────────────
interface NicheConfig { id: string; name: string; dir: string; color: string; }

const NICHE_CONFIGS: NicheConfig[] = [
  { id: 'concrete',     name: 'Concrete',     dir: 'C:\\Users\\Ayaan\\Desktop\\AIW2\\Contractors\\AIW2.0STACK-Concrete',     color: '#F97316' },
  { id: 'construction', name: 'Construction', dir: 'C:\\Users\\Ayaan\\Desktop\\AIW2\\Contractors\\AIW2.0STACK-Construction', color: '#3B82F6' },
  { id: 'landscaping',  name: 'Landscaping',  dir: 'C:\\Users\\Ayaan\\Desktop\\AIW2\\Contractors\\AIW2.0STACK-Landscaping',  color: '#22C55E' },
  { id: 'painters',     name: 'Painters',     dir: 'C:\\Users\\Ayaan\\Desktop\\AIW2\\Contractors\\AIW2.0STACK-Painters',     color: '#A855F7' },
  { id: 'pool',         name: 'Pool (Main)',  dir: 'C:\\Users\\Ayaan\\Desktop\\AIW2\\Contractors\\AIW2.0STACK-main-pool',     color: '#06B6D4' },
  { id: 'remodelers',   name: 'Remodelers',   dir: 'C:\\Users\\Ayaan\\Desktop\\AIW2\\Contractors\\AIW2.0STACK-Remodelers',   color: '#F59E0B' },
  { id: 'roofing',      name: 'Roofing',      dir: 'C:\\Users\\Ayaan\\Desktop\\AIW2\\Contractors\\AIW2.0STACK-Roofing',      color: '#CD3D35' },
  { id: 'trades',       name: 'Trades',       dir: 'C:\\Users\\Ayaan\\Desktop\\AIW2\\Contractors\\AIW2.0STACK-Trades',       color: '#6366F1' },
];

// ── Session ────────────────────────────────────────────────────────────────────
interface Session {
  id: string; nicheId: string; nicheName: string; nicheColor: string;
  dir: string; model: string; startedAt: number; label: string;
}

const SK_MODEL = 'aiw_model';
const DEFAULT_DIR = 'C:\\Users\\Ayaan\\Desktop\\AIW2\\Contractors\\AIW2.0STACK-main-pool';

// Gates — only used for computing stack progress, not rendered as a list
const GATES = [
  'setup.complete', 'm1.profileLocked', 'm2a.scoresLocked', 'm2b.researchComplete',
  'm2c.nicheDecided', 'm2d.templateBuilt', 'm3.offerLocked', 'm4.factoryStructureLoaded',
  'm5.factoryBriefLocked', 'factory.tailored', 'factory.deployed', 'm6.engineStructureLoaded',
  'm7.engineBriefLocked', 'engine.deployed', 'engine.contextPasted',
];

const GATE_LABELS: Record<string, string> = {
  'setup.complete': 'Setup', 'm1.profileLocked': 'Profile', 'm2a.scoresLocked': 'Niches scored',
  'm2b.researchComplete': 'Research done', 'm2c.nicheDecided': 'Niche decided',
  'm2d.templateBuilt': 'Template built', 'm3.offerLocked': 'Offer locked',
  'm4.factoryStructureLoaded': 'Factory loaded', 'm5.factoryBriefLocked': 'Factory brief',
  'factory.tailored': 'Factory tailored', 'factory.deployed': 'Factory deployed',
  'm6.engineStructureLoaded': 'Engine loaded', 'm7.engineBriefLocked': 'Engine brief',
  'engine.deployed': 'Engine deployed', 'engine.contextPasted': 'Context pasted',
};

const SLASH_COMMANDS = [
  { cmd: '/start',                  desc: 'View current state'    },
  { cmd: '/setup',                  desc: 'Setup credentials'     },
  { cmd: '/discovery',              desc: 'M1: Student interview' },
  { cmd: '/score-niches',           desc: 'M2A: Score niches'     },
  { cmd: '/research',               desc: 'M2B: Deep research'    },
  { cmd: '/pick-niche',             desc: 'M2C: Choose niche'     },
  { cmd: '/build-niche-template',   desc: 'M2D: Build template'   },
  { cmd: '/craft-offer',            desc: 'M3: Craft offer'       },
  { cmd: '/load-factory-structure', desc: 'M4: Load factory'      },
  { cmd: '/generate-wf-brief',      desc: 'M5: Factory brief'     },
  { cmd: '/generate-ce-brief',      desc: 'M7: Engine brief'      },
  { cmd: '/status',                 desc: 'Full stack status'     },
  { cmd: '/help',                   desc: 'All commands'          },
];

const MODELS = [
  { id: 'sonnet', label: 'Sonnet', badge: 'Balanced' },
  { id: 'opus',   label: 'Opus',   badge: 'Max'      },
  { id: 'haiku',  label: 'Haiku',  badge: 'Fast'     },
];

function timeAgo(ts: number): string {
  const d = Date.now() - ts, m = Math.floor(d / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return days === 1 ? 'yesterday' : `${days}d ago`;
}

function fmtTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

// Sessions persist to %AppData%\CortexaOS\aiw-sessions.json via Electron IPC
const SESSIONS_FILE = 'aiw-sessions.json';
function persistSessions(ss: Session[], currentId: string | null) {
  eAPI()?.writeAppData?.(SESSIONS_FILE, { sessions: ss.slice(0, 30), currentId });
}

function stripAnsi(s: string): string {
  return s
    .replace(/\x1B\[[0-9;]*[A-Za-z]/g, '')
    .replace(/\x1B\][^\x07\x1B]*(?:\x07|\x1B\\)/g, '')
    .replace(/\x1B[()][B0]/g, '')
    .replace(/\r(?!\n)/g, '\n');
}

const isDesktop = typeof window !== 'undefined' && (
  (window as any).electronAPI?.isDesktop === true ||
  (window as any).__ELECTRON__ === true
);
const eAPI = () => (window as any).electronAPI ?? null;
const tAPI = () => (window as any).terminalAPI ?? null;
const dig  = (obj: any, path: string): boolean =>
  path.split('.').reduce((c: any, p: string) => c?.[p], obj) ?? false;

// ── Component ──────────────────────────────────────────────────────────────────
const AIWTerminal: React.FC = () => {
  const termRef  = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<any>(null);
  const fitRef   = useRef<any>(null);
  const [ready, setReady]     = useState(false);
  const [initErr, setInitErr] = useState('');

  const [stackState, setStackState] = useState<any>(null);

  const [sessions, setSessions]               = useState<Session[]>([]);
  const [currentId, setCurrentId]             = useState<string | null>(null);
  const [showNewSession, setShowNewSession]   = useState(false);
  const [selNicheId, setSelNicheId]           = useState(NICHE_CONFIGS[0]?.id ?? '');
  const [newModel, setNewModel]               = useState(() => localStorage.getItem(SK_MODEL) ?? 'sonnet');
  const [sessionName, setSessionName]         = useState('');

  const [editId, setEditId]       = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');

  const [model, setModel]                 = useState(() => localStorage.getItem(SK_MODEL) ?? 'sonnet');
  const [showModelMenu, setShowModelMenu] = useState(false);

  const [inputVal, setInputVal]   = useState('');
  const [showSlash, setShowSlash] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [sideOpen, setSideOpen] = useState(true);
  const [usage, setUsage]       = useState<any>(null);

  // 'idle' | 'saving' | 'saved' | 'error'
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Current dir ref so loadState always reads from the right niche folder
  const currentDirRef  = useRef(DEFAULT_DIR);
  // Rolling transcript buffer (ANSI-stripped) — max 3000 lines, never triggers re-renders
  const transcriptRef  = useRef<string[]>([]);
  const MAX_TRANSCRIPT = 3000;

  const currentSession = sessions.find(s => s.id === currentId) ?? null;

  useEffect(() => {
    if (currentSession) currentDirRef.current = currentSession.dir;
  }, [currentSession?.id]);

  // Load sessions from file on mount
  useEffect(() => {
    if (!isDesktop) return;
    eAPI()?.readAppData?.(SESSIONS_FILE).then((data: any) => {
      if (data?.sessions?.length) {
        setSessions(data.sessions);
        if (data.currentId) {
          setCurrentId(data.currentId);
          const s = data.sessions.find((x: Session) => x.id === data.currentId);
          if (s) currentDirRef.current = s.dir;
        }
      }
    }).catch(() => {});
  }, []);

  // ── Load stack state from the current niche's directory ───────────────────
  const loadState = useCallback(async () => {
    if (!isDesktop) return;
    try {
      const api = eAPI();
      const filePath = `${currentDirRef.current}\\stack-state.json`;
      if (api?.readFile) {
        setStackState(JSON.parse(await api.readFile(filePath)));
      }
    } catch { /* file may not exist yet */ }
  }, []);

  const loadUsage = useCallback(async () => {
    if (!isDesktop) return;
    try {
      const d = await eAPI()?.readClaudeUsage?.(currentDirRef.current);
      if (d) setUsage(d);
    } catch { /* optional */ }
  }, []);

  useEffect(() => { if (isDesktop) { loadState(); loadUsage(); } }, [loadState, loadUsage]);

  // Poll usage every 15 s so the context bar updates as messages are sent
  useEffect(() => {
    if (!isDesktop) return;
    const id = setInterval(loadUsage, 15_000);
    return () => clearInterval(id);
  }, [loadUsage]);

  const send = useCallback((text: string) => { tAPI()?.send(text); }, []);

  // ── Inject session-notes.md if it exists (gives Claude prior context) ──────
  const injectSessionNotes = useCallback(async (dir: string) => {
    try {
      await eAPI()?.readFile?.(`${dir}\\session-notes.md`);
      // File exists — send as context once Claude is ready
      tAPI()?.send(
        `@session-notes.md Please review this session history as context for our work together. Confirm the current stack stage and what we should focus on next.\r`
      );
    } catch { /* no session notes yet, skip silently */ }
  }, []);

  // ── Start a new session ────────────────────────────────────────────────────
  const startSession = useCallback((nicheId: string, modelId: string, label: string) => {
    const niche = NICHE_CONFIGS.find(n => n.id === nicheId);
    if (!niche) return;
    const api = tAPI();
    if (!api) return;

    const s: Session = {
      id:         crypto.randomUUID(),
      nicheId:    niche.id,
      nicheName:  niche.name,
      nicheColor: niche.color,
      dir:        niche.dir,
      model:      modelId,
      startedAt:  Date.now(),
      label:      label.trim() || niche.name,
    };

    setSessions(prev => { const next = [s, ...prev]; persistSessions(next, s.id); return next; });
    setCurrentId(s.id);
    localStorage.setItem(SK_MODEL, modelId);
    setModel(modelId);
    currentDirRef.current = niche.dir;

    const mFlag = modelId !== 'sonnet' ? ` --model ${modelId}` : '';
    api.restart(niche.dir);
    setTimeout(() => api.send(`claude${mFlag}\r`), 600);
    // Inject prior session notes as context (if they exist)
    setTimeout(() => injectSessionNotes(niche.dir), 2500);
    setTimeout(loadState, 3000);
    // Load usage after Claude has had time to write its session file
    setTimeout(loadUsage, 5000);

    setShowNewSession(false);
  }, [loadState, loadUsage, injectSessionNotes]);

  // ── Relaunch an existing session ───────────────────────────────────────────
  const relaunchSession = useCallback((s: Session) => {
    const api = tAPI();
    if (!api) return;
    setCurrentId(s.id);
    setModel(s.model);
    localStorage.setItem(SK_MODEL, s.model);
    persistSessions(sessions, s.id);
    currentDirRef.current = s.dir;
    const mFlag = s.model !== 'sonnet' ? ` --model ${s.model}` : '';
    api.restart(s.dir);
    setTimeout(() => api.send(`claude${mFlag}\r`), 600);
    // Inject prior session notes as context
    setTimeout(() => injectSessionNotes(s.dir), 2500);
    setTimeout(loadState, 3000);
    setTimeout(loadUsage, 5000);
  }, [loadState, loadUsage, sessions, injectSessionNotes]);

  // ── Kill: Ctrl+C twice to stop running process ─────────────────────────────
  const killSession = useCallback(() => {
    send('\x03');
    setTimeout(() => send('\x03'), 100);
  }, [send]);

  // ── Save session notes directly to session-notes.md in project root ────────
  const saveSessionNotes = useCallback(async () => {
    const api = eAPI();
    if (!api || !currentSession) return;
    setSaveStatus('saving');

    try {
      const now   = new Date();
      const pad   = (n: number) => String(n).padStart(2, '0');
      const stamp = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
      const fileStamp = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
      const base  = currentSession.dir;

      // Build the stack progress snapshot for this entry
      let stackSnap = '';
      if (stackState) {
        const done = GATES.filter(k => dig(stackState, k)).map(k => GATE_LABELS[k]);
        const next = GATES.find(k => !dig(stackState, k));
        stackSnap = `**Completed**: ${done.length ? done.join(', ') : 'none'}  \n**Next gate**: ${next ? GATE_LABELS[next] : 'all done'}`;
      }

      // Grab last 2000 chars of transcript (clean, readable excerpt)
      const rawTranscript = transcriptRef.current.join('');
      const excerpt = rawTranscript.length > 2000
        ? '...' + rawTranscript.slice(-2000)
        : rawTranscript;

      // Build the new entry
      const entry = [
        `## ${stamp} — ${currentSession.label} (${currentSession.model})`,
        '',
        stackSnap || '_Stack state unavailable_',
        '',
        '### Transcript excerpt',
        '```',
        excerpt.trim() || '_No transcript recorded_',
        '```',
        '',
        '---',
        '',
      ].join('\n');

      // Read existing session-notes.md or create header
      let existing = '';
      try { existing = await api.readFile?.(`${base}\\session-notes.md`) ?? ''; } catch {}

      const header = existing
        ? ''
        : `# Session Notes: ${currentSession.nicheName}\n\n> Auto-generated by CortexaOS. Claude reads this at the start of each session for context.\n\n---\n\n`;

      await api.writeFile?.(`${base}\\session-notes.md`, header + existing + entry);

      // Also save raw transcript to research/lessons/transcripts/
      if (rawTranscript.trim()) {
        await api.writeFile?.(
          `${base}\\research\\lessons\\transcripts\\session-${fileStamp}.txt`,
          rawTranscript
        ).catch(() => {});
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2500);
    }
  }, [currentSession, stackState]);

  // ── Submit bottom input ────────────────────────────────────────────────────
  const submitInput = useCallback(() => {
    const val = inputVal.trim();
    if (!val) return;
    send(val + '\r');
    setInputVal('');
    setShowSlash(false);
    if (inputRef.current) inputRef.current.style.height = 'auto';
  }, [inputVal, send]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setInputVal(v);
    setShowSlash(v.startsWith('/'));
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  }, []);

  const addFolder = useCallback(async () => {
    const paths = await eAPI()?.openFolder();
    if (paths?.length) paths.forEach((p: string) => send(`@${p} `));
  }, [send]);

  const addFile = useCallback(async () => {
    const paths = await eAPI()?.openFile();
    if (paths?.length) paths.forEach((p: string) => send(`@${p} `));
  }, [send]);

  // ── xterm init ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isDesktop) return;
    const api = tAPI();
    if (!api) { setInitErr('terminalAPI not found'); return; }

    let disposed = false;
    let ro: ResizeObserver | null = null;

    const init = async () => {
      if (!termRef.current || disposed) return;
      try {
        const [{ Terminal }, { FitAddon }] = await Promise.all([
          import('@xterm/xterm'),
          import('@xterm/addon-fit'),
        ]);
        if (disposed || !termRef.current) return;

        const xterm = new Terminal({
          theme: {
            background: '#0A0A0A', foreground: '#E8E8E8',
            cursor: '#CD3D35', cursorAccent: '#0A0A0A',
            selectionBackground: '#CD3D3540',
            black:   '#0A0A0A', brightBlack:   '#4A4A4A',
            red:     '#CD3D35', brightRed:     '#E85550',
            green:   '#22C55E', brightGreen:   '#4ADE80',
            yellow:  '#F59E0B', brightYellow:  '#FCD34D',
            blue:    '#3B82F6', brightBlue:    '#60A5FA',
            magenta: '#A855F7', brightMagenta: '#C084FC',
            cyan:    '#06B6D4', brightCyan:    '#22D3EE',
            white:   '#E8E8E8', brightWhite:   '#FFFFFF',
          },
          fontFamily:        '"Geist Mono","JetBrains Mono",Consolas,monospace',
          fontSize:          13,
          lineHeight:        1.6,
          cursorBlink:       true,
          allowTransparency: true,
          scrollback:        5000,
          padding:           14,
        } as any);

        const fit = new FitAddon();
        xterm.loadAddon(fit);
        xterm.open(termRef.current);
        try { fit.fit(); } catch { /* ignore */ }

        xtermRef.current = xterm;
        fitRef.current   = fit;

        api.onData((d: string) => {
          if (!disposed) {
            xterm.write(d);
            const clean = stripAnsi(d);
            if (clean) {
              transcriptRef.current.push(clean);
              if (transcriptRef.current.length > MAX_TRANSCRIPT)
                transcriptRef.current.splice(0, transcriptRef.current.length - MAX_TRANSCRIPT);
            }
          }
        });
        api.onExit((_c: number) => {
          if (!disposed) {
            xterm.write('\r\n\x1b[33m[Shell exited — click New to start a session]\x1b[0m\r\n');
            setReady(false);
          }
        });
        api.onReady(() => {
          if (!disposed) {
            setReady(true); setInitErr('');
            try { api.resize(xterm.cols, xterm.rows); } catch { /* ignore */ }
          }
        });

        xterm.onData((d: string) => api.send(d));

        ro = new ResizeObserver(() => {
          try { fit.fit(); api.resize(xterm.cols, xterm.rows); } catch { /* ignore */ }
        });
        ro.observe(termRef.current!);

        api.start();
      } catch (e: any) {
        if (!disposed) setInitErr(`Init failed: ${e?.message ?? e}`);
      }
    };

    const t = setTimeout(init, 100);
    return () => {
      disposed = true; clearTimeout(t); ro?.disconnect();
      try { xtermRef.current?.dispose(); } catch { /* ignore */ }
      xtermRef.current = null; fitRef.current = null;
      try { api.removeAll(); } catch { /* ignore */ }
    };
  }, []);

  // ── Derived ────────────────────────────────────────────────────────────────
  const activeM    = MODELS.find(m => m.id === model) ?? MODELS[0];
  const dirShort   = currentSession?.dir?.split('\\').pop() ?? 'no session';
  const slashMatch = showSlash ? SLASH_COMMANDS.filter(c => c.cmd.startsWith(inputVal.toLowerCase())) : [];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-full bg-[#0A0A0A] overflow-hidden relative">

      {/* ── New Session Modal ────────────────────────────────────────────── */}
      {showNewSession && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowNewSession(false); }}
        >
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 w-[360px] shadow-2xl">
            <h3 className="text-[14px] font-semibold text-[#F2F2F2] mb-0.5">New Session</h3>
            <p className="text-[11px] text-[#555] mb-4">Choose a niche project to work in</p>

            <div className="grid grid-cols-2 gap-1.5 mb-4">
              {NICHE_CONFIGS.map(n => (
                <button
                  key={n.id}
                  onClick={() => { setSelNicheId(n.id); setSessionName(n.name); }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all ${
                    selNicheId === n.id
                      ? 'border-[#333] bg-[#1A1A1A] shadow-sm'
                      : 'border-[#1A1A1A] hover:border-[#252525] hover:bg-[#111]'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: n.color }} />
                  <span className={`text-[11px] font-medium truncate ${selNicheId === n.id ? 'text-[#F2F2F2]' : 'text-[#555]'}`}>
                    {n.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="mb-3">
              <p className="text-[10px] text-[#444] mb-1.5">Session name</p>
              <input
                value={sessionName}
                onChange={e => setSessionName(e.target.value)}
                placeholder={NICHE_CONFIGS.find(n => n.id === selNicheId)?.name ?? 'My session'}
                className="w-full bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl px-3 py-2.5 text-[12px] text-[#F2F2F2] placeholder-[#333] focus:outline-none focus:border-[#2A2A2A] transition-colors"
              />
            </div>

            <div className="mb-5">
              <p className="text-[10px] text-[#444] mb-1.5">Model</p>
              <div className="flex gap-1.5">
                {MODELS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setNewModel(m.id)}
                    className={`flex-1 py-2 rounded-xl border text-[10px] font-medium transition-all ${
                      newModel === m.id
                        ? 'border-[#CD3D35] bg-[#1A0F0E] text-[#CD3D35]'
                        : 'border-[#1A1A1A] text-[#555] hover:border-[#252525]'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowNewSession(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#1E1E1E] text-[12px] text-[#555] hover:text-[#909090] hover:border-[#252525] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => startSession(selNicheId, newModel, sessionName)}
                disabled={!selNicheId}
                className="flex-1 py-2.5 rounded-xl bg-[#CD3D35] hover:bg-[#E85550] text-white text-[12px] font-semibold disabled:opacity-40 transition-colors"
              >
                Start Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Left sidebar ─────────────────────────────────────────────────── */}
      {sideOpen && (
        <div className="w-56 shrink-0 border-r border-[#141414] flex flex-col bg-[#0D0D0D]">

          <div className="px-3 pt-3 pb-2 shrink-0">
            <button
              onClick={() => setShowNewSession(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111] hover:bg-[#161616] border border-[#1E1E1E] text-[11px] text-[#909090] hover:text-[#F2F2F2] transition-colors"
            >
              <Plus size={12} className="text-[#CD3D35]" />
              New session
            </button>
          </div>

          {/* Sessions list */}
          {sessions.length > 0 && (
            <div className="px-2 pb-1 shrink-0">
              <p className="text-[9px] text-[#2A2A2A] uppercase tracking-[0.15em] font-semibold px-1 py-1 select-none">Recents</p>
              {sessions.slice(0, 10).map(s => {
                const isCurrent = s.id === currentId;
                return (
                  <div
                    key={s.id}
                    className={`group flex items-center gap-1 px-1 py-1.5 rounded-xl mb-0.5 transition-colors ${
                      isCurrent ? 'bg-[#141414]' : 'hover:bg-[#111]'
                    }`}
                  >
                    {editId === s.id ? (
                      <input
                        value={editLabel}
                        onChange={e => setEditLabel(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            const label = editLabel.trim() || s.nicheName;
                            setSessions(prev => { const next = prev.map(x => x.id === s.id ? { ...x, label } : x); persistSessions(next, currentId); return next; });
                            setEditId(null);
                          }
                          if (e.key === 'Escape') setEditId(null);
                        }}
                        onBlur={() => setEditId(null)}
                        autoFocus
                        className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-1.5 py-0.5 text-[10px] text-[#F2F2F2] focus:outline-none"
                      />
                    ) : (
                      <div className="flex-1 flex items-center gap-2 min-w-0 cursor-pointer" onClick={() => relaunchSession(s)}>
                        <div
                          className={`w-1.5 h-1.5 rounded-full shrink-0 transition-opacity ${isCurrent ? '' : 'opacity-25'}`}
                          style={{ background: s.nicheColor }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className={`text-[10px] font-medium truncate ${isCurrent ? 'text-[#F2F2F2]' : 'text-[#555] group-hover:text-[#909090]'}`}>
                            {s.label}
                          </div>
                          <div className="text-[9px] text-[#2A2A2A]">{timeAgo(s.startedAt)}</div>
                        </div>
                      </div>
                    )}
                    {editId !== s.id && (
                      <button
                        onClick={e => { e.stopPropagation(); setEditId(s.id); setEditLabel(s.label); }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[#1E1E1E] text-[#383838] hover:text-[#909090] transition-all shrink-0"
                      >
                        <Pencil size={8} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="h-px bg-[#141414] mx-3 my-1 shrink-0" />

          {/* ── Usage metrics panel ────────────────────────────────────── */}
          <div className="px-3 py-2 shrink-0 space-y-3">
            <p className="text-[9px] text-[#2A2A2A] uppercase tracking-[0.15em] font-semibold">Usage</p>

            {usage ? (
              <div className="space-y-2.5">

                {/* Context window */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-[#555]">Context window</span>
                    <span className={`text-[9px] font-mono ${
                      usage.contextPct >= 80 ? 'text-red-400' :
                      usage.contextPct >= 50 ? 'text-yellow-500' : 'text-[#555]'
                    }`}>{usage.contextPct}%</span>
                  </div>
                  <div className="h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        usage.contextPct >= 80 ? 'bg-red-500' :
                        usage.contextPct >= 50 ? 'bg-yellow-500' : 'bg-[#CD3D35]'
                      }`}
                      style={{ width: `${usage.contextPct}%` }}
                    />
                  </div>
                  <p className="text-[8px] text-[#2A2A2A] mt-0.5 font-mono">
                    {fmtTokens(usage.contextUsed)} / {fmtTokens(usage.contextLimit)} tokens
                  </p>
                </div>

                {/* 5-hour window */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-[#555]">Last 5 hours</span>
                    <span className="text-[9px] font-mono text-[#555]">{usage.last5HoursMsgs} msgs</span>
                  </div>
                </div>

                {/* Weekly tokens */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-[#555]">This week</span>
                    <span className="text-[9px] font-mono text-[#555]">{fmtTokens(usage.weekTokens)} tok</span>
                  </div>
                </div>

              </div>
            ) : (
              <p className="text-[9px] text-[#252525]">Start a session to see usage</p>
            )}
          </div>

          <div className="h-px bg-[#141414] mx-3 my-1 shrink-0" />

          {/* Slash commands */}
          <div className="flex-1 overflow-y-auto px-2 pb-2" style={{ scrollbarWidth: 'none' }}>
            <p className="text-[9px] text-[#2A2A2A] uppercase tracking-[0.15em] font-semibold px-1 pb-1 pt-1 select-none">Commands</p>
            {SLASH_COMMANDS.map(c => (
              <button
                key={c.cmd}
                onClick={() => send(c.cmd + '\r')}
                className="w-full text-left flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#141414] transition-colors group"
                title={c.desc}
              >
                <Hash size={9} className="text-[#2A2A2A] group-hover:text-[#CD3D35] shrink-0" />
                <span className="text-[10px] text-[#444] group-hover:text-[#F2F2F2] font-mono truncate">{c.cmd}</span>
              </button>
            ))}
          </div>

          {/* Bottom sidebar actions */}
          <div className="px-3 py-2 border-t border-[#141414] shrink-0 space-y-0.5">
            <button
              onClick={saveSessionNotes}
              disabled={!currentSession || saveStatus === 'saving'}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${
                saveStatus === 'saved'  ? 'text-green-400 bg-green-500/8' :
                saveStatus === 'error'  ? 'text-red-400 bg-red-500/8' :
                saveStatus === 'saving' ? 'text-[#555]' :
                'text-[#2A2A2A] hover:text-[#CD3D35] hover:bg-[#141414]'
              }`}
              title="Write session notes to session-notes.md in the project root"
            >
              <FileText size={10} />
              {saveStatus === 'saving' ? 'Saving...' :
               saveStatus === 'saved'  ? 'Saved' :
               saveStatus === 'error'  ? 'Error saving' :
               'Save session notes'}
            </button>
            <button
              onClick={() => { loadState(); loadUsage(); }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] text-[#2A2A2A] hover:text-[#909090] hover:bg-[#141414] transition-colors"
            >
              <RefreshCw size={10} />
              Refresh state
            </button>
          </div>
        </div>
      )}

      {/* ── Main area ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div className="flex items-center justify-between px-4 h-10 border-b border-[#141414] shrink-0 bg-[#0A0A0A]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSideOpen(v => !v)}
              className="p-1 rounded-lg text-[#2A2A2A] hover:text-[#909090] hover:bg-[#141414] transition-colors"
            >
              <TerminalIcon size={13} />
            </button>
            <div className="flex items-center gap-1.5 text-[12px]">
              <span className="text-[#444]">cortexaos</span>
              <span className="text-[#222]">/</span>
              <span className="font-medium" style={{ color: currentSession?.nicheColor ?? '#F2F2F2' }}>
                {currentSession?.label ?? 'AIW Stack'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 text-[10px] ${ready ? 'text-[#444]' : 'text-yellow-500/50'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${ready ? 'bg-green-500' : 'bg-yellow-500/50 animate-pulse'}`} />
              {ready ? 'ready' : 'starting'}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#2A2A2A]">
              <GitBranch size={10} />
              <span className="font-mono">{dirShort}</span>
            </div>
            <button
              onClick={killSession}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#111] hover:bg-[#1A1A1A] border border-[#1E1E1E] text-[#444] hover:text-[#E85550] text-[11px] transition-colors"
              title="Interrupt (Ctrl+C)"
            >
              <Square size={9} fill="currentColor" />
              Kill
            </button>
            <button
              onClick={() => setShowNewSession(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#CD3D35] hover:bg-[#E85550] text-white text-[11px] font-semibold transition-colors"
            >
              <Plus size={10} />
              New
            </button>
          </div>
        </div>

        {/* xterm area */}
        <div className="flex-1 min-h-0 relative">
          {!isDesktop ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
              <TerminalIcon size={40} className="text-[#1A1A1A]" />
              <div>
                <p className="text-[13px] text-[#383838] font-medium mb-1">Desktop only</p>
                <p className="text-[11px] text-[#252525]">Launch the CortexaOS desktop app to use this terminal.</p>
              </div>
            </div>
          ) : initErr ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 p-8 text-center">
              <AlertCircle size={28} className="text-red-400/30" />
              <p className="text-[13px] text-[#383838]">Terminal failed to initialize</p>
              <p className="text-[11px] text-red-400/50 font-mono max-w-sm">{initErr}</p>
            </div>
          ) : (
            <div ref={termRef} className="absolute inset-0" />
          )}
        </div>

        {/* Bottom input area */}
        <div className="border-t border-[#141414] bg-[#0A0A0A] shrink-0">

          {/* Slash autocomplete */}
          {showSlash && slashMatch.length > 0 && (
            <div className="border-b border-[#141414] max-h-40 overflow-y-auto bg-[#0D0D0D]">
              {slashMatch.map(c => (
                <button
                  key={c.cmd}
                  onClick={() => { setInputVal(c.cmd); setShowSlash(false); inputRef.current?.focus(); }}
                  className="w-full text-left flex items-center justify-between px-4 py-2 hover:bg-[#111] transition-colors"
                >
                  <span className="text-[11px] text-[#F2F2F2] font-mono">{c.cmd}</span>
                  <span className="text-[10px] text-[#444]">{c.desc}</span>
                </button>
              ))}
            </div>
          )}

          <div className="px-4 py-3">
            <div className="flex items-end gap-3 bg-[#0F0F0F] border border-[#1E1E1E] rounded-2xl px-4 py-3 focus-within:border-[#2A2A2A] transition-colors">
              <textarea
                ref={inputRef}
                value={inputVal}
                rows={1}
                onChange={handleInputChange}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitInput(); }
                  if (e.key === 'Escape') setShowSlash(false);
                  if (e.key === 'Tab' && slashMatch.length > 0) {
                    e.preventDefault();
                    setInputVal(slashMatch[0].cmd);
                    setShowSlash(false);
                  }
                }}
                placeholder="Talk to Claude…"
                className="flex-1 bg-transparent text-[13px] text-[#E8E8E8] placeholder-[#2A2A2A] focus:outline-none font-sans resize-none leading-relaxed"
                style={{ minHeight: '22px', maxHeight: '120px' }}
              />
              <button
                onClick={submitInput}
                disabled={!inputVal.trim()}
                className="p-2 rounded-xl bg-[#CD3D35] hover:bg-[#E85550] disabled:opacity-20 disabled:cursor-not-allowed text-white transition-colors shrink-0"
              >
                <Send size={13} />
              </button>
            </div>

            {/* Sub-row */}
            <div className="flex items-center justify-between mt-2.5 px-0.5">
              <div className="flex items-center gap-0.5">
                <button
                  onClick={addFolder}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#141414] text-[#2A2A2A] hover:text-[#909090] transition-colors"
                  title="Add folder to context"
                >
                  <FolderPlus size={12} />
                  <span className="text-[10px] hidden sm:block">Folder</span>
                </button>
                <button
                  onClick={addFile}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#141414] text-[#2A2A2A] hover:text-[#909090] transition-colors"
                  title="Add file to context"
                >
                  <FilePlus size={12} />
                  <span className="text-[10px] hidden sm:block">File</span>
                </button>
                <div className="w-px h-3 bg-[#1A1A1A] mx-1" />
                {/* Accept — sends Enter (or y+Enter for y/n prompts) */}
                <button
                  onClick={() => send('y\r')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-500/8 hover:bg-green-500/15 border border-green-500/15 text-green-400 text-[10px] font-medium transition-colors"
                  title="Accept (sends y + Enter)"
                >
                  <Check size={10} />
                  Accept
                </button>
                {/* Decline — sends n+Enter */}
                <button
                  onClick={() => send('n\r')}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#141414] text-[#2A2A2A] hover:text-[#E85550] text-[10px] transition-colors ml-0.5"
                  title="Decline (sends n + Enter)"
                >
                  <X size={11} />
                  No
                </button>
              </div>

              <div className="flex items-center gap-2">
                {usage?.contextPct != null && (
                  <span className={`text-[10px] font-mono ${
                    usage.contextPct >= 80 ? 'text-red-400/70' :
                    usage.contextPct >= 50 ? 'text-yellow-500/70' : 'text-[#2A2A2A]'
                  }`}>ctx {usage.contextPct}%</span>
                )}
                <div className="relative">
                  <button
                    onClick={() => setShowModelMenu(v => !v)}
                    className="flex items-center gap-1.5 text-[10px] text-[#444] hover:text-[#909090] transition-colors"
                  >
                    <Cpu size={10} />
                    <span>{activeM.label} · {activeM.badge}</span>
                    <ChevronDown size={9} className={`transition-transform ${showModelMenu ? 'rotate-180' : ''}`} />
                  </button>
                  {showModelMenu && (
                    <div className="absolute bottom-full right-0 mb-2 w-44 bg-[#111] border border-[#222] rounded-xl overflow-hidden shadow-2xl z-30">
                      {MODELS.map(m => (
                        <button
                          key={m.id}
                          onClick={() => { setModel(m.id); localStorage.setItem(SK_MODEL, m.id); setShowModelMenu(false); }}
                          className={`w-full text-left flex items-center justify-between px-3 py-2.5 hover:bg-[#161616] transition-colors ${m.id === model ? 'bg-[#161616]' : ''}`}
                        >
                          <span className={`text-[11px] font-medium ${m.id === model ? 'text-[#CD3D35]' : 'text-[#F2F2F2]'}`}>{m.label}</span>
                          <span className="text-[9px] text-[#444]">{m.badge}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIWTerminal;
