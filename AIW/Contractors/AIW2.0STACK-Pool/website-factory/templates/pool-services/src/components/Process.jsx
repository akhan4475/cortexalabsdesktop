import { motion, useReducedMotion } from 'framer-motion';
import brandDNA from '../config/brand-dna';

function Step({ step, index, total, reduce }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: reduce ? 0 : index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex gap-5"
    >
      {/* Step number + connector line */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-heading text-lg text-white z-10 shrink-0">
          {step.n}
        </div>
        {index < total - 1 && (
          <div className="w-px flex-1 bg-neutral-dim mt-2" aria-hidden="true" />
        )}
      </div>

      <div className="pb-10">
        <h3 className="font-heading text-xl text-ink mb-2 mt-1.5">{step.title}</h3>
        {step.body && (
          <p className="font-body text-sm text-silver leading-relaxed">{step.body}</p>
        )}
      </div>
    </motion.div>
  );
}

const FALLBACK_STEPS = [
  { n: 1, title: 'Schedule Online', body: 'Pick a time that works for you. We confirm within the hour.' },
  { n: 2, title: 'We Inspect Your Pool', body: 'A certified tech visits, checks chemistry, equipment, and surfaces.' },
  { n: 3, title: 'We Get to Work', body: 'Cleaning, balancing, or repairs done right the first time.' },
  { n: 4, title: 'You Enjoy a Clean Pool', body: 'We send a service report and schedule your next visit.' },
];

export default function Process() {
  const reduce = useReducedMotion();
  const steps = brandDNA.process_steps.length > 0 ? brandDNA.process_steps : FALLBACK_STEPS;

  return (
    <section id="process" className="bg-neutral py-section-gap lg:py-section-gap-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: heading + badge */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-accent mb-3">
              {brandDNA.copy.process.label}
            </p>
            <h2 className="font-heading text-4xl lg:text-5xl text-ink mb-4">
              {brandDNA.copy.process.heading}
            </h2>
            {brandDNA.copy.process.body && (
              <p className="font-body text-lg text-silver leading-relaxed mb-8">
                {brandDNA.copy.process.body}
              </p>
            )}

            {/* Badge */}
            <div className="inline-flex flex-col items-center justify-center bg-primary-dark text-white rounded-2xl px-8 py-6 text-center">
              <span className="font-heading text-4xl leading-none">
                {brandDNA.copy.process.badgeText}
              </span>
              <span className="font-body text-sm text-white/70 mt-1">
                {brandDNA.copy.process.badgeSubtext}
              </span>
            </div>
          </motion.div>

          {/* Right: steps */}
          <div>
            {steps.map((step, i) => (
              <Step key={step.n} step={step} index={i} total={steps.length} reduce={reduce} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
