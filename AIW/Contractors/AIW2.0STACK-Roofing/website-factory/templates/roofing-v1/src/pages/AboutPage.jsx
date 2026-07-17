import brandDNA from '../config/brand-dna';
import StickyNav from '../components/StickyNav';
import PageHero from '../components/PageHero';
import TeamSection from '../components/TeamSection';
import WhyUs from '../components/WhyUs';
import ReviewTiles from '../components/ReviewTiles';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';

export default function AboutPage() {
  return (
    <>
      <StickyNav />
      <main>
        <PageHero
          heading={`About ${brandDNA.company.shortName}`}
          subtext={brandDNA.copy.about.subtext}
          breadcrumb="About"
        />

        {/* Founder story */}
        <section className="bg-[var(--color-surface-alt)] py-section-gap-lg">
          <div className="max-w-[800px] mx-auto px-6">
            <h2 className="font-heading font-bold uppercase text-3xl text-ink mb-5">
              {brandDNA.copy.about.storyHeading}
            </h2>
            <div className="space-y-4 text-base font-body text-neutral leading-relaxed">
              {brandDNA.copy.about.storyParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        <TeamSection />
        <WhyUs />
        <ReviewTiles />
        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyBar />
    </>
  );
}
