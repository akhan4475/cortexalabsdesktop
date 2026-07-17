import NavBar from '../components/NavBar.jsx';
import FaqSection from '../components/FaqSection.jsx';
import CtaFinalSection from '../components/CtaFinalSection.jsx';
import FooterSection from '../components/FooterSection.jsx';
import MobileBottomBar from '../components/MobileBottomBar.jsx';
import TrustBar from '../components/TrustBar.jsx';

export default function FaqPage() {
  return (
    <>
      <TrustBar />
      <NavBar />
      <main className="pt-26">
        <FaqSection />
        <CtaFinalSection />
      </main>
      <FooterSection />
      <MobileBottomBar />
    </>
  );
}
