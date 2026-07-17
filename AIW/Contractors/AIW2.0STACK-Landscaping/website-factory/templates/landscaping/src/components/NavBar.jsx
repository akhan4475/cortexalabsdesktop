import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import brandDNA from '../config/brand-dna.js';

const NAV_LINKS = [
  { label: 'Residential', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-10 left-0 right-0 z-40 transition-colors duration-300 ${
        scrolled || menuOpen ? 'bg-primary shadow-floating' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <LeafIcon />
          <span className="font-heading text-xl font-semibold text-ink">
            {brandDNA.company.shortName}
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors duration-150 ${
                pathname.startsWith(link.href)
                  ? 'text-accent'
                  : 'text-ink/80 hover:text-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <a
            href={brandDNA.contact.phoneTelLink}
            className="text-sm text-ink/70 hover:text-ink transition-colors duration-150"
          >
            {brandDNA.contact.phone}
          </a>
          <a
            href="#contact-form"
            className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent-dark text-primary-dark font-semibold text-sm px-5 py-2.5 rounded-full transition-colors duration-150"
          >
            {brandDNA.copy.buttonText}
          </a>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="lg:hidden flex items-center justify-center w-10 h-10 text-ink"
          aria-label="Toggle menu"
        >
          {menuOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-[6.5rem] bg-primary z-30 flex flex-col px-6 pt-8 pb-10 gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-2xl font-heading font-semibold text-ink border-b border-primary-slate pb-4"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="#contact-form"
            className="mt-auto inline-flex items-center justify-center bg-accent hover:bg-accent-dark text-primary-dark font-semibold text-base px-6 py-4 rounded-full transition-colors duration-150"
          >
            {brandDNA.copy.buttonText}
          </a>
          <a
            href={brandDNA.contact.phoneTelLink}
            className="inline-flex items-center justify-center border border-ink/30 text-ink font-medium text-base px-6 py-4 rounded-full"
          >
            {brandDNA.copy.mobileCallLabel} {brandDNA.contact.phone}
          </a>
        </div>
      )}
    </nav>
  );
}

function LeafIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M6 22C6 22 8 12 18 8C22 6.5 24 6 24 6C24 6 23.5 8 22 12C18 22 6 22 6 22Z"
        fill="currentColor"
        className="text-accent"
      />
      <path
        d="M6 22C10 18 14 14 18 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-primary-dark"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
