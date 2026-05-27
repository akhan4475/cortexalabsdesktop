import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Mail, Clock } from 'lucide-react';

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#CD3D35]/60 focus:ring-2 focus:ring-[#CD3D35]/10 transition-all placeholder-gray-600';
const labelClass = 'block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });

  return (
    <section id="contact" className="py-24 bg-[#040405] border-t border-white/10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#CD3D35]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-gray-500 text-[10px] font-bold tracking-[0.25em] uppercase mb-4">Contact</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">
            Let's get you <span className="text-[#CD3D35]">more jobs.</span>
          </h2>
          <p className="text-gray-400 text-base leading-relaxed">
            Tell us about your business — we'll reach out within a few hours to talk strategy.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bg-[#040405] border border-white/8 rounded-3xl p-8 md:p-10"
        >
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-[#CD3D35]/15 border border-[#CD3D35]/30 flex items-center justify-center mx-auto mb-5">
                <ArrowRight className="w-6 h-6 text-[#CD3D35]" />
              </div>
              <h3 className="text-white font-bold text-xl mb-2">We got your message!</h3>
              <p className="text-gray-400 text-sm">Expect a reply within a few hours. We'll review your website and come prepared.</p>
            </div>
          ) : (
            <form
              className="space-y-5"
              onSubmit={e => { e.preventDefault(); setSubmitted(true); }}
            >
              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First Name</label>
                  <input type="text" placeholder="John" className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input type="text" placeholder="Smith" className={inputClass} required />
                </div>
              </div>

              {/* Phone + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input type="tel" placeholder="(555) 000-0000" className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input type="email" placeholder="john@company.com" className={inputClass} required />
                </div>
              </div>

              {/* Website URL */}
              <div>
                <label className={labelClass}>Company Website URL</label>
                <input
                  type="text"
                  placeholder="https://yourcompany.com  (write N/A if you don't have one)"
                  className={inputClass}
                />
              </div>

              {/* Message */}
              <div>
                <label className={labelClass}>Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your business — what do you do, where are you located, and what's your biggest challenge with getting new jobs online?"
                  className={`${inputClass} resize-none`}
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 bg-[#CD3D35] hover:bg-[#B83530] text-white font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all active:scale-95 text-base shadow-lg shadow-[#CD3D35]/15"
              >
                Send Message
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Footer meta */}
              <div className="flex items-center justify-center gap-6 pt-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Clock className="w-3.5 h-3.5" />
                  Response within a few hours
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Mail className="w-3.5 h-3.5" />
                  cortexalabs@gmail.com
                </div>
              </div>
            </form>
          )}
        </motion.div>

      </div>
    </section>
  );
};

export default Contact;
