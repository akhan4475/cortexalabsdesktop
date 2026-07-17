import brandDNA from '../config/brand-dna';

const defaultSteps = [
  { n: 1, title: 'Free Inspection', body: 'We assess your roof and give you an honest picture of what it needs.' },
  { n: 2, title: 'Estimate Review', body: 'We walk you through the scope, answer every question, no pressure.' },
  { n: 3, title: 'Install Day', body: 'Crew arrives on time, completes the job, cleans up fully.' },
  { n: 4, title: 'Final Walkthrough', body: "We inspect with you before we leave. You sign off, we're done." },
];

export default function ProcessSteps() {
  const steps = brandDNA.process_steps.length > 0 ? brandDNA.process_steps : defaultSteps;

  return (
    <section
      className="bg-[var(--color-surface-alt)] py-section-gap-lg"
      aria-labelledby="process-heading"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <header className="mb-12 text-center">
          <p className="text-xs font-body font-semibold uppercase tracking-[0.12em] text-primary mb-2">
            {brandDNA.copy.process.label}
          </p>
          <h2
            id="process-heading"
            className="font-heading font-bold uppercase text-4xl text-ink leading-tight"
          >
            {brandDNA.copy.process.heading}
          </h2>
        </header>

        <ol
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative"
          aria-label="Our process"
        >
          {/* Connector line -- desktop only */}
          <div
            className="hidden lg:block absolute top-5 left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-px bg-[var(--color-border-light)]"
            aria-hidden="true"
          />

          {steps.map((step) => (
            <li key={step.n} className="flex flex-col items-start lg:items-center gap-4 relative">
              <div
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 relative z-10"
                aria-hidden="true"
              >
                <span className="font-heading font-bold text-lg text-[var(--color-bg)] leading-none tabular-nums">
                  {step.n}
                </span>
              </div>
              <div className="lg:text-center">
                <h3 className="font-heading font-bold uppercase text-lg text-ink mb-1">{step.title}</h3>
                <p className="text-sm font-body text-ink leading-relaxed">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
