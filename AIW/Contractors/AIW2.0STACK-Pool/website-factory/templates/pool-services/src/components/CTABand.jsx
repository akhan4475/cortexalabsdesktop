import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import brandDNA from '../config/brand-dna';

export default function CTABand() {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative py-16 lg:py-20 overflow-hidden"
      aria-label="Call to action"
      style={{ background: 'linear-gradient(135deg, rgb(var(--primary)) 0%, rgb(var(--primary-slate)) 100%)' }}
    >
      {/* Decorative pool wave */}
      <div className="absolute inset-x-0 bottom-0 h-16 opacity-10" aria-hidden="true">
        <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0 30c240-30 480 30 720 0s480-30 720 0v30H0V30z" fill="white" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="font-body text-xs font-semibold uppercase tracking-widest text-accent mb-3"
        >
          {brandDNA.copy.cta.label}
        </motion.p>

        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-4xl lg:text-5xl text-white mb-4"
        >
          {brandDNA.copy.cta.heading}
        </motion.h2>

        {brandDNA.copy.cta.body && (
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-body text-lg text-white/80 mb-8 max-w-xl mx-auto"
          >
            {brandDNA.copy.cta.body}
          </motion.p>
        )}

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/contact"
            className="bg-accent hover:bg-accent-dark text-white font-body text-base font-semibold px-8 py-3.5 rounded-md transition-all duration-150 hover:scale-[1.02] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent whitespace-nowrap shadow-floating"
          >
            {brandDNA.copy.buttonText}
          </Link>
          <a
            href={brandDNA.contact.phoneTelLink}
            className="inline-flex items-center gap-2 font-body text-base font-semibold text-white/80 hover:text-white transition-colors whitespace-nowrap"
          >
            <svg width="18" height="18" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
              <path d="M2.5 1a1 1 0 0 0-1 1c0 5.523 4.477 10 10 10a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1 5.99 5.99 0 0 1-1.879-.3 1 1 0 0 0-1.03.243l-1.22 1.22a8.025 8.025 0 0 1-3.034-3.034l1.22-1.22a1 1 0 0 0 .243-1.03A5.99 5.99 0 0 1 5.5 3a1 1 0 0 0-1-1H2.5z" />
            </svg>
            {brandDNA.contact.phone}
          </a>
        </motion.div>

        {brandDNA.copy.privacyLine && (
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="font-body text-xs text-white/40 mt-5"
          >
            {brandDNA.copy.privacyLine}
          </motion.p>
        )}
      </div>
    </section>
  );
}
