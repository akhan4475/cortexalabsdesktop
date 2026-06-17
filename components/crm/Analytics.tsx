import React, { useState, useMemo, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, Cell,
} from 'recharts';
import { Target, TrendingUp, Phone, DollarSign, Layers, Link2, AlertCircle } from 'lucide-react';
import { Lead, Client, Dial, Script } from './types';
import { supabase } from '../../lib/supabase';

interface AnalyticsProps {
  allLeads: Lead[];
  clients: Client[];
  dials: Dial[];
}

// ── Inline stage defs (avoid circular import from Pipeline) ───────────────────
const STAGES = [
  { id: 'prospect',         label: 'Prospect',  color: '#555555' },
  { id: 'qualified',        label: 'Qualified', color: '#6B7280' },
  { id: 'dm_sent',          label: 'DM Sent',   color: '#3B82F6' },
  { id: 'replied',          label: 'Replied',   color: '#10B981' },
  { id: 'mockup_building',  label: 'Building',  color: '#F59E0B' },
  { id: 'mockup_sent',      label: 'M. Sent',   color: '#F97316' },
  { id: 'approved',         label: 'Approved',  color: '#8B5CF6' },
  { id: 'paid',             label: 'Paid',      color: '#22C55E' },
  { id: 'launched',         label: 'Launched',  color: '#06B6D4' },
  { id: 'review_requested', label: 'Review',    color: '#EC4899' },
  { id: 'closed_referral',  label: 'Closed',    color: '#CD3D35' },
  { id: 'lost',             label: 'Lost',      color: '#374151' },
];

const LEGACY: Record<string, string> = {
  'Not Called': 'prospect', 'Called': 'dm_sent', 'Demo Booked': 'replied', 'Client': 'paid',
};

function resolveStage(status: string): string {
  if (STAGES.some(s => s.id === status)) return status;
  return LEGACY[status] ?? 'prospect';
}

// ── KPI card ──────────────────────────────────────────────────────────────────
const KPI: React.FC<{ label: string; value: string | number; color: string }> = ({ label, value, color }) => (
  <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4">
    <p className="text-[10px] text-[#555] uppercase tracking-wider font-semibold mb-2">{label}</p>
    <p className="text-2xl font-bold font-mono" style={{ color }}>{value}</p>
  </div>
);

// ── Custom tooltip ─────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="text-[#555] mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color ?? p.fill }}>
          {p.name}: {typeof p.value === 'number' && p.dataKey !== 'count' && p.dataKey !== 'dials'
            ? '$' + p.value.toLocaleString()
            : p.value}
        </p>
      ))}
    </div>
  );
};

// ── Analytics main ────────────────────────────────────────────────────────────
const Analytics: React.FC<AnalyticsProps> = ({ allLeads, clients, dials }) => {
  const [tab, setTab] = useState<'sales' | 'content' | 'attribution'>('sales');
  const [scripts, setScripts] = useState<Script[]>([]);

  // Load scripts for content tab
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('scripts').select('*').eq('user_id', user.id);
      if (data) {
        setScripts(data.map((s: any) => ({
          id: s.id, niche: s.niche, format: s.format ?? 'reel',
          status: s.status, hook: s.hook, body: s.body, cta: s.cta,
          fullScript: s.full_script, caption: s.caption,
          hashtags: s.hashtags ?? [], topic: s.topic,
          createdAt: s.created_at, updatedAt: s.updated_at,
        })));
      }
    })();
  }, []);

  // ── Sales analytics ─────────────────────────────────────────────────────────
  const pipelineFunnel = useMemo(() => {
    const counts: Record<string, number> = {};
    STAGES.forEach(s => { counts[s.id] = 0; });
    allLeads.forEach(l => { const s = resolveStage(l.status); counts[s] = (counts[s] || 0) + 1; });
    return STAGES.map(s => ({ ...s, count: counts[s.id] ?? 0 }));
  }, [allLeads]);

  const dialsByWeek = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 8 }, (_, i) => {
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - i * 7);
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 6);
      const label = weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const count = dials.filter(d => {
        const date = new Date(d.date);
        return date >= weekStart && date <= weekEnd;
      }).length;
      return { week: label, count };
    }).reverse();
  }, [dials]);

  const revenueByMonth = useMemo(() => {
    const months: Record<string, { upfront: number; mrr: number }> = {};
    clients.forEach(c => {
      const month = c.closeDate?.slice(0, 7) ?? '';
      if (!month) return;
      if (!months[month]) months[month] = { upfront: 0, mrr: 0 };
      months[month].upfront += c.upfrontValue;
      months[month].mrr += c.monthlyValue;
    });
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, vals]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        ...vals,
      }));
  }, [clients]);

  const salesKpis = useMemo(() => {
    const total = allLeads.length;
    const paid = allLeads.filter(l => resolveStage(l.status) === 'paid').length;
    const active = allLeads.filter(l =>
      ['dm_sent','replied','mockup_building','mockup_sent','approved'].includes(resolveStage(l.status))
    ).length;
    const lost = allLeads.filter(l => resolveStage(l.status) === 'lost').length;
    const rate = total > 0 ? ((paid / total) * 100).toFixed(1) : '0.0';
    const totalMRR = clients.filter(c => c.status === 'active').reduce((s, c) => s + c.monthlyValue, 0);
    return { total, paid, active, lost, rate, totalMRR };
  }, [allLeads, clients]);

  // ── Content analytics ───────────────────────────────────────────────────────
  const scriptStageData = useMemo(() => {
    const stages = ['idea','approved','shot','edited','posted'] as const;
    const colors = { idea: '#555555', approved: '#3B82F6', shot: '#F59E0B', edited: '#8B5CF6', posted: '#22C55E' };
    return stages.map(s => ({
      status: s.charAt(0).toUpperCase() + s.slice(1),
      count: scripts.filter(sc => sc.status === s).length,
      color: colors[s],
    }));
  }, [scripts]);

  const contentKpis = useMemo(() => {
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(); monthAgo.setDate(monthAgo.getDate() - 30);
    return {
      total: scripts.length,
      thisWeek: scripts.filter(s => new Date(s.createdAt) >= weekAgo).length,
      posted: scripts.filter(s => s.status === 'posted').length,
      inPipeline: scripts.filter(s => s.status !== 'posted').length,
    };
  }, [scripts]);

  // ── Attribution ─────────────────────────────────────────────────────────────
  const totalARR = clients.filter(c => c.status === 'active').reduce((s, c) => s + c.monthlyValue * 12, 0);

  return (
    <div className="p-5 space-y-5 max-w-5xl">
      {/* Tab switcher */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-0.5 bg-[#141414] border border-[#2A2A2A] rounded-lg p-0.5">
          {(['sales', 'content', 'attribution'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded text-xs font-medium transition-colors capitalize ${
                tab === t ? 'bg-[#CD3D35] text-white' : 'text-[#555] hover:text-[#909090]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sales Tab ─────────────────────────────────────────────────────────── */}
      {tab === 'sales' && (
        <div className="space-y-5">
          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPI label="Total Leads"     value={salesKpis.total}         color="#3B82F6" />
            <KPI label="Active Pipeline" value={salesKpis.active}        color="#F59E0B" />
            <KPI label="Paid (leads)"    value={salesKpis.paid}          color="#22C55E" />
            <KPI label="Lead to Paid"    value={`${salesKpis.rate}%`}    color="#CD3D35" />
          </div>

          {/* Pipeline funnel */}
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#F2F2F2]">Pipeline Distribution</h3>
              <span className="text-[10px] text-[#555] font-mono">{salesKpis.total} leads across 12 stages</span>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineFunnel} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                  <XAxis dataKey="label" stroke="#555" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" height={36} />
                  <YAxis stroke="#555" tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: '#1A1A1A' }} />
                  <Bar dataKey="count" radius={[3, 3, 0, 0]} name="Leads">
                    {pipelineFunnel.map((stage) => (
                      <Cell key={stage.id} fill={stage.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dials + Revenue */}
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-1">
                <Phone size={13} className="text-[#CD3D35]" />
                <h3 className="text-sm font-semibold text-[#F2F2F2]">Dials by Week</h3>
              </div>
              <p className="text-[10px] text-[#555] mb-4">Total dials: {dials.length}</p>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dialsByWeek} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                    <XAxis dataKey="week" stroke="#555" tick={{ fontSize: 8 }} />
                    <YAxis stroke="#555" tick={{ fontSize: 10 }} allowDecimals={false} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: '#1A1A1A' }} />
                    <Bar dataKey="count" fill="#CD3D35" radius={[3, 3, 0, 0]} name="Dials" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign size={13} className="text-green-400" />
                <h3 className="text-sm font-semibold text-[#F2F2F2]">Revenue by Month</h3>
              </div>
              <p className="text-[10px] text-[#555] mb-4">
                Active MRR: <span className="text-green-400">${salesKpis.totalMRR.toLocaleString()}</span>
              </p>
              <div className="h-40">
                {revenueByMonth.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueByMonth} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                      <XAxis dataKey="month" stroke="#555" tick={{ fontSize: 9 }} />
                      <YAxis stroke="#555" tick={{ fontSize: 10 }} />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: '#1A1A1A' }} />
                      <Area type="monotone" dataKey="upfront" stackId="1" stroke="#22C55E" fill="#22C55E" fillOpacity={0.12} name="Upfront" />
                      <Area type="monotone" dataKey="mrr"     stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.12} name="MRR" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-[#383838] text-xs">No revenue data yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lost leads breakdown */}
          {salesKpis.lost > 0 && (
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-[#F2F2F2] mb-3">Lost Lead Analysis</h3>
              <div className="grid grid-cols-3 gap-4">
                {(() => {
                  const lostLeads = allLeads.filter(l => resolveStage(l.status) === 'lost');
                  const objections: Record<string, number> = {};
                  lostLeads.forEach(l => {
                    const match = l.summary?.match(/\[Lost: ([^\]]+)\]/);
                    const obj = match ? match[1] : 'Untagged';
                    objections[obj] = (objections[obj] || 0) + 1;
                  });
                  return Object.entries(objections)
                    .sort(([,a],[,b]) => b - a)
                    .slice(0, 3)
                    .map(([obj, count]) => (
                      <div key={obj} className="bg-[#0A0A0A] rounded-lg p-3">
                        <p className="text-lg font-bold text-[#F2F2F2] font-mono">{count}</p>
                        <p className="text-[10px] text-[#555]">{obj}</p>
                      </div>
                    ));
                })()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Content Tab ───────────────────────────────────────────────────────── */}
      {tab === 'content' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPI label="Total Scripts"    value={contentKpis.total}      color="#8B5CF6" />
            <KPI label="Written This Week" value={contentKpis.thisWeek}  color="#F59E0B" />
            <KPI label="Posted"           value={contentKpis.posted}     color="#22C55E" />
            <KPI label="In Pipeline"      value={contentKpis.inPipeline} color="#3B82F6" />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-[#F2F2F2] mb-4">Scripts by Stage</h3>
              <div className="h-44">
                {scripts.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scriptStageData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                      <XAxis dataKey="status" stroke="#555" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#555" tick={{ fontSize: 10 }} allowDecimals={false} />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: '#1A1A1A' }} />
                      <Bar dataKey="count" radius={[3, 3, 0, 0]} name="Scripts">
                        {scriptStageData.map((s) => (
                          <Cell key={s.status} fill={s.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-[#383838] text-xs">No scripts yet. Generate your first in Studio.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-[#F2F2F2] mb-4">Stage Velocity</h3>
              {scripts.length === 0 ? (
                <div className="h-40 flex items-center justify-center">
                  <p className="text-[#383838] text-xs">No scripts yet</p>
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  {scriptStageData.map(s => {
                    const pct = scripts.length > 0 ? Math.round((s.count / scripts.length) * 100) : 0;
                    return (
                      <div key={s.status}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-[#909090]">{s.status}</span>
                          <span className="text-xs font-mono text-[#555]">{s.count} ({pct}%)</span>
                        </div>
                        <div className="h-1.5 bg-[#1E1E1E] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: s.color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Posting cadence note */}
          <div className="bg-[#141414] border border-[#1A1A1A] rounded-xl p-4 flex items-start gap-3">
            <Layers size={15} className="text-[#8B5CF6] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[#F2F2F2] mb-0.5">Performance tracking</p>
              <p className="text-xs text-[#555] leading-relaxed">
                Post-level analytics (views, likes, saves) will appear here once you link posted scripts to their social posts via the Radar tab. Mark a script as Posted in Script Board to begin tracking.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Attribution Tab ───────────────────────────────────────────────────── */}
      {tab === 'attribution' && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <KPI label="Active Clients"  value={clients.filter(c => c.status === 'active').length} color="#22C55E" />
            <KPI label="Active MRR"      value={`$${salesKpis.totalMRR.toLocaleString()}`}          color="#3B82F6" />
            <KPI label="ARR Run Rate"    value={`$${totalARR.toLocaleString()}`}                    color="#8B5CF6" />
          </div>

          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#1A1A1A] flex items-center gap-2">
              <Link2 size={13} className="text-[#CD3D35]" />
              <h3 className="text-sm font-semibold text-[#F2F2F2]">Client Attribution</h3>
              <span className="ml-auto text-[10px] text-[#555]">{clients.length} clients</span>
            </div>

            {clients.length === 0 ? (
              <div className="py-16 text-center">
                <Target size={28} className="mx-auto mb-3 text-[#383838]" />
                <p className="text-sm text-[#555]">No clients yet</p>
                <p className="text-xs text-[#383838] mt-1">Close your first deal via the Pipeline to track attribution.</p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-5 text-[10px] text-[#555] uppercase tracking-wider font-semibold px-5 py-2 border-b border-[#1A1A1A]">
                  <span className="col-span-2">Client</span>
                  <span>Revenue</span>
                  <span>Close Date</span>
                  <span>Content Source</span>
                </div>
                <div className="divide-y divide-[#1A1A1A]">
                  {clients.map(c => (
                    <div key={c.id} className="grid grid-cols-5 items-center px-5 py-3 hover:bg-[#141414]/50 transition-colors">
                      <div className="col-span-2 min-w-0">
                        <p className="text-xs font-medium text-[#F2F2F2] truncate">{c.name}</p>
                        <p className="text-[10px] text-[#555] truncate">{c.company}</p>
                      </div>
                      <div>
                        <p className="text-xs font-mono text-green-400">${(c.upfrontValue + c.monthlyValue).toLocaleString()}</p>
                        {c.monthlyValue > 0 && <p className="text-[10px] text-[#555]">${c.monthlyValue}/mo</p>}
                      </div>
                      <p className="text-xs text-[#909090] font-mono">{c.closeDate}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#383838] border border-[#1A1A1A] rounded px-1.5 py-0.5">Not linked</span>
                        <button className="text-[10px] text-[#CD3D35] hover:underline">Link</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#0A0A0A] border border-[#1A1A1A] border-dashed rounded-xl p-5 flex items-start gap-3">
            <AlertCircle size={14} className="text-[#383838] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[#555] mb-1">How attribution works</p>
              <p className="text-xs text-[#383838] leading-relaxed">
                When a prospect reaches out after seeing your content, link the reel to the lead in the Pipeline detail panel. When the deal closes, the content piece is credited. Over time this shows you which formats, hooks, and topics drive the most revenue. Full tracking is being built out.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
