import brandDNA from '../config/brand-dna';

const ownerName = brandDNA.team?.founder?.name || 'John';
const ownerTitle = brandDNA.team?.founder?.title || 'Owner';
const yearsExp = brandDNA.team?.founder?.yearsExp || '39';
const companyName = brandDNA.company?.name || 'Zentz & Son Roofing';
const founded = brandDNA.company?.founded || '1985';
const ownerPhoto = brandDNA.team_members?.[0]?.filename
  ? `/team/${brandDNA.team_members[0].filename}`
  : '/images/owner/owner.jpg';
const ownerQuote = brandDNA.team_members?.[0]?.quote || null;

export default function TeamSection() {
  return (
    <section
      id="owner"
      className="bg-[var(--color-bg)] py-section-gap-lg"
      aria-labelledby="owner-heading"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-12 lg:gap-16 items-start">

          {/* Photo column */}
          <div className="w-full">
            <div className="relative w-full aspect-[3/4] rounded-[6px] overflow-hidden bg-[var(--color-surface)]">
              <img
                src={ownerPhoto}
                alt={`${ownerName}, ${ownerTitle} of ${companyName}`}
                className="absolute inset-0 w-full h-full object-cover object-top"
                loading="lazy"
                decoding="async"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              {/* Fallback icon shown behind the image if it fails to load */}
              <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 text-neutral/30">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Name plate under photo */}
            <div className="mt-5 pl-1">
              <p className="font-heading font-bold text-2xl text-ink uppercase">{ownerName}</p>
              <p className="text-sm font-body text-primary font-semibold mt-0.5">{ownerTitle} &mdash; {companyName}</p>
              <p className="text-xs font-body text-neutral mt-1">{yearsExp}+ years in the trade</p>
            </div>
          </div>

          {/* Story column */}
          <div className="flex flex-col justify-center">
            <p className="text-xs font-body font-semibold uppercase tracking-[0.12em] text-primary mb-3">
              Meet the Owner
            </p>
            <h2
              id="owner-heading"
              className="font-heading font-bold uppercase text-4xl lg:text-5xl text-ink leading-tight mb-6"
            >
              {yearsExp} Years.<br />Same Standard.
            </h2>

            <div className="flex flex-col gap-4 mb-8">
              <p className="text-base font-body text-ink leading-relaxed">
                {ownerName} Zentz grew up watching his father roof houses across Carroll County. At 14, he was carrying bundles up ladders on weekends. At 22, he had his own truck, his first crew, and a reputation for showing up on time and cleaning up before he left.
              </p>
              <p className="text-base font-body text-ink leading-relaxed">
                He started {companyName} in {founded} with one rule: he would not put his name on a roof he would not want on his own house. That rule is still the reason every job gets a personal walkthrough from {ownerName} before any crew drives away.
              </p>
              <p className="text-base font-body text-ink leading-relaxed">
                {yearsExp} years later, most of the new business comes from neighbors of past clients. No ads. Just roofs that hold, and homeowners who talk.
              </p>
            </div>

            {/* Quote */}
            {ownerQuote && (
              <blockquote className="border-l-4 border-primary pl-5 mb-8">
                <p className="text-lg font-accent italic text-ink leading-relaxed">
                  "{ownerQuote}"
                </p>
                <footer className="mt-2 text-xs font-body text-neutral">
                  {ownerName}, Owner
                </footer>
              </blockquote>
            )}

            {/* Trust chips */}
            <div className="flex flex-wrap gap-3">
              {[
                `${yearsExp}+ Years Experience`,
                'MHIC Licensed',
                'Every Job, Personal Walkthrough',
                'Family Owned',
              ].map((chip) => (
                <span
                  key={chip}
                  className="text-xs font-body font-semibold text-ink border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 rounded-[3px]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
