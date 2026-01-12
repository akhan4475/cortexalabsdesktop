import React, { useState, useMemo } from 'react';
import { DollarSign, Phone, Calendar as CalendarIcon, ArrowUpRight, ChevronLeft, ChevronRight, LayoutGrid, CalendarDays, Clock, CheckCircle2, MessageSquare, UserPlus, Zap, X } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, CartesianGrid } from 'recharts';
import { Client, DemoEvent, Lead } from './types';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---

type Timeframe = 'Day' | 'Week' | 'Month';
type CalendarMode = 'Month' | 'Year';
type MetricMode = 'Profits' | 'Demos';

interface DailyData {
    date: string;
    revenue: number;
    clientsClosed: number;
    dials: number;
    demosBooked: number;
}

interface ActivityEvent {
    id: string;
    type: 'client_onboarded' | 'demo_booked' | 'message_received' | 'retainer_paid';
    title: string;
    subtitle: string;
    date: string;
    value?: string;
}

/**
 * Helper to format date as YYYY-MM-DD using LOCAL time
 */
const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Generate synthetic baseline data from 2024 to 2030 - now starting at zero for dials
const generateBaselineRangeData = (): DailyData[] => {
    const data: DailyData[] = [];
    const startDate = new Date(2024, 0, 1); 
    const endDate = new Date(2030, 11, 31); 

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        data.push({
            date: formatLocalDate(d),
            revenue: 0,
            clientsClosed: 0,
            dials: 0, // Dials remain zero until manually recorded
            demosBooked: 0
        });
    }
    return data;
};

const baselineData = generateBaselineRangeData();

interface DashboardHomeProps {
    clients: Client[];
    demoEvents: DemoEvent[];
    allLeads: Lead[];
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ clients, demoEvents, allLeads }) => {
    const [timeframe, setTimeframe] = useState<Timeframe>('Month');
    const [calendarViewDate, setCalendarViewDate] = useState(new Date());
    const [calendarMode, setCalendarMode] = useState<CalendarMode>('Month');
    const [metricMode, setMetricMode] = useState<MetricMode>('Profits');
    const [showFullActivity, setShowFullActivity] = useState(false);

    const todayStr = useMemo(() => formatLocalDate(new Date()), []);
    const todayDate = useMemo(() => {
        const d = new Date();
        d.setHours(23, 59, 59, 999);
        return d;
    }, []);

    const thirtyDaysAgoStr = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        return formatLocalDate(d);
    }, []);

    // --- REAL-TIME DATA MERGING ---
    const fullYearData = useMemo(() => {
        const dataMap = new Map<string, DailyData>();
        baselineData.forEach(d => dataMap.set(d.date, { ...d }));
        
        clients.forEach(client => {
            // 1. Upfront Close
            const entry = dataMap.get(client.closeDate);
            if (entry) {
                entry.revenue += client.upfrontValue;
                entry.clientsClosed += 1;
            }

            // 2. Monthly Retainers
            if (client.status === 'active' && client.monthlyValue > 0 && client.monthlyRetainerDate) {
                const startDateObj = new Date(client.monthlyRetainerDate + 'T00:00:00');
                const billingDay = startDateObj.getDate();
                let currentBillDate = new Date(startDateObj);

                while (currentBillDate <= todayDate) {
                    const billDateStr = formatLocalDate(currentBillDate);
                    const billEntry = dataMap.get(billDateStr);
                    if (billEntry) {
                        billEntry.revenue += client.monthlyValue;
                    }
                    currentBillDate.setMonth(currentBillDate.getMonth() + 1);
                    currentBillDate.setDate(billingDay);
                }
            }
        });

        demoEvents.forEach(event => {
            const entry = dataMap.get(event.date);
            if (entry) {
                entry.demosBooked += 1;
            }
        });

        return Array.from(dataMap.values());
    }, [clients, demoEvents, todayDate]);

    // --- LATEST ACTIVITY FEED ---
    const allActivityEvents = useMemo(() => {
        const events: ActivityEvent[] = [];

        clients.forEach(c => {
            events.push({
                id: `act-cl-${c.id}`,
                type: 'client_onboarded',
                title: `New Client: ${c.company}`,
                subtitle: `Closed for $${c.upfrontValue.toLocaleString()} setup.`,
                date: c.closeDate,
                value: `+$${c.upfrontValue.toLocaleString()}`
            });

            if (c.status === 'active' && c.monthlyValue > 0 && c.monthlyRetainerDate) {
                const startDateObj = new Date(c.monthlyRetainerDate + 'T00:00:00');
                const billingDay = startDateObj.getDate();
                let currentBillDate = new Date(startDateObj);

                while (currentBillDate <= todayDate) {
                    const dStr = formatLocalDate(currentBillDate);
                    events.push({
                        id: `act-ret-${c.id}-${dStr}`,
                        type: 'retainer_paid',
                        title: `${c.company} Retainer Received`,
                        subtitle: `Automated monthly billing processed.`,
                        date: dStr,
                        value: `+$${c.monthlyValue.toLocaleString()}`
                    });
                    currentBillDate.setMonth(currentBillDate.getMonth() + 1);
                    currentBillDate.setDate(billingDay);
                }
            }
        });

        demoEvents.forEach(d => {
            const lead = allLeads.find(l => l.id === d.leadId);
            events.push({
                id: d.id,
                type: 'demo_booked',
                title: `Demo Booked: ${lead?.name || 'Prospect'}`,
                subtitle: `${lead?.company || 'Lead'} confirmed walkthrough.`,
                date: d.date,
            });
        });

        // Only show message replies for leads that actually have demo status or follow-ups
        allLeads.filter(l => l.status === 'Demo Booked' || l.status === 'Follow-up Required').forEach(l => {
            events.push({
                id: `act-msg-${l.id}`,
                type: 'message_received',
                title: `Reply from ${l.name}`,
                subtitle: `"${l.summary.length > 50 ? l.summary.substring(0, 50) + '...' : l.summary}"`,
                date: todayStr
            });
        });

        return events.sort((a, b) => b.date.localeCompare(a.date));
    }, [clients, demoEvents, allLeads, todayDate, todayStr]);

    const displayActivity = useMemo(() => allActivityEvents.slice(0, 4), [allActivityEvents]);
    
    const fullActivityFeed = useMemo(() => 
        allActivityEvents.filter(e => e.date >= thirtyDaysAgoStr), 
    [allActivityEvents, thirtyDaysAgoStr]);

    // --- Metrics Stats Calculation ---
    const stats = useMemo(() => {
        let relevantData: DailyData[] = [];
        if (timeframe === 'Day') {
            relevantData = fullYearData.filter(d => d.date === todayStr);
        } else if (timeframe === 'Week') {
            const now = new Date();
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            const startStr = formatLocalDate(startOfWeek);
            const endStr = formatLocalDate(endOfWeek);
            relevantData = fullYearData.filter(x => x.date >= startStr && x.date <= endStr);
        } else if (timeframe === 'Month') {
            const monthPrefix = todayStr.substring(0, 7);
            relevantData = fullYearData.filter(d => d.date.startsWith(monthPrefix));
        }
        const totalRevenue = relevantData.reduce((acc, curr) => acc + curr.revenue, 0);
        const totalDials = relevantData.reduce((acc, curr) => acc + curr.dials, 0);
        const totalDemos = relevantData.reduce((acc, curr) => acc + curr.demosBooked, 0);
        const conversion = totalDials > 0 ? ((totalDemos / totalDials) * 100).toFixed(1) : '0.0';
        return { totalRevenue, totalDials, totalDemos, conversion };
    }, [timeframe, todayStr, fullYearData]);

    const chartData = useMemo(() => {
        const dataPoints = [];
        const now = new Date();
        if (timeframe === 'Day') {
            const sun = new Date(now);
            sun.setDate(now.getDate() - now.getDay());
            for (let i = 0; i < 7; i++) {
                const d = new Date(sun);
                d.setDate(sun.getDate() + i);
                const dStr = formatLocalDate(d);
                const dayData = fullYearData.find(x => x.date === dStr) || { revenue: 0 };
                dataPoints.push({ name: d.toLocaleDateString('default', { weekday: 'short' }), revenue: dayData.revenue });
            }
        } else if (timeframe === 'Week') {
            const year = now.getFullYear();
            const month = now.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const numWeeks = Math.ceil(daysInMonth / 7);
            for (let w = 0; w < numWeeks; w++) {
                const startDay = w * 7 + 1;
                const endDay = (w + 1) * 7;
                const weekTotal = fullYearData
                    .filter(x => {
                        const d = new Date(x.date + 'T00:00:00');
                        return d.getFullYear() === year && d.getMonth() === month && d.getDate() >= startDay && d.getDate() <= endDay;
                    })
                    .reduce((acc, curr) => acc + curr.revenue, 0);
                dataPoints.push({ name: `W${w + 1}`, revenue: weekTotal });
            }
        } else {
             const year = now.getFullYear();
             for (let m = 0; m < 12; m++) {
                const monthDate = new Date(year, m, 1);
                const monthStr = monthDate.toLocaleString('default', { month: 'short' });
                const prefix = `${year}-${String(m + 1).padStart(2, '0')}`;
                const monthTotal = fullYearData
                    .filter(x => x.date.startsWith(prefix))
                    .reduce((acc, curr) => acc + curr.revenue, 0);
                dataPoints.push({ name: monthStr, revenue: monthTotal });
            }
        }
        return dataPoints;
    }, [timeframe, fullYearData]);

    const handlePrevCalendar = () => {
        const newDate = new Date(calendarViewDate);
        calendarMode === 'Month' ? newDate.setMonth(newDate.getMonth() - 1) : newDate.setFullYear(newDate.getFullYear() - 1);
        setCalendarViewDate(newDate);
    };

    const handleNextCalendar = () => {
        const newDate = new Date(calendarViewDate);
        calendarMode === 'Month' ? newDate.setMonth(newDate.getMonth() + 1) : newDate.setFullYear(newDate.getFullYear() + 1);
        setCalendarViewDate(newDate);
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const daysArray = [];
        for (let i = 0; i < firstDay; i++) daysArray.push(null);
        for (let i = 1; i <= days; i++) daysArray.push(new Date(year, month, i));
        return daysArray;
    };

    const formatCurrency = (val: number) => {
        if (val === 0) return '';
        if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
        return `$${val}`;
    };

    const getActivityIcon = (type: ActivityEvent['type']) => {
        switch(type) {
            case 'client_onboarded': return <UserPlus size={18} className="text-green-400" />;
            case 'demo_booked': return <CalendarIcon size={18} className="text-purple-400" />;
            case 'message_received': return <MessageSquare size={18} className="text-blue-400" />;
            case 'retainer_paid': return <Zap size={18} className="text-horizon-accent" />;
            default: return <Clock size={18} className="text-gray-400" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end items-center">
                <div className="flex bg-[#18181b] p-1 rounded-lg border border-[#262624]">
                    {(['Day', 'Week', 'Month'] as Timeframe[]).map((t) => (
                        <button key={t} onClick={() => setTimeframe(t)} className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${timeframe === t ? 'bg-horizon-accent text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>{t}</button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#18181b] border border-[#262624] p-5 rounded-xl transition-all hover:border-horizon-accent/20">
                    <div className="flex justify-between items-start mb-2"><span className="text-gray-400 text-sm font-medium">Profit ({timeframe})</span><div className="p-2 rounded-lg bg-horizon-accent/10 text-horizon-accent"><DollarSign size={16} /></div></div>
                    <div className="text-2xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</div>
                </div>
                <div className="bg-[#18181b] border border-[#262624] p-5 rounded-xl transition-all hover:border-blue-500/20">
                    <div className="flex justify-between items-start mb-2"><span className="text-gray-400 text-sm font-medium">Dials ({timeframe})</span><div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Phone size={16} /></div></div>
                    <div className="text-2xl font-bold text-white">{stats.totalDials.toLocaleString()}</div>
                </div>
                <div className="bg-[#18181b] border border-[#262624] p-5 rounded-xl transition-all hover:border-purple-500/20">
                    <div className="flex justify-between items-start mb-2"><span className="text-gray-400 text-sm font-medium">Demos ({timeframe})</span><div className="p-2 rounded-lg bg-purple-500/10 text-purple-500"><CalendarIcon size={16} /></div></div>
                    <div className="text-2xl font-bold text-white">{stats.totalDemos.toLocaleString()}</div>
                </div>
                <div className="bg-[#18181b] border border-[#262624] p-5 rounded-xl transition-all hover:border-orange-500/20">
                    <div className="flex justify-between items-start mb-2"><span className="text-gray-400 text-sm font-medium">Conversion</span><div className="p-2 rounded-lg bg-orange-500/10 text-orange-500"><ArrowUpRight size={16} /></div></div>
                    <div className="text-2xl font-bold text-white">{stats.conversion}%</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#18181b] border border-[#262624] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-white">Profit Trend</h3>
                        <span className="text-xs text-gray-500">
                            {timeframe === 'Day' ? 'Daily Outlook' : timeframe === 'Week' ? 'Weekly Outlook' : 'Monthly Outlook'}
                        </span>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs><linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3ECE8D" stopOpacity={0.3}/><stop offset="95%" stopColor="#3ECE8D" stopOpacity={0}/></linearGradient></defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} 
                                    formatter={(value: number) => [`$${value.toLocaleString()}`, "revenue"]}
                                />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#666" 
                                    fontSize={10} 
                                    interval={0} 
                                    padding={{ left: 15, right: 15 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3ECE8D" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-1 bg-[#18181b] border border-[#262624] rounded-xl p-6 flex flex-col min-h-[500px]">
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-white text-lg">Performance Calendar</h3>
                            <div className="flex bg-[#09090b] p-0.5 rounded-lg border border-[#262624]">
                                <button onClick={() => setCalendarMode('Month')} className={`p-1.5 rounded-md ${calendarMode === 'Month' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white transition-all'}`}><CalendarDays size={16} /></button>
                                <button onClick={() => setCalendarMode('Year')} className={`p-1.5 rounded-md ${calendarMode === 'Year' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white transition-all'}`}><LayoutGrid size={16} /></button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <button onClick={handlePrevCalendar} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"><ChevronLeft size={16} /></button>
                                <span className="font-mono font-bold text-horizon-accent text-xs w-28 text-center">{calendarMode === 'Month' ? calendarViewDate.toLocaleString('default', { month: 'long', year: 'numeric' }) : calendarViewDate.getFullYear()}</span>
                                <button onClick={handleNextCalendar} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"><ChevronRight size={16} /></button>
                            </div>
                            <div className="flex bg-[#09090b] p-1 rounded-lg border border-[#262624]">
                                <button onClick={() => setMetricMode('Profits')} className={`px-2 py-0.5 text-[8px] font-bold rounded transition-all ${metricMode === 'Profits' ? 'bg-horizon-accent text-black' : 'text-gray-500'}`}>Profits</button>
                                <button onClick={() => setMetricMode('Demos')} className={`px-2 py-0.5 text-[8px] font-bold rounded transition-all ${metricMode === 'Demos' ? 'bg-horizon-accent text-black' : 'text-gray-500'}`}>Demos</button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        {calendarMode === 'Month' ? (
                            <div className="grid grid-cols-7 gap-1.5">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-center text-[9px] text-gray-600 font-bold mb-1 uppercase">{d}</div>)}
                                {getDaysInMonth(calendarViewDate).map((date, i) => {
                                    if (!date) return <div key={`empty-${i}`} className="bg-transparent" />;
                                    const dStr = formatLocalDate(date);
                                    const dayData = fullYearData.find(d => d.date === dStr);
                                    const isToday = dStr === todayStr;
                                    const active = metricMode === 'Profits' ? (dayData?.revenue ?? 0) > 0 : (dayData?.demosBooked ?? 0) > 0;

                                    return (
                                        <div key={dStr} className={`aspect-square rounded-lg border p-1 flex flex-col justify-between transition-all relative overflow-hidden ${active ? 'bg-horizon-accent/10 border-horizon-accent/40 shadow-[0_0_10px_rgba(62,206,141,0.05)]' : 'bg-[#09090b] border-[#262624]'} ${isToday ? 'ring-1 ring-horizon-accent' : ''}`}>
                                            <span className={`text-[8px] leading-none ${active ? 'text-horizon-accent font-bold' : isToday ? 'text-white font-bold' : 'text-gray-600'}`}>{date.getDate()}</span>
                                            {dayData && (
                                                <div className="flex flex-col items-center justify-center absolute inset-0 pt-2.5 pointer-events-none">
                                                    {metricMode === 'Profits' && dayData.revenue > 0 && (
                                                        <>
                                                            <span className="text-[10px] font-bold text-white tracking-tight leading-none mb-0.5">{formatCurrency(dayData.revenue)}</span>
                                                            <span className="text-[7px] text-gray-500 font-bold uppercase">{dayData.clientsClosed > 0 ? `${dayData.clientsClosed} Clt` : 'Ret'}</span>
                                                        </>
                                                    )}
                                                    {metricMode === 'Demos' && dayData.demosBooked > 0 && (
                                                        <>
                                                            <span className="text-[14px] font-bold text-white leading-none mb-0.5">{dayData.demosBooked}</span>
                                                            <span className="text-[7px] text-gray-500 font-bold uppercase tracking-tighter">Demos</span>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="grid grid-cols-4 gap-2">
                                {Array.from({ length: 12 }, (_, i) => {
                                    const monthDate = new Date(calendarViewDate.getFullYear(), i, 1);
                                    const mPrefix = `${calendarViewDate.getFullYear()}-${String(i + 1).padStart(2, '0')}`;
                                    const monthStats = fullYearData.filter(d => d.date.startsWith(mPrefix)).reduce((acc, curr) => ({
                                        rev: acc.rev + curr.revenue,
                                        dem: acc.dem + curr.demosBooked,
                                        clt: acc.clt + curr.clientsClosed
                                    }), { rev: 0, dem: 0, clt: 0 });

                                    const isRelevant = metricMode === 'Profits' ? monthStats.rev > 0 : monthStats.dem > 0;

                                    return (
                                        <div key={i} className={`aspect-square rounded-xl border p-1.5 flex flex-col items-center justify-center transition-all ${isRelevant ? 'bg-horizon-accent/10 border-horizon-accent/30 shadow-[0_0_15px_rgba(62,206,141,0.03)]' : 'bg-[#09090b] border-[#262624]'}`}>
                                            <span className="text-[8px] font-bold text-gray-600 uppercase mb-1">{monthDate.toLocaleString('default', { month: 'short' })}</span>
                                            {metricMode === 'Profits' ? (
                                                <>
                                                    <span className="text-[11px] font-bold text-white mb-0.5 leading-none">{formatCurrency(monthStats.rev) || '$0'}</span>
                                                    {isRelevant && <span className="text-[7px] text-gray-500 font-bold uppercase leading-none">{monthStats.clt} Clt</span>}
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-[14px] font-bold text-white mb-0.5 leading-none">{monthStats.dem}</span>
                                                    {isRelevant && <span className="text-[7px] text-gray-500 font-bold uppercase leading-none">Demos</span>}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-[#18181b] border border-[#262624] rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <h3 className="font-bold text-white">Latest Activity</h3>
                        <button onClick={() => setShowFullActivity(true)} className="text-[10px] font-bold uppercase tracking-wider text-horizon-accent hover:text-white border border-horizon-accent/20 px-2.5 py-1 rounded-md transition-all hover:bg-horizon-accent/5">See All</button>
                    </div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Real-time Stream</div>
                </div>
                <div className="space-y-4">
                    {displayActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-4 bg-[#09090b] border border-[#262624] rounded-lg group hover:border-horizon-accent/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-lg bg-[#18181b] border border-[#262624] group-hover:border-horizon-accent/20 transition-colors">{getActivityIcon(activity.type)}</div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-white truncate">{activity.title}</span>
                                        {activity.value && <span className="text-[10px] font-bold text-horizon-accent bg-horizon-accent/10 px-1.5 rounded py-0.5">{activity.value}</span>}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate">{activity.subtitle}</div>
                                </div>
                            </div>
                            <div className="text-[10px] text-gray-600 font-mono shrink-0 ml-4">{activity.date === todayStr ? 'Today' : activity.date}</div>
                        </div>
                    ))}
                    {displayActivity.length === 0 && <div className="text-center py-10 text-gray-600 italic text-sm">No recent activity recorded.</div>}
                </div>
            </div>

            <AnimatePresence>
                {showFullActivity && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFullActivity(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-[#121214] border border-[#262624] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                            <div className="p-6 border-b border-[#262624] flex items-center justify-between bg-[#18181b]">
                                <div><h3 className="text-xl font-bold text-white">Full Activity Stream</h3><p className="text-xs text-gray-500 mt-1">Showing all performance events from the past 30 days.</p></div>
                                <button onClick={() => setShowFullActivity(false)} className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 crm-scroll">
                                {fullActivityFeed.map((activity) => (
                                    <div key={activity.id} className="flex items-center justify-between p-4 bg-[#09090b] border border-[#262624] rounded-xl hover:border-horizon-accent/20 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 rounded-lg bg-[#18181b] border border-[#262624] shrink-0">{getActivityIcon(activity.type)}</div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2"><span className="text-sm font-bold text-white">{activity.title}</span>{activity.value && <span className="text-[10px] font-bold text-horizon-accent bg-horizon-accent/10 px-1.5 rounded py-0.5">{activity.value}</span>}</div>
                                                <div className="text-xs text-gray-500">{activity.subtitle}</div>
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-gray-600 font-mono shrink-0 ml-4">{activity.date}</div>
                                    </div>
                                ))}
                                {fullActivityFeed.length === 0 && <div className="text-center py-20 text-gray-600 italic">No activity recorded in the last 30 days.</div>}
                            </div>
                            <div className="p-4 bg-[#18181b] border-t border-[#262624] flex justify-center"><button onClick={() => setShowFullActivity(false)} className="text-xs font-bold text-gray-500 hover:text-white transition-colors">Close Feed</button></div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardHome;