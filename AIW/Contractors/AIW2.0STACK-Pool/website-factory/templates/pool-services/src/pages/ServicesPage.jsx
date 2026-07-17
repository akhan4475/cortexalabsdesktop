import NavBar from '../components/NavBar';
import Services from '../components/Services';
import TrustBar from '../components/TrustBar';
import ContactForm from '../components/ContactForm';
import CTABand from '../components/CTABand';
import Footer from '../components/Footer';
import brandDNA from '../config/brand-dna';

export default function ServicesPage() {
  return (
    <>
      <title>{`Pool Services | ${brandDNA.company.shortName}`}</title>
      <meta name="description" content={`Full-service pool cleaning, maintenance, repair, and seasonal services. See everything ${brandDNA.company.name} offers.`} />
      <NavBar />
      <main>
        {/* Page hero */}
        <section
          className="pt-32 pb-16 relative"
          style={{ background: 'linear-gradient(135deg, rgb(var(--primary-dark)) 0%, rgb(var(--primary-slate)) 100%)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-accent mb-3">What We Do</p>
            <h1 className="font-heading text-4xl lg:text-5xl text-white mb-4">
              {brandDNA.copy.services.heading}
            </h1>
            {brandDNA.copy.services.body && (
              <p className="font-body text-lg text-white/70 max-w-2xl mx-auto">
                {brandDNA.copy.services.body}
              </p>
            )}
          </div>
        </section>
        <TrustBar />
        <Services />
        <ContactForm />
        <CTABand />
      </main>
      <Footer />
    </>
  );
}
