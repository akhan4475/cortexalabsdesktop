import brandDNA from '../config/brand-dna';
import StickyNav from '../components/StickyNav';
import PageHero from '../components/PageHero';
import ReviewTiles from '../components/ReviewTiles';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';

const founder = brandDNA.team?.founder || { name: 'John', displayName: 'John', title: 'Owner', yearsExp: '20' };
const company = brandDNA.company.shortName || brandDNA.company.name;
const city = brandDNA.address?.city || brandDNA.company.serviceRegion;
const founded = brandDNA.company.founded || '2004';
const yearsInBusiness = brandDNA.company.yearsInBusiness || '20';

const STORY_PARAGRAPHS = [
  `${founder.displayName} didn't get into roofing to get rich. He grew up watching what happens when a roof fails — water in the walls, ruined ceilings, families displaced during the worst storms of the year. He saw that too many contractors showed up late, gave vague estimates, and disappeared after the final check cleared.`,
  `He started ${company} because he wanted to do it differently. Every quote is written down before a single nail goes in. Every job gets a final walkthrough, personally, before the crew leaves the driveway. If something isn't right, it gets fixed — no argument, no invoice.`,
  `In ${yearsInBusiness} years serving ${city} and the surrounding area, ${founder.displayName} has built the kind of reputation that runs on word of mouth. Most new customers come from a neighbor's referral. That's the only metric he tracks.`,
  `When he's not on a job site, you'll find him at the local hardware suppliers he's been working with since he started. He knows which materials hold up in this region and which ones look good in a catalogue but fail early. That knowledge doesn't come from a certification — it comes from being here, doing this, for ${yearsInBusiness} years.`,
];

const TIMELINE = [
  { year: founded,                          label: 'Founded the company', detail: `Started ${company} out of a pickup truck with two crew members and a promise to show up on time.` },
  { year: String(Number(founded) + 5),     label: 'First GAF certification', detail: 'Earned manufacturer certification after consistent quality installs. Extended warranty access for every client.' },
  { year: String(Number(founded) + 12),    label: 'Expanded to full crew',  detail: 'Grew to a team of 8 full-time crew members. All trained in-house to the same standards.' },
  { year: 'Today',                          label: `Still on every job`,     detail: `${founder.displayName} personally reviews every estimate and does the final walkthrough before a job closes.` },
];

export default function OwnerPage() {
  return (
    <>
      <StickyNav />
      <main>
        <PageHero
          heading={`About the Owner`}
          subtext={`${founder.displayName} started ${company} in ${founded}. Here's why he did it and how he runs it.`}
          breadcrumb="About the Owner"
        />

        {/* ── Owner intro split ─────────────────────────────────────── */}
        <section className="bg-white py-20 px-4 sm:px-6">
          <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[420px_1fr] gap-12 items-start">

            {/* Photo column */}
            <div className="relative">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-[var(--color-surface)]">
                <img
                  src="/images/owner/owner-headshot.jpg"
                  alt={`${founder.displayName}, Owner of ${company}`}
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface)]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 text-neutral-dim opacity-30" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {/* Name card */}
              <div className="mt-5 bg-[var(--color-dark-section)] text-white rounded-lg px-6 py-4">
                <p className="font-heading font-extrabold text-xl uppercase tracking-wide">{founder.displayName}</p>
                <p className="text-sm text-white/60 mt-0.5">{founder.title} &middot; {company}</p>
                <p className="text-xs text-white/40 mt-1">{yearsInBusiness} years in the roofing industry</p>
              </div>
            </div>

            {/* Story column */}
            <div className="pt-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary mb-3">In His Own Words</p>
              <h2 className="font-heading font-extrabold uppercase text-4xl text-ink leading-tight mb-8">
                Experience Built From the Ground Up
              </h2>
              <div className="space-y-5 text-base text-neutral leading-relaxed">
                {STORY_PARAGRAPHS.map((p, i) => <p key={i}>{p}</p>)}
              </div>

              {/* Quote pullout */}
              <blockquote className="mt-8 border-l-4 border-primary pl-5 py-1">
                <p className="text-lg font-semibold text-ink italic leading-snug">
                  "{brandDNA.team_members?.[0]?.quote || `A roof done right means I never hear from that homeowner again -- until they refer me to a neighbor.`}"
                </p>
                <footer className="mt-2 text-sm text-neutral">{founder.displayName}, {founder.title}</footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* ── Timeline ─────────────────────────────────────────────── */}
        <section className="bg-[var(--color-surface)] py-20 px-4 sm:px-6">
          <div className="max-w-[900px] mx-auto">
            <header className="text-center mb-14">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary mb-3">The Journey</p>
              <h2 className="font-heading font-extrabold uppercase text-4xl text-ink leading-tight">
                {yearsInBusiness} Years. One Standard.
              </h2>
            </header>

            <ol className="relative border-l-2 border-primary/20 space-y-10 pl-8" role="list">
              {TIMELINE.map(({ year, label, detail }) => (
                <li key={year} className="relative">
                  <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="w-2 h-2 rounded-full bg-white" />
                  </span>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">{year}</p>
                  <h3 className="font-heading font-bold uppercase text-xl text-ink mb-1">{label}</h3>
                  <p className="text-sm text-neutral leading-relaxed">{detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Stats row ─────────────────────────────────────────────── */}
        <section className="bg-[var(--color-dark-section)] py-14 px-4 sm:px-6">
          <div className="max-w-[1200px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { num: `${yearsInBusiness}+`, label: 'Years in business' },
              { num: `${brandDNA.reviews?.googleCount || 100}+`, label: '5-star reviews' },
              { num: '100%', label: 'Jobs personally reviewed' },
              { num: '0',    label: 'Callbacks for quality issues' },
            ].map(({ num, label }) => (
              <div key={label}>
                <p className="font-heading font-black text-4xl text-white tabular-nums leading-none mb-2">{num}</p>
                <p className="text-xs text-white/50 uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <ReviewTiles />
        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyBar />
    </>
  );
}
