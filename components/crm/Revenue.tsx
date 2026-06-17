import React, { useMemo } from 'react';
import { DollarSign, TrendingUp, Users, Calendar, CreditCard, BarChart2 } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, CartesianGrid } from 'recharts';
import { Client } from './types';

interface RevenueProps {
  clients: Client[];
}

const StatCard: React.FC<{
  icon: React.FC<{ size?: number; className?: string }>;
  label: string;
  value: string;
  sub?: string;
  color?: string;
}> = ({ icon: Icon, label, value, sub, color = '#CD3D35' }) => (
  <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-4">
    <div className="flex items-center justify-between mb-3">
      <p className="text-[10px] text-[#555] uppercase tracking-wider font-semibold">{label}</p>
      <div className="p-1.5 rounded" style={{ background: color + '15' }}>
        <Icon size={13} style={{ color }} />
      </div>
    </div>
    <p className="text-2xl font-bold font-mono text-[#F2F2F2]">{value}</p>
    {sub && <p className="text-[10px] text-[#555] mt-1">{sub}</p>}
  </div>
);

const Revenue: React.FC<RevenueProps> = ({ clients }) => {
  const stats = useMemo(() => {
    const active = clients.filter(c => c.status === 'active');
    const mrr = active.reduce((sum, c) => sum + (c.monthlyValue ?? 0), 0);
    const arr = mrr * 12;
    const totalUpfront = clients.reduce((sum, c) => sum + (c.upfrontValue ?? 0), 0);
    const totalMonthly = active.reduce((sum, c) => sum + (c.monthlyValue ?? 0), 0);
    const avgDeal = clients.length > 0
      ? Math.round(clients.reduce((sum, c) => sum + (c.upfrontValue ?? 0) + ((c.monthlyValue ?? 0) * 3), 0) / clients.length)
      : 0;
    const ltv = mrr > 0 && clients.length > 0 ? Math.round((mrr / active.length) * 12) : 0;

    return { mrr, arr, totalUpfront, totalMonthly, active: active.length, total: clients.length, avgDeal, ltv };
  }, [clients]);

  // Build monthly revenue chart from close dates
  const chartData = useMemo(() => {
    const now = new Date();
    const months: Record<string, { month: string; upfront: number; mrr: number }> = {};

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('default', { month: 'short' });
      months[key] = { month: label, upfront: 0, mrr: 0 };
    }

    clients.forEach(c => {
      if (!c.closeDate) return;
      const key = c.closeDate.slice(0, 7);
      if (months[key]) {
        months[key].upfront += c.upfrontValue ?? 0;
        months[key].mrr += c.monthlyValue ?? 0;
      }
    });

    return Object.values(months);
  }, [clients]);

  const fmt = (n: number) => {
    if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'k';
    return '$' + n.toLocaleString();
  };

  return (
    <div className="p-5 space-y-5 overflow-y-auto h-full">
      <div>
        <h2 className="text-sm font-semibold text-[#F2F2F2] mb-0.5">Revenue</h2>
        <p className="text-xs text-[#555]">Financial overview across all clients.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard icon={TrendingUp}  label="MRR"             value={fmt(stats.mrr)}        sub={`${stats.active} active clients`} color="#22C55E" />
        <StatCard icon={BarChart2}   label="ARR"             value={fmt(stats.arr)}        sub="Annualized run rate"               color="#3B82F6" />
        <StatCard icon={DollarSign}  label="Total Upfront"   value={fmt(stats.totalUpfront)} sub="All-time collected"             color="#CD3D35" />
        <StatCard icon={CreditCard}  label="Monthly Revenue" value={fmt(stats.totalMonthly)} sub="From active retainers"          color="#8B5CF6" />
        <StatCard icon={Users}       label="Active Clients"  value={String(stats.active)}  sub={`${stats.total} total clients`}   color="#F59E0B" />
        <StatCard icon={Calendar}    label="Avg LTV / Year"  value={fmt(stats.ltv)}        sub="Per active client"                color="#EC4899" />
      </div>

      {/* Chart */}
      {clients.length > 0 && (
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-[#F2F2F2]">Revenue by Month</p>
              <p className="text-[10px] text-[#555]">Upfront payments closed per month (last 12 months)</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="upfrontGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#CD3D35" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#CD3D35" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: 6, fontSize: 11 }}
                labelStyle={{ color: '#F2F2F2' }}
                formatter={(value: any) => ['$' + Number(value).toLocaleString()]}
              />
              <Area type="monotone" dataKey="upfront" stroke="#CD3D35" strokeWidth={1.5} fill="url(#upfrontGrad)" name="Upfront" />
              <Area type="monotone" dataKey="mrr" stroke="#22C55E" strokeWidth={1.5} fill="url(#mrrGrad)" name="New MRR" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Client table */}
      {clients.length > 0 && (
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[#1A1A1A]">
            <p className="text-xs font-semibold text-[#F2F2F2]">Client Breakdown</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1A1A1A]">
                  <th className="text-left px-4 py-2 text-[10px] text-[#555] font-semibold uppercase tracking-wider">Client</th>
                  <th className="text-right px-4 py-2 text-[10px] text-[#555] font-semibold uppercase tracking-wider">Upfront</th>
                  <th className="text-right px-4 py-2 text-[10px] text-[#555] font-semibold uppercase tracking-wider">Monthly</th>
                  <th className="text-right px-4 py-2 text-[10px] text-[#555] font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, idx) => (
                  <tr key={client.id} className={`border-b border-[#1A1A1A] last:border-0 ${idx % 2 === 0 ? '' : 'bg-[#0F0F0F]'}`}>
                    <td className="px-4 py-2.5">
                      <p className="font-medium text-[#F2F2F2]">{client.name}</p>
                      {client.company && <p className="text-[10px] text-[#555]">{client.company}</p>}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-[#F2F2F2]">{fmt(client.upfrontValue ?? 0)}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-green-400">{client.monthlyValue ? fmt(client.monthlyValue) + '/mo' : '-'}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${client.status === 'active' ? 'bg-green-500/15 text-green-400' : 'bg-[#2A2A2A] text-[#555]'}`}>
                        {client.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {clients.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 gap-2 text-center">
          <DollarSign size={28} className="text-[#2A2A2A]" />
          <p className="text-sm text-[#383838]">No clients yet</p>
          <p className="text-xs text-[#383838]">Add clients in the Clients tab to track revenue.</p>
        </div>
      )}
    </div>
  );
};

export default Revenue;
