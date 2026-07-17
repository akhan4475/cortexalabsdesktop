import brandDNA from '../config/brand-dna';

export default function InsuranceSection() {
  return (
    <section
      id="insurance"
      className="bg-[var(--color-surface)] py-section-gap-lg"
      aria-labelledby="insurance-heading"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Copy side */}
          <div>
            <p className="text-xs font-body font-semibold uppercase tracking-[0.12em] text-primary mb-2">
              {brandDNA.copy.insurance.label}
            </p>
            <h2
              id="insurance-heading"
              className="font-heading font-bold uppercase text-4xl text-ink leading-tight mb-5"
            >
              {brandDNA.copy.insurance.heading}
            </h2>
            <p className="text-base font-body text-neutral leading-relaxed mb-8">
              {brandDNA.copy.insurance.body}
            </p>

            <ul className="flex flex-col gap-4 mb-8" role="list">
              {brandDNA.copy.insurance.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="mt-1 w-5 h-5 shrink-0 rounded-full bg-primary/20 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                      className="w-3 h-3 text-primary">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-sm font-body text-neutral leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>

            <a
              href="#chatbot"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-[var(--color-bg)] font-heading font-bold uppercase tracking-wide text-sm px-6 py-3 rounded-[4px] transition-colors motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
            >
              {brandDNA.copy.insurance.ctaText}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                className="w-4 h-4" aria-hidden="true">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </a>
          </div>

          {/* Visual side -- chatbot anchor + trust callout */}
          <div className="flex flex-col gap-6">
            {/* AI chat nudge card */}
            <div
              id="chatbot"
              className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[6px] p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                    className="w-5 h-5 text-primary" aria-hidden="true">
                    <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-heading font-bold text-sm text-ink uppercase">Ask Our AI Assistant</p>
                  <p className="text-xs font-body text-neutral">Instant answers about your claim</p>
                </div>
              </div>
              <p className="text-sm font-body text-neutral mb-4 leading-relaxed">
                Not sure if your damage is covered? Ask our AI assistant right now. It knows what most policies cover and can help you understand your options before you call your adjuster.
              </p>
              {/* VOICEFLOW_CHATBOT_SCRIPT_PLACEHOLDER */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border-light)] rounded-[4px] p-4 text-center">
                <p className="text-xs font-body text-neutral-dim">Chat widget loads here</p>
              </div>
            </div>

            {/* Stat row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[6px] p-5 text-center">
                <p className="font-heading font-bold text-3xl text-primary uppercase">{brandDNA.copy.insurance.stat1Value}</p>
                <p className="text-xs font-body text-neutral mt-1">{brandDNA.copy.insurance.stat1Label}</p>
              </div>
              <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[6px] p-5 text-center">
                <p className="font-heading font-bold text-3xl text-primary uppercase">{brandDNA.copy.insurance.stat2Value}</p>
                <p className="text-xs font-body text-neutral mt-1">{brandDNA.copy.insurance.stat2Label}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
