import { motion } from 'framer-motion';
import brandDNA from '../config/brand-dna.js';

const EASE = [0.16, 1, 0.3, 1];

export default function ServiceAreasSection() {
  const copy = brandDNA.copy.serviceAreas;
  const areas = brandDNA.serviceAreas;
  const mapUrl = brandDNA.contact.mapsEmbedUrl;

  if (!areas.length) return null;

  return (
    <section className="py-section-gap-lg bg-white" id="service-areas">
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

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="flex flex-wrap gap-3">
              {areas.map((city, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-silver bg-white text-sm text-primary font-medium shadow-card hover:border-accent/40 hover:shadow-card-lg transition-all duration-150"
                >
                  <PinIcon />
                  {city}
                </span>
              ))}
            </div>
          </motion.div>

          {mapUrl && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.1 }}
              className="rounded-2xl overflow-hidden shadow-card-lg aspect-[4/3] border border-silver"
            >
              <iframe
                src={mapUrl}
                title="Service area map"
                loading="lazy"
                className="w-full h-full"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-accent" aria-hidden="true">
      <path d="M6 1a3.5 3.5 0 013.5 3.5c0 2.5-3.5 7-3.5 7S2.5 7 2.5 4.5A3.5 3.5 0 016 1z" fill="currentColor" />
    </svg>
  );
}
