import { useState } from 'react';
import brandDNA from '../config/brand-dna';

const defaultProjects = [
  { beforeImage: '/images/gallery/before-1.jpg', afterImage: '/images/gallery/after-1.jpg', location: 'Local Project', serviceType: 'Roof Replacement', year: '2024' },
  { beforeImage: '/images/gallery/before-2.jpg', afterImage: '/images/gallery/after-2.jpg', location: 'Local Project', serviceType: 'Storm Damage Repair', year: '2024' },
  { beforeImage: '/images/gallery/before-3.jpg', afterImage: '/images/gallery/after-3.jpg', location: 'Local Project', serviceType: 'Roof Repair', year: '2024' },
];

function BeforeAfterPair({ project }) {
  const [showAfter, setShowAfter] = useState(false);
  return (
    <div className="flex flex-col gap-0 rounded-[6px] overflow-hidden border border-[var(--color-border-light)]">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={showAfter ? project.afterImage : project.beforeImage}
          alt={showAfter ? `After: ${project.serviceType}` : `Before: ${project.serviceType}`}
          className="w-full h-full object-cover object-center transition-opacity duration-300"
          loading="lazy"
          decoding="async"
        />
        <button
          onClick={() => setShowAfter(v => !v)}
          className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-body font-semibold px-3 py-1.5 rounded-[4px] hover:bg-primary hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {showAfter ? 'Show Before' : 'Show After'}
        </button>
        <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-body px-2 py-0.5 rounded-[2px] uppercase tracking-wide">
          {showAfter ? 'After' : 'Before'}
        </span>
      </div>
      <div className="bg-white px-4 py-3">
        <p className="text-xs font-body font-semibold text-ink uppercase tracking-wide">{project.serviceType}</p>
        <p className="text-xs font-body text-neutral">{project.location} &middot; {project.year}</p>
      </div>
    </div>
  );
}

export default function BeforeAfterGallery() {
  const projects = brandDNA.previous_projects.length >= 1
    ? brandDNA.previous_projects.map(p => ({
        beforeImage: `/work/${p.before_filename}`,
        afterImage:  `/work/${p.after_filename}`,
        location:    p.caption     || 'Local Project',
        serviceType: p.category    || 'Roofing',
        year:        p.year        || '2024',
      }))
    : defaultProjects;

  return (
    <section
      className="bg-[var(--color-surface-alt)] py-section-gap-lg"
      aria-labelledby="gallery-heading"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-body font-semibold uppercase tracking-[0.12em] text-primary mb-2">
              {brandDNA.copy.gallery.label}
            </p>
            <h2
              id="gallery-heading"
              className="font-heading font-bold uppercase text-4xl text-ink leading-tight"
            >
              {brandDNA.copy.gallery.heading}
            </h2>
          </div>
          <a
            href="/gallery"
            className="text-sm font-body font-semibold text-primary hover:text-primary-dark transition-colors whitespace-nowrap shrink-0"
          >
            See All Projects &rarr;
          </a>
        </header>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          role="list"
          aria-label="Before and after project gallery"
        >
          {projects.slice(0, 6).map((p, i) => (
            <div key={i} role="listitem">
              <BeforeAfterPair project={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
