import brandDNA from '../config/brand-dna';

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
      className="w-4 h-4 shrink-0 text-primary" aria-hidden="true">
      <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
    </svg>
  );
}

export default function ServiceAreaCards() {
  const locationPages = brandDNA.location_pages;
  const fallbackAreas = brandDNA.serviceAreas || brandDNA.service_areas || [];
  const state = brandDNA.address.state;

  const areas = locationPages && locationPages.length > 0
    ? locationPages
    : fallbackAreas.map(a => ({ cityName: a, slug: slugify(a), description: null, distance: null }));

  return (
    <section className="bg-[var(--color-surface)] py-section-gap-lg" aria-labelledby="service-areas-heading">
      <div className="max-w-[1200px] mx-auto px-6">
        <header className="mb-10">
          <p className="text-xs font-body font-semibold uppercase tracking-[0.12em] text-primary mb-2">
            {brandDNA.copy.serviceAreas.label}
          </p>
          <h2 id="service-areas-heading" className="font-heading font-bold uppercase text-4xl text-ink leading-tight">
            {brandDNA.copy.serviceAreas.heading}
          </h2>
          <p className="mt-3 text-base font-body text-neutral max-w-[520px]">
            {brandDNA.copy.serviceAreas.body}
          </p>
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
          {areas.map((area) => {
            const slug = area.slug || slugify(area.cityName);
            const name = area.cityName || area;
            return (
              <li key={slug}>
                <a
                  href={`/service-areas/${slug}`}
                  className="flex items-start gap-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[6px] p-5 hover:border-primary hover:shadow-sm transition-all group"
                >
                  <MapPinIcon />
                  <div className="min-w-0">
                    <p className="font-heading font-bold uppercase text-base text-ink group-hover:text-primary transition-colors">
                      {name}, {area.state || state}
                    </p>
                    {area.description && (
                      <p className="text-xs font-body text-neutral mt-1 leading-relaxed line-clamp-2">
                        {area.description}
                      </p>
                    )}
                    {area.distance && (
                      <p className="text-xs font-body text-neutral-dim mt-1">{area.distance} from our base</p>
                    )}
                  </div>
                  <span className="ml-auto shrink-0 text-primary font-body font-semibold text-xs group-hover:translate-x-0.5 transition-transform">
                    &rarr;
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 text-center">
          <a
            href="/service-areas"
            className="inline-flex items-center gap-2 border border-[var(--color-border)] text-sm font-body font-semibold text-neutral hover:text-primary hover:border-primary transition-colors px-5 py-2.5 rounded-[4px]"
          >
            View All Service Areas &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
