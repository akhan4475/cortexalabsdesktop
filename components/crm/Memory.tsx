import React, { useState, useEffect, useCallback } from 'react';
import {
    Brain, Plus, Loader2, RefreshCw, Sparkles, Clock,
    TrendingUp, Phone, CheckCircle2, FileText, MessageSquare,
    Star, X, ChevronDown, ChevronRight, Edit3, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { generateMemorySynthesis } from '../../lib/ai';
import type { MemoryEntry, Decision } from './types';

type SubView = 'feed' | 'decisions' | 'brief';

const SUB_TABS: { id: SubView; label: string }[] = [
    { id: 'feed',      label: 'Memory Feed'    },
    { id: 'decisions', label: 'Decisions Log'  },
    { id: 'brief',     label: 'Daily Brief'    },
];

const MEMORY_TYPES = [
    { id: 'call_summary',      label: 'Call Summary',      icon: Phone,         color: '#3B82F6' },
    { id: 'lead_closed',       label: 'Lead Closed',       icon: CheckCircle2,  color: '#10B981' },
    { id: 'content_win',       label: 'Content Win',       icon: Star,          color: '#F59E0B' },
    { id: 'factory_complete',  label: 'Factory Complete',  icon: TrendingUp,    color: '#8B5CF6' },
    { id: 'post_mortem',       label: 'Post Mortem',       icon: FileText,      color: '#EF4444' },
    { id: 'weekly_review',     label: 'Weekly Review',     icon: Brain,         color: '#EC4899' },
    { id: 'decision',          label: 'Decision',          icon: MessageSquare, color: '#6B7280' },
    { id: 'note',              label: 'Note',              icon: FileText,      color: '#6B7280' },
] as const;

function memoryTypeInfo(type: string) {
    return MEMORY_TYPES.find(t => t.id === type) ?? MEMORY_TYPES[MEMORY_TYPES.length - 1];
}

// ─────────────────────────────────────────────────────────────────────────────
// Memory Feed
// ─────────────────────────────────────────────────────────────────────────────

const MemoryFeed: React.FC<{ userId: string; entries: MemoryEntry[]; onRefresh: () => void }> = ({ userId, entries, onRefresh }) => {
    const [showAdd, setShowAdd]   = useState(false);
    const [type, setType]         = useState('note');
    const [content, setContent]   = useState('');
    const [adding, setAdding]     = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleAdd = async () => {
        if (!content.trim()) return;
        setAdding(true);
        await supabase.from('memory_entries').insert({
            user_id: userId, type, content,
        });
        setContent('');
        setShowAdd(false);
        setAdding(false);
        onRefresh();
    };

    const handleDelete = async (id: string) => {
        await supabase.from('memory_entries').delete().eq('id', id);
        onRefresh();
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{entries.length} memory entries</p>
                <div className="flex items-center gap-2">
                    <button onClick={onRefresh} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <RefreshCw size={13} />
                    </button>
                    <button onClick={() => setShowAdd(s => !s)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-[#CD3D35] hover:bg-[#B83530] text-white text-xs font-bold rounded-lg transition-colors">
                        <Plus size={12} /> Add Memory
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showAdd && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        className="bg-[#0c0c0e] border border-white/10 rounded-xl p-4 space-y-3">
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Type</label>
                            <div className="flex flex-wrap gap-1.5">
                                {MEMORY_TYPES.map(t => (
                                    <button key={t.id} onClick={() => setType(t.id)}
                                        className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full transition-all ${type === t.id ? 'text-white border' : 'text-gray-500 bg-white/4 border border-white/8 hover:text-white'}`}
                                        style={type === t.id ? { background: `${t.color}20`, borderColor: `${t.color}40`, color: t.color } : {}}>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="What happened? What did you learn? What decision did you make?"
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CD3D35]/50 resize-none"
                        />
                        <div className="flex items-center gap-2 justify-end">
                            <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-xs text-gray-500 hover:text-white transition-colors">Cancel</button>
                            <button onClick={handleAdd} disabled={adding || !content.trim()}
                                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#CD3D35] hover:bg-[#B83530] text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50">
                                {adding ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                                {adding ? 'Saving...' : 'Save Memory'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {entries.length === 0 ? (
                <div className="border border-dashed border-white/10 rounded-xl p-10 text-center text-gray-600 space-y-2">
                    <Brain size={32} className="mx-auto text-gray-800" />
                    <p className="text-sm">No memories yet</p>
                    <p className="text-xs">Log your first call, decision, or insight to start building your business memory</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {entries.map(entry => {
                        const typeInfo = memoryTypeInfo(entry.type);
                        const Icon = typeInfo.icon;
                        const isExpanded = expandedId === entry.id;
                        const preview = entry.content.slice(0, 120);
                        const hasMore = entry.content.length > 120;

                        return (
                            <div key={entry.id} className="bg-[#0c0c0e] border border-white/8 rounded-xl overflow-hidden hover:border-white/15 transition-colors">
                                <div className="flex items-start gap-3 px-4 py-3">
                                    <div className="p-1.5 rounded-lg shrink-0 mt-0.5" style={{ background: `${typeInfo.color}18` }}>
                                        <Icon size={13} style={{ color: typeInfo.color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: typeInfo.color }}>{typeInfo.label}</span>
                                            <span className="text-[10px] text-gray-700 font-mono">{new Date(entry.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-300 leading-relaxed">
                                            {isExpanded ? entry.content : preview}
                                            {!isExpanded && hasMore && '...'}
                                        </p>
                                        {hasMore && (
                                            <button
                                                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                                                className="flex items-center gap-0.5 mt-1 text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
                                            >
                                                {isExpanded ? <><ChevronDown size={10} /> Less</> : <><ChevronRight size={10} /> More</>}
                                            </button>
                                        )}
                                    </div>
                                    <button onClick={() => handleDelete(entry.id)} className="text-gray-700 hover:text-red-400 transition-colors p-1 shrink-0">
                                        <X size={13} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Decisions Log
// ─────────────────────────────────────────────────────────────────────────────

const DecisionsLog: React.FC<{ userId: string; decisions: Decision[]; onRefresh: () => void }> = ({ userId, decisions, onRefresh }) => {
    const [showAdd, setShowAdd]     = useState(false);
    const [context, setContext]     = useState('');
    const [decision, setDecision]   = useState('');
    const [adding, setAdding]       = useState(false);
    const [editOutcome, setEditOutcome] = useState<{ id: string; value: string } | null>(null);

    const handleAdd = async () => {
        if (!context.trim() || !decision.trim()) return;
        setAdding(true);
        await supabase.from('decisions').insert({ user_id: userId, context, decision });
        setContext(''); setDecision('');
        setShowAdd(false);
        setAdding(false);
        onRefresh();
    };

    const saveOutcome = async (id: string, outcome: string) => {
        await supabase.from('decisions').update({ outcome, updated_at: new Date().toISOString() }).eq('id', id);
        setEditOutcome(null);
        onRefresh();
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{decisions.length} decisions logged</p>
                </div>
                <button onClick={() => setShowAdd(s => !s)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#CD3D35] hover:bg-[#B83530] text-white text-xs font-bold rounded-lg transition-colors">
                    <Plus size={12} /> Log Decision
                </button>
            </div>

            <AnimatePresence>
                {showAdd && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        className="bg-[#0c0c0e] border border-white/10 rounded-xl p-4 space-y-3">
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Context</label>
                            <textarea value={context} onChange={e => setContext(e.target.value)}
                                placeholder="What situation or problem prompted this decision?"
                                rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CD3D35]/50 resize-none" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Decision</label>
                            <textarea value={decision} onChange={e => setDecision(e.target.value)}
                                placeholder="What did you decide to do?"
                                rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CD3D35]/50 resize-none" />
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                            <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-xs text-gray-500 hover:text-white transition-colors">Cancel</button>
                            <button onClick={handleAdd} disabled={adding || !context.trim() || !decision.trim()}
                                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#CD3D35] hover:bg-[#B83530] text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50">
                                {adding ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                                {adding ? 'Logging...' : 'Log Decision'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {decisions.length === 0 ? (
                <div className="border border-dashed border-white/10 rounded-xl p-10 text-center text-gray-600 space-y-2">
                    <MessageSquare size={32} className="mx-auto text-gray-800" />
                    <p className="text-sm">No decisions logged yet</p>
                    <p className="text-xs">Track the decisions you make so you can revisit them when you have outcomes</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {decisions.map(d => (
                        <div key={d.id} className="bg-[#0c0c0e] border border-white/8 rounded-xl p-4 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <span className="text-[10px] font-bold text-gray-700 font-mono">{new Date(d.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Context</p>
                                    <p className="text-sm text-gray-400 leading-relaxed">{d.context}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-[#CD3D35] uppercase tracking-widest mb-1">Decision</p>
                                    <p className="text-sm text-white leading-relaxed">{d.decision}</p>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Outcome</p>
                                    <button onClick={() => setEditOutcome({ id: d.id, value: d.outcome ?? '' })}
                                        className="text-gray-700 hover:text-gray-400 transition-colors">
                                        <Edit3 size={11} />
                                    </button>
                                </div>
                                {editOutcome?.id === d.id ? (
                                    <div className="flex gap-2">
                                        <input value={editOutcome.value} onChange={e => setEditOutcome({ ...editOutcome, value: e.target.value })}
                                            placeholder="What actually happened?"
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#CD3D35]/50" />
                                        <button onClick={() => saveOutcome(d.id, editOutcome.value)}
                                            className="px-3 py-1.5 bg-[#CD3D35] text-white text-xs font-bold rounded-lg">Save</button>
                                        <button onClick={() => setEditOutcome(null)} className="px-3 py-1.5 text-gray-500 text-xs">Cancel</button>
                                    </div>
                                ) : (
                                    <p className={`text-sm leading-relaxed ${d.outcome ? 'text-emerald-400' : 'text-gray-700 italic'}`}>
                                        {d.outcome ?? 'Not yet recorded'}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Daily Brief
// ─────────────────────────────────────────────────────────────────────────────

const DailyBrief: React.FC<{ entries: MemoryEntry[] }> = ({ entries }) => {
    const [brief, setBrief]       = useState('');
    const [generating, setGenerating] = useState(false);
    const [error, setError]       = useState('');
    const [lastGenAt, setLastGenAt] = useState('');

    const generateBrief = async () => {
        setGenerating(true);
        setError('');
        try {
            const last30 = entries.slice(0, 30).map(e => `[${e.type}] ${e.content}`);
            const result = await generateMemorySynthesis(last30);
            setBrief(result);
            setLastGenAt(new Date().toLocaleTimeString());
        } catch (e: any) {
            setError(e.message ?? 'Failed to generate brief');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="space-y-5 max-w-2xl">
            <div className="bg-[#0c0c0e] border border-white/8 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-bold text-sm">Today's Brief</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Claude reads your last 30 memory entries and surfaces what matters today.</p>
                    </div>
                    {lastGenAt && <span className="text-[10px] text-gray-600 font-mono">Generated at {lastGenAt}</span>}
                </div>

                {brief ? (
                    <div className="p-4 bg-white/3 border border-white/8 rounded-xl">
                        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{brief}</p>
                    </div>
                ) : (
                    <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-gray-600 space-y-2">
                        <Sparkles size={28} className="mx-auto text-gray-800" />
                        <p className="text-sm">Your brief appears here</p>
                        <p className="text-xs">Requires at least 3 memory entries and your Anthropic key</p>
                    </div>
                )}

                {error && <p className="text-xs text-red-400">{error}</p>}

                <button
                    onClick={generateBrief}
                    disabled={generating || entries.length < 3}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#CD3D35] hover:bg-[#B83530] text-white font-bold text-sm rounded-xl transition-all disabled:opacity-40"
                >
                    {generating ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                    {generating ? 'Generating...' : brief ? 'Regenerate Brief' : 'Generate Daily Brief'}
                </button>
            </div>

            {entries.length > 0 && (
                <div className="bg-[#0c0c0e] border border-white/8 rounded-xl p-5">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Memory Source ({Math.min(entries.length, 30)} of {entries.length})</p>
                    <div className="space-y-1.5">
                        {entries.slice(0, 8).map(e => {
                            const ti = memoryTypeInfo(e.type);
                            return (
                                <div key={e.id} className="flex items-start gap-2">
                                    <span className="text-[9px] font-bold uppercase shrink-0 mt-0.5 w-20 text-right" style={{ color: ti.color }}>{ti.label}</span>
                                    <span className="text-xs text-gray-500 leading-snug">{e.content.slice(0, 80)}{e.content.length > 80 ? '...' : ''}</span>
                                </div>
                            );
                        })}
                        {entries.length > 8 && <p className="text-[10px] text-gray-700 pl-24">+{entries.length - 8} more entries...</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Memory component
// ─────────────────────────────────────────────────────────────────────────────

const Memory: React.FC = () => {
    const [userId, setUserId]       = useState<string | null>(null);
    const [subView, setSubView]     = useState<SubView>('feed');
    const [entries, setEntries]     = useState<MemoryEntry[]>([]);
    const [decisions, setDecisions] = useState<Decision[]>([]);
    const [loading, setLoading]     = useState(true);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) setUserId(user.id);
        });
    }, []);

    const loadData = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        const [entriesResp, decisionsResp] = await Promise.all([
            supabase.from('memory_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(100),
            supabase.from('decisions').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50),
        ]);
        setEntries((entriesResp.data ?? []).map((r: any) => ({
            id: r.id, type: r.type, content: r.content,
            linkedId: r.linked_id, linkedType: r.linked_type, createdAt: r.created_at,
        })));
        setDecisions((decisionsResp.data ?? []).map((r: any) => ({
            id: r.id, context: r.context, decision: r.decision,
            outcome: r.outcome, createdAt: r.created_at, updatedAt: r.updated_at,
        })));
        setLoading(false);
    }, [userId]);

    useEffect(() => { if (userId) loadData(); }, [userId, loadData]);

    if (!userId) return <div className="flex items-center justify-center h-40"><Loader2 className="text-[#CD3D35] animate-spin" size={24} /></div>;

    return (
        <div className="p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Memory System</h2>
                    <p className="text-gray-500 text-sm mt-0.5">
                        {entries.length} memories &middot; {decisions.length} decisions &middot; injected into every AI call
                    </p>
                </div>
                <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/8">
                    {SUB_TABS.map(t => (
                        <button key={t.id} onClick={() => setSubView(t.id)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${subView === t.id ? 'bg-[#CD3D35] text-white' : 'text-gray-500 hover:text-white'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3">
                {[
                    { label: 'Total Memories', value: entries.length, color: '#CD3D35' },
                    { label: 'Call Summaries', value: entries.filter(e => e.type === 'call_summary').length, color: '#3B82F6' },
                    { label: 'Decisions Made', value: decisions.length, color: '#8B5CF6' },
                    { label: 'With Outcomes', value: decisions.filter(d => d.outcome).length, color: '#10B981' },
                ].map(stat => (
                    <div key={stat.label} className="bg-[#0c0c0e] border border-white/8 rounded-xl p-4">
                        <p className="text-gray-500 text-xs">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center h-40"><Loader2 className="text-[#CD3D35] animate-spin" size={24} /></div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div key={subView} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                        {subView === 'feed'      && <MemoryFeed userId={userId} entries={entries} onRefresh={loadData} />}
                        {subView === 'decisions' && <DecisionsLog userId={userId} decisions={decisions} onRefresh={loadData} />}
                        {subView === 'brief'     && <DailyBrief entries={entries} />}
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};

export default Memory;
