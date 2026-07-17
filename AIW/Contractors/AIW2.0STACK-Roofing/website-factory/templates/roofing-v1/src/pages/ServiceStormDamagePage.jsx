import brandDNA from '../config/brand-dna';
import StickyNav from '../components/StickyNav';
import ServiceHero from '../components/ServiceHero';
import EstimateForm from '../components/EstimateForm';
import InsuranceSection from '../components/InsuranceSection';
import WhyUs from '../components/WhyUs';
import ReviewTiles from '../components/ReviewTiles';
import FAQAccordion from '../components/FAQAccordion';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';

export default function ServiceStormDamagePage() {
  const svc = brandDNA.services.find(s => s.slug === 'storm-damage') || {};
  return (
    <>
      <StickyNav />
      <main>
        <ServiceHero
          heading={svc.heroHeading || 'Storm Damage Repair'}
          subtext={svc.heroSubtext || `Hail, wind, or fallen debris. ${brandDNA.company.shortName} responds fast and handles every insurance step.`}
          image={svc.heroImage || null}
          breadcrumbLabel="Storm Damage"
        />
        <EstimateForm />
        <InsuranceSection />
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
