import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-[#0d0d0d] relative overflow-hidden border-t border-white/5">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle Grid Pattern with Fade */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        {/* Animated Blurred Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.08, 0.03],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-horizon-accent rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.03, 0.06, 0.03],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-48 -right-24 w-[600px] h-[600px] bg-blue-500 rounded-full blur-[140px]" 
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-horizon-accent/10 border border-horizon-accent/20 text-horizon-accent text-xs font-semibold tracking-wider uppercase mb-6">
              Get Started
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight">
              Ready to scale your <span className="text-horizon-accent">Operations?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-lg">
              Book a free discovery call or drop us a message. We'll audit your current workflows and show you exactly where AI can save you 20+ hours a week.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-horizon-accent group-hover:border-horizon-accent/50 transition-colors">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold">Secure Infrastructure</h4>
                  <p className="text-gray-500 text-sm">Enterprise-grade security standards.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-horizon-accent group-hover:border-horizon-accent/50 transition-colors">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold">Rapid Deployment</h4>
                  <p className="text-gray-500 text-sm">Custom systems live in 2-4 weeks.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-[#141414]/80 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl relative group"
          >
            {/* Subtle glow on card edges */}
            <div className="absolute inset-0 bg-gradient-to-tr from-horizon-accent/5 via-transparent to-white/5 rounded-[32px] pointer-events-none" />

            <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-horizon-accent/50 focus:ring-4 focus:ring-horizon-accent/5 transition-all placeholder-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Business Email</label>
                <input 
                  type="email" 
                  placeholder="john@company.ai"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-horizon-accent/50 focus:ring-4 focus:ring-horizon-accent/5 transition-all placeholder-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  rows={4}
                  placeholder="Tell us about your automation goals..."
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-horizon-accent/50 focus:ring-4 focus:ring-horizon-accent/5 transition-all placeholder-gray-700 resize-none"
                />
              </div>

              <button className="w-full bg-horizon-accent text-horizon-bg font-bold text-lg py-5 rounded-2xl hover:bg-white transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden shadow-lg shadow-horizon-accent/10">
                <span className="relative z-10">Send Inquiry</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              </button>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Mail className="w-3.5 h-3.5 text-horizon-accent" />
                  horizondigitalai@gmail.com
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MessageSquare className="w-3.5 h-3.5 text-horizon-accent" />
                  Response within 2h
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;