import NavBar from '../components/NavBar';
import TrustBar from '../components/TrustBar';
import Reviews from '../components/Reviews';
import FAQ from '../components/FAQ';
import ContactForm from '../components/ContactForm';
import CTABand from '../components/CTABand';
import Footer from '../components/Footer';
import brandDNA from '../config/brand-dna';

export default function ServiceDetailTemplate({ slug, title, headline, description, benefits = [] }) {
  const service = brandDNA.services.find((s) => s.slug === slug);
  const displayTitle = service?.name || title;
  const displayBody = service?.body || description;

  return (
    <>
      <title>{`${displayTitle} | ${brandDNA.company.shortName}`}</title>
      <meta name="description" content={`${displayTitle} in ${brandDNA.address.city || brandDNA.company.serviceRegion}. Licensed, insured. Free quote from ${brandDNA.company.name}.`} />
      <NavBar />
      <main>
        {/* Service hero */}
        <section
          className="pt-32 pb-16"
          style={{ background: 'linear-gradient(135deg, rgb(var(--primary-dark)) 0%, rgb(var(--primary-slate)) 100%)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-accent mb-3">
                Pool Services
              </p>
              <h1 className="font-heading text-4xl lg:text-5xl text-white mb-5">
                {headline || displayTitle}
              </h1>
              {displayBody && (
                <p className="font-body text-lg text-white/75 leading-relaxed">{displayBody}</p>
              )}
            </div>
          </div>
        </section>

        <TrustBar />

        {/* Benefits / detail body */}
        {benefits.length > 0 && (
          <section className="bg-white py-section-gap">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 p-5 bg-neutral border border-neutral-dim rounded-xl">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-0.5" aria-hidden="true">
                      <circle cx="10" cy="10" r="9" fill="rgb(var(--accent))" opacity="0.15" />
                      <path d="M6 10.5l3 3 5-5" stroke="rgb(var(--accent))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="font-body text-sm font-medium text-ink">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <FAQ />
        <Reviews />
        <ContactForm />
        <CTABand />
      </main>
      <Footer />
    </>
  );
}
