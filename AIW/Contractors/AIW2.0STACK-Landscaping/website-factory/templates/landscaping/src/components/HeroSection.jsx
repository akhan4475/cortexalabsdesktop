import { motion } from 'framer-motion';
import brandDNA from '../config/brand-dna.js';

const FADE_UP = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } };
const EASE = [0.16, 1, 0.3, 1];

export default function HeroSection() {
  const hero = brandDNA.previous_projects[0];
  const heroCopy = brandDNA.copy.hero;

  return (
    <section
      className="relative min-h-screen flex items-center pt-26 pb-16 overflow-hidden"
      aria-label="Hero"
    >
      {hero && (
        <img
          src={`/work/${hero.filename}`}
          alt={hero.alt || heroCopy.imageAlt}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-[640px]">
          <motion.div
            variants={FADE_UP}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}
            className="flex items-center gap-2 mb-6"
          >
            <StarRow />
            <span className="text-ink/80 text-sm font-medium">
              {brandDNA.reviews.rating > 0 && `${brandDNA.reviews.rating}`}
              {brandDNA.reviews.googleCount > 0 && ` · ${brandDNA.reviews.googleCount} Google Reviews`}
            </span>
          </motion.div>

          <motion.h1
            variants={FADE_UP}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.4, ease: EASE, delay: 0.15 }}
            className="font-heading text-5xl lg:text-6xl font-semibold text-ink leading-[1.05] mb-6"
          >
            {heroCopy.headline}
          </motion.h1>

          <motion.p
            variants={FADE_UP}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.4, ease: EASE, delay: 0.25 }}
            className="text-lg text-neutral leading-relaxed mb-8"
          >
            {heroCopy.subheadline}
          </motion.p>

          <motion.div
            variants={FADE_UP}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.4, ease: EASE, delay: 0.32 }}
            className="flex flex-col sm:flex-row gap-3 mb-8"
          >
            <a
              href="#contact-form"
              className="inline-flex items-center justify-center bg-accent hover:bg-accent-dark text-primary-dark font-semibold text-base px-7 py-3.5 rounded-full transition-colors duration-150"
            >
              {brandDNA.copy.buttonText}
            </a>
            <a
              href={brandDNA.contact.phoneTelLink}
              className="inline-flex items-center justify-center gap-2 border border-ink/30 hover:border-ink/60 text-ink font-semibold text-base px-7 py-3.5 rounded-full transition-colors duration-150"
            >
              <PhoneIcon />
              {brandDNA.copy.mobileCallLabel} {brandDNA.contact.phone}
            </a>
          </motion.div>

          {brandDNA.copy.heroTrustChips.length > 0 && (
            <motion.div
              variants={FADE_UP}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.4, ease: EASE, delay: 0.40 }}
              className="flex flex-wrap gap-3"
            >
              {brandDNA.copy.heroTrustChips.map((chip, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 text-sm text-ink/80 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full"
                >
                  <CheckIcon />
                  {chip}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown />
      </div>
    </section>
  );
}

function StarRow() {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="text-accent" aria-hidden="true">
          <path d="M7 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.1l-3.2 1.8.6-3.6L1.8 4.8l3.6-.5L7 1z" />
        </svg>
      ))}
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 2.5C2 2 2.5 1.5 3 1.5h2L6.5 4.5l-1.5 1C5.5 7 7 9 9 10l1-1.5 3 1.5v2c0 .5-.5 1-1 1C5 13.5 2 7 2 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-accent" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-ink/50" aria-hidden="true">
      <path d="M6 10l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
