import React, { useState, useMemo, useEffect } from 'react';
import { Search, Send, Paperclip, MoreVertical, Phone, Info, Globe, Mail, MapPin, Star, MessageSquare, PhoneCall, CalendarCheck } from 'lucide-react';
import { Lead, Campaign } from './types';

const getStatusStyles = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('new')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (s.includes('booked')) return 'bg-green-500/10 text-green-400 border-green-500/20';
    if (s.includes('not interested')) return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (s.includes('follow-up') || s.includes('voicemail') || s.includes('wrong number')) return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
};

interface ConversationsProps {
    campaigns: Campaign[];
    allLeads: Lead[];
    initialLeadId?: string;
    initialCampaignId?: string;
}

const Conversations: React.FC<ConversationsProps> = ({ campaigns, allLeads, initialLeadId, initialCampaignId }) => {
    // Selectors state
    const [selectedTwilio, setSelectedTwilio] = useState('+1 (555) 010-9988');
    const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || '');
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
    const [showFullDetails, setShowFullDetails] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Handle incoming navigation
    useEffect(() => {
        if (initialCampaignId) {
            setSelectedCampaignId(initialCampaignId);
            if (initialLeadId) {
                setSelectedLeadId(initialLeadId);
                setShowFullDetails(false);
            }
        }
    }, [initialCampaignId, initialLeadId]);

    // Helper to get numeric sort order from ID (extracted from last segment)
    const getLeadSortOrder = (id: string) => {
        const parts = id.split('-');
        const suffix = parts[parts.length - 1];
        const match = suffix.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    };

    // Filtered Leads for the Sidebar based on Campaign and Search Query
    const filteredLeads = useMemo(() => {
        if (!selectedCampaignId) return [];
        let filtered = allLeads.filter(l => l.campaignId === selectedCampaignId);
        
        // Ensure leads follow the original upload order
        filtered.sort((a, b) => getLeadSortOrder(a.id) - getLeadSortOrder(b.id));

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(l => 
                l.company.toLowerCase().includes(query) || 
                l.name.toLowerCase().includes(query)
            );
        }
        
        return filtered;
    }, [selectedCampaignId, allLeads, searchQuery]);

    const selectedLead = useMemo(() => {
        return allLeads.find(l => l.id === selectedLeadId) || null;
    }, [selectedLeadId, allLeads]);

    // Mock Message History
    const [messagesMap] = useState<Record<string, any[]>>({
        'l1': [
            { id: 1, sender: 'me', text: 'Hey Sarah, just following up on our call.', time: '10:00 AM' },
            { id: 2, sender: 'them', text: 'Hi! Yes, I spoke to the team.', time: '10:05 AM' }
        ]
    });

    const activeMessages = selectedLeadId ? (messagesMap[selectedLeadId] || []) : [];

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="h-full flex bg-[#18181b] border border-[#262624] rounded-xl overflow-hidden shadow-2xl">
            {/* Sidebar */}
            <div className="w-80 border-r border-[#262624] flex flex-col bg-[#121214]">
                <div className="p-4 border-b border-[#262624] space-y-3 bg-[#0c0c0e]">
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Outgoing Line</label>
                        <select value={selectedTwilio} onChange={(e) => setSelectedTwilio(e.target.value)} className="w-full bg-[#18181b] border border-[#262624] rounded-lg px-3 py-2 text-xs text-white appearance-none cursor-pointer">
                            <option value="+1 (555) 010-9988">+1 (555) 010-9988</option>
                            <option value="+1 (555) 010-7722">+1 (555) 010-7722</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Campaign Context</label>
                        <select value={selectedCampaignId} onChange={(e) => { setSelectedCampaignId(e.target.value); setSelectedLeadId(null); }} className="w-full bg-[#18181b] border border-[#262624] rounded-lg px-3 py-2 text-xs text-white appearance-none cursor-pointer">
                            {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="relative pt-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
                        <input type="text" placeholder="Filter inbox..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#09090b] border border-[#262624] rounded-lg pl-9 pr-4 py-1.5 text-xs text-white" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto crm-scroll bg-[#09090b]/40">
                    {filteredLeads.map((lead) => (
                        <div key={lead.id} onClick={() => { setSelectedLeadId(lead.id); setShowFullDetails(false); }} className={`p-4 border-b border-[#262624] cursor-pointer hover:bg-[#262624]/50 transition-colors flex items-center gap-3 ${selectedLeadId === lead.id ? 'bg-[#262624]' : ''}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${selectedLeadId === lead.id ? 'bg-horizon-accent text-black' : 'bg-gray-800 text-gray-400'}`}>{getInitials(lead.name)}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5"><h4 className="font-bold text-xs text-white truncate">{lead.name}</h4><span className="text-[10px] text-gray-600 font-mono">1d</span></div>
                                <div className="flex justify-between items-center"><p className="text-[10px] text-gray-500 truncate">{lead.company}</p><span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase ${getStatusStyles(lead.status)}`}>{lead.status}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-[#09090b]">
                {selectedLead ? (
                    <>
                        <div className="h-16 border-b border-[#262624] flex items-center justify-between px-6 bg-[#18181b] shrink-0 z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-horizon-accent/20 border border-horizon-accent/30 flex items-center justify-center text-horizon-accent font-bold text-sm">{getInitials(selectedLead.name)}</div>
                                <div>
                                    <h3 className="font-bold text-sm text-white">{selectedLead.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{selectedLead.company}</span>
                                        <span className={`text-[8px] font-bold px-1 py-0 rounded border uppercase ${getStatusStyles(selectedLead.status)}`}>{selectedLead.status}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 text-gray-500"><button className="hover:text-horizon-accent transition-colors"><Phone size={18} /></button><button onClick={() => setShowFullDetails(!showFullDetails)} className={`transition-colors ${showFullDetails ? 'text-horizon-accent' : 'hover:text-white'}`}><Info size={18} /></button><button className="hover:text-white"><MoreVertical size={18} /></button></div>
                        </div>

                        <div className="flex-1 overflow-hidden flex flex-col relative">
                            {activeMessages.length > 0 && !showFullDetails ? (
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/40 crm-scroll">
                                    {activeMessages.map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-xs ${msg.sender === 'me' ? 'bg-horizon-accent text-black rounded-tr-sm' : 'bg-[#262624] text-gray-200 rounded-tl-sm border border-[#333]'}`}><p>{msg.text}</p><span className="text-[9px] block mt-1.5 opacity-60">{msg.time}</span></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center p-8 md:p-12 bg-gradient-to-b from-[#0c0c0e] to-black crm-scroll overflow-y-auto">
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-horizon-accent to-emerald-500 flex items-center justify-center text-white font-bold text-3xl md:text-4xl mb-6 shadow-2xl ring-4 ring-[#18181b] shrink-0">{getInitials(selectedLead.name)}</div>
                                    <h2 className="text-2xl font-bold text-white mb-1">{selectedLead.name}</h2>
                                    <p className="text-horizon-accent text-sm font-bold uppercase tracking-[0.2em] mb-8">{selectedLead.company}</p>
                                    <div className="flex gap-8 md:gap-12 mb-8 text-center"><div><div className="text-lg font-bold text-white">0</div><div className="text-[10px] text-gray-500 uppercase tracking-widest">Dials</div></div><div><div className="text-lg font-bold text-white">0</div><div className="text-[10px] text-gray-500 uppercase tracking-widest">Demos</div></div><div><div className="text-lg font-bold text-white">{selectedLead.reviews || '0'}</div><div className="text-[10px] text-gray-500 uppercase tracking-widest">Reviews</div></div></div>
                                    {!showFullDetails ? <button onClick={() => setShowFullDetails(true)} className="text-xs font-bold text-gray-500 hover:text-white transition-colors flex items-center gap-2 mb-8 bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-white/10"><Info size={14} /> View Full Contact Information</button> : (
                                        <div className="w-full max-w-lg animate-in fade-in slide-in-from-top-4 duration-300">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                <div className="p-4 bg-[#121214] border border-[#262624] rounded-2xl flex items-start gap-4"><div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><PhoneCall size={16} /></div><div className="min-w-0"><div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Direct Line</div><div className="text-xs font-mono text-gray-200 truncate">{selectedLead.phone}</div></div></div>
                                                <div className="p-4 bg-[#121214] border border-[#262624] rounded-2xl flex items-start gap-4"><div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Mail size={16} /></div><div className="min-w-0"><div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Email</div><div className="text-xs text-gray-200 truncate">{selectedLead.email || 'N/A'}</div></div></div>
                                            </div>
                                            <div className="p-5 bg-[#121214] border border-[#262624] rounded-2xl mb-8">
                                                <div className="flex justify-between items-center mb-4"><h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><CalendarCheck size={14} className="text-horizon-accent" /> Summary</h4><span className="text-[10px] text-yellow-500 font-bold">{selectedLead.rating || '-'} ★</span></div>
                                                <p className="text-xs text-gray-400 italic leading-relaxed">"{selectedLead.summary}"</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {!showFullDetails && <div className="p-4 border-t border-[#262624] bg-[#18181b] mt-auto"><div className="flex gap-3 max-w-4xl mx-auto w-full"><button className="text-gray-500 hover:text-white p-2"><Paperclip size={20} /></button><div className="flex-1 relative"><input type="text" placeholder={`Reply to ${selectedLead.name.split(' ')[0]}...`} className="w-full bg-[#09090b] border border-[#262624] rounded-full px-5 py-2.5 text-xs text-white focus:outline-none focus:border-horizon-accent transition-all" /></div><button className="bg-horizon-accent text-black p-2.5 rounded-full hover:bg-white transition-all"><Send size={18} /></button></div></div>}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-[#09090b]"><div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 text-gray-800"><MessageSquare size={48} /></div><h3 className="text-2xl font-bold text-white mb-3">Your AI Outreach Inbox</h3><p className="text-gray-500 text-sm max-w-sm">Start by selecting a lead from the sidebar to view the conversation history and profile data.</p></div>
                )}
            </div>
        </div>
    );
};

export default Conversations;