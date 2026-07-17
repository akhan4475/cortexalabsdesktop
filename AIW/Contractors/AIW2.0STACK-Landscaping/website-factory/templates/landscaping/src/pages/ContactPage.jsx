import NavBar from '../components/NavBar.jsx';
import CtaFinalSection from '../components/CtaFinalSection.jsx';
import ServiceAreasSection from '../components/ServiceAreasSection.jsx';
import FooterSection from '../components/FooterSection.jsx';
import MobileBottomBar from '../components/MobileBottomBar.jsx';
import TrustBar from '../components/TrustBar.jsx';

export default function ContactPage() {
  return (
    <>
      <TrustBar />
      <NavBar />
      <main className="pt-26">
        <CtaFinalSection />
        <ServiceAreasSection />
      </main>
      <FooterSection />
      <MobileBottomBar />
    </>
  );
}
