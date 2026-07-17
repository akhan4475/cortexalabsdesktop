import brandDNA from '../config/brand-dna';
import StickyNav from '../components/StickyNav';
import PageHero from '../components/PageHero';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
      className="w-5 h-5 text-primary shrink-0" aria-hidden="true">
      <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
      className="w-4 h-4 text-primary shrink-0" aria-hidden="true">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
    </svg>
  );
}

export default function ServiceAreasPage() {
  const locationPages = brandDNA.location_pages;
  const fallbackAreas = brandDNA.serviceAreas || [];
  const state = brandDNA.address.state;

  const areas = locationPages && locationPages.length > 0
    ? locationPages
    : fallbackAreas.map(a => ({ cityName: a, slug: slugify(a), description: null, county: null, distance: null }));

  return (
    <>
      <StickyNav />
      <main>
        <PageHero
          label={brandDNA.copy.serviceAreas.label}
          heading={brandDNA.pages.serviceAreas.heading}
          subtext={brandDNA.pages.serviceAreas.subheading}
          breadcrumbLabel="Service Areas"
        />

        {/* Intro */}
        <section className="bg-[var(--color-bg)] py-section-gap-lg">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-[640px] mb-12">
              <p className="text-base font-body text-neutral leading-relaxed mb-4">
                {brandDNA.company.shortName} is based in {brandDNA.address.city}, {state} and serves homeowners throughout Carroll County and parts of Baltimore County. Free estimates in all areas listed below. No travel charge within our service area.
              </p>
              <ul className="flex flex-wrap gap-3" role="list">
                {[
                  "Free estimates, no travel charge",
                  `${brandDNA.company.licenseNumber}`,
                  "Same-day response for active leaks",
                  "24/7 emergency service",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-sm font-body text-neutral">
                    <CheckIcon /> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Area cards grid */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" role="list">
              {areas.map((area) => {
                const slug = area.slug || slugify(area.cityName);
                const name = area.cityName || area;
                return (
                  <li key={slug}>
                    <a
                      href={`/service-areas/${slug}`}
                      className="flex flex-col gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[6px] p-6 hover:border-primary hover:shadow-sm transition-all group h-full"
                    >
                      <div className="flex items-center gap-2">
                        <MapPinIcon />
                        <p className="font-heading font-bold uppercase text-lg text-ink group-hover:text-primary transition-colors">
                          {name}, {area.state || state}
                        </p>
                      </div>
                      {area.county && (
                        <p className="text-xs font-body text-neutral-dim">{area.county}</p>
                      )}
                      {area.description && (
                        <p className="text-sm font-body text-neutral leading-relaxed flex-1">
                          {area.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--color-border)]">
                        {area.distance ? (
                          <span className="text-xs font-body text-neutral-dim">{area.distance} from base</span>
                        ) : (
                          <span className="text-xs font-body text-primary font-semibold">Home base</span>
                        )}
                        <span className="text-sm text-primary font-body font-semibold group-hover:translate-x-0.5 transition-transform">
                          Free estimate &rarr;
                        </span>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Not in list CTA */}
            <div className="mt-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[6px] p-8 flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <h2 className="font-heading font-bold uppercase text-2xl text-ink mb-2">
                  Not Seeing Your City?
                </h2>
                <p className="text-sm font-body text-neutral leading-relaxed">
                  We regularly work outside the areas listed above. Call us and ask -- if we can reach you without a travel charge, we will. If not, we will tell you honestly.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href={brandDNA.contact.phoneTelLink}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-heading font-bold uppercase tracking-wide text-sm px-6 py-3 rounded-[4px] hover:bg-primary-dark transition-colors"
                >
                  {brandDNA.contact.phone}
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 border border-[var(--color-border)] text-sm font-heading font-bold uppercase tracking-wide text-neutral hover:text-primary hover:border-primary transition-colors px-6 py-3 rounded-[4px]"
                >
                  Send a Message
                </a>
              </div>
            </div>
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyBar />
    </>
  );
}
