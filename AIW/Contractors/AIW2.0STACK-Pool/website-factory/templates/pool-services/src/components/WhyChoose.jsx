import { motion, useReducedMotion } from 'framer-motion';
import brandDNA from '../config/brand-dna';

const WHY_ICONS = [
  // Shield check
  <svg key="0" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3L4 7v6c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V7l-8-4z" stroke="rgb(var(--accent))" strokeWidth="1.5" fill="none" /><path d="M9 12l2 2 4-4" stroke="rgb(var(--accent))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  // Clock
  <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="rgb(var(--accent))" strokeWidth="1.5" /><path d="M12 7v5l3 3" stroke="rgb(var(--accent))" strokeWidth="1.5" strokeLinecap="round" /></svg>,
  // Star
  <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="rgb(var(--accent))" strokeWidth="1.5" fill="none" /></svg>,
  // Leaf
  <svg key="3" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 3C21 3 13 3 9 9c-2 3-2 6-1 9M3 21c2-2 4-4 6-5" stroke="rgb(var(--accent))" strokeWidth="1.5" strokeLinecap="round" fill="none" /></svg>,
  // Wrench
  <svg key="4" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z" stroke="rgb(var(--accent))" strokeWidth="1.5" fill="none" /></svg>,
  // Users
  <svg key="5" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="rgb(var(--accent))" strokeWidth="1.5" fill="none" /><circle cx="9" cy="7" r="4" stroke="rgb(var(--accent))" strokeWidth="1.5" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="rgb(var(--accent))" strokeWidth="1.5" strokeLinecap="round" /></svg>,
];

const FALLBACK_WHY = [
  'Licensed and insured technicians',
  'Same-week scheduling available',
  '5-star rated on Google',
  'Eco-friendly chemical options',
  'All equipment serviced and maintained',
  'Family-owned, locally operated',
];

export default function WhyChoose() {
  const reduce = useReducedMotion();
  const reasons = brandDNA.why_choose_us.length > 0 ? brandDNA.why_choose_us : FALLBACK_WHY;

  return (
    <section id="why-choose" className="bg-white py-section-gap lg:py-section-gap-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-accent mb-3">
            {brandDNA.copy.whyChoose.label}
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl text-ink mb-4">
            {brandDNA.copy.whyChoose.heading}
          </h2>
          {brandDNA.copy.whyChoose.body && (
            <p className="font-body text-lg text-silver max-w-2xl mx-auto">
              {brandDNA.copy.whyChoose.body}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: reduce ? 0 : i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-4 p-5 rounded-xl border border-neutral-dim bg-neutral hover:bg-accent-light/30 transition-colors duration-200"
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                {WHY_ICONS[i % WHY_ICONS.length]}
              </div>
              <span className="font-body text-base font-medium text-ink mt-1.5">{reason}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
