import { motion } from 'framer-motion';
import brandDNA from '../config/brand-dna.js';

const EASE = [0.16, 1, 0.3, 1];

export default function ProcessSection() {
  const copy = brandDNA.copy.process;
  const steps = brandDNA.process_steps;

  if (!steps.length) return null;

  return (
    <section className="py-section-gap-lg bg-primary" id="process">
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
          <h2 className="font-heading text-4xl font-semibold text-ink mt-2 mb-4">
            {copy.heading}
          </h2>
          <p className="text-neutral max-w-xl mx-auto">{copy.body}</p>
        </motion.div>

        <div className="relative grid md:grid-cols-3 gap-8 mb-12">
          <div className="hidden md:block absolute top-8 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-primary-slate" />
          {steps.map((step, i) => (
            <motion.div
              key={step.n || i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: EASE, delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="relative z-10 w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                <span className="font-heading text-2xl font-semibold text-primary-dark">
                  {step.n || i + 1}
                </span>
              </div>
              <h3 className="font-heading text-xl font-semibold text-ink">{step.title}</h3>
              {step.body && <p className="text-neutral text-sm leading-relaxed">{step.body}</p>}
            </motion.div>
          ))}
        </div>

        {copy.badgeText && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.3 }}
            className="flex flex-col items-center text-center bg-primary-slate/40 border border-primary-slate rounded-2xl p-8 max-w-xl mx-auto"
          >
            <p className="font-heading text-xl font-semibold text-ink mb-1">{copy.badgeText}</p>
            {copy.badgeSubtext && (
              <p className="text-neutral text-sm">{copy.badgeSubtext}</p>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
