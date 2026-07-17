import { useState, useEffect, useRef } from 'react';
import brandDNA from '../config/brand-dna';

const ChevronDown = ({ className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
    className={`w-3.5 h-3.5 shrink-0 transition-transform duration-150 ${className}`} aria-hidden="true">
    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-primary shrink-0" aria-hidden="true">
    <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
    className="w-3 h-3 text-[var(--color-star)]" aria-hidden="true">
    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
  </svg>
);

export default function StickyNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [expandedMobile, setExpandedMobile] = useState(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const serviceDropdown = brandDNA.services.map(s => ({
    label: s.name,
    href: `/services/${s.slug}`,
  }));

  const areaDropdown = brandDNA.serviceAreas.map(area => ({
    label: area,
    href: `/service-areas/${area.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
  }));

  const aboutDropdown = [
    { label: 'About Us',          href: '/about' },
    { label: 'About the Owner',   href: '/about/owner' },
    { label: 'Meet the Team',     href: '/about/team' },
  ];

  const navItems = [
    { label: 'Home',          href: '/' },
    { label: 'Services',      href: '/services',      dropdown: serviceDropdown },
    { label: 'Past Work',     href: '/gallery' },
    { label: 'Service Areas', href: '/service-areas', dropdown: areaDropdown },
    { label: 'About',         href: '/about',         dropdown: aboutDropdown },
    { label: 'Blog',          href: '/blog' },
    { label: 'Contact',       href: '/contact' },
    { label: 'FAQ',           href: '/faq' },
  ];

  const openMenu = (label) => {
    clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 140);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      {/* ── Announcement bar ─────────────────────────────────────────── */}
      <div className="bg-[var(--color-dark-section)] h-8 flex items-center">
        <div className="max-w-[1200px] mx-auto px-6 w-full flex items-center justify-between gap-4">
          {/* Left: phone + location */}
          <div className="flex items-center gap-4 text-xs font-body text-white/70">
            <a
              href={brandDNA.contact.phoneTelLink}
              className="flex items-center gap-1.5 hover:text-white transition-colors duration-150"
            >
              <PhoneIcon />
              {brandDNA.contact.phone}
            </a>
            <span className="text-white/25 hidden sm:inline">|</span>
            <span className="hidden sm:inline">Serving {brandDNA.company.serviceRegion}</span>
          </div>

          {/* Right: stars + license */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-body text-white/70">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(s => <StarIcon key={s} />)}
            </div>
            <span>{brandDNA.reviews.rating} &middot; {brandDNA.reviews.googleCount} Google reviews</span>
            {brandDNA.company.licenseNumber && (
              <>
                <span className="text-white/25 mx-1">|</span>
                <span>{brandDNA.company.licenseNumber}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Main nav ─────────────────────────────────────────────────── */}
      <div className={`bg-white h-16 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between gap-3">

          {/* Logo */}
          <a href="/" className="shrink-0" aria-label={`${brandDNA.company.name} home`}>
            <span className="font-heading font-extrabold text-xl tracking-tight text-ink uppercase whitespace-nowrap">
              {brandDNA.company.shortName}
            </span>
          </a>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center" aria-label="Main navigation">
            {navItems.map((item) =>
              item.dropdown ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => openMenu(item.label)}
                  onMouseLeave={scheduleClose}
                >
                  <a
                    href={item.href}
                    className="flex items-center gap-1 px-3 py-5 text-[13px] font-heading font-bold uppercase tracking-wider text-neutral hover:text-primary transition-colors duration-150 whitespace-nowrap"
                    aria-expanded={openDropdown === item.label}
                    aria-haspopup="menu"
                  >
                    {item.label}
                    <ChevronDown className={openDropdown === item.label ? 'rotate-180' : ''} />
                  </a>

                  {openDropdown === item.label && (
                    <div
                      className="absolute top-full left-0 bg-white shadow-lg border border-[var(--color-border)] rounded-b-[4px] py-1.5 min-w-[200px] z-50"
                      role="menu"
                      onMouseEnter={() => openMenu(item.label)}
                      onMouseLeave={scheduleClose}
                    >
                      {item.dropdown.map((sub) => (
                        <a
                          key={sub.label}
                          href={sub.href}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-body text-neutral hover:text-primary hover:bg-[var(--color-surface)] transition-colors duration-100"
                          role="menuitem"
                        >
                          <span className="w-1 h-1 rounded-full bg-primary shrink-0" aria-hidden="true" />
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-3 py-5 text-[13px] font-heading font-bold uppercase tracking-wider text-neutral hover:text-primary transition-colors duration-150 whitespace-nowrap"
                >
                  {item.label}
                </a>
              )
            )}
          </nav>

          {/* Desktop CTA */}
          <a
            href="#estimate-form"
            className="hidden lg:inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 text-[11px] font-heading font-extrabold uppercase tracking-widest hover:bg-primary-dark transition-colors duration-150 rounded-[4px] whitespace-nowrap shrink-0"
          >
            Get a Free Quote
          </a>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-ink p-2 ml-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => { setMenuOpen(!menuOpen); setExpandedMobile(null); }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ──────────────────────────────────────────────── */}
      {menuOpen && (
        <nav
          className="lg:hidden bg-white border-t border-[var(--color-border)] shadow-xl flex flex-col max-h-[75vh] overflow-y-auto"
          aria-label="Mobile navigation"
        >
          {navItems.map((item) => (
            <div key={item.label} className="border-b border-[var(--color-border)]">
              {item.dropdown ? (
                <>
                  <button
                    className="w-full flex items-center justify-between px-6 py-4 text-sm font-heading font-bold uppercase tracking-wide text-neutral hover:text-primary transition-colors"
                    onClick={() => setExpandedMobile(expandedMobile === item.label ? null : item.label)}
                    aria-expanded={expandedMobile === item.label}
                  >
                    {item.label}
                    <ChevronDown className={expandedMobile === item.label ? 'rotate-180' : ''} />
                  </button>
                  {expandedMobile === item.label && (
                    <div className="bg-[var(--color-surface)] px-6 py-2 flex flex-col gap-0.5">
                      {item.dropdown.map((sub) => (
                        <a
                          key={sub.label}
                          href={sub.href}
                          className="flex items-center gap-2 py-2.5 text-sm font-body text-neutral hover:text-primary transition-colors"
                          onClick={() => setMenuOpen(false)}
                        >
                          <span className="w-1 h-1 rounded-full bg-primary shrink-0" aria-hidden="true" />
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <a
                  href={item.href}
                  className="block px-6 py-4 text-sm font-heading font-bold uppercase tracking-wide text-neutral hover:text-primary transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              )}
            </div>
          ))}
          <div className="p-4">
            <a
              href="#estimate-form"
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white px-4 py-3.5 font-heading font-extrabold uppercase text-sm tracking-widest rounded-[4px] hover:bg-primary-dark transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Get a Free Quote
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
