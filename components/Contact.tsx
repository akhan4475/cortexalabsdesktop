import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, ArrowRight } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-horizon-card border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-horizon-bg border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative"
        >
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-horizon-accent/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Ready to Automate?</h2>
                <p className="text-gray-400">Book a free 15-minute discovery call to see if we're a good fit.</p>
            </div>

            <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Name</label>
                        <input 
                            type="text" 
                            placeholder="John Doe"
                            className="w-full bg-[#252525] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-horizon-accent focus:ring-1 focus:ring-horizon-accent transition-all placeholder-gray-600"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Email</label>
                        <input 
                            type="email" 
                            placeholder="john@company.com"
                            className="w-full bg-[#252525] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-horizon-accent focus:ring-1 focus:ring-horizon-accent transition-all placeholder-gray-600"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">What are you looking to automate?</label>
                    <textarea 
                        rows={4}
                        placeholder="Tell us about your processes..."
                        className="w-full bg-[#252525] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-horizon-accent focus:ring-1 focus:ring-horizon-accent transition-all placeholder-gray-600 resize-none"
                    />
                </div>

                <button className="w-full bg-horizon-accent text-horizon-bg font-bold text-lg py-4 rounded-lg hover:bg-horizon-accentHover transition-colors flex items-center justify-center gap-2 group">
                    Send Request
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center justify-center gap-8 pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail className="w-4 h-4" />
                        hello@horizonai.com
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MessageSquare className="w-4 h-4" />
                        Response within 24h
                    </div>
                </div>
            </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;