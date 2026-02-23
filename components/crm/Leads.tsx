import React, { useState, useRef, useMemo } from 'react';
import { Folder, Search, Plus, MoreHorizontal, Phone, ArrowLeft, Trash2, Edit2, CheckSquare, Square, Upload, FileText, X, Globe, Star, MessageSquare, MapPin, AlertTriangle, User, Users, Mail, Save, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { Lead, Campaign } from './types';
import { CRMView } from './CRM';

const PAGE_SIZE = 50;

const STATUS_OPTIONS = [
    "New Lead",
    "Demo Booked",
    "Not Interested",
    "Wrong Number",
    "Voicemail",
    "Follow-up Required"
];

const getStatusStyles = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('new')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (s.includes('booked')) return 'bg-green-500/10 text-green-400 border-green-500/20';
    if (s.includes('not interested')) return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (s.includes('follow-up') || s.includes('voicemail') || s.includes('wrong number')) return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
};

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
}

const Leads: React.FC<LeadsProps> = ({ campaigns, allLeads, onAddCampaign, onDeleteCampaign, onRenameCampaign, onAddLead, onUpdateLead, onDeleteLead, onNavigate }) => {
    const [view, setView] = useState<'folders' | 'list' | 'create' | 'add-lead' | 'edit-lead'>('folders');
    const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Create Campaign State
    const [newCampaignName, setNewCampaignName] = useState('');
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
    
    // Individual Lead State (Shared by Add and Edit)
    const [leadForm, setLeadForm] = useState<Partial<Lead>>({
        name: '',
        company: '',
        phone: '',
        email: '',
        address: '',
        website: '',
        rating: '',
        reviews: '0',
        summary: '',
        status: 'New Lead'
    });

    // Menu / Modal States
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [confirmDeleteCampaignId, setConfirmDeleteCampaignId] = useState<string | null>(null);
    const [confirmDeleteLeadId, setConfirmDeleteLeadId] = useState<string | null>(null);
    const [editingCampaign, setEditingCampaign] = useState<{id: string, name: string} | null>(null);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Helper to get numeric sort order from ID (extracted from last segment)
    const getLeadSortOrder = (id: string) => {
        const parts = id.split('-');
        const suffix = parts[parts.length - 1];
        const match = suffix.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    };

    // Derived Data
    const currentCampaignLeads = useMemo(() => {
        if (!activeCampaign) return [];
        let filtered = allLeads.filter(l => l.campaignId === activeCampaign.id);
        
        // Sort by upload order (numeric ID suffix)
        filtered.sort((a, b) => getLeadSortOrder(a.id) - getLeadSortOrder(b.id));

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(l => 
                l.company.toLowerCase().includes(query) || 
                l.name.toLowerCase().includes(query)
            );
        }
        
        return filtered;
    }, [allLeads, activeCampaign, searchQuery]);

    const totalPages = Math.ceil(currentCampaignLeads.length / PAGE_SIZE) || 1;
    const paginatedLeads = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return currentCampaignLeads.slice(start, start + PAGE_SIZE);
    }, [currentCampaignLeads, currentPage]);

    const handleOpenCampaign = (campaign: Campaign) => {
        setActiveCampaign(campaign);
        setCurrentPage(1);
        setSearchQuery('');
        setView('list');
    };

    const toggleSelectLead = (id: string) => {
        setSelectedLeads(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        const currentPageIds = paginatedLeads.map(l => l.id);
        // FIX: lead is already an ID string from currentPageIds, accessing .id was causing an error.
        const allSelected = currentPageIds.every(lead => selectedLeads.includes(lead));
        if (allSelected) {
            setSelectedLeads(prev => prev.filter(id => !currentPageIds.includes(id)));
        } else {
            setSelectedLeads(prev => [...new Set([...prev, ...currentPageIds])]);
        }
    };

    // Form Handlers
    const handleSaveLead = () => {
        if (!leadForm.name || !leadForm.company || !leadForm.phone) {
            alert('Name, Company, and Phone are required.');
            return;
        }
        
        if (!activeCampaign) return;

        if (view === 'add-lead') {
            const lead: Lead = {
                id: `l-${Date.now()}`,
                campaignId: activeCampaign.id,
                name: leadForm.name || 'Unknown Contact',
                company: leadForm.company || 'Unknown Company',
                phone: leadForm.phone || 'N/A',
                email: leadForm.email || '',
                address: leadForm.address || '',
                website: leadForm.website || '',
                rating: leadForm.rating || '4.0',
                reviews: leadForm.reviews || '0',
                summary: leadForm.summary || 'Manually added lead.',
                status: leadForm.status || 'New Lead'
            };
            onAddLead(lead);
        } else if (view === 'edit-lead') {
            onUpdateLead(leadForm as Lead);
        }

        setLeadForm({ name: '', company: '', phone: '', email: '', address: '', website: '', rating: '', reviews: '0', summary: '', status: 'New Lead' });
        setView('list');
    };

    const handleEditLeadClick = (lead: Lead) => {
        setLeadForm(lead);
        setView('edit-lead');
    };

    const handleDeleteLeadConfirm = () => {
        if (confirmDeleteLeadId) {
            onDeleteLead(confirmDeleteLeadId);
            setConfirmDeleteLeadId(null);
        }
    };

    // CSV Parsing Logic
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPendingFile(e.target.files[0]);
        }
    };

    const parseCSV = async (file: File): Promise<Partial<Lead>[]> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                const rows = text.split('\n').map(row => {
                    const result = [];
                    let current = '';
                    let inQuotes = false;
                    
                    for (let i = 0; i < row.length; i++) {
                        const char = row[i];
                        if (char === '"') {
                            inQuotes = !inQuotes;
                        } else if (char === ',' && !inQuotes) {
                            result.push(current.trim());
                            current = '';
                        } else {
                            current += char;
                        }
                    }
                    result.push(current.trim());
                    return result;
                });
                
                const headers = rows[0].map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
                const findHeaderIndex = (patterns: string[]) => {
                    for (const pattern of patterns) {
                        const index = headers.findIndex(h => 
                            h.includes(pattern) || 
                            h === pattern ||
                            h.replace(/[_\s-]/g, '').includes(pattern.replace(/[_\s-]/g, ''))
                        );
                        if (index !== -1) return index;
                    }
                    return -1;
                };
                
                const headerMap = {
                    name: findHeaderIndex(['name', 'contact', 'decision maker', 'decisionmaker', 'contactname', 'contact name', 'fullname', 'full name', 'person']),
                    company: findHeaderIndex(['company', 'business', 'businessname', 'business name', 'organization', 'org', 'companyname', 'company name']),
                    phone: findHeaderIndex(['phone', 'mobile', 'phonenumber', 'phone number', 'tel', 'telephone', 'cell', 'contact number']),
                    email: findHeaderIndex(['email', 'e-mail', 'emailaddress', 'email address', 'mail']),
                    address: findHeaderIndex(['address', 'location', 'street', 'streetaddress', 'street address', 'businessaddress', 'business address']),
                    website: findHeaderIndex(['website', 'web', 'url', 'site', 'homepage', 'web site']),
                    rating: findHeaderIndex(['rating', 'stars', 'score', 'review rating']),
                    reviews: findHeaderIndex(['reviews', 'review count', 'reviewcount', 'number of reviews', 'total reviews'])
                };
                
                const leads: Partial<Lead>[] = rows.slice(1)
                    .filter(row => row.length > 1 && row.some(cell => cell.trim()))
                    .map(row => {
                        const lead: any = {};
                        if (headerMap.name !== -1) lead.name = row[headerMap.name]?.trim().replace(/['"]/g, '');
                        if (headerMap.company !== -1) lead.company = row[headerMap.company]?.trim().replace(/['"]/g, '');
                        if (headerMap.phone !== -1) lead.phone = row[headerMap.phone]?.trim().replace(/['"]/g, '');
                        if (headerMap.email !== -1) lead.email = row[headerMap.email]?.trim().replace(/['"]/g, '');
                        if (headerMap.address !== -1) lead.address = row[headerMap.address]?.trim().replace(/['"]/g, '');
                        if (headerMap.website !== -1) lead.website = row[headerMap.website]?.trim().replace(/['"]/g, '');
                        if (headerMap.rating !== -1) lead.rating = row[headerMap.rating]?.trim().replace(/['"]/g, '');
                        if (headerMap.reviews !== -1) lead.reviews = row[headerMap.reviews]?.trim().replace(/['"]/g, '');
                        return lead;
                    });
                resolve(leads);
            };
            reader.readAsText(file);
        });
    };

    const handleCreateCampaign = async () => {
        if (!newCampaignName.trim()) {
            alert('Please provide a campaign name.');
            return;
        }
        if (!pendingFile) {
            alert('Please upload a CSV file.');
            return;
        }

        setIsCreatingCampaign(true);
        try {
            const parsedLeads = await parseCSV(pendingFile);
            const campaignId = `camp-${Date.now()}`;
            
            const finalLeads: Lead[] = parsedLeads.map((pl, idx) => ({
                id: `l-${campaignId}-${idx}`,
                campaignId: campaignId,
                name: pl.name || 'Unknown Contact',
                company: pl.company || 'Unknown Company',
                phone: pl.phone || 'N/A',
                email: pl.email || '',
                address: pl.address || '',
                website: pl.website || '',
                rating: pl.rating || '4.0',
                reviews: pl.reviews || '0',
                summary: 'Imported from CSV.',
                status: 'New Lead'
            }));

            const campaign: Campaign = {
                id: campaignId,
                name: newCampaignName,
                createdAt: new Date().toISOString().split('T')[0],
                leadCount: finalLeads.length
            };

            onAddCampaign(campaign, finalLeads);
            setNewCampaignName('');
            setPendingFile(null);
            setView('folders');
        } catch (err) {
            alert('Error parsing CSV. Ensure it is a valid comma-separated file.');
        } finally {
            setIsCreatingCampaign(false);
        }
    };

    const handleRename = () => {
        if (editingCampaign && editingCampaign.name.trim()) {
            onRenameCampaign(editingCampaign.id, editingCampaign.name);
            if (activeCampaign && activeCampaign.id === editingCampaign.id) {
                setActiveCampaign({ ...activeCampaign, name: editingCampaign.name });
            }
            setEditingCampaign(null);
        }
    };

    const handleConfirmDeleteCampaign = () => {
        if (confirmDeleteCampaignId) {
            onDeleteCampaign(confirmDeleteCampaignId);
            if (activeCampaign && activeCampaign.id === confirmDeleteCampaignId) {
                setView('folders');
                setActiveCampaign(null);
            }
            setConfirmDeleteCampaignId(null);
        }
    };

    const goToFirst = () => setCurrentPage(1);
    const goToLast = () => setCurrentPage(totalPages);
    const goToPrev = () => setCurrentPage(prev => Math.max(1, prev - 1));
    const goToNext = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

    if (view === 'add-lead' || view === 'edit-lead') {
        const isEdit = view === 'edit-lead';
        return (
            <div className="h-full flex flex-col max-w-2xl mx-auto py-8">
                <button onClick={() => setView('list')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group w-fit">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Lead List
                </button>

                <div className="bg-[#18181b] border border-[#262624] rounded-2xl p-8 space-y-8 shadow-2xl overflow-y-auto crm-scroll">
                    <div className="text-center">
                        <div className="w-12 h-12 rounded-xl bg-horizon-accent/10 border border-horizon-accent/20 flex items-center justify-center text-horizon-accent mx-auto mb-4">
                            {isEdit ? <Edit2 size={24} /> : <User size={24} />}
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{isEdit ? 'Edit Lead' : 'Add Individual Lead'}</h2>
                        <p className="text-gray-500 text-sm">Managing contact in <span className="text-white font-bold">{activeCampaign?.name}</span>.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Decision Maker Name*</label>
                            <input type="text" placeholder="e.g. Sarah Connor" value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} className="w-full bg-[#09090b] border border-[#262624] rounded-xl px-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Company Name*</label>
                            <input type="text" placeholder="e.g. Cyberdyne Systems" value={leadForm.company} onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })} className="w-full bg-[#09090b] border border-[#262624] rounded-xl px-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number*</label>
                            <div className="relative">
                                <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input type="text" placeholder="+1 555-0101" value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} className="w-full bg-[#09090b] border border-[#262624] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none font-mono" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input type="email" placeholder="sarah@cyberdyne.com" value={leadForm.email} onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })} className="w-full bg-[#09090b] border border-[#262624] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none" />
                            </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Website</label>
                            <div className="relative">
                                <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input type="text" placeholder="www.cyberdyne.com" value={leadForm.website} onChange={(e) => setLeadForm({ ...leadForm, website: e.target.value })} className="w-full bg-[#09090b] border border-[#262624] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none" />
                            </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Address</label>
                            <div className="relative">
                                <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input type="text" placeholder="123 AI Lane, San Francisco, CA" value={leadForm.address} onChange={(e) => setLeadForm({ ...leadForm, address: e.target.value })} className="w-full bg-[#09090b] border border-[#262624] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rating (1-5)</label>
                            <input type="text" placeholder="4.5" value={leadForm.rating} onChange={(e) => setLeadForm({ ...leadForm, rating: e.target.value })} className="w-full bg-[#09090b] border border-[#262624] rounded-xl px-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status / Disposition</label>
                            <select value={leadForm.status} onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value })} className="w-full bg-[#09090b] border border-[#262624] rounded-xl px-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none appearance-none cursor-pointer">
                                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Opportunity Summary / Notes</label>
                            <textarea placeholder="Enter specific pain points or context..." value={leadForm.summary} onChange={(e) => setLeadForm({ ...leadForm, summary: e.target.value })} className="w-full bg-[#09090b] border border-[#262624] rounded-xl px-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none h-32 resize-none crm-scroll" />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button onClick={() => setView('list')} className="flex-1 bg-transparent border border-[#262624] text-white py-3 rounded-xl font-bold hover:bg-white/5 transition-colors">Cancel</button>
                        <button onClick={handleSaveLead} className="flex-1 bg-horizon-accent text-black py-3 rounded-xl font-bold hover:bg-white transition-colors flex items-center justify-center gap-2">
                            <Save size={18} /> {isEdit ? 'Save Changes' : 'Add Lead'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'create') {
        return (
            <div className="h-full flex flex-col max-w-2xl mx-auto py-8">
                <button onClick={() => setView('folders')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group w-fit">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Campaigns
                </button>

                <div className="bg-[#18181b] border border-[#262624] rounded-2xl p-8 space-y-8 shadow-2xl">
                    <div className="text-center">
                        <div className="w-12 h-12 rounded-xl bg-horizon-accent/10 border border-horizon-accent/20 flex items-center justify-center text-horizon-accent mx-auto mb-4">
                            <Plus size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Create New Campaign</h2>
                        <p className="text-gray-500 text-sm">Upload a CSV to start a new outreach sequence.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Campaign Name</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Real Estate Q2 Cold Calls" 
                                value={newCampaignName} 
                                onChange={(e) => setNewCampaignName(e.target.value)} 
                                className="w-full bg-[#09090b] border border-[#262624] rounded-xl px-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none" 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Leads Data (CSV)</label>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${pendingFile ? 'border-horizon-accent/50 bg-horizon-accent/5' : 'border-[#262624] hover:border-horizon-accent/30 bg-[#09090b]'}`}
                            >
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
                                <Upload className={`mb-4 ${pendingFile ? 'text-horizon-accent' : 'text-gray-600'}`} size={32} />
                                <p className="text-sm font-medium text-white mb-1">
                                    {pendingFile ? pendingFile.name : 'Click to upload or drag and drop'}
                                </p>
                                <p className="text-xs text-gray-500">CSV files only. Headers should include Name, Company, Phone.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button onClick={() => setView('folders')} className="flex-1 bg-transparent border border-[#262624] text-white py-3 rounded-xl font-bold hover:bg-white/5 transition-colors">Cancel</button>
                            <button 
                                onClick={handleCreateCampaign} 
                                disabled={isCreatingCampaign}
                                className="flex-1 bg-horizon-accent text-black py-3 rounded-xl font-bold hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isCreatingCampaign ? 'Parsing...' : 'Create Campaign'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'folders') {
        return (
            <div className="space-y-6 h-full flex flex-col relative">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Campaigns</h2>
                        <p className="text-gray-500 text-sm">Organize and manage your outreach lead lists.</p>
                    </div>
                    <button onClick={() => setView('create')} className="flex items-center gap-2 bg-horizon-accent text-black px-4 py-2 rounded-lg font-bold hover:bg-white transition-colors">
                        <Plus size={18} /> New Campaign
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {campaigns.map((camp) => (
                        <div key={camp.id} onClick={() => handleOpenCampaign(camp)} className="bg-[#18181b] border border-[#262624] hover:border-horizon-accent/50 p-6 rounded-xl cursor-pointer transition-all group relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-[#262624] rounded-lg group-hover:bg-horizon-accent/10 transition-colors">
                                    <Folder className="text-gray-400 group-hover:text-horizon-accent" size={24} />
                                </div>
                                <div className="relative campaign-menu-container">
                                    <button onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === camp.id ? null : camp.id); }} className="text-gray-500 hover:text-white p-1 hover:bg-[#333] rounded transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                    {menuOpenId === camp.id && (
                                        <div className="absolute right-0 top-full mt-2 w-40 bg-[#121214] border border-[#262624] rounded-xl shadow-2xl z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                            <button onClick={(e) => { e.stopPropagation(); setEditingCampaign({ id: camp.id, name: camp.name }); setMenuOpenId(null); }} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 flex items-center gap-3 transition-colors">
                                                <Edit2 size={16} className="text-blue-400" /> Rename
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteCampaignId(camp.id); setMenuOpenId(null); }} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-colors border-t border-[#262624]">
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-horizon-accent transition-colors truncate">{camp.name}</h3>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>{camp.leadCount} Leads</span>
                                <span>{camp.createdAt}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {editingCampaign && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-[#121214] border border-[#262624] rounded-2xl p-8 w-full max-w-md shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-6">Rename Campaign</h3>
                            <input 
                                type="text" 
                                value={editingCampaign.name} 
                                onChange={(e) => setEditingCampaign({ ...editingCampaign, name: e.target.value })} 
                                className="w-full bg-[#09090b] border border-[#262624] rounded-xl px-4 py-3 text-sm text-white focus:border-horizon-accent focus:outline-none mb-8" 
                            />
                            <div className="flex gap-4">
                                <button onClick={() => setEditingCampaign(null)} className="flex-1 px-4 py-3 border border-[#262624] text-gray-400 font-bold rounded-xl hover:bg-white/5">Cancel</button>
                                <button onClick={handleRename} className="flex-1 px-4 py-3 bg-horizon-accent text-black rounded-xl font-bold">Save</button>
                            </div>
                        </div>
                    </div>
                )}

                {confirmDeleteCampaignId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-[#121214] border border-red-500/30 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                            <div className="flex items-center gap-4 text-red-500 mb-6">
                                <AlertTriangle size={24} />
                                <h3 className="text-xl font-bold">Delete Campaign?</h3>
                            </div>
                            <p className="text-gray-400 mb-8">This will permanently remove the campaign and all its leads.</p>
                            <div className="flex gap-4">
                                <button onClick={() => setConfirmDeleteCampaignId(null)} className="flex-1 px-4 py-3 border border-[#262624] text-gray-400 font-bold rounded-xl hover:bg-white/5">Cancel</button>
                                <button onClick={handleConfirmDeleteCampaign} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold">Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4 h-full flex flex-col relative">
            <div className="flex items-center justify-between bg-[#18181b] p-4 rounded-xl border border-[#262624]">
                <div className="flex items-center gap-4">
                    <button onClick={() => setView('folders')} className="p-2 hover:bg-[#262624] rounded-lg text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="font-bold text-white text-lg">{activeCampaign?.name}</h2>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-[#09090b] border border-[#262624] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-horizon-accent w-64" />
                    </div>
                    <button onClick={() => { setLeadForm({ name: '', company: '', phone: '', email: '', address: '', website: '', rating: '', reviews: '0', summary: '', status: 'New Lead' }); setView('add-lead'); }} className="flex items-center gap-2 bg-horizon-accent text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-white transition-colors">
                        <Plus size={16} /> Add Lead
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-[#18181b] border border-[#262624] rounded-xl overflow-hidden flex flex-col">
                <div className="grid grid-cols-[40px_1.5fr_1fr_120px_1.5fr_100px_1fr_120px_110px] gap-4 p-4 border-b border-[#262624] bg-[#262624]/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider items-center">
                    <div className="flex items-center justify-center">
                        <button onClick={toggleSelectAll}>{paginatedLeads.every(lead => selectedLeads.includes(lead.id)) ? <CheckSquare size={14} className="text-horizon-accent" /> : <Square size={14} />}</button>
                    </div>
                    {/* Header: Decision Maker (Person), Company Name (Business) */}
                    <div>Decision Maker</div>
                    <div>Company Name</div>
                    <div>Phone</div>
                    <div>Address</div>
                    <div>Rating (Reviews)</div>
                    <div>Website</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                </div>

                <div className="overflow-y-auto flex-1 crm-scroll">
                    {paginatedLeads.map((lead) => (
                        <div key={lead.id} className="grid grid-cols-[40px_1.5fr_1fr_120px_1.5fr_100px_1fr_120px_110px] gap-4 p-4 border-b border-[#262624] hover:bg-[#262624]/30 transition-colors items-center group">
                            <div className="flex items-center justify-center">
                                <button onClick={() => toggleSelectLead(lead.id)}>{selectedLeads.includes(lead.id) ? <CheckSquare size={14} className="text-horizon-accent" /> : <Square size={14} />}</button>
                            </div>
                            {/* Decision Maker (Name) | Company Name (Business) */}
                            <div className="truncate font-bold text-white text-sm">{lead.name || 'Unknown Contact'}</div>
                            <div className="text-sm text-gray-300 truncate">{lead.company || 'Unknown Company'}</div>
                            <div className="text-xs text-gray-400 font-mono">{lead.phone || 'N/A'}</div>
                            <div className="truncate text-[10px] text-gray-500 flex items-center gap-1"><MapPin size={10} /> {lead.address || 'N/A'}</div>
                            <div className="flex items-center gap-1">
                                <Star size={10} className="text-yellow-500 fill-yellow-500" /> 
                                <span className="text-xs text-white">
                                    {lead.rating || '-'}
                                    <span className="text-[10px] text-gray-500 font-medium ml-1">({lead.reviews || '0'})</span>
                                </span>
                            </div>
                            <div className="truncate">
                                {lead.website ? (
                                    <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noreferrer" className="text-[10px] text-horizon-accent hover:underline">
                                        {lead.website.replace(/https?:\/\//, '').substring(0, 20)}...
                                    </a>
                                ) : 'N/A'}
                            </div>
                            <div>
                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusStyles(lead.status)}`}>
                                    {lead.status}
                                </span>
                            </div>
                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => onNavigate('dialer', lead.id, lead.campaignId)} className="p-1.5 bg-green-500/10 text-green-400 rounded hover:bg-green-500 hover:text-black" title="Call"><Phone size={12} /></button>
                                <button onClick={() => onNavigate('conversations', lead.id, lead.campaignId)} className="p-1.5 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500 hover:text-white" title="Message"><MessageSquare size={12} /></button>
                                <button onClick={() => handleEditLeadClick(lead)} className="p-1.5 bg-white/5 text-gray-400 rounded hover:bg-white hover:text-black" title="Edit"><Edit2 size={12} /></button>
                                <button onClick={() => setConfirmDeleteLeadId(lead.id)} className="p-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500 hover:text-white" title="Delete"><Trash2 size={12} /></button>
                            </div>
                        </div>
                    ))}
                    {paginatedLeads.length === 0 && (
                        <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-600">
                                <Users size={32} />
                            </div>
                            <p className="text-gray-500 text-sm italic">No leads found in this campaign.</p>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="p-4 border-t border-[#262624] bg-[#18181b] flex items-center justify-between shrink-0">
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            Showing {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, currentCampaignLeads.length)} of {currentCampaignLeads.length}
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={goToFirst} disabled={currentPage === 1} className="p-2 bg-[#09090b] border border-[#262624] rounded-lg text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ChevronsLeft size={16} /></button>
                            <button onClick={goToPrev} disabled={currentPage === 1} className="p-2 bg-[#09090b] border border-[#262624] rounded-lg text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ChevronLeft size={16} /></button>
                            <div className="px-4 py-2 bg-[#09090b] border border-[#262624] rounded-lg text-xs font-bold text-horizon-accent">{currentPage} / {totalPages}</div>
                            <button onClick={goToNext} disabled={currentPage === totalPages} className="p-2 bg-[#09090b] border border-[#262624] rounded-lg text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ChevronRight size={16} /></button>
                            <button onClick={goToLast} disabled={currentPage === totalPages} className="p-2 bg-[#09090b] border border-[#262624] rounded-lg text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ChevronsRight size={16} /></button>
                        </div>
                    </div>
                )}
            </div>

            {confirmDeleteLeadId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#121214] border border-red-500/30 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">Delete Lead?</h3>
                        <p className="text-gray-400 mb-8">This action cannot be undone.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setConfirmDeleteLeadId(null)} className="flex-1 px-4 py-3 border border-[#262624] text-gray-400 font-bold rounded-xl hover:bg-white/5 transition-colors">Cancel</button>
                            <button onClick={handleDeleteLeadConfirm} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors">Delete Permanently</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leads;