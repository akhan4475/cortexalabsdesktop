import { motion, useReducedMotion } from 'framer-motion';
import brandDNA from '../config/brand-dna';

export default function TrustBar() {
  const reduce = useReducedMotion();

  const hasChips = brandDNA.copy.trustClaims.length > 0;
  const hasBadges = brandDNA.trust_badges.length > 0;

  if (!hasChips && !hasBadges) return null;

  return (
    <section
      className="bg-primary-dark py-5 border-b border-white/10"
      aria-label="Trust indicators"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {hasChips && (
          <motion.ul
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          >
            {brandDNA.copy.trustClaims.map((claim, i) => (
              <li key={i} className="flex items-center gap-2 font-body text-sm font-medium text-white/80">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="7" fill="rgb(var(--accent))" opacity="0.2" />
                  <path d="M5 8.5l2 2 4-4" stroke="rgb(var(--accent))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {claim}
              </li>
            ))}
          </motion.ul>
        )}

        {hasBadges && (
          <motion.ul
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-6 mt-4"
          >
            {brandDNA.trust_badges.map(({ filename, alt }) => (
              <li key={filename}>
                <img
                  src={`/badges/${filename}`}
                  alt={alt}
                  className="h-8 object-contain opacity-80 grayscale brightness-200"
                  loading="lazy"
                />
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  );
}
