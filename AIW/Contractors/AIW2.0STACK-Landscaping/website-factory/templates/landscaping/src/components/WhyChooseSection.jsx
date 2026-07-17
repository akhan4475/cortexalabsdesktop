import { motion } from 'framer-motion';
import brandDNA from '../config/brand-dna.js';

const EASE = [0.16, 1, 0.3, 1];

const ICONS = [
  <svg key="clock" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
  <svg key="eye" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" /></svg>,
  <svg key="chat" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>,
  <svg key="trash" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
];

export default function WhyChooseSection() {
  const copy = brandDNA.copy.whyChoose;
  const items = brandDNA.why_choose_us;

  if (!items.length) return null;

  return (
    <section className="py-section-gap-lg bg-white" id="why-choose">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: EASE }}
          className="text-center mb-12"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">
            {copy.label}
          </span>
          <h2 className="font-heading text-4xl font-semibold text-primary mt-2 mb-4">
            {copy.heading}
          </h2>
          <p className="text-neutral-dim max-w-xl mx-auto">{copy.body}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {items.slice(0, 4).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: EASE, delay: i * 0.08 }}
              className="flex gap-4 p-card-pad rounded-2xl border border-silver bg-white shadow-card"
            >
              <div className="shrink-0 w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center text-accent-dark">
                {ICONS[i % ICONS.length]}
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-primary mb-1">{item}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
