import { useState } from 'react';
import { motion } from 'framer-motion';
import brandDNA from '../config/brand-dna.js';

const EASE = [0.16, 1, 0.3, 1];

export default function PortfolioSection({ limit = null, filter = null }) {
  const copy = brandDNA.copy.gallery;
  let projects = brandDNA.previous_projects;
  if (filter) projects = projects.filter((p) => p.category === filter);
  if (limit) projects = projects.slice(0, limit);

  if (!projects.length) return null;

  return (
    <section className="py-section-gap-lg bg-primary-slate/5" id="portfolio">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: EASE }}
          className="text-center mb-12"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">
            {copy.label}
          </span>
          <h2 className="font-heading text-4xl font-semibold text-primary mt-2 mb-4">
            {copy.heading}
          </h2>
          <p className="text-neutral-dim max-w-xl mx-auto">{copy.body}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-neutral-dim mb-6">Like what you see? Let&apos;s plan yours.</p>
          <a
            href="#contact-form"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-primary-dark font-semibold text-base px-7 py-3.5 rounded-full transition-colors duration-150"
          >
            {brandDNA.copy.buttonText}
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }) {
  const [flipped, setFlipped] = useState(false);
  const EASE = [0.16, 1, 0.3, 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: EASE, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-2xl shadow-card-lg bg-primary aspect-[4/3] cursor-pointer"
      onClick={() => setFlipped((v) => !v)}
    >
      <img
        src={`/work/${project.filename}`}
        alt={project.alt || project.caption || 'Completed landscaping project'}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {project.caption && (
          <p className="font-heading text-lg font-semibold text-ink">{project.caption}</p>
        )}
        {project.category && (
          <span className="inline-block mt-1 text-sm text-accent">{project.category}</span>
        )}
      </div>
    </motion.div>
  );
}
