import brandDNA from '../config/brand-dna';

/**
 * Service-page hero -- full-bleed dark with background image slot.
 * Props: heading (string), subtext (string), image (string, URL or path), breadcrumbLabel (string)
 */
export default function ServiceHero({ heading, subtext, image, breadcrumbLabel }) {
  return (
    <section
      className="relative bg-[var(--color-bg)] min-h-[380px] flex flex-col justify-end overflow-hidden"
      aria-labelledby="service-hero-heading"
    >
      {/* Background image */}
      {image && (
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover object-center"
            loading="eager"
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[rgba(10,15,26,0.65)] to-[rgba(10,15,26,0.3)]" />
        </div>
      )}

      <div className="relative max-w-[1200px] mx-auto px-6 pt-[calc(var(--nav-height)+80px)] pb-12 w-full">
        {breadcrumbLabel && (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-xs font-body text-silver/70" role="list">
              <li><a href="/" className="hover:text-primary transition-colors">{brandDNA.company.shortName}</a></li>
              <li aria-hidden="true">/</li>
              <li><a href="/services" className="hover:text-primary transition-colors">Services</a></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-silver">{breadcrumbLabel}</li>
            </ol>
          </nav>
        )}

        <h1
          id="service-hero-heading"
          className="font-heading font-bold uppercase text-5xl md:text-6xl text-white leading-tight mb-4 max-w-[640px]"
        >
          {heading}
        </h1>
        {subtext && (
          <p className="text-base font-body text-silver max-w-[520px] leading-relaxed mb-8">
            {subtext}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#estimate"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-[var(--color-bg)] font-heading font-bold uppercase tracking-wide text-sm px-7 py-3.5 rounded-[4px] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {brandDNA.copy.buttonText.getEstimate}
          </a>
          <a
            href={brandDNA.contact.phoneTelLink}
            className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white text-white font-heading font-bold uppercase tracking-wide text-sm px-7 py-3.5 rounded-[4px] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
              className="w-4 h-4" aria-hidden="true">
              <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
            </svg>
            {brandDNA.contact.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
