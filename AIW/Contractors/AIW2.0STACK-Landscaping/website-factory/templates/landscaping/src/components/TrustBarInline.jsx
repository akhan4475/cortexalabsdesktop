import { motion } from 'framer-motion';
import brandDNA from '../config/brand-dna.js';

const EASE = [0.16, 1, 0.3, 1];

export default function TrustBarInline() {
  const stats = [
    { value: brandDNA.reviews.rating ? `${brandDNA.reviews.rating}★` : '5★', label: 'Rating' },
    { value: brandDNA.reviews.totalReviewCount ? `${brandDNA.reviews.totalReviewCount}+` : '100+', label: 'Reviews' },
    { value: brandDNA.team.founder.yearsExp ? `${brandDNA.team.founder.yearsExp}+ yrs` : '10+ yrs', label: 'Experience' },
    { value: 'Licensed', label: '& Insured' },
  ];

  return (
    <section className="bg-primary-slate/20 border-y border-primary-slate/30 py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: EASE, delay: i * 0.08 }}
              className="flex flex-col items-center text-center gap-0.5"
            >
              <span className="font-heading text-2xl font-semibold text-ink tabular-nums">
                {stat.value}
              </span>
              <span className="text-sm text-neutral">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
