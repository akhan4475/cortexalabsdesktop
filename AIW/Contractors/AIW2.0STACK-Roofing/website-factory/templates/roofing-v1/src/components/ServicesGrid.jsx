import brandDNA from '../config/brand-dna';

const defaultServices = [
  { slug: 'roof-replacement', name: 'Roof Replacement', description: 'Full residential replacement done in a day.', image: '/images/services/replacement.jpg' },
  { slug: 'roof-repair', name: 'Roof Repair', description: 'Fast, honest repairs for leaks and damage.', image: '/images/services/repair.jpg' },
  { slug: 'storm-damage', name: 'Storm Damage', description: 'Insurance claim help included, no extra charge.', image: '/images/services/storm.jpg' },
  { slug: 'emergency-repair', name: 'Emergency Repair', description: '24/7 response for urgent roofing situations.', image: '/images/services/emergency.jpg' },
  { slug: 'gutter-services', name: 'Gutter Services', description: 'Installation, repair, and cleaning.', image: '/images/services/gutters.jpg' },
  { slug: 'free-inspection', name: 'Free Inspection', description: 'No-pressure roof assessment from a licensed expert.', image: '/images/services/inspection.jpg' },
];

export default function ServicesGrid() {
  const services = brandDNA.services.length > 0
    ? brandDNA.services.map((s, i) => ({ ...defaultServices[i] || defaultServices[0], ...s }))
    : defaultServices;

  return (
    <section
      id="services"
      className="bg-[var(--color-surface-alt)] py-section-gap-lg"
      aria-labelledby="services-heading"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <header className="mb-10">
          <p className="text-xs font-body font-semibold uppercase tracking-[0.12em] text-primary mb-2">
            {brandDNA.copy.services.label}
          </p>
          <h2
            id="services-heading"
            className="font-heading font-bold uppercase text-4xl text-ink leading-tight"
          >
            {brandDNA.copy.services.heading}
          </h2>
          {brandDNA.copy.services.body && (
            <p className="mt-3 text-base font-body text-neutral max-w-[480px]">{brandDNA.copy.services.body}</p>
          )}
        </header>

        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          role="list"
          aria-label="Roofing services"
        >
          {services.map((svc) => (
            <li key={svc.slug}>
              <a
                href={`/services/${svc.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-[6px] h-44 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={svc.name}
              >
                <img
                  src={svc.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1A]/90 via-[#0A0F1A]/40 to-transparent" aria-hidden="true" />
                <div className="relative mt-auto p-5">
                  <h3 className="font-heading font-bold uppercase text-lg text-white leading-tight mb-1">
                    {svc.name}
                  </h3>
                  <p className="text-xs font-body text-silver line-clamp-2">{svc.description}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
