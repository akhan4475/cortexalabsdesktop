import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import brandDNA from '../config/brand-dna';

const FALLBACK_AREAS = [
  'Scottsdale', 'Tempe', 'Mesa', 'Chandler', 'Gilbert',
  'Peoria', 'Glendale', 'Surprise', 'Goodyear', 'Avondale',
  'Fountain Hills', 'Paradise Valley', 'Cave Creek', 'Queen Creek', 'Ahwatukee',
];

export default function ServiceAreas() {
  const reduce = useReducedMotion();
  const areas = brandDNA.serviceAreas.length > 0 ? brandDNA.serviceAreas : FALLBACK_AREAS;

  return (
    <section id="service-areas" className="bg-primary-dark py-section-gap lg:py-section-gap-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: heading */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-accent mb-3">
              {brandDNA.copy.serviceAreas.label}
            </p>
            <h2 className="font-heading text-4xl lg:text-5xl text-white mb-4">
              {brandDNA.copy.serviceAreas.heading}
            </h2>
            {brandDNA.copy.serviceAreas.body && (
              <p className="font-body text-lg text-white/70 leading-relaxed mb-6">
                {brandDNA.copy.serviceAreas.body}
              </p>
            )}

            {/* ServiceAreaCard inline */}
            <div className="bg-white/10 border border-white/20 rounded-xl p-5">
              <h3 className="font-heading text-xl text-white mb-2">
                {brandDNA.copy.serviceAreaCard.heading}
              </h3>
              {brandDNA.copy.serviceAreaCard.body && (
                <p className="font-body text-sm text-white/70 leading-relaxed mb-4">
                  {brandDNA.copy.serviceAreaCard.body}
                </p>
              )}
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-body text-sm font-semibold px-5 py-2.5 rounded-md transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {brandDNA.copy.buttonText}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Right: area chips */}
          <motion.ul
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-2.5"
            aria-label="Service areas"
          >
            {areas.map((area) => (
              <li key={area}>
                <Link
                  to={`/service-areas/${area.toLowerCase().replace(/\s+/g, '-')}`}
                  className="font-body text-sm font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 px-4 py-2 rounded-full transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {area}
                </Link>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
