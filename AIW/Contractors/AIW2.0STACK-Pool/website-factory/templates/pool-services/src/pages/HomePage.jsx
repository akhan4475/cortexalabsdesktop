import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import Services from '../components/Services';
import Pricing from '../components/Pricing';
import Process from '../components/Process';
import Gallery from '../components/Gallery';
import WhyChoose from '../components/WhyChoose';
import Reviews from '../components/Reviews';
import ContactForm from '../components/ContactForm';
import ServiceAreas from '../components/ServiceAreas';
import FAQ from '../components/FAQ';
import CTABand from '../components/CTABand';
import Footer from '../components/Footer';
import brandDNA from '../config/brand-dna';

export default function HomePage() {
  return (
    <>
      <title>{brandDNA.meta.title}</title>
      <meta name="description" content={brandDNA.meta.description} />
      <NavBar />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        <Pricing />
        <Process />
        <Gallery />
        <WhyChoose />
        <Reviews />
        <ContactForm />
        <ServiceAreas />
        <FAQ />
        <CTABand />
      </main>
      <Footer />
    </>
  );
}
