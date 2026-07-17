import StickyNav from '../components/StickyNav';
import Hero from '../components/Hero';
import ReviewTiles from '../components/ReviewTiles';
import TrustBar from '../components/TrustBar';
import WhyUs from '../components/WhyUs';
import BeforeAfterGallery from '../components/BeforeAfterGallery';
import ProcessSteps from '../components/ProcessSteps';
import ServicesGrid from '../components/ServicesGrid';
import TeamSection from '../components/TeamSection';
import MeetTheTeamSection from '../components/MeetTheTeamSection';
import BlogPreview from '../components/BlogPreview';
import ServiceAreaCards from '../components/ServiceAreaCards';
import EstimateForm from '../components/EstimateForm';
import FAQAccordion from '../components/FAQAccordion';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';

export default function HomePage() {
  return (
    <>
      <StickyNav />
      <main>
        <Hero />
        <ReviewTiles />
        <TrustBar />
        <WhyUs />
        <BeforeAfterGallery />
        <ProcessSteps />
        <ServicesGrid />
        <TeamSection />
        <MeetTheTeamSection />
        <BlogPreview />
        <ServiceAreaCards />
        <EstimateForm />
        <FAQAccordion />
        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyBar />
    </>
  );
}
