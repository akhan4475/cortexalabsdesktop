import brandDNA from '../config/brand-dna';
import StickyNav from '../components/StickyNav';
import ServiceHero from '../components/ServiceHero';
import EstimateForm from '../components/EstimateForm';
import ProcessSteps from '../components/ProcessSteps';
import WhyUs from '../components/WhyUs';
import ReviewTiles from '../components/ReviewTiles';
import FAQAccordion from '../components/FAQAccordion';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';

export default function ServiceRoofReplacementPage() {
  const svc = brandDNA.services.find(s => s.slug === 'roof-replacement') || {};
  return (
    <>
      <StickyNav />
      <main>
        <ServiceHero
          heading={svc.heroHeading || 'Roof Replacement'}
          subtext={svc.heroSubtext || `Full roof replacement by ${brandDNA.company.shortName}. Completed in one day. Backed by our lifetime warranty.`}
          image={svc.heroImage || null}
          breadcrumbLabel="Roof Replacement"
        />
        <EstimateForm />
        <ProcessSteps />
        <WhyUs />
        <ReviewTiles />
        <FAQAccordion />
        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyBar />
    </>
  );
}
