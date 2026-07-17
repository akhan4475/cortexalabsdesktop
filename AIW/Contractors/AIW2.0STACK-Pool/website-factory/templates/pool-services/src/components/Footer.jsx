import { Link } from 'react-router-dom';
import brandDNA from '../config/brand-dna';

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'About', href: '/about' },
  { label: 'Service Area', href: '/service-areas' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

function SocialLink({ href, label, children }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white" role="contentinfo">
      {/* Footer CTA strip */}
      {brandDNA.copy.footerCta && (
        <div className="border-b border-white/10 py-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-body text-base font-semibold text-white/80">
              {brandDNA.copy.footerCta}
            </p>
            <a
              href={brandDNA.contact.phoneTelLink}
              className="font-body text-base font-semibold text-accent hover:text-accent-light transition-colors whitespace-nowrap"
            >
              {brandDNA.contact.phone}
            </a>
          </div>
        </div>
      )}

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4" aria-label="Home">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <circle cx="14" cy="14" r="12" fill="rgb(var(--primary))" opacity="0.2" />
                <path d="M6 18c2-3 4-4 6-3s4 3 6 2 4-3 4-3" stroke="rgb(var(--primary))" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M6 22c2-3 4-4 6-3s4 3 6 2 4-3 4-3" stroke="rgb(var(--primary))" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
                <circle cx="14" cy="11" r="3" fill="rgb(var(--accent))" opacity="0.85" />
              </svg>
              <span className="font-heading text-xl text-white">{brandDNA.company.shortName}</span>
            </Link>
            {brandDNA.company.tagline && (
              <p className="font-body text-sm text-white/60 mb-4 leading-relaxed max-w-xs">
                {brandDNA.company.tagline}
              </p>
            )}
            {brandDNA.company.description && (
              <p className="font-body text-sm text-white/50 leading-relaxed max-w-xs">
                {brandDNA.company.description}
              </p>
            )}

            {/* Social links */}
            <div className="flex items-center gap-2 mt-5">
              <SocialLink href={brandDNA.social.facebook} label="Facebook">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </SocialLink>
              <SocialLink href={brandDNA.social.instagram} label="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </SocialLink>
              <SocialLink href={brandDNA.social.youtube} label="YouTube">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22.5 6.2a2.8 2.8 0 0 0-2-2C18.9 4 12 4 12 4s-6.9 0-8.5.2a2.8 2.8 0 0 0-2 2C1.3 7.8 1.3 12 1.3 12s0 4.2.2 5.8a2.8 2.8 0 0 0 2 2C5.1 20 12 20 12 20s6.9 0 8.5-.2a2.8 2.8 0 0 0 2-2c.2-1.6.2-5.8.2-5.8s0-4.2-.2-5.8zM9.7 15.5V8.5l6.6 3.5-6.6 3.5z" />
                </svg>
              </SocialLink>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-heading text-sm uppercase tracking-widest text-white/40 mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="font-body text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-sm uppercase tracking-widest text-white/40 mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={brandDNA.contact.phoneTelLink}
                  className="font-body text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                    <path d="M2.5 1a1 1 0 0 0-1 1c0 5.523 4.477 10 10 10a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1 5.99 5.99 0 0 1-1.879-.3 1 1 0 0 0-1.03.243l-1.22 1.22a8.025 8.025 0 0 1-3.034-3.034l1.22-1.22a1 1 0 0 0 .243-1.03A5.99 5.99 0 0 1 5.5 3a1 1 0 0 0-1-1H2.5z" />
                  </svg>
                  {brandDNA.contact.phone}
                </a>
              </li>
              {brandDNA.contact.email && (
                <li>
                  <a
                    href={`mailto:${brandDNA.contact.email}`}
                    className="font-body text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      <path d="M2 4h14v10H2V4z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                      <path d="M2 4l7 6 7-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    {brandDNA.contact.email}
                  </a>
                </li>
              )}
              {brandDNA.address.city && (
                <li className="font-body text-sm text-white/60">
                  {brandDNA.address.city}, {brandDNA.address.state}
                </li>
              )}
              {brandDNA.hours.display && brandDNA.hours.display.map((row) => (
                <li key={row.label} className="font-body text-sm text-white/60">
                  {row.label}: {row.value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-white/40">
            {brandDNA.copy.copyright || `© ${year} ${brandDNA.company.name}. All rights reserved.`}
          </p>
          {brandDNA.credit.agency && (
            <p className="font-body text-xs text-white/30">
              Site by{' '}
              {brandDNA.credit.url ? (
                <a
                  href={brandDNA.credit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/60 transition-colors"
                >
                  {brandDNA.credit.agency}
                </a>
              ) : (
                brandDNA.credit.agency
              )}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
