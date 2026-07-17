import StickyNav from '../components/StickyNav';
import PageHero from '../components/PageHero';
import InsuranceSection from '../components/InsuranceSection';
import ProcessSteps from '../components/ProcessSteps';
import ReviewTiles from '../components/ReviewTiles';
import FAQAccordion from '../components/FAQAccordion';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';

export default function InsuranceClaimsPage() {
  return (
    <>
      <StickyNav />
      <main>
        <PageHero
          heading="Insurance Claims Help"
          subtext="We handle the paperwork, deal with your adjuster, and make sure the scope is right. You focus on your family."
          breadcrumb="Insurance Claims"
        />
        <InsuranceSection />
        <ProcessSteps />
        <ReviewTiles />
        <FAQAccordion />
        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyBar />
    </>
  );
}
