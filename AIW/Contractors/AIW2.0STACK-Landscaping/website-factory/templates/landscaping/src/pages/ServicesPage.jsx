import NavBar from '../components/NavBar.jsx';
import ServicesSection from '../components/ServicesSection.jsx';
import WhyChooseSection from '../components/WhyChooseSection.jsx';
import CtaFinalSection from '../components/CtaFinalSection.jsx';
import FooterSection from '../components/FooterSection.jsx';
import MobileBottomBar from '../components/MobileBottomBar.jsx';
import TrustBar from '../components/TrustBar.jsx';

export default function ServicesPage() {
  return (
    <>
      <TrustBar />
      <NavBar />
      <main className="pt-26">
        <ServicesSection />
        <WhyChooseSection />
        <CtaFinalSection />
      </main>
      <FooterSection />
      <MobileBottomBar />
    </>
  );
}
