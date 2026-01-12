import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Search, Map, Cpu, Rocket, CheckCircle2, AlertCircle, Zap, Server, Globe } from 'lucide-react';
import { GlassCard, GlassCardContent } from './ui/glass-card';

const steps = [
  {
    id: "01",
    icon: <Search className="w-6 h-6" />,
    title: "The Audit",
    desc: "We dive deep into your existing workflows, identifying bottlenecks and inefficiencies that AI can solve immediately.",
    deliverables: ["Workflow Map", "ROI Analysis", "Tech Stack Review"],
    duration: "1-2 Weeks"
  },
  {
    id: "02",
    icon: <Map className="w-6 h-6" />,
    title: "Strategizing",
    desc: "We design a custom automation roadmap, selecting the perfect LLMs and tools to align with your specific business KPIs.",
    deliverables: ["Automation Roadmap", "LLM Selection", "KPI Definitions"],
    duration: "1 Week"
  },
  {
    id: "03",
    icon: <Cpu className="w-6 h-6" />,
    title: "Engineering",
    desc: "Our developers build your custom agents and integrations, ensuring robust error handling and seamless connectivity.",
    deliverables: ["Custom Agents", "API Integration", "Testing Environment"],
    duration: "2-4 Weeks"
  },
  {
    id: "04",
    icon: <Rocket className="w-6 h-6" />,
    title: "Deployment & Scaling",
    desc: "We launch your system and provide ongoing monitoring, optimization, and scaling to ensure peak performance 24/7.",
    deliverables: ["Live System", "Staff Training", "24/7 Monitoring"],
    duration: "Ongoing"
  }
];

// Individual block component to handle its own state change when scanned
const Block: React.FC<{ isError: boolean }> = ({ isError }) => {
    const controls = useAnimation();

    useEffect(() => {
        // Simple interval to simulate the scan passing over at random times relative to position
        // In a real production app we'd calculate intersection with the scan line
        const delay = Math.random() * 2000 + 500;
        const timer = setTimeout(() => {
             controls.start(isError ? "fixed" : "optimized");
        }, delay);
        return () => clearTimeout(timer);
    }, [isError, controls]);

    return (
        <motion.div
            initial="initial"
            animate={controls}
            variants={{
                initial: { 
                    backgroundColor: isError ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 255, 255, 0.05)",
                    borderColor: isError ? "rgba(239, 68, 68, 0.4)" : "rgba(255, 255, 255, 0.1)",
                    scale: 1
                },
                fixed: {
                    backgroundColor: ["rgba(239, 68, 68, 0.2)", "rgba(255, 255, 255, 1)", "rgba(62, 206, 141, 0.2)"],
                    borderColor: ["rgba(239, 68, 68, 0.4)", "rgba(255, 255, 255, 1)", "rgba(62, 206, 141, 0.4)"],
                    scale: [1, 1.1, 1],
                    transition: { duration: 0.8 }
                },
                optimized: {
                     backgroundColor: ["rgba(255, 255, 255, 0.05)", "rgba(62, 206, 141, 0.1)"],
                     borderColor: "rgba(62, 206, 141, 0.2)",
                     transition: { duration: 0.5 }
                }
            }}
            className="w-6 h-6 md:w-8 md:h-8 rounded-[2px] border"
        />
    );
}

// --- 01. The Audit: Data Matrix Scan ---
const AuditVisual = () => {
    // Grid of blocks to represent system modules
    const rows = 6;
    const cols = 8;
    const blocks = Array.from({ length: rows * cols }, (_, i) => ({
        id: i,
        isError: Math.random() > 0.7, // 30% chance of being an "error" initially
    }));

    return (
        <div className="absolute inset-0 bg-[#080808] flex items-center justify-center overflow-hidden">
             {/* Grid Container */}
             <div className="grid grid-cols-8 gap-1.5 p-4 relative z-10">
                {blocks.map((block) => (
                    <Block key={block.id} isError={block.isError} />
                ))}
             </div>

             {/* Scanning Laser */}
             <motion.div
                initial={{ top: '-10%', opacity: 0 }}
                whileInView={{ top: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                className="absolute left-0 right-0 h-1 bg-horizon-accent shadow-[0_0_20px_#3ECE8D] z-20 pointer-events-none"
             />
             <motion.div
                initial={{ top: '-10%' }}
                whileInView={{ top: ['0%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                className="absolute left-0 right-0 h-32 bg-gradient-to-b from-horizon-accent/20 to-transparent z-20 pointer-events-none"
             />
             
             {/* UI Overlay */}
             <div className="absolute top-4 left-4 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                 <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Scanning Inefficiencies</span>
             </div>
        </div>
    );
};


// --- 02. Strategizing: Neural Constellation ---
const StrategyVisual = () => {
    return (
        <div className="absolute inset-0 bg-[#080808] flex items-center justify-center overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />

            <div className="relative w-64 h-64">
                <svg className="absolute inset-0 w-full h-full overflow-visible">
                    {/* Connecting Lines */}
                    {[
                        "M 32,128 C 32,128 96,64 128,128",
                        "M 32,128 C 32,128 96,192 128,128",
                        "M 128,128 C 128,128 192,64 224,32",
                        "M 128,128 C 128,128 192,128 224,128",
                        "M 128,128 C 128,128 192,192 224,224",
                    ].map((path, i) => (
                        <motion.path
                            key={i}
                            d={path}
                            fill="none"
                            stroke="#3ECE8D"
                            strokeWidth="2"
                            strokeOpacity="0.2"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ duration: 1.5, delay: i * 0.2, ease: "easeInOut" }}
                        />
                    ))}
                    
                    {/* Active Data Packets traveling */}
                    {[
                         "M 32,128 C 32,128 96,64 128,128",
                         "M 128,128 C 128,128 192,128 224,128"
                    ].map((path, i) => (
                        <motion.circle
                            key={`p-${i}`}
                            r="3"
                            fill="#fff"
                            filter="url(#glow)"
                        >
                            <animateMotion 
                                dur={`${2 + i}s`} 
                                repeatCount="indefinite" 
                                path={path}
                                rotate="auto"
                            />
                        </motion.circle>
                    ))}

                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                </svg>

                {/* Nodes */}
                <div className="absolute top-1/2 left-4 -translate-y-1/2">
                    <motion.div 
                        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
                        className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md z-10 relative"
                    >
                         <div className="w-2 h-2 bg-white rounded-full" />
                         <div className="absolute inset-0 border border-white/30 rounded-full animate-ping opacity-20" />
                    </motion.div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div 
                        initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.5 }}
                        className="w-12 h-12 rounded-full bg-horizon-accent/10 border border-horizon-accent flex items-center justify-center backdrop-blur-md z-10 relative shadow-[0_0_20px_rgba(62,206,141,0.3)]"
                    >
                         <Cpu size={20} className="text-horizon-accent" />
                    </motion.div>
                </div>

                {/* End Nodes */}
                <div className="absolute top-4 right-4"><Node delay={1.2} /></div>
                <div className="absolute top-1/2 right-4 -translate-y-1/2"><Node delay={1.4} active /></div>
                <div className="absolute bottom-4 right-4"><Node delay={1.6} /></div>
            </div>

            {/* Floating Label */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
                className="absolute bottom-6 bg-horizon-card border border-horizon-accent/30 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg"
            >
                <div className="w-1.5 h-1.5 bg-horizon-accent rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-white">OPTIMAL PATH SELECTED</span>
            </motion.div>
        </div>
    )
}

const Node = ({ delay, active }: { delay: number, active?: boolean }) => (
    <motion.div 
        initial={{ scale: 0 }} 
        whileInView={{ scale: 1 }} 
        transition={{ delay, type: "spring" }}
        className={`w-4 h-4 rounded-full border flex items-center justify-center backdrop-blur-sm 
            ${active ? 'bg-horizon-accent/20 border-horizon-accent shadow-[0_0_10px_rgba(62,206,141,0.5)]' : 'bg-black/40 border-white/20'}`}
    >
        {active && <div className="w-1.5 h-1.5 bg-horizon-accent rounded-full" />}
    </motion.div>
);


// --- 03. Engineering: Fusion Core Assembly ---
const EngineeringVisual = () => {
    return (
        <div className="absolute inset-0 bg-[#080808] flex items-center justify-center overflow-hidden">
             {/* Background Circuitry */}
             <div className="absolute inset-0 opacity-20">
                 <svg width="100%" height="100%">
                     <pattern id="circuit" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                         <path d="M10,10 L40,10 L40,40" fill="none" stroke="currentColor" strokeWidth="1" className="text-white"/>
                         <circle cx="10" cy="10" r="2" fill="currentColor" className="text-white"/>
                     </pattern>
                     <rect width="100%" height="100%" fill="url(#circuit)" />
                 </svg>
             </div>

             {/* Central Core */}
             <div className="relative z-10 w-48 h-48 flex items-center justify-center">
                 {/* Spinning Outer Ring */}
                 <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full"
                 />
                 <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 border border-white/5 rounded-full"
                 />

                 {/* Assembling Layers */}
                 <motion.div 
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="absolute w-24 h-24 bg-horizon-accent/5 border border-horizon-accent/30 rounded-xl transform rotate-45 backdrop-blur-sm"
                 />
                 <motion.div 
                    initial={{ y: -40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="absolute w-24 h-24 bg-horizon-accent/10 border border-horizon-accent/50 rounded-xl transform rotate-12 backdrop-blur-sm shadow-[0_0_30px_rgba(62,206,141,0.1)]"
                 />
                 <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="absolute w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-[0_0_30px_rgba(62,206,141,0.4)] z-20"
                 >
                     <Zap className="text-horizon-accent fill-horizon-accent" size={32} />
                 </motion.div>

                 {/* Code Snippets Floating */}
                 <motion.div 
                    initial={{ x: -50, opacity: 0 }}
                    whileInView={{ x: -80, y: -20, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute left-1/2 top-1/2 bg-black/80 border border-white/10 px-2 py-1 rounded text-[8px] font-mono text-blue-300 whitespace-nowrap"
                 >
                    import &#123; Agent &#125;
                 </motion.div>
                 <motion.div 
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 40, y: 30, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute left-1/2 top-1/2 bg-black/80 border border-white/10 px-2 py-1 rounded text-[8px] font-mono text-purple-300 whitespace-nowrap"
                 >
                    await core.optimize()
                 </motion.div>
             </div>
        </div>
    );
}

// --- 04. Deployment: Global Pulse ---
const DeploymentVisual = () => {
    return (
        <div className="absolute inset-0 bg-[#080808] flex items-center justify-center overflow-hidden">
             
             {/* Radar Rings */}
             {[1, 2, 3].map((i) => (
                 <motion.div
                    key={i}
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: "easeOut" }}
                    className="absolute w-32 h-32 border border-horizon-accent/30 rounded-full"
                 />
             ))}

             {/* Central Globe/Server */}
             <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-gray-800 to-black rounded-full border border-white/20 flex items-center justify-center shadow-2xl">
                 <Globe className="text-white/20 w-12 h-12" strokeWidth={1} />
                 
                 {/* Active Status Dot */}
                 <div className="absolute top-2 right-6 w-3 h-3 bg-green-500 rounded-full border-2 border-[#121214] z-20">
                     <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                 </div>
             </div>

             {/* Satellites / Nodes */}
             {[0, 120, 240].map((deg, i) => (
                 <motion.div
                    key={i}
                    initial={{ rotate: deg }}
                    animate={{ rotate: deg + 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute w-48 h-48"
                 >
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#1a1a1a] border border-white/20 rounded-lg flex items-center justify-center -mt-4 shadow-lg">
                         <Server size={12} className="text-horizon-accent" />
                     </div>
                 </motion.div>
             ))}

             {/* Bottom Stats Panel */}
             <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4"
             >
                 <div className="bg-white/5 backdrop-blur px-3 py-1 rounded border border-white/10 text-[10px] font-mono text-gray-400">
                     UPTIME: <span className="text-white">99.99%</span>
                 </div>
                 <div className="bg-white/5 backdrop-blur px-3 py-1 rounded border border-white/10 text-[10px] font-mono text-gray-400">
                     LATENCY: <span className="text-horizon-accent">12ms</span>
                 </div>
             </motion.div>
        </div>
    );
}

const Process: React.FC = () => {
  const getVisual = (id: string) => {
      switch(id) {
          case "01": return <AuditVisual />;
          case "02": return <StrategyVisual />;
          case "03": return <EngineeringVisual />;
          case "04": return <DeploymentVisual />;
          default: return null;
      }
  };

  return (
    <section id="process" className="py-32 bg-horizon-bg relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 -left-64 w-96 h-96 bg-horizon-accent/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-horizon-accent/5 rounded-full blur-[100px]" />
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
        </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-horizon-accent/10 border border-horizon-accent/20 text-horizon-accent text-xs font-semibold tracking-wider uppercase mb-4">
                Our Methodology
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
              From Concept to <span className="text-horizon-accent">Reality</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                A structured, transparent approach to implementing AI in your business. We handle the complexity so you can focus on growth.
            </p>
          </motion.div>
        </div>

        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[2px] md:-translate-x-1/2 z-0">
             <div className="w-full h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          </div>

          <div className="space-y-12 md:space-y-32">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Node */}
                <div className="absolute left-[8px] md:left-1/2 top-8 md:-translate-x-1/2 z-20">
                    <div className="relative flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-black border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(62,206,141,0.3)] z-10">
                            <div className="w-3 h-3 bg-horizon-accent rounded-full animate-pulse" />
                        </div>
                        {/* Glow effect behind node */}
                        <div className="absolute inset-0 bg-horizon-accent/20 blur-xl rounded-full" />
                    </div>
                </div>

                {/* Content Card Wrapper */}
                <div className={`flex-1 pl-16 md:pl-0 ${
                  index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'
                }`}>
                    
                    {/* Glass Card */}
                    <GlassCard 
                        className="p-0 overflow-hidden bg-white/5 border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-[0_0_50px_rgba(62,206,141,0.1)] rounded-3xl group"
                    >
                        {/* Connecting Line (Horizontal) - moved inside or handled by parent */}
                        <div className={`hidden md:block absolute top-12 w-16 h-[1px] bg-gradient-to-r from-horizon-accent/50 to-transparent z-0 ${
                            index % 2 === 0 ? '-right-16 rotate-0' : '-left-16 rotate-180'
                         }`} />

                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />
                        
                        <GlassCardContent className="p-0 flex flex-col xl:flex-row h-full min-h-[320px]">
                            
                            {/* Content Section */}
                            <div className="p-8 xl:w-1/2 relative z-10 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-horizon-accent/10 border border-horizon-accent/20 flex items-center justify-center text-horizon-accent shrink-0 shadow-lg">
                                            {step.icon}
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500 font-mono mb-1 tracking-widest block">STEP {step.id}</span>
                                            <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed mb-8 text-sm md:text-base">
                                        {step.desc}
                                    </p>
                                </div>
                                
                                <div>
                                    <div className="w-full h-[1px] bg-white/5 mb-4" />
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {step.deliverables.map((item, i) => (
                                            <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/5 text-xs text-gray-400">
                                                <CheckCircle2 className="w-3 h-3 text-horizon-accent" />
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500 font-mono flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-horizon-accent rounded-full" />
                                        Est. Duration: {step.duration}
                                    </span>
                                </div>
                            </div>

                            {/* Visual Section (Right Side on Desktop) */}
                            <div className="xl:w-1/2 min-h-[250px] xl:min-h-full relative bg-black/40 border-t xl:border-t-0 xl:border-l border-white/5 overflow-hidden">
                                {getVisual(step.id)}
                            </div>
                            
                        </GlassCardContent>
                    </GlassCard>
                </div>

                {/* Empty Side for layout balance */}
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;