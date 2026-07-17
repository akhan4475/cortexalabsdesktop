import brandDNA from '../config/brand-dna';
import StickyNav from '../components/StickyNav';
import PageHero from '../components/PageHero';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';

const company = brandDNA.company.shortName || brandDNA.company.name;
const city = brandDNA.address?.city || brandDNA.company.serviceRegion;

const PLACEHOLDER_MEMBERS = [
  { name: 'John',    role: 'Owner & Lead Estimator', bio: 'On every job from estimate to final walkthrough.', photo: '/images/team/member-01.jpg' },
  { name: 'Mike',    role: 'Senior Crew Lead',        bio: '14 years installing roofs across the region.', photo: '/images/team/member-02.jpg' },
  { name: 'Carlos',  role: 'Install Specialist',      bio: 'GAF-trained with a reputation for clean ridge work.', photo: '/images/team/member-03.jpg' },
  { name: 'Dave',    role: 'Storm Damage Inspector',  bio: 'Helps homeowners document damage for insurance claims.', photo: '/images/team/member-04.jpg' },
  { name: 'Sarah',   role: 'Office Manager',          bio: 'Keeps the schedule running and calls answered fast.', photo: '/images/team/member-05.jpg' },
  { name: 'Tom',     role: 'Gutter & Siding Lead',    bio: 'Handles all gutter installs and fascia replacements.', photo: '/images/team/member-06.jpg' },
];

const members = brandDNA.team_members?.length > 0
  ? brandDNA.team_members.map((m, i) => ({
      name: m.name,
      role: m.role,
      bio: m.bio || '',
      photo: m.filename ? `/team/${m.filename}` : PLACEHOLDER_MEMBERS[i % PLACEHOLDER_MEMBERS.length].photo,
    }))
  : PLACEHOLDER_MEMBERS;

const VALUES = [
  { icon: '01', heading: 'Show up when we say we will', body: 'Every appointment is confirmed the night before. If something changes, you hear from us first.' },
  { icon: '02', heading: 'Tell you what you actually need', body: 'We write down exactly what needs replacing and what can wait. No pressure on the second number.' },
  { icon: '03', heading: 'Clean up like we were never there', body: 'Magnetic nail sweep of the yard, dumpster haul, full site walkthrough before we leave.' },
  { icon: '04', heading: 'Stand behind every job', body: 'Written workmanship warranty on every project. If it fails because of our work, we come back.' },
];

export default function TeamPage() {
  return (
    <>
      <StickyNav />
      <main>
        <PageHero
          heading="Meet the Team"
          subtext={`The people behind every ${company} job. Real names, real accountability.`}
          breadcrumb="Meet the Team"
        />

        {/* ── Intro ────────────────────────────────────────────────── */}
        <section className="bg-white py-20 px-4 sm:px-6">
          <div className="max-w-[900px] mx-auto text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary mb-3">Our People</p>
            <h2 className="font-heading font-extrabold uppercase text-4xl text-ink leading-tight mb-6">
              Behind Every Roof Is a Named Crew Member
            </h2>
            <p className="text-base text-neutral leading-relaxed mb-4">
              Every {company} job is assigned to a named crew lead before we start. That person is responsible from the first nail to the final sweep. You will know who is on your roof and how to reach them.
            </p>
            <p className="text-base text-neutral leading-relaxed">
              We don't use subcontractors. Everyone on a {company} job has been trained by us, uses our materials, and follows our cleanup standards. That's how we keep the quality consistent across every job in {city}.
            </p>
          </div>
        </section>

        {/* ── Team grid ────────────────────────────────────────────── */}
        <section className="bg-[var(--color-surface)] py-20 px-4 sm:px-6" aria-labelledby="team-grid-heading">
          <div className="max-w-[1200px] mx-auto">
            <h2 id="team-grid-heading" className="sr-only">Team members</h2>

            {/* Group photo */}
            <div className="mb-12 rounded-lg overflow-hidden aspect-[16/6] bg-[var(--color-surface-alt)] relative">
              <img
                src="/images/team/team-group.jpg"
                alt={`${company} full crew`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-neutral-dim opacity-20" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                  <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                </svg>
                <p className="text-neutral-dim text-sm mt-2 opacity-40">Drop team-group.jpg in /images/team/</p>
              </div>
            </div>

            {/* Individual cards */}
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6" role="list">
              {members.map((member, i) => (
                <li key={i} className="flex flex-col gap-3">
                  <div className="aspect-square rounded-lg overflow-hidden bg-[var(--color-surface-alt)] relative">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                      onError={e => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-neutral-dim opacity-25" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="font-heading font-bold text-base text-ink uppercase tracking-wide">{member.name}</p>
                    <p className="text-xs text-primary font-semibold mt-0.5">{member.role}</p>
                    {member.bio && <p className="text-xs text-neutral mt-1 leading-relaxed">{member.bio}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── How we work ──────────────────────────────────────────── */}
        <section className="bg-white py-20 px-4 sm:px-6" aria-labelledby="values-heading">
          <div className="max-w-[1200px] mx-auto">
            <header className="mb-12 max-w-[600px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary mb-3">How We Work</p>
              <h2 id="values-heading" className="font-heading font-extrabold uppercase text-4xl text-ink leading-tight">
                The Four Things Every {company} Job Has in Common
              </h2>
            </header>

            <ul className="grid sm:grid-cols-2 gap-6" role="list">
              {VALUES.map(({ icon, heading, body }) => (
                <li key={icon} className="flex items-start gap-5 border border-[var(--color-border)] rounded-lg p-6 bg-white shadow-sm">
                  <span className="shrink-0 font-heading font-black text-4xl text-primary/15 tabular-nums leading-none select-none">{icon}</span>
                  <div>
                    <h3 className="font-semibold text-base text-ink mb-1">{heading}</h3>
                    <p className="text-sm text-neutral leading-relaxed">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Photo instructions placeholder ───────────────────────── */}
        <section className="bg-[var(--color-surface)] py-10 px-4 sm:px-6 border-t border-[var(--color-border)]">
          <div className="max-w-[900px] mx-auto text-center">
            <p className="text-xs text-neutral-dim">
              Drop team photos in <code className="bg-[var(--color-surface-alt)] px-1.5 py-0.5 rounded text-xs">/public/images/team/</code> using the filenames above and they will appear automatically.
            </p>
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyBar />
    </>
  );
}
