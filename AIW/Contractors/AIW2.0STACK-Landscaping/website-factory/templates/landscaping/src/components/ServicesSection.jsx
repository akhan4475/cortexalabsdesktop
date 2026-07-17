import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import brandDNA from '../config/brand-dna.js';

const EASE = [0.16, 1, 0.3, 1];

export default function ServicesSection() {
  const copy = brandDNA.copy.services;
  const services = brandDNA.services;

  if (!services.length) return null;

  return (
    <section className="py-section-gap-lg bg-white" id="services">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <motion.div
              key={svc.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: EASE, delay: i * 0.08 }}
            >
              <Link
                to={`/services/${svc.slug}`}
                className="group flex flex-col gap-4 p-card-pad rounded-2xl border border-silver hover:border-accent/40 bg-white shadow-card hover:shadow-card-lg transition-all duration-200"
              >
                {svc.iconPath && (
                  <img src={svc.iconPath} alt="" className="w-10 h-10" aria-hidden="true" />
                )}
                <h3 className="font-heading text-xl font-semibold text-primary group-hover:text-accent-dark transition-colors duration-150">
                  {svc.name}
                </h3>
                {svc.body && (
                  <p className="text-sm text-neutral-dim leading-relaxed">{svc.body}</p>
                )}
                <span className="text-accent text-sm font-semibold flex items-center gap-1 mt-auto">
                  Learn more
                  <ChevronRight />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
