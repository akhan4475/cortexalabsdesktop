import brandDNA from '../config/brand-dna';
import StickyNav from '../components/StickyNav';
import PageHero from '../components/PageHero';
import ReviewTiles from '../components/ReviewTiles';
import WhyUs from '../components/WhyUs';
import EstimateForm from '../components/EstimateForm';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';

function ArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
      className="w-4 h-4 shrink-0" aria-hidden="true">
      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
      className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
    </svg>
  );
}

export default function ServicesPage() {
  const services = brandDNA.services || [];

  return (
    <>
      <StickyNav />
      <main>
        <PageHero
          label={brandDNA.copy.services.label}
          heading={brandDNA.pages.services.heading}
          subtext={brandDNA.pages.services.subheading}
          breadcrumbLabel="Services"
        />

        {/* Service cards */}
        <section className="bg-[var(--color-bg)] py-section-gap-lg" aria-labelledby="services-list-heading">
          <div className="max-w-[1200px] mx-auto px-6">
            <p id="services-list-heading" className="sr-only">Our roofing services</p>
            <ul className="space-y-8" role="list">
              {services.map((svc, i) => (
                <li
                  key={svc.slug}
                  className={`grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-0 border border-[var(--color-border)] rounded-[6px] overflow-hidden ${
                    i % 2 === 0 ? '' : 'lg:grid-flow-col-dense'
                  }`}
                >
                  {/* Content */}
                  <div className="p-8 flex flex-col gap-5">
                    <h2 className="font-heading font-bold uppercase text-2xl text-ink">
                      {svc.heroHeading || svc.name}
                    </h2>
                    <p className="text-base font-body text-neutral leading-relaxed">
                      {svc.heroSubtext || svc.body}
                    </p>

                    {svc.what_included && svc.what_included.length > 0 && (
                      <div>
                        <p className="text-xs font-body font-semibold uppercase tracking-wider text-neutral-dim mb-3">
                          What's included
                        </p>
                        <ul className="space-y-2" role="list">
                          {svc.what_included.map((item, j) => (
                            <li key={j} className="flex items-start gap-2">
                              <CheckIcon />
                              <span className="text-sm font-body text-neutral">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 mt-2">
                      <a
                        href={`/services/${svc.slug}`}
                        className="inline-flex items-center gap-2 bg-primary text-white font-heading font-bold uppercase tracking-wide text-sm px-6 py-3 rounded-[4px] hover:bg-primary-dark transition-colors"
                      >
                        Learn More <ArrowIcon />
                      </a>
                      <a
                        href="#estimate"
                        className="inline-flex items-center gap-2 border border-[var(--color-border)] text-sm font-heading font-bold uppercase tracking-wide text-neutral hover:text-primary hover:border-primary transition-colors px-6 py-3 rounded-[4px]"
                      >
                        Get a Free Estimate
                      </a>
                    </div>
                  </div>

                  {/* Visual panel */}
                  <div className="bg-[var(--color-dark-section)] flex items-center justify-center p-8 min-h-[220px]">
                    <div className="text-center">
                      <p className="font-heading font-extrabold uppercase text-5xl text-white/10 leading-none mb-3">
                        {String(i + 1).padStart(2, '0')}
                      </p>
                      <p className="font-heading font-bold uppercase text-white text-lg">
                        {svc.name}
                      </p>
                      <div className="mt-4 w-10 h-0.5 bg-primary mx-auto" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <WhyUs />
        <ReviewTiles />
        <EstimateForm id="estimate" />
        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyBar />
    </>
  );
}
