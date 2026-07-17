import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import brandDNA from '../config/brand-dna';

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'About', href: '/about' },
  { label: 'Service Area', href: '/service-areas' },
  { label: 'Contact', href: '/contact' },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const textClass = scrolled ? 'text-ink' : 'text-white';
  const hoverClass = 'hover:text-accent transition-colors duration-150';

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 h-16 flex items-center transition-all duration-300 ${
          scrolled ? 'bg-white border-b border-neutral-dim shadow-card' : 'bg-transparent'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Home">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <circle cx="14" cy="14" r="12" fill="rgb(var(--primary))" opacity="0.15" />
              <path d="M6 18c2-3 4-4 6-3s4 3 6 2 4-3 4-3" stroke="rgb(var(--primary))" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M6 22c2-3 4-4 6-3s4 3 6 2 4-3 4-3" stroke="rgb(var(--primary))" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
              <circle cx="14" cy="11" r="3" fill="rgb(var(--accent))" opacity="0.85" />
            </svg>
            <span className={`font-heading text-xl leading-none ${textClass}`}>
              {brandDNA.company.shortName}
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                className={`font-body text-sm font-medium ${textClass} ${hoverClass}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA group */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <a
              href={brandDNA.contact.phoneTelLink}
              className={`font-body text-sm font-semibold ${textClass} ${hoverClass} flex items-center gap-1`}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                <path d="M2.5 1a1 1 0 0 0-1 1c0 5.523 4.477 10 10 10a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1 5.99 5.99 0 0 1-1.879-.3 1 1 0 0 0-1.03.243l-1.22 1.22a8.025 8.025 0 0 1-3.034-3.034l1.22-1.22a1 1 0 0 0 .243-1.03A5.99 5.99 0 0 1 5.5 3a1 1 0 0 0-1-1H2.5z" />
              </svg>
              {brandDNA.contact.phone}
            </a>
            <Link
              to="/contact"
              className="bg-accent hover:bg-accent-dark text-white font-body text-sm font-semibold px-4 py-2 rounded-md transition-all duration-150 hover:scale-[1.02] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent whitespace-nowrap"
            >
              {brandDNA.copy.buttonText}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${textClass}`}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="7" x2="19" y2="7" />
              <line x1="3" y1="11" x2="19" y2="11" />
              <line x1="3" y1="15" x2="19" y2="15" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-ink/40 z-50"
              initial={reduce ? {} : { opacity: 0 }}
              animate={reduce ? {} : { opacity: 1 }}
              exit={reduce ? {} : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            ></motion.div>
            <motion.aside
              className="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 flex flex-col shadow-floating"
              initial={reduce ? {} : { x: '100%' }}
              animate={reduce ? {} : { x: 0 }}
              exit={reduce ? {} : { x: '100%' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-neutral-dim">
                <span className="font-heading text-lg text-ink">{brandDNA.company.shortName}</span>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 text-silver hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded"
                  aria-label="Close menu"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="4" y1="4" x2="16" y2="16" />
                    <line x1="16" y1="4" x2="4" y2="16" />
                  </svg>
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-5">
                <ul className="space-y-1">
                  {NAV_LINKS.map(({ label, href }) => (
                    <li key={href}>
                      <Link
                        to={href}
                        className="block px-3 py-2.5 font-body text-base font-medium text-ink hover:text-accent hover:bg-neutral rounded-md transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="p-5 border-t border-neutral-dim space-y-3">
                <a
                  href={brandDNA.contact.phoneTelLink}
                  className="flex items-center justify-center gap-2 w-full py-2.5 border border-primary text-primary font-body text-sm font-semibold rounded-md hover:bg-neutral transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                    <path d="M2.5 1a1 1 0 0 0-1 1c0 5.523 4.477 10 10 10a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1 5.99 5.99 0 0 1-1.879-.3 1 1 0 0 0-1.03.243l-1.22 1.22a8.025 8.025 0 0 1-3.034-3.034l1.22-1.22a1 1 0 0 0 .243-1.03A5.99 5.99 0 0 1 5.5 3a1 1 0 0 0-1-1H2.5z" />
                  </svg>
                  {brandDNA.contact.phone}
                </a>
                <Link
                  to="/contact"
                  className="flex items-center justify-center w-full py-2.5 bg-accent hover:bg-accent-dark text-white font-body text-sm font-semibold rounded-md transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {brandDNA.copy.buttonText}
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
