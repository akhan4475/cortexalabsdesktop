import NavBar from '../components/NavBar';
import FAQ from '../components/FAQ';
import ContactForm from '../components/ContactForm';
import CTABand from '../components/CTABand';
import Footer from '../components/Footer';
import brandDNA from '../config/brand-dna';

export default function FAQPage() {
  return (
    <>
      <title>{`Pool Service FAQ | ${brandDNA.company.shortName}`}</title>
      <meta name="description" content="Answers to common questions about pool cleaning, maintenance, and repair. How often, what is included, pricing." />
      <NavBar />
      <main>
        <section
          className="pt-32 pb-16"
          style={{ background: 'linear-gradient(135deg, rgb(var(--primary-dark)) 0%, rgb(var(--primary-slate)) 100%)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-accent mb-3">
              {brandDNA.copy.faq.label}
            </p>
            <h1 className="font-heading text-4xl lg:text-5xl text-white mb-4">
              {brandDNA.copy.faq.heading}
            </h1>
          </div>
        </section>
        <FAQ />
        <ContactForm />
        <CTABand />
      </main>
      <Footer />
    </>
  );
}
