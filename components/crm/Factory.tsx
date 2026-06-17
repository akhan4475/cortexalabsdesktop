import React, { useState, useEffect, useCallback } from 'react';
import {
    Wrench, Plus, Loader2, ChevronRight, ExternalLink, Check,
    Clock, RefreshCw, Zap, Building, X, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useNiche } from '../../lib/NicheContext';
import { FACTORY_TEMPLATES, FACTORY_STAGES, getNiche } from '../../lib/niches';
import { extractBusinessInfo } from '../../lib/ai';
import type { FactoryBuild, FactoryPreview } from './types';

type SubView = 'tracker' | 'quick_preview' | 'new_build';

const SUB_TABS: { id: SubView; label: string }[] = [
    { id: 'tracker',       label: 'Build Tracker'  },
    { id: 'quick_preview', label: 'Quick Preview'  },
    { id: 'new_build',     label: 'New Full Build' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Build Tracker
// ─────────────────────────────────────────────────────────────────────────────

const BuildTracker: React.FC<{ niche: string; userId: string; onRefresh: () => void; builds: FactoryBuild[] }> = ({ niche, userId, onRefresh, builds }) => {
    const nicheData = getNiche(niche as any);
    const stages = FACTORY_STAGES;

    const advanceStage = async (build: FactoryBuild) => {
        const nextStage = stages.find(s => s.number === build.stageNumber + 1);
        if (!nextStage) return;
        await supabase.from('factory_builds').update({
            stage: nextStage.id,
            stage_number: nextStage.number,
            updated_at: new Date().toISOString(),
        }).eq('id', build.id);
        onRefresh();
    };

    const updateNotes = async (id: string, notes: string) => {
        await supabase.from('factory_builds').update({ notes, updated_at: new Date().toISOString() }).eq('id', id);
    };

    const updateSiteUrl = async (id: string, url: string) => {
        await supabase.from('factory_builds').update({ site_url: url, updated_at: new Date().toISOString() }).eq('id', id);
    };

    const deleteBuild = async (id: string) => {
        await supabase.from('factory_builds').delete().eq('id', id);
        onRefresh();
    };

    if (builds.length === 0) {
        return (
            <div className="border border-dashed border-white/10 rounded-xl p-10 text-center text-gray-600 space-y-2">
                <Wrench size={32} className="mx-auto text-gray-800" />
                <p className="text-sm">No builds tracked yet for {nicheData.label}</p>
                <p className="text-xs">Start a new full build or run a quick preview</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {builds.filter(b => b.niche === niche).map(build => {
                const stage = stages.find(s => s.id === build.stage) ?? stages[0];
                const progress = Math.round((stage.number / 13) * 100);
                return (
                    <div key={build.id} className="bg-[#0c0c0e] border border-white/8 rounded-xl overflow-hidden hover:border-white/15 transition-colors">
                        <div className="px-5 py-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${build.buildType === 'full' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 'text-[#CD3D35] bg-[#CD3D35]/10 border-[#CD3D35]/20'}`}>
                                            {build.buildType === 'full' ? 'Full Build' : 'Quick Preview'}
                                        </span>
                                        <span className="text-[10px] text-gray-600">{new Date(build.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h4 className="text-white font-bold text-sm">{build.clientCompany || build.clientName || 'Unnamed Client'}</h4>
                                    {build.clientName && build.clientCompany && (
                                        <p className="text-xs text-gray-500 mt-0.5">{build.clientName}</p>
                                    )}
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{stage.label}</p>
                                    <p className="text-[10px] text-gray-600">{stage.number} / 13</p>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-3 mb-3">
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#CD3D35] to-[#E85550] rounded-full transition-all duration-500"
                                        style={{ width: `${progress}%` }} />
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-[9px] text-gray-700">{progress}% complete</span>
                                    {build.templateUsed && (
                                        <span className="text-[9px] text-gray-700">Template: {build.templateUsed}</span>
                                    )}
                                </div>
                            </div>

                            {/* Stage chips */}
                            <div className="flex flex-wrap gap-1 mb-3">
                                {stages.map(s => (
                                    <span key={s.id} className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                        s.number < stage.number ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20' :
                                        s.number === stage.number ? 'bg-[#CD3D35]/15 text-[#CD3D35] border border-[#CD3D35]/30' :
                                        'bg-white/4 text-gray-700 border border-white/6'
                                    }`}>{s.label}</span>
                                ))}
                            </div>

                            {/* Site URL + Notes */}
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <input
                                    defaultValue={build.siteUrl ?? ''}
                                    onBlur={e => updateSiteUrl(build.id, e.target.value)}
                                    placeholder="Site URL when deployed..."
                                    className="bg-white/4 border border-white/8 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-700 focus:outline-none focus:border-[#CD3D35]/40"
                                />
                                <input
                                    defaultValue={build.notes ?? ''}
                                    onBlur={e => updateNotes(build.id, e.target.value)}
                                    placeholder="Notes..."
                                    className="bg-white/4 border border-white/8 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-700 focus:outline-none focus:border-[#CD3D35]/40"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                {build.siteUrl && (
                                    <a href={build.siteUrl} target="_blank" rel="noreferrer"
                                        className="flex items-center gap-1 text-[10px] text-[#CD3D35] hover:underline">
                                        <ExternalLink size={11} /> View Site
                                    </a>
                                )}
                                <div className="ml-auto flex gap-2">
                                    <button onClick={() => deleteBuild(build.id)}
                                        className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-gray-600 hover:text-red-400 hover:bg-red-500/8 rounded-lg transition-all">
                                        <X size={11} /> Delete
                                    </button>
                                    {stage.number < 13 && (
                                        <button onClick={() => advanceStage(build)}
                                            className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold bg-[#CD3D35] hover:bg-[#B83530] text-white rounded-lg transition-all">
                                            <Check size={11} /> Complete Stage
                                        </button>
                                    )}
                                    {stage.number === 13 && (
                                        <span className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                            <Check size={11} /> Delivered
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Quick Preview
// ─────────────────────────────────────────────────────────────────────────────

const QuickPreview: React.FC<{ niche: string; userId: string; onPreviewSaved: () => void }> = ({ niche, userId, onPreviewSaved }) => {
    const [paste, setPaste]           = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [extracting, setExtracting] = useState(false);
    const [extracted, setExtracted]   = useState<any>(null);
    const [previewHtml, setPreviewHtml] = useState('');
    const [saving, setSaving]         = useState(false);
    const [saved, setSaved]           = useState(false);
    const [error, setError]           = useState('');

    const templates = FACTORY_TEMPLATES[niche as keyof typeof FACTORY_TEMPLATES] ?? [];

    useEffect(() => {
        if (templates.length > 0) setSelectedTemplate(templates[0]);
    }, [niche]);

    const handleExtract = async () => {
        if (!paste.trim()) return;
        setExtracting(true);
        setError('');
        try {
            const data = await extractBusinessInfo(paste);
            setExtracted(data);
            // Build a simple HTML preview
            const html = `
<div style="font-family:sans-serif;max-width:800px;margin:0 auto;background:#fff;padding:40px">
  <div style="background:#CD3D35;color:white;padding:60px 40px;border-radius:12px;margin-bottom:24px">
    <h1 style="font-size:2.5rem;margin:0;font-weight:800">${data.business_name || 'Your Business'}</h1>
    <p style="font-size:1.1rem;margin:12px 0 0;opacity:0.9">${data.city ? `Serving ${data.city}` : ''}</p>
    <p style="font-size:1.25rem;margin:16px 0 0;font-style:italic">"${data.tagline}"</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:24px">
    ${(data.services || []).map((s: string) => `<div style="border:1px solid #eee;padding:16px;border-radius:8px;text-align:center;font-weight:600;font-size:0.9rem">${s}</div>`).join('')}
  </div>
  <div style="space-y:12px">
    <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:16px">What Customers Say</h2>
    ${(data.reviews || []).map((r: string) => `<div style="background:#f9f9f9;padding:16px;border-radius:8px;margin-bottom:12px;border-left:4px solid #CD3D35;font-style:italic">"${r}"</div>`).join('')}
  </div>
  <div style="background:#111;color:white;padding:24px;border-radius:12px;text-align:center;margin-top:24px">
    <p style="font-size:1.1rem;margin:0">Ready to get started? Call us today.</p>
    <p style="color:#CD3D35;font-size:0.85rem;margin:8px 0 0">Template: ${selectedTemplate}</p>
  </div>
</div>`;
            setPreviewHtml(html);
        } catch (e: any) {
            setError(e.message ?? 'Extraction failed');
        } finally {
            setExtracting(false);
        }
    };

    const handleSave = async () => {
        if (!extracted) return;
        setSaving(true);
        await supabase.from('factory_previews').insert({
            user_id: userId, niche,
            template_used: selectedTemplate,
            paste_input: paste,
            extracted_data: extracted,
        });
        setSaving(false);
        setSaved(true);
        onPreviewSaved();
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="grid grid-cols-2 gap-5">
            {/* Input panel */}
            <div className="space-y-4">
                <div className="bg-[#0c0c0e] border border-white/8 rounded-xl p-5 space-y-4">
                    <div>
                        <h3 className="text-white font-bold text-sm mb-1">Paste Business Info</h3>
                        <p className="text-xs text-gray-500">Copy any combination of Google reviews, service list, business description, or about page text. The AI extracts what it needs.</p>
                    </div>
                    <textarea
                        value={paste}
                        onChange={e => setPaste(e.target.value)}
                        placeholder="Paste Google reviews, services, business name, city..."
                        rows={8}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CD3D35]/50 resize-none"
                    />

                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Template</label>
                        <div className="grid grid-cols-1 gap-1.5">
                            {templates.map(t => (
                                <button key={t} onClick={() => setSelectedTemplate(t)}
                                    className={`px-3 py-2 text-xs font-semibold rounded-lg text-left transition-all ${selectedTemplate === t ? 'bg-[#CD3D35]/15 text-white border border-[#CD3D35]/30' : 'bg-white/4 text-gray-500 border border-white/8 hover:text-white'}`}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && <p className="text-xs text-red-400">{error}</p>}

                    <button
                        onClick={handleExtract}
                        disabled={extracting || !paste.trim()}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#CD3D35] hover:bg-[#B83530] text-white font-bold text-sm rounded-xl transition-all disabled:opacity-40"
                    >
                        {extracting ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
                        {extracting ? 'Extracting...' : 'Generate Preview'}
                    </button>
                </div>

                {/* Extracted data */}
                {extracted && (
                    <div className="bg-[#0c0c0e] border border-white/8 rounded-xl p-4 space-y-3">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Extracted Data</p>
                        <div className="space-y-2 text-sm">
                            <div><span className="text-gray-600">Business:</span> <span className="text-white">{extracted.business_name}</span></div>
                            <div><span className="text-gray-600">City:</span> <span className="text-white">{extracted.city}</span></div>
                            <div><span className="text-gray-600">Tagline:</span> <span className="text-gray-300 italic">"{extracted.tagline}"</span></div>
                            <div><span className="text-gray-600">Services:</span> <span className="text-gray-300">{(extracted.services || []).join(', ')}</span></div>
                            <div><span className="text-gray-600">Reviews found:</span> <span className="text-gray-300">{(extracted.reviews || []).length}</span></div>
                        </div>
                        <button onClick={handleSave} disabled={saving || saved}
                            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${saved ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-white bg-white/10 hover:bg-white/15 border border-white/10'}`}>
                            {saved ? <><Check size={12} /> Saved to History</> : <><Check size={12} /> Save Preview</>}
                        </button>
                    </div>
                )}
            </div>

            {/* Preview panel */}
            <div className="bg-[#0c0c0e] border border-white/8 rounded-xl overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                    <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-[11px] text-gray-600 font-mono">preview</span>
                    {previewHtml && (
                        <button
                            onClick={() => {
                                const win = window.open('', '_blank');
                                win?.document.write(previewHtml);
                                win?.document.close();
                            }}
                            className="flex items-center gap-1 text-[10px] text-[#CD3D35] hover:underline"
                        >
                            <Eye size={11} /> Open Full
                        </button>
                    )}
                </div>
                <div className="flex-1 min-h-0 overflow-auto bg-white">
                    {previewHtml ? (
                        <iframe
                            srcDoc={previewHtml}
                            className="w-full h-full border-0 min-h-[500px]"
                            title="Site Preview"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-64 bg-gray-50">
                            <div className="text-center text-gray-400 space-y-2">
                                <Building size={32} className="mx-auto opacity-30" />
                                <p className="text-sm">Preview will appear here</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// New Full Build form
// ─────────────────────────────────────────────────────────────────────────────

const NewBuild: React.FC<{ niche: string; userId: string; onCreated: () => void }> = ({ niche, userId, onCreated }) => {
    const [clientName, setClientName]     = useState('');
    const [clientCompany, setClientCompany] = useState('');
    const [template, setTemplate]         = useState('');
    const [notes, setNotes]               = useState('');
    const [creating, setCreating]         = useState(false);
    const [done, setDone]                 = useState(false);

    const templates = FACTORY_TEMPLATES[niche as keyof typeof FACTORY_TEMPLATES] ?? [];

    useEffect(() => { if (templates.length > 0) setTemplate(templates[0]); }, [niche]);

    const handleCreate = async () => {
        if (!clientCompany.trim()) return;
        setCreating(true);
        await supabase.from('factory_builds').insert({
            user_id: userId, niche,
            client_name: clientName || null,
            client_company: clientCompany,
            template_used: template || null,
            build_type: 'full',
            stage: 'intake',
            stage_number: 1,
            notes: notes || null,
        });
        setDone(true);
        setCreating(false);
        onCreated();
        setTimeout(() => setDone(false), 2000);
        setClientName(''); setClientCompany(''); setNotes('');
    };

    return (
        <div className="max-w-xl">
            <div className="bg-[#0c0c0e] border border-white/8 rounded-xl p-6 space-y-5">
                <div>
                    <h3 className="text-white font-bold text-sm">Start a New Full Factory Build</h3>
                    <p className="text-xs text-gray-500 mt-0.5">This creates a tracked 13-stage build. Use the Claude terminal to run the actual website factory pipeline.</p>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Client Company *</label>
                        <input value={clientCompany} onChange={e => setClientCompany(e.target.value)} placeholder="Splash Pools LLC"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CD3D35]/50" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Owner / Contact Name</label>
                        <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="John Smith"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CD3D35]/50" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Template</label>
                        <div className="grid grid-cols-1 gap-1.5">
                            {templates.map(t => (
                                <button key={t} onClick={() => setTemplate(t)}
                                    className={`px-3 py-2 text-xs font-semibold rounded-lg text-left transition-all ${template === t ? 'bg-[#CD3D35]/15 text-white border border-[#CD3D35]/30' : 'bg-white/4 text-gray-500 border border-white/8 hover:text-white'}`}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Notes</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Client context, special requirements..." rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CD3D35]/50 resize-none" />
                    </div>
                </div>

                <button onClick={handleCreate} disabled={creating || !clientCompany.trim()}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 font-bold text-sm rounded-xl transition-all ${done ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-[#CD3D35] hover:bg-[#B83530] text-white disabled:opacity-40'}`}>
                    {creating ? <Loader2 size={15} className="animate-spin" /> : done ? <><Check size={15} /> Build Created</> : <>Create Build</>}
                </button>

                <div className="flex items-start gap-2 p-3 bg-blue-500/8 border border-blue-500/15 rounded-xl">
                    <Clock size={13} className="text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-400 leading-relaxed">
                        After creating, open the Claude terminal and run the factory pipeline from there. The tracker above reflects your progress through the 13 stages.
                    </p>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Factory component
// ─────────────────────────────────────────────────────────────────────────────

const Factory: React.FC = () => {
    const { activeNiche } = useNiche();
    const [userId, setUserId]   = useState<string | null>(null);
    const [subView, setSubView] = useState<SubView>('tracker');
    const [builds, setBuilds]   = useState<FactoryBuild[]>([]);
    const [previews, setPreviews] = useState<FactoryPreview[]>([]);
    const [loading, setLoading] = useState(true);
    const nicheData = getNiche(activeNiche);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) setUserId(user.id);
        });
    }, []);

    const loadData = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        const [buildResp, previewResp] = await Promise.all([
            supabase.from('factory_builds').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
            supabase.from('factory_previews').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
        ]);
        setBuilds((buildResp.data ?? []).map((r: any) => ({
            id: r.id, niche: r.niche, clientName: r.client_name,
            clientCompany: r.client_company, templateUsed: r.template_used,
            buildType: r.build_type, stage: r.stage, stageNumber: r.stage_number,
            notes: r.notes, siteUrl: r.site_url,
            createdAt: r.created_at, updatedAt: r.updated_at,
        })));
        setPreviews((previewResp.data ?? []).map((r: any) => ({
            id: r.id, niche: r.niche, templateUsed: r.template_used,
            pasteInput: r.paste_input, extractedData: r.extracted_data ?? {},
            convertedToBuild: r.converted_to_build, createdAt: r.created_at,
        })));
        setLoading(false);
    }, [userId]);

    useEffect(() => { if (userId) loadData(); }, [userId, loadData]);

    const nicheBuilds = builds.filter(b => b.niche === activeNiche);
    const nichePreviews = previews.filter(p => p.niche === activeNiche);

    if (!userId) return <div className="flex items-center justify-center h-40"><Loader2 className="text-[#CD3D35] animate-spin" size={24} /></div>;

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Website Factory</h2>
                    <p className="text-gray-500 text-sm mt-0.5">
                        {nicheBuilds.length} active build{nicheBuilds.length !== 1 ? 's' : ''} &middot; {nichePreviews.length} preview{nichePreviews.length !== 1 ? 's' : ''} for <span style={{ color: nicheData.color }}>{nicheData.label}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={loadData} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <RefreshCw size={14} />
                    </button>
                    <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/8">
                        {SUB_TABS.map(t => (
                            <button key={t.id} onClick={() => setSubView(t.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${subView === t.id ? 'bg-[#CD3D35] text-white' : 'text-gray-500 hover:text-white'}`}>
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center h-40"><Loader2 className="text-[#CD3D35] animate-spin" size={24} /></div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div key={subView} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                        {subView === 'tracker' && (
                            <BuildTracker niche={activeNiche} userId={userId} onRefresh={loadData} builds={nicheBuilds} />
                        )}
                        {subView === 'quick_preview' && (
                            <QuickPreview niche={activeNiche} userId={userId} onPreviewSaved={loadData} />
                        )}
                        {subView === 'new_build' && (
                            <NewBuild niche={activeNiche} userId={userId} onCreated={() => { loadData(); setSubView('tracker'); }} />
                        )}
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};

export default Factory;
