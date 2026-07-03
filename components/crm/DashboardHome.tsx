import React, { useState, useMemo } from 'react';
import {
  DollarSign, Phone, Calendar as CalendarIcon, ChevronLeft, ChevronRight,
  LayoutGrid, CalendarDays, Clock, MessageSquare, UserPlus, Zap, X,
  TrendingUp, Users, Activity, ArrowUpRight, GitBranch, Star
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, CartesianGrid } from 'recharts';
import { Client, DemoEvent, Lead, Dial } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { PIPELINE_STAGES } from './Pipeline';
import AgentActivity from './AgentActivity';

// ── Types ─────────────────────────────────────────────────────────────────────

type Timeframe = 'Day' | 'Week' | 'Month';
type CalendarMode = 'Month' | 'Year';
type MetricMode = 'Profits' | 'Demos';

interface DailyData {
  date: string;
  revenue: number;
  clientsClosed: number;
  dials: number;
  demosBooked: number;
}

interface ActivityEvent {
  id: string;
  type: 'client_onboarded' | 'demo_booked' | 'message_received' | 'retainer_paid';
  title: string;
  subtitle: string;
  date: string;
  value?: string;
}

interface DashboardHomeProps {
  clients: Client[];
  demoEvents: DemoEvent[];
  allLeads: Lead[];
  dials: Dial[];
}

// ── Pipeline stage snapshot ───────────────────────────────────────────────────
// Each row aggregates the matching stage IDs from all 3 channels (Calls/DMs/Emails).

interface PipelineSnapRow {
  id: string;
  label: string;
  color: string;
  stageIds: string[];
}

const PIPELINE_SNAP: PipelineSnapRow[] = [
  { id: 'prospect',        label: 'Prospect',      color: '#555555', stageIds: ['prospect',        'dm_prospect',        'em_prospect']        },
  { id: 'outreach_sent',   label: 'Outreach Sent', color: '#3B82F6', stageIds: ['called',          'dm_sent',            'em_sent']            },
  { id: 'replied',         label: 'Replied',       color: '#10B981', stageIds: ['picked_up',       'dm_replied',         'em_replied']         },
  { id: 'voicemail',       label: 'Voicemail',     color: '#F59E0B', stageIds: ['voicemail']                                                  },
  { id: 'follow_up',       label: 'Follow Up',     color: '#F97316', stageIds: ['follow_up']                                                  },
  { id: 'interested',      label: 'Interested',    color: '#06B6D4', stageIds: ['dm_interested',   'em_interested']                           },
  { id: 'demo_booked',     label: 'Interested',    color: '#8B5CF6', stageIds: ['demo_booked']                                                },
  { id: 'mockup_building', label: 'Mockup Bldg',   color: '#EC4899', stageIds: ['mockup_building', 'dm_mockup_building', 'em_mockup_building'] },
  { id: 'mockup_sent',     label: 'Mockup Sent',   color: '#F59E0B', stageIds: ['mockup_sent',     'dm_mockup_sent',     'em_mockup_sent']     },
  { id: 'approved',        label: 'Approved',      color: '#10B981', stageIds: ['approved',        'dm_approved',        'em_approved']        },
  { id: 'paid',            label: 'Paid',          color: '#22C55E', stageIds: ['paid',            'dm_paid',            'em_paid']            },
  { id: 'launched',        label: 'Launched',      color: '#06B6D4', stageIds: ['launched',        'dm_launched',        'em_launched']        },
  { id: 'lost',            label: 'Lost',          color: '#374151', stageIds: ['lost',            'dm_lost',            'em_lost']            },
];

// Reverse lookup: actual stage ID → snap row ID
const STAGE_TO_SNAP: Record<string, string> = {};
PIPELINE_SNAP.forEach(row => row.stageIds.forEach(sid => { STAGE_TO_SNAP[sid] = row.id; }));

// Stages shown in the Needs Attention card (leads that need action)
const ATTENTION_STAGE_IDS = new Set([
  'follow_up', 'voicemail',                                                    // calls follow-up
  'called', 'picked_up',                                                        // calls active
  'dm_sent', 'dm_replied', 'dm_interested',                                    // DMs active
  'em_sent', 'em_replied', 'em_interested',                                    // emails active
  'mockup_building', 'dm_mockup_building', 'em_mockup_building',               // mockup stages
  'mockup_sent',     'dm_mockup_sent',     'em_mockup_sent',
]);

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatLocalDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const fmt = (n: number) => {
  if (n === 0) return '$0';
  if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'k';
  return '$' + n.toLocaleString();
};

// ── Baseline (2024-2030) ──────────────────────────────────────────────────────

const generateBaselineRangeData = (): DailyData[] => {
  const data: DailyData[] = [];
  const start = new Date(2024, 0, 1);
  const end   = new Date(2030, 11, 31);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    data.push({ date: formatLocalDate(d), revenue: 0, clientsClosed: 0, dials: 0, demosBooked: 0 });
  }
  return data;
};

const baselineData = generateBaselineRangeData();

// ── KPI Card ──────────────────────────────────────────────────────────────────

const KPI: React.FC<{
  label: string;
  value: string;
  sub?: string;
  icon: React.FC<{ size?: number; className?: string }>;
  color: string;
  small?: boolean;
}> = ({ label, value, sub, icon: Icon, color, small }) => (
  <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-4 hover:border-[#383838] transition-colors">
    <div className="flex items-center justify-between mb-2">
      <p className="text-[10px] text-[#555] uppercase tracking-wider font-semibold">{label}</p>
      <div className="p-1.5 rounded" style={{ background: color + '18' }}>
        <Icon size={12} style={{ color }} />
      </div>
    </div>
    <p className={`font-bold font-mono text-[#F2F2F2] leading-none ${small ? 'text-xl' : 'text-2xl'}`}>{value}</p>
    {sub && <p className="text-[10px] text-[#555] mt-1">{sub}</p>}
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

const DashboardHome: React.FC<DashboardHomeProps> = ({ clients, demoEvents, allLeads, dials }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('Month');
  const [calendarViewDate, setCalendarViewDate] = useState(new Date());
  const [calendarMode, setCalendarMode] = useState<CalendarMode>('Month');
  const [metricMode, setMetricMode] = useState<MetricMode>('Profits');
  const [showFullActivity, setShowFullActivity] = useState(false);

  const todayStr   = useMemo(() => formatLocalDate(new Date()), []);
  const todayDate  = useMemo(() => { const d = new Date(); d.setHours(23, 59, 59, 999); return d; }, []);
  const thirtyAgo  = useMemo(() => { const d = new Date(); d.setDate(d.getDate() - 30); return formatLocalDate(d); }, []);

  // ── Build full year dataset ─────────────────────────────────────────────────

  const fullYearData = useMemo(() => {
    const map = new Map<string, DailyData>();
    baselineData.forEach(d => map.set(d.date, { ...d }));

    clients.forEach(c => {
      const e = map.get(c.closeDate);
      if (e) { e.revenue += c.upfrontValue; e.clientsClosed += 1; }

      if (c.status === 'active' && c.monthlyValue > 0 && c.monthlyRetainerDate) {
        const startObj = new Date(c.monthlyRetainerDate + 'T00:00:00');
        const billingDay = startObj.getDate();
        let cur = new Date(startObj);
        while (cur <= todayDate) {
          const ds = formatLocalDate(cur);
          const be = map.get(ds);
          if (be) be.revenue += c.monthlyValue;
          cur.setMonth(cur.getMonth() + 1);
          cur.setDate(billingDay);
        }
      }
    });

    demoEvents.forEach(ev => { const e = map.get(ev.date); if (e) e.demosBooked += 1; });

    const dialCounts = new Map<string, number>();
    dials.forEach(d => dialCounts.set(d.date, (dialCounts.get(d.date) ?? 0) + 1));
    dialCounts.forEach((count, date) => { const e = map.get(date); if (e) e.dials = count; });

    return Array.from(map.values());
  }, [clients, demoEvents, dials, todayDate]);

  // ── Period stats ────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    let data: DailyData[] = [];
    if (timeframe === 'Day') {
      data = fullYearData.filter(d => d.date === todayStr);
    } else if (timeframe === 'Week') {
      const now = new Date();
      const start = new Date(now); start.setDate(now.getDate() - now.getDay());
      const end   = new Date(start); end.setDate(start.getDate() + 6);
      data = fullYearData.filter(d => d.date >= formatLocalDate(start) && d.date <= formatLocalDate(end));
    } else {
      data = fullYearData.filter(d => d.date.startsWith(todayStr.substring(0, 7)));
    }
    const totalRevenue  = data.reduce((a, d) => a + d.revenue, 0);
    const totalDials    = data.reduce((a, d) => a + d.dials, 0);
    const totalDemos    = data.reduce((a, d) => a + d.demosBooked, 0);
    const conversion    = totalDials > 0 ? ((totalDemos / totalDials) * 100).toFixed(1) : '0.0';
    return { totalRevenue, totalDials, totalDemos, conversion };
  }, [timeframe, todayStr, fullYearData]);

  // ── Revenue metrics ─────────────────────────────────────────────────────────

  const revMetrics = useMemo(() => {
    const active = clients.filter(c => c.status === 'active');
    const mrr = active.reduce((s, c) => s + (c.monthlyValue ?? 0), 0);
    const arr = mrr * 12;
    const totalUpfront = clients.reduce((s, c) => s + (c.upfrontValue ?? 0), 0);
    return { mrr, arr, totalUpfront, activeClients: active.length };
  }, [clients]);

  // ── Chart data ──────────────────────────────────────────────────────────────

  const chartData = useMemo(() => {
    const now = new Date();
    if (timeframe === 'Day') {
      const sun = new Date(now); sun.setDate(now.getDate() - now.getDay());
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(sun); d.setDate(sun.getDate() + i);
        const ds = formatLocalDate(d);
        const day = fullYearData.find(x => x.date === ds);
        return { name: d.toLocaleDateString('default', { weekday: 'short' }), revenue: day?.revenue ?? 0 };
      });
    } else if (timeframe === 'Week') {
      const yr = now.getFullYear(), mo = now.getMonth();
      const dim = new Date(yr, mo + 1, 0).getDate();
      return Array.from({ length: Math.ceil(dim / 7) }, (_, w) => {
        const s = w * 7 + 1, e = (w + 1) * 7;
        const rev = fullYearData.filter(x => {
          const d = new Date(x.date + 'T00:00:00');
          return d.getFullYear() === yr && d.getMonth() === mo && d.getDate() >= s && d.getDate() <= e;
        }).reduce((a, x) => a + x.revenue, 0);
        return { name: `W${w + 1}`, revenue: rev };
      });
    } else {
      return Array.from({ length: 12 }, (_, m) => {
        const prefix = `${now.getFullYear()}-${String(m + 1).padStart(2, '0')}`;
        const rev = fullYearData.filter(x => x.date.startsWith(prefix)).reduce((a, x) => a + x.revenue, 0);
        return { name: new Date(now.getFullYear(), m, 1).toLocaleString('default', { month: 'short' }), revenue: rev };
      });
    }
  }, [timeframe, fullYearData]);

  // ── Activity feed ───────────────────────────────────────────────────────────

  const allActivity = useMemo(() => {
    const events: ActivityEvent[] = [];

    clients.forEach(c => {
      events.push({ id: `cl-${c.id}`, type: 'client_onboarded', title: `New Client: ${c.company}`, subtitle: `Closed for ${fmt(c.upfrontValue)} setup.`, date: c.closeDate, value: `+${fmt(c.upfrontValue)}` });
      if (c.status === 'active' && c.monthlyValue > 0 && c.monthlyRetainerDate) {
        const startObj = new Date(c.monthlyRetainerDate + 'T00:00:00');
        const billingDay = startObj.getDate();
        let cur = new Date(startObj);
        while (cur <= todayDate) {
          const ds = formatLocalDate(cur);
          events.push({ id: `ret-${c.id}-${ds}`, type: 'retainer_paid', title: `${c.company} Retainer`, subtitle: 'Monthly billing processed.', date: ds, value: `+${fmt(c.monthlyValue)}` });
          cur.setMonth(cur.getMonth() + 1); cur.setDate(billingDay);
        }
      }
    });

    demoEvents.forEach(d => {
      const lead = allLeads.find(l => l.id === d.leadId);
      events.push({ id: d.id, type: 'demo_booked', title: `Demo Booked: ${lead?.name ?? 'Prospect'}`, subtitle: `${lead?.company ?? 'Lead'} confirmed walkthrough.`, date: d.date });
    });

    return events.sort((a, b) => b.date.localeCompare(a.date));
  }, [clients, demoEvents, allLeads, todayDate]);

  const recentActivity = useMemo(() => allActivity.slice(0, 5), [allActivity]);
  const fullFeed       = useMemo(() => allActivity.filter(e => e.date >= thirtyAgo), [allActivity, thirtyAgo]);

  // ── Pipeline counts ─────────────────────────────────────────────────────────

  const pipelineCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    PIPELINE_SNAP.forEach(s => { counts[s.id] = 0; });
    allLeads.forEach(l => {
      const snapId = STAGE_TO_SNAP[l.status];
      if (snapId) counts[snapId] = (counts[snapId] ?? 0) + 1;
    });
    return counts;
  }, [allLeads]);

  const totalLeads = allLeads.length || 1;

  // ── Attention: active-stage leads (incl. follow-up across all channels) ────

  const attentionLeads = useMemo(() =>
    allLeads.filter(l => ATTENTION_STAGE_IDS.has(l.status)).slice(0, 5),
    [allLeads]
  );

  // ── Calendar helpers ────────────────────────────────────────────────────────

  const handlePrevCal = () => {
    const d = new Date(calendarViewDate);
    calendarMode === 'Month' ? d.setMonth(d.getMonth() - 1) : d.setFullYear(d.getFullYear() - 1);
    setCalendarViewDate(d);
  };
  const handleNextCal = () => {
    const d = new Date(calendarViewDate);
    calendarMode === 'Month' ? d.setMonth(d.getMonth() + 1) : d.setFullYear(d.getFullYear() + 1);
    setCalendarViewDate(d);
  };

  const getDaysInMonth = (date: Date) => {
    const y = date.getFullYear(), m = date.getMonth();
    const days = new Date(y, m + 1, 0).getDate();
    const firstDay = new Date(y, m, 1).getDay();
    const arr = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let i = 1; i <= days; i++) arr.push(new Date(y, m, i));
    return arr;
  };

  const calFmt = (v: number) => {
    if (v === 0) return '';
    if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
    return `$${v}`;
  };

  const actIcon = (type: ActivityEvent['type']) => {
    const cls = 'shrink-0';
    if (type === 'client_onboarded') return <UserPlus size={13} className={`text-green-400 ${cls}`} />;
    if (type === 'demo_booked')      return <CalendarIcon size={13} className={`text-purple-400 ${cls}`} />;
    if (type === 'retainer_paid')    return <Zap size={13} className={`text-[#CD3D35] ${cls}`} />;
    return <MessageSquare size={13} className={`text-blue-400 ${cls}`} />;
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="p-5 space-y-5 overflow-y-auto h-full">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-[#F2F2F2]">Dashboard</h1>
          <p className="text-xs text-[#555]">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#141414] border border-[#2A2A2A] rounded overflow-hidden">
            {(['Day', 'Week', 'Month'] as Timeframe[]).map(t => (
              <button key={t} onClick={() => setTimeframe(t)}
                className={`px-3 py-1 text-xs font-medium transition-colors ${timeframe === t ? 'bg-[#CD3D35] text-white' : 'text-[#555] hover:text-[#909090]'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top KPI row (8 cards) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        <KPI label={`Revenue (${timeframe})`} value={fmt(stats.totalRevenue)} icon={DollarSign} color="#CD3D35" />
        <KPI label="MRR"             value={fmt(revMetrics.mrr)}         sub="monthly"          icon={TrendingUp}    color="#22C55E" />
        <KPI label="ARR"             value={fmt(revMetrics.arr)}         sub="annualized"       icon={Activity}      color="#3B82F6" />
        <KPI label="Total Upfront"   value={fmt(revMetrics.totalUpfront)} sub="all-time"         icon={ArrowUpRight}  color="#8B5CF6" />
        <KPI label="Total Clients"   value={String(clients.length)}          sub={`${revMetrics.activeClients} active`} icon={Users} color="#F59E0B" />
        <KPI label="Pipeline Leads"  value={String(allLeads.length)}     sub="all stages"       icon={GitBranch}     color="#06B6D4" small />
        <KPI label={`Dials (${timeframe})`}   value={String(stats.totalDials)} icon={Phone} color="#60A5FA" small />
        <KPI label={`Demos (${timeframe})`}   value={String(stats.totalDemos)} sub={`${stats.conversion}% conv.`} icon={CalendarIcon} color="#EC4899" small />
      </div>

      {/* ── Main 2-col layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Left: chart + pipeline snapshot */}
        <div className="xl:col-span-2 space-y-5">

          {/* Revenue / Profit chart */}
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-[#F2F2F2]">Revenue Trend</p>
                <p className="text-[10px] text-[#555]">
                  {timeframe === 'Day' ? 'This week by day' : timeframe === 'Week' ? 'This month by week' : 'This year by month'}
                </p>
              </div>
              <p className="text-sm font-bold font-mono text-[#CD3D35]">{fmt(stats.totalRevenue)}</p>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#CD3D35" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#CD3D35" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} padding={{ left: 10, right: 10 }} />
                  <Tooltip
                    contentStyle={{ background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: 6, fontSize: 11 }}
                    labelStyle={{ color: '#F2F2F2' }}
                    formatter={(v: number) => [fmt(v), 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#CD3D35" strokeWidth={1.5} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pipeline snapshot */}
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-[#F2F2F2]">Pipeline Snapshot</p>
              <p className="text-[10px] text-[#555] font-mono">{allLeads.length} total leads</p>
            </div>
            <div className="space-y-1.5">
              {PIPELINE_SNAP.map(stage => {
                const count = pipelineCounts[stage.id] ?? 0;
                const pct   = (count / totalLeads) * 100;
                return (
                  <div key={stage.id} className="flex items-center gap-2">
                    <span className="text-[10px] text-[#555] w-24 shrink-0 truncate">{stage.label}</span>
                    <div className="flex-1 h-3 bg-[#0A0A0A] rounded overflow-hidden relative">
                      {count > 0 && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.4, delay: 0.05 }}
                          className="h-full rounded"
                          style={{ background: stage.color + 'CC' }}
                        />
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-[#555] w-5 text-right shrink-0">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right: activity + attention */}
        <div className="space-y-5">

          {/* Activity Feed */}
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A1A1A]">
              <p className="text-sm font-semibold text-[#F2F2F2]">Activity</p>
              <button onClick={() => setShowFullActivity(true)} className="text-[10px] text-[#CD3D35] hover:text-[#E85550] transition-colors">See all</button>
            </div>
            <div className="divide-y divide-[#1A1A1A]">
              {recentActivity.length === 0 ? (
                <p className="text-xs text-[#383838] text-center py-8">No recent activity.</p>
              ) : recentActivity.map(ev => (
                <div key={ev.id} className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-[#1A1A1A] transition-colors">
                  <div className="mt-0.5 p-1.5 rounded bg-[#1E1E1E] shrink-0">{actIcon(ev.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-medium text-[#F2F2F2] truncate">{ev.title}</p>
                      {ev.value && <span className="text-[9px] font-bold text-[#CD3D35] bg-[#CD3D35]/10 px-1 rounded shrink-0">{ev.value}</span>}
                    </div>
                    <p className="text-[10px] text-[#555] truncate">{ev.subtitle}</p>
                  </div>
                  <span className="text-[9px] text-[#383838] font-mono shrink-0 mt-0.5">{ev.date === todayStr ? 'Today' : ev.date.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Attention: active-stage leads */}
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#1A1A1A] flex items-center justify-between">
              <p className="text-sm font-semibold text-[#F2F2F2]">Needs Attention</p>
              <span className="text-[10px] font-mono text-[#555]">{attentionLeads.length} active</span>
            </div>
            <div className="divide-y divide-[#1A1A1A]">
              {attentionLeads.length === 0 ? (
                <p className="text-xs text-[#383838] text-center py-8">No leads in active stages.</p>
              ) : attentionLeads.map(lead => {
                const stg = (PIPELINE_STAGES as readonly { id: string; label: string; color: string }[]).find(p => p.id === lead.status);
                const color = stg?.color ?? '#555';
                return (
                  <div key={lead.id} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#1A1A1A] transition-colors">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                      style={{ background: color + '22', color }}>
                      {lead.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#F2F2F2] truncate">{lead.name}</p>
                      {lead.company && <p className="text-[10px] text-[#555] truncate">{lead.company}</p>}
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0"
                      style={{ background: color + '20', color }}>
                      {stg?.label ?? lead.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ── Performance Calendar ── */}
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <p className="text-sm font-semibold text-[#F2F2F2]">Performance Calendar</p>
          <div className="flex items-center gap-2">
            {/* Metric toggle */}
            <div className="flex bg-[#0A0A0A] border border-[#2A2A2A] rounded overflow-hidden">
              {(['Profits', 'Demos'] as MetricMode[]).map(m => (
                <button key={m} onClick={() => setMetricMode(m)}
                  className={`px-2.5 py-1 text-[10px] font-medium transition-colors ${metricMode === m ? 'bg-[#CD3D35] text-white' : 'text-[#555] hover:text-[#909090]'}`}>
                  {m}
                </button>
              ))}
            </div>
            {/* Month / Year toggle */}
            <div className="flex bg-[#0A0A0A] border border-[#2A2A2A] rounded overflow-hidden">
              <button onClick={() => setCalendarMode('Month')} title="Month"
                className={`p-1.5 transition-colors ${calendarMode === 'Month' ? 'bg-[#1E1E1E] text-[#F2F2F2]' : 'text-[#555] hover:text-[#909090]'}`}>
                <CalendarDays size={12} />
              </button>
              <button onClick={() => setCalendarMode('Year')} title="Year"
                className={`p-1.5 transition-colors ${calendarMode === 'Year' ? 'bg-[#1E1E1E] text-[#F2F2F2]' : 'text-[#555] hover:text-[#909090]'}`}>
                <LayoutGrid size={12} />
              </button>
            </div>
            {/* Nav */}
            <div className="flex items-center gap-1">
              <button onClick={handlePrevCal} className="p-1 text-[#555] hover:text-[#909090] hover:bg-[#1E1E1E] rounded transition-colors"><ChevronLeft size={13} /></button>
              <span className="text-xs font-mono text-[#CD3D35] w-32 text-center">
                {calendarMode === 'Month'
                  ? calendarViewDate.toLocaleString('default', { month: 'long', year: 'numeric' })
                  : calendarViewDate.getFullYear()}
              </span>
              <button onClick={handleNextCal} className="p-1 text-[#555] hover:text-[#909090] hover:bg-[#1E1E1E] rounded transition-colors"><ChevronRight size={13} /></button>
            </div>
          </div>
        </div>

        {calendarMode === 'Month' ? (
          <div className="grid grid-cols-7 gap-1.5">
            {['S','M','T','W','T','F','S'].map((d, i) => (
              <div key={i} className="text-center text-[9px] text-[#383838] font-semibold mb-1 uppercase">{d}</div>
            ))}
            {getDaysInMonth(calendarViewDate).map((date, i) => {
              if (!date) return <div key={`e${i}`} />;
              const ds = formatLocalDate(date);
              const day = fullYearData.find(d => d.date === ds);
              const isToday = ds === todayStr;
              const active = metricMode === 'Profits' ? (day?.revenue ?? 0) > 0 : (day?.demosBooked ?? 0) > 0;
              return (
                <div key={ds} className={`aspect-square rounded border p-1 flex flex-col justify-between transition-colors relative overflow-hidden
                  ${active ? 'bg-[#CD3D35]/10 border-[#CD3D35]/40' : 'bg-[#0A0A0A] border-[#1A1A1A]'}
                  ${isToday ? 'ring-1 ring-[#CD3D35]' : ''}`}>
                  <span className={`text-[8px] leading-none ${active ? 'text-[#CD3D35] font-bold' : isToday ? 'text-[#F2F2F2] font-bold' : 'text-[#383838]'}`}>
                    {date.getDate()}
                  </span>
                  {day && (
                    <div className="flex flex-col items-center justify-center absolute inset-0 pt-2.5 pointer-events-none">
                      {metricMode === 'Profits' && day.revenue > 0 && (
                        <>
                          <span className="text-[9px] font-bold text-[#F2F2F2] leading-none mb-0.5">{calFmt(day.revenue)}</span>
                          <span className="text-[7px] text-[#555] font-bold uppercase">{day.clientsClosed > 0 ? `${day.clientsClosed} Clt` : 'Ret'}</span>
                        </>
                      )}
                      {metricMode === 'Demos' && day.demosBooked > 0 && (
                        <>
                          <span className="text-sm font-bold text-[#F2F2F2] leading-none">{day.demosBooked}</span>
                          <span className="text-[7px] text-[#555] font-bold uppercase">Demo</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
            {Array.from({ length: 12 }, (_, m) => {
              const prefix = `${calendarViewDate.getFullYear()}-${String(m + 1).padStart(2, '0')}`;
              const ms = fullYearData.filter(d => d.date.startsWith(prefix)).reduce((a, d) => ({
                rev: a.rev + d.revenue, dem: a.dem + d.demosBooked, clt: a.clt + d.clientsClosed
              }), { rev: 0, dem: 0, clt: 0 });
              const active = metricMode === 'Profits' ? ms.rev > 0 : ms.dem > 0;
              return (
                <div key={m} className={`aspect-square rounded border p-1.5 flex flex-col items-center justify-center transition-colors
                  ${active ? 'bg-[#CD3D35]/10 border-[#CD3D35]/30' : 'bg-[#0A0A0A] border-[#1A1A1A]'}`}>
                  <span className="text-[8px] font-bold text-[#383838] uppercase mb-0.5">
                    {new Date(calendarViewDate.getFullYear(), m, 1).toLocaleString('default', { month: 'short' })}
                  </span>
                  {metricMode === 'Profits' ? (
                    <span className="text-[10px] font-bold text-[#F2F2F2] leading-none">{calFmt(ms.rev) || '$0'}</span>
                  ) : (
                    <span className="text-sm font-bold text-[#F2F2F2] leading-none">{ms.dem}</span>
                  )}
                  {active && (
                    <span className="text-[7px] text-[#555] font-bold uppercase mt-0.5">
                      {metricMode === 'Profits' ? `${ms.clt} clt` : 'demos'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Agent Activity ── */}
      <AgentActivity />

      {/* ── Full activity modal ── */}
      <AnimatePresence>
        {showFullActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowFullActivity(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }}
              className="relative w-full max-w-xl bg-[#141414] border border-[#2A2A2A] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
              <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
                <div>
                  <p className="text-sm font-semibold text-[#F2F2F2]">Full Activity Stream</p>
                  <p className="text-[10px] text-[#555]">Last 30 days</p>
                </div>
                <button onClick={() => setShowFullActivity(false)} className="text-[#555] hover:text-[#909090]"><X size={14} /></button>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-[#1A1A1A]">
                {fullFeed.map(ev => (
                  <div key={ev.id} className="flex items-start gap-2.5 px-4 py-3 hover:bg-[#1A1A1A] transition-colors">
                    <div className="mt-0.5 p-1.5 rounded bg-[#1E1E1E] shrink-0">{actIcon(ev.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-medium text-[#F2F2F2]">{ev.title}</p>
                        {ev.value && <span className="text-[9px] font-bold text-[#CD3D35] bg-[#CD3D35]/10 px-1 rounded">{ev.value}</span>}
                      </div>
                      <p className="text-[10px] text-[#555]">{ev.subtitle}</p>
                    </div>
                    <span className="text-[10px] text-[#383838] font-mono shrink-0">{ev.date}</span>
                  </div>
                ))}
                {fullFeed.length === 0 && <p className="text-xs text-[#383838] text-center py-12">No activity in the last 30 days.</p>}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DashboardHome;
