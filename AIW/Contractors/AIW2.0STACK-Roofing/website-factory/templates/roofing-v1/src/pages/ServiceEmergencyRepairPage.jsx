import brandDNA from '../config/brand-dna';
import StickyNav from '../components/StickyNav';
import ServiceHero from '../components/ServiceHero';
import EstimateForm from '../components/EstimateForm';
import WhyUs from '../components/WhyUs';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';

export default function ServiceEmergencyRepairPage() {
  const svc = brandDNA.services.find(s => s.slug === 'emergency-roof-repair') || {};
  return (
    <>
      <StickyNav />
      <main>
        <ServiceHero
          heading={svc.heroHeading || 'Emergency Roof Repair'}
          subtext={svc.heroSubtext || `Roof opened up? Call ${brandDNA.contact.phone} right now. We tarp and stabilize within hours.`}
          image={svc.heroImage || null}
          breadcrumbLabel="Emergency Repair"
        />

        {/* Urgency callout */}
        <section className="bg-primary py-6" aria-label="Emergency contact">
          <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="font-heading font-bold uppercase text-xl text-[var(--color-bg)]">
              Roof Emergency? Call Now.
            </p>
            <a
              href={brandDNA.contact.phoneTelLink}
              className="inline-flex items-center gap-2 bg-[var(--color-bg)] text-primary font-heading font-bold uppercase tracking-wide text-sm px-6 py-3 rounded-[4px] hover:opacity-90 transition-opacity"
            >
              {brandDNA.contact.phone}
            </a>
          </div>
        </section>

        <EstimateForm />
        <WhyUs />
        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyBar />
    </>
  );
}
