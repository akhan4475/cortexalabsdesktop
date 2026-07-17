import NavBar from '../components/NavBar';
import Gallery from '../components/Gallery';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import brandDNA from '../config/brand-dna';

export default function GalleryPage() {
  return (
    <>
      <title>{`Pool Service Gallery | ${brandDNA.company.shortName}`}</title>
      <meta name="description" content={`Before and after photos from ${brandDNA.company.name} pool cleaning and repair jobs. See the results.`} />
      <NavBar />
      <main>
        <section
          className="pt-32 pb-16"
          style={{ background: 'linear-gradient(135deg, rgb(var(--primary-dark)) 0%, rgb(var(--primary-slate)) 100%)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-accent mb-3">
              {brandDNA.copy.gallery.label}
            </p>
            <h1 className="font-heading text-4xl lg:text-5xl text-white mb-4">
              {brandDNA.copy.gallery.heading}
            </h1>
            {brandDNA.copy.gallery.body && (
              <p className="font-body text-lg text-white/70 max-w-xl mx-auto">
                {brandDNA.copy.gallery.body}
              </p>
            )}
          </div>
        </section>
        <Gallery />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
