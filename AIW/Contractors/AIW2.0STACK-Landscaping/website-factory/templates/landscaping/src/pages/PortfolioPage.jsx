import { useState } from 'react';
import brandDNA from '../config/brand-dna.js';
import NavBar from '../components/NavBar.jsx';
import PortfolioSection from '../components/PortfolioSection.jsx';
import CtaFinalSection from '../components/CtaFinalSection.jsx';
import FooterSection from '../components/FooterSection.jsx';
import MobileBottomBar from '../components/MobileBottomBar.jsx';
import TrustBar from '../components/TrustBar.jsx';

export default function PortfolioPage() {
  const [filter, setFilter] = useState(null);
  const categories = [...new Set(brandDNA.previous_projects.map((p) => p.category).filter(Boolean))];

  return (
    <>
      <TrustBar />
      <NavBar />
      <main className="pt-26">
        <section className="py-section-gap bg-primary text-ink">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="font-heading text-5xl font-semibold mb-4">Our Work</h1>
            <p className="text-neutral max-w-xl mx-auto">
              Every yard has a story. Here is what we have built.
            </p>
          </div>
        </section>
        {categories.length > 0 && (
          <section className="bg-white py-6 border-b border-silver">
            <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-3">
              <button
                onClick={() => setFilter(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
                  filter === null ? 'bg-accent text-primary-dark' : 'bg-white border border-silver text-neutral-dim hover:border-accent/40'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
                    filter === cat ? 'bg-accent text-primary-dark' : 'bg-white border border-silver text-neutral-dim hover:border-accent/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>
        )}
        <PortfolioSection filter={filter} />
        <CtaFinalSection />
      </main>
      <FooterSection />
      <MobileBottomBar />
    </>
  );
}
