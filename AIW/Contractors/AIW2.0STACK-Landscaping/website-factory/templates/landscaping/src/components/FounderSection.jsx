import { motion } from 'framer-motion';
import brandDNA from '../config/brand-dna.js';

const EASE = [0.16, 1, 0.3, 1];

export default function FounderSection() {
  const copy = brandDNA.copy.founder;
  const { founder } = brandDNA.team;
  const photo = brandDNA.team_group_photo;

  return (
    <section className="py-section-gap-lg bg-primary-slate/5" id="about">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className="order-2 lg:order-1"
          >
            {photo ? (
              <img
                src={`/team/${photo}`}
                alt={`${founder.displayName} and the team`}
                className="w-full rounded-2xl object-cover aspect-[4/5] shadow-card-lg"
              />
            ) : (
              <div className="w-full rounded-2xl bg-primary-slate/30 aspect-[4/5] flex items-center justify-center">
                <span className="text-neutral text-sm">Owner photo</span>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
            className="order-1 lg:order-2 flex flex-col gap-6"
          >
            <div>
              <span className="text-accent font-semibold text-sm uppercase tracking-widest">
                {copy.label}
              </span>
              <h2 className="font-heading text-4xl font-semibold text-primary mt-2">
                {copy.heading || `Meet ${founder.displayName}`}
              </h2>
            </div>

            <div className="flex flex-col gap-4 text-neutral-dim leading-relaxed">
              <p>{copy.para1}</p>
              <p>{copy.para2}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {copy.vision && (
                <div className="p-4 rounded-xl bg-white border border-silver shadow-card">
                  <p className="text-xs font-semibold text-neutral-dim uppercase tracking-wider mb-1">
                    {copy.visionLabel}
                  </p>
                  <p className="text-sm text-primary font-medium">{copy.vision}</p>
                </div>
              )}
              {copy.mission && (
                <div className="p-4 rounded-xl bg-white border border-silver shadow-card">
                  <p className="text-xs font-semibold text-neutral-dim uppercase tracking-wider mb-1">
                    {copy.missionLabel}
                  </p>
                  <p className="text-sm text-primary font-medium">{copy.mission}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div>
                <p className="font-heading text-lg font-semibold text-primary">{founder.name}</p>
                <p className="text-sm text-neutral-dim">{founder.title}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
