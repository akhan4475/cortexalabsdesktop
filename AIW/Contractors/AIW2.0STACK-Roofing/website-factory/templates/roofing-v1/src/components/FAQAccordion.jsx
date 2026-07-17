import { useState } from 'react';
import brandDNA from '../config/brand-dna';

const defaultFAQs = [
  {
    q: 'How long does a roof replacement take?',
    a: 'Most residential replacements are completed in a single day. Larger or more complex roofs may take two days. We give you a specific timeline during the estimate walkthrough.',
  },
  {
    q: 'Do you work with insurance claims?',
    a: 'Yes. We help you through the entire claim process: damage documentation, adjuster meetings, supplement requests, and final sign-off. You never have to figure it out alone.',
  },
  {
    q: 'What brands of shingles do you use?',
    a: 'We install GAF, Owens Corning, and CertainTeed shingles. All come with manufacturer warranties. We recommend the product that fits your budget and your home.',
  },
  {
    q: 'How much does a new roof cost?',
    a: 'Cost depends on square footage, pitch, material choice, and any structural issues we find. We provide itemized written estimates at no charge.',
  },
  {
    q: 'What happens if it rains after my install?',
    a: 'Your new roof is waterproof from the moment we finish. If we encounter rain mid-job, we tarp and secure everything until conditions are safe to continue.',
  },
  {
    q: 'Are you licensed and insured?',
    a: `Yes. License #${brandDNA.company.licenseNumber || '__REQUIRED__'}. Fully insured with general liability and workers' comp. We provide certificates on request before any work begins.`,
  },
];

function AccordionItem({ item, open, onToggle, index }) {
  return (
    <div className="border-b border-[var(--color-border-light)]">
      <button
        id={`faq-btn-${index}`}
        aria-expanded={open}
        aria-controls={`faq-panel-${index}`}
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset group"
      >
        <span className="font-heading font-bold uppercase text-base text-ink group-hover:text-primary transition-colors">
          {item.q}
        </span>
        <span
          className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-[var(--color-border-light)] text-neutral group-hover:border-primary group-hover:text-primary transition-colors"
          aria-hidden="true"
        >
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
          )}
        </span>
      </button>
      <div
        id={`faq-panel-${index}`}
        role="region"
        aria-labelledby={`faq-btn-${index}`}
        hidden={!open}
        className="pb-5"
      >
        <p className="text-sm font-body text-neutral leading-relaxed">{item.a}</p>
      </div>
    </div>
  );
}

export default function FAQAccordion() {
  const faqs = brandDNA.faq.length > 0 ? brandDNA.faq : defaultFAQs;
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      className="bg-[var(--color-surface-alt)] py-section-gap-lg"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-[800px] mx-auto px-6">
        <header className="mb-10 text-center">
          <p className="text-xs font-body font-semibold uppercase tracking-[0.12em] text-primary mb-2">
            {brandDNA.copy.faq.label}
          </p>
          <h2
            id="faq-heading"
            className="font-heading font-bold uppercase text-4xl text-ink leading-tight"
          >
            {brandDNA.copy.faq.heading}
          </h2>
        </header>

        <div role="list">
          {faqs.map((item, i) => (
            <AccordionItem
              key={i}
              index={i}
              item={item}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
