import React, { useState, useEffect, useCallback } from 'react';
import {
    Layers, Plus, Trash2, RefreshCw, Loader2, Send, ChevronDown, ChevronRight,
    ExternalLink, BookOpen, Lightbulb, Mic, Building, FileText, MessageSquare,
    Star, AlertCircle, Check, X, GripVertical, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useNiche } from '../../lib/NicheContext';
import { CONTENT_BUCKETS, BucketId } from '../../lib/niches';
import { generateScriptIdeas, summariseContent } from '../../lib/ai';
import type { ContextItem, Script } from './types';

// ── Utility ───────────────────────────────────────────────────────────────────

function bucketIcon(id: string) {
    const icons: Record<string, React.ReactNode> = {
        video_ideas:  <Lightbulb  size={14} />,
        inspiration:  <Star       size={14} />,
        expert_brain: <BookOpen   size={14} />,
        my_voice:     <Mic        size={14} />,
        context:      <Building   size={14} />,
        instructions: <FileText   size={14} />,
        feedback:     <MessageSquare size={14} />,
    };
    return icons[id] ?? <Layers size={14} />;
}

const STATUS_COLORS: Record<string, string> = {
    queued:      'text-gray-500 bg-gray-500/10 border-gray-500/20',
    fetching:    'text-blue-400 bg-blue-400/10 border-blue-400/20',
    summarising: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    ready:       'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    error:       'text-red-400 bg-red-400/10 border-red-400/20',
};

const SCRIPT_STATUSES = ['idea', 'approved', 'shot', 'edited', 'posted'] as const;

// ── Source type options ───────────────────────────────────────────────────────

const SOURCE_TYPES = [
    { id: 'text',           label: 'Text / Notes'       },
    { id: 'youtube_url',    label: 'YouTube URL'        },
    { id: 'instagram_reel', label: 'Instagram Reel URL' },
    { id: 'tiktok_url',     label: 'TikTok URL'         },
    { id: 'link',           label: 'Article / Link'     },
];

// ── Sub-nav tabs ──────────────────────────────────────────────────────────────

type SubView = 'library' | 'generate' | 'pipeline' | 'radar';

const SUB_TABS: { id: SubView; label: string }[] = [
    { id: 'library',  label: 'Context Library' },
    { id: 'generate', label: 'Generator'       },
    { id: 'pipeline', label: 'Pipeline'        },
    { id: 'radar',    label: 'Radar'           },
];

// ─────────────────────────────────────────────────────────────────────────────
// Context Library
// ─────────────────────────────────────────────────────────────────────────────

const ContextLibrary: React.FC<{ niche: string; userId: string }> = ({ niche, userId }) => {
    const [items, setItems]         = useState<ContextItem[]>([]);
    const [loading, setLoading]     = useState(true);
    const [activeBucket, setActiveBucket] = useState<BucketId>('video_ideas');
    const [showAdd, setShowAdd]     = useState(false);
    const [addSource, setAddSource] = useState('text');
    const [addTitle, setAddTitle]   = useState('');
    const [addUrl, setAddUrl]       = useState('');
    const [addText, setAddText]     = useState('');
    const [adding, setAdding]       = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const bucketItems = items.filter(i => i.bucket === activeBucket && !i.deletedAt);

    const load = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase
            .from('context_items')
            .select('*')
            .eq('user_id', userId)
            .eq('niche', niche)
            .is('deleted_at', null)
            .order('created_at', { ascending: false });
        setItems((data ?? []).map((r: any) => ({
            id: r.id, niche: r.niche, bucket: r.bucket,
            sourceType: r.source_type, title: r.title,
            sourceUrl: r.source_url, summary: r.summary,
            tags: r.tags ?? [], status: r.status,
            errorMessage: r.error_message,
            createdAt: r.created_at,
        })));
        setLoading(false);
    }, [niche, userId]);

    useEffect(() => { load(); }, [load]);

    const handleAdd = async () => {
        if (addSource === 'text' && !addText.trim()) return;
        if (addSource !== 'text' && !addUrl.trim()) return;
        setAdding(true);
        try {
            const raw = addSource === 'text' ? addText : addUrl;
            const { data: inserted } = await supabase.from('context_items').insert({
                user_id: userId, niche, bucket: activeBucket,
                source_type: addSource,
                title: addTitle || null,
                source_url: addSource !== 'text' ? addUrl : null,
                raw_content: addSource === 'text' ? addText : null,
                status: 'queued',
            }).select().single();

            if (inserted) {
                // Attempt to summarise immediately if it's plain text
                if (addSource === 'text' && addText.trim().length > 50) {
                    await supabase.from('context_items').update({ status: 'summarising' }).eq('id', inserted.id);
                    try {
                        const { summary, tags } = await summariseContent(addText, activeBucket);
                        await supabase.from('context_items').update({
                            status: 'ready', processed_content: addText,
                            summary, tags,
                        }).eq('id', inserted.id);
                    } catch {
                        await supabase.from('context_items').update({ status: 'ready', processed_content: addText }).eq('id', inserted.id);
                    }
                } else if (addSource !== 'text') {
                    // For URLs, mark as ready with URL as content (full scrape requires Apify)
                    await supabase.from('context_items').update({
                        status: 'ready', processed_content: addUrl,
                    }).eq('id', inserted.id);
                }
            }

            setAddTitle(''); setAddUrl(''); setAddText('');
            setShowAdd(false);
            load();
        } catch (e) {
            console.error(e);
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        await supabase.from('context_items').update({ deleted_at: new Date().toISOString() }).eq('id', id);
        setItems(prev => prev.filter(i => i.id !== id));
    };

    return (
        <div className="flex gap-5 h-full">
            {/* Bucket sidebar */}
            <div className="w-48 shrink-0 space-y-0.5">
                {CONTENT_BUCKETS.map(b => {
                    const count = items.filter(i => i.bucket === b.id && !i.deletedAt).length;
                    return (
                        <button
                            key={b.id}
                            onClick={() => setActiveBucket(b.id as BucketId)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
                                activeBucket === b.id
                                    ? 'bg-[#CD3D35]/10 text-white border border-[#CD3D35]/20'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'
                            }`}
                        >
                            <span className={activeBucket === b.id ? 'text-[#CD3D35]' : 'text-gray-600'}>
                                {bucketIcon(b.id)}
                            </span>
                            <span className="text-xs font-semibold truncate">{b.label}</span>
                            {count > 0 && (
                                <span className="ml-auto text-[10px] font-bold text-gray-600">{count}</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Content area */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-bold text-sm">
                            {CONTENT_BUCKETS.find(b => b.id === activeBucket)?.label}
                        </h3>
                        <p className="text-[11px] text-gray-600 mt-0.5">
                            {CONTENT_BUCKETS.find(b => b.id === activeBucket)?.description}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={load} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                            <RefreshCw size={14} />
                        </button>
                        <button
                            onClick={() => setShowAdd(s => !s)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-[#CD3D35] hover:bg-[#B83530] text-white text-xs font-bold rounded-lg transition-colors"
                        >
                            <Plus size={13} /> Add Item
                        </button>
                    </div>
                </div>

                {/* Add form */}
                <AnimatePresence>
                    {showAdd && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="bg-[#0c0c0e] border border-white/10 rounded-xl p-4 space-y-3"
                        >
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Source Type</label>
                                    <select
                                        value={addSource}
                                        onChange={e => setAddSource(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#CD3D35]/50"
                                    >
                                        {SOURCE_TYPES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Title (optional)</label>
                                    <input
                                        value={addTitle}
                                        onChange={e => setAddTitle(e.target.value)}
                                        placeholder="Give it a name..."
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CD3D35]/50"
                                    />
                                </div>
                            </div>
                            {addSource === 'text' ? (
                                <textarea
                                    value={addText}
                                    onChange={e => setAddText(e.target.value)}
                                    placeholder="Paste your content here - captions, scripts, ideas, notes..."
                                    rows={5}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CD3D35]/50 resize-none"
                                />
                            ) : (
                                <input
                                    value={addUrl}
                                    onChange={e => setAddUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CD3D35]/50"
                                />
                            )}
                            <div className="flex items-center gap-2 justify-end">
                                <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-xs text-gray-500 hover:text-white transition-colors">Cancel</button>
                                <button
                                    onClick={handleAdd}
                                    disabled={adding}
                                    className="flex items-center gap-1.5 px-4 py-1.5 bg-[#CD3D35] hover:bg-[#B83530] text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {adding ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                                    {adding ? 'Adding...' : 'Add to Library'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Items list */}
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <Loader2 className="text-[#CD3D35] animate-spin" size={24} />
                    </div>
                ) : bucketItems.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center h-48 border border-dashed border-white/10 rounded-xl text-gray-600">
                        <span className="text-gray-700 mb-2">{bucketIcon(activeBucket)}</span>
                        <p className="text-sm">No items in this bucket yet</p>
                        <p className="text-xs mt-1">Click "Add Item" to get started</p>
                    </div>
                ) : (
                    <div className="space-y-2 overflow-y-auto crm-scroll">
                        {bucketItems.map(item => (
                            <div key={item.id} className="bg-[#0c0c0e] border border-white/8 rounded-xl overflow-hidden hover:border-white/15 transition-colors">
                                <div
                                    className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                >
                                    <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${STATUS_COLORS[item.status] ?? STATUS_COLORS.queued}`}>
                                        {item.status}
                                    </span>
                                    <span className="text-sm text-white font-medium truncate flex-1">
                                        {item.title || item.sourceUrl || item.summary?.slice(0, 60) || `${item.sourceType} item`}
                                    </span>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <span className="text-[10px] text-gray-600">{new Date(item.createdAt).toLocaleDateString()}</span>
                                        <button
                                            onClick={e => { e.stopPropagation(); handleDelete(item.id); }}
                                            className="p-1 text-gray-700 hover:text-red-400 transition-colors ml-1"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                        {expandedId === item.id ? <ChevronDown size={13} className="text-gray-600" /> : <ChevronRight size={13} className="text-gray-600" />}
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {expandedId === item.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-2">
                                                {item.summary && (
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Summary</p>
                                                        <p className="text-xs text-gray-400 leading-relaxed">{item.summary}</p>
                                                    </div>
                                                )}
                                                {item.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {item.tags.map((t: string) => (
                                                            <span key={t} className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-gray-400">{t}</span>
                                                        ))}
                                                    </div>
                                                )}
                                                {item.sourceUrl && (
                                                    <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[11px] text-[#CD3D35] hover:underline">
                                                        <ExternalLink size={11} /> {item.sourceUrl.slice(0, 60)}...
                                                    </a>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Generator
// ─────────────────────────────────────────────────────────────────────────────

const Generator: React.FC<{ niche: string; userId: string; onScriptSaved: () => void }> = ({ niche, userId, onScriptSaved }) => {
    const [prompt, setPrompt]     = useState('');
    const [format, setFormat]     = useState('reel');
    const [count, setCount]       = useState(3);
    const [generating, setGenerating] = useState(false);
    const [results, setResults]   = useState<ReturnType<typeof generateScriptIdeas> extends Promise<infer T> ? T : never>([]);
    const [error, setError]       = useState('');
    const [saved, setSaved]       = useState<Set<number>>(new Set());

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setGenerating(true);
        setError('');
        setResults([]);
        setSaved(new Set());
        try {
            // Fetch voice samples and context for this niche
            const [voiceResp, contextResp] = await Promise.all([
                supabase.from('context_items')
                    .select('processed_content')
                    .eq('user_id', userId).eq('niche', niche).eq('bucket', 'my_voice').eq('status', 'ready')
                    .order('created_at', { ascending: false }).limit(5),
                supabase.from('context_items')
                    .select('summary')
                    .eq('user_id', userId).eq('niche', niche).eq('bucket', 'context').eq('status', 'ready')
                    .limit(10),
            ]);
            const voiceSamples = (voiceResp.data ?? []).map((r: any) => r.processed_content ?? '').filter(Boolean);
            const contextItems = (contextResp.data ?? []).map((r: any) => r.summary ?? '').filter(Boolean);

            const scripts = await generateScriptIdeas({ niche, prompt, format, count, voiceSamples, contextItems, memoryContext: '' });
            setResults(scripts);
        } catch (e: any) {
            setError(e.message ?? 'Generation failed');
        } finally {
            setGenerating(false);
        }
    };

    const handleSave = async (idx: number) => {
        const s = results[idx];
        if (!s) return;
        await supabase.from('scripts').insert({
            user_id: userId, niche, format, status: 'idea',
            hook: s.hook, body: s.body, cta: s.cta,
            caption: s.caption, hashtags: s.hashtags,
            why_it_works: s.why_it_works,
            generation_prompt: prompt,
        });
        setSaved(prev => new Set([...prev, idx]));
        onScriptSaved();
    };

    return (
        <div className="space-y-5">
            {/* Controls */}
            <div className="bg-[#0c0c0e] border border-white/8 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">What do you want to create?</label>
                        <textarea
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder={`e.g. "Why homeowners in ${niche} should call before summer", or "3 signs your ${niche} contractor is ripping you off"`}
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CD3D35]/50 resize-none"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Format</label>
                        <div className="flex gap-1">
                            {['reel', 'carousel', 'story'].map(f => (
                                <button key={f} onClick={() => setFormat(f)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${format === f ? 'bg-[#CD3D35] text-white' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'}`}>
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Count</label>
                        <div className="flex gap-1">
                            {[1, 3, 5].map(n => (
                                <button key={n} onClick={() => setCount(n)}
                                    className={`w-9 h-8 text-xs font-bold rounded-lg transition-all ${count === n ? 'bg-[#CD3D35] text-white' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'}`}>
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={generating || !prompt.trim()}
                        className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-[#CD3D35] hover:bg-[#B83530] text-white font-bold text-sm rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {generating ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                        {generating ? 'Generating...' : 'Generate'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">
                    <AlertCircle size={14} /> {error}
                </div>
            )}

            {/* Results */}
            {results.length > 0 && (
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Generated Scripts</p>
                    {results.map((s, i) => (
                        <div key={i} className="bg-[#0c0c0e] border border-white/8 rounded-xl overflow-hidden">
                            <div className="px-5 py-4 space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-[#CD3D35] uppercase tracking-widest mb-1">Hook</p>
                                        <p className="text-white font-semibold text-sm leading-snug">{s.hook}</p>
                                    </div>
                                    <button
                                        onClick={() => handleSave(i)}
                                        disabled={saved.has(i)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${saved.has(i) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-[#CD3D35] hover:bg-[#B83530] text-white'}`}
                                    >
                                        {saved.has(i) ? <><Check size={12} /> Saved</> : <>Save to Pipeline</>}
                                    </button>
                                </div>
                                {s.body && (
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Body</p>
                                        <p className="text-gray-300 text-sm leading-relaxed">{s.body}</p>
                                    </div>
                                )}
                                {s.cta && (
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">CTA</p>
                                        <p className="text-gray-400 text-sm">{s.cta}</p>
                                    </div>
                                )}
                                {s.why_it_works && (
                                    <div className="p-3 bg-white/3 border border-white/6 rounded-lg">
                                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Why it works</p>
                                        <p className="text-gray-500 text-xs leading-relaxed">{s.why_it_works}</p>
                                    </div>
                                )}
                                {s.hashtags?.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {s.hashtags.map((h: string, hi: number) => (
                                            <span key={hi} className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-gray-500">{h}</span>
                                        ))}
                                    </div>
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
// Pipeline Kanban
// ─────────────────────────────────────────────────────────────────────────────

const Pipeline: React.FC<{ niche: string; userId: string }> = ({ niche, userId }) => {
    const [scripts, setScripts] = useState<Script[]>([]);
    const [loading, setLoading] = useState(true);
    const [movingId, setMovingId] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase
            .from('scripts')
            .select('*')
            .eq('user_id', userId)
            .eq('niche', niche)
            .order('created_at', { ascending: false });
        setScripts((data ?? []).map((r: any) => ({
            id: r.id, niche: r.niche, format: r.format ?? 'reel',
            status: r.status, hook: r.hook, hookFormula: r.hook_formula,
            body: r.body, cta: r.cta, fullScript: r.full_script,
            caption: r.caption, keyword: r.keyword, hashtags: r.hashtags ?? [],
            topic: r.topic, angle: r.angle, whyItWorks: r.why_it_works,
            generationPrompt: r.generation_prompt,
            createdAt: r.created_at, updatedAt: r.updated_at,
        })));
        setLoading(false);
    }, [niche, userId]);

    useEffect(() => { load(); }, [load]);

    const moveScript = async (id: string, newStatus: string) => {
        setMovingId(id);
        await supabase.from('scripts').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', id);
        setScripts(prev => prev.map(s => s.id === id ? { ...s, status: newStatus as Script['status'] } : s));
        setMovingId(null);
    };

    const deleteScript = async (id: string) => {
        await supabase.from('scripts').delete().eq('id', id);
        setScripts(prev => prev.filter(s => s.id !== id));
    };

    const STATUS_LABELS: Record<string, string> = {
        idea: 'Idea', approved: 'Approved', shot: 'Shot', edited: 'Edited', posted: 'Posted'
    };

    const STATUS_COLORS_COL: Record<string, string> = {
        idea: '#6B7280', approved: '#3B82F6', shot: '#F59E0B', edited: '#8B5CF6', posted: '#10B981'
    };

    if (loading) return <div className="flex items-center justify-center h-40"><Loader2 className="text-[#CD3D35] animate-spin" size={24} /></div>;

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 crm-scroll">
            {SCRIPT_STATUSES.map(status => {
                const col = scripts.filter(s => s.status === status);
                return (
                    <div key={status} className="w-64 shrink-0 flex flex-col gap-3">
                        <div className="flex items-center gap-2 px-1">
                            <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS_COL[status] }} />
                            <span className="text-xs font-bold text-white uppercase tracking-wide">{STATUS_LABELS[status]}</span>
                            <span className="ml-auto text-[10px] text-gray-600 font-bold">{col.length}</span>
                        </div>
                        <div className="flex flex-col gap-2 min-h-[120px] p-2 bg-white/[0.02] border border-white/6 rounded-xl">
                            {col.map(script => (
                                <div key={script.id} className="bg-[#0c0c0e] border border-white/10 rounded-lg p-3 space-y-2 hover:border-white/20 transition-colors">
                                    <p className="text-xs text-white font-medium leading-snug line-clamp-2">{script.hook || script.topic || 'Untitled script'}</p>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-gray-500">{script.format}</span>
                                        <span className="text-[9px] text-gray-700">{new Date(script.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {SCRIPT_STATUSES.filter(s => s !== status).slice(0, 2).map(s => (
                                            <button
                                                key={s}
                                                onClick={() => moveScript(script.id, s)}
                                                disabled={movingId === script.id}
                                                title={`Move to ${STATUS_LABELS[s]}`}
                                                className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold text-gray-600 hover:text-white hover:bg-white/8 rounded transition-all"
                                            >
                                                <ArrowRight size={9} /> {STATUS_LABELS[s]}
                                            </button>
                                        ))}
                                        <button onClick={() => deleteScript(script.id)} className="ml-auto text-gray-700 hover:text-red-400 transition-colors p-0.5">
                                            <X size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {col.length === 0 && (
                                <div className="flex-1 flex items-center justify-center h-20 text-[11px] text-gray-700 italic">Empty</div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Radar
// ─────────────────────────────────────────────────────────────────────────────

const Radar: React.FC<{ niche: string; userId: string }> = ({ niche, userId }) => {
    const [signals, setSignals]       = useState<any[]>([]);
    const [watchList, setWatchList]   = useState<any[]>([]);
    const [loading, setLoading]       = useState(true);
    const [showAddWatch, setShowAddWatch] = useState(false);
    const [watchValue, setWatchValue] = useState('');
    const [watchType, setWatchType]   = useState<'hashtag' | 'creator'>('hashtag');
    const [watchPlatform, setWatchPlatform] = useState('instagram');

    const load = useCallback(async () => {
        setLoading(true);
        const [sigResp, watchResp] = await Promise.all([
            supabase.from('niche_signals').select('*').eq('user_id', userId).eq('niche', niche).order('created_at', { ascending: false }).limit(20),
            supabase.from('niche_watch').select('*').eq('user_id', userId).eq('niche', niche).eq('active', true),
        ]);
        setSignals(sigResp.data ?? []);
        setWatchList(watchResp.data ?? []);
        setLoading(false);
    }, [niche, userId]);

    useEffect(() => { load(); }, [load]);

    const addWatch = async () => {
        if (!watchValue.trim()) return;
        await supabase.from('niche_watch').insert({
            user_id: userId, niche, platform: watchPlatform,
            watch_type: watchType, value: watchValue.trim(),
        });
        setWatchValue('');
        setShowAddWatch(false);
        load();
    };

    const removeWatch = async (id: string) => {
        await supabase.from('niche_watch').update({ active: false }).eq('id', id);
        setWatchList(prev => prev.filter(w => w.id !== id));
    };

    const updateSignalStatus = async (id: string, status: string) => {
        await supabase.from('niche_signals').update({ status }).eq('id', id);
        setSignals(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    };

    return (
        <div className="grid grid-cols-3 gap-5">
            {/* Watch list */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold text-sm">Watch List</h3>
                    <button onClick={() => setShowAddWatch(s => !s)} className="flex items-center gap-1 text-xs text-[#CD3D35] hover:text-white transition-colors">
                        <Plus size={12} /> Add
                    </button>
                </div>
                <AnimatePresence>
                    {showAddWatch && (
                        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                            className="bg-[#0c0c0e] border border-white/10 rounded-xl p-3 space-y-2">
                            <div className="flex gap-1">
                                {(['hashtag', 'creator'] as const).map(t => (
                                    <button key={t} onClick={() => setWatchType(t)}
                                        className={`flex-1 py-1 text-xs font-bold rounded capitalize transition-all ${watchType === t ? 'bg-[#CD3D35] text-white' : 'bg-white/5 text-gray-500'}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-1">
                                {['instagram', 'tiktok'].map(p => (
                                    <button key={p} onClick={() => setWatchPlatform(p)}
                                        className={`flex-1 py-1 text-xs font-bold rounded capitalize transition-all ${watchPlatform === p ? 'bg-white/15 text-white' : 'bg-white/5 text-gray-500'}`}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                            <input value={watchValue} onChange={e => setWatchValue(e.target.value)}
                                placeholder={watchType === 'hashtag' ? '#poolservices' : '@poolpro'}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#CD3D35]/50" />
                            <button onClick={addWatch} className="w-full py-1.5 bg-[#CD3D35] text-white text-xs font-bold rounded-lg">Add</button>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="space-y-1.5">
                    {watchList.map(w => (
                        <div key={w.id} className="flex items-center gap-2 px-3 py-2 bg-[#0c0c0e] border border-white/8 rounded-lg">
                            <span className="text-[10px] font-bold uppercase text-gray-600">{w.platform[0]}</span>
                            <span className="text-xs text-white flex-1">{w.value}</span>
                            <span className="text-[9px] text-gray-700 capitalize">{w.watch_type}</span>
                            <button onClick={() => removeWatch(w.id)} className="text-gray-700 hover:text-red-400 transition-colors"><X size={11} /></button>
                        </div>
                    ))}
                    {watchList.length === 0 && <p className="text-xs text-gray-700 text-center py-4">No watch items yet</p>}
                </div>
            </div>

            {/* Signals */}
            <div className="col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold text-sm">Trending Signals</h3>
                    <button onClick={load} className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><RefreshCw size={13} /></button>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center h-32"><Loader2 className="text-[#CD3D35] animate-spin" size={20} /></div>
                ) : signals.filter(s => s.status === 'new').length === 0 ? (
                    <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-gray-600 space-y-1">
                        <p className="text-sm">No new signals</p>
                        <p className="text-xs">Add hashtags and creator handles to your watch list, then run the radar scan</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {signals.filter(s => s.status === 'new').map(s => (
                            <div key={s.id} className="bg-[#0c0c0e] border border-white/8 rounded-xl p-4 space-y-2">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        {s.creator_handle && <p className="text-[10px] text-gray-500">@{s.creator_handle}</p>}
                                        <p className="text-sm text-white leading-snug mt-0.5">{s.caption?.slice(0, 120)}{s.caption?.length > 120 ? '...' : ''}</p>
                                        {s.suggestion_text && (
                                            <p className="text-xs text-[#CD3D35] mt-1 italic">{s.suggestion_text}</p>
                                        )}
                                    </div>
                                    {s.velocity_score && (
                                        <div className="text-center shrink-0">
                                            <p className="text-lg font-bold text-white">{s.velocity_score.toFixed(1)}x</p>
                                            <p className="text-[9px] text-gray-600 uppercase">velocity</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {s.view_count && <span className="text-[10px] text-gray-600">{s.view_count.toLocaleString()} views</span>}
                                    <div className="ml-auto flex gap-1">
                                        <button onClick={() => updateSignalStatus(s.id, 'dismissed')}
                                            className="px-2.5 py-1 text-[10px] font-bold text-gray-600 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                                            Dismiss
                                        </button>
                                        <button onClick={() => updateSignalStatus(s.id, 'saved')}
                                            className="px-2.5 py-1 text-[10px] font-bold text-[#CD3D35] bg-[#CD3D35]/10 hover:bg-[#CD3D35]/20 rounded-lg transition-all">
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main ContentEngine component
// ─────────────────────────────────────────────────────────────────────────────

const ContentEngine: React.FC = () => {
    const { activeNiche } = useNiche();
    const [userId, setUserId]     = useState<string | null>(null);
    const [subView, setSubView]   = useState<SubView>('library');
    const [scriptCount, setScriptCount] = useState(0);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) setUserId(user.id);
        });
    }, []);

    useEffect(() => {
        if (!userId) return;
        supabase.from('scripts').select('id', { count: 'exact', head: true })
            .eq('user_id', userId).eq('niche', activeNiche)
            .then(({ count }) => setScriptCount(count ?? 0));
    }, [userId, activeNiche]);

    if (!userId) return <div className="flex items-center justify-center h-40"><Loader2 className="text-[#CD3D35] animate-spin" size={24} /></div>;

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Content Engine</h2>
                    <p className="text-gray-500 text-sm mt-0.5">{scriptCount} scripts in pipeline for {activeNiche}</p>
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

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div key={subView} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                    {subView === 'library'  && <ContextLibrary niche={activeNiche} userId={userId} />}
                    {subView === 'generate' && <Generator niche={activeNiche} userId={userId} onScriptSaved={() => setScriptCount(c => c + 1)} />}
                    {subView === 'pipeline' && <Pipeline niche={activeNiche} userId={userId} />}
                    {subView === 'radar'    && <Radar niche={activeNiche} userId={userId} />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default ContentEngine;
