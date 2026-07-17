import brandDNA from '../config/brand-dna';

/**
 * Inner-page hero strip -- used on About, Reviews, Gallery, Contact, Insurance.
 * Props: heading (string), subtext (string), breadcrumb (string, optional)
 */
export default function PageHero({ heading, subtext, breadcrumb }) {
  return (
    <section
      className="bg-[var(--color-dark-section)] pt-[calc(var(--nav-height)+40px)] pb-12"
      aria-labelledby="page-hero-heading"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-xs font-body text-neutral-dim" role="list">
              <li><a href="/" className="hover:text-primary transition-colors">{brandDNA.company.shortName}</a></li>
              <li aria-hidden="true" className="text-neutral-dim">/</li>
              <li aria-current="page" className="text-neutral">{breadcrumb}</li>
            </ol>
          </nav>
        )}
        <h1
          id="page-hero-heading"
          className="font-heading font-bold uppercase text-5xl md:text-6xl text-white leading-tight mb-4"
        >
          {heading}
        </h1>
        {subtext && (
          <p className="text-base font-body text-silver max-w-[560px] leading-relaxed">
            {subtext}
          </p>
        )}
      </div>
    </section>
  );
}
