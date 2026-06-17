import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Plus, X, Phone, Globe, Star, ChevronDown, Trash2, Edit3, ExternalLink, TrendingDown, DollarSign, MessageSquare, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Campaign, Lead } from './types';
import type { CRMView } from './CRM';
import { NICHES } from '../../lib/niches';

// ── Stage definitions ─────────────────────────────────────────────────────────

export const CALL_STAGES = [
  { id: 'prospect',        label: 'Prospect',        color: '#555555', short: 'Prospect'  },
  { id: 'called',          label: 'Called',          color: '#3B82F6', short: 'Called'    },
  { id: 'picked_up',       label: 'Picked Up',       color: '#06B6D4', short: 'Picked Up' },
  { id: 'voicemail',       label: 'Voicemail',       color: '#F59E0B', short: 'Voicemail' },
  { id: 'follow_up',       label: 'Follow Up',       color: '#F97316', short: 'Follow Up' },
  { id: 'demo_booked',     label: 'Interested',      color: '#8B5CF6', short: 'Interested'},
  { id: 'mockup_building', label: 'Mockup Building', color: '#EC4899', short: 'Building'  },
  { id: 'mockup_sent',     label: 'Mockup Sent',     color: '#F59E0B', short: 'Sent'      },
  { id: 'approved',        label: 'Approved',        color: '#10B981', short: 'Approved'  },
  { id: 'paid',            label: 'Paid',            color: '#22C55E', short: 'Paid'      },
  { id: 'launched',        label: 'Launched',        color: '#06B6D4', short: 'Launched'  },
  { id: 'lost',            label: 'Lost',            color: '#374151', short: 'Lost'      },
] as const;

export const DM_STAGES = [
  { id: 'dm_prospect',        label: 'Prospect',        color: '#555555', short: 'Prospect'   },
  { id: 'dm_sent',            label: 'DM Sent',         color: '#3B82F6', short: 'DM Sent'    },
  { id: 'dm_replied',         label: 'Replied',         color: '#10B981', short: 'Replied'    },
  { id: 'dm_interested',      label: 'Interested',      color: '#06B6D4', short: 'Interested' },
  { id: 'dm_mockup_building', label: 'Mockup Building', color: '#F59E0B', short: 'Building'   },
  { id: 'dm_mockup_sent',     label: 'Mockup Sent',     color: '#F97316', short: 'Sent'       },
  { id: 'dm_approved',        label: 'Approved',        color: '#8B5CF6', short: 'Approved'   },
  { id: 'dm_paid',            label: 'Paid',            color: '#22C55E', short: 'Paid'       },
  { id: 'dm_launched',        label: 'Launched',        color: '#06B6D4', short: 'Launched'   },
  { id: 'dm_lost',            label: 'Lost',            color: '#374151', short: 'Lost'       },
] as const;

export const EMAIL_STAGES = [
  { id: 'em_prospect',        label: 'Prospect',        color: '#555555', short: 'Prospect'   },
  { id: 'em_sent',            label: 'Email Sent',      color: '#10B981', short: 'Sent'       },
  { id: 'em_replied',         label: 'Replied',         color: '#06B6D4', short: 'Replied'    },
  { id: 'em_interested',      label: 'Interested',      color: '#8B5CF6', short: 'Interested' },
  { id: 'em_mockup_building', label: 'Mockup Building', color: '#F59E0B', short: 'Building'   },
  { id: 'em_mockup_sent',     label: 'Mockup Sent',     color: '#F97316', short: 'Sent'       },
  { id: 'em_approved',        label: 'Approved',        color: '#EC4899', short: 'Approved'   },
  { id: 'em_paid',            label: 'Paid',            color: '#22C55E', short: 'Paid'       },
  { id: 'em_launched',        label: 'Launched',        color: '#06B6D4', short: 'Launched'   },
  { id: 'em_lost',            label: 'Lost',            color: '#374151', short: 'Lost'       },
] as const;

// Kept for backward-compat (Mockups.tsx uses it for color lookup)
export const PIPELINE_STAGES = [...CALL_STAGES, ...DM_STAGES, ...EMAIL_STAGES] as const;

type PipelineTab = 'calls' | 'dms' | 'emails';

// ── Folder map (same localStorage key used by Leads.tsx) ─────────────────────
const FOLDER_MAP_KEY = 'aiw_lead_folders';
type ChannelId = 'cold-calls' | 'cold-dms' | 'cold-emails';
interface FolderAssignment { channelId: ChannelId; nicheId: string; }
type FolderMap = Record<string, FolderAssignment>;

function loadFolderMap(): FolderMap {
  try {
    const raw = JSON.parse(localStorage.getItem(FOLDER_MAP_KEY) || '{}');
    const result: FolderMap = {};
    for (const [id, val] of Object.entries(raw)) {
      if (val && typeof val === 'object') {
        const v = val as any;
        if (v.channelId && v.nicheId) result[id] = { channelId: v.channelId, nicheId: v.nicheId };
        else if (v.nicheId)           result[id] = { channelId: 'cold-calls', nicheId: v.nicheId };
      }
    }
    return result;
  } catch { return {}; }
}

function getLeadNiche(lead: { campaignId: string; niche?: string }, folderMap: FolderMap, campaigns: Campaign[]): string | undefined {
  return folderMap[lead.campaignId]?.nicheId
    ?? lead.niche
    ?? campaigns.find(c => c.id === lead.campaignId)?.niche;
}

const DM_STAGE_IDS    = new Set(DM_STAGES.map(s => s.id)    as string[]);
const EMAIL_STAGE_IDS = new Set(EMAIL_STAGES.map(s => s.id) as string[]);

function getLeadPipeline(status: string): PipelineTab {
  if (DM_STAGE_IDS.has(status))    return 'dms';
  if (EMAIL_STAGE_IDS.has(status)) return 'emails';
  return 'calls';
}

function normalizeStage(status: string, pipeline: PipelineTab): string {
  const stages = pipeline === 'calls' ? CALL_STAGES : pipeline === 'dms' ? DM_STAGES : EMAIL_STAGES;
  const ids = stages.map(s => s.id) as string[];
  if (ids.includes(status)) return status;

  const legacyToCall: Record<string, string> = {
    'Not Called': 'prospect', 'Called': 'called', 'Demo Booked': 'demo_booked',
    'Interested': 'demo_booked', 'Not Interested': 'lost', 'Wrong Number': 'lost',
    'Follow-up Required': 'follow_up', 'Voicemail': 'voicemail', 'New Lead': 'prospect',
    'Client': 'paid', 'Closed': 'launched', 'qualified': 'prospect',
    'dm_sent': 'called', 'replied': 'picked_up', 'review_requested': 'launched',
    'closed_referral': 'launched', 'mockup_building': 'mockup_building',
    'mockup_sent': 'mockup_sent', 'approved': 'approved', 'paid': 'paid',
    'launched': 'launched', 'lost': 'lost',
  };
  const legacyToDm: Record<string, string> = {
    'dm_sent': 'dm_sent', 'replied': 'dm_replied', 'mockup_building': 'dm_mockup_building',
    'mockup_sent': 'dm_mockup_sent', 'approved': 'dm_approved',
    'paid': 'dm_paid', 'launched': 'dm_launched', 'lost': 'dm_lost',
  };
  const legacyToEmail: Record<string, string> = {
    'em_sent': 'em_sent', 'replied': 'em_replied', 'mockup_building': 'em_mockup_building',
    'mockup_sent': 'em_mockup_sent', 'approved': 'em_approved',
    'paid': 'em_paid', 'launched': 'em_launched', 'lost': 'em_lost',
  };
  const map = pipeline === 'calls' ? legacyToCall : pipeline === 'dms' ? legacyToDm : legacyToEmail;
  return map[status] ?? (pipeline === 'calls' ? 'prospect' : pipeline === 'dms' ? 'dm_prospect' : 'em_prospect');
}

function getIcpColor(score: number): string {
  if (score >= 8) return '#22C55E';
  if (score >= 5) return '#F59E0B';
  return '#EF4444';
}

type AnyStage = typeof CALL_STAGES[number] | typeof DM_STAGES[number];

// ── Props ─────────────────────────────────────────────────────────────────────

interface PipelineProps {
  campaigns: Campaign[];
  allLeads: Lead[];
  onAddLead: (lead: Lead) => void;
  onUpdateLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
  onUpdateLeadStatus: (leadId: string, status: string) => void;
  onNavigate: (view: CRMView, leadId?: string, campaignId?: string) => void;
  onLeadPaid?: (leadId: string, upfront: number, monthly: number) => void;
}

// ── Lost Modal ────────────────────────────────────────────────────────────────

const OBJECTIONS = ['Price', 'Timing', 'Competition', 'No Budget', 'Not Interested', 'Wrong Fit', 'Other'];

const LostModal: React.FC<{
  lead: Lead;
  onConfirm: (objection: string, notes: string) => void;
  onClose: () => void;
}> = ({ lead, onConfirm, onClose }) => {
  const [objection, setObjection] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-sm bg-[#141414] border border-[#2A2A2A] rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-0.5 bg-[#374151]" />
        <div className="p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#252525] border border-[#2A2A2A] flex items-center justify-center">
              <TrendingDown size={15} className="text-[#909090]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-[#F2F2F2]">Mark as Lost</h3>
              <p className="text-[10px] text-[#555] truncate">{lead.name}{lead.company ? ` · ${lead.company}` : ''}</p>
            </div>
            <button onClick={onClose} className="text-[#555] hover:text-[#909090]"><X size={13} /></button>
          </div>

          <p className="text-[10px] text-[#555] uppercase tracking-wider font-semibold mb-2">Objection (optional)</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {OBJECTIONS.map(o => (
              <button
                key={o}
                onClick={() => setObjection(prev => prev === o ? '' : o)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                  objection === o
                    ? 'bg-[#374151] border-[#4B5563] text-[#F2F2F2]'
                    : 'border-[#2A2A2A] text-[#555] hover:border-[#383838] hover:text-[#909090]'
                }`}
              >
                {o}
              </button>
            ))}
          </div>

          <div className="mb-4">
            <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1.5">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="What happened? Any follow-up context..."
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded px-3 py-2 text-xs text-[#F2F2F2] placeholder-[#555] focus:outline-none focus:border-[#CD3D35]/30 h-16 resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onConfirm(objection, notes)}
              className="flex-1 bg-[#252525] border border-[#383838] text-[#F2F2F2] text-xs py-2 rounded font-medium hover:bg-[#2A2A2A] transition-colors"
            >
              Mark Lost
            </button>
            <button onClick={onClose} className="px-4 py-2 text-xs text-[#555] hover:text-[#909090] transition-colors">Cancel</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ── Paid Modal ────────────────────────────────────────────────────────────────

const PaidModal: React.FC<{
  lead: Lead;
  onConfirm: (upfront: number, monthly: number) => void;
  onSkip: () => void;
  onClose: () => void;
}> = ({ lead, onConfirm, onSkip, onClose }) => {
  const [upfront, setUpfront] = useState('');
  const [monthly, setMonthly] = useState('');

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-sm bg-[#141414] border border-[#2A2A2A] rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-0.5 bg-[#22C55E]" />
        <div className="p-5">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <DollarSign size={15} className="text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-[#F2F2F2]">Deal Closed</h3>
              <p className="text-[10px] text-green-400">Log revenue to track MRR and ARR</p>
            </div>
            <button onClick={onClose} className="text-[#555] hover:text-[#909090]"><X size={13} /></button>
          </div>
          <p className="text-[10px] text-[#555] mb-4 truncate">{lead.name}{lead.company ? ` · ${lead.company}` : ''}</p>

          <div className="space-y-3 mb-4">
            <div>
              <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1.5">Upfront Payment</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555] text-xs">$</span>
                <input
                  type="number" value={upfront} onChange={e => setUpfront(e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded pl-6 pr-3 py-1.5 text-xs text-[#F2F2F2] placeholder-[#555] focus:outline-none focus:border-green-500/30"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1.5">Monthly Retainer</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555] text-xs">$</span>
                <input
                  type="number" value={monthly} onChange={e => setMonthly(e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded pl-6 pr-3 py-1.5 text-xs text-[#F2F2F2] placeholder-[#555] focus:outline-none focus:border-green-500/30"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onConfirm(Number(upfront) || 0, Number(monthly) || 0)}
              className="flex-1 bg-green-600 text-white text-xs py-2 rounded font-medium hover:bg-green-500 transition-colors"
            >
              Log Client
            </button>
            <button onClick={onSkip} className="px-4 py-2 text-xs text-[#555] hover:text-[#909090] transition-colors">Skip</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ── Lead Card ─────────────────────────────────────────────────────────────────

const LeadCard: React.FC<{
  lead: Lead;
  stageColor: string;
  stages: readonly AnyStage[];
  onOpen: () => void;
  onMove: (stageId: string) => void;
  onDelete: () => void;
  onDial: () => void;
}> = ({ lead, stageColor, stages, onOpen, onMove, onDelete, onDial }) => {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [menuStyle, setMenuStyle]   = useState<React.CSSProperties>({});
  const btnRef                      = React.useRef<HTMLButtonElement>(null);
  const initials = lead.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??';

  const openMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (btnRef.current) {
      const rect         = btnRef.current.getBoundingClientRect();
      const approxMenuH  = 32 + stages.length * 26 + 28; // header + stage rows + divider+delete
      const spaceBelow   = window.innerHeight - rect.bottom;
      const goUp         = spaceBelow < approxMenuH + 8;
      setMenuStyle(goUp
        ? { position: 'fixed', right: window.innerWidth - rect.right, bottom: window.innerHeight - rect.top + 4, zIndex: 9999 }
        : { position: 'fixed', right: window.innerWidth - rect.right, top: rect.bottom + 4, zIndex: 9999 }
      );
    }
    setMenuOpen(o => !o);
  };

  // Close on any outside mousedown
  React.useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-2.5 cursor-pointer hover:border-[#383838] transition-colors group relative select-none">
      <div onClick={onOpen}>
        <div className="flex items-start gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5" style={{ background: stageColor + '22', color: stageColor }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#F2F2F2] leading-tight truncate">{lead.name}</p>
            {lead.company && <p className="text-[10px] text-[#909090] truncate">{lead.company}</p>}
          </div>
          {lead.icpScore !== undefined && (
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 leading-tight"
              style={{ background: getIcpColor(lead.icpScore) + '20', color: getIcpColor(lead.icpScore) }}
            >
              {lead.icpScore}
            </span>
          )}
        </div>
        {lead.rating && (
          <div className="flex items-center gap-1 mb-1">
            <Star size={9} className="text-yellow-500 fill-yellow-500" />
            <span className="text-[10px] text-[#909090] font-mono">{lead.rating}</span>
            {lead.reviews && <span className="text-[10px] text-[#555]">({lead.reviews})</span>}
          </div>
        )}
      </div>

      {/* Actions row */}
      <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-[#1A1A1A]">
        <button
          onClick={(e) => { e.stopPropagation(); onDial(); }}
          className="p-1 rounded text-[#555] hover:text-[#CD3D35] hover:bg-[#CD3D35]/10 transition-colors"
          title="Dial"
        >
          <Phone size={10} />
        </button>
        {lead.website && (
          <a
            href={lead.website.startsWith('http') ? lead.website : 'https://' + lead.website}
            target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="p-1 rounded text-[#555] hover:text-[#3B82F6] hover:bg-blue-500/10 transition-colors"
          >
            <Globe size={10} />
          </a>
        )}
        <div className="ml-auto">
          <button
            ref={btnRef}
            onClick={openMenu}
            className="p-1 rounded text-[#555] hover:text-[#909090] hover:bg-[#1E1E1E] transition-colors"
          >
            <ChevronDown size={10} />
          </button>
        </div>
      </div>

      {/* Portal dropdown — rendered in document.body to escape overflow clipping */}
      {menuOpen && ReactDOM.createPortal(
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -2 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.1 }}
          style={menuStyle}
          className="w-40 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg shadow-xl py-0.5 max-h-72 overflow-y-auto"
          onMouseDown={e => e.stopPropagation()}
        >
          <p className="text-[9px] text-[#555] px-2.5 py-1 font-semibold uppercase tracking-wider">Move to</p>
          {stages.map(s => (
            <button
              key={s.id}
              onClick={() => { onMove(s.id); setMenuOpen(false); }}
              className="w-full text-left px-2.5 py-1 text-[11px] text-[#909090] hover:text-[#F2F2F2] hover:bg-[#252525] flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.color }} />
              {s.label}
            </button>
          ))}
          <div className="h-px bg-[#2A2A2A] my-0.5" />
          <button
            onClick={() => { onDelete(); setMenuOpen(false); }}
            className="w-full text-left px-2.5 py-1 text-[11px] text-red-500 hover:bg-red-500/10 flex items-center gap-1.5"
          >
            <Trash2 size={10} /> Delete
          </button>
        </motion.div>,
        document.body
      )}
    </div>
  );
};

// ── Detail Panel ──────────────────────────────────────────────────────────────

const DetailPanel: React.FC<{
  lead: Lead | null;
  stages: readonly AnyStage[];
  pipeline: PipelineTab;
  campaigns: Campaign[];
  folderMap: FolderMap;
  onClose: () => void;
  onUpdate: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, stage: string) => void;
}> = ({ lead, stages, pipeline, campaigns, folderMap, onClose, onUpdate, onDelete, onMove }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Lead | null>(lead);

  React.useEffect(() => { setForm(lead); setEditing(false); }, [lead]);

  if (!lead || !form) return null;

  const currentStageId = normalizeStage(lead.status, pipeline);
  const campaign = campaigns.find(c => c.id === lead.campaignId);
  const nicheId  = getLeadNiche(lead, folderMap, campaigns);
  const nicheObj = nicheId ? NICHES.find(n => n.id === nicheId) : undefined;

  const save = () => {
    if (form) { onUpdate(form); setEditing(false); }
  };

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="w-80 shrink-0 bg-[#0A0A0A] border-l border-[#1A1A1A] flex flex-col h-full overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#1A1A1A]">
        <div>
          <p className="text-sm font-semibold text-[#F2F2F2]">{lead.name}</p>
          {lead.company && <p className="text-xs text-[#909090]">{lead.company}</p>}
        </div>
        <div className="flex items-center gap-1">
          {lead.icpScore !== undefined && (
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded mr-1"
              style={{ background: getIcpColor(lead.icpScore) + '20', color: getIcpColor(lead.icpScore) }}
            >
              ICP {lead.icpScore}/10
            </span>
          )}
          <button onClick={() => setEditing(e => !e)} className="p-1.5 rounded text-[#555] hover:text-[#909090] hover:bg-[#141414]"><Edit3 size={13} /></button>
          <button onClick={onClose} className="p-1.5 rounded text-[#555] hover:text-[#909090] hover:bg-[#141414]"><X size={13} /></button>
        </div>
      </div>

      {/* Stage */}
      <div className="px-4 pt-3 pb-2 border-b border-[#1A1A1A]">
        <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1.5 font-semibold">Stage</p>
        <div className="flex flex-wrap gap-1">
          {stages.map(s => (
            <button
              key={s.id}
              onClick={() => onMove(lead.id, s.id)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors border ${
                currentStageId === s.id
                  ? 'text-white border-current'
                  : 'text-[#555] border-[#2A2A2A] hover:border-[#383838] hover:text-[#909090]'
              }`}
              style={currentStageId === s.id ? { color: s.color, borderColor: s.color + '66', background: s.color + '15' } : {}}
            >
              {s.short}
            </button>
          ))}
        </div>
      </div>

      {/* Fields */}
      <div className="flex-1 p-4 space-y-3">
        {editing ? (
          <>
            {([['name','Name'],['company','Company'],['phone','Phone'],['email','Email'],['website','Website'],['address','Address']] as const).map(([field, label]) => (
              <div key={field}>
                <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1">{label}</label>
                <input
                  value={(form as any)[field] ?? ''}
                  onChange={e => setForm(f => f ? { ...f, [field]: e.target.value } : f)}
                  className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs text-[#F2F2F2] focus:outline-none focus:border-[#CD3D35]/50"
                />
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <button onClick={save} className="flex-1 bg-[#CD3D35] text-white text-xs py-1.5 rounded font-medium hover:bg-[#E85550] transition-colors">Save</button>
              <button onClick={() => setEditing(false)} className="flex-1 bg-[#141414] border border-[#2A2A2A] text-xs py-1.5 rounded text-[#909090] hover:text-[#F2F2F2] transition-colors">Cancel</button>
            </div>
          </>
        ) : (
          <>
            {campaign && (
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-wider font-semibold mb-0.5">Campaign</p>
                <p className="text-xs text-[#F2F2F2]">{campaign.name}</p>
              </div>
            )}
            {nicheObj && (
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-wider font-semibold mb-0.5">Niche</p>
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium"
                  style={{ background: nicheObj.color + '20', color: nicheObj.color }}
                >
                  {nicheObj.label}
                </span>
              </div>
            )}
            {lead.phone && (
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-wider font-semibold mb-0.5">Phone</p>
                <p className="text-xs text-[#F2F2F2] font-mono">{lead.phone}</p>
              </div>
            )}
            {lead.email && (
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-wider font-semibold mb-0.5">Email</p>
                <p className="text-xs text-[#F2F2F2]">{lead.email}</p>
              </div>
            )}
            {lead.website && (
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-wider font-semibold mb-0.5">Website</p>
                <a href={lead.website.startsWith('http') ? lead.website : 'https://' + lead.website} target="_blank" rel="noopener noreferrer" className="text-xs text-[#3B82F6] flex items-center gap-1 hover:underline">
                  {lead.website} <ExternalLink size={9} />
                </a>
              </div>
            )}
            {lead.address && (
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-wider font-semibold mb-0.5">Address</p>
                <p className="text-xs text-[#909090]">{lead.address}</p>
              </div>
            )}
            {lead.summary && (
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-wider font-semibold mb-0.5">Notes</p>
                <p className="text-[11px] text-[#909090] leading-relaxed">{lead.summary}</p>
              </div>
            )}
            {(lead.rating || lead.reviews) && (
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-wider font-semibold mb-0.5">Rating</p>
                <div className="flex items-center gap-1.5">
                  <Star size={11} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-xs text-[#F2F2F2] font-mono">{lead.rating}</span>
                  {lead.reviews && <span className="text-[10px] text-[#555]">({lead.reviews} reviews)</span>}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#1A1A1A] flex gap-2">
        <button
          onClick={() => onDelete(lead.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#141414] border border-[#2A2A2A] text-xs text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 size={11} /> Delete
        </button>
      </div>
    </motion.div>
  );
};

// ── Add Lead Modal ────────────────────────────────────────────────────────────

const AddLeadModal: React.FC<{
  campaigns: Campaign[];
  defaultStage: string;
  onAdd: (lead: Lead) => void;
  onClose: () => void;
}> = ({ campaigns, defaultStage, onAdd, onClose }) => {
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', website: '', campaignId: campaigns[0]?.id ?? '' });

  const submit = () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    onAdd({
      id: `lead-${Date.now()}`,
      campaignId: form.campaignId,
      name: form.name.trim(),
      company: form.company.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      website: form.website.trim(),
      address: '',
      rating: '',
      reviews: '',
      summary: '',
      status: defaultStage,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-sm bg-[#141414] border border-[#2A2A2A] rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
          <h3 className="text-sm font-semibold text-[#F2F2F2]">Add Lead</h3>
          <button onClick={onClose} className="text-[#555] hover:text-[#909090]"><X size={14} /></button>
        </div>
        <div className="p-4 space-y-3">
          {[['name','Name *'],['company','Company'],['phone','Phone *'],['email','Email'],['website','Website']].map(([f, l]) => (
            <div key={f}>
              <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1">{l}</label>
              <input
                value={(form as any)[f]}
                onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs text-[#F2F2F2] focus:outline-none focus:border-[#CD3D35]/50"
              />
            </div>
          ))}
          {campaigns.length > 0 && (
            <div>
              <label className="text-[10px] text-[#555] uppercase tracking-wider font-semibold block mb-1">Campaign</label>
              <select
                value={form.campaignId}
                onChange={e => setForm(p => ({ ...p, campaignId: e.target.value }))}
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs text-[#F2F2F2] focus:outline-none"
              >
                {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-[#2A2A2A] flex gap-2">
          <button onClick={submit} className="flex-1 bg-[#CD3D35] text-white text-xs py-2 rounded font-medium hover:bg-[#E85550] transition-colors">Add Lead</button>
          <button onClick={onClose} className="px-4 py-2 text-xs text-[#909090] hover:text-[#F2F2F2] transition-colors">Cancel</button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Pipeline Main ─────────────────────────────────────────────────────────────

const Pipeline: React.FC<PipelineProps> = ({
  campaigns, allLeads, onAddLead, onUpdateLead, onDeleteLead, onUpdateLeadStatus, onNavigate, onLeadPaid
}) => {
  const [activeTab, setActiveTab] = useState<PipelineTab>('calls');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<string>('all');
  const [folderMap, setFolderMap] = useState<FolderMap>(() => loadFolderMap());
  const [pendingLost, setPendingLost] = useState<Lead | null>(null);
  const [pendingPaid, setPendingPaid] = useState<Lead | null>(null);

  // Keep folderMap in sync if Leads tab changes it while Pipeline is mounted
  React.useEffect(() => {
    const sync = () => setFolderMap(loadFolderMap());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const activeStages = activeTab === 'calls' ? CALL_STAGES : activeTab === 'dms' ? DM_STAGES : EMAIL_STAGES;
  const paidStageId  = activeTab === 'calls' ? 'paid' : activeTab === 'dms' ? 'dm_paid' : 'em_paid';
  const lostStageId  = activeTab === 'calls' ? 'lost' : activeTab === 'dms' ? 'dm_lost' : 'em_lost';
  const defaultStage = activeTab === 'calls' ? 'prospect' : activeTab === 'dms' ? 'dm_prospect' : 'em_prospect';

  // Close detail panel when switching tabs; reset niche filter
  const handleTabSwitch = (tab: PipelineTab) => {
    setActiveTab(tab);
    setSelectedLead(null);
    setSelectedNiche('all');
  };

  // Escape key closes detail panel
  React.useEffect(() => {
    if (!selectedLead) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedLead(null); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [selectedLead]);

  // Count leads per niche in the active tab (for badge counts on pills)
  const nicheCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allLeads.forEach(l => {
      const pipeline = getLeadPipeline(l.status);
      if (pipeline !== activeTab && !(activeTab === 'calls' && !DM_STAGE_IDS.has(l.status) && !EMAIL_STAGE_IDS.has(l.status))) return;
      const niche = getLeadNiche(l, folderMap, campaigns);
      if (niche) counts[niche] = (counts[niche] ?? 0) + 1;
    });
    return counts;
  }, [allLeads, activeTab, campaigns, folderMap]);

  const filteredLeads = useMemo(() => {
    let leads = allLeads.filter(l => {
      const pipeline = getLeadPipeline(l.status);
      return pipeline === activeTab || (activeTab === 'calls' && !DM_STAGE_IDS.has(l.status) && !EMAIL_STAGE_IDS.has(l.status));
    });
    if (selectedNiche !== 'all') {
      leads = leads.filter(l => getLeadNiche(l, folderMap, campaigns) === selectedNiche);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      leads = leads.filter(l =>
        l.name?.toLowerCase().includes(q) ||
        l.company?.toLowerCase().includes(q) ||
        l.phone?.includes(q)
      );
    }
    return leads;
  }, [allLeads, search, activeTab, selectedNiche, campaigns, folderMap]);

  const leadsByStage = useMemo(() => {
    const map: Record<string, Lead[]> = {};
    activeStages.forEach(s => { map[s.id] = []; });
    filteredLeads.forEach(l => {
      const stageId = normalizeStage(l.status, activeTab);
      if (map[stageId]) map[stageId].push(l);
      else map[defaultStage].push(l);
    });
    return map;
  }, [filteredLeads, activeStages, activeTab, defaultStage]);

  const handleMove = (leadId: string, stageId: string) => {
    if (stageId === lostStageId) {
      const lead = allLeads.find(l => l.id === leadId);
      if (lead) { setPendingLost(lead); return; }
    }
    if (stageId === paidStageId) {
      const lead = allLeads.find(l => l.id === leadId);
      if (lead) { setPendingPaid(lead); return; }
    }
    onUpdateLeadStatus(leadId, stageId);
    if (selectedLead?.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, status: stageId } : null);
    }
  };

  const handleLostConfirm = (objection: string, notes: string) => {
    if (!pendingLost) return;
    const prefix = objection ? `[Lost: ${objection}] ` : '';
    const newSummary = (prefix + notes).trim() || pendingLost.summary || '';
    const updated: Lead = { ...pendingLost, status: lostStageId, summary: newSummary };
    onUpdateLead(updated);
    if (selectedLead?.id === pendingLost.id) setSelectedLead(updated);
    setPendingLost(null);
  };

  const handlePaidConfirm = (upfront: number, monthly: number) => {
    if (!pendingPaid) return;
    onUpdateLeadStatus(pendingPaid.id, paidStageId);
    if (onLeadPaid) onLeadPaid(pendingPaid.id, upfront, monthly);
    if (selectedLead?.id === pendingPaid.id) setSelectedLead(prev => prev ? { ...prev, status: paidStageId } : null);
    setPendingPaid(null);
  };

  const handlePaidSkip = () => {
    if (!pendingPaid) return;
    onUpdateLeadStatus(pendingPaid.id, paidStageId);
    if (selectedLead?.id === pendingPaid.id) setSelectedLead(prev => prev ? { ...prev, status: paidStageId } : null);
    setPendingPaid(null);
  };

  const totalLeads  = filteredLeads.length;
  const paidCount   = (leadsByStage[paidStageId] ?? []).length;
  const activeIds   = activeTab === 'calls'
    ? ['called','picked_up','voicemail','follow_up','demo_booked','mockup_building','mockup_sent','approved','launched']
    : activeTab === 'dms'
    ? ['dm_sent','dm_replied','dm_interested','dm_mockup_building','dm_mockup_sent','dm_approved','dm_launched']
    : ['em_sent','em_replied','em_interested','em_mockup_building','em_mockup_sent','em_approved','em_launched'];
  const activeCount = activeIds.reduce((acc, s) => acc + (leadsByStage[s]?.length ?? 0), 0);

  return (
    <div className="flex h-full overflow-hidden flex-col">

      {/* Tab switcher */}
      <div className="flex items-center gap-1 px-5 pt-3 pb-0 shrink-0">
        <button
          onClick={() => handleTabSwitch('calls')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'calls'
              ? 'text-white border-[#CD3D35] bg-white/[0.03]'
              : 'text-[#555] border-transparent hover:text-[#909090] hover:bg-white/[0.02]'
          }`}
        >
          <Phone size={12} />
          Cold Calls
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${activeTab === 'calls' ? 'bg-[#CD3D35]/20 text-[#CD3D35]' : 'bg-white/5 text-[#555]'}`}>
            {allLeads.filter(l => getLeadPipeline(l.status) === 'calls').length}
          </span>
        </button>
        <button
          onClick={() => handleTabSwitch('dms')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'dms'
              ? 'text-white border-[#3B82F6] bg-white/[0.03]'
              : 'text-[#555] border-transparent hover:text-[#909090] hover:bg-white/[0.02]'
          }`}
        >
          <MessageSquare size={12} />
          Cold DMs
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${activeTab === 'dms' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-[#555]'}`}>
            {allLeads.filter(l => getLeadPipeline(l.status) === 'dms').length}
          </span>
        </button>
        <button
          onClick={() => handleTabSwitch('emails')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'emails'
              ? 'text-white border-[#10B981] bg-white/[0.03]'
              : 'text-[#555] border-transparent hover:text-[#909090] hover:bg-white/[0.02]'
          }`}
        >
          <Mail size={12} />
          Cold Emails
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${activeTab === 'emails' ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-[#555]'}`}>
            {allLeads.filter(l => getLeadPipeline(l.status) === 'emails').length}
          </span>
        </button>
      </div>

      {/* Kanban area */}
      <div className="flex flex-1 overflow-hidden border-t border-[#1A1A1A]">
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Toolbar */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-[#1A1A1A] shrink-0">
            {/* Stats */}
            <div className="flex items-center gap-2 text-xs text-[#909090] font-mono shrink-0">
              <span className="text-[#F2F2F2] font-semibold">{totalLeads}</span> leads
              <span className="text-[#383838]">|</span>
              <span className="text-green-500 font-semibold">{paidCount}</span> paid
              <span className="text-[#383838]">|</span>
              <span className="text-yellow-500 font-semibold">{activeCount}</span> active
            </div>

            {/* Niche filter pills — always visible */}
            <div className="flex items-center gap-1 flex-1 flex-wrap">
              <button
                onClick={() => setSelectedNiche('all')}
                className={`px-2.5 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                  selectedNiche === 'all'
                    ? 'bg-white/8 border-white/15 text-[#F2F2F2]'
                    : 'border-[#2A2A2A] text-[#555] hover:text-[#909090] hover:border-[#383838]'
                }`}
              >
                All
              </button>
              {NICHES.map(n => {
                const active = selectedNiche === n.id;
                const count  = nicheCounts[n.id];
                return (
                  <button
                    key={n.id}
                    onClick={() => setSelectedNiche(active ? 'all' : n.id)}
                    className="px-2.5 py-0.5 rounded text-[10px] font-medium border transition-colors flex items-center gap-1"
                    style={active
                      ? { color: n.color, borderColor: n.color + '66', background: n.color + '18' }
                      : { borderColor: '#2A2A2A', color: '#555' }
                    }
                  >
                    {n.short}
                    {count !== undefined && (
                      <span className="font-mono" style={{ opacity: 0.7 }}>{count}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search + Add */}
            <div className="flex items-center gap-2 ml-auto shrink-0">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search leads..."
                className="bg-[#141414] border border-[#2A2A2A] rounded px-2.5 py-1 text-xs text-[#F2F2F2] placeholder-[#555] focus:outline-none focus:border-[#CD3D35]/40 w-44"
              />
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#CD3D35] text-white rounded text-xs font-medium hover:bg-[#E85550] transition-colors"
              >
                <Plus size={12} /> Add Lead
              </button>
            </div>
          </div>

          {/* Kanban columns */}
          <div className="flex-1 overflow-x-auto overflow-y-hidden pipeline-scroll">
            <div className="flex h-full gap-0 min-w-max">
              {activeStages.map((stage) => {
                const stageLeads = leadsByStage[stage.id] ?? [];
                return (
                  <div
                    key={stage.id}
                    className="flex flex-col w-52 border-r border-[#1A1A1A] last:border-r-0"
                  >
                    {/* Column header */}
                    <div className="px-3 py-2.5 border-b border-[#1A1A1A] shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: stage.color }} />
                        <span className="text-xs font-medium text-[#909090] truncate">{stage.label}</span>
                        <span className="ml-auto text-[10px] font-mono text-[#555] shrink-0">{stageLeads.length}</span>
                      </div>
                    </div>
                    {/* Cards */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-2" style={{ scrollbarWidth: 'none' }}>
                      {stageLeads.map(lead => (
                        <LeadCard
                          key={lead.id}
                          lead={lead}
                          stageColor={stage.color}
                          stages={activeStages}
                          onOpen={() => setSelectedLead(lead)}
                          onMove={(stageId) => handleMove(lead.id, stageId)}
                          onDelete={() => onDeleteLead(lead.id)}
                          onDial={() => onNavigate('dialer', lead.id, lead.campaignId)}
                        />
                      ))}
                      {stageLeads.length === 0 && (
                        <div className="h-16 flex items-center justify-center">
                          <p className="text-[10px] text-[#383838] text-center select-none">Empty</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selectedLead && (
            <DetailPanel
              lead={selectedLead}
              stages={activeStages}
              pipeline={activeTab}
              campaigns={campaigns}
              folderMap={folderMap}
              onClose={() => setSelectedLead(null)}
              onUpdate={(updated) => { onUpdateLead(updated); setSelectedLead(updated); }}
              onDelete={(id) => { onDeleteLead(id); setSelectedLead(null); }}
              onMove={handleMove}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Add modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddLeadModal
            campaigns={campaigns}
            defaultStage={defaultStage}
            onAdd={onAddLead}
            onClose={() => setShowAddModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Lost modal */}
      <AnimatePresence>
        {pendingLost && (
          <LostModal
            lead={pendingLost}
            onConfirm={handleLostConfirm}
            onClose={() => setPendingLost(null)}
          />
        )}
      </AnimatePresence>

      {/* Paid modal */}
      <AnimatePresence>
        {pendingPaid && (
          <PaidModal
            lead={pendingPaid}
            onConfirm={handlePaidConfirm}
            onSkip={handlePaidSkip}
            onClose={() => setPendingPaid(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pipeline;
