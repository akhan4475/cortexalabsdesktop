import NavBar from '../components/NavBar';
import ServiceAreas from '../components/ServiceAreas';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import brandDNA from '../config/brand-dna';

export default function ServiceAreasPage() {
  return (
    <>
      <title>{`Service Areas | ${brandDNA.company.shortName} Pool Service`}</title>
      <meta name="description" content={`${brandDNA.company.name} serves the ${brandDNA.company.serviceRegion} area. See all locations we cover.`} />
      <NavBar />
      <main>
        <div className="h-16" aria-hidden="true" />
        <ServiceAreas />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
