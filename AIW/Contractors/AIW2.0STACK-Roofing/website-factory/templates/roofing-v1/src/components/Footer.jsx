import brandDNA from '../config/brand-dna';

const currentYear = new Date().getFullYear();

export default function Footer() {
  const services = brandDNA.services.length > 0
    ? brandDNA.services.slice(0, 6)
    : [
        { name: 'Roof Replacement', slug: 'roof-replacement' },
        { name: 'Roof Repair', slug: 'roof-repair' },
        { name: 'Storm Damage', slug: 'storm-damage' },
        { name: 'Emergency Roof Repair', slug: 'emergency-roof-repair' },
        { name: 'Insurance Claims', slug: null },
        { name: 'Free Inspection', slug: null },
      ];

  const areas = brandDNA.service_areas.slice(0, 6);

  const gafBadge = brandDNA.trust_badges.find(b => b.type === 'gaf');
  const bbbBadge = brandDNA.trust_badges.find(b => b.type === 'bbb');

  return (
    <footer
      className="bg-[var(--color-dark-section)] border-t border-white/10 pt-14 pb-8"
      aria-label="Site footer"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1 -- Company */}
          <div>
            <p className="font-heading font-bold uppercase text-lg text-white mb-3">
              {brandDNA.company.shortName}
            </p>
            <p className="text-sm font-body text-neutral leading-relaxed mb-4">
              {brandDNA.copy.footer.tagline}
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={brandDNA.contact.phoneTelLink}
                className="inline-flex items-center gap-2 text-sm font-body text-silver hover:text-primary transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                  className="w-4 h-4 shrink-0 text-primary" aria-hidden="true">
                  <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
                </svg>
                {brandDNA.contact.phone}
              </a>
              {brandDNA.contact.email && (
                <a
                  href={`mailto:${brandDNA.contact.email}`}
                  className="inline-flex items-center gap-2 text-sm font-body text-silver hover:text-primary transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                    className="w-4 h-4 shrink-0 text-primary" aria-hidden="true">
                    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                  </svg>
                  {brandDNA.contact.email}
                </a>
              )}
            </div>
            {/* Trust badges */}
            <div className="flex items-center gap-4 mt-5">
              {gafBadge?.imageFile ? (
                <img src={`/badges/${gafBadge.imageFile}`} alt="GAF Certified" className="h-10 w-auto" loading="lazy" />
              ) : (
                <span className="text-xs font-body text-neutral border border-[var(--color-border-light)] rounded-[4px] px-2 py-1">GAF Certified</span>
              )}
              {bbbBadge?.imageFile ? (
                <img src={`/badges/${bbbBadge.imageFile}`} alt="BBB Accredited" className="h-10 w-auto" loading="lazy" />
              ) : (
                <span className="text-xs font-body text-neutral border border-[var(--color-border-light)] rounded-[4px] px-2 py-1">BBB A+</span>
              )}
            </div>
          </div>

          {/* Col 2 -- Services */}
          <div>
            <p className="font-heading font-bold uppercase text-sm text-white mb-4 tracking-wide">Services</p>
            <ul className="flex flex-col gap-2.5" role="list">
              {services.map((svc, i) => (
                <li key={i}>
                  <a
                    href={svc.slug ? `/services/${svc.slug}` : '#estimate'}
                    className="text-sm font-body text-neutral hover:text-primary transition-colors"
                  >
                    {svc.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 -- Areas */}
          <div>
            <p className="font-heading font-bold uppercase text-sm text-white mb-4 tracking-wide">Service Areas</p>
            {areas.length > 0 ? (
              <ul className="flex flex-col gap-2.5" role="list">
                {areas.map((area, i) => (
                  <li key={i}>
                    <a
                      href={`/areas/${area.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm font-body text-neutral hover:text-primary transition-colors"
                    >
                      {area}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm font-body text-neutral-dim">Areas listed after Stage 2</p>
            )}
          </div>

          {/* Col 4 -- Quick links */}
          <div>
            <p className="font-heading font-bold uppercase text-sm text-white mb-4 tracking-wide">Company</p>
            <ul className="flex flex-col gap-2.5" role="list">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Our Work', href: '/gallery' },
                { label: 'Reviews', href: '/reviews' },
                { label: 'Contact', href: '/contact' },
                { label: 'Insurance Claims', href: '/insurance-claims' },
                { label: 'Get an Estimate', href: '#estimate' },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm font-body text-neutral hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs font-body text-neutral-dim">
            &copy; {currentYear} {brandDNA.company.legalName || brandDNA.company.shortName}. All rights reserved.
            {brandDNA.company.licenseNumber && (
              <> &middot; License #{brandDNA.company.licenseNumber}</>
            )}
          </p>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="text-xs font-body text-neutral-dim hover:text-neutral transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-xs font-body text-neutral-dim hover:text-neutral transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
