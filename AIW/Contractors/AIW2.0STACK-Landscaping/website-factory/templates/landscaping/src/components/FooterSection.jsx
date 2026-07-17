import { Link } from 'react-router-dom';
import brandDNA from '../config/brand-dna.js';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function FooterSection() {
  const company = brandDNA.company;
  const contact = brandDNA.contact;
  const social = brandDNA.social;
  const services = brandDNA.services.slice(0, 4);
  const copy = brandDNA.copy;

  return (
    <footer className="bg-primary text-neutral pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <LeafIcon />
              <span className="font-heading text-xl font-semibold text-ink">{company.shortName}</span>
            </Link>
            {company.tagline && (
              <p className="text-sm text-neutral/80 leading-relaxed">{company.tagline}</p>
            )}
            <div className="flex gap-3 mt-2">
              {social.facebook && (
                <SocialLink href={social.facebook} label="Facebook">
                  <FacebookIcon />
                </SocialLink>
              )}
              {social.instagram && (
                <SocialLink href={social.instagram} label="Instagram">
                  <InstagramIcon />
                </SocialLink>
              )}
              {social.linkedin && (
                <SocialLink href={social.linkedin} label="LinkedIn">
                  <LinkedinIcon />
                </SocialLink>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-ink/60 uppercase tracking-wider mb-1">Navigation</p>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm text-neutral/80 hover:text-accent transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {services.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold text-ink/60 uppercase tracking-wider mb-1">Services</p>
              {services.map((svc) => (
                <Link
                  key={svc.slug}
                  to={`/services/${svc.slug}`}
                  className="text-sm text-neutral/80 hover:text-accent transition-colors duration-150"
                >
                  {svc.name}
                </Link>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-ink/60 uppercase tracking-wider mb-1">Contact</p>
            <a href={contact.phoneTelLink} className="text-sm text-neutral/80 hover:text-accent transition-colors duration-150">
              {contact.phone}
            </a>
            <a href={`mailto:${contact.email}`} className="text-sm text-neutral/80 hover:text-accent transition-colors duration-150 break-all">
              {contact.email}
            </a>
            <p className="text-sm text-neutral/70">{brandDNA.address.full}</p>
            {company.licenseNumber && (
              <p className="text-xs text-neutral/50">License #{company.licenseNumber}</p>
            )}
          </div>
        </div>

        <div className="border-t border-primary-slate/40 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral/50">{copy.copyright}</p>
          {brandDNA.credit.agency && (
            <p className="text-xs text-neutral/40">
              Site by {brandDNA.credit.agency}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}

function LeafIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M6 22C6 22 8 12 18 8C22 6.5 24 6 24 6C24 6 23.5 8 22 12C18 22 6 22 6 22Z" fill="currentColor" className="text-accent" />
      <path d="M6 22C10 18 14 14 18 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary-dark" />
    </svg>
  );
}

function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-full bg-primary-slate/40 flex items-center justify-center text-neutral hover:text-accent hover:bg-primary-slate transition-colors duration-150"
    >
      {children}
    </a>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M10.5 2.5h-1.5a1 1 0 00-1 1v1.5H6.5v2h1.5v5h2v-5h1.5l.5-2H10V3.5a.5.5 0 01.5-.5z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <rect x="2" y="2" width="12" height="12" rx="3" />
      <circle cx="8" cy="8" r="3" />
      <circle cx="11.5" cy="4.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M3 5.5h2v7H3zm1-1.5a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zM7 5.5h1.9v.96h.03C9.27 5.9 10 5.2 11.2 5.2c1.76 0 2.3 1.15 2.3 2.64v4.66h-2V8.4c0-.7-.01-1.6-1-1.6s-1.15.78-1.15 1.55v4.05H7v-7z" />
    </svg>
  );
}
