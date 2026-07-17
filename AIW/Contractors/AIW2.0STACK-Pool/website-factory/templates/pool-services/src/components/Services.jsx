import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import brandDNA from '../config/brand-dna';

function ServiceCard({ service, index, reduce }) {
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: reduce ? 0 : index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-white border border-neutral-dim rounded-xl p-6 shadow-card hover:shadow-card-lg transition-shadow duration-200 flex flex-col"
    >
      {service.iconPath ? (
        <img
          src={service.iconPath}
          alt=""
          className="w-10 h-10 mb-4 object-contain"
          loading="lazy"
          aria-hidden="true"
        />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="9" r="5" stroke="rgb(var(--primary))" strokeWidth="1.5" fill="none" />
            <path d="M4 19c0-3 3-5 7-5s7 2 7 5" stroke="rgb(var(--primary))" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      )}

      <h3 className="font-heading text-xl text-ink mb-2">{service.name}</h3>

      {service.body && (
        <p className="font-body text-sm text-silver leading-relaxed flex-1 mb-4">{service.body}</p>
      )}

      <Link
        to={`/${service.slug}`}
        className="font-body text-sm font-semibold text-primary group-hover:text-accent transition-colors mt-auto inline-flex items-center gap-1"
        aria-label={`Learn more about ${service.name}`}
      >
        Learn more
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </motion.article>
  );
}

export default function Services() {
  const reduce = useReducedMotion();

  return (
    <section id="services" className="bg-white py-section-gap lg:py-section-gap-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-accent mb-3">
            {brandDNA.copy.services.label}
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl text-ink mb-4">
            {brandDNA.copy.services.heading}
          </h2>
          {brandDNA.copy.services.body && (
            <p className="font-body text-lg text-silver max-w-2xl mx-auto">
              {brandDNA.copy.services.body}
            </p>
          )}
        </motion.div>

        {brandDNA.services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandDNA.services.map((service, i) => (
              <ServiceCard key={service.slug} service={service} index={i} reduce={reduce} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Pool Cleaning', 'Pool Maintenance', 'Pool Repair', 'Pool Opening & Closing', 'Chemical Service', 'Pool Installation'].map((name, i) => (
              <div key={name} className="bg-neutral border border-neutral-dim rounded-xl p-6 shadow-card">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <circle cx="11" cy="9" r="5" stroke="rgb(var(--primary))" strokeWidth="1.5" fill="none" />
                    <path d="M4 19c0-3 3-5 7-5s7 2 7 5" stroke="rgb(var(--primary))" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl text-ink">{name}</h3>
              </div>
            ))}
          </div>
        )}

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mt-10"
        >
          <Link
            to="/services"
            className="inline-flex items-center gap-2 font-body text-sm font-semibold text-primary hover:text-accent border border-primary hover:border-accent px-6 py-3 rounded-md transition-all duration-150"
          >
            View all services
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
