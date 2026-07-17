import NavBar from '../components/NavBar.jsx';
import TrustBarInline from '../components/TrustBarInline.jsx';
import ReviewsSection from '../components/ReviewsSection.jsx';
import CtaFinalSection from '../components/CtaFinalSection.jsx';
import FooterSection from '../components/FooterSection.jsx';
import MobileBottomBar from '../components/MobileBottomBar.jsx';
import TrustBar from '../components/TrustBar.jsx';

export default function ReviewsPage() {
  return (
    <>
      <TrustBar />
      <NavBar />
      <main className="pt-26">
        <TrustBarInline />
        <ReviewsSection />
        <CtaFinalSection />
      </main>
      <FooterSection />
      <MobileBottomBar />
    </>
  );
}
