import { motion, useReducedMotion } from 'framer-motion';
import NavBar from '../components/NavBar';
import TrustBar from '../components/TrustBar';
import WhyChoose from '../components/WhyChoose';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import brandDNA from '../config/brand-dna';

export default function AboutPage() {
  const reduce = useReducedMotion();
  const founder = brandDNA.team.founder;

  return (
    <>
      <title>{`About ${brandDNA.company.shortName} | Pool Service`}</title>
      <meta name="description" content={`${brandDNA.company.name} is a locally-owned pool service company. Licensed, insured, ${founder.yearsExp}+ years experience.`} />
      <NavBar />
      <main>
        {/* About hero */}
        <section
          className="pt-32 pb-16"
          style={{ background: 'linear-gradient(135deg, rgb(var(--primary-dark)) 0%, rgb(var(--primary-slate)) 100%)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-accent mb-3">
                {brandDNA.copy.founder.label}
              </p>
              <h1 className="font-heading text-4xl lg:text-5xl text-white mb-5">
                {brandDNA.copy.founder.heading}
              </h1>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* Founder story */}
        <section className="bg-white py-section-gap lg:py-section-gap-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="aspect-[4/3] bg-neutral rounded-xl overflow-hidden mb-6">
                  {brandDNA.team_group_photo ? (
                    <img
                      src={`/team/${brandDNA.team_group_photo}`}
                      alt={`${brandDNA.company.name} team`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-dim">
                      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                        <circle cx="32" cy="24" r="14" stroke="rgb(var(--primary))" strokeWidth="2" fill="none" opacity="0.4" />
                        <path d="M8 56c0-13 11-22 24-22s24 9 24 22" stroke="rgb(var(--primary))" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Mission / Vision */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-neutral border border-neutral-dim rounded-xl p-5">
                    <p className="font-body text-xs font-semibold uppercase tracking-widest text-accent mb-2">
                      {brandDNA.copy.founder.missionLabel}
                    </p>
                    <p className="font-body text-sm text-ink leading-relaxed">
                      {brandDNA.copy.founder.mission}
                    </p>
                  </div>
                  <div className="bg-neutral border border-neutral-dim rounded-xl p-5">
                    <p className="font-body text-xs font-semibold uppercase tracking-widest text-accent mb-2">
                      {brandDNA.copy.founder.visionLabel}
                    </p>
                    <p className="font-body text-sm text-ink leading-relaxed">
                      {brandDNA.copy.founder.vision}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                      <circle cx="14" cy="10" r="6" stroke="rgb(var(--primary))" strokeWidth="1.5" fill="none" />
                      <path d="M4 24c0-5.5 4.5-9 10-9s10 3.5 10 9" stroke="rgb(var(--primary))" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-heading text-xl text-ink">{founder.displayName}</p>
                    <p className="font-body text-sm text-silver">{founder.title}</p>
                    <p className="font-body text-xs text-accent font-semibold">{founder.expLabel}</p>
                  </div>
                </div>

                {brandDNA.copy.founder.para1 && (
                  <p className="font-body text-base text-ink leading-relaxed mb-4">
                    {brandDNA.copy.founder.para1}
                  </p>
                )}
                {brandDNA.copy.founder.para2 && (
                  <p className="font-body text-base text-ink leading-relaxed">
                    {brandDNA.copy.founder.para2}
                  </p>
                )}

                {/* Team members */}
                {brandDNA.team_members.length > 0 && (
                  <div className="mt-8">
                    <p className="font-body text-xs font-semibold uppercase tracking-widest text-silver mb-4">Our Team</p>
                    <div className="flex flex-wrap gap-3">
                      {brandDNA.team_members.map(({ filename, name, role }) => (
                        <div key={name} className="flex items-center gap-2 bg-neutral border border-neutral-dim rounded-full px-3 py-1.5">
                          {filename && (
                            <img
                              src={`/team/${filename}`}
                              alt={name}
                              className="w-6 h-6 rounded-full object-cover"
                              loading="lazy"
                            />
                          )}
                          <span className="font-body text-xs font-medium text-ink">{name}</span>
                          {role && <span className="font-body text-xs text-silver">{role}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        <WhyChoose />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
