import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Users, Phone, MapPin, Briefcase, KeyRound, BarChart3, LogOut, Search, Bell, Loader2, X, Clock, Radio, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

// Sub Components
import DashboardHome from './DashboardHome';
import Leads from './Leads';
import Dialer from './Dialer';
import Scraper from './Scraper';
import Clients from './Clients';
import Analytics from './Analytics';
import Credentials from './Credentials';
import Recordings from './Recordings';
import Motivation from './Motivation';
import { Lead, Campaign, Client, DemoEvent, Dial } from './types';

interface CRMProps {
    onLogout: () => void;
}

export type CRMView = 'dashboard' | 'leads' | 'dialer' | 'conversations' | 'clients' | 'automations' | 'analytics' | 'recordings' | 'motivation';

/**
 * Helper to format date as YYYY-MM-DD using LOCAL time
 */
const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const CRM: React.FC<CRMProps> = ({ onLogout }) => {
    const [currentView, setCurrentView] = useState<CRMView>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    // Global selection state for cross-view navigation
    const [navContext, setNavContext] = useState<{ leadId?: string; campaignId?: string }>({});

    // Global CRM State
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [allLeads, setAllLeads] = useState<Lead[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [demoEvents, setDemoEvents] = useState<DemoEvent[]>([]);
    const [dials, setDials] = useState<Dial[]>([]);

    // Fetch user data on mount
    useEffect(() => {
        fetchUserData();
    }, []);

    // Handle clicks outside notification popup
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showNotifications]);

    const fetchUserData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                onLogout();
                return;
            }

            setUserId(user.id);

            // Fetch all data including Dials
            const [campaignsData, leadsData, clientsData, demoEventsData, dialsData] = await Promise.all([
                supabase.from('campaigns').select('*').eq('user_id', user.id).order('created_timestamp', { ascending: false }),
                supabase.from('leads').select('*').eq('user_id', user.id).order('created_timestamp', { ascending: false }),
                supabase.from('clients').select('*').eq('user_id', user.id).order('created_timestamp', { ascending: false }),
                supabase.from('demo_events').select('*').eq('user_id', user.id).order('created_timestamp', { ascending: false }),
                supabase.from('dials').select('*').eq('user_id', user.id)
                
            ]);
            console.log('💾 Raw dials from database:', dialsData.data);
            console.log('💾 Dials data error (if any):', dialsData.error);

            if (campaignsData.data) {
                setCampaigns(campaignsData.data.map(c => ({
                    id: c.id,
                    name: c.name,
                    createdAt: c.created_at,
                    leadCount: c.lead_count
                })));
            }

            if (leadsData.data) {
                setAllLeads(leadsData.data.map(l => ({
                    id: l.id,
                    campaignId: l.campaign_id,
                    name: l.name,
                    company: l.company,
                    phone: l.phone,
                    email: l.email || '',
                    address: l.address || '',
                    website: l.website || '',
                    rating: l.rating || '4.0',
                    reviews: l.reviews || '0',
                    summary: l.summary || '',
                    status: l.status
                })));
            }

            if (clientsData.data) {
                setClients(clientsData.data.map(c => ({
                    id: c.id,
                    name: c.name,
                    company: c.company,
                    closeDate: c.close_date,
                    upfrontValue: c.upfront_value,
                    monthlyValue: c.monthly_value,
                    monthlyRetainerDate: c.monthly_retainer_date || undefined,
                    status: c.status as 'active' | 'inactive'
                })));
            }

            if (demoEventsData.data) {
                setDemoEvents(demoEventsData.data.map(d => ({
                    id: d.id,
                    leadId: d.lead_id,
                    date: d.date
                })));
            }

            if (dialsData.data) {
                setDials(dialsData.data.map(d => ({
                    id: d.id,
                    userId: d.user_id,
                    date: d.date,
                    timestamp: d.created_at
                })));
            }

        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    

    const handleAddCampaign = async (campaign: Campaign, leads: Lead[]) => {
        if (!userId) return;

        try {
            await supabase.from('campaigns').insert({
                id: campaign.id,
                user_id: userId,
                name: campaign.name,
                created_at: campaign.createdAt,
                lead_count: campaign.leadCount
            });

            if (leads.length > 0) {
                await supabase.from('leads').insert(
                    leads.map(l => ({
                        id: l.id,
                        user_id: userId,
                        campaign_id: l.campaignId,
                        name: l.name,
                        company: l.company,
                        phone: l.phone,
                        email: l.email || null,
                        address: l.address || null,
                        website: l.website || null,
                        rating: l.rating || null,
                        reviews: l.reviews || null,
                        summary: l.summary || null,
                        status: l.status
                    }))
                );
            }

            setCampaigns(prev => [campaign, ...prev]);
            setAllLeads(prev => [...leads, ...prev]);
        } catch (error) {
            console.error('Error adding campaign:', error);
            alert('Failed to add campaign. Please try again.');
        }
    };

    const handleAddLead = async (lead: Lead) => {
        if (!userId) return;

        try {
            await supabase.from('leads').insert({
                id: lead.id,
                user_id: userId,
                campaign_id: lead.campaignId,
                name: lead.name,
                company: lead.company,
                phone: lead.phone,
                email: lead.email || null,
                address: lead.address || null,
                website: lead.website || null,
                rating: lead.rating || null,
                reviews: lead.reviews || null,
                summary: lead.summary || null,
                status: lead.status
            });

            const campaign = campaigns.find(c => c.id === lead.campaignId);
            if (campaign) {
                await supabase.from('campaigns').update({
                    lead_count: campaign.leadCount + 1
                }).eq('id', lead.campaignId);
            }

            setAllLeads(prev => [lead, ...prev]);
            setCampaigns(prev => prev.map(c => 
                c.id === lead.campaignId ? { ...c, leadCount: c.leadCount + 1 } : c
            ));
        } catch (error) {
            console.error('Error adding lead:', error);
            alert('Failed to add lead. Please try again.');
        }
    };
    
    const handleBulkAddLeads = async (leads: Lead[], campaignId: string) => {
        if (!userId || leads.length === 0) return;
        try {
            await supabase.from('leads').insert(
                leads.map(l => ({
                    id: l.id,
                    user_id: userId,
                    campaign_id: campaignId,
                    name: l.name,
                    company: l.company,
                    phone: l.phone,
                    email: l.email || null,
                    address: l.address || null,
                    website: l.website || null,
                    rating: l.rating || null,
                    reviews: l.reviews || null,
                    summary: l.summary || null,
                    status: l.status,
                }))
            );
            const campaign = campaigns.find(c => c.id === campaignId);
            if (campaign) {
                await supabase.from('campaigns').update({
                    lead_count: campaign.leadCount + leads.length,
                }).eq('id', campaignId);
            }
            setAllLeads(prev => [...leads, ...prev]);
            setCampaigns(prev => prev.map(c =>
                c.id === campaignId ? { ...c, leadCount: c.leadCount + leads.length } : c
            ));
        } catch (error) {
            console.error('Error bulk adding leads:', error);
            throw error;
        }
    };

    const handleRecordDemo = async (leadId: string) => {
        if (!userId) return;
        const today = formatLocalDate(new Date());
        const demoEvent: DemoEvent = {
            id: `demo-${Date.now()}`,
            leadId,
            date: today
        };

        try {
            await supabase.from('demo_events').insert({
                id: demoEvent.id,
                user_id: userId,
                lead_id: leadId,
                date: today
            });
            setDemoEvents(prev => [...prev, demoEvent]);
        } catch (error) {
            console.error('Error recording demo:', error);
        }
    };

    const handleRemoveDemoEvents = async (leadId: string) => {
        if (!userId) return;
        try {
            await supabase.from('demo_events').delete().eq('lead_id', leadId);
            setDemoEvents(prev => prev.filter(e => e.leadId !== leadId));
        } catch (error) {
            console.error('Error removing demo events:', error);
        }
    };

    const handleUpdateLead = async (updatedLead: Lead) => {
        try {
            const oldLead = allLeads.find(l => l.id === updatedLead.id);
            await supabase.from('leads').update({
                name: updatedLead.name,
                company: updatedLead.company,
                phone: updatedLead.phone,
                email: updatedLead.email || null,
                address: updatedLead.address || null,
                website: updatedLead.website || null,
                rating: updatedLead.rating || null,
                reviews: updatedLead.reviews || null,
                summary: updatedLead.summary || null,
                status: updatedLead.status
            }).eq('id', updatedLead.id);

            // Update local state immediately
            setAllLeads(prev => prev.map(l => l.id === updatedLead.id ? { ...updatedLead } : l));

            if (oldLead && oldLead.status !== 'Demo Booked' && updatedLead.status === 'Demo Booked') {
                await handleRecordDemo(updatedLead.id);
            }
            if (oldLead && oldLead.status === 'Demo Booked' && updatedLead.status !== 'Demo Booked') {
                await handleRemoveDemoEvents(updatedLead.id);
            }
        } catch (error) {
            console.error('Error updating lead:', error);
            alert('Failed to update lead. Please try again.');
        }
    };

    const handleDeleteLead = async (leadId: string) => {
        const leadToDelete = allLeads.find(l => l.id === leadId);
        if (!leadToDelete) return;
        try {
            await supabase.from('leads').delete().eq('id', leadId);
            const campaign = campaigns.find(c => c.id === leadToDelete.campaignId);
            if (campaign) {
                await supabase.from('campaigns').update({
                    lead_count: Math.max(0, campaign.leadCount - 1)
                }).eq('id', leadToDelete.campaignId);
            }
            setAllLeads(prev => prev.filter(l => l.id !== leadId));
            setCampaigns(prev => prev.map(c => 
                c.id === leadToDelete.campaignId ? { ...c, leadCount: Math.max(0, c.leadCount - 1) } : c
            ));
        } catch (error) {
            console.error('Error deleting lead:', error);
            alert('Failed to delete lead. Please try again.');
        }
    };


    const handleMoveLeads = async (leadIds: string[], targetCampaignId: string) => {
        if (!userId) return;
        try {
            await supabase.from('leads').update({ campaign_id: targetCampaignId }).in('id', leadIds);

            const sourceCampaignId = allLeads.find(l => leadIds.includes(l.id))?.campaignId;

            // Update local leads state first
            const updatedLeads = allLeads.map(l =>
                leadIds.includes(l.id) ? { ...l, campaignId: targetCampaignId } : l
            );
            setAllLeads(updatedLeads);

            // Recount from actual lead data instead of using stale leadCount
            setCampaigns(prev => prev.map(c => {
                const actualCount = updatedLeads.filter(l => l.campaignId === c.id).length;
                return { ...c, leadCount: actualCount };
            }));

            // Also fix the target campaign count in Supabase
            const newTargetCount = updatedLeads.filter(l => l.campaignId === targetCampaignId).length;
            await supabase.from('campaigns').update({ lead_count: newTargetCount }).eq('id', targetCampaignId);

            if (sourceCampaignId) {
                const newSourceCount = updatedLeads.filter(l => l.campaignId === sourceCampaignId).length;
                await supabase.from('campaigns').update({ lead_count: newSourceCount }).eq('id', sourceCampaignId);
            }

        } catch (error) {
            console.error('Error moving leads:', error);
            alert('Failed to move leads. Please try again.');
        }
    };

    const handleAddClient = async (client: Client) => {
        if (!userId) return;
        try {
            await supabase.from('clients').insert({
                id: client.id,
                user_id: userId,
                name: client.name,
                company: client.company,
                close_date: client.closeDate,
                upfront_value: client.upfrontValue,
                monthly_value: client.monthlyValue,
                monthly_retainer_date: client.monthlyRetainerDate || null,
                status: client.status
            });
            setClients(prev => [client, ...prev]);
        } catch (error) {
            console.error('Error adding client:', error);
            alert('Failed to add client. Please try again.');
        }
    };

    const handleUpdateClient = async (updatedClient: Client) => {
        try {
            await supabase.from('clients').update({
                name: updatedClient.name,
                company: updatedClient.company,
                close_date: updatedClient.closeDate,
                upfront_value: updatedClient.upfrontValue,
                monthly_value: updatedClient.monthlyValue,
                monthly_retainer_date: updatedClient.monthlyRetainerDate || null,
                status: updatedClient.status
            }).eq('id', updatedClient.id);
            setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
        } catch (error) {
            console.error('Error updating client:', error);
            alert('Failed to update client. Please try again.');
        }
    };

    const handleDeleteClient = async (clientId: string) => {
        try {
            await supabase.from('clients').delete().eq('id', clientId);
            setClients(prev => prev.filter(c => c.id !== clientId));
        } catch (error) {
            console.error('Error deleting client:', error);
            alert('Failed to delete client. Please try again.');
        }
    };

    const handleDeleteCampaign = async (campaignId: string) => {
        try {
            await supabase.from('campaigns').delete().eq('id', campaignId);
            setCampaigns(prev => prev.filter(c => c.id !== campaignId));
            setAllLeads(prev => prev.filter(l => l.campaignId !== campaignId));
        } catch (error) {
            console.error('Error deleting campaign:', error);
            alert('Failed to delete campaign. Please try again.');
        }
    };

    const handleRenameCampaign = async (campaignId: string, newName: string) => {
        try {
            await supabase.from('campaigns').update({ name: newName }).eq('id', campaignId);
            setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, name: newName } : c));
        } catch (error) {
            console.error('Error renaming campaign:', error);
            alert('Failed to rename campaign. Please try again.');
        }
    };

    const handleRecordDial = async (leadId: string | null) => {
    console.log('📞 handleRecordDial called with leadId:', leadId);
    console.log('👤 Current userId:', userId);
    
    if (!userId) {
        console.log('❌ No userId - aborting dial record');
        return;
    }

    const today = formatLocalDate(new Date());
    console.log('📅 Today date:', today);
    console.log('📅 Formatted today date:', today);
    console.log('📅 typeof today:', typeof today);
    
    try {
        const { data, error } = await supabase
            .from('dials')
            .insert({
                user_id: userId,
                lead_id: leadId,
                date: today
            })
            .select()
            .single();

        console.log('💾 Supabase response:', { data, error });

        if (error) throw error;

        const newDial: Dial = {
            id: data.id,
            userId: data.user_id,
            date: data.date,
            timestamp: data.created_at,
            leadId: data.lead_id
        };
        
        console.log('✅ New dial created:', newDial);
        console.log('📊 Current dials state BEFORE update:', dials);
        
        setDials(prev => {
            const updated = [...prev, newDial];
            console.log('📊 Dials state AFTER update:', updated);
            return updated;
        });
        
    } catch (error) {
        console.error('❌ Error recording dial:', error);
    }
};

    const handleUpdateLeadStatus = async (leadId: string, newStatus: string) => {
        try {
            const oldLead = allLeads.find(l => l.id === leadId);
            await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);
            
            // Update local state immediately
            setAllLeads(prev => prev.map(lead =>
                lead.id === leadId ? { ...lead, status: newStatus } : lead
            ));

            if (oldLead && oldLead.status !== 'Demo Booked' && newStatus === 'Demo Booked') {
                await handleRecordDemo(leadId);
            }
            if (oldLead && oldLead.status === 'Demo Booked' && newStatus !== 'Demo Booked') {
                await handleRemoveDemoEvents(leadId);
            }
        } catch (error) {
            console.error('Error updating lead status:', error);
            alert('Failed to update lead status. Please try again.');
        }
    };

    const handleViewNavigation = (view: CRMView, leadId?: string, campaignId?: string) => {
        setNavContext({ leadId, campaignId });
        setCurrentView(view);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        onLogout();
    };

    const latestMessages = [
        { id: '1', leadName: 'Sarah Connor', text: 'Yes, I spoke to the team. We are ready.', time: '2m ago' },
        { id: '2', leadName: 'John Wick', text: 'Can we move the demo to 3 PM?', time: '15m ago' },
        { id: '3', leadName: 'Tony Stark', text: 'The automation workflow looks perfect.', time: '1h ago' },
        { id: '4', leadName: 'Bruce Wayne', text: 'Send over the updated contract.', time: '3h ago' },
    ];

    const navGroups = [
        {
            label: 'Core',
            items: [
                { id: 'dashboard',     icon: LayoutDashboard, label: 'Dashboard'    },
                { id: 'leads',         icon: Users,           label: 'Leads'        },
                { id: 'dialer',        icon: Phone,           label: 'Dialer'       },
            ],
        },
        {
            label: 'Tools',
            items: [
                { id: 'conversations', icon: MapPin,          label: 'Lead Scraper' },
                { id: 'analytics',     icon: BarChart3,       label: 'Analytics'    },
                { id: 'recordings',    icon: Radio,           label: 'Recordings'   },
            ],
        },
        {
            label: 'Manage',
            items: [
                { id: 'clients',       icon: Briefcase,       label: 'Clients'      },
                { id: 'automations',   icon: KeyRound,        label: 'Credentials'  },
                { id: 'motivation',    icon: Zap,             label: 'Motivation'   },
            ],
        },
    ];

    if (isLoading) {
        return (
            <div className="flex h-screen bg-[#131317] items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-[#CD3D35] animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">Loading CortexaOS...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#131317] text-white overflow-hidden font-sans">
            <motion.div
                className="relative bg-[#040405] border-r border-white/8 flex flex-col z-20 overflow-hidden"
                initial={{ width: 260 }}
                animate={{ width: isSidebarOpen ? 260 : 72 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* Subtle red glow behind logo */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#CD3D35]/8 to-transparent pointer-events-none" />

                {/* Header */}
                <div className="relative flex items-center gap-3 px-4 py-5 border-b border-white/6">
                    <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center p-1">
                        <img src="/favicon.png" alt="CortexaOS" className="w-full h-full object-contain" />
                    </div>
                    {isSidebarOpen && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
                            <p className="font-display font-bold text-sm text-white leading-tight tracking-wide">CortexaOS</p>
                            <p className="text-[10px] text-gray-600 leading-tight mt-0.5">Client Management</p>
                        </motion.div>
                    )}
                </div>

                {/* Nav groups */}
                <div className="flex-1 py-3 px-2.5 overflow-y-auto crm-scroll space-y-0.5">
                    {navGroups.map((group, gi) => (
                        <div key={gi} className={gi > 0 ? 'mt-1' : ''}>
                            {/* Section label */}
                            {isSidebarOpen && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-[9px] font-bold text-gray-700 uppercase tracking-[0.18em] px-3 pt-3 pb-1.5 select-none"
                                >
                                    {group.label}
                                </motion.p>
                            )}
                            {!isSidebarOpen && gi > 0 && (
                                <div className="my-2 mx-3 h-px bg-white/6" />
                            )}
                            {group.items.map((item) => {
                                const active = currentView === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => { setNavContext({}); setCurrentView(item.id as CRMView); }}
                                        title={!isSidebarOpen ? item.label : undefined}
                                        className={`relative w-full flex items-center gap-3 rounded-xl transition-all duration-200 group
                                            ${isSidebarOpen ? 'px-3 py-2.5' : 'px-0 py-2.5 justify-center'}
                                            ${active
                                                ? 'bg-[#CD3D35]/10 text-white'
                                                : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                                            }`}
                                    >
                                        {/* Left accent bar */}
                                        {active && (
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#CD3D35] rounded-full" />
                                        )}
                                        <item.icon
                                            size={17}
                                            className={active ? 'text-[#CD3D35] shrink-0' : 'shrink-0 transition-colors group-hover:text-gray-200'}
                                        />
                                        {isSidebarOpen && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.04 }}
                                                className={`whitespace-nowrap text-[13px] ${active ? 'font-semibold' : 'font-normal'}`}
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Sign out */}
                <div className="px-2.5 py-3 border-t border-white/6">
                    <button
                        onClick={handleLogout}
                        title={!isSidebarOpen ? 'Sign Out' : undefined}
                        className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-gray-600 hover:text-red-400 hover:bg-red-500/8 transition-all group ${!isSidebarOpen ? 'justify-center' : ''}`}
                    >
                        <LogOut size={16} className="shrink-0 group-hover:text-red-400 transition-colors" />
                        {isSidebarOpen && (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[13px]">
                                Sign Out
                            </motion.span>
                        )}
                    </button>
                </div>
            </motion.div>

            <div className="flex-1 flex flex-col min-w-0 bg-[#131317]">
                <header className="h-16 bg-[#131317]/90 backdrop-blur-md border-b border-white/8 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="text-base font-bold text-white capitalize tracking-wide">{currentView}</h2>
                    <div className="flex items-center gap-5">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-white/5 border border-white/8 rounded-full pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-[#CD3D35]/50 w-56 transition-colors placeholder-gray-600"
                            />
                        </div>

                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-[#CD3D35]/10 text-[#CD3D35]' : 'text-gray-500 hover:text-white'}`}
                            >
                                <Bell size={18} />
                                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#CD3D35] rounded-full" />
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-80 bg-[#040405] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-white/8 flex items-center justify-between">
                                            <h3 className="font-bold text-sm text-white">Recent Messages</h3>
                                            <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-white transition-colors">
                                                <X size={14} />
                                            </button>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto crm-scroll">
                                            {latestMessages.map((msg) => (
                                                <div
                                                    key={msg.id}
                                                    onClick={() => {
                                                        const lead = allLeads.find(l => l.name === msg.leadName);
                                                        handleViewNavigation('conversations', lead?.id, lead?.campaignId);
                                                        setShowNotifications(false);
                                                    }}
                                                    className="p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="font-bold text-xs text-white">{msg.leadName}</span>
                                                        <span className="text-[10px] text-gray-600 flex items-center gap-1">
                                                            <Clock size={10} /> {msg.time}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-500 line-clamp-2 italic">"{msg.text}"</p>
                                                </div>
                                            ))}
                                            {latestMessages.length === 0 && (
                                                <div className="p-8 text-center text-gray-600 text-xs italic">
                                                    No recent messages.
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => { setCurrentView('conversations'); setShowNotifications(false); }}
                                            className="w-full p-3 text-[10px] font-bold text-[#CD3D35] hover:bg-[#CD3D35]/5 transition-colors border-t border-white/8 tracking-widest"
                                        >
                                            VIEW ALL CONVERSATIONS
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-[#CD3D35]/20 border border-[#CD3D35]/30 flex items-center justify-center text-xs font-bold text-[#CD3D35]">
                            AK
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 crm-scroll relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentView}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            
                            {currentView === 'dashboard' && (
                                <DashboardHome 
                                    clients={clients} 
                                    demoEvents={demoEvents} 
                                    allLeads={allLeads} 
                                    dials={dials} // <--- ADD THIS LINE
                                />
                            )}
                            {currentView === 'leads' && (
                                <Leads 
                                    campaigns={campaigns} 
                                    allLeads={allLeads} 
                                    onAddCampaign={handleAddCampaign}
                                    onDeleteCampaign={handleDeleteCampaign}
                                    onRenameCampaign={handleRenameCampaign}
                                    onAddLead={handleAddLead}
                                    onUpdateLead={handleUpdateLead}
                                    onDeleteLead={handleDeleteLead}
                                    onNavigate={handleViewNavigation}
                                    onMoveLeads={handleMoveLeads}

                                />
                            )}
                            {currentView === 'dialer' && (
                                <Dialer 
                                    campaigns={campaigns} 
                                    allLeads={allLeads} 
                                    onUpdateLeadStatus={handleUpdateLeadStatus}
                                    onUpdateLead={handleUpdateLead}
                                    onRecordDial={handleRecordDial}
                                    initialLeadId={navContext.leadId}
                                    initialCampaignId={navContext.campaignId}
                                />
                            )}
                            {currentView === 'recordings' && <Recordings campaigns={campaigns} />}
                            {currentView === 'conversations' && (
                                <Scraper
                                    campaigns={campaigns}
                                    onAddCampaign={handleAddCampaign}
                                    onBulkAddLeads={handleBulkAddLeads}
                                />
                            )}
                            {currentView === 'clients' && (
                                <Clients 
                                    clients={clients} 
                                    onAddClient={handleAddClient}
                                    onUpdateClient={handleUpdateClient}
                                    onDeleteClient={handleDeleteClient}
                                />
                            )}
                            {currentView === 'analytics' && <Analytics />}
                            {currentView === 'automations' && <Credentials />}
                            {currentView === 'motivation' && <Motivation />}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default CRM;