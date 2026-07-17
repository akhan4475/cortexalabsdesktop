import { useParams } from 'react-router-dom';
import brandDNA from '../config/brand-dna.js';
import NavBar from '../components/NavBar.jsx';
import PortfolioSection from '../components/PortfolioSection.jsx';
import ProcessSection from '../components/ProcessSection.jsx';
import FaqSection from '../components/FaqSection.jsx';
import CtaFinalSection from '../components/CtaFinalSection.jsx';
import FooterSection from '../components/FooterSection.jsx';
import MobileBottomBar from '../components/MobileBottomBar.jsx';
import TrustBar from '../components/TrustBar.jsx';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = brandDNA.services.find((s) => s.slug === slug);

  if (!service) {
    return (
      <>
        <TrustBar />
        <NavBar />
        <main className="pt-26 min-h-screen flex items-center justify-center">
          <p className="text-neutral-dim">Service not found.</p>
        </main>
        <FooterSection />
      </>
    );
  }

  return (
    <>
      <TrustBar />
      <NavBar />
      <main className="pt-26">
        <section className="py-section-gap bg-primary text-ink">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="font-heading text-5xl font-semibold mb-4">{service.name}</h1>
            {service.body && <p className="text-neutral max-w-2xl">{service.body}</p>}
          </div>
        </section>
        <PortfolioSection filter={slug} />
        <ProcessSection />
        <FaqSection />
        <CtaFinalSection />
      </main>
      <FooterSection />
      <MobileBottomBar />
    </>
  );
}
