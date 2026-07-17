import brandDNA from '../config/brand-dna';

export default function FinalCTA() {
  return (
    <section
      className="bg-[var(--color-dark-section)] py-section-gap-xl"
      aria-labelledby="final-cta-heading"
    >
      <div className="max-w-[720px] mx-auto px-6 text-center">
        <p className="text-xs font-body font-semibold uppercase tracking-[0.12em] text-primary mb-3">
          {brandDNA.copy.finalCta.label}
        </p>
        <h2
          id="final-cta-heading"
          className="font-heading font-bold uppercase text-5xl md:text-6xl text-white leading-tight mb-5"
        >
          {brandDNA.copy.finalCta.heading}
        </h2>
        <p className="text-base font-body text-silver leading-relaxed mb-8 max-w-[520px] mx-auto">
          {brandDNA.copy.finalCta.subtext}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#estimate"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-heading font-bold uppercase tracking-wide text-sm px-8 py-4 rounded-[4px] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-dark-section)]"
          >
            {brandDNA.copy.buttonText.getEstimate}
          </a>
          <a
            href={brandDNA.contact.phoneTelLink}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white text-white font-heading font-bold uppercase tracking-wide text-sm px-8 py-4 rounded-[4px] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-dark-section)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
              className="w-4 h-4" aria-hidden="true">
              <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
            </svg>
            {brandDNA.contact.phone}
          </a>
        </div>

        {brandDNA.copy.finalCta.footnote && (
          <p className="mt-5 text-xs font-body text-neutral-dim">
            {brandDNA.copy.finalCta.footnote}
          </p>
        )}
      </div>
    </section>
  );
}
