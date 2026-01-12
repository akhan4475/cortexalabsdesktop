import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Clock, DollarSign, TrendingUp, AlertTriangle, Zap, XCircle, CheckCircle2, User, Bot, Calculator, ArrowRight, ArrowDown } from 'lucide-react';

const Counter = ({ from, to, duration = 2.5, prefix = "", suffix = "", decimals = 0, delay = 0 }: { from: number; to: number; duration?: number; prefix?: string; suffix?: string; decimals?: number; delay?: number }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;

    const node = nodeRef.current;
    if (!node) return;
    
    // Set initial value
    node.textContent = prefix + from.toFixed(decimals) + suffix;

    const timeout = setTimeout(() => {
        const controls = animate(from, to, {
        duration: duration,
        ease: "easeOut",
        onUpdate(value) {
            node.textContent = prefix + value.toFixed(decimals) + suffix;
        }
        });
        return () => controls.stop();
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [from, to, duration, inView, prefix, suffix, decimals, delay]);

  return <span ref={nodeRef} className="tabular-nums" />;
};

const ComparisonSection: React.FC = () => {
  // Calculator State
  const [missedCalls, setMissedCalls] = useState<number>(50);
  const [closeRate, setCloseRate] = useState<number>(25);
  const [avgValue, setAvgValue] = useState<number>(200);

  const calculateRevenue = () => {
    return missedCalls * (closeRate / 100) * avgValue;
  };
  
  const monthlyLoss = calculateRevenue();
  const yearlyLoss = monthlyLoss * 12;

  return (
    <section id="comparison" className="py-24 bg-horizon-bg relative overflow-hidden border-b border-white/5">
       {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                    The <span className="text-horizon-accent">AI Advantage</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    See the tangible impact of replacing manual workflows with intelligent automation.
                </p>
            </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-start">
            
            {/* Left Column - Stacked Cards */}
            <div className="lg:col-span-5 flex flex-col gap-4 relative">
                 {/* Connection Line */}
                 <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-full w-0.5 bg-gradient-to-b from-red-500/20 via-transparent to-horizon-accent/20 hidden lg:block" />
                 
                 {/* VS Badge */}
                 <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black border border-white/10 rounded-full flex items-center justify-center shadow-xl hidden lg:flex">
                    <span className="font-display font-bold text-xs italic text-gray-500">VS</span>
                 </div>

                {/* Manual Card (Red) */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-[#0f0f11] border border-white/5 rounded-2xl p-6 relative overflow-hidden group"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/50 to-transparent opacity-50" />
                    
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                            <User size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Manual Operation</h3>
                            <p className="text-xs text-gray-500">Traditional Workforce</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Clock size={12} /> Response Time</div>
                            <div className="text-xl font-display font-bold text-white">
                                <Counter from={0} to={45} duration={2} suffix="m" />
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-2">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "80%" }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, delay: 0.2 }}
                                    className="h-full bg-red-500/50 rounded-full"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 mb-1 flex items-center gap-1"><XCircle size={12} /> Error Rate</div>
                            <div className="text-xl font-display font-bold text-white">
                                <Counter from={0} to={8} duration={2} suffix="%" />
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-2">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "45%" }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, delay: 0.6 }}
                                    className="h-full bg-red-500/50 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* AI Card (Green/Blue) */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-[#0f0f11] border border-horizon-accent/30 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(62,206,141,0.05)]"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-horizon-accent to-transparent" />
                    
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-horizon-accent/10 flex items-center justify-center text-horizon-accent shadow-[0_0_15px_rgba(62,206,141,0.2)]">
                            <Bot size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Horizon Systems</h3>
                            <p className="text-xs text-horizon-accent">Automated & Scalable</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Clock size={12} /> Response Time</div>
                            <div className="text-xl font-display font-bold text-white text-shadow-glow">
                                <Counter from={30} to={10} duration={2} suffix="s" />
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-2">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "15%" }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, delay: 0.2 }}
                                    className="h-full bg-horizon-accent rounded-full shadow-[0_0_10px_#3ECE8D]"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 mb-1 flex items-center gap-1"><CheckCircle2 size={12} /> Uptime</div>
                            <div className="text-xl font-display font-bold text-white">
                                <Counter from={0} to={100} duration={2} suffix="%" />
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-2">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "100%" }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, delay: 0.6 }}
                                    className="h-full bg-horizon-accent rounded-full shadow-[0_0_10px_#3ECE8D]"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Column - Calculator */}
            <div className="lg:col-span-7 h-full">
                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-[#121214] border border-white/5 rounded-3xl p-8 lg:p-10 h-full flex flex-col justify-center relative overflow-hidden"
                >
                     {/* Background effects */}
                     <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent pointer-events-none" />
                     <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] pointer-events-none" />

                     <div className="mb-8 border-b border-white/5 pb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/5 rounded-lg text-white">
                                <Calculator size={20} />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Missed Revenue Calculator</h3>
                        </div>
                        <p className="text-gray-400 text-sm">Estimate how much revenue is slipping through the cracks due to missed calls and delayed follow-ups.</p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                         {/* Inputs */}
                         <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Missed Calls / Month</label>
                                <div className="relative group">
                                    <input 
                                        type="number" 
                                        value={missedCalls}
                                        onChange={(e) => setMissedCalls(Math.max(0, Number(e.target.value)))}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-lg text-white focus:outline-none focus:border-horizon-accent focus:ring-1 focus:ring-horizon-accent transition-all placeholder-gray-600"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs font-mono group-hover:text-gray-400 transition-colors">CALLS</span>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Avg. Close Rate</label>
                                <div className="relative group">
                                    <input 
                                        type="number" 
                                        value={closeRate}
                                        onChange={(e) => setCloseRate(Math.min(100, Math.max(0, Number(e.target.value))))}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-lg text-white focus:outline-none focus:border-horizon-accent focus:ring-1 focus:ring-horizon-accent transition-all placeholder-gray-600"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs font-mono group-hover:text-gray-400 transition-colors">% RATE</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Avg. Deal Value</label>
                                <div className="relative group">
                                    <input 
                                        type="number" 
                                        value={avgValue}
                                        onChange={(e) => setAvgValue(Math.max(0, Number(e.target.value)))}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-lg text-white focus:outline-none focus:border-horizon-accent focus:ring-1 focus:ring-horizon-accent transition-all placeholder-gray-600"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs font-mono group-hover:text-gray-400 transition-colors">USD</span>
                                </div>
                            </div>
                         </div>

                         {/* Result */}
                         <div className="flex flex-col justify-center">
                            <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <AlertTriangle size={16} className="text-red-500" />
                                        <span className="text-red-400 text-sm font-bold uppercase tracking-wider">Potential Loss</span>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <div className="text-xs text-gray-500 mb-1">MONTHLY REVENUE MISSED</div>
                                        <div className="text-4xl lg:text-5xl font-display font-bold text-white tracking-tight">
                                            ${Math.round(monthlyLoss).toLocaleString()}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">ANNUAL PROJECTION</div>
                                        <div className="text-xl lg:text-2xl font-bold text-red-500 flex items-center gap-2">
                                            ${Math.round(yearlyLoss).toLocaleString()}
                                            <TrendingUp size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6 flex items-center gap-4 text-sm text-gray-400 bg-white/5 p-3 rounded-lg border border-white/5">
                                <div className="p-1.5 bg-horizon-accent/20 rounded text-horizon-accent">
                                    <CheckCircle2 size={16} />
                                </div>
                                <p>Horizon AI captures <span className="text-white font-bold">100%</span> of these leads.</p>
                            </div>
                         </div>
                     </div>
                </motion.div>
            </div>

        </div>

      </div>
    </section>
  );
};

export default ComparisonSection;