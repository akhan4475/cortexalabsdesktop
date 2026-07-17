import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import brandDNA from '../config/brand-dna';

const PLACEHOLDER_ITEMS = [
  { filename: 'pool-1.jpg', alt: 'Clean residential swimming pool after service' },
  { filename: 'pool-2.jpg', alt: 'Crystal clear pool water after chemical balance treatment' },
  { filename: 'pool-3.jpg', alt: 'Technician servicing pool equipment' },
  { filename: 'pool-4.jpg', alt: 'Pool deck cleaning and maintenance' },
  { filename: 'pool-5.jpg', alt: 'Before and after green pool recovery' },
  { filename: 'pool-6.jpg', alt: 'Spa and pool combination serviced and sparkling' },
];

export default function Gallery() {
  const reduce = useReducedMotion();
  const projects = brandDNA.previous_projects.length > 0 ? brandDNA.previous_projects : PLACEHOLDER_ITEMS;
  const [lightbox, setLightbox] = useState(null);

  return (
    <section id="gallery" className="bg-white py-section-gap lg:py-section-gap-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-accent mb-3">
            {brandDNA.copy.gallery.label}
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl text-ink mb-4">
            {brandDNA.copy.gallery.heading}
          </h2>
          {brandDNA.copy.gallery.body && (
            <p className="font-body text-lg text-silver max-w-2xl mx-auto">
              {brandDNA.copy.gallery.body}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {projects.slice(0, 6).map((item, i) => {
            const src = item.filename ? `/work/${item.filename}` : item.src;
            return (
              <motion.button
                key={i}
                initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: reduce ? 0 : i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setLightbox({ src, alt: item.alt })}
                className="relative aspect-[4/3] overflow-hidden rounded-xl group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-label={`View ${item.alt}`}
              >
                <img
                  src={src}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary-dark/0 group-hover:bg-primary-dark/20 transition-colors duration-200" aria-hidden="true" />
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-ink/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="font-body text-xs text-white">{item.caption}</p>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <>
            <motion.div
              className="fixed inset-0 bg-ink/80 z-50"
              initial={reduce ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? {} : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setLightbox(null)}
              aria-hidden="true"
            ></motion.div>
            <motion.div
              className="fixed inset-4 sm:inset-8 z-50 flex items-center justify-center"
              initial={reduce ? {} : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? {} : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label={lightbox.alt}
            >
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className="max-w-full max-h-full object-contain rounded-xl shadow-floating"
              />
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-2 right-2 w-9 h-9 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                aria-label="Close image"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <line x1="4" y1="4" x2="12" y2="12" />
                  <line x1="12" y1="4" x2="4" y2="12" />
                </svg>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
