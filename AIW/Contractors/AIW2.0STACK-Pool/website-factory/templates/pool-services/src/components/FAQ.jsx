import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import brandDNA from '../config/brand-dna';

const FALLBACK_FAQ = [
  { q: 'How often should I have my pool cleaned?', a: 'Most residential pools benefit from weekly cleaning to keep the water balanced, the walls brushed, and debris skimmed. In summer, more frequent visits can prevent algae buildup from heat and heavy use.' },
  { q: 'What does a standard pool cleaning include?', a: 'A standard visit covers skimming the surface, brushing walls and steps, vacuuming the floor, emptying baskets, and testing and adjusting the water chemistry. We also inspect the equipment while on-site.' },
  { q: 'How do you handle a green pool?', a: 'Green pools are usually algae outbreaks caused by a chlorine drop. We shock the water, apply algaecide, brush thoroughly, and run the filter on extended cycles. Most pools clear within 24 to 48 hours.' },
  { q: 'Do I need to be home during the service visit?', a: 'No. As long as we have access to the pool area, we can complete the service and leave a detailed report. Many of our regular customers are never home during visits.' },
  { q: 'Are your technicians licensed and insured?', a: 'Yes. Every technician is certified, background-checked, and covered under our commercial liability insurance. We are also licensed through the relevant state contractor boards.' },
  { q: 'What areas do you service?', a: `We serve ${brandDNA.company.serviceRegion || 'the greater metropolitan area'}. Contact us to confirm we cover your specific neighborhood.` },
];

function FAQItem({ item, index, isOpen, onToggle, reduce }) {
  return (
    <div className="border-b border-neutral-dim last:border-b-0">
      <button
        onClick={() => onToggle(index)}
        className="w-full flex items-center justify-between py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        id={`faq-question-${index}`}
      >
        <span className="font-body text-base font-semibold text-ink pr-4">{item.q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
          className="shrink-0 w-6 h-6 rounded-full bg-neutral border border-neutral-dim flex items-center justify-center text-primary"
          aria-hidden="true"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${index}`}
            role="region"
            aria-labelledby={`faq-question-${index}`}
            initial={reduce ? {} : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="font-body text-sm text-silver leading-relaxed pb-5">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const reduce = useReducedMotion();
  const items = brandDNA.faq.length > 0 ? brandDNA.faq : FALLBACK_FAQ;
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="bg-white py-section-gap lg:py-section-gap-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-accent mb-3">
            {brandDNA.copy.faq.label}
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl text-ink">
            {brandDNA.copy.faq.heading}
          </h2>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto"
        >
          {items.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={handleToggle}
              reduce={reduce}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
