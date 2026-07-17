import NavBar from '../components/NavBar.jsx';
import ServiceAreasSection from '../components/ServiceAreasSection.jsx';
import CtaFinalSection from '../components/CtaFinalSection.jsx';
import FooterSection from '../components/FooterSection.jsx';
import MobileBottomBar from '../components/MobileBottomBar.jsx';
import TrustBar from '../components/TrustBar.jsx';

export default function ServiceAreasPage() {
  return (
    <>
      <TrustBar />
      <NavBar />
      <main className="pt-26">
        <ServiceAreasSection />
        <CtaFinalSection />
      </main>
      <FooterSection />
      <MobileBottomBar />
    </>
  );
}
