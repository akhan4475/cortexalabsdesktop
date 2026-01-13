import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Users, Phone, MessageSquare, Briefcase, Settings, BarChart3, LogOut, Search, Bell, Loader2, X, Clock, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

// Sub Components
import DashboardHome from './DashboardHome';
import Leads from './Leads';
import Dialer from './Dialer';
import Conversations from './Conversations';
import Clients from './Clients';
import Analytics from './Analytics';
import Automations from './Automations';
import Recordings from './Recordings';
import { Lead, Campaign, Client, DemoEvent } from './types';

interface CRMProps {
    onLogout: () => void;
}

export type CRMView = 'dashboard' | 'leads' | 'dialer' | 'conversations' | 'clients' | 'automations' | 'analytics' | 'recordings';

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

    // Global CRM State - Starting with empty arrays (no demo data)
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [allLeads, setAllLeads] = useState<Lead[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [demoEvents, setDemoEvents] = useState<DemoEvent[]>([]);

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

            // Fetch all data
            const [campaignsData, leadsData, clientsData, demoEventsData] = await Promise.all([
                supabase.from('campaigns').select('*').eq('user_id', user.id).order('created_timestamp', { ascending: false }),
                supabase.from('leads').select('*').eq('user_id', user.id).order('created_timestamp', { ascending: false }),
                supabase.from('clients').select('*').eq('user_id', user.id).order('created_timestamp', { ascending: false }),
                supabase.from('demo_events').select('*').eq('user_id', user.id).order('created_timestamp', { ascending: false })
            ]);

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

        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddCampaign = async (campaign: Campaign, leads: Lead[]) => {
        if (!userId) return;

        try {
            // Insert campaign
            await supabase.from('campaigns').insert({
                id: campaign.id,
                user_id: userId,
                name: campaign.name,
                created_at: campaign.createdAt,
                lead_count: campaign.leadCount
            });

            // Insert leads
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

            // Update campaign lead count
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

    const handleRecordDemo = async (leadId: string) => {
        if (!userId) return;

        // Use TODAY's date (local timezone) when a demo is BOOKED
        const today = formatLocalDate(new Date());
        
        console.log('Recording demo for today:', today); // Debug log

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

            // Update local state immediately
            setDemoEvents(prev => [...prev, demoEvent]);
            
            console.log('Demo recorded successfully:', demoEvent); // Debug log
        } catch (error) {
            console.error('Error recording demo:', error);
        }
    };

    const handleUpdateLead = async (updatedLead: Lead) => {
        try {
            // Get the old lead status before updating
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

            // Update local state first
            setAllLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));

            // If status changed TO 'Demo Booked' from something else, record the demo event for TODAY
            if (oldLead && oldLead.status !== 'Demo Booked' && updatedLead.status === 'Demo Booked') {
                await handleRecordDemo(updatedLead.id);
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

            // Update campaign lead count
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
            // Leads will be cascade deleted automatically
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

    const handleUpdateLeadStatus = async (leadId: string, newStatus: string) => {
        try {
            // Get the old lead status before updating
            const oldLead = allLeads.find(l => l.id === leadId);
            
            await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);

            // Update local state first
            setAllLeads(prev => prev.map(lead => 
                lead.id === leadId ? { ...lead, status: newStatus } : lead
            ));
            
            // If status changed TO 'Demo Booked' from something else, record demo for TODAY
            if (oldLead && oldLead.status !== 'Demo Booked' && newStatus === 'Demo Booked') {
                await handleRecordDemo(leadId);
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

    // Mock recent conversation messages for the notification popup
    const latestMessages = [
        { id: '1', leadName: 'Sarah Connor', text: 'Yes, I spoke to the team. We are ready.', time: '2m ago' },
        { id: '2', leadName: 'John Wick', text: 'Can we move the demo to 3 PM?', time: '15m ago' },
        { id: '3', leadName: 'Tony Stark', text: 'The automation workflow looks perfect.', time: '1h ago' },
        { id: '4', leadName: 'Bruce Wayne', text: 'Send over the updated contract.', time: '3h ago' },
    ];

    const navItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'leads', icon: Users, label: 'Leads' },
        { id: 'dialer', icon: Phone, label: 'Dialer' },
        { id: 'recordings', icon: Radio, label: 'Recordings' },
        { id: 'conversations', icon: MessageSquare, label: 'Conversations' },
        { id: 'analytics', icon: BarChart3, label: 'Analytics' },
        { id: 'clients', icon: Briefcase, label: 'Clients' },
        { id: 'automations', icon: Settings, label: 'Automations' },
    ];

    if (isLoading) {
        return (
            <div className="flex h-screen bg-[#000000] items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-horizon-accent animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#000000] text-white overflow-hidden font-sans">
            <motion.div 
                className="bg-[#09090b] border-r border-[#262624] flex flex-col z-20"
                initial={{ width: 260 }}
                animate={{ width: isSidebarOpen ? 260 : 80 }}
                transition={{ duration: 0.3 }}
            >
                <div className="h-16 flex items-center px-6 border-b border-[#262624]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-horizon-accent flex items-center justify-center shrink-0">
                            <span className="font-bold text-black text-xs">H</span>
                        </div>
                        {isSidebarOpen && (
                            <motion.span 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-display font-bold text-lg tracking-wide"
                            >
                                HORIZON
                            </motion.span>
                        )}
                    </div>
                </div>

                <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto crm-scroll">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setNavContext({});
                                setCurrentView(item.id as CRMView);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                                currentView === item.id 
                                ? 'bg-horizon-accent text-black font-semibold' 
                                : 'text-gray-400 hover:text-white hover:bg-[#262624]'
                            }`}
                        >
                            <item.icon size={20} className={currentView === item.id ? 'text-black' : 'text-gray-400 group-hover:text-white'} />
                            {isSidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="whitespace-nowrap"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-[#262624]">
                    <button 
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </motion.div>

            <div className="flex-1 flex flex-col min-w-0 bg-[#000000]">
                <header className="h-16 bg-[#000000]/80 backdrop-blur-md border-b border-[#262624] flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-white capitalize">{currentView}</h2>
                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                className="bg-[#18181b] border border-[#262624] rounded-full pl-10 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-horizon-accent w-64 transition-colors"
                            />
                        </div>
                        
                        <div className="relative" ref={notificationRef}>
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-horizon-accent/10 text-horizon-accent' : 'text-gray-400 hover:text-white'}`}
                            >
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-horizon-accent rounded-full border-2 border-black" />
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-80 bg-[#121214] border border-[#262624] rounded-2xl shadow-2xl z-50 overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-[#262624] flex items-center justify-between bg-[#18181b]">
                                            <h3 className="font-bold text-sm text-white">Recent Messages</h3>
                                            <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-white transition-colors">
                                                <X size={16} />
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
                                                    className="p-4 border-b border-[#262624] hover:bg-white/5 cursor-pointer transition-colors"
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="font-bold text-xs text-white">{msg.leadName}</span>
                                                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                                            <Clock size={10} /> {msg.time}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-400 line-clamp-2 italic">"{msg.text}"</p>
                                                </div>
                                            ))}
                                            {latestMessages.length === 0 && (
                                                <div className="p-8 text-center text-gray-500 text-xs italic">
                                                    No recent messages.
                                                </div>
                                            )}
                                        </div>
                                        <button 
                                            onClick={() => { setCurrentView('conversations'); setShowNotifications(false); }}
                                            className="w-full p-3 text-[10px] font-bold text-horizon-accent hover:bg-horizon-accent/5 transition-colors border-t border-[#262624]"
                                        >
                                            VIEW ALL CONVERSATIONS
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border border-white/10 flex items-center justify-center text-xs font-bold">
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
                            {currentView === 'dashboard' && <DashboardHome clients={clients} demoEvents={demoEvents} allLeads={allLeads} />}
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
                                />
                            )}
                            {currentView === 'dialer' && (
                                <Dialer 
                                    campaigns={campaigns} 
                                    allLeads={allLeads} 
                                    onUpdateLeadStatus={handleUpdateLeadStatus}
                                    initialLeadId={navContext.leadId}
                                    initialCampaignId={navContext.campaignId}
                                />
                            )}
                            {currentView === 'recordings' && <Recordings campaigns={campaigns} />}
                            {currentView === 'conversations' && (
                                <Conversations 
                                    campaigns={campaigns}
                                    allLeads={allLeads}
                                    initialLeadId={navContext.leadId}
                                    initialCampaignId={navContext.campaignId}
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
                            {currentView === 'automations' && <Automations />}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default CRM;