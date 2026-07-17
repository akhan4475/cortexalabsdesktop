const TEAM = [
  {
    name: 'Mike Torres',
    role: 'Lead Installer',
    bio: '14 years roofing experience. Mike runs the install crew on replacement jobs and has personally completed over 400 roofs in Carroll County.',
    photo: '/images/team/mike.jpg',
  },
  {
    name: 'Dave Kline',
    role: 'Project Foreman',
    bio: 'Dave coordinates scheduling, material orders, and daily crew logistics. If you call to check on your job, you will likely talk to Dave.',
    photo: '/images/team/dave.jpg',
  },
  {
    name: 'Sarah Mitchell',
    role: 'Customer Relations',
    bio: 'Sarah handles all estimates, follow-ups, and insurance paperwork. She knows every open job by name and makes sure nothing falls through the cracks.',
    photo: '/images/team/sarah.jpg',
  },
  {
    name: 'Tom Reed',
    role: 'Roofing Technician',
    bio: 'Tom specializes in storm damage assessment and emergency repairs. He is usually first on-site after a major weather event in the area.',
    photo: '/images/team/tom.jpg',
  },
];

function MemberCard({ member }) {
  return (
    <li className="flex flex-col bg-[var(--color-bg)] rounded-[6px] overflow-hidden border border-[var(--color-border)]">
      {/* Photo */}
      <div className="relative aspect-square bg-[var(--color-surface)]">
        <img
          src={member.photo}
          alt={member.name}
          className="absolute inset-0 w-full h-full object-cover object-top"
          loading="lazy"
          decoding="async"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-neutral/25">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-1.5 flex-1">
        <p className="font-heading font-bold text-lg text-ink uppercase leading-tight">{member.name}</p>
        <p className="text-xs font-body font-semibold text-primary uppercase tracking-wide">{member.role}</p>
        <p className="text-sm font-body text-ink leading-relaxed mt-1">{member.bio}</p>
      </div>
    </li>
  );
}

export default function MeetTheTeamSection() {
  return (
    <section
      id="team"
      className="bg-[var(--color-surface-alt)] py-section-gap-lg"
      aria-labelledby="team-heading"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <header className="mb-10">
          <p className="text-xs font-body font-semibold uppercase tracking-[0.12em] text-primary mb-2">
            Your Crew
          </p>
          <h2
            id="team-heading"
            className="font-heading font-bold uppercase text-4xl text-ink leading-tight"
          >
            Meet the Team
          </h2>
          <p className="mt-3 text-base font-body text-ink max-w-[520px]">
            Real people, real accountability. Every job is run by a named crew member who takes ownership from first call to final walkthrough.
          </p>
        </header>

        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          role="list"
          aria-label="Team members"
        >
          {TEAM.map((member) => (
            <MemberCard key={member.name} member={member} />
          ))}
        </ul>
      </div>
    </section>
  );
}
