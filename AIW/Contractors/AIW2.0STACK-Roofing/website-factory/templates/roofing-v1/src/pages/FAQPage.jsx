import { useState } from 'react';
import brandDNA from '../config/brand-dna';
import StickyNav from '../components/StickyNav';
import PageHero from '../components/PageHero';
import EstimateForm from '../components/EstimateForm';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';

function ChevronIcon({ open }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
      className={`w-5 h-5 text-primary shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      aria-hidden="true">
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
  );
}

const CATEGORIES = [
  { label: "All Questions", filter: null },
  { label: "Pricing", filter: "price" },
  { label: "Insurance", filter: "insurance" },
  { label: "Process", filter: "process" },
  { label: "Materials", filter: "materials" },
];

function categorizeItem(item) {
  const text = (item.q + ' ' + item.a).toLowerCase();
  if (/cost|price|pay|charge|fee|quote|estimate|financ/.test(text)) return 'price';
  if (/insurance|claim|adjuster|deductible|storm|damage/.test(text)) return 'insurance';
  if (/how long|process|day|timeline|schedule|step/.test(text)) return 'process';
  if (/shingle|material|gaf|warranty|owens|product/.test(text)) return 'materials';
  return null;
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--color-border)]">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-heading font-bold text-base text-ink">{q}</span>
        <ChevronIcon open={open} />
      </button>
      {open && (
        <div className="pb-5">
          <p className="text-sm font-body text-neutral leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeFilter, setActiveFilter] = useState(null);
  const allFaq = brandDNA.faq || [];
  const filtered = activeFilter
    ? allFaq.filter(item => categorizeItem(item) === activeFilter)
    : allFaq;

  return (
    <>
      <StickyNav />
      <main>
        <PageHero
          label={brandDNA.copy.faq.label}
          heading={brandDNA.pages.faq.heading}
          subtext={brandDNA.pages.faq.subheading}
          breadcrumbLabel="FAQ"
        />

        <section className="bg-[var(--color-bg)] py-section-gap-lg">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">

              {/* FAQ list */}
              <div>
                {/* Category tabs */}
                <div className="flex flex-wrap gap-2 mb-8" role="list">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => setActiveFilter(cat.filter)}
                      aria-pressed={activeFilter === cat.filter}
                      className={`px-4 py-2 text-sm font-body font-medium rounded-[4px] border transition-colors ${
                        activeFilter === cat.filter
                          ? 'bg-primary text-white border-primary'
                          : 'bg-[var(--color-surface)] text-neutral border-[var(--color-border)] hover:border-primary hover:text-primary'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {filtered.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm font-body text-neutral">No questions in this category yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
                    {filtered.map((item, i) => (
                      <FAQItem key={i} q={item.q} a={item.a} />
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar CTA */}
              <aside>
                <div className="bg-[var(--color-dark-section)] rounded-[6px] p-6 text-white sticky top-[calc(var(--nav-height)+20px)]">
                  <p className="font-heading font-bold uppercase text-xl mb-2">
                    Still Have Questions?
                  </p>
                  <p className="text-sm font-body text-white/70 mb-5 leading-relaxed">
                    Call us directly. We answer the phone and give you straight answers -- no runaround.
                  </p>
                  <a
                    href={brandDNA.contact.phoneTelLink}
                    className="block text-center bg-primary text-white font-heading font-bold uppercase tracking-wide text-sm px-4 py-3 rounded-[4px] hover:bg-primary-dark transition-colors mb-3"
                  >
                    {brandDNA.contact.phone}
                  </a>
                  <a
                    href="/contact"
                    className="block text-center border border-white/30 text-white font-heading font-bold uppercase tracking-wide text-sm px-4 py-3 rounded-[4px] hover:border-white transition-colors"
                  >
                    Send a Message
                  </a>
                  <p className="text-xs font-body text-white/40 mt-4 text-center">
                    {brandDNA.hours.display[0].label}: {brandDNA.hours.display[0].value}
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <EstimateForm />
        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyBar />
    </>
  );
}
