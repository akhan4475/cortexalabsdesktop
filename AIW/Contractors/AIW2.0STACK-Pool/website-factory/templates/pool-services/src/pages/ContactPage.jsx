import NavBar from '../components/NavBar';
import ContactForm from '../components/ContactForm';
import ServiceAreas from '../components/ServiceAreas';
import Footer from '../components/Footer';
import brandDNA from '../config/brand-dna';

export default function ContactPage() {
  return (
    <>
      <title>{`Contact ${brandDNA.company.shortName} | Pool Service`}</title>
      <meta name="description" content={`Contact ${brandDNA.company.name} for pool service. Call, email, or fill out our quick form. Free quotes.`} />
      <NavBar />
      <main>
        <div className="h-16" aria-hidden="true" />
        <ContactForm />
        <ServiceAreas />
      </main>
      <Footer />
    </>
  );
}
