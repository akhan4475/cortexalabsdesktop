import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// ── Types ─────────────────────────────────────────────────────────────────────

interface AgentRun {
  id: string;
  agent_name: string;
  command: string;
  metrics: Record<string, unknown> | null;
  created_at: string;
}

// ── Agent color map ───────────────────────────────────────────────────────────

const AGENT_COLORS: Record<string, string> = {
  boss:     '#8B5CF6',
  scout:    '#3B82F6',
  setter:   '#06B6D4',
  sales:    '#22C55E',
  factory:  '#F97316',
  analyst:  '#F59E0B',
  content:  '#EC4899',
};

function getAgentColor(agentName: string): string {
  const key = agentName.toLowerCase().split(/[\s_-]/)[0];
  return AGENT_COLORS[key] ?? '#555555';
}

// ── Metrics summary parser ────────────────────────────────────────────────────

function parseMetricsSummary(metrics: Record<string, unknown> | null): string {
  if (!metrics) return '';
  const parts: string[] = [];
  const entries = Object.entries(metrics);
  for (const [key, val] of entries.slice(0, 3)) {
    if (typeof val === 'number' || typeof val === 'string') {
      const label = key.replace(/_/g, ' ');
      parts.push(`${val} ${label}`);
    }
  }
  return parts.join(' · ');
}

// ── Time ago helper ───────────────────────────────────────────────────────────

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// ── Main Component ────────────────────────────────────────────────────────────

const AgentActivity: React.FC = () => {
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRuns = async () => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('agent_runs')
      .select('id, agent_name, command, metrics, created_at')
      .gte('created_at', todayStart.toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setRuns(data as AgentRun[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRuns();
    const interval = setInterval(fetchRuns, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#111111] border border-[#1E1E1E] rounded overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A1A1A]">
        <div className="flex items-center gap-2">
          <p className="text-[11px] font-semibold text-[#F2F2F2]">Agent Activity</p>
          <span className="text-[9px] font-mono text-[#444] border border-[#2A2A2A] px-1.5 py-0.5 rounded uppercase tracking-widest">
            today
          </span>
        </div>
        <Zap size={11} className="text-[#444]" />
      </div>

      {/* Body */}
      <div className="divide-y divide-[#1A1A1A]">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-[11px] text-[#333] font-mono">Loading...</p>
          </div>
        ) : runs.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-[11px] text-[#333] text-center px-4 font-mono">
              No agents run today. Start with /brief in Telegram.
            </p>
          </div>
        ) : (
          runs.map(run => {
            const color   = getAgentColor(run.agent_name);
            const summary = parseMetricsSummary(run.metrics);
            return (
              <div key={run.id} className="flex items-start gap-2 px-4 py-2 hover:bg-[#141414] transition-colors">
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className="text-[9px] font-mono font-semibold uppercase tracking-wide border px-1 py-px rounded shrink-0"
                      style={{ color, borderColor: color + '40' }}
                    >
                      {run.agent_name}
                    </span>
                    <span className="text-[10px] text-[#555] font-mono truncate">{run.command}</span>
                  </div>
                  {summary && (
                    <p className="text-[9px] text-[#444] font-mono mt-0.5 truncate">{summary}</p>
                  )}
                </div>

                {/* Time */}
                <span className="text-[9px] text-[#333] font-mono shrink-0 mt-0.5">
                  {timeAgo(run.created_at)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AgentActivity;
