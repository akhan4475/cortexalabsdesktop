import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import brandDNA from '../config/brand-dna';

const STAGGER = 0.07;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Hero() {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : STAGGER } },
  };

  const item = reduce ? {} : fadeUp;

  return (
    <section
      className="relative min-h-screen flex overflow-hidden"
      aria-label="Hero"
    >
      {/* Left panel */}
      <div className="relative z-10 w-full md:w-[55%] flex items-center">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgb(var(--primary-dark)) 0%, rgb(var(--primary-slate)) 100%)',
          }}
          aria-hidden="true"
        />
        <motion.div
          className="relative z-10 px-8 sm:px-12 lg:px-16 py-32 md:py-40 max-w-xl"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.p
            variants={item}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-body text-xs font-semibold uppercase tracking-widest text-accent mb-4"
          >
            {brandDNA.copy.hero.eyebrow}
          </motion.p>

          <motion.h1
            variants={item}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl leading-none text-white mb-5"
          >
            {brandDNA.copy.hero.headline}
          </motion.h1>

          <motion.p
            variants={item}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="font-body text-lg text-white/80 mb-8 leading-relaxed max-w-md"
          >
            {brandDNA.copy.hero.subheadline}
          </motion.p>

          {brandDNA.copy.heroTrustChips.length > 0 && (
            <motion.ul
              variants={item}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-2 mb-8"
              aria-label="Trust indicators"
            >
              {brandDNA.copy.heroTrustChips.map((chip) => (
                <li
                  key={chip}
                  className="font-body text-xs font-medium text-white/90 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full"
                >
                  {chip}
                </li>
              ))}
            </motion.ul>
          )}

          <motion.div
            variants={item}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-start gap-3 mb-8"
          >
            <Link
              to="/contact"
              className="bg-accent hover:bg-accent-dark text-white font-body text-base font-semibold px-6 py-3 rounded-md transition-all duration-150 hover:scale-[1.02] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent whitespace-nowrap"
            >
              {brandDNA.copy.buttonText}
            </Link>
            <a
              href="#pricing"
              className="font-body text-sm font-semibold text-white/80 hover:text-white border border-white/30 hover:border-white/60 px-6 py-3 rounded-md transition-all duration-150 whitespace-nowrap"
            >
              View Pricing
            </a>
          </motion.div>

          <motion.a
            variants={item}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            href={brandDNA.contact.phoneTelLink}
            className="inline-flex items-center gap-2 font-body text-sm font-semibold text-white/60 hover:text-white transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
              <path d="M2.5 1a1 1 0 0 0-1 1c0 5.523 4.477 10 10 10a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1 5.99 5.99 0 0 1-1.879-.3 1 1 0 0 0-1.03.243l-1.22 1.22a8.025 8.025 0 0 1-3.034-3.034l1.22-1.22a1 1 0 0 0 .243-1.03A5.99 5.99 0 0 1 5.5 3a1 1 0 0 0-1-1H2.5z" />
            </svg>
            {brandDNA.contact.phone}
          </motion.a>
        </motion.div>
      </div>

      {/* Right panel: desktop hero photo */}
      <div className="hidden md:block md:w-[45%] relative" aria-hidden="true">
        <img
          src="/hero/pool-hero.jpg"
          alt={brandDNA.copy.hero.imageAlt}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchpriority="high"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgb(var(--primary-dark)) 0%, transparent 18%)' }}
        />
      </div>

      {/* Mobile: full-bleed background image */}
      <div className="absolute inset-0 md:hidden" aria-hidden="true">
        <img
          src="/hero/pool-hero.jpg"
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-primary-dark/85" />
      </div>
    </section>
  );
}
