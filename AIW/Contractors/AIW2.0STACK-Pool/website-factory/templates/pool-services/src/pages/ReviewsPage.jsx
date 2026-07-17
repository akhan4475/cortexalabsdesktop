import NavBar from '../components/NavBar';
import Reviews from '../components/Reviews';
import ContactForm from '../components/ContactForm';
import CTABand from '../components/CTABand';
import Footer from '../components/Footer';
import brandDNA from '../config/brand-dna';

export default function ReviewsPage() {
  return (
    <>
      <title>{`Customer Reviews | ${brandDNA.company.shortName}`}</title>
      <meta name="description" content={`See what homeowners say about ${brandDNA.company.name}. Read real customer experiences.`} />
      <NavBar />
      <main>
        <section
          className="pt-32 pb-16"
          style={{ background: 'linear-gradient(135deg, rgb(var(--primary-dark)) 0%, rgb(var(--primary-slate)) 100%)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-accent mb-3">
              {brandDNA.copy.reviews.label}
            </p>
            <h1 className="font-heading text-4xl lg:text-5xl text-white mb-4">
              {brandDNA.copy.reviews.heading}
            </h1>
            {brandDNA.copy.reviews.body && (
              <p className="font-body text-lg text-white/70 max-w-xl mx-auto">
                {brandDNA.copy.reviews.body}
              </p>
            )}
          </div>
        </section>
        <Reviews />
        <ContactForm />
        <CTABand />
      </main>
      <Footer />
    </>
  );
}
