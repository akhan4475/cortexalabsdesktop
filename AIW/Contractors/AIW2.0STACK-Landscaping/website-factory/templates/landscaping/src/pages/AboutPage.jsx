import NavBar from '../components/NavBar.jsx';
import FounderSection from '../components/FounderSection.jsx';
import WhyChooseSection from '../components/WhyChooseSection.jsx';
import ReviewsSection from '../components/ReviewsSection.jsx';
import CtaFinalSection from '../components/CtaFinalSection.jsx';
import FooterSection from '../components/FooterSection.jsx';
import MobileBottomBar from '../components/MobileBottomBar.jsx';
import TrustBar from '../components/TrustBar.jsx';

export default function AboutPage() {
  return (
    <>
      <TrustBar />
      <NavBar />
      <main className="pt-26">
        <FounderSection />
        <WhyChooseSection />
        <ReviewsSection />
        <CtaFinalSection />
      </main>
      <FooterSection />
      <MobileBottomBar />
    </>
  );
}
