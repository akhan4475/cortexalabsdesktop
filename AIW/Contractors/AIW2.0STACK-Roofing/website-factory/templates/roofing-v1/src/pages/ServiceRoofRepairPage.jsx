import brandDNA from '../config/brand-dna';
import StickyNav from '../components/StickyNav';
import ServiceHero from '../components/ServiceHero';
import EstimateForm from '../components/EstimateForm';
import WhyUs from '../components/WhyUs';
import ReviewTiles from '../components/ReviewTiles';
import FAQAccordion from '../components/FAQAccordion';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';

export default function ServiceRoofRepairPage() {
  const svc = brandDNA.services.find(s => s.slug === 'roof-repair') || {};
  return (
    <>
      <StickyNav />
      <main>
        <ServiceHero
          heading={svc.heroHeading || 'Roof Repair'}
          subtext={svc.heroSubtext || `Fast, honest roof repair by ${brandDNA.company.shortName}. Same-day assessment. No upsell.`}
          image={svc.heroImage || null}
          breadcrumbLabel="Roof Repair"
        />
        <EstimateForm />
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
