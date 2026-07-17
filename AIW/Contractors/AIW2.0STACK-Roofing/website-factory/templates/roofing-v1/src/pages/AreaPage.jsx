import { useParams } from 'react-router-dom';
import brandDNA from '../config/brand-dna';
import StickyNav from '../components/StickyNav';
import ServiceHero from '../components/ServiceHero';
import EstimateForm from '../components/EstimateForm';
import ServicesGrid from '../components/ServicesGrid';
import ReviewTiles from '../components/ReviewTiles';
import WhyUs from '../components/WhyUs';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
      className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
      className="w-4 h-4 text-primary shrink-0" aria-hidden="true">
      <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
    </svg>
  );
}

export default function AreaPage() {
  const { citySlug } = useParams();

  const locationData = brandDNA.location_pages?.find(l => l.slug === citySlug) || null;
  const cityName = locationData?.cityName || citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const state = locationData?.state || brandDNA.address.state;
  const county = locationData?.county || null;
  const localFacts = locationData?.localFacts || null;
  const nearbyAreas = locationData?.nearbyAreas || brandDNA.serviceAreas.filter(a => slugify(a) !== citySlug).slice(0, 4);
  const localFaq = locationData?.localFaq || [];
  const globalFaq = brandDNA.faq || [];
  const combinedFaq = [...localFaq, ...globalFaq.slice(0, 4)];

  const phone = brandDNA.contact.phone;
  const phoneTelLink = brandDNA.contact.phoneTelLink;

  return (
    <>
      <StickyNav />
      <main>

        {/* Hero -- city name always comes from URL slug or location_pages data, never hardcoded */}
        <ServiceHero
          heading={`Roofing Contractor in ${cityName}, ${state}`}
          subtext={`${brandDNA.company.shortName} serves ${cityName} homeowners with licensed roofing services. Free estimates. Same-day response.`}
          breadcrumbLabel={cityName}
          breadcrumbParent="Service Areas"
          breadcrumbParentHref="/service-areas"
        />

        {/* Location trust bar -- consistent single phone source */}
        <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
          <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-body text-neutral">
              <span className="flex items-center gap-1.5">
                <MapPinIcon />
                Serving {cityName}{county ? `, ${county}` : ''}
              </span>
              {locationData?.distance && (
                <span className="text-neutral-dim">{locationData.distance} from our base</span>
              )}
              <span className="flex items-center gap-1.5">
                <CheckIcon />
                {brandDNA.company.licenseNumber}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckIcon />
                Free Estimates
              </span>
            </div>
            {/* Single consistent phone number -- no conflicting numbers like Silver Ridge audit */}
            <a
              href={phoneTelLink}
              className="inline-flex items-center gap-2 bg-primary text-white font-heading font-bold uppercase tracking-wide text-sm px-5 py-2.5 rounded-[4px] hover:bg-primary-dark transition-colors shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
              </svg>
              {phone}
            </a>
          </div>
        </div>

        {/* Estimate form -- capture leads high on page */}
        <EstimateForm />

        {/* Services in this area */}
        <ServicesGrid />

        {/* Social proof */}
        <ReviewTiles />

        {/* Why choose us */}
        <WhyUs />

        {/* About serving this city */}
        {localFacts && (
          <section className="bg-[var(--color-bg)] py-section-gap-lg" aria-labelledby={`about-${citySlug}-heading`}>
            <div className="max-w-[1200px] mx-auto px-6">
              <div className="max-w-[760px]">
                <p className="text-xs font-body font-semibold uppercase tracking-[0.12em] text-primary mb-3">
                  Local Knowledge
                </p>
                <h2
                  id={`about-${citySlug}-heading`}
                  className="font-heading font-bold uppercase text-3xl text-ink leading-tight mb-6"
                >
                  Roofing Services in {cityName}
                </h2>
                <p className="text-base font-body text-neutral leading-relaxed mb-6">
                  {localFacts}
                </p>
                <p className="text-base font-body text-neutral leading-relaxed">
                  {brandDNA.company.shortName} has served {cityName} homeowners with the same approach we use on every job: honest assessment, written estimate, no upsell. If the roof needs a repair, we tell you so. If it needs a replacement, we explain exactly why.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Nearby areas we serve -- internal linking for SEO */}
        {nearbyAreas && nearbyAreas.length > 0 && (
          <section className="bg-[var(--color-surface)] py-14" aria-labelledby="nearby-areas-heading">
            <div className="max-w-[1200px] mx-auto px-6">
              <p className="text-xs font-body font-semibold uppercase tracking-[0.12em] text-primary mb-3">
                Also Serving
              </p>
              <h2 id="nearby-areas-heading" className="font-heading font-bold uppercase text-2xl text-ink mb-6">
                Nearby Areas We Cover
              </h2>
              <ul className="flex flex-wrap gap-3" role="list">
                {nearbyAreas.map((area) => (
                  <li key={area}>
                    <a
                      href={`/service-areas/${slugify(area)}`}
                      className="inline-flex items-center gap-1.5 bg-[var(--color-bg)] border border-[var(--color-border)] text-sm font-body font-medium text-neutral hover:text-primary hover:border-primary transition-colors px-4 py-2 rounded-[4px]"
                    >
                      <MapPinIcon />
                      {area}, {state}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Location-specific + general FAQ */}
        {combinedFaq.length > 0 && (
          <section className="bg-[var(--color-bg)] py-section-gap-lg" aria-labelledby={`faq-${citySlug}-heading`}>
            <div className="max-w-[1200px] mx-auto px-6">
              <header className="mb-10">
                <p className="text-xs font-body font-semibold uppercase tracking-[0.12em] text-primary mb-2">
                  Common Questions
                </p>
                <h2 id={`faq-${citySlug}-heading`} className="font-heading font-bold uppercase text-3xl text-ink">
                  Questions About Roofing in {cityName}
                </h2>
              </header>
              <dl className="divide-y divide-[var(--color-border)] max-w-[760px]">
                {combinedFaq.map((item, i) => (
                  <div key={i} className="py-5">
                    <dt className="font-heading font-bold text-base text-ink mb-2">{item.q}</dt>
                    <dd className="font-body text-sm text-neutral leading-relaxed">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyBar />
    </>
  );
}
