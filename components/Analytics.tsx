import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { ContainerScroll } from './ui/container-scroll-animation';
import { 
    LayoutDashboard, Users, PieChart, Settings, Bell, Search, 
    TrendingUp, ArrowUpRight, ArrowDownRight, MoreHorizontal,
    CheckCircle2, XCircle, Clock, Filter, Download, Mail, Phone, Calendar,
    Shield, Globe, Database, ToggleLeft, ToggleRight, Calculator
} from 'lucide-react';

const overviewData = [
  { name: 'Mon', manual: 4000, ai: 2400 },
  { name: 'Tue', manual: 3000, ai: 1398 },
  { name: 'Wed', manual: 2000, ai: 9800 },
  { name: 'Thu', manual: 2780, ai: 3908 },
  { name: 'Fri', manual: 1890, ai: 4800 },
  { name: 'Sat', manual: 2390, ai: 3800 },
  { name: 'Sun', manual: 3490, ai: 4300 },
];

const analyticsBarData = [
  { name: 'Jan', leads: 4000, closed: 2400 },
  { name: 'Feb', leads: 3000, closed: 1398 },
  { name: 'Mar', leads: 2000, closed: 9800 },
  { name: 'Apr', leads: 2780, closed: 3908 },
  { name: 'May', leads: 1890, closed: 4800 },
  { name: 'Jun', leads: 2390, closed: 3800 },
  { name: 'Jul', leads: 3490, closed: 4300 },
];

const sourceData = [
  { name: 'Inbound', value: 400, color: '#3ECE8D' },
  { name: 'Outbound', value: 300, color: '#3b82f6' },
  { name: 'Referral', value: 300, color: '#a855f7' },
  { name: 'Ads', value: 200, color: '#eab308' },
];

const activityData = [
  { time: "Just now", action: "Lead Qualified", value: "+$4,200", status: "success" },
  { time: "2 min ago", action: "Meeting Booked", value: "Demo", status: "neutral" },
  { time: "15 min ago", action: "Email Sequence", value: "245 Sent", status: "neutral" },
  { time: "1 hr ago", action: "Deal Closed", value: "+$12,500", status: "success" },
];

const leadsData = [
  { id: 1, name: "Sarah Connor", company: "Cyberdyne", status: "Qualified", value: "$12,500", source: "Inbound" },
  { id: 2, name: "John Wick", company: "Continental", status: "Negotiation", value: "$45,000", source: "Referral" },
  { id: 3, name: "Tony Stark", company: "Stark Ind", status: "Closed", value: "$120,000", source: "LinkedIn" },
  { id: 4, name: "Bruce Wayne", company: "Wayne Ent", status: "New", value: "$85,000", source: "Outbound" },
  { id: 5, name: "Diana Prince", company: "Themyscira", status: "Qualified", value: "$32,000", source: "Inbound" },
  { id: 6, name: "Clark Kent", company: "Daily Planet", status: "Lost", value: "$5,000", source: "Website" },
  { id: 7, name: "Peter Parker", company: "Daily Bugle", status: "New", value: "$2,500", source: "Ads" },
];

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'analytics' | 'settings'>('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
             {/* Stats Row */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                 <div className="bg-[#121214] border border-white/5 p-5 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                       <div className="p-2 bg-blue-500/10 rounded-lg">
                          <Users className="w-5 h-5 text-blue-500" />
                       </div>
                       <span className="text-xs font-medium text-green-400 flex items-center gap-1 bg-green-400/10 px-2 py-0.5 rounded">
                          <ArrowUpRight size={12} /> +24%
                       </span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">12,450</div>
                    <div className="text-xs text-gray-500">Active Leads Processed</div>
                 </div>

                 <div className="bg-[#121214] border border-white/5 p-5 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                       <div className="p-2 bg-horizon-accent/10 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-horizon-accent" />
                       </div>
                       <span className="text-xs font-medium text-green-400 flex items-center gap-1 bg-green-400/10 px-2 py-0.5 rounded">
                          <ArrowUpRight size={12} /> +12%
                       </span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">$482,000</div>
                    <div className="text-xs text-gray-500">Pipeline Generated</div>
                 </div>

                 <div className="bg-[#121214] border border-white/5 p-5 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                       <div className="p-2 bg-purple-500/10 rounded-lg">
                          <PieChart className="w-5 h-5 text-purple-500" />
                       </div>
                       <span className="text-xs font-medium text-green-400 flex items-center gap-1 bg-green-400/10 px-2 py-0.5 rounded">
                          <ArrowUpRight size={12} /> +98%
                       </span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">99.9%</div>
                    <div className="text-xs text-gray-500">Automation Uptime</div>
                 </div>
              </div>

              {/* Main Chart Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                 <div className="lg:col-span-2 bg-[#121214] border border-white/5 rounded-xl p-6 flex flex-col min-h-[300px]">
                    <div className="flex justify-between items-center mb-6">
                       <div>
                          <h3 className="font-bold text-white">Automation Performance</h3>
                          <p className="text-xs text-gray-500">vs Manual Processing</p>
                       </div>
                       <div className="flex gap-2">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                             <span className="w-2 h-2 rounded-full bg-horizon-accent" /> AI
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                             <span className="w-2 h-2 rounded-full bg-white/20" /> Manual
                          </div>
                       </div>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={overviewData}>
                             <defs>
                                <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#3ECE8D" stopOpacity={0.3}/>
                                   <stop offset="95%" stopColor="#3ECE8D" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                             <XAxis dataKey="name" stroke="#444" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                             <YAxis stroke="#444" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                             <Tooltip 
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#333', color: '#fff', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                             />
                             <Area type="monotone" dataKey="ai" stroke="#3ECE8D" strokeWidth={3} fillOpacity={1} fill="url(#colorAi)" />
                             <Area type="monotone" dataKey="manual" stroke="#333" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="bg-[#121214] border border-white/5 rounded-xl p-6 flex flex-col min-h-[300px]">
                    <h3 className="font-bold text-white mb-6">Live Activity</h3>
                    <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                       {activityData.map((item, i) => (
                          <div key={i} className="flex items-start gap-3 relative pb-6 last:pb-0 border-l border-white/10 pl-4 last:border-l-0">
                             <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-[#121214] ${item.status === 'success' ? 'bg-horizon-accent' : 'bg-gray-500'}`} />
                             <div className="flex-1">
                                <div className="flex justify-between items-start">
                                   <span className="text-sm font-medium text-white">{item.action}</span>
                                   <span className="text-[10px] text-gray-500">{item.time}</span>
                                </div>
                                <div className="text-xs text-gray-400 mt-1">{item.value}</div>
                             </div>
                          </div>
                       ))}
                       <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center cursor-pointer hover:bg-white/10 transition-colors">
                          <span className="text-xs font-medium text-horizon-accent">View All Activity</span>
                       </div>
                    </div>
                 </div>
              </div>
          </motion.div>
        );
      case 'leads':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Lead Management</h3>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 border border-white/10 transition-colors">
                        <Filter size={14} /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-horizon-accent/10 hover:bg-horizon-accent/20 text-horizon-accent rounded-lg text-sm border border-horizon-accent/20 transition-colors">
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            <div className="bg-[#121214] border border-white/5 rounded-xl flex-1 overflow-hidden flex flex-col">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-4">Name / Company</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Value</div>
                    <div className="col-span-2">Source</div>
                    <div className="col-span-2 text-right">Action</div>
                </div>
                <div className="overflow-y-auto flex-1 custom-scrollbar">
                    {leadsData.map((lead) => (
                        <div key={lead.id} className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors items-center group">
                            <div className="col-span-4">
                                <div className="font-medium text-white">{lead.name}</div>
                                <div className="text-xs text-gray-500">{lead.company}</div>
                            </div>
                            <div className="col-span-2">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                    ${lead.status === 'Qualified' ? 'bg-green-500/10 text-green-400' : 
                                      lead.status === 'New' ? 'bg-blue-500/10 text-blue-400' :
                                      lead.status === 'Closed' ? 'bg-purple-500/10 text-purple-400' :
                                      lead.status === 'Negotiation' ? 'bg-yellow-500/10 text-yellow-400' :
                                      'bg-gray-500/10 text-gray-400'
                                    }`}>
                                    {lead.status}
                                </span>
                            </div>
                            <div className="col-span-2 text-sm text-gray-300">{lead.value}</div>
                            <div className="col-span-2 text-sm text-gray-400">{lead.source}</div>
                            <div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white"><Mail size={14} /></button>
                                <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white"><Phone size={14} /></button>
                                <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white"><MoreHorizontal size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </motion.div>
        );
      case 'analytics':
        return (
            <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col h-full overflow-hidden gap-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                <div className="bg-[#121214] border border-white/5 rounded-xl p-6 flex flex-col">
                    <h3 className="font-bold text-white mb-6">Conversion Analytics</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsBarData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="name" stroke="#444" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#444" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#333', color: '#fff', borderRadius: '8px' }}
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                />
                                <Bar dataKey="leads" name="Total Leads" fill="#333" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="closed" name="Closed Deals" fill="#3ECE8D" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#121214] border border-white/5 rounded-xl p-6 flex flex-col">
                    <h3 className="font-bold text-white mb-6">Lead Sources</h3>
                    <div className="flex-1 min-h-0 flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                                <Pie
                                    data={sourceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {sourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#333', color: '#fff', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </RePieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">1,200</div>
                                <div className="text-xs text-gray-500">Total Leads</div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        {sourceData.map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-sm text-gray-300">{item.name}</span>
                                <span className="text-xs text-gray-500 ml-auto">{Math.round(item.value / 12)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </motion.div>
        );
      case 'settings':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 overflow-y-auto custom-scrollbar pr-2"
          >
            <h3 className="text-xl font-bold text-white mb-6">System Configuration</h3>
            
            <div className="space-y-6">
                <div className="bg-[#121214] border border-white/5 rounded-xl p-6">
                    <h4 className="flex items-center gap-2 font-bold text-white mb-4">
                        <Globe size={18} className="text-horizon-accent" />
                        Global Automation Status
                    </h4>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 mb-4">
                        <div>
                            <div className="font-medium text-white">AI Sales Agent</div>
                            <div className="text-xs text-gray-500">Handling inbound chats</div>
                        </div>
                        <div className="text-horizon-accent cursor-pointer"><ToggleRight size={32} /></div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                        <div>
                            <div className="font-medium text-white">Email Follow-up Sequence</div>
                            <div className="text-xs text-gray-500">Active - 4 steps</div>
                        </div>
                        <div className="text-horizon-accent cursor-pointer"><ToggleRight size={32} /></div>
                    </div>
                </div>

                <div className="bg-[#121214] border border-white/5 rounded-xl p-6">
                    <h4 className="flex items-center gap-2 font-bold text-white mb-4">
                        <Database size={18} className="text-blue-500" />
                        Data Integrations
                    </h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png" className="w-5 h-5" alt="Slack" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">Slack</div>
                                    <div className="text-xs text-green-400 flex items-center gap-1"><CheckCircle2 size={10} /> Connected</div>
                                </div>
                            </div>
                            <button className="text-xs text-gray-400 hover:text-white border border-white/10 px-2 py-1 rounded">Configure</button>
                        </div>
                        <div className="w-full h-[1px] bg-white/5" />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-[#ff7a59] flex items-center justify-center">
                                    <span className="font-bold text-white">H</span>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">HubSpot</div>
                                    <div className="text-xs text-green-400 flex items-center gap-1"><CheckCircle2 size={10} /> Connected</div>
                                </div>
                            </div>
                            <button className="text-xs text-gray-400 hover:text-white border border-white/10 px-2 py-1 rounded">Configure</button>
                        </div>
                    </div>
                </div>

                <div className="bg-[#121214] border border-white/5 rounded-xl p-6">
                    <h4 className="flex items-center gap-2 font-bold text-white mb-4">
                        <Shield size={18} className="text-purple-500" />
                        Security & Access
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                             <div className="text-xs text-gray-500 mb-1">API Requests / min</div>
                             <div className="text-lg font-bold text-white">842 / 1000</div>
                             <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
                                 <div className="bg-purple-500 h-full w-[84%]" />
                             </div>
                         </div>
                         <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                             <div className="text-xs text-gray-500 mb-1">Error Rate</div>
                             <div className="text-lg font-bold text-white">0.02%</div>
                             <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
                                 <div className="bg-green-500 h-full w-[1%]" />
                             </div>
                         </div>
                    </div>
                </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="analytics" className="bg-horizon-card border-y border-white/5 relative overflow-hidden">
        {/* Background glow for section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-horizon-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        <ContainerScroll
          titleComponent={
            <div className="mb-10">
                <span className="inline-block py-1 px-3 rounded-full bg-horizon-accent/10 border border-horizon-accent/20 text-horizon-accent text-xs font-semibold tracking-wider uppercase mb-4">
                    Real-Time Intelligence
                </span>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
                    Data-Driven <span className="text-horizon-accent">Insights</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl">
                    Stop guessing. Our custom dashboards track every interaction, giving you real-time visibility into your automated workforce's performance.
                </p>
            </div>
          }
        >
          {/* Big Dashboard Visual */}
          <div className="w-full h-full bg-[#09090b] text-white font-sans overflow-hidden flex flex-col md:flex-row">
            
            {/* Sidebar */}
            <div className="w-full md:w-64 border-r border-white/5 flex flex-col bg-[#0c0c0e]">
              <div className="p-6 flex items-center gap-3 border-b border-white/5">
                <div className="w-8 h-8 rounded-lg bg-horizon-accent flex items-center justify-center shadow-[0_0_15px_rgba(62,206,141,0.3)]">
                  <LayoutDashboard className="w-5 h-5 text-black" />
                </div>
                <span className="font-bold text-lg tracking-tight text-white">Horizon</span>
              </div>
              
              <div className="flex-1 py-6 space-y-1 px-3">
                <div 
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${activeTab === 'overview' ? 'bg-horizon-accent/10 text-horizon-accent' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <PieChart size={20} />
                  <span className="font-medium">Overview</span>
                </div>
                <div 
                    onClick={() => setActiveTab('leads')}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${activeTab === 'leads' ? 'bg-horizon-accent/10 text-horizon-accent' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Users size={20} />
                  <span className="font-medium">Leads</span>
                </div>
                <div 
                    onClick={() => setActiveTab('analytics')}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${activeTab === 'analytics' ? 'bg-horizon-accent/10 text-horizon-accent' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <TrendingUp size={20} />
                  <span className="font-medium">Analytics</span>
                </div>
                <div 
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${activeTab === 'settings' ? 'bg-horizon-accent/10 text-horizon-accent' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Settings size={20} />
                  <span className="font-medium">Settings</span>
                </div>
              </div>

              <div className="p-4 border-t border-white/5 bg-[#09090b]">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-horizon-accent to-blue-500 shadow-inner" />
                   <div>
                      <div className="text-sm font-medium text-white">Enterprise Plan</div>
                      <div className="text-xs text-gray-500">View billing</div>
                   </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col bg-[#09090b] relative overflow-hidden">
               {/* Dashboard Topbar */}
               <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#09090b]/50 backdrop-blur-md sticky top-0 z-20">
                  <div className="flex items-center gap-4 text-gray-400 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 w-64 hover:border-white/10 transition-colors">
                     <Search size={14} />
                     <span className="text-sm">Search...</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer">
                         <CheckCircle2 size={18} />
                     </div>
                     <div className="relative p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer">
                        <Bell size={20} className="text-gray-400 hover:text-white" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-horizon-accent rounded-full border border-[#09090b]" />
                     </div>
                  </div>
               </div>

               {/* Tab Content */}
               <div className="flex-1 p-6 md:p-8 overflow-hidden flex flex-col">
                   <AnimatePresence mode="wait">
                        {renderContent()}
                   </AnimatePresence>
               </div>
            </div>
          </div>
        </ContainerScroll>
      </div>
    </section>
  );
};

export default Analytics;