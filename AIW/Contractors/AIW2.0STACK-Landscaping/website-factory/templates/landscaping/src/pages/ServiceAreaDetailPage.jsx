import { useParams } from 'react-router-dom';
import brandDNA from '../config/brand-dna.js';
import NavBar from '../components/NavBar.jsx';
import ServicesSection from '../components/ServicesSection.jsx';
import ReviewsSection from '../components/ReviewsSection.jsx';
import CtaFinalSection from '../components/CtaFinalSection.jsx';
import FooterSection from '../components/FooterSection.jsx';
import MobileBottomBar from '../components/MobileBottomBar.jsx';
import TrustBar from '../components/TrustBar.jsx';

export default function ServiceAreaDetailPage() {
  const { citySlug } = useParams();
  const cityName = citySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      <TrustBar />
      <NavBar />
      <main className="pt-26">
        <section className="py-section-gap bg-primary text-ink">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="font-heading text-5xl font-semibold mb-4">
              Landscaping in {cityName}
            </h1>
            <p className="text-neutral max-w-2xl">
              {brandDNA.company.name} serves homeowners throughout {cityName} with
              professional landscape design and installation services.
            </p>
          </div>
        </section>
        <ServicesSection />
        <ReviewsSection />
        <CtaFinalSection />
      </main>
      <FooterSection />
      <MobileBottomBar />
    </>
  );
}
