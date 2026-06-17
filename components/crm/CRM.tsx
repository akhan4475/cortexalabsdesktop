import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Phone, MapPin, Briefcase, KeyRound, BarChart3, LogOut,
  Search, Bell, Loader2, X, Clock, Radio, Zap, Terminal,
  Brain, DollarSign, GitBranch, Sparkles, LayoutTemplate, Activity,
  Archive, Package, Monitor, Lightbulb, Mic, PanelLeft, ChevronRight, BookOpen,
  Users, MessageSquare, Megaphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

// Core
import DashboardHome from './DashboardHome';
import Dialer from './Dialer';
import Scraper from './Scraper';
import Clients from './Clients';
import Analytics from './Analytics';
import Credentials from './Credentials';
import Recordings from './Recordings';
import Motivation from './Motivation';
import Memory from './Memory';
import Docs from './Docs';
// New views
import Pipeline from './Pipeline';
import DMSender from './DMSender';
import Studio from './Studio';
import ScriptBoard from './ScriptBoard';
import Library from './Library';
import Radar from './Radar';
import Builds from './Builds';
import Mockups from './Mockups';
import Insights from './Insights';
import Revenue from './Revenue';
import Marketing from './Marketing';
import AIWTerminal from './AIWTerminal';
import Leads from './Leads';

import { Lead, Campaign, Client, DemoEvent, Dial } from './types';

// ── Error boundary so a crashed tab never blanks the whole dashboard ──────────
class TabErrorBoundary extends React.Component<
  { children: React.ReactNode; label: string },
  { error: string | null }
> {
  constructor(props: any) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e: any) { return { error: e?.message ?? String(e) }; }
  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-3 p-8 text-center">
          <p className="text-sm text-[#555] font-medium">{this.props.label} failed to load</p>
          <p className="text-[11px] text-red-400/60 font-mono max-w-md break-all">{this.state.error}</p>
          <button
            onClick={() => this.setState({ error: null })}
            className="px-4 py-2 text-[11px] bg-[#141414] border border-[#2A2A2A] rounded-lg text-[#909090] hover:text-white transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const isDesktop = typeof window !== 'undefined' && (
  (window as any).electronAPI?.isDesktop === true ||
  (window as any).__ELECTRON__ === true
);

interface CRMProps {
    onLogout: () => void;
}

export type CRMView =
  | 'dashboard'
  | 'pipeline' | 'dialer' | 'dmsender' | 'scraper'
  | 'studio' | 'scriptboard' | 'radar' | 'library'
  | 'terminal' | 'builds' | 'mockups'
  | 'memory' | 'insights'
  | 'revenue' | 'analytics' | 'clients' | 'marketing'
  | 'recordings' | 'credentials' | 'motivation' | 'docs'
  // legacy compat
  | 'leads' | 'conversations' | 'automations' | 'content' | 'factory' | 'claude';

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
                    leadCount: c.lead_count,
                    niche: c.niche ?? undefined,
                    campaignType: c.campaign_type ?? undefined,
                })));
            }

            if (leadsData.data) {
                // Normalize legacy disposition strings to pipeline stage IDs
                const NORMALIZE_MAP: Record<string, string> = {
                    'New Lead':           'prospect',
                    'Demo Booked':        'demo_booked',
                    'Interested':         'demo_booked',
                    'Follow-up Required': 'follow_up',
                    'Voicemail':          'voicemail',
                    'Not Interested':     'lost',
                    'Wrong Number':       'lost',
                    'Client':             'paid',
                    'Closed':             'paid',
                    'Not Called':         'prospect',
                };

                const processedLeads = leadsData.data.map(l => ({
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
                    icpScore: l.icp_score ?? undefined,
                    niche: l.niche ?? undefined,
                    status: NORMALIZE_MAP[l.status] ?? l.status,
                }));

                setAllLeads(processedLeads);

                // Persist any normalizations back to Supabase in the background
                processedLeads.forEach((lead, i) => {
                    const raw = leadsData.data![i].status;
                    if (NORMALIZE_MAP[raw]) {
                        supabase.from('leads').update({ status: lead.status }).eq('id', lead.id).then();
                    }
                });
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
                        icp_score: l.icpScore ?? null,
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
                icp_score: lead.icpScore ?? null,
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
                    icp_score: l.icpScore ?? null,
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

            // Pipeline: auto-move linked lead to 'paid' based on closeDate
            if (client.leadId) {
                const today = formatLocalDate(new Date());
                if (client.closeDate <= today) {
                    // Payment date is today or past — move immediately
                    await handleUpdateLeadStatus(client.leadId, 'paid');
                } else {
                    // Payment in the future — schedule it
                    const pending = JSON.parse(localStorage.getItem('aiw_scheduled_paid') || '[]') as { leadId: string; paymentDate: string }[];
                    pending.push({ leadId: client.leadId, paymentDate: client.closeDate });
                    localStorage.setItem('aiw_scheduled_paid', JSON.stringify(pending));
                }
            }
        } catch (error) {
            console.error('Error adding client:', error);
            alert('Failed to add client. Please try again.');
        }
    };

    // Check scheduled payments on load
    useEffect(() => {
        if (!allLeads.length) return;
        const today = formatLocalDate(new Date());
        const pending = JSON.parse(localStorage.getItem('aiw_scheduled_paid') || '[]') as { leadId: string; paymentDate: string }[];
        if (!pending.length) return;
        const remaining: typeof pending = [];
        pending.forEach(({ leadId, paymentDate }) => {
            if (paymentDate <= today) {
                handleUpdateLeadStatus(leadId, 'paid');
            } else {
                remaining.push({ leadId, paymentDate });
            }
        });
        localStorage.setItem('aiw_scheduled_paid', JSON.stringify(remaining));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allLeads.length]);

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

    const handleLeadPaid = async (leadId: string, upfront: number, monthly: number) => {
        const lead = allLeads.find(l => l.id === leadId);
        if (!lead || !userId) return;
        const client: Client = {
            id: crypto.randomUUID(),
            name: lead.name,
            company: lead.company,
            closeDate: formatLocalDate(new Date()),
            upfrontValue: upfront,
            monthlyValue: monthly,
            status: 'active'
        };
        await handleAddClient(client);
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
            label: '',
            items: [
                { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            ],
        },
        {
            label: 'Sales',
            items: [
                { id: 'pipeline',  icon: GitBranch,     label: 'Pipeline'     },
                { id: 'leads',     icon: Users,         label: 'Leads'        },
                { id: 'dialer',    icon: Phone,         label: 'Dialer'       },
                { id: 'dmsender',  icon: MessageSquare, label: 'DM Sender'    },
                { id: 'scraper',   icon: MapPin,        label: 'Scraper'      },
            ],
        },
        {
            label: 'Content',
            items: [
                { id: 'studio',     icon: Sparkles,       label: 'Studio'      },
                { id: 'scriptboard',icon: LayoutTemplate, label: 'Script Board'},
                { id: 'radar',      icon: Activity,       label: 'Radar'       },
                { id: 'library',    icon: Archive,        label: 'Library'     },
            ],
        },
        {
            label: 'Factory',
            items: [
                { id: 'terminal',   icon: Terminal,  label: 'AIW Terminal' },
                { id: 'builds',     icon: Package,   label: 'Builds'       },
                { id: 'mockups',    icon: Monitor,   label: 'Mockups'      },
            ],
        },
        {
            label: 'Intelligence',
            items: [
                { id: 'memory',    icon: Brain,      label: 'Memory'   },
                { id: 'insights',  icon: Lightbulb,  label: 'Insights' },
            ],
        },
        {
            label: 'Business',
            items: [
                { id: 'revenue',   icon: DollarSign, label: 'Revenue'   },
                { id: 'analytics', icon: BarChart3,  label: 'Analytics' },
                { id: 'clients',   icon: Briefcase,  label: 'Clients'   },
                { id: 'marketing', icon: Megaphone,  label: 'Marketing' },
            ],
        },
        {
            label: 'System',
            items: [
                { id: 'recordings',  icon: Mic,      label: 'Recordings'  },
                { id: 'credentials', icon: KeyRound, label: 'Credentials' },
                { id: 'motivation',  icon: Zap,      label: 'Motivation'  },
                { id: 'docs',        icon: BookOpen, label: 'Docs'        },
            ],
        },
    ];

    const viewTitles: Record<string, string> = {
        dashboard: 'Dashboard', pipeline: 'Pipeline', dialer: 'Dialer',
        dmsender: 'DM Sender', scraper: 'Lead Scraper', studio: 'Studio', scriptboard: 'Script Board',
        radar: 'Radar', library: 'Library', terminal: 'AIW Terminal',
        leads: 'Leads',
        builds: 'Builds', mockups: 'Mockups', memory: 'Memory',
        insights: 'Insights', revenue: 'Revenue', analytics: 'Analytics',
        clients: 'Clients', marketing: 'Marketing', recordings: 'Recordings', credentials: 'Credentials',
        motivation: 'Motivation', docs: 'Docs',
    };

    if (isLoading) {
        return (
            <div className="flex h-screen bg-[#0A0A0A] items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-[#CD3D35] animate-spin mx-auto mb-3" />
                    <p className="text-[#555] text-xs font-mono">Loading CortexaOS...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#0A0A0A] text-[#F2F2F2] overflow-hidden font-sans">
            {/* ── Sidebar ─────────────────────────────── */}
            <motion.div
                className="relative bg-[#0A0A0A] border-r border-[#1A1A1A] flex flex-col z-20 overflow-hidden shrink-0"
                initial={{ width: 220 }}
                animate={{ width: isSidebarOpen ? 220 : 56 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* Logo row */}
                <div className="relative flex items-center gap-2.5 px-3.5 h-12 border-b border-[#1A1A1A] shrink-0">
                    <div
                        className={`w-6 h-6 rounded bg-[#1E1E1E] border border-[#2A2A2A] overflow-hidden shrink-0 flex items-center justify-center transition-colors ${!isSidebarOpen ? 'cursor-pointer hover:border-[#CD3D35]/60' : ''}`}
                        onClick={() => { if (!isSidebarOpen) setIsSidebarOpen(true); }}
                        title={!isSidebarOpen ? 'Expand sidebar' : undefined}
                    >
                        <img src="/favicon.png" alt="" className="w-full h-full object-contain" />
                    </div>
                    {isSidebarOpen && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.04 }}>
                            <p className="font-semibold text-xs text-[#F2F2F2] leading-tight tracking-wide">CortexaOS</p>
                        </motion.div>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(o => !o)}
                        className={`ml-auto p-1 rounded text-[#555] hover:text-[#909090] hover:bg-[#1E1E1E] transition-colors ${!isSidebarOpen ? 'mx-auto' : ''}`}
                    >
                        <PanelLeft size={13} />
                    </button>
                </div>

                {/* Nav */}
                <div className="flex-1 py-2 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                    {navGroups.map((group, gi) => (
                        <div key={gi} className={gi > 0 ? 'mt-1' : ''}>
                            {isSidebarOpen && group.label && (
                                <motion.p
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="text-[9px] font-semibold text-[#383838] uppercase tracking-[0.2em] px-3.5 pt-3 pb-1 select-none"
                                >
                                    {group.label}
                                </motion.p>
                            )}
                            {!isSidebarOpen && gi > 0 && group.label && (
                                <div className="my-1.5 mx-3 h-px bg-[#1A1A1A]" />
                            )}
                            {group.items.map((item) => {
                                const active = currentView === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => { setNavContext({}); setCurrentView(item.id as CRMView); }}
                                        title={!isSidebarOpen ? item.label : undefined}
                                        className={`relative w-full flex items-center gap-2.5 transition-colors duration-150 group
                                            ${isSidebarOpen ? 'px-3 py-1.5 mx-1.5' : 'px-0 py-2 justify-center'}
                                            ${isSidebarOpen ? 'rounded-md w-[calc(100%-12px)]' : 'w-full'}
                                            ${active
                                                ? 'bg-[#CD3D35]/10 text-[#F2F2F2]'
                                                : 'text-[#555] hover:text-[#909090] hover:bg-[#141414]'
                                            }`}
                                    >
                                        {active && isSidebarOpen && (
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[#CD3D35] rounded-full" />
                                        )}
                                        <item.icon
                                            size={14}
                                            className={`shrink-0 ${active ? 'text-[#CD3D35]' : 'text-current'}`}
                                        />
                                        {isSidebarOpen && (
                                            <motion.span
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.03 }}
                                                className={`text-[12px] whitespace-nowrap ${active ? 'font-medium text-[#F2F2F2]' : ''}`}
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
                <div className="px-1.5 py-2 border-t border-[#1A1A1A]">
                    <button
                        onClick={handleLogout}
                        title={!isSidebarOpen ? 'Sign Out' : undefined}
                        className={`w-full flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[#555] hover:text-red-400 hover:bg-red-500/8 transition-all group ${!isSidebarOpen ? 'justify-center' : ''}`}
                    >
                        <LogOut size={13} className="shrink-0" />
                        {isSidebarOpen && (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[12px]">
                                Sign Out
                            </motion.span>
                        )}
                    </button>
                </div>
            </motion.div>

            {/* ── Main ────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-12 bg-[#0A0A0A] border-b border-[#1A1A1A] flex items-center justify-between px-5 shrink-0 z-10">
                    <h2 className="text-sm font-semibold text-[#F2F2F2]">
                        {viewTitles[currentView] ?? currentView}
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#555] w-3 h-3" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-[#141414] border border-[#2A2A2A] rounded pl-7 pr-3 py-1 text-xs text-[#F2F2F2] focus:outline-none focus:border-[#CD3D35]/40 w-44 placeholder-[#555] transition-colors"
                            />
                        </div>
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`relative p-1.5 rounded transition-colors ${showNotifications ? 'bg-[#CD3D35]/10 text-[#CD3D35]' : 'text-[#555] hover:text-[#909090]'}`}
                            >
                                <Bell size={14} />
                                <span className="absolute top-1.5 right-1.5 w-1 h-1 bg-[#CD3D35] rounded-full" />
                            </button>
                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                        transition={{ duration: 0.12 }}
                                        className="absolute right-0 mt-1.5 w-72 bg-[#141414] border border-[#2A2A2A] rounded-lg shadow-2xl z-50 overflow-hidden"
                                    >
                                        <div className="p-3 border-b border-[#2A2A2A] flex items-center justify-between">
                                            <span className="text-xs font-semibold text-[#F2F2F2]">Notifications</span>
                                            <button onClick={() => setShowNotifications(false)} className="text-[#555] hover:text-[#909090]"><X size={12} /></button>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {latestMessages.map((msg) => (
                                                <div key={msg.id} className="p-3 border-b border-[#1A1A1A] hover:bg-[#1E1E1E] cursor-pointer transition-colors">
                                                    <div className="flex justify-between items-start mb-0.5">
                                                        <span className="text-xs font-medium text-[#F2F2F2]">{msg.leadName}</span>
                                                        <span className="text-[10px] text-[#555] flex items-center gap-1"><Clock size={9} />{msg.time}</span>
                                                    </div>
                                                    <p className="text-[11px] text-[#909090] line-clamp-1">{msg.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-[#CD3D35]/15 border border-[#CD3D35]/25 flex items-center justify-center text-[10px] font-bold text-[#CD3D35]">
                            AK
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-[#0A0A0A] relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentView}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="h-full"
                        >
                            {currentView === 'dashboard' && (
                                <DashboardHome clients={clients} demoEvents={demoEvents} allLeads={allLeads} dials={dials} />
                            )}
                            {/* Sales */}
                            {currentView === 'pipeline' && (
                                <Pipeline
                                    campaigns={campaigns}
                                    allLeads={allLeads}
                                    onAddLead={handleAddLead}
                                    onUpdateLead={handleUpdateLead}
                                    onDeleteLead={handleDeleteLead}
                                    onUpdateLeadStatus={handleUpdateLeadStatus}
                                    onNavigate={handleViewNavigation}
                                    onLeadPaid={handleLeadPaid}
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
                            {currentView === 'dmsender' && (
                                <DMSender
                                    campaigns={campaigns}
                                    allLeads={allLeads}
                                    onUpdateLeadStatus={handleUpdateLeadStatus}
                                    onAddLead={handleAddLead}
                                    onAddCampaign={handleAddCampaign}
                                />
                            )}
                            {(currentView === 'scraper' || currentView === 'conversations') && (
                                <Scraper campaigns={campaigns} onAddCampaign={handleAddCampaign} onBulkAddLeads={handleBulkAddLeads} />
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
                            {/* Content */}
                            {currentView === 'studio' && <Studio />}
                            {currentView === 'scriptboard' && <ScriptBoard />}
                            {currentView === 'radar' && <Radar />}
                            {currentView === 'library' && <Library />}
                            {/* Factory */}
                            {currentView === 'terminal' && <TabErrorBoundary label="AIW Terminal"><AIWTerminal /></TabErrorBoundary>}
                            {currentView === 'builds' && (
                                <Builds
                                    campaigns={campaigns}
                                    allLeads={allLeads}
                                    onUpdateLeadStatus={handleUpdateLeadStatus}
                                    onUpdateLead={handleUpdateLead}
                                />
                            )}
                            {currentView === 'mockups' && <Mockups allLeads={allLeads} onUpdateLeadStatus={handleUpdateLeadStatus} />}
                            {/* Intelligence */}
                            {currentView === 'memory' && <Memory />}
                            {currentView === 'insights' && <Insights allLeads={allLeads} clients={clients} />}
                            {/* Business */}
                            {currentView === 'revenue' && <Revenue clients={clients} />}
                            {currentView === 'analytics' && <Analytics allLeads={allLeads} clients={clients} dials={dials} />}
                            {currentView === 'clients' && (
                                <Clients
                                    clients={clients}
                                    allLeads={allLeads}
                                    onAddClient={handleAddClient}
                                    onUpdateClient={handleUpdateClient}
                                    onDeleteClient={handleDeleteClient}
                                />
                            )}
                            {currentView === 'marketing' && <Marketing />}
                            {/* System */}
                            {currentView === 'recordings' && <Recordings campaigns={campaigns} />}
                            {(currentView === 'credentials' || currentView === 'automations') && <Credentials />}
                            {currentView === 'motivation' && <Motivation />}
                            {currentView === 'docs' && <Docs />}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default CRM;