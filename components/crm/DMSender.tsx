import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare, Plus, X, CheckCircle2, XCircle, AlertCircle, Loader2,
  ExternalLink, Shield, Wifi, User, Trash2, LogIn, Activity,
  Play, StopCircle, Info, Search, Users, ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Campaign, Lead } from './types';

// ── Types ─────────────────────────────────────────────────────────────────────
interface IGAccount {
  id:         string;
  username:   string;
  proxyHost:  string;
  proxyPort:  number | string;
  proxyUser:  string;
  proxyPass:  string;
  status:     'active' | 'needs_login' | 'restricted' | 'banned';
  dailySent:  number;
  dailyLimit: number;
  lastReset:  string;
}

interface IGResult {
  handle:      string;
  displayName: string;
  followers:   number;
  bio:         string;
  profileUrl:  string;
  keyword:     string;
}

interface FeedEvent {
  id:        string;
  type:      string;
  timestamp: number;
  message:   string;
  level:     'info' | 'success' | 'error' | 'warn';
}

interface CampaignProgress {
  total:   number;
  sent:    number;
  failed:  number;
  skipped: number;
  running: boolean;
}

interface Props {
  campaigns:           Campaign[];
  allLeads:            Lead[];
  onUpdateLeadStatus:  (leadId: string, status: string) => void;
  onAddLead:           (lead: Lead) => void;
  onAddCampaign:       (campaign: Campaign, leads: Lead[]) => void;
}

// ── dmAPI binding ─────────────────────────────────────────────────────────────
const dmAPI = (window as any).dmAPI as {
  chromeCheck:   () => Promise<{ found: boolean; path: string }>;
  loadAccounts:  () => Promise<IGAccount[]>;
  saveAccount:   (a: IGAccount) => Promise<IGAccount[]>;
  removeAccount: (id: string)   => Promise<IGAccount[]>;
  testProxy:     (a: IGAccount) => Promise<{ ok: boolean; ip?: string; error?: string }>;
  login:         (a: IGAccount) => Promise<{ success: boolean; error?: string }>;
  scrapeHandles: (accountId: string, keyword: string, max: number) => Promise<{ success: boolean; results?: IGResult[]; keyword?: string; error?: string }>;
  startCampaign: (c: any)       => Promise<{ started: boolean }>;
  stopCampaign:  ()             => Promise<{ stopped: boolean }>;
  onEvent:       (cb: (e: any) => void) => any;
  offEvent:      (h: any)       => void;
} | undefined;

const isElectron = typeof dmAPI !== 'undefined';

// ── Helpers ───────────────────────────────────────────────────────────────────
function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

const DM_SENT_STATUSES = new Set([
  'dm_sent','dm_replied','dm_interested','dm_mockup_building',
  'dm_mockup_sent','dm_approved','dm_paid','dm_launched','dm_lost',
]);

function getIGHandle(lead: Lead): string | undefined {
  if ((lead as any).igHandle) return (lead as any).igHandle;
  if (lead.website?.includes('instagram.com')) {
    const m = lead.website.match(/instagram\.com\/([^/?#\s]+)/);
    if (m && m[1]) return m[1];
  }
  return undefined;
}

function statusColor(s: IGAccount['status']) {
  if (s === 'active')      return '#22C55E';
  if (s === 'needs_login') return '#F59E0B';
  if (s === 'restricted')  return '#F97316';
  return '#EF4444';
}
function statusLabel(s: IGAccount['status']) {
  if (s === 'active')      return 'Active';
  if (s === 'needs_login') return 'Needs Login';
  if (s === 'restricted')  return 'Restricted';
  return 'Banned';
}
function fmtFollowers(n: number): string {
  if (!n) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}
const blankAccount = (): IGAccount => ({
  id: uid(), username: '', proxyHost: '', proxyPort: '',
  proxyUser: '', proxyPass: '', status: 'needs_login',
  dailySent: 0, dailyLimit: 25, lastReset: '',
});

// ── Proxy Guide ───────────────────────────────────────────────────────────────
const ProxyGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
    className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl p-5 mb-4">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Shield size={14} className="text-[#CD3D35]" />
        <p className="text-xs font-semibold text-[#F2F2F2]">Proxy Setup Guide (IPRoyal)</p>
      </div>
      <button onClick={onClose} className="text-[#555] hover:text-[#909090]"><X size={13} /></button>
    </div>
    <ol className="space-y-3">
      {[
        { n:1, t:'Sign up at iproyal.com', b:'Go to iproyal.com → Residential Proxies. Create an account.' },
        { n:2, t:'Buy sticky residential IPs', b:'Select Session Type: Sticky. Buy one sub-user per IG account (4–6 recommended).' },
        { n:3, t:'Create a sub-user per account', b:'Dashboard → Users → Create User. Unique username + password per account. Different country/state per user.' },
        { n:4, t:'Get proxy credentials', b:'Host: geo.iproyal.com, Port: 12321, Username: sub-user, Password: sub-pass.' },
        { n:5, t:'Paste into each account below', b:'Add each IG account with its proxy creds. Test connection before logging in.' },
      ].map(s => (
        <li key={s.n} className="flex gap-3">
          <span className="w-5 h-5 rounded-full bg-[#CD3D35]/15 text-[#CD3D35] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{s.n}</span>
          <div>
            <p className="text-[11px] font-semibold text-[#F2F2F2] mb-0.5">{s.t}</p>
            <p className="text-[10px] text-[#909090] leading-relaxed">{s.b}</p>
          </div>
        </li>
      ))}
    </ol>
    <a href="https://iproyal.com/residential-proxies/" target="_blank" rel="noopener noreferrer"
      className="mt-4 flex items-center gap-1.5 text-[11px] text-[#CD3D35] hover:underline">
      Open IPRoyal <ExternalLink size={10} />
    </a>
  </motion.div>
);

// ── Account Form ──────────────────────────────────────────────────────────────
const AccountForm: React.FC<{ onSave: (a: IGAccount) => void; onCancel: () => void }> = ({ onSave, onCancel }) => {
  const [form, setForm] = useState<IGAccount>(blankAccount());
  const f = (k: keyof IGAccount, v: any) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl p-4 mb-4">
      <p className="text-xs font-semibold text-[#F2F2F2] mb-3">Add Instagram Account</p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="col-span-2">
          <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1">Instagram Username</label>
          <input value={form.username} onChange={e => f('username', e.target.value.replace('@',''))} placeholder="yourhandle"
            className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs text-[#F2F2F2] placeholder-[#555] focus:outline-none focus:border-[#CD3D35]/50" />
        </div>
        {[['proxyHost','Proxy Host','geo.iproyal.com'],['proxyPort','Proxy Port','12321'],['proxyUser','Proxy Username','sub-user-1'],['proxyPass','Proxy Password','••••••••']].map(([k,l,ph]) => (
          <div key={k}>
            <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1">{l}</label>
            <input type={k === 'proxyPass' ? 'password' : 'text'} value={(form as any)[k]} onChange={e => f(k as any, e.target.value)} placeholder={ph}
              className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs text-[#F2F2F2] placeholder-[#555] focus:outline-none focus:border-[#CD3D35]/50" />
          </div>
        ))}
        <div>
          <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1">Daily DM Limit</label>
          <input type="number" min={5} max={50} value={form.dailyLimit} onChange={e => f('dailyLimit', Number(e.target.value))}
            className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs text-[#F2F2F2] focus:outline-none focus:border-[#CD3D35]/50" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => { if (form.username.trim()) onSave(form); }}
          className="flex-1 bg-[#CD3D35] text-white text-xs py-1.5 rounded font-medium hover:bg-red-600 transition-colors">
          Save Account
        </button>
        <button onClick={onCancel} className="px-4 py-1.5 text-xs text-[#555] hover:text-[#909090] transition-colors">Cancel</button>
      </div>
    </div>
  );
};

// ── Account Card ──────────────────────────────────────────────────────────────
const AccountCard: React.FC<{
  account: IGAccount; onLogin: () => void; onRemove: () => void; onTest: () => void;
  testing: boolean; logging: boolean; testResult?: { ok: boolean; ip?: string; error?: string };
}> = ({ account, onLogin, onRemove, onTest, testing, logging, testResult }) => {
  const color = statusColor(account.status);
  const today = new Date().toDateString();
  const sent  = account.lastReset === today ? account.dailySent : 0;
  return (
    <div className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
            style={{ background: color + '20', color }}>
            {account.username.slice(0,2).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-semibold text-[#F2F2F2]">@{account.username}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              <span className="text-[10px]" style={{ color }}>{statusLabel(account.status)}</span>
            </div>
          </div>
        </div>
        <button onClick={onRemove} className="p-1 rounded text-[#555] hover:text-red-400 hover:bg-red-500/10 transition-colors">
          <Trash2 size={11} />
        </button>
      </div>
      <div className="flex items-center gap-3 mb-3 text-[10px] text-[#555] font-mono">
        <span><span className="text-[#F2F2F2]">{sent}</span>/{account.dailyLimit} today</span>
        {account.proxyHost && <span className="flex items-center gap-1"><Shield size={9} />{account.proxyHost}:{account.proxyPort}</span>}
      </div>
      {testResult && (
        <div className={`flex items-center gap-1.5 text-[10px] mb-2 px-2 py-1 rounded ${testResult.ok ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {testResult.ok ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
          {testResult.ok ? `Connected — IP: ${testResult.ip}` : testResult.error}
        </div>
      )}
      <div className="flex gap-1.5">
        {account.status === 'needs_login' && (
          <button onClick={onLogin} disabled={logging}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-medium bg-[#F59E0B]/15 text-[#F59E0B] hover:bg-[#F59E0B]/25 transition-colors disabled:opacity-50">
            {logging ? <Loader2 size={10} className="animate-spin" /> : <LogIn size={10} />} Login
          </button>
        )}
        <button onClick={onTest} disabled={testing || !account.proxyHost}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-medium bg-[#2A2A2A] text-[#909090] hover:text-[#F2F2F2] transition-colors disabled:opacity-40">
          {testing ? <Loader2 size={10} className="animate-spin" /> : <Wifi size={10} />} Test Proxy
        </button>
      </div>
    </div>
  );
};

// ── Feed Row ──────────────────────────────────────────────────────────────────
const FeedRow: React.FC<{ event: FeedEvent }> = ({ event }) => {
  const colors = { info:'#909090', success:'#22C55E', error:'#EF4444', warn:'#F59E0B' };
  const icons  = { info:<Activity size={10}/>, success:<CheckCircle2 size={10}/>, error:<XCircle size={10}/>, warn:<AlertCircle size={10}/> };
  const color  = colors[event.level];
  return (
    <div className="flex items-start gap-2.5 py-1.5 border-b border-[#111] last:border-0">
      <span className="shrink-0 mt-0.5" style={{ color }}>{icons[event.level]}</span>
      <p className="text-[11px] leading-relaxed"
        style={{ color: event.level==='success' ? '#D1FAE5' : event.level==='error' ? '#FCA5A5' : '#909090' }}>
        {event.message}
      </p>
      <span className="ml-auto text-[9px] text-[#383838] font-mono shrink-0">
        {new Date(event.timestamp).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit', second:'2-digit' })}
      </span>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
type Tab = 'accounts' | 'find' | 'campaign' | 'feed';

const DMSender: React.FC<Props> = ({ campaigns, allLeads, onUpdateLeadStatus, onAddLead, onAddCampaign }) => {
  const [tab, setTab]             = useState<Tab>('accounts');
  const [accounts, setAccounts]   = useState<IGAccount[]>([]);
  const [chromeOk, setChromeOk]   = useState<boolean | null>(null);
  const [showForm, setShowForm]   = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [loggingId, setLoggingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  // ── Find Leads state ──────────────────────────────────────────────────────
  const [findKeyword, setFindKeyword]         = useState('');
  const [findAccountId, setFindAccountId]     = useState('');
  const [findMax, setFindMax]                 = useState(20);
  const [scraping, setScraping]               = useState(false);
  const [scrapeMsg, setScrapeMsg]             = useState('');
  const [scrapeProgress, setScrapeProgress]   = useState<{ current: number; total: number } | null>(null);
  const [igResults, setIgResults]             = useState<IGResult[]>([]);
  const [selectedHandles, setSelectedHandles] = useState<Set<string>>(new Set());
  const [filterLarge, setFilterLarge]         = useState(true);
  const [addCampaignId, setAddCampaignId]     = useState('');
  const [newCampaignName, setNewCampaignName] = useState('');
  const [addingLeads, setAddingLeads]         = useState(false);

  // ── Campaign state ────────────────────────────────────────────────────────
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [messageTemplate, setMessageTemplate]       = useState('Hey {{name}}, saw {{company}} on Instagram — we build websites for businesses like yours. Mind if I show you a free mockup?');
  const [delayMin, setDelayMin] = useState(25);
  const [delayMax, setDelayMax] = useState(55);
  const [running, setRunning]   = useState(false);

  // ── Feed state ────────────────────────────────────────────────────────────
  const [feedEvents, setFeedEvents] = useState<FeedEvent[]>([]);
  const [progress, setProgress]     = useState<CampaignProgress>({ total:0, sent:0, failed:0, skipped:0, running:false });
  const feedRef         = useRef<HTMLDivElement>(null);
  const eventHandlerRef = useRef<any>(null);

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isElectron) return;
    dmAPI!.chromeCheck().then(r => setChromeOk(r.found));
    dmAPI!.loadAccounts().then(setAccounts);
    eventHandlerRef.current = dmAPI!.onEvent(handleDMEvent);
    return () => { if (eventHandlerRef.current) dmAPI!.offEvent(eventHandlerRef.current); };
  }, []);

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [feedEvents]);

  // ── DM event handler ──────────────────────────────────────────────────────
  const handleDMEvent = useCallback((raw: any) => {
    const addEvent = (message: string, level: FeedEvent['level']) =>
      setFeedEvents(prev => [...prev, { id: uid(), type: raw.type, timestamp: Date.now(), message, level }]);

    switch (raw.type) {
      case 'scrape_status':
        setScrapeMsg(raw.message);
        break;
      case 'scrape_progress':
        setScrapeProgress({ current: raw.current, total: raw.total });
        setScrapeMsg(`Checking ${raw.current}/${raw.total}: ${raw.handle}`);
        break;
      case 'info':
        addEvent(raw.message, 'info');
        break;
      case 'campaign_start':
        setRunning(true);
        setProgress({ total: raw.totalLeads, sent:0, failed:0, skipped:0, running:true });
        addEvent(`Campaign started — ${raw.totalLeads} leads across ${raw.accountCount} accounts${raw.alreadySent ? ` (${raw.alreadySent} already contacted, skipped)` : ''}`, 'info');
        setTab('feed');
        break;
      case 'campaign_complete':
        setRunning(false);
        setProgress(p => ({ ...p, running:false }));
        addEvent('Campaign complete.', 'success');
        break;
      case 'account_started':
        addEvent(`@${raw.username} launched — ${raw.leadCount} leads assigned`, 'info');
        break;
      case 'account_needs_login':
        addEvent(`@${raw.username} needs to log in — skipping`, 'warn');
        setAccounts(prev => prev.map(a => a.id === raw.accountId ? { ...a, status: 'needs_login' } : a));
        break;
      case 'account_limit_reached':
        addEvent(`@${raw.username} hit daily limit of ${raw.limit}`, 'warn');
        break;
      case 'account_error':
        addEvent(`@${raw.username} error: ${raw.error}`, 'error');
        break;
      case 'sending':
        addEvent(`Sending to @${raw.handle} — ${raw.leadName}`, 'info');
        break;
      case 'sent':
        setProgress(p => ({ ...p, sent: p.sent + 1 }));
        addEvent(`Sent to @${raw.handle} — ${raw.leadName} via @${raw.username}`, 'success');
        onUpdateLeadStatus(raw.leadId, 'dm_sent');
        break;
      case 'failed':
        setProgress(p => ({ ...p, failed: p.failed + 1 }));
        addEvent(`Failed: ${raw.leadName} — ${raw.error}`, 'error');
        break;
      case 'skipped':
        setProgress(p => ({ ...p, skipped: p.skipped + 1 }));
        addEvent(`Skipped: ${raw.leadName} — ${raw.reason}`, 'warn');
        break;
      case 'login_success':
        setAccounts(prev => prev.map(a => a.id === raw.accountId ? { ...a, status: 'active' } : a));
        setLoggingId(null);
        break;
      case 'login_failed':
        setLoggingId(null);
        break;
      case 'error':
        addEvent(raw.error, 'error');
        setRunning(false);
        break;
    }
  }, [onUpdateLeadStatus]);

  // ── Account handlers ──────────────────────────────────────────────────────
  const handleSaveAccount = async (account: IGAccount) => {
    const updated = await dmAPI!.saveAccount(account);
    setAccounts(updated);
    setShowForm(false);
  };
  const handleRemoveAccount = async (id: string) => {
    const updated = await dmAPI!.removeAccount(id);
    setAccounts(updated);
    setSelectedAccountIds(prev => prev.filter(x => x !== id));
  };
  const handleTestProxy = async (account: IGAccount) => {
    setTestingId(account.id);
    const result = await dmAPI!.testProxy(account);
    setTestResults(prev => ({ ...prev, [account.id]: result }));
    setTestingId(null);
  };
  const handleLogin = async (account: IGAccount) => {
    setLoggingId(account.id);
    await dmAPI!.login(account);
    const updated = await dmAPI!.loadAccounts();
    setAccounts(updated);
    setLoggingId(null);
  };

  // ── Scrape handlers ───────────────────────────────────────────────────────
  const handleScrape = async () => {
    if (!findKeyword.trim() || !findAccountId || scraping) return;
    setScraping(true);
    setScrapeMsg('Starting...');
    setScrapeProgress(null);
    setIgResults([]);
    setSelectedHandles(new Set());

    const result = await dmAPI!.scrapeHandles(findAccountId, findKeyword.trim(), findMax);

    setScraping(false);
    setScrapeProgress(null);
    if (result.success && result.results && result.results.length > 0) {
      setIgResults(result.results);
      const autoSelected = new Set(
        result.results
          .filter(r => r.followers > 100 && r.followers < 500000)
          .map(r => r.handle)
      );
      setSelectedHandles(autoSelected);
      setScrapeMsg(`Found ${result.results.length} accounts — ${autoSelected.size} auto-selected`);
    } else {
      setScrapeMsg(result.error || 'No results found. Try a different keyword.');
    }
  };

  const makeLeadFromIG = (result: IGResult, campaignId: string): Lead => ({
    id:         `lead-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
    campaignId,
    name:       result.displayName || result.handle,
    company:    result.displayName || result.handle,
    phone:      '',
    email:      '',
    website:    result.profileUrl,
    address:    '',
    rating:     '',
    reviews:    '',
    summary:    result.bio || '',
    status:     'dm_prospect',
  });

  const handleAddToPipeline = async () => {
    const selected = igResults.filter(r => selectedHandles.has(r.handle));
    if (!selected.length) return;
    setAddingLeads(true);

    if (newCampaignName.trim()) {
      const campaign: Campaign = {
        id:        `campaign-${Date.now()}`,
        name:      newCampaignName.trim(),
        createdAt: new Date().toISOString(),
        leadCount: selected.length,
      };
      onAddCampaign(campaign, selected.map(r => makeLeadFromIG(r, campaign.id)));
      setNewCampaignName('');
    } else if (addCampaignId) {
      for (const r of selected) onAddLead(makeLeadFromIG(r, addCampaignId));
    }

    setAddingLeads(false);
    setSelectedHandles(new Set());
    setIgResults([]);
    setScrapeMsg('');
  };

  const toggleHandle = (handle: string) =>
    setSelectedHandles(prev => {
      const next = new Set(prev);
      if (next.has(handle)) next.delete(handle); else next.add(handle);
      return next;
    });

  // ── Campaign launch ───────────────────────────────────────────────────────
  const campaignLeads   = allLeads.filter(l => l.campaignId === selectedCampaignId);
  const igReadyLeads    = campaignLeads.filter(l => !!getIGHandle(l));
  const pendingLeads    = igReadyLeads.filter(l => !DM_SENT_STATUSES.has(l.status));
  const alreadySentCnt  = igReadyLeads.length - pendingLeads.length;

  const handleLaunch = async () => {
    if (!selectedCampaignId || !selectedAccountIds.length || !pendingLeads.length) return;
    setFeedEvents([]);
    await dmAPI!.startCampaign({ accountIds: selectedAccountIds, leads: pendingLeads, template: messageTemplate, delayMin, delayMax });
  };

  // ── Filtered IG results ───────────────────────────────────────────────────
  const displayedResults = filterLarge ? igResults.filter(r => r.followers < 100000 || r.followers === 0) : igResults;

  // ── Non-desktop guard ─────────────────────────────────────────────────────
  if (!isElectron) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center max-w-sm">
          <MessageSquare size={32} className="text-[#383838] mx-auto mb-3" />
          <p className="text-sm font-semibold text-[#F2F2F2] mb-1">Desktop Only</p>
          <p className="text-xs text-[#555] leading-relaxed">The DM Sender requires the desktop app. It runs through your local Chrome browser.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden p-6">

      {/* Chrome warning */}
      {chromeOk === false && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg mb-4 text-xs text-red-400">
          <XCircle size={13} />
          Chrome not found. Install Chrome to use the DM Sender.
          <a href="https://chrome.google.com" target="_blank" rel="noopener noreferrer" className="ml-auto underline flex items-center gap-1">
            Download <ExternalLink size={10} />
          </a>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-5 border-b border-[#1A1A1A]">
        {([
          { id: 'accounts', label: 'Accounts' },
          { id: 'find',     label: 'Find Leads' },
          { id: 'campaign', label: 'Campaign' },
          { id: 'feed',     label: 'Feed', pulse: running },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
              tab === t.id ? 'text-white border-[#CD3D35] bg-white/[0.03]' : 'text-[#555] border-transparent hover:text-[#909090]'
            }`}>
            {(t as any).pulse
              ? <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />{t.label}</span>
              : t.label}
          </button>
        ))}
      </div>

      {/* ── Accounts ────────────────────────────────────────────────────── */}
      {tab === 'accounts' && (
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth:'none' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-[#F2F2F2]">Instagram Accounts</p>
              <p className="text-[11px] text-[#555] mt-0.5">One residential proxy IP per account. Max 6 accounts recommended.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowGuide(g => !g)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#2A2A2A] text-[10px] text-[#555] hover:text-[#909090] transition-colors">
                <Info size={11} /> Proxy Guide
              </button>
              <button onClick={() => setShowForm(f => !f)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#CD3D35] text-white text-[10px] font-medium hover:bg-red-600 transition-colors">
                <Plus size={11} /> Add Account
              </button>
            </div>
          </div>
          <AnimatePresence>{showGuide && <ProxyGuide onClose={() => setShowGuide(false)} />}</AnimatePresence>
          <AnimatePresence>
            {showForm && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                <AccountForm onSave={handleSaveAccount} onCancel={() => setShowForm(false)} />
              </motion.div>
            )}
          </AnimatePresence>
          {accounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <User size={28} className="text-[#383838] mb-3" />
              <p className="text-xs text-[#555] font-medium mb-1">No accounts added yet</p>
              <p className="text-[11px] text-[#383838]">Add up to 6 Instagram accounts. Each needs its own residential proxy.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {accounts.map(a => (
                <AccountCard key={a.id} account={a}
                  onLogin={() => handleLogin(a)} onRemove={() => handleRemoveAccount(a.id)} onTest={() => handleTestProxy(a)}
                  testing={testingId === a.id} logging={loggingId === a.id} testResult={testResults[a.id]} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Find Leads ──────────────────────────────────────────────────── */}
      {tab === 'find' && (
        <div className="flex-1 overflow-y-auto space-y-5" style={{ scrollbarWidth:'none' }}>
          <div>
            <p className="text-sm font-semibold text-[#F2F2F2] mb-1">Find Instagram Leads</p>
            <p className="text-[11px] text-[#555]">Search Instagram by keyword to find business accounts. Results get added to your DM pipeline.</p>
          </div>

          {/* Search controls */}
          <div className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl p-4 space-y-3">
            <div>
              <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1.5">Keyword</label>
              <input value={findKeyword} onChange={e => setFindKeyword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleScrape()}
                placeholder='e.g. "roofing company dallas" or "pool service"'
                className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs text-[#F2F2F2] placeholder-[#555] focus:outline-none focus:border-[#CD3D35]/50" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1.5">Search With Account</label>
                <select value={findAccountId} onChange={e => setFindAccountId(e.target.value)}
                  className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs text-[#F2F2F2] focus:outline-none focus:border-[#CD3D35]/50">
                  <option value="">Select account...</option>
                  {accounts.filter(a => a.status === 'active').map(a => (
                    <option key={a.id} value={a.id}>@{a.username}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1.5">Max Results ({findMax})</label>
                <input type="range" min={5} max={50} value={findMax} onChange={e => setFindMax(Number(e.target.value))}
                  className="w-full mt-2 accent-[#CD3D35]" />
              </div>
            </div>
            <button onClick={handleScrape} disabled={scraping || !findKeyword.trim() || !findAccountId}
              className="w-full flex items-center justify-center gap-2 py-2 rounded bg-[#CD3D35] text-white text-xs font-semibold hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              {scraping ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
              {scraping ? scrapeMsg || 'Searching...' : 'Search Instagram'}
            </button>
            {scraping && scrapeProgress && (
              <div className="space-y-1">
                <div className="h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                  <div className="h-full bg-[#CD3D35] rounded-full transition-all duration-300"
                    style={{ width: `${(scrapeProgress.current / scrapeProgress.total) * 100}%` }} />
                </div>
                <p className="text-[10px] text-[#555] font-mono">{scrapeMsg}</p>
              </div>
            )}
          </div>

          {/* Results */}
          {igResults.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-[#F2F2F2]">{igResults.length} accounts found</p>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-[10px] text-[#555] cursor-pointer">
                    <input type="checkbox" checked={filterLarge} onChange={e => setFilterLarge(e.target.checked)} className="accent-[#CD3D35]" />
                    Hide large accounts (&gt;100K)
                  </label>
                  <button onClick={() => {
                    if (selectedHandles.size === displayedResults.length) setSelectedHandles(new Set());
                    else setSelectedHandles(new Set(displayedResults.map(r => r.handle)));
                  }} className="text-[10px] text-[#CD3D35] hover:underline">
                    {selectedHandles.size === displayedResults.length ? 'Deselect all' : 'Select all'}
                  </button>
                </div>
              </div>

              <div className="border border-[#2A2A2A] rounded-xl overflow-hidden">
                <div className="grid grid-cols-[24px_140px_1fr_70px] gap-x-3 px-3 py-2 bg-[#111] border-b border-[#2A2A2A]">
                  {['','Handle','Bio','Followers'].map((h,i) => (
                    <p key={i} className="text-[9px] text-[#555] uppercase tracking-wider font-semibold">{h}</p>
                  ))}
                </div>
                <div className="max-h-64 overflow-y-auto" style={{ scrollbarWidth:'thin', scrollbarColor:'#2A2A2A transparent' }}>
                  {displayedResults.map(r => (
                    <div key={r.handle}
                      onClick={() => toggleHandle(r.handle)}
                      className={`grid grid-cols-[24px_140px_1fr_70px] gap-x-3 px-3 py-2.5 border-b border-[#111] last:border-0 cursor-pointer transition-colors ${
                        selectedHandles.has(r.handle) ? 'bg-[#CD3D35]/8 hover:bg-[#CD3D35]/12' : 'hover:bg-[#141414]'
                      }`}>
                      <input type="checkbox" checked={selectedHandles.has(r.handle)} onChange={() => {}} className="accent-[#CD3D35] mt-0.5" />
                      <div>
                        <p className="text-[11px] font-medium text-[#F2F2F2] truncate">{r.handle}</p>
                        <p className="text-[10px] text-[#555] truncate">{r.displayName}</p>
                      </div>
                      <p className="text-[10px] text-[#555] line-clamp-2 leading-relaxed">{r.bio || '—'}</p>
                      <p className="text-[10px] font-mono text-[#909090]">{fmtFollowers(r.followers)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-[#555] mt-1.5 font-mono">{selectedHandles.size} selected</p>

              {/* Add to Pipeline */}
              <div className="mt-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-[#F2F2F2]">Add {selectedHandles.size} leads to pipeline</p>
                <div>
                  <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1.5">Add to existing campaign</label>
                  <select value={addCampaignId} onChange={e => { setAddCampaignId(e.target.value); setNewCampaignName(''); }}
                    className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs text-[#F2F2F2] focus:outline-none focus:border-[#CD3D35]/50">
                    <option value="">Pick a campaign...</option>
                    {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-[#2A2A2A]" />
                  <span className="text-[10px] text-[#383838]">or</span>
                  <div className="h-px flex-1 bg-[#2A2A2A]" />
                </div>
                <div>
                  <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1.5">Create new campaign</label>
                  <input value={newCampaignName} onChange={e => { setNewCampaignName(e.target.value); setAddCampaignId(''); }}
                    placeholder="e.g. Roofing IG — Dallas June"
                    className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs text-[#F2F2F2] placeholder-[#555] focus:outline-none focus:border-[#CD3D35]/50" />
                </div>
                <button onClick={handleAddToPipeline}
                  disabled={addingLeads || !selectedHandles.size || (!addCampaignId && !newCampaignName.trim())}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded bg-[#22C55E] text-white text-xs font-semibold hover:bg-green-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  {addingLeads ? <Loader2 size={12} className="animate-spin" /> : <Users size={12} />}
                  Add {selectedHandles.size} leads to pipeline
                </button>
              </div>
            </div>
          )}

          {!scraping && !igResults.length && scrapeMsg && (
            <div className="flex items-center gap-2 text-xs text-[#555] py-4">
              <AlertCircle size={13} className="text-[#F59E0B]" /> {scrapeMsg}
            </div>
          )}
        </div>
      )}

      {/* ── Campaign ────────────────────────────────────────────────────── */}
      {tab === 'campaign' && (
        <div className="flex-1 overflow-y-auto space-y-5" style={{ scrollbarWidth:'none' }}>
          <div>
            <p className="text-sm font-semibold text-[#F2F2F2] mb-1">Send Campaign</p>
            <p className="text-[11px] text-[#555]">Pick a campaign with IG leads (found via Find Leads), select accounts, write your message.</p>
          </div>

          {/* Campaign */}
          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1.5">Campaign</label>
            <select value={selectedCampaignId} onChange={e => setSelectedCampaignId(e.target.value)}
              className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs text-[#F2F2F2] focus:outline-none focus:border-[#CD3D35]/50">
              <option value="">Select campaign...</option>
              {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {selectedCampaignId && (
              <div className="flex items-center gap-3 mt-1.5 text-[10px] font-mono">
                <span className="text-[#F2F2F2]">{pendingLeads.length} ready to send</span>
                {alreadySentCnt > 0 && (
                  <span className="flex items-center gap-1 text-[#555]">
                    <CheckCircle2 size={9} className="text-[#22C55E]" />
                    {alreadySentCnt} already DM'd — skipped
                  </span>
                )}
                {igReadyLeads.length === 0 && campaignLeads.length > 0 && (
                  <span className="text-[#F59E0B]">No IG leads in this campaign — use Find Leads first</span>
                )}
              </div>
            )}
          </div>

          {/* Accounts */}
          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1.5">Sending Accounts</label>
            {accounts.filter(a => a.status !== 'banned').length === 0 ? (
              <p className="text-[11px] text-[#555] italic">No active accounts — add and log in via the Accounts tab.</p>
            ) : (
              <div className="space-y-1.5">
                {accounts.filter(a => a.status !== 'banned').map(a => {
                  const today = new Date().toDateString();
                  const sent  = a.lastReset === today ? a.dailySent : 0;
                  const checked = selectedAccountIds.includes(a.id);
                  return (
                    <label key={a.id}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${checked ? 'border-[#CD3D35]/40 bg-[#CD3D35]/8' : 'border-[#2A2A2A] hover:border-[#383838]'}`}>
                      <input type="checkbox" checked={checked}
                        onChange={e => setSelectedAccountIds(prev => e.target.checked ? [...prev, a.id] : prev.filter(x => x !== a.id))}
                        className="accent-[#CD3D35]" />
                      <span className="text-xs text-[#F2F2F2]">@{a.username}</span>
                      <span className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-[#555]">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor(a.status) }} />
                        {sent}/{a.dailyLimit} today
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
            {selectedAccountIds.length > 0 && pendingLeads.length > 0 && (
              <p className="text-[10px] text-[#555] mt-1.5 font-mono">
                ~{Math.ceil(pendingLeads.length / selectedAccountIds.length)} leads per account
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold">Message Template</label>
              <div className="flex items-center gap-1">
                {['{{name}}','{{company}}'].map(tag => (
                  <button key={tag} onClick={() => setMessageTemplate(p => p + tag)}
                    className="px-2 py-0.5 text-[9px] font-mono bg-[#1E1E1E] border border-[#2A2A2A] rounded text-[#909090] hover:text-[#F2F2F2] transition-colors">
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <textarea value={messageTemplate} onChange={e => setMessageTemplate(e.target.value)}
              rows={5} maxLength={1000}
              className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-3 py-2.5 text-xs text-[#F2F2F2] focus:outline-none focus:border-[#CD3D35]/50 resize-none leading-relaxed" />
            <p className="text-[10px] text-[#555] mt-1 font-mono text-right">{messageTemplate.length}/1000</p>
          </div>

          {/* Delay */}
          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-2">Delay Between Sends</label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-[9px] text-[#555] mb-1">Min ({delayMin}s)</p>
                <input type="range" min={15} max={90} value={delayMin} onChange={e => setDelayMin(Number(e.target.value))} className="w-full accent-[#CD3D35]" />
              </div>
              <div className="flex-1">
                <p className="text-[9px] text-[#555] mb-1">Max ({delayMax}s)</p>
                <input type="range" min={30} max={120} value={delayMax} onChange={e => setDelayMax(Number(e.target.value))} className="w-full accent-[#CD3D35]" />
              </div>
            </div>
            <p className="text-[10px] text-[#555] mt-1">Randomised between {delayMin}s–{delayMax}s. Keep above 25s to reduce ban risk.</p>
          </div>

          <button onClick={handleLaunch}
            disabled={running || !selectedCampaignId || !selectedAccountIds.length || pendingLeads.length === 0}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#CD3D35] text-white text-xs font-semibold hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <Play size={13} />
            {running ? 'Campaign Running...' : `Launch — ${pendingLeads.length} leads, ${selectedAccountIds.length} accounts`}
          </button>
        </div>
      )}

      {/* ── Feed ────────────────────────────────────────────────────────── */}
      {tab === 'feed' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {progress.total > 0 && (
            <div className="mb-4 shrink-0">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-[#F2F2F2]">{running ? 'Running...' : 'Completed'}</p>
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <span className="text-green-400">{progress.sent} sent</span>
                  <span className="text-[#F59E0B]">{progress.skipped} skipped</span>
                  <span className="text-red-400">{progress.failed} failed</span>
                  <span className="text-[#555]">/ {progress.total}</span>
                </div>
              </div>
              <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                <div className="h-full bg-[#CD3D35] rounded-full transition-all duration-500"
                  style={{ width: `${progress.total > 0 ? ((progress.sent + progress.skipped + progress.failed) / progress.total) * 100 : 0}%` }} />
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 mb-3 shrink-0">
            {running && (
              <button onClick={async () => { await dmAPI!.stopCampaign(); setRunning(false); setProgress(p => ({ ...p, running:false })); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-500/15 text-red-400 text-xs font-medium hover:bg-red-500/25 transition-colors">
                <StopCircle size={12} /> Stop
              </button>
            )}
            {feedEvents.length > 0 && (
              <button onClick={() => setFeedEvents([])}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1E1E1E] text-[#555] text-xs hover:text-[#909090] transition-colors">
                <Trash2 size={11} /> Clear
              </button>
            )}
          </div>
          <div ref={feedRef} className="flex-1 overflow-y-auto bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4"
            style={{ scrollbarWidth:'thin', scrollbarColor:'#2A2A2A transparent' }}>
            {feedEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Activity size={24} className="text-[#2A2A2A] mb-2" />
                <p className="text-[11px] text-[#383838]">No campaign running. Use Find Leads to discover handles, then launch from Campaign tab.</p>
              </div>
            ) : feedEvents.map(e => <FeedRow key={e.id} event={e} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default DMSender;
