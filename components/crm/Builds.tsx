import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, X, ChevronRight, CheckCircle2, Circle, Loader2, Trash2,
  ExternalLink, Edit3, Send, ThumbsUp, ThumbsDown, Rocket, Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NICHES, FACTORY_STAGES } from '../../lib/niches';
import { supabase } from '../../lib/supabase';
import { Campaign, Lead } from './types';

// ── Build interface ───────────────────────────────────────────────────────────

interface Build {
  id: string;
  user_id?: string;
  niche?: string;
  lead_id?: string;
  build_status?: string;
  client_name: string;
  business_name?: string;
  template?: string;
  current_stage: number;
  stages_complete?: boolean[];
  notes?: string;
  preview_url?: string;
  live_url?: string;
  created_at?: string;
  updated_at?: string;
}

type BuildStatus = 'active' | 'mockup_sent' | 'approved' | 'rejected' | 'launched';

// ── Build status helpers (Supabase-first, localStorage fallback) ──────────────

const BS_KEY = 'aiw_build_statuses';

function getBuildStatus(build: Build): BuildStatus {
  // Prefer Supabase-loaded field
  if (build.build_status) return build.build_status as BuildStatus;
  try {
    const map = JSON.parse(localStorage.getItem(BS_KEY) || '{}');
    return (map[build.id] as BuildStatus) ?? 'active';
  } catch { return 'active'; }
}

async function persistBuildStatus(buildId: string, status: BuildStatus) {
  // Always write localStorage first for instant UI
  try {
    const map = JSON.parse(localStorage.getItem(BS_KEY) || '{}');
    map[buildId] = status;
    localStorage.setItem(BS_KEY, JSON.stringify(map));
  } catch {}
  // Try Supabase — works once you've run the migration SQL, no-ops otherwise
  supabase.from('factory_builds').update({ build_status: status }).eq('id', buildId).then();
}

// ── Folder map helpers ────────────────────────────────────────────────────────

const FOLDER_MAP_KEY = 'aiw_lead_folders';
type FolderMap = Record<string, { nicheId: string; subFolder: string }>;
function loadFolderMap(): FolderMap {
  try { return JSON.parse(localStorage.getItem(FOLDER_MAP_KEY) || '{}'); } catch { return {}; }
}

// ── BuildRow ──────────────────────────────────────────────────────────────────

const BuildRow: React.FC<{ build: Build; active: boolean; onSelect: () => void }> = ({ build, active, onSelect }) => {
  const pct = Math.round((build.current_stage / FACTORY_STAGES.length) * 100);
  const stage = FACTORY_STAGES[build.current_stage];
  const bs = getBuildStatus(build);

  const bsLabel =
    bs === 'launched'    ? 'Launched'     :
    bs === 'rejected'    ? 'Rejected'     :
    bs === 'approved'    ? 'Approved'     :
    bs === 'mockup_sent' ? 'Mockup Sent'  :
    (stage?.label ?? 'Done');

  const bsColor =
    bs === 'launched'    ? '#06B6D4' :
    bs === 'rejected'    ? '#EF4444' :
    bs === 'approved'    ? '#10B981' :
    bs === 'mockup_sent' ? '#F97316' :
    '#CD3D35';

  return (
    <div
      onClick={onSelect}
      className={`flex items-center gap-3 px-4 py-3 border-b border-[#1A1A1A] cursor-pointer transition-colors ${active ? 'bg-[#1E1E1E]' : 'hover:bg-[#141414]'}`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-[#F2F2F2] truncate">{build.client_name}</p>
        {build.business_name && <p className="text-[10px] text-[#555] truncate">{build.business_name}</p>}
      </div>
      <div className="text-right shrink-0">
        <p className="text-[10px] font-medium" style={{ color: bsColor }}>{bsLabel}</p>
        <p className="text-[9px] text-[#555] font-mono">{pct}%</p>
      </div>
      <ChevronRight size={12} className="text-[#555] shrink-0" />
    </div>
  );
};

// ── BuildDetail ───────────────────────────────────────────────────────────────

const BuildDetail: React.FC<{
  build: Build;
  allLeads: Lead[];
  onUpdate: (build: Build) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  onUpdateLeadStatus: (leadId: string, status: string) => void;
  onUpdateLead: (lead: Lead) => void;
}> = ({ build, allLeads, onUpdate, onDelete, onClose, onUpdateLeadStatus, onUpdateLead }) => {
  const [editing, setEditing]         = useState(false);
  const [form, setForm]               = useState(build);
  const [buildStatus, setBs]          = useState<BuildStatus>(() => getBuildStatus(build));
  const [confirm, setConfirm]         = useState<'approve' | 'reject' | null>(null);
  const [showLaunchInput, setShowLaunchInput] = useState(false);
  const [launchUrl, setLaunchUrl]     = useState('');

  useEffect(() => {
    setForm(build);
    setEditing(false);
    setBs(getBuildStatus(build));
    setShowLaunchInput(false);
    setLaunchUrl('');
    setConfirm(null);
  }, [build]);

  const linkedLead = build.lead_id ? allLeads.find(l => l.id === build.lead_id) : null;

  const applyBuildStatus = async (status: BuildStatus) => {
    setBs(status);
    await persistBuildStatus(build.id, status);
  };

  const advanceStage = async () => {
    if (form.current_stage >= FACTORY_STAGES.length) return;
    const updated = { ...form, current_stage: form.current_stage + 1, updated_at: new Date().toISOString() };
    setForm(updated); onUpdate(updated);
    try { await supabase.from('factory_builds').update({ current_stage: updated.current_stage }).eq('id', build.id); } catch {}
  };

  const setStage = async (idx: number) => {
    const updated = { ...form, current_stage: idx, updated_at: new Date().toISOString() };
    setForm(updated); onUpdate(updated);
    try { await supabase.from('factory_builds').update({ current_stage: idx }).eq('id', build.id); } catch {}
  };

  const save = async () => {
    onUpdate(form); setEditing(false);
    try {
      await supabase.from('factory_builds').update({
        client_name: form.client_name,
        business_name: form.business_name,
        notes: form.notes,
        preview_url: form.preview_url,
        live_url: form.live_url,
      }).eq('id', build.id);
    } catch {}
  };

  const handleSendMockup = async () => {
    await applyBuildStatus('mockup_sent');
    if (build.lead_id) onUpdateLeadStatus(build.lead_id, 'mockup_sent');
  };

  const handleApprove = async () => {
    await applyBuildStatus('approved');
    if (build.lead_id) onUpdateLeadStatus(build.lead_id, 'approved');
    setConfirm(null);
  };

  const handleReject = async () => {
    await applyBuildStatus('rejected');
    if (build.lead_id) onUpdateLeadStatus(build.lead_id, 'lost');
    setConfirm(null);
  };

  const handleConfirmLaunch = async () => {
    await applyBuildStatus('launched');
    if (build.lead_id) onUpdateLeadStatus(build.lead_id, 'launched');

    // Store live_url on the build
    const url = launchUrl.trim();
    const updatedBuild = { ...form, live_url: url || form.live_url };
    setForm(updatedBuild);
    onUpdate(updatedBuild);
    try {
      await supabase.from('factory_builds').update({ live_url: updatedBuild.live_url }).eq('id', build.id);
    } catch {}

    // Also store the website URL on the linked lead
    if (url && linkedLead) {
      onUpdateLead({ ...linkedLead, website: url });
    }
    setShowLaunchInput(false);
    setLaunchUrl('');
  };

  const pct = Math.round((form.current_stage / FACTORY_STAGES.length) * 100);

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex-1 flex flex-col overflow-hidden border-l border-[#1A1A1A]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#1A1A1A] shrink-0">
        <div>
          <p className="text-sm font-semibold text-[#F2F2F2]">{form.client_name}</p>
          {form.business_name && <p className="text-xs text-[#555]">{form.business_name}</p>}
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setEditing(e => !e)} className="p-1.5 rounded text-[#555] hover:text-[#909090] hover:bg-[#141414]"><Edit3 size={13} /></button>
          <button onClick={onClose} className="p-1.5 rounded text-[#555] hover:text-[#909090] hover:bg-[#141414]"><X size={13} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">

        {/* Pipeline Actions */}
        {build.lead_id && (
          <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3.5">
            <p className="text-[10px] text-[#555] uppercase tracking-wider font-semibold mb-2.5">Pipeline Actions</p>

            {linkedLead && (
              <p className="text-[10px] text-[#909090] mb-3">
                Lead: <span className="text-[#F2F2F2] font-medium">{linkedLead.name}</span>
                {linkedLead.company ? <span className="text-[#555]"> · {linkedLead.company}</span> : ''}
              </p>
            )}

            {buildStatus === 'active' && (
              <button
                onClick={handleSendMockup}
                className="w-full flex items-center justify-center gap-2 py-2 bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] rounded-lg text-xs font-semibold hover:bg-[#F97316]/20 transition-colors"
              >
                <Send size={12} /> Send Mockup
              </button>
            )}

            {buildStatus === 'mockup_sent' && (
              <div className="space-y-2">
                <p className="text-[9px] text-[#555] text-center mb-1">Mockup sent — waiting on prospect response</p>
                {confirm === null ? (
                  <div className="flex gap-2">
                    <button onClick={() => setConfirm('approve')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-xs font-semibold hover:bg-green-500/20 transition-colors">
                      <ThumbsUp size={12} /> Approved
                    </button>
                    <button onClick={() => setConfirm('reject')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-500/20 transition-colors">
                      <ThumbsDown size={12} /> Rejected
                    </button>
                  </div>
                ) : confirm === 'approve' ? (
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-green-400">Move lead to Approved?</p>
                    <div className="flex gap-2">
                      <button onClick={handleApprove} className="flex-1 py-1.5 bg-green-600 text-white text-xs rounded font-medium hover:bg-green-500">Confirm</button>
                      <button onClick={() => setConfirm(null)} className="px-3 py-1.5 text-xs text-[#555] hover:text-[#909090]">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-red-400">Move lead to Lost?</p>
                    <div className="flex gap-2">
                      <button onClick={handleReject} className="flex-1 py-1.5 bg-red-600 text-white text-xs rounded font-medium hover:bg-red-500">Confirm</button>
                      <button onClick={() => setConfirm(null)} className="px-3 py-1.5 text-xs text-[#555] hover:text-[#909090]">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {buildStatus === 'approved' && !showLaunchInput && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold mb-2">
                  <CheckCircle2 size={13} /> Prospect approved — awaiting payment
                </div>
                <button
                  onClick={() => setShowLaunchInput(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-[#06B6D4]/10 border border-[#06B6D4]/30 text-[#06B6D4] rounded-lg text-xs font-semibold hover:bg-[#06B6D4]/20 transition-colors"
                >
                  <Rocket size={12} /> Mark as Launched
                </button>
              </div>
            )}

            {buildStatus === 'approved' && showLaunchInput && (
              <div className="space-y-2">
                <p className="text-[10px] text-[#06B6D4] font-semibold">Enter live site URL</p>
                <input
                  type="url"
                  value={launchUrl}
                  onChange={e => setLaunchUrl(e.target.value)}
                  placeholder="https://clientsite.com"
                  autoFocus
                  className="w-full bg-[#141414] border border-[#06B6D4]/30 rounded px-2.5 py-1.5 text-xs text-[#F2F2F2] focus:outline-none focus:border-[#06B6D4]/60 placeholder-[#555]"
                />
                <p className="text-[9px] text-[#555]">URL also saved to the linked lead's website field.</p>
                <div className="flex gap-2">
                  <button onClick={handleConfirmLaunch}
                    className="flex-1 py-1.5 bg-[#06B6D4] text-white text-xs rounded font-medium hover:bg-[#0EA5E9] transition-colors flex items-center justify-center gap-1.5">
                    <Rocket size={11} /> Confirm Launch
                  </button>
                  <button onClick={() => { setShowLaunchInput(false); setLaunchUrl(''); }}
                    className="px-3 py-1.5 text-xs text-[#555] hover:text-[#909090]">Cancel</button>
                </div>
              </div>
            )}

            {buildStatus === 'launched' && (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#06B6D4] text-xs font-semibold">
                  <Rocket size={13} /> Site is live
                </div>
                {form.live_url && (
                  <a href={form.live_url.startsWith('http') ? form.live_url : 'https://' + form.live_url}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] text-[#3B82F6] hover:underline">
                    <ExternalLink size={10} /> {form.live_url}
                  </a>
                )}
              </div>
            )}

            {buildStatus === 'rejected' && (
              <div className="flex items-center gap-1.5 text-red-400 text-xs font-semibold">
                <ThumbsDown size={13} /> Rejected — lead moved to Lost
              </div>
            )}
          </div>
        )}

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-[#555] uppercase tracking-wider font-semibold">Factory Progress</p>
            <span className="text-xs text-[#F2F2F2] font-mono font-semibold">{pct}%</span>
          </div>
          <div className="h-1.5 bg-[#1E1E1E] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4 }}
              className="h-full bg-[#CD3D35] rounded-full"
            />
          </div>
        </div>

        {/* Stage checklist */}
        <div>
          <p className="text-[10px] text-[#555] uppercase tracking-wider font-semibold mb-2">Stages</p>
          <div className="space-y-1">
            {FACTORY_STAGES.map((stage, idx) => {
              const done = idx < form.current_stage;
              const current = idx === form.current_stage;
              return (
                <button key={idx} onClick={() => setStage(idx)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${current ? 'bg-[#CD3D35]/10 border border-[#CD3D35]/30' : 'hover:bg-[#141414]'}`}
                >
                  {done ? <CheckCircle2 size={13} className="text-green-500 shrink-0" />
                    : current ? <div className="w-3 h-3 rounded-full bg-[#CD3D35] shrink-0" />
                    : <Circle size={13} className="text-[#2A2A2A] shrink-0" />}
                  <span className={`text-xs ${done ? 'text-[#555] line-through' : current ? 'text-[#F2F2F2] font-medium' : 'text-[#555]'}`}>
                    {idx + 1}. {stage.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editable fields */}
        {editing ? (
          <div className="space-y-3">
            {[['client_name','Client Name'],['business_name','Business Name'],['preview_url','Preview URL'],['live_url','Live URL']].map(([field, label]) => (
              <div key={field}>
                <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1">{label}</label>
                <input
                  value={(form as any)[field] ?? ''}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs text-[#F2F2F2] focus:outline-none focus:border-[#CD3D35]/50"
                />
              </div>
            ))}
            <div>
              <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1">Notes</label>
              <textarea value={form.notes ?? ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={3} className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-2.5 py-2 text-xs text-[#F2F2F2] focus:outline-none resize-none" />
            </div>
            <div className="flex gap-2">
              <button onClick={save} className="flex-1 bg-[#CD3D35] text-white text-xs py-1.5 rounded font-medium hover:bg-[#E85550] transition-colors">Save</button>
              <button onClick={() => setEditing(false)} className="flex-1 bg-[#141414] border border-[#2A2A2A] text-xs py-1.5 rounded text-[#909090] hover:text-[#F2F2F2]">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {form.notes && (
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-wider font-semibold mb-1">Notes</p>
                <p className="text-xs text-[#909090] leading-relaxed">{form.notes}</p>
              </div>
            )}
            {(form.preview_url || form.live_url) && (
              <div className="flex flex-col gap-1">
                {form.preview_url && (
                  <a href={form.preview_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-[#3B82F6] hover:underline">
                    <ExternalLink size={11} /> Preview
                  </a>
                )}
                {form.live_url && (
                  <a href={form.live_url.startsWith('http') ? form.live_url : 'https://' + form.live_url}
                    target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-green-400 hover:underline">
                    <ExternalLink size={11} /> Live site
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[#1A1A1A] flex items-center gap-2">
        {form.current_stage < FACTORY_STAGES.length && (
          <button onClick={advanceStage} className="flex-1 py-2 bg-[#CD3D35] text-white rounded text-xs font-medium hover:bg-[#E85550] transition-colors">
            Advance to: {FACTORY_STAGES[form.current_stage + 1]?.label ?? 'Complete'}
          </button>
        )}
        {form.current_stage >= FACTORY_STAGES.length && (
          <div className="flex-1 py-2 text-center text-xs text-green-400 font-medium">All stages complete</div>
        )}
        <button onClick={() => onDelete(build.id)}
          className="p-2 rounded bg-[#141414] border border-[#2A2A2A] text-[#555] hover:text-red-500 hover:bg-red-500/10 transition-colors">
          <Trash2 size={12} />
        </button>
      </div>
    </motion.div>
  );
};

// ── NewBuildModal ─────────────────────────────────────────────────────────────

const NewBuildModal: React.FC<{
  campaigns: Campaign[];
  allLeads: Lead[];
  onAdd: (build: Build) => void;
  onUpdateLeadStatus: (leadId: string, status: string) => void;
  onClose: () => void;
}> = ({ campaigns, allLeads, onAdd, onUpdateLeadStatus, onClose }) => {
  const folderMap = loadFolderMap();
  const [form, setForm]                     = useState({ client_name: '', business_name: '', notes: '' });
  const [selectedNicheId, setSelectedNicheId] = useState('');
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [leadSearch, setLeadSearch]         = useState('');
  const [selectedLead, setSelectedLead]     = useState<Lead | null>(null);
  const [showDropdown, setShowDropdown]     = useState(false);
  const [submitting, setSubmitting]         = useState(false);
  const [submitError, setSubmitError]       = useState('');
  const searchRef                           = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const nicheCampaigns = selectedNicheId
    ? campaigns.filter(c => folderMap[c.id]?.nicheId === selectedNicheId)
    : campaigns;

  const campaignLeads = selectedCampaignId
    ? allLeads.filter(l => l.campaignId === selectedCampaignId)
    : allLeads;

  const filteredLeads = leadSearch.trim().length > 0
    ? campaignLeads.filter(l =>
        l.company?.toLowerCase().includes(leadSearch.toLowerCase()) ||
        l.name?.toLowerCase().includes(leadSearch.toLowerCase())
      ).slice(0, 8)
    : [];

  const submit = async () => {
    if (!form.client_name.trim()) {
      setSubmitError('Client name is required.');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setSubmitError('Not signed in.'); setSubmitting(false); return; }

      const build: Build = {
        id: crypto.randomUUID(),
        user_id: user.id,
        niche: selectedNicheId || undefined,
        lead_id: selectedLead?.id || undefined,
        build_status: 'active',
        client_name: form.client_name.trim(),
        business_name: form.business_name.trim() || undefined,
        notes: form.notes.trim() || undefined,
        current_stage: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // ── Insert the three NOT NULL columns ────────────────────────────────────
      const { error: insertError } = await supabase.from('factory_builds').insert({
        id:      build.id,
        user_id: build.user_id,
        niche:   build.niche ?? '',
      });

      if (insertError) {
        console.error('[Builds] insert failed:', insertError.message);
        setSubmitError(`Save failed: ${insertError.message}`);
        setSubmitting(false);
        return;
      }

      // ── Push all data fields as a follow-up update — works once you run the SQL migration ──
      supabase.from('factory_builds').update({
        client_name:   build.client_name,
        current_stage: 0,
        created_at:    build.created_at,
        updated_at:    build.updated_at,
        ...(build.niche         && { niche:         build.niche }),
        ...(build.business_name && { business_name: build.business_name }),
        ...(build.notes         && { notes:         build.notes }),
        ...(build.lead_id       && { lead_id:        build.lead_id }),
      }).eq('id', build.id).then(({ error }) => {
        if (error) console.warn('[Builds] data update partial — run SQL migration:', error.message);
      });

      // ── build_status in localStorage (Supabase col added via migration) ──────
      try {
        const map = JSON.parse(localStorage.getItem(BS_KEY) || '{}');
        map[build.id] = 'active';
        localStorage.setItem(BS_KEY, JSON.stringify(map));
      } catch {}

      if (build.lead_id) onUpdateLeadStatus(build.lead_id, 'mockup_building');
      onAdd(build);
      onClose();
    } catch (err) {
      console.error('[Builds] unexpected error:', err);
      setSubmitError('Unexpected error — check console.');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-sm bg-[#141414] border border-[#2A2A2A] rounded-xl shadow-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A] shrink-0">
          <h3 className="text-sm font-semibold text-[#F2F2F2]">New Build</h3>
          <button onClick={onClose} className="text-[#555] hover:text-[#909090]"><X size={14} /></button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {/* Client name / business */}
          {[['client_name','Client Name *'],['business_name','Business Name']].map(([f, l]) => (
            <div key={f}>
              <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1">{l}</label>
              <input
                value={(form as any)[f]}
                onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs text-[#F2F2F2] focus:outline-none focus:border-[#CD3D35]/50"
              />
            </div>
          ))}

          {/* Niche selector */}
          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1">Niche <span className="font-normal normal-case text-[#383838]">(optional filter)</span></label>
            <div className="grid grid-cols-4 gap-1.5">
              {NICHES.map(n => (
                <button key={n.id}
                  onClick={() => { setSelectedNicheId(prev => prev === n.id ? '' : n.id); setSelectedCampaignId(''); setSelectedLead(null); setLeadSearch(''); }}
                  className={`px-2 py-1.5 rounded text-[10px] font-medium border transition-colors text-center ${
                    selectedNicheId === n.id ? 'text-white border-current' : 'text-[#555] border-[#2A2A2A] hover:border-[#383838] hover:text-[#909090]'
                  }`}
                  style={selectedNicheId === n.id ? { color: n.color, borderColor: n.color + '66', background: n.color + '15' } : {}}
                >
                  {n.short}
                </button>
              ))}
            </div>
          </div>

          {/* Campaign filter */}
          {selectedNicheId && nicheCampaigns.length > 0 && (
            <div>
              <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1">Campaign <span className="font-normal normal-case text-[#383838]">(narrows lead search)</span></label>
              <select value={selectedCampaignId} onChange={e => { setSelectedCampaignId(e.target.value); setSelectedLead(null); setLeadSearch(''); }}
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs text-[#F2F2F2] focus:outline-none">
                <option value="">-- All campaigns --</option>
                {nicheCampaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}

          {/* Lead search */}
          <div ref={searchRef}>
            <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1">
              Link Lead <span className="font-normal normal-case text-[#383838]">(search by company or name)</span>
            </label>
            {selectedLead ? (
              <div className="flex items-center gap-2 px-2.5 py-2 bg-[#CD3D35]/10 border border-[#CD3D35]/30 rounded text-xs text-[#F2F2F2]">
                <span className="flex-1 truncate font-medium">{selectedLead.company || selectedLead.name}</span>
                <button onClick={() => { setSelectedLead(null); setLeadSearch(''); }} className="text-[#555] hover:text-[#909090] shrink-0"><X size={12} /></button>
              </div>
            ) : (
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#555]" />
                <input
                  value={leadSearch}
                  onChange={e => { setLeadSearch(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search company or name..."
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded pl-7 pr-2.5 py-1.5 text-xs text-[#F2F2F2] focus:outline-none focus:border-[#CD3D35]/50 placeholder-[#555]"
                />
                {showDropdown && filteredLeads.length > 0 && (
                  <div className="absolute z-10 top-full left-0 right-0 mt-0.5 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg shadow-xl overflow-hidden">
                    {filteredLeads.map(l => (
                      <button key={l.id} onMouseDown={() => { setSelectedLead(l); setLeadSearch(''); setShowDropdown(false); }}
                        className="w-full text-left px-3 py-2 text-xs text-[#909090] hover:text-[#F2F2F2] hover:bg-[#252525] transition-colors border-b border-[#1A1A1A] last:border-0">
                        <span className="font-medium text-[#F2F2F2]">{l.company || l.name}</span>
                        {l.company && l.name !== l.company && <span className="text-[#555] ml-1">· {l.name}</span>}
                      </button>
                    ))}
                  </div>
                )}
                {showDropdown && leadSearch.trim() && filteredLeads.length === 0 && (
                  <div className="absolute z-10 top-full left-0 right-0 mt-0.5 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-3 py-2 text-xs text-[#555]">
                    No leads found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2}
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs text-[#F2F2F2] focus:outline-none resize-none" />
          </div>
        </div>

        <div className="p-4 border-t border-[#2A2A2A] flex flex-col gap-2 shrink-0">
          {submitError && (
            <p className="text-[10px] text-red-400 text-center font-medium">{submitError}</p>
          )}
          <div className="flex gap-2">
            <button
              onClick={submit}
              disabled={submitting}
              className="flex-1 bg-[#CD3D35] text-white text-xs py-2 rounded font-medium hover:bg-[#E85550] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              {submitting ? <><Loader2 size={11} className="animate-spin" /> Saving...</> : 'Create Build'}
            </button>
            <button onClick={onClose} className="px-4 py-2 text-xs text-[#555] hover:text-[#909090]">Cancel</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ── Builds Main ───────────────────────────────────────────────────────────────

interface BuildsProps {
  campaigns: Campaign[];
  allLeads: Lead[];
  onUpdateLeadStatus: (leadId: string, status: string) => void;
  onUpdateLead: (lead: Lead) => void;
}

const Builds: React.FC<BuildsProps> = ({ campaigns, allLeads, onUpdateLeadStatus, onUpdateLead }) => {
  const [builds, setBuilds]   = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Build | null>(null);
  const [showNew, setShowNew] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('factory_builds').select('*').eq('user_id', user.id).order('updated_at', { ascending: false });
      if (data) setBuilds(data as Build[]);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateBuild = (updated: Build) => {
    setBuilds(prev => prev.map(b => b.id === updated.id ? updated : b));
    if (selected?.id === updated.id) setSelected(updated);
  };

  const deleteBuild = (id: string) => {
    setBuilds(prev => prev.filter(b => b.id !== id));
    setSelected(null);
    try { supabase.from('factory_builds').delete().eq('id', id); } catch {}
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 shrink-0 flex flex-col border-r border-[#1A1A1A]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A1A1A] shrink-0">
          <span className="text-sm font-semibold text-[#F2F2F2]">Builds</span>
          <button onClick={() => setShowNew(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#CD3D35] text-white rounded text-xs font-medium hover:bg-[#E85550] transition-colors">
            <Plus size={11} /> New
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32"><Loader2 size={16} className="text-[#555] animate-spin" /></div>
          ) : builds.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-center px-4">
              <p className="text-sm text-[#383838]">No builds yet</p>
              <p className="text-xs text-[#383838]">Create a build to track your factory pipeline.</p>
            </div>
          ) : builds.map(build => (
            <BuildRow key={build.id} build={build} active={selected?.id === build.id} onSelect={() => setSelected(build)} />
          ))}
        </div>
      </div>

      {/* Detail */}
      <AnimatePresence>
        {selected ? (
          <BuildDetail
            key={selected.id}
            build={selected}
            allLeads={allLeads}
            onUpdate={updateBuild}
            onDelete={deleteBuild}
            onClose={() => setSelected(null)}
            onUpdateLeadStatus={onUpdateLeadStatus}
            onUpdateLead={onUpdateLead}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-[#383838]">Select a build to view details</p>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNew && (
          <NewBuildModal
            campaigns={campaigns}
            allLeads={allLeads}
            onAdd={(b) => { setBuilds(prev => [b, ...prev]); setSelected(b); }}
            onUpdateLeadStatus={onUpdateLeadStatus}
            onClose={() => setShowNew(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Builds;
