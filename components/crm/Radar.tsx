import React, { useState, useEffect } from 'react';
import { Plus, X, TrendingUp, Eye, Zap, RefreshCw, Loader2, Trash2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNiche } from '../../lib/NicheContext';
import { NICHES } from '../../lib/niches';
import { supabase } from '../../lib/supabase';

interface WatchItem {
  id: string;
  user_id?: string;
  niche?: string;
  platform: string;
  handle: string;
  label?: string;
  created_at?: string;
}

interface Signal {
  id: string;
  user_id?: string;
  watch_id?: string;
  platform?: string;
  creator_handle?: string;
  title?: string;
  url?: string;
  views?: number;
  likes?: number;
  comments?: number;
  posted_at?: string;
  velocity_score?: number;
  status?: string;
  created_at?: string;
}

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: '#E1306C' },
  { id: 'tiktok',    label: 'TikTok',    color: '#69C9D0' },
  { id: 'youtube',   label: 'YouTube',   color: '#FF0000' },
];

const fmtNum = (n?: number): string => {
  if (!n) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
};

const velColor = (score?: number): string => {
  if (!score) return '#555';
  if (score >= 7) return '#22C55E';
  if (score >= 4) return '#F59E0B';
  return '#EF4444';
};

const Radar: React.FC = () => {
  const { activeNiche } = useNiche();
  const niche = NICHES.find(n => n.id === activeNiche);
  const [watchItems, setWatchItems] = useState<WatchItem[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ platform: 'instagram', handle: '', label: '' });
  const [addSignalOpen, setAddSignalOpen] = useState(false);
  const [sigForm, setSigForm] = useState({ creator_handle: '', title: '', url: '', views: '', platform: 'instagram' });

  const load = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [wData, sData] = await Promise.all([
        supabase.from('niche_watch').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('niche_signals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
      ]);
      if (wData.data) setWatchItems(wData.data as WatchItem[]);
      if (sData.data) setSignals(sData.data as Signal[]);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [activeNiche]);

  const addWatch = async () => {
    if (!addForm.handle.trim()) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const item: WatchItem = {
        id: `watch-${Date.now()}`,
        user_id: user.id,
        niche: activeNiche,
        platform: addForm.platform,
        handle: addForm.handle.trim().replace('@', ''),
        label: addForm.label.trim() || undefined,
        created_at: new Date().toISOString(),
      };
      await supabase.from('niche_watch').insert(item);
      setWatchItems(prev => [item, ...prev]);
      setAddForm({ platform: 'instagram', handle: '', label: '' });
      setShowAdd(false);
    } catch {}
  };

  const removeWatch = async (id: string) => {
    setWatchItems(prev => prev.filter(w => w.id !== id));
    try { await supabase.from('niche_watch').delete().eq('id', id); } catch {}
  };

  const addSignal = async () => {
    if (!sigForm.title.trim()) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const views = parseInt(sigForm.views) || 0;
      const velScore = Math.min(10, Math.max(1, Math.round(Math.log10(views + 1) * 2)));
      const signal: Signal = {
        id: `sig-${Date.now()}`,
        user_id: user.id,
        platform: sigForm.platform,
        creator_handle: sigForm.creator_handle.trim() || undefined,
        title: sigForm.title.trim(),
        url: sigForm.url.trim() || undefined,
        views,
        velocity_score: velScore,
        status: 'new',
        created_at: new Date().toISOString(),
      };
      await supabase.from('niche_signals').insert(signal);
      setSignals(prev => [signal, ...prev]);
      setSigForm({ creator_handle: '', title: '', url: '', views: '', platform: 'instagram' });
      setAddSignalOpen(false);
    } catch {}
  };

  const updateSignalStatus = async (id: string, status: string) => {
    setSignals(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    try { await supabase.from('niche_signals').update({ status }).eq('id', id); } catch {}
  };

  const deleteSignal = async (id: string) => {
    setSignals(prev => prev.filter(s => s.id !== id));
    try { await supabase.from('niche_signals').delete().eq('id', id); } catch {}
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={18} className="text-[#555] animate-spin" />
    </div>
  );

  return (
    <div className="flex h-full overflow-hidden">
      {/* Watch list sidebar */}
      <div className="w-56 shrink-0 border-r border-[#1A1A1A] flex flex-col">
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#1A1A1A]">
          <p className="text-xs font-semibold text-[#F2F2F2]">Watch List</p>
          <button onClick={() => setShowAdd(v => !v)} className="p-1 rounded text-[#555] hover:text-[#CD3D35] hover:bg-[#CD3D35]/10 transition-colors">
            <Plus size={13} />
          </button>
        </div>

        {showAdd && (
          <div className="p-3 border-b border-[#1A1A1A] space-y-2">
            <div className="flex gap-1">
              {PLATFORMS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setAddForm(f => ({ ...f, platform: p.id }))}
                  className={`flex-1 py-1 rounded text-[9px] font-medium border transition-colors ${addForm.platform === p.id ? 'border-current' : 'border-[#2A2A2A] text-[#555]'}`}
                  style={addForm.platform === p.id ? { color: p.color, borderColor: p.color + '66', background: p.color + '15' } : {}}
                >
                  {p.label.slice(0, 2)}
                </button>
              ))}
            </div>
            <input
              value={addForm.handle}
              onChange={e => setAddForm(f => ({ ...f, handle: e.target.value }))}
              placeholder="@handle"
              className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-2 py-1 text-xs text-[#F2F2F2] placeholder-[#555] focus:outline-none"
            />
            <input
              value={addForm.label}
              onChange={e => setAddForm(f => ({ ...f, label: e.target.value }))}
              placeholder="Label (optional)"
              className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-2 py-1 text-xs text-[#F2F2F2] placeholder-[#555] focus:outline-none"
            />
            <div className="flex gap-1">
              <button onClick={addWatch} className="flex-1 text-[10px] py-1 bg-[#CD3D35] text-white rounded font-medium">Add</button>
              <button onClick={() => setShowAdd(false)} className="px-2 text-[#555] hover:text-[#909090]"><X size={10} /></button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto py-1" style={{ scrollbarWidth: 'none' }}>
          {watchItems.length === 0 ? (
            <p className="text-[10px] text-[#383838] text-center mt-8 px-3">No accounts watched yet. Add creators to track.</p>
          ) : watchItems.map(w => {
            const plt = PLATFORMS.find(p => p.id === w.platform);
            return (
              <div key={w.id} className="flex items-center gap-2 px-3 py-2 hover:bg-[#141414] group transition-colors">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: plt?.color ?? '#555' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[#F2F2F2] truncate">@{w.handle}</p>
                  {w.label && <p className="text-[9px] text-[#555] truncate">{w.label}</p>}
                </div>
                <button onClick={() => removeWatch(w.id)} className="opacity-0 group-hover:opacity-100 text-[#555] hover:text-red-500 transition-all">
                  <X size={10} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Signal feed */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#1A1A1A] shrink-0">
          <div className="flex items-center gap-2">
            <Zap size={13} className="text-[#CD3D35]" />
            <span className="text-sm font-semibold text-[#F2F2F2]">Signals</span>
            <span className="text-xs text-[#555] font-mono">{signals.length} captured</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={load} className="p-1.5 rounded text-[#555] hover:text-[#909090] hover:bg-[#141414] transition-colors">
              <RefreshCw size={12} />
            </button>
            <button
              onClick={() => setAddSignalOpen(v => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1E1E1E] border border-[#2A2A2A] text-white rounded text-xs font-medium hover:bg-[#252525] transition-colors"
            >
              <Plus size={11} /> Log Signal
            </button>
          </div>
        </div>

        {addSignalOpen && (
          <div className="px-5 py-3 border-b border-[#1A1A1A] bg-[#141414]">
            <div className="flex gap-2 flex-wrap">
              <div className="flex gap-1">
                {PLATFORMS.map(p => (
                  <button key={p.id} onClick={() => setSigForm(f => ({ ...f, platform: p.id }))}
                    className={`px-2 py-0.5 rounded text-[9px] font-medium border transition-colors ${sigForm.platform === p.id ? 'border-current' : 'border-[#2A2A2A] text-[#555]'}`}
                    style={sigForm.platform === p.id ? { color: p.color, borderColor: p.color + '66', background: p.color + '15' } : {}}>
                    {p.label}
                  </button>
                ))}
              </div>
              <input value={sigForm.creator_handle} onChange={e => setSigForm(f => ({ ...f, creator_handle: e.target.value }))} placeholder="@creator" className="bg-[#0A0A0A] border border-[#2A2A2A] rounded px-2 py-1 text-xs text-[#F2F2F2] placeholder-[#555] focus:outline-none w-28" />
              <input value={sigForm.title} onChange={e => setSigForm(f => ({ ...f, title: e.target.value }))} placeholder="Post title or topic *" className="flex-1 min-w-[160px] bg-[#0A0A0A] border border-[#2A2A2A] rounded px-2 py-1 text-xs text-[#F2F2F2] placeholder-[#555] focus:outline-none" />
              <input value={sigForm.views} onChange={e => setSigForm(f => ({ ...f, views: e.target.value }))} placeholder="Views" type="number" className="bg-[#0A0A0A] border border-[#2A2A2A] rounded px-2 py-1 text-xs text-[#F2F2F2] placeholder-[#555] focus:outline-none w-24" />
              <input value={sigForm.url} onChange={e => setSigForm(f => ({ ...f, url: e.target.value }))} placeholder="URL (optional)" className="bg-[#0A0A0A] border border-[#2A2A2A] rounded px-2 py-1 text-xs text-[#F2F2F2] placeholder-[#555] focus:outline-none w-40" />
              <button onClick={addSignal} className="px-3 py-1 bg-[#CD3D35] text-white rounded text-xs font-medium hover:bg-[#E85550] transition-colors">Log</button>
              <button onClick={() => setAddSignalOpen(false)} className="px-2 py-1 text-[#555] hover:text-[#909090] text-xs">Cancel</button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5">
          {signals.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-center">
              <TrendingUp size={28} className="text-[#2A2A2A]" />
              <p className="text-sm text-[#383838]">No signals yet</p>
              <p className="text-xs text-[#383838] max-w-sm">Log viral posts you find in your niche. Track what's working and get ideas for your own content.</p>
            </div>
          ) : (
            <div className="space-y-2 max-w-2xl">
              {signals.map(signal => {
                const plt = PLATFORMS.find(p => p.id === signal.platform);
                return (
                  <motion.div
                    key={signal.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-3 hover:border-[#383838] transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      {/* Velocity score */}
                      <div className="shrink-0 text-center w-10">
                        <p className="text-lg font-bold font-mono" style={{ color: velColor(signal.velocity_score) }}>
                          {signal.velocity_score ?? '?'}
                        </p>
                        <p className="text-[8px] text-[#555] uppercase tracking-wider">vel</p>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {plt && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ color: plt.color, background: plt.color + '20' }}>{plt.label}</span>}
                          {signal.creator_handle && <span className="text-[10px] text-[#555]">@{signal.creator_handle}</span>}
                        </div>
                        <p className="text-xs font-medium text-[#F2F2F2] leading-snug">{signal.title}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <div className="flex items-center gap-1 text-[10px] text-[#555]">
                            <Eye size={10} />
                            <span className="font-mono">{fmtNum(signal.views)}</span>
                          </div>
                          {signal.url && (
                            <a href={signal.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-[#3B82F6] hover:underline">
                              <ExternalLink size={9} /> View post
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {signal.status !== 'scripted' && (
                          <button
                            onClick={() => updateSignalStatus(signal.id!, 'scripted')}
                            className="px-2 py-1 rounded text-[10px] bg-[#1E1E1E] border border-[#2A2A2A] text-[#909090] hover:text-[#F2F2F2] transition-colors"
                          >
                            Scripted
                          </button>
                        )}
                        <button onClick={() => deleteSignal(signal.id!)} className="p-1 rounded text-[#555] hover:text-red-500 transition-colors">
                          <Trash2 size={11} />
                        </button>
                      </div>

                      {signal.status === 'scripted' && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/15 text-green-400 border border-green-500/30 shrink-0">Scripted</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Radar;
