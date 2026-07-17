import brandDNA from '../config/brand-dna';
import StickyNav from '../components/StickyNav';
import PageHero from '../components/PageHero';
import ReviewTiles from '../components/ReviewTiles';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
      className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true">
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
      className="w-10 h-10 text-primary" aria-hidden="true">
      <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
  );
}

export default function CertificationsPage() {
  const certs = brandDNA.certifications || [];

  return (
    <>
      <StickyNav />
      <main>
        <PageHero
          label={brandDNA.copy.certifications.label}
          heading={brandDNA.pages.certifications.heading}
          subtext={brandDNA.pages.certifications.subheading}
          breadcrumbLabel="Certifications"
        />

        {/* Intro */}
        <section className="bg-[var(--color-bg)] py-section-gap-lg">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-[640px] mb-14">
              <p className="text-base font-body text-neutral leading-relaxed mb-4">
                Before hiring any roofing contractor, ask for three things: their state license number, a copy of their certificate of insurance, and proof of any manufacturer certifications. These are not marketing badges. They are protections for you as a homeowner.
              </p>
              <p className="text-base font-body text-neutral leading-relaxed">
                Below is every credential {brandDNA.company.shortName} holds, what it means, and why it matters to your job specifically.
              </p>
            </div>

            {certs.length > 0 ? (
              <ul className="space-y-8" role="list">
                {certs.map((cert) => (
                  <li
                    key={cert.slug}
                    className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[6px] p-8"
                  >
                    <div className="flex items-start gap-6">
                      <div className="shrink-0">
                        {cert.logo ? (
                          <img
                            src={`/assets/certifications/${cert.logo}`}
                            alt={cert.shortName}
                            className="w-16 h-16 object-contain"
                          />
                        ) : (
                          <ShieldIcon />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start gap-3 mb-3">
                          <h2 className="font-heading font-bold uppercase text-2xl text-ink">
                            {cert.name}
                          </h2>
                          {cert.year_earned && (
                            <span className="text-xs font-body text-neutral-dim bg-[var(--color-bg)] border border-[var(--color-border)] px-2.5 py-1 rounded-full shrink-0">
                              Held since {cert.year_earned}
                            </span>
                          )}
                        </div>
                        <p className="text-base font-body text-neutral leading-relaxed mb-4">
                          {cert.description}
                        </p>
                        {cert.why_it_matters && (
                          <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-[4px] p-4">
                            <CheckIcon />
                            <div>
                              <p className="text-xs font-body font-semibold uppercase tracking-wider text-primary mb-1">
                                Why It Matters for Your Job
                              </p>
                              <p className="text-sm font-body text-neutral leading-relaxed">
                                {cert.why_it_matters}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm font-body text-neutral">Certifications will appear here after Stage 7 brand extraction.</p>
              </div>
            )}
          </div>
        </section>

        {/* What to ask any roofer */}
        <section className="bg-[var(--color-surface)] py-section-gap-lg" aria-labelledby="vet-heading">
          <div className="max-w-[1200px] mx-auto px-6">
            <header className="mb-8">
              <p className="text-xs font-body font-semibold uppercase tracking-[0.12em] text-primary mb-2">Before You Hire</p>
              <h2 id="vet-heading" className="font-heading font-bold uppercase text-3xl text-ink">
                3 Questions to Ask Every Roofing Contractor
              </h2>
            </header>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6" role="list">
              {[
                { q: "Can I see your state license number?", a: "Every state requires a roofing license for work over a certain dollar threshold. In MD, that is $500. An unlicensed contractor cannot legally take your money -- and their work cannot be pulled for permit." },
                { q: "Can I see your certificate of insurance?", a: "Ask specifically for general liability AND workers compensation. A contractor without workers comp on their crew means that if a worker is injured on your roof, your homeowner's insurance may be responsible." },
                { q: "Are you manufacturer-certified?", a: "GAF, Owens Corning, and CertainTeed all offer certification programs that allow contractors to provide extended warranties. Without certification, the contractor is limited to the standard warranty -- typically 2-5 years on workmanship." },
              ].map((item, i) => (
                <li key={i} className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[6px] p-6">
                  <p className="font-heading font-bold text-base text-ink mb-3">
                    {i + 1}. {item.q}
                  </p>
                  <p className="text-sm font-body text-neutral leading-relaxed">{item.a}</p>
                </li>
              ))}
            </ul>
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
