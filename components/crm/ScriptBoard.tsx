import React, { useState, useEffect } from 'react';
import { Plus, X, Clock, CheckCircle2, Video, Edit3, Upload, Trash2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNiche } from '../../lib/NicheContext';
import { supabase } from '../../lib/supabase';

const BOARD_STAGES = [
  { id: 'idea',    label: 'Idea',    color: '#555555' },
  { id: 'approved',label: 'Approved',color: '#3B82F6' },
  { id: 'shot',    label: 'Shot',    color: '#F59E0B' },
  { id: 'edited',  label: 'Edited',  color: '#8B5CF6' },
  { id: 'posted',  label: 'Posted',  color: '#22C55E' },
];

interface Script {
  id: string;
  user_id?: string;
  niche?: string;
  hook: string;
  body?: string;
  cta?: string;
  caption?: string;
  hashtags?: string[];
  format?: string;
  stage: string;
  created_at?: string;
  updated_at?: string;
  platform?: string;
  posted_at?: string;
  why_it_works?: string;
}

const daysSince = (iso?: string): number => {
  if (!iso) return 0;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
};

const ScriptCard: React.FC<{
  script: Script;
  onMove: (stageId: string) => void;
  onDelete: () => void;
}> = ({ script, onMove, onDelete }) => {
  const stale = daysSince(script.updated_at ?? script.created_at) > 5 && script.stage !== 'posted';
  const stageNext = BOARD_STAGES.find((_, i) => BOARD_STAGES[i - 1]?.id === script.stage);

  return (
    <div className={`bg-[#141414] border rounded-lg p-3 group relative ${stale ? 'border-yellow-500/30' : 'border-[#2A2A2A] hover:border-[#383838]'} transition-colors`}>
      {stale && (
        <div className="flex items-center gap-1 mb-2">
          <AlertCircle size={9} className="text-yellow-500" />
          <span className="text-[9px] text-yellow-500/80 font-medium">Stalled {daysSince(script.updated_at ?? script.created_at)}d</span>
        </div>
      )}
      <p className="text-xs font-medium text-[#F2F2F2] leading-snug mb-1.5 line-clamp-3">{script.hook}</p>
      {script.format && <span className="text-[9px] text-[#555] font-mono">{script.format}</span>}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1A1A1A]">
        {stageNext ? (
          <button
            onClick={() => onMove(stageNext.id)}
            className="text-[10px] text-[#CD3D35] hover:text-[#E85550] font-medium transition-colors flex items-center gap-1"
          >
            Move to {stageNext.label} →
          </button>
        ) : (
          script.stage !== 'posted' && (
            <button onClick={() => onMove('posted')} className="text-[10px] text-green-400 font-medium">Mark Posted</button>
          )
        )}
        <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 p-1 rounded text-[#555] hover:text-red-500 transition-all">
          <Trash2 size={10} />
        </button>
      </div>
    </div>
  );
};

const ScriptBoard: React.FC = () => {
  const { activeNiche } = useNiche();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [addStage, setAddStage] = useState<string | null>(null);
  const [newHook, setNewHook] = useState('');

  const load = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('scripts').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (data) setScripts(data as Script[]);
    } catch { /* table may not exist */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const moveScript = async (id: string, stageId: string) => {
    setScripts(prev => prev.map(s => s.id === id ? { ...s, stage: stageId, updated_at: new Date().toISOString() } : s));
    try {
      await supabase.from('scripts').update({ stage: stageId, updated_at: new Date().toISOString() }).eq('id', id);
    } catch {}
  };

  const deleteScript = async (id: string) => {
    setScripts(prev => prev.filter(s => s.id !== id));
    try { await supabase.from('scripts').delete().eq('id', id); } catch {}
  };

  const addScript = async (stage: string) => {
    if (!newHook.trim()) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const newScript: Script = {
        id: `script-${Date.now()}`,
        user_id: user.id,
        niche: activeNiche,
        hook: newHook.trim(),
        stage,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await supabase.from('scripts').insert(newScript);
      setScripts(prev => [newScript, ...prev]);
      setNewHook('');
      setAddStage(null);
    } catch {}
  };

  const scriptsByStage = (stageId: string) => scripts.filter(s => (s.stage ?? 'idea') === stageId);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-5 h-5 border-2 border-[#CD3D35] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#1A1A1A] shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-[#F2F2F2]">Script Board</span>
          <span className="text-xs text-[#555] font-mono">{scripts.length} scripts</span>
        </div>
        <button
          onClick={() => { setAddStage('idea'); setNewHook(''); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#CD3D35] text-white rounded text-xs font-medium hover:bg-[#E85550] transition-colors"
        >
          <Plus size={12} /> Add Script
        </button>
      </div>

      <div className="flex-1 overflow-x-auto pipeline-scroll">
        <div className="flex h-full min-w-max">
          {BOARD_STAGES.map(stage => {
            const stageScripts = scriptsByStage(stage.id);
            return (
              <div key={stage.id} className="flex flex-col w-56 border-r border-[#1A1A1A] last:border-r-0">
                <div className="px-3 py-2.5 border-b border-[#1A1A1A] shrink-0 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
                  <span className="text-xs font-medium text-[#909090]">{stage.label}</span>
                  <span className="ml-auto text-[10px] font-mono text-[#555]">{stageScripts.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2" style={{ scrollbarWidth: 'none' }}>
                  {/* Add card for this stage */}
                  {addStage === stage.id && (
                    <div className="bg-[#141414] border border-[#CD3D35]/40 rounded-lg p-2.5">
                      <textarea
                        value={newHook}
                        onChange={e => setNewHook(e.target.value)}
                        placeholder="Enter hook / script idea..."
                        rows={3}
                        autoFocus
                        className="w-full bg-transparent text-xs text-[#F2F2F2] placeholder-[#555] focus:outline-none resize-none"
                        onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) addScript(stage.id); }}
                      />
                      <div className="flex gap-1.5 mt-1.5">
                        <button onClick={() => addScript(stage.id)} className="flex-1 text-[10px] bg-[#CD3D35] text-white py-1 rounded font-medium">Add</button>
                        <button onClick={() => setAddStage(null)} className="px-2 text-[10px] text-[#555] hover:text-[#909090]"><X size={10} /></button>
                      </div>
                    </div>
                  )}
                  {stageScripts.map(script => (
                    <ScriptCard
                      key={script.id}
                      script={script}
                      onMove={(newStage) => moveScript(script.id, newStage)}
                      onDelete={() => deleteScript(script.id)}
                    />
                  ))}
                  {stageScripts.length === 0 && addStage !== stage.id && (
                    <button
                      onClick={() => { setAddStage(stage.id); setNewHook(''); }}
                      className="w-full h-14 flex items-center justify-center rounded-lg border border-dashed border-[#2A2A2A] hover:border-[#383838] text-[#383838] hover:text-[#555] transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScriptBoard;
