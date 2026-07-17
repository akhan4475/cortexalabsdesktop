import brandDNA from '../config/brand-dna';
import StickyNav from '../components/StickyNav';
import PageHero from '../components/PageHero';
import EstimateForm from '../components/EstimateForm';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
      className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
    </svg>
  );
}

export default function FinancingPage() {
  const financing = brandDNA.financing || {};
  const options = financing.options || [];
  const faqItems = financing.faq || [];

  return (
    <>
      <StickyNav />
      <main>
        <PageHero
          label={brandDNA.copy.financing.label}
          heading={brandDNA.pages.financing.heading}
          subtext={brandDNA.pages.financing.subheading}
          breadcrumbLabel="Financing"
        />

        {/* Options */}
        <section className="bg-[var(--color-bg)] py-section-gap-lg">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-[640px] mb-12">
              <p className="text-base font-body text-neutral leading-relaxed">
                {financing.subtext}
              </p>
            </div>

            {options.length > 0 && (
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" role="list">
                {options.map((opt, i) => (
                  <li
                    key={i}
                    className={`relative bg-[var(--color-surface)] border rounded-[6px] p-6 flex flex-col gap-3 ${
                      opt.badge ? 'border-primary' : 'border-[var(--color-border)]'
                    }`}
                  >
                    {opt.badge && (
                      <span className="absolute -top-3 left-5 bg-primary text-white text-xs font-heading font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                        {opt.badge}
                      </span>
                    )}
                    <h3 className="font-heading font-bold uppercase text-xl text-ink">
                      {opt.name}
                    </h3>
                    <p className="text-sm font-body text-neutral leading-relaxed flex-1">
                      {opt.description}
                    </p>
                    {opt.minAmount && (
                      <p className="text-xs font-body text-neutral-dim">
                        Available on jobs over ${opt.minAmount.toLocaleString()}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* How to apply */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[6px] p-8 mb-12">
              <h2 className="font-heading font-bold uppercase text-2xl text-ink mb-6">
                How to Apply
              </h2>
              <ul className="space-y-4" role="list">
                {[
                  "Get your free estimate from us first. We will tell you the total project cost in writing.",
                  "Ask about financing at the estimate. We walk you through the options that make sense for your job.",
                  "Apply online in 2 minutes. Most decisions are same-day.",
                  "Work starts on your schedule. No waiting for financing to process.",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white font-heading font-bold text-xs shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm font-body text-neutral leading-relaxed">{step}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common use cases */}
            <div className="mb-12">
              <h2 className="font-heading font-bold uppercase text-2xl text-ink mb-6">
                When Homeowners Use Financing
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list">
                {[
                  { title: "Storm damage deductible", body: "Use the 0% option to cover your deductible while waiting for the insurance check to arrive." },
                  { title: "Full replacement on a tight timeline", body: "Roof failure does not wait for savings. Financing lets you act now and pay over time at manageable monthly amounts." },
                  { title: "Emergency repair bridge", body: "Emergency tarping and repair can be financed immediately while a larger replacement claim is processed." },
                  { title: "Elective upgrade", body: "Algae-resistant shingles, better ventilation, or a full premium system can be financed over 5 years at low monthly cost." },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[6px] p-5">
                    <CheckIcon />
                    <div>
                      <p className="font-heading font-bold text-sm text-ink mb-1">{item.title}</p>
                      <p className="text-sm font-body text-neutral leading-relaxed">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQ */}
            {faqItems.length > 0 && (
              <div>
                <h2 className="font-heading font-bold uppercase text-2xl text-ink mb-6">
                  Financing Questions
                </h2>
                <dl className="divide-y divide-[var(--color-border)] max-w-[760px]">
                  {faqItems.map((item, i) => (
                    <div key={i} className="py-5">
                      <dt className="font-heading font-bold text-base text-ink mb-2">{item.q}</dt>
                      <dd className="text-sm font-body text-neutral leading-relaxed">{item.a}</dd>
                    </div>
                  ))}
                </dl>
                {financing.disclaimer && (
                  <p className="mt-6 text-xs font-body text-neutral-dim max-w-[640px] leading-relaxed">
                    {financing.disclaimer}
                  </p>
                )}
              </div>
            )}
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
