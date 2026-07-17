import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import TrustBar from '../components/TrustBar';
import Services from '../components/Services';
import Reviews from '../components/Reviews';
import ContactForm from '../components/ContactForm';
import ServiceAreas from '../components/ServiceAreas';
import CTABand from '../components/CTABand';
import Footer from '../components/Footer';
import brandDNA from '../config/brand-dna';

function toTitleCase(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function LocationDetailPage() {
  const { citySlug } = useParams();

  const locationPage = brandDNA.location_pages.find((p) => p.slug === citySlug);
  const cityName = locationPage?.city || toTitleCase(citySlug || '');
  const stateCode = locationPage?.state || brandDNA.address.state;

  return (
    <>
      <title>{`Pool Service in ${cityName} | ${brandDNA.company.shortName}`}</title>
      <meta name="description" content={`${brandDNA.company.name} provides pool cleaning, maintenance, and repair in ${cityName}, ${stateCode}. Licensed and insured. Free quote.`} />
      <NavBar />
      <main>
        {/* Location hero */}
        <section
          className="pt-32 pb-16"
          style={{ background: 'linear-gradient(135deg, rgb(var(--primary-dark)) 0%, rgb(var(--primary-slate)) 100%)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-accent mb-3">
                Serving {cityName}
              </p>
              <h1 className="font-heading text-4xl lg:text-5xl text-white mb-5">
                Pool Service in {cityName}, {stateCode}
              </h1>
              <p className="font-body text-lg text-white/75 leading-relaxed">
                {brandDNA.company.name} provides professional pool cleaning, maintenance, and repair throughout {cityName}. Licensed, insured, and locally operated.
              </p>
            </div>
          </div>
        </section>

        <TrustBar />
        <Services />

        {/* Local content block */}
        <section className="bg-white py-section-gap">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <h2 className="font-heading text-3xl text-ink mb-4">
              Trusted Pool Service in {cityName}
            </h2>
            <p className="font-body text-base text-silver leading-relaxed mb-4">
              {brandDNA.company.name} has been serving {cityName} homeowners with professional pool care. Whether you need weekly cleaning, ongoing maintenance, or emergency repairs, our certified technicians are familiar with the local pool environment and ready to help.
            </p>
            <p className="font-body text-base text-silver leading-relaxed">
              We service all pool types and brands throughout {cityName} and the surrounding {stateCode} area. Contact us for a free quote.
            </p>
          </div>
        </section>

        <Reviews />
        <ContactForm />
        <ServiceAreas />
        <CTABand />
      </main>
      <Footer />
    </>
  );
}
