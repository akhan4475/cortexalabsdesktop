import brandDNA from '../config/brand-dna.js';
import TrustBar from '../components/TrustBar.jsx';
import NavBar from '../components/NavBar.jsx';
import HeroSection from '../components/HeroSection.jsx';
import TrustBarInline from '../components/TrustBarInline.jsx';
import ServicesSection from '../components/ServicesSection.jsx';
import PortfolioSection from '../components/PortfolioSection.jsx';
import WhyChooseSection from '../components/WhyChooseSection.jsx';
import ProcessSection from '../components/ProcessSection.jsx';
import ReviewsSection from '../components/ReviewsSection.jsx';
import FounderSection from '../components/FounderSection.jsx';
import ServiceAreasSection from '../components/ServiceAreasSection.jsx';
import FaqSection from '../components/FaqSection.jsx';
import CtaFinalSection from '../components/CtaFinalSection.jsx';
import FooterSection from '../components/FooterSection.jsx';
import MobileBottomBar from '../components/MobileBottomBar.jsx';

export default function HomePage() {
  return (
    <>
      <TrustBar />
      <NavBar />
      <main>
        <HeroSection />
        <TrustBarInline />
        <ServicesSection />
        <PortfolioSection limit={6} />
        <WhyChooseSection />
        <ProcessSection />
        <ReviewsSection />
        <FounderSection />
        <ServiceAreasSection />
        <FaqSection />
        <CtaFinalSection />
      </main>
      <FooterSection />
      <MobileBottomBar />
    </>
  );
}
