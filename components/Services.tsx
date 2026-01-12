import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Workflow, Cpu, Megaphone, ChevronLeft, ChevronRight, Calendar, Clock, BarChart3, ShieldCheck, Zap, Globe, MessageCircle } from 'lucide-react';

const services = [
  {
    id: "sales",
    icon: <Bot className="w-8 h-8" />,
    title: "AI Sales Engine",
    shortDesc: "Closes leads for you 24/7.",
    fullDesc: "Meet a representative that never sleeps, never takes breaks, and never stops closing. Our Techify chat agent is trained to follow up, qualify leads, set appointments, and close them nonstop.",
    stats: "7.08X FASTER | 1285 T/C",
    steps: [
      {
        id: 1,
        icon: <Clock className="w-8 h-8" />,
        title: "24/7 LEAD QUALIFYING",
        desc: "The system starts filtering traffic as soon as it hits your website. It finds and captures qualified leads and leads them to a close immediately."
      },
      {
        id: 2,
        icon: <Calendar className="w-8 h-8" />,
        title: "INSTANT BOOKING",
        desc: "Once a lead is qualified, the system acts instantly. It locks in time on your calendar, handles reminders, and chases no-shows."
      },
      {
        id: 3,
        icon: <Zap className="w-8 h-8" />,
        title: "NO BREAKS",
        desc: "The system handles objections and pushes the deal through. It never stops, generating money 24/7, replacing the output of multiple human reps."
      }
    ]
  },
  {
    id: "workflow",
    icon: <Workflow className="w-8 h-8" />,
    title: "Workflow Automations",
    shortDesc: "Operations on autopilot.",
    fullDesc: "Eliminate manual data entry and repetitive tasks. We connect your entire tech stack to ensure data flows seamlessly between your CRM, project management tools, and communication channels.",
    stats: "95% TIME SAVED | 0 ERRORS",
    steps: [
      {
        id: 1,
        icon: <Globe className="w-8 h-8" />,
        title: "UNIFIED ECOSYSTEM",
        desc: "We bridge the gaps between Slack, Notion, Hubspot, and 50+ other tools so your data is always synchronized in real-time."
      },
      {
        id: 2,
        icon: <ShieldCheck className="w-8 h-8" />,
        title: "ERROR ELIMINATION",
        desc: "Human error in data entry costs businesses billions. Our deterministic workflows ensure 100% accuracy in every record transfer."
      },
      {
        id: 3,
        icon: <Zap className="w-8 h-8" />,
        title: "INSTANT TRIGGERS",
        desc: "When a sale happens, invoices are sent, onboarding begins, and the team is notified instantly without a single click."
      }
    ]
  },
  {
    id: "custom",
    icon: <Cpu className="w-8 h-8" />,
    title: "Custom Applications",
    shortDesc: "Tailored software solutions.",
    fullDesc: "Off-the-shelf software rarely fits perfectly. We engineer custom AI-powered dashboards and internal tools specifically designed for your unique business logic and KPIs.",
    stats: "100% CUSTOM | ENTERPRISE GRADE",
    steps: [
      {
        id: 1,
        icon: <BarChart3 className="w-8 h-8" />,
        title: "PROPRIETARY DATA",
        desc: "We train models on your specific historical data, creating tools that understand your business context better than any generic AI."
      },
      {
        id: 2,
        icon: <ShieldCheck className="w-8 h-8" />,
        title: "SECURE ARCHITECTURE",
        desc: "Built with enterprise-grade security protocols, ensuring your sensitive business intelligence remains protected and private."
      },
      {
        id: 3,
        icon: <Globe className="w-8 h-8" />,
        title: "SCALABLE INFRASTRUCTURE",
        desc: "Built on robust cloud infrastructure designed to handle millions of requests as your business grows without performance degradation."
      }
    ]
  },
  {
    id: "marketing",
    icon: <Megaphone className="w-8 h-8" />,
    title: "Marketing Automation",
    shortDesc: "Content at scale.",
    fullDesc: "Dominate your niche with an AI content engine that researches, writes, and schedules high-converting content across all your social channels automatically.",
    stats: "30X CONTENT OUTPUT | SEO OPTIMIZED",
    steps: [
      {
        id: 1,
        icon: <Bot className="w-8 h-8" />,
        title: "CONTENT GENERATION",
        desc: "Our agents research trending topics in your industry and draft high-quality posts, blogs, and newsletters that match your brand voice."
      },
      {
        id: 2,
        icon: <Calendar className="w-8 h-8" />,
        title: "AUTO-SCHEDULING",
        desc: "Content is automatically queued and posted at peak engagement times across LinkedIn, Twitter, and your blog."
      },
      {
        id: 3,
        icon: <MessageCircle className="w-8 h-8" />,
        title: "ENGAGEMENT LOOP",
        desc: "The system doesn't just post; it monitors comments and engagement, providing analytics to refine future content strategy."
      }
    ]
  }
];

const Services: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextService = () => {
    setActiveIndex((prev) => (prev + 1) % services.length);
  };

  const prevService = () => {
    setActiveIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  return (
    <section id="services" className="py-24 bg-horizon-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <span className="inline-block py-1 px-3 rounded-full bg-horizon-accent/10 border border-horizon-accent/20 text-horizon-accent text-xs font-semibold tracking-wider uppercase mb-4">
                    Our Frameworks
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                    Autonomous <span className="text-horizon-accent">Growth Systems</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    Modular AI infrastructures designed to replace manual overhead with intelligent speed.
                </p>
            </motion.div>
        </div>

        {/* Carousel Navigation Bar */}
        <div className="flex items-center gap-4 mb-16">
            <button 
                onClick={prevService}
                className="hidden md:flex p-4 rounded-full bg-horizon-card border border-white/10 hover:border-horizon-accent/50 text-white hover:text-horizon-accent transition-all hover:scale-110 active:scale-95 z-20"
            >
                <ChevronLeft size={24} />
            </button>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                {services.map((service, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <div 
                            key={service.id}
                            onClick={() => setActiveIndex(index)}
                            className={`
                                cursor-pointer relative p-6 rounded-xl border transition-all duration-300 group
                                ${isActive 
                                    ? 'bg-[#151515] border-horizon-accent shadow-[0_0_20px_rgba(62,206,141,0.15)]' 
                                    : 'bg-horizon-card border-white/5 hover:border-white/20'
                                }
                            `}
                        >
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-b from-horizon-accent/5 to-transparent rounded-xl pointer-events-none" />
                            )}
                            <div className="flex flex-col items-center md:items-start text-center md:text-left h-full justify-center">
                                <div className={`mb-3 ${isActive ? 'text-horizon-accent' : 'text-gray-400 group-hover:text-white'}`}>
                                    {service.icon}
                                </div>
                                <h3 className={`font-bold text-sm md:text-base uppercase tracking-wider ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                    {service.title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-2 hidden md:block">
                                    {service.shortDesc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button 
                onClick={nextService}
                className="hidden md:flex p-4 rounded-full bg-horizon-card border border-white/10 hover:border-horizon-accent/50 text-white hover:text-horizon-accent transition-all hover:scale-110 active:scale-95 z-20"
            >
                <ChevronRight size={24} />
            </button>
            
            {/* Mobile Navigation controls shown below cards on mobile */}
            <div className="md:hidden flex justify-between w-full absolute top-1/2 -translate-y-1/2 pointer-events-none px-2">
                 <button onClick={prevService} className="pointer-events-auto p-2 bg-black/50 backdrop-blur rounded-full text-white"><ChevronLeft /></button>
                 <button onClick={nextService} className="pointer-events-auto p-2 bg-black/50 backdrop-blur rounded-full text-white"><ChevronRight /></button>
            </div>
        </div>

        {/* Expanded Content Area */}
        <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                    transition={{ duration: 0.4 }}
                    className="space-y-12"
                >
                    {/* Title & Description */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-horizon-accent text-sm font-mono uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-horizon-accent animate-pulse" />
                            {services[activeIndex].stats}
                        </div>
                        <h3 className="text-3xl md:text-4xl font-display font-bold text-white">
                            {services[activeIndex].title}
                        </h3>
                        <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-4xl border-l-2 border-horizon-accent/50 pl-6">
                            {services[activeIndex].fullDesc}
                        </p>
                    </div>

                    {/* How It Works Grid */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">HOW IT WORKS</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {services[activeIndex].steps.map((step) => (
                                <div key={step.id} className="bg-horizon-card border border-white/5 p-8 rounded-2xl relative group hover:border-white/10 transition-colors">
                                    <div className="absolute top-6 left-6 text-[80px] font-bold text-white/[0.03] leading-none select-none group-hover:text-white/[0.05] transition-colors">
                                        {step.id}
                                    </div>
                                    <div className="relative z-10">
                                        <div className="mb-6 text-horizon-accent bg-horizon-accent/10 w-12 h-12 rounded-lg flex items-center justify-center">
                                            {step.icon}
                                        </div>
                                        <h5 className="text-lg font-bold text-white mb-3 uppercase tracking-wide">
                                            {step.title}
                                        </h5>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default Services;