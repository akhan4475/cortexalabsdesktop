import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const Analytics: React.FC = () => {
    const dialData = [
        { name: 'Mon', calls: 0, demos: 0 },
        { name: 'Tue', calls: 0, demos: 0 },
        { name: 'Wed', calls: 0, demos: 0 },
        { name: 'Thu', calls: 0, demos: 0 },
        { name: 'Fri', calls: 0, demos: 0 },
    ];

    const revenueData = [
        { name: 'Week 1', revenue: 0 },
        { name: 'Week 2', revenue: 0 },
        { name: 'Week 3', revenue: 0 },
        { name: 'Week 4', revenue: 0 },
    ];

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>
                <div className="flex gap-2">
                    <select className="bg-[#18181b] border border-[#262624] text-white rounded-lg px-3 py-2 text-sm focus:outline-none">
                        <option>This Month</option>
                        <option>Last Month</option>
                        <option>This Year</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#18181b] border border-[#262624] rounded-xl p-6">
                    <h3 className="font-bold text-white mb-6">Call Volume vs Demos</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dialData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#333', color: '#fff' }}
                                    cursor={{fill: '#262624'}}
                                />
                                <Legend />
                                <Bar dataKey="calls" fill="#333" radius={[4, 4, 0, 0]} name="Outbound Calls" />
                                <Bar dataKey="demos" fill="#3ECE8D" radius={[4, 4, 0, 0]} name="Demos Booked" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#18181b] border border-[#262624] rounded-xl p-6">
                    <h3 className="font-bold text-white mb-6">Revenue Trend</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#333', color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#3ECE8D" strokeWidth={3} dot={{r: 6, fill: '#3ECE8D'}} activeDot={{r: 8}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Avg Call Duration', value: '0m 00s' },
                    { label: 'Lead to Demo Rate', value: '0.0%' },
                    { label: 'Demo to Close Rate', value: '0%' },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#18181b] border border-[#262624] p-6 rounded-xl text-center">
                        <div className="text-gray-500 text-sm mb-2 uppercase tracking-wide">{stat.label}</div>
                        <div className="text-3xl font-bold text-white font-display">{stat.value}</div>
                    </div>
                ))}
             </div>
        </div>
    );
};

export default Analytics;