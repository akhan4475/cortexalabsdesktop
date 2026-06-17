import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Folder, FolderOpen, Search, Plus, MoreHorizontal, Phone, ArrowLeft,
  Trash2, Edit2, CheckSquare, Square, Upload, Globe, Star,
  MessageSquare, MapPin, AlertTriangle, User, Users, Mail, Save,
  ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight,
  MoveRight,
} from 'lucide-react';
import { Lead, Campaign } from './types';
import { NICHES } from '../../lib/niches';
import { CRMView } from './CRM';

// ── Constants ──────────────────────────────────────────────────────────────────
const PAGE_SIZE = 50;
const FOLDER_MAP_KEY = 'aiw_lead_folders';

export type ChannelId = 'cold-calls' | 'cold-dms' | 'cold-emails';
type FolderAssignment = { channelId: ChannelId; nicheId: string };
type FolderMap = Record<string, FolderAssignment>; // campaignId → assignment

const CHANNELS: { id: ChannelId; label: string; color: string; Icon: React.FC<any> }[] = [
  { id: 'cold-calls',   label: 'Cold Calls',   color: '#CD3D35', Icon: Phone         },
  { id: 'cold-dms',     label: 'Cold DMs',     color: '#3B82F6', Icon: MessageSquare },
  { id: 'cold-emails',  label: 'Cold Emails',  color: '#10B981', Icon: Mail          },
];

const STATUS_OPTIONS = [
  'New Lead', 'Interested', 'Not Interested', 'Wrong Number', 'Voicemail', 'Follow-up Required',
];

function getStatusStyles(status: string) {
  const s = status.toLowerCase();
  if (s === 'new lead' || s === 'prospect')                   return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  if (s === 'interested' || s === 'demo_booked')              return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
  if (s === 'not interested' || s === 'lost')                 return 'bg-red-500/10 text-red-400 border-red-500/20';
  if (s === 'wrong number')                                   return 'bg-red-500/10 text-red-400 border-red-500/20';
  if (s.includes('follow') || s === 'voicemail')             return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
  return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
}

function loadFolderMap(): FolderMap {
  try {
    const raw = JSON.parse(localStorage.getItem(FOLDER_MAP_KEY) || '{}');
    const result: FolderMap = {};
    for (const [id, val] of Object.entries(raw)) {
      if (val && typeof val === 'object') {
        const v = val as any;
        if (v.channelId && v.nicheId) {
          // New format
          result[id] = { channelId: v.channelId as ChannelId, nicheId: v.nicheId };
        } else if (v.nicheId) {
          // Old format (had subFolder) — migrate to cold-calls
          result[id] = { channelId: 'cold-calls', nicheId: v.nicheId };
        }
      }
    }
    return result;
  } catch { return {}; }
}

function saveFolderMap(m: FolderMap) {
  try { localStorage.setItem(FOLDER_MAP_KEY, JSON.stringify(m)); } catch {}
}

// ── Types ──────────────────────────────────────────────────────────────────────
type LeadsLevel = 'channels' | 'niches' | 'campaigns' | 'list' | 'create' | 'add-lead' | 'edit-lead';

interface LeadsProps {
  campaigns: Campaign[];
  allLeads: Lead[];
  onAddCampaign: (campaign: Campaign, leads: Lead[]) => void;
  onDeleteCampaign: (id: string) => void;
  onRenameCampaign: (id: string, name: string) => void;
  onAddLead: (lead: Lead) => void;
  onUpdateLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
  onNavigate: (view: CRMView, leadId?: string, campaignId?: string) => void;
  onMoveLeads: (leadIds: string[], targetCampaignId: string) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30)  return `${days}d ago`;
  const mo = Math.floor(days / 30);
  return `${mo}mo ago`;
}

// ── Component ──────────────────────────────────────────────────────────────────
const Leads: React.FC<LeadsProps> = ({
  campaigns, allLeads, onAddCampaign, onDeleteCampaign, onRenameCampaign,
  onAddLead, onUpdateLead, onDeleteLead, onNavigate, onMoveLeads,
}) => {
  // Navigation state
  const [level, setLevel]                       = useState<LeadsLevel>('channels');
  const [activeChannelId, setActiveChannelId]   = useState<ChannelId | null>(null);
  const [activeNicheId, setActiveNicheId]       = useState<string | null>(null);
  const [activeCampaign, setActiveCampaign]     = useState<Campaign | null>(null);

  // Folder assignments
  const [folderMap, setFolderMap] = useState<FolderMap>(loadFolderMap);

  const updateFolderMap = useCallback((updater: (prev: FolderMap) => FolderMap) => {
    setFolderMap(prev => { const next = updater(prev); saveFolderMap(next); return next; });
  }, []);

  // Lead table state
  const [selectedLeads, setSelectedLeads]           = useState<string[]>([]);
  const [searchQuery, setSearchQuery]               = useState('');
  const [statusFilter, setStatusFilter]             = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentPage, setCurrentPage]               = useState(1);

  // Campaign create state
  const [newCampaignName, setNewCampaignName] = useState('');
  const [pendingFile, setPendingFile]         = useState<File | null>(null);
  const [isCreating, setIsCreating]           = useState(false);

  // Lead form state
  const emptyForm = { name: '', company: '', phone: '', email: '', address: '', website: '', rating: '', reviews: '0', summary: '', status: 'New Lead' };
  const [leadForm, setLeadForm] = useState<Partial<Lead>>(emptyForm);

  // Modals / menus
  const [menuOpenId, setMenuOpenId]                             = useState<string | null>(null);
  const [editingCampaign, setEditingCampaign]                   = useState<{ id: string; name: string } | null>(null);
  const [confirmDeleteCampaignId, setConfirmDeleteCampaignId]   = useState<string | null>(null);
  const [confirmDeleteLeadId, setConfirmDeleteLeadId]           = useState<string | null>(null);
  const [assignModal, setAssignModal]                           = useState<{ campaignId: string } | null>(null);
  const [assignChannelId, setAssignChannelId]                   = useState<ChannelId>('cold-calls');
  const [assignNiche, setAssignNiche]                           = useState('');
  const [showMoveModal, setShowMoveModal]                       = useState(false);
  const [moveTargetCampaignId, setMoveTargetCampaignId]         = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setCurrentPage(1); setSelectedLeads([]); }, [statusFilter, activeCampaign]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.filter-dropdown-container')) setShowFilterDropdown(false);
      if (!(e.target as HTMLElement).closest('.campaign-menu-container')) setMenuOpenId(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Derived data ──────────────────────────────────────────────────────────────
  const getCampaignsFor = useCallback((channelId: ChannelId, nicheId: string) =>
    campaigns.filter(c => {
      const a = folderMap[c.id];
      return a?.channelId === channelId && a?.nicheId === nicheId;
    }),
    [campaigns, folderMap]);

  const getLeadsFor = useCallback((channelId: ChannelId, nicheId: string) => {
    const campIds = new Set(getCampaignsFor(channelId, nicheId).map(c => c.id));
    return allLeads.filter(l => campIds.has(l.campaignId));
  }, [getCampaignsFor, allLeads]);

  const getChannelCampaigns = useCallback((channelId: ChannelId) =>
    campaigns.filter(c => folderMap[c.id]?.channelId === channelId),
    [campaigns, folderMap]);

  const getChannelLeadCount = useCallback((channelId: ChannelId) =>
    getChannelCampaigns(channelId).reduce((s, c) => s + c.leadCount, 0),
    [getChannelCampaigns]);

  const unassigned = useMemo(() => campaigns.filter(c => !folderMap[c.id]), [campaigns, folderMap]);

  // Lead table data
  const currentCampaignLeads = useMemo(() => {
    if (!activeCampaign) return [];
    let f = allLeads.filter(l => l.campaignId === activeCampaign.id);
    if (statusFilter !== 'All') f = f.filter(l => l.status === statusFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      f = f.filter(l => l.company.toLowerCase().includes(q) || l.name.toLowerCase().includes(q));
    }
    return f;
  }, [allLeads, activeCampaign, searchQuery, statusFilter]);

  const totalPages     = Math.ceil(currentCampaignLeads.length / PAGE_SIZE) || 1;
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return currentCampaignLeads.slice(start, start + PAGE_SIZE);
  }, [currentCampaignLeads, currentPage]);

  // ── Navigation helpers ────────────────────────────────────────────────────────
  const goChannels     = () => { setLevel('channels'); setActiveChannelId(null); setActiveNicheId(null); setActiveCampaign(null); };
  const goNiches       = (chId: ChannelId) => { setActiveChannelId(chId); setLevel('niches'); };
  const goCampaigns    = (nicheId: string) => { setActiveNicheId(nicheId); setLevel('campaigns'); };
  const goCampaignList = (c: Campaign) => { setActiveCampaign(c); setSearchQuery(''); setCurrentPage(1); setLevel('list'); };
  const goCreate       = () => { setNewCampaignName(''); setPendingFile(null); setLevel('create'); };

  // ── Labels ────────────────────────────────────────────────────────────────────
  const activeChannel = CHANNELS.find(ch => ch.id === activeChannelId);
  const activeNiche   = NICHES.find(n => n.id === activeNicheId);

  // ── CSV parsing ───────────────────────────────────────────────────────────────
  const parseCSV = (file: File): Promise<Partial<Lead>[]> => new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      const rows = text.split('\n').map(row => {
        const res: string[] = []; let cur = ''; let inQ = false;
        for (const ch of row) {
          if (ch === '"') { inQ = !inQ; }
          else if (ch === ',' && !inQ) { res.push(cur.trim()); cur = ''; }
          else { cur += ch; }
        }
        res.push(cur.trim()); return res;
      });
      const headers = rows[0].map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
      const find = (pats: string[]) => { for (const p of pats) { const i = headers.findIndex(h => h.includes(p)); if (i !== -1) return i; } return -1; };
      const hm = {
        name:    find(['name','contact','decision','person']),
        company: find(['company','business','organization']),
        phone:   find(['phone','mobile','tel','cell']),
        email:   find(['email','e-mail','mail']),
        address: find(['address','location','street']),
        website: find(['website','web','url','site']),
        rating:  find(['rating','stars','score']),
        reviews: find(['reviews','review count','total reviews']),
      };
      resolve(rows.slice(1).filter(r => r.length > 1 && r.some(c => c.trim())).map(r => ({
        name:    hm.name    !== -1 ? r[hm.name]?.trim().replace(/['"]/g,'')    : '',
        company: hm.company !== -1 ? r[hm.company]?.trim().replace(/['"]/g,'') : '',
        phone:   hm.phone   !== -1 ? r[hm.phone]?.trim().replace(/['"]/g,'')   : '',
        email:   hm.email   !== -1 ? r[hm.email]?.trim().replace(/['"]/g,'')   : '',
        address: hm.address !== -1 ? r[hm.address]?.trim().replace(/['"]/g,'') : '',
        website: hm.website !== -1 ? r[hm.website]?.trim().replace(/['"]/g,'') : '',
        rating:  hm.rating  !== -1 ? r[hm.rating]?.trim().replace(/['"]/g,'')  : '',
        reviews: hm.reviews !== -1 ? r[hm.reviews]?.trim().replace(/['"]/g,'') : '',
      })));
    };
    reader.readAsText(file);
  });

  const handleCreateCampaign = async () => {
    if (!newCampaignName.trim()) { alert('Enter a campaign name.'); return; }
    if (!pendingFile) { alert('Upload a CSV file.'); return; }
    setIsCreating(true);
    try {
      const parsed = await parseCSV(pendingFile);
      const campaignId = `camp-${Date.now()}`;
      const existingKeys = new Set(allLeads.map(l => `${l.company?.toLowerCase()}||${l.phone?.replace(/\s/g,'')}`));
      const seen = new Set<string>();
      const unique = parsed.filter(pl => {
        const k = `${pl.company?.toLowerCase()}||${pl.phone?.replace(/\s/g,'')}`;
        if (seen.has(k) || existingKeys.has(k)) return false;
        seen.add(k); return true;
      });
      const dups = parsed.length - unique.length;
      const finalLeads: Lead[] = unique.map((pl, i) => ({
        id: `l-${campaignId}-${i}`, campaignId,
        name: pl.name || 'Unknown Contact', company: pl.company || 'Unknown Company',
        phone: pl.phone || 'N/A', email: pl.email || '', address: pl.address || '',
        website: pl.website || '', rating: pl.rating || '4.0', reviews: pl.reviews || '0',
        summary: 'Imported from CSV.', status: 'New Lead',
      }));
      const campaign: Campaign = { id: campaignId, name: newCampaignName, createdAt: new Date().toISOString().split('T')[0], leadCount: finalLeads.length };
      onAddCampaign(campaign, finalLeads);
      // Assign to current channel + niche
      if (activeChannelId && activeNicheId) {
        updateFolderMap(prev => ({ ...prev, [campaignId]: { channelId: activeChannelId, nicheId: activeNicheId } }));
      }
      if (dups > 0) alert(`Import complete. ${dups} duplicate(s) removed.`);
      setNewCampaignName(''); setPendingFile(null);
      setLevel('campaigns');
    } catch { alert('Error parsing CSV.'); }
    finally { setIsCreating(false); }
  };

  // ── Lead CRUD ─────────────────────────────────────────────────────────────────
  const handleSaveLead = () => {
    if (!leadForm.name || !leadForm.company || !leadForm.phone) { alert('Name, Company, and Phone required.'); return; }
    if (!activeCampaign) return;
    if (level === 'add-lead') {
      onAddLead({ id: `l-${Date.now()}`, campaignId: activeCampaign.id, name: leadForm.name!, company: leadForm.company!, phone: leadForm.phone!, email: leadForm.email || '', address: leadForm.address || '', website: leadForm.website || '', rating: leadForm.rating || '4.0', reviews: leadForm.reviews || '0', summary: leadForm.summary || 'Manually added.', status: leadForm.status || 'New Lead' });
    } else {
      onUpdateLead(leadForm as Lead);
    }
    setLeadForm(emptyForm); setLevel('list');
  };

  const handleRename = () => {
    if (!editingCampaign?.name.trim()) return;
    onRenameCampaign(editingCampaign.id, editingCampaign.name);
    if (activeCampaign?.id === editingCampaign.id) setActiveCampaign({ ...activeCampaign, name: editingCampaign.name });
    setEditingCampaign(null);
  };

  const handleDeleteCampaignConfirm = () => {
    if (!confirmDeleteCampaignId) return;
    onDeleteCampaign(confirmDeleteCampaignId);
    updateFolderMap(prev => { const n = { ...prev }; delete n[confirmDeleteCampaignId]; return n; });
    if (activeCampaign?.id === confirmDeleteCampaignId) { setLevel('campaigns'); setActiveCampaign(null); }
    setConfirmDeleteCampaignId(null);
  };

  const handleAssignConfirm = () => {
    if (!assignModal || !assignNiche) return;
    updateFolderMap(prev => ({ ...prev, [assignModal.campaignId]: { channelId: assignChannelId, nicheId: assignNiche } }));
    setAssignModal(null);
  };

  const openAssignModal = (campaignId: string) => {
    const existing = folderMap[campaignId];
    setAssignChannelId(existing?.channelId || 'cold-calls');
    setAssignNiche(existing?.nicheId || NICHES[0].id);
    setAssignModal({ campaignId });
    setMenuOpenId(null);
  };

  const handleBulkDelete = async () => {
    if (!selectedLeads.length) return;
    if (!confirm(`Delete ${selectedLeads.length} lead(s)?`)) return;
    for (const id of selectedLeads) await onDeleteLead(id);
    setSelectedLeads([]);
  };

  const handleConfirmMove = async () => {
    if (!moveTargetCampaignId) return;
    await onMoveLeads(selectedLeads, moveTargetCampaignId);
    setSelectedLeads([]); setShowMoveModal(false); setMoveTargetCampaignId('');
  };

  const toggleSelectLead = (id: string) => setSelectedLeads(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleSelectAll  = () => {
    const ids = paginatedLeads.map(l => l.id);
    const all = ids.every(id => selectedLeads.includes(id));
    setSelectedLeads(prev => all ? prev.filter(id => !ids.includes(id)) : [...new Set([...prev, ...ids])]);
  };

  const inputCls = 'w-full bg-white/[0.04] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#CD3D35]/50 focus:outline-none transition-all';

  // ────────────────────────────────────────────────────────────────────────────
  // VIEWS
  // ────────────────────────────────────────────────────────────────────────────

  // ── Add / Edit Lead ───────────────────────────────────────────────────────────
  if (level === 'add-lead' || level === 'edit-lead') {
    const isEdit = level === 'edit-lead';
    return (
      <div className="h-full flex flex-col max-w-2xl mx-auto px-6 py-6">
        <button onClick={() => setLevel('list')} className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 group w-fit text-sm transition-colors">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Lead List
        </button>
        <div className="bg-[#0c0c0e] border border-white/8 rounded-2xl shadow-2xl overflow-hidden flex flex-col flex-1 min-h-0">
          <div className="h-[3px] bg-[#CD3D35] shrink-0" />
          <div className="p-6 space-y-5 overflow-y-auto crm-scroll flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#CD3D35]/10 border border-[#CD3D35]/20 flex items-center justify-center text-[#CD3D35] shrink-0">
                {isEdit ? <Edit2 size={18} /> : <User size={18} />}
              </div>
              <div>
                <h2 className="text-base font-bold text-white">{isEdit ? 'Edit Lead' : 'Add Lead'}</h2>
                <p className="text-gray-500 text-xs">Campaign: <span className="text-white font-medium">{activeCampaign?.name}</span></p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5"><label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Decision Maker *</label><input type="text" placeholder="Sarah Connor" value={leadForm.name} onChange={e => setLeadForm({ ...leadForm, name: e.target.value })} className={inputCls} /></div>
              <div className="space-y-1.5"><label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Company *</label><input type="text" placeholder="Cyberdyne Systems" value={leadForm.company} onChange={e => setLeadForm({ ...leadForm, company: e.target.value })} className={inputCls} /></div>
              <div className="space-y-1.5"><label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Phone *</label><div className="relative"><Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" /><input type="text" placeholder="+1 555-0101" value={leadForm.phone} onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })} className={`${inputCls} pl-9 font-mono`} /></div></div>
              <div className="space-y-1.5"><label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Email</label><div className="relative"><Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" /><input type="email" placeholder="sarah@cyberdyne.com" value={leadForm.email} onChange={e => setLeadForm({ ...leadForm, email: e.target.value })} className={`${inputCls} pl-9`} /></div></div>
              <div className="space-y-1.5 md:col-span-2"><label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Website</label><div className="relative"><Globe size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" /><input type="text" placeholder="www.cyberdyne.com" value={leadForm.website} onChange={e => setLeadForm({ ...leadForm, website: e.target.value })} className={`${inputCls} pl-9`} /></div></div>
              <div className="space-y-1.5 md:col-span-2"><label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Address</label><div className="relative"><MapPin size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" /><input type="text" placeholder="123 AI Lane, San Francisco, CA" value={leadForm.address} onChange={e => setLeadForm({ ...leadForm, address: e.target.value })} className={`${inputCls} pl-9`} /></div></div>
              <div className="space-y-1.5"><label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Rating</label><input type="text" placeholder="4.5" value={leadForm.rating} onChange={e => setLeadForm({ ...leadForm, rating: e.target.value })} className={inputCls} /></div>
              <div className="space-y-1.5"><label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Status</label><select value={leadForm.status} onChange={e => setLeadForm({ ...leadForm, status: e.target.value })} className={`${inputCls} appearance-none cursor-pointer`}>{STATUS_OPTIONS.map(o => <option key={o} value={o} className="bg-[#0c0c0e]">{o}</option>)}</select></div>
              <div className="space-y-1.5 md:col-span-2"><label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Notes</label><textarea placeholder="Pain points, context..." value={leadForm.summary} onChange={e => setLeadForm({ ...leadForm, summary: e.target.value })} className={`${inputCls} h-24 resize-none crm-scroll`} /></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setLevel('list')} className="flex-1 bg-transparent border border-white/10 text-gray-400 hover:text-white py-2.5 rounded-xl font-bold text-sm transition-all">Cancel</button>
              <button onClick={handleSaveLead} className="flex-1 bg-[#CD3D35] hover:bg-[#B83530] text-white py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#CD3D35]/15 active:scale-[0.98]"><Save size={14} />{isEdit ? 'Save Changes' : 'Add Lead'}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Create Campaign ───────────────────────────────────────────────────────────
  if (level === 'create') {
    return (
      <div className="h-full flex flex-col max-w-xl mx-auto px-6 py-6">
        <button onClick={() => setLevel('campaigns')} className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 group w-fit text-sm transition-colors">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>
        <div className="bg-[#0c0c0e] border border-white/8 rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-[3px] bg-[#CD3D35]" />
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#CD3D35]/10 border border-[#CD3D35]/20 flex items-center justify-center text-[#CD3D35] shrink-0"><Plus size={18} /></div>
              <div>
                <h2 className="text-base font-bold text-white">New Campaign</h2>
                {activeChannel && activeNiche && (
                  <p className="text-gray-500 text-xs mt-0.5">
                    In <span className="font-medium" style={{ color: activeChannel.color }}>{activeChannel.label}</span>
                    <span className="text-gray-600"> / </span>
                    <span className="font-medium" style={{ color: activeNiche.color }}>{activeNiche.label}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Campaign Name</label>
              <input type="text" placeholder="e.g. Pool Tampa June 2024" value={newCampaignName} onChange={e => setNewCampaignName(e.target.value)} className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Leads CSV</label>
              <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${pendingFile ? 'border-[#CD3D35]/50 bg-[#CD3D35]/5' : 'border-white/8 hover:border-[#CD3D35]/30 bg-white/[0.02]'}`}>
                <input type="file" ref={fileInputRef} onChange={e => e.target.files && setPendingFile(e.target.files[0])} accept=".csv" className="hidden" />
                <Upload className={`mb-3 ${pendingFile ? 'text-[#CD3D35]' : 'text-gray-600'}`} size={26} />
                <p className="text-sm font-medium text-white mb-1">{pendingFile ? pendingFile.name : 'Click to upload CSV'}</p>
                <p className="text-xs text-gray-600">Headers: Name, Company, Phone (minimum)</p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setLevel('campaigns')} className="flex-1 border border-white/10 text-gray-400 hover:text-white py-2.5 rounded-xl font-bold text-sm transition-all">Cancel</button>
              <button onClick={handleCreateCampaign} disabled={isCreating} className="flex-1 bg-[#CD3D35] hover:bg-[#B83530] text-white py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]">
                {isCreating ? 'Importing…' : 'Create Campaign'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Lead Table ────────────────────────────────────────────────────────────────
  if (level === 'list') {
    return (
      <div className="p-4 space-y-4 h-full flex flex-col relative">
        {/* Header bar */}
        <div className="flex items-center justify-between bg-[#0c0c0e] px-4 py-3 rounded-2xl border border-white/8">
          <div className="flex items-center gap-2 min-w-0">
            <button onClick={() => setLevel('campaigns')} className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors shrink-0"><ArrowLeft size={16} /></button>
            {activeChannel && <span className="text-xs font-medium hidden sm:inline" style={{ color: activeChannel.color }}>{activeChannel.label}</span>}
            <span className="text-gray-700 text-xs hidden sm:inline">/</span>
            {activeNiche && <span className="text-xs font-medium hidden sm:inline" style={{ color: activeNiche.color }}>{activeNiche.label}</span>}
            <span className="text-gray-700 text-xs hidden sm:inline">/</span>
            <h2 className="font-bold text-white text-sm truncate">{activeCampaign?.name}</h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative filter-dropdown-container">
              <button onClick={() => setShowFilterDropdown(v => !v)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${statusFilter !== 'All' ? 'bg-[#CD3D35]/10 border-[#CD3D35]/30 text-[#CD3D35]' : 'bg-white/[0.03] border-white/8 text-gray-400 hover:text-white'}`}>
                <Search size={11} />
                {statusFilter === 'All' ? 'Filter' : statusFilter}
              </button>
              {showFilterDropdown && (
                <div className="absolute left-0 top-full mt-1.5 w-44 bg-[#0c0c0e] border border-white/10 rounded-xl shadow-2xl z-30 overflow-hidden">
                  {['All', ...STATUS_OPTIONS].map(s => (
                    <button key={s} onClick={() => { setStatusFilter(s); setShowFilterDropdown(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between ${statusFilter === s ? 'bg-[#CD3D35]/10 text-[#CD3D35]' : 'text-gray-300 hover:bg-white/5'}`}>
                      {s}
                      {s !== 'All' && <span className="text-[9px] text-gray-500">{allLeads.filter(l => l.campaignId === activeCampaign?.id && l.status === s).length}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedLeads.length > 0 && (
              <div className="flex items-center gap-1.5">
                <button onClick={() => { setMoveTargetCampaignId(''); setShowMoveModal(true); }} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"><MoveRight size={11} /> Move ({selectedLeads.length})</button>
                <button onClick={handleBulkDelete} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={11} /> Del ({selectedLeads.length})</button>
              </div>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3 h-3" />
              <input type="text" placeholder="Search…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-white/[0.03] border border-white/8 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#CD3D35]/50 w-44 placeholder-gray-600" />
            </div>
            <button onClick={() => { setLeadForm(emptyForm); setLevel('add-lead'); }} className="flex items-center gap-1 bg-[#CD3D35] hover:bg-[#B83530] text-white px-3 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-[0.98]">
              <Plus size={12} /> Add Lead
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 bg-[#0c0c0e] border border-white/8 rounded-2xl overflow-hidden flex flex-col min-h-0">
          <div className="grid grid-cols-[36px_1.5fr_1fr_110px_1.5fr_90px_1fr_110px_100px] gap-3 px-4 py-3 border-b border-white/8 bg-white/[0.02] text-[9px] font-bold text-gray-500 uppercase tracking-widest items-center shrink-0">
            <div className="flex items-center justify-center"><button onClick={toggleSelectAll}>{paginatedLeads.every(l => selectedLeads.includes(l.id)) ? <CheckSquare size={12} className="text-[#CD3D35]" /> : <Square size={12} />}</button></div>
            <div>Decision Maker</div><div>Company</div><div>Phone</div>
            <div>Address</div><div>Rating</div><div>Website</div>
            <div>Status</div><div className="text-right">Actions</div>
          </div>
          <div className="overflow-y-auto flex-1 crm-scroll">
            {paginatedLeads.map(lead => (
              <div key={lead.id} className="grid grid-cols-[36px_1.5fr_1fr_110px_1.5fr_90px_1fr_110px_100px] gap-3 px-4 py-3 border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors items-center group">
                <div className="flex items-center justify-center"><button onClick={() => toggleSelectLead(lead.id)}>{selectedLeads.includes(lead.id) ? <CheckSquare size={12} className="text-[#CD3D35]" /> : <Square size={12} className="text-gray-600" />}</button></div>
                <div className="truncate font-bold text-white text-sm">{lead.name || 'Unknown'}</div>
                <div className="text-sm text-gray-300 truncate">{lead.company || 'Unknown'}</div>
                <div className="text-xs text-gray-400 font-mono truncate">{lead.phone || 'N/A'}</div>
                <div className="truncate text-[10px] text-gray-500 flex items-center gap-1"><MapPin size={9} className="shrink-0" />{lead.address || 'N/A'}</div>
                <div className="flex items-center gap-1"><Star size={9} className="text-yellow-500 fill-yellow-500 shrink-0" /><span className="text-xs text-white">{lead.rating || '-'}<span className="text-[9px] text-gray-500 ml-0.5">({lead.reviews || '0'})</span></span></div>
                <div className="truncate">{lead.website ? <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noreferrer" className="text-[10px] text-[#CD3D35] hover:underline truncate block">{lead.website.replace(/https?:\/\//,'').substring(0,18)}…</a> : <span className="text-[10px] text-gray-600">N/A</span>}</div>
                <div><span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getStatusStyles(lead.status)}`}>{lead.status}</span></div>
                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onNavigate('dialer', lead.id, lead.campaignId)} className="p-1.5 bg-green-500/10 text-green-400 rounded hover:bg-green-500 hover:text-black" title="Call"><Phone size={11} /></button>
                  <button onClick={() => onNavigate('conversations', lead.id, lead.campaignId)} className="p-1.5 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500 hover:text-white" title="Message"><MessageSquare size={11} /></button>
                  <button onClick={() => { setLeadForm(lead); setLevel('edit-lead'); }} className="p-1.5 bg-white/5 text-gray-400 rounded hover:bg-white hover:text-black" title="Edit"><Edit2 size={11} /></button>
                  <button onClick={() => setConfirmDeleteLeadId(lead.id)} className="p-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500 hover:text-white" title="Delete"><Trash2 size={11} /></button>
                </div>
              </div>
            ))}
            {paginatedLeads.length === 0 && (
              <div className="p-16 text-center flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-gray-600"><Users size={28} /></div>
                <p className="text-gray-500 text-sm">No leads found.</p>
              </div>
            )}
          </div>
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-white/8 flex items-center justify-between shrink-0">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, currentCampaignLeads.length)} of {currentCampaignLeads.length}
              </span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-1.5 bg-white/[0.03] border border-white/8 rounded-lg text-gray-500 hover:text-white disabled:opacity-30"><ChevronsLeft size={13} /></button>
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 bg-white/[0.03] border border-white/8 rounded-lg text-gray-500 hover:text-white disabled:opacity-30"><ChevronLeft size={13} /></button>
                <span className="px-3 py-1.5 bg-white/[0.03] border border-white/8 rounded-lg text-xs font-bold text-[#CD3D35]">{currentPage} / {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 bg-white/[0.03] border border-white/8 rounded-lg text-gray-500 hover:text-white disabled:opacity-30"><ChevronRight size={13} /></button>
                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-1.5 bg-white/[0.03] border border-white/8 rounded-lg text-gray-500 hover:text-white disabled:opacity-30"><ChevronsRight size={13} /></button>
              </div>
            </div>
          )}
        </div>

        {/* Delete lead modal */}
        {confirmDeleteLeadId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#0c0c0e] border border-red-500/25 rounded-2xl p-6 w-full max-w-sm shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-red-500" />
              <h3 className="text-base font-bold text-white mb-2">Delete Lead?</h3>
              <p className="text-gray-400 mb-6 text-sm">This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDeleteLeadId(null)} className="flex-1 px-4 py-2.5 border border-white/10 text-gray-400 font-bold rounded-xl text-sm transition-all hover:text-white">Cancel</button>
                <button onClick={() => { onDeleteLead(confirmDeleteLeadId); setConfirmDeleteLeadId(null); }} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm">Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* Move leads modal */}
        {showMoveModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#0c0c0e] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-base font-bold text-white mb-1">Move {selectedLeads.length} Lead(s)</h3>
              <p className="text-gray-500 text-xs mb-4">Select a destination campaign.</p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto crm-scroll mb-5">
                {campaigns.filter(c => c.id !== activeCampaign?.id).map(c => (
                  <button key={c.id} onClick={() => setMoveTargetCampaignId(c.id)} className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between text-sm ${moveTargetCampaignId === c.id ? 'bg-[#CD3D35]/10 border-[#CD3D35]/40 text-white' : 'bg-white/[0.02] border-white/8 text-gray-300 hover:border-white/15'}`}>
                    <span className="font-semibold truncate">{c.name}</span>
                    <span className="text-xs text-gray-500 shrink-0 ml-2">{c.leadCount} leads</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setShowMoveModal(false); setMoveTargetCampaignId(''); }} className="flex-1 px-4 py-2.5 border border-white/10 text-gray-400 font-bold rounded-xl text-sm hover:text-white transition-all">Cancel</button>
                <button onClick={handleConfirmMove} className="flex-1 px-4 py-2.5 bg-[#CD3D35] hover:bg-[#B83530] text-white rounded-xl font-bold text-sm active:scale-[0.98]">Move Leads</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Campaigns within a channel + niche ────────────────────────────────────────
  if (level === 'campaigns') {
    const visibleCampaigns = activeChannelId && activeNicheId
      ? getCampaignsFor(activeChannelId, activeNicheId)
      : unassigned;

    return (
      <div className="p-6 space-y-5 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setLevel('niches')} className="p-1.5 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors shrink-0"><ArrowLeft size={16} /></button>
            <div className="flex items-center gap-2 min-w-0">
              {activeChannel && (
                <span className="text-sm font-medium shrink-0" style={{ color: activeChannel.color }}>{activeChannel.label}</span>
              )}
              {activeChannel && activeNiche && <span className="text-gray-600">/</span>}
              {activeNiche && (
                <>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: activeNiche.color }} />
                  <span className="text-sm font-bold text-white">{activeNiche.label}</span>
                </>
              )}
            </div>
          </div>
          <button onClick={goCreate} className="flex items-center gap-1.5 bg-[#CD3D35] hover:bg-[#B83530] text-white px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-[0.98]">
            <Plus size={13} /> New Campaign
          </button>
        </div>

        {/* Campaign grid */}
        {visibleCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max overflow-y-auto crm-scroll flex-1 pb-4">
            {visibleCampaigns.map(camp => (
              <div key={camp.id} onClick={() => goCampaignList(camp)} className="bg-white/[0.02] border border-white/8 hover:border-[#CD3D35]/40 hover:bg-white/[0.04] p-4 rounded-2xl cursor-pointer transition-all group relative">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center group-hover:bg-[#CD3D35]/10 group-hover:border-[#CD3D35]/20 transition-all">
                    <Folder className="text-gray-500 group-hover:text-[#CD3D35] transition-colors" size={16} />
                  </div>
                  <div className="relative campaign-menu-container">
                    <button onClick={e => { e.stopPropagation(); setMenuOpenId(menuOpenId === camp.id ? null : camp.id); }} className="text-gray-600 hover:text-white p-1 hover:bg-white/8 rounded-lg transition-colors">
                      <MoreHorizontal size={14} />
                    </button>
                    {menuOpenId === camp.id && (
                      <div className="absolute right-0 top-full mt-1 w-36 bg-[#0c0c0e] border border-white/10 rounded-xl shadow-2xl z-30 overflow-hidden">
                        <button onClick={e => { e.stopPropagation(); setEditingCampaign({ id: camp.id, name: camp.name }); setMenuOpenId(null); }} className="w-full text-left px-3 py-2 text-xs font-bold text-gray-300 hover:bg-white/5 flex items-center gap-2.5"><Edit2 size={11} className="text-blue-400" /> Rename</button>
                        <button onClick={e => { e.stopPropagation(); openAssignModal(camp.id); }} className="w-full text-left px-3 py-2 text-xs font-bold text-gray-300 hover:bg-white/5 flex items-center gap-2.5 border-t border-white/8"><MoveRight size={11} className="text-purple-400" /> Move to Folder</button>
                        <button onClick={e => { e.stopPropagation(); setConfirmDeleteCampaignId(camp.id); setMenuOpenId(null); }} className="w-full text-left px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 flex items-center gap-2.5 border-t border-white/8"><Trash2 size={11} /> Delete</button>
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="font-bold text-white text-sm mb-1 group-hover:text-[#CD3D35] transition-colors truncate">{camp.name}</h3>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{camp.leadCount.toLocaleString()} leads</span>
                  <span className="font-mono text-[10px]">{timeAgo(camp.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-gray-600"><Folder size={26} /></div>
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">No campaigns here yet</p>
              <p className="text-gray-600 text-xs">Create a new campaign to start importing leads.</p>
            </div>
            <button onClick={goCreate} className="flex items-center gap-1.5 bg-[#CD3D35] hover:bg-[#B83530] text-white px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-[0.98]"><Plus size={14} /> New Campaign</button>
          </div>
        )}

        {/* Rename modal */}
        {editingCampaign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#0c0c0e] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <h3 className="text-sm font-bold text-white mb-4">Rename Campaign</h3>
              <input type="text" value={editingCampaign.name} onChange={e => setEditingCampaign({ ...editingCampaign, name: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleRename()} className={`${inputCls} mb-4`} autoFocus />
              <div className="flex gap-3">
                <button onClick={() => setEditingCampaign(null)} className="flex-1 px-4 py-2.5 border border-white/10 text-gray-400 font-bold rounded-xl text-sm hover:text-white transition-all">Cancel</button>
                <button onClick={handleRename} className="flex-1 px-4 py-2.5 bg-[#CD3D35] hover:bg-[#B83530] text-white rounded-xl font-bold text-sm">Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete campaign modal */}
        {confirmDeleteCampaignId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#0c0c0e] border border-red-500/25 rounded-2xl p-6 w-full max-w-sm shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-red-500" />
              <div className="flex items-center gap-3 mb-4"><div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center"><AlertTriangle size={15} className="text-red-400" /></div><h3 className="text-base font-bold text-white">Delete Campaign?</h3></div>
              <p className="text-gray-400 mb-6 text-sm">Permanently removes this campaign and all its leads.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDeleteCampaignId(null)} className="flex-1 px-4 py-2.5 border border-white/10 text-gray-400 font-bold rounded-xl text-sm hover:text-white transition-all">Cancel</button>
                <button onClick={handleDeleteCampaignConfirm} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Niches (inside a channel) ─────────────────────────────────────────────────
  if (level === 'niches' && activeChannelId) {
    return (
      <div className="p-6 space-y-5 h-full flex flex-col">
        <div className="flex items-center gap-3">
          <button onClick={goChannels} className="p-1.5 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors shrink-0"><ArrowLeft size={16} /></button>
          {activeChannel && (
            <div className="flex items-center gap-2">
              <activeChannel.Icon size={16} style={{ color: activeChannel.color }} />
              <h2 className="text-lg font-bold text-white">{activeChannel.label}</h2>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 overflow-y-auto crm-scroll flex-1 pb-4 content-start">
          {NICHES.map(niche => {
            const nicheCampaigns = getCampaignsFor(activeChannelId, niche.id);
            const nicheLeads     = nicheCampaigns.reduce((s, c) => s + c.leadCount, 0);

            return (
              <button
                key={niche.id}
                onClick={() => goCampaigns(niche.id)}
                className="text-left p-4 bg-white/[0.02] border border-white/8 rounded-2xl hover:border-white/15 hover:bg-white/[0.035] transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl border flex items-center justify-center" style={{ background: `${niche.color}15`, borderColor: `${niche.color}30` }}>
                    <FolderOpen size={14} style={{ color: niche.color }} />
                  </div>
                  <ChevronRight size={12} className="text-gray-700 group-hover:text-gray-400 transition-colors" />
                </div>
                <p className="text-sm font-bold text-white mb-0.5">{niche.label}</p>
                <p className="text-[11px] text-gray-500 mb-1">{nicheLeads.toLocaleString()} leads</p>
                <p className="text-[10px] text-gray-600">{nicheCampaigns.length} campaign{nicheCampaigns.length !== 1 ? 's' : ''}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Channels (top level) ──────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6 h-full flex flex-col overflow-y-auto crm-scroll">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white">Leads</h2>
          <p className="text-gray-500 text-sm mt-0.5">{campaigns.length} campaigns · {allLeads.length.toLocaleString()} leads total</p>
        </div>
      </div>

      {/* 3 Channel tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        {CHANNELS.map(channel => {
          const chLeadCount  = getChannelLeadCount(channel.id);
          const chCampCount  = getChannelCampaigns(channel.id).length;
          const Icon         = channel.Icon;

          return (
            <button
              key={channel.id}
              onClick={() => goNiches(channel.id)}
              className="text-left p-5 bg-white/[0.02] border border-white/8 rounded-2xl hover:border-white/15 hover:bg-white/[0.04] transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl border flex items-center justify-center" style={{ background: `${channel.color}15`, borderColor: `${channel.color}30` }}>
                  <Icon size={20} style={{ color: channel.color }} />
                </div>
                <ChevronRight size={14} className="text-gray-700 group-hover:text-gray-400 transition-colors mt-1" />
              </div>
              <h3 className="text-base font-bold mb-1" style={{ color: channel.color }}>{channel.label}</h3>
              <div className="flex items-center gap-4 text-xs mt-3">
                <span className="text-gray-400"><span className="text-white font-semibold">{chCampCount}</span> campaigns</span>
                <span className="text-gray-400"><span className="text-white font-semibold">{chLeadCount.toLocaleString()}</span> leads</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Uncategorized */}
      {unassigned.length > 0 && (
        <div className="shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">Uncategorized</p>
            <span className="text-[9px] bg-white/5 border border-white/8 rounded-full px-2 py-0.5 text-gray-500">{unassigned.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {unassigned.map(camp => (
              <div key={camp.id} className="flex items-start gap-3 p-3.5 bg-white/[0.02] border border-white/8 hover:border-white/12 rounded-xl transition-all group">
                <Folder size={14} className="text-gray-600 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => { setActiveCampaign(camp); setSearchQuery(''); setCurrentPage(1); setLevel('list'); }}>
                  <p className="text-xs font-semibold text-gray-300 group-hover:text-white truncate transition-colors">{camp.name}</p>
                  <p className="text-[9px] text-gray-600 mt-0.5">{camp.leadCount} leads · {timeAgo(camp.createdAt)}</p>
                </div>
                <button onClick={() => openAssignModal(camp.id)} className="shrink-0 flex items-center gap-1 text-[9px] text-gray-600 hover:text-[#CD3D35] bg-white/5 hover:bg-[#CD3D35]/10 px-2 py-1 rounded-lg border border-white/8 hover:border-[#CD3D35]/20 transition-all font-medium whitespace-nowrap">
                  <MoveRight size={9} /> Assign
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {campaigns.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-16">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-600"><FolderOpen size={30} /></div>
          <div>
            <p className="text-gray-400 text-base font-semibold mb-1">No leads yet</p>
            <p className="text-gray-600 text-sm">Pick a channel, then open a niche to create your first campaign.</p>
          </div>
        </div>
      )}

      {/* Assign to folder modal */}
      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0c0c0e] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-4">Assign to Folder</h3>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Channel</label>
                <div className="flex gap-2">
                  {CHANNELS.map(ch => {
                    const ChIcon = ch.Icon;
                    return (
                      <button key={ch.id} onClick={() => setAssignChannelId(ch.id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border text-xs font-medium transition-all`}
                        style={assignChannelId === ch.id
                          ? { borderColor: ch.color + '60', background: ch.color + '20', color: ch.color }
                          : { borderColor: 'rgba(255,255,255,0.08)', color: '#6B7280' }
                        }
                      >
                        <ChIcon size={11} /> {ch.label.replace('Cold ', '')}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Niche</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {NICHES.map(n => (
                    <button key={n.id} onClick={() => setAssignNiche(n.id)} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left text-xs transition-all ${assignNiche === n.id ? 'border-white/25 bg-white/8 text-white' : 'border-white/8 text-gray-500 hover:text-gray-300 hover:border-white/12'}`}>
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: n.color }} />
                      {n.short}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setAssignModal(null)} className="flex-1 px-4 py-2.5 border border-white/10 text-gray-400 font-bold rounded-xl text-sm hover:text-white transition-all">Cancel</button>
              <button onClick={handleAssignConfirm} className="flex-1 px-4 py-2.5 bg-[#CD3D35] hover:bg-[#B83530] text-white rounded-xl font-bold text-sm active:scale-[0.98]">Assign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
