import { motion } from 'framer-motion';
import brandDNA from '../config/brand-dna.js';

const EASE = [0.16, 1, 0.3, 1];

export default function ReviewsSection() {
  const copy = brandDNA.copy.reviews;
  const { rating, googleCount, items } = brandDNA.reviews;

  return (
    <section className="py-section-gap-lg bg-white" id="reviews">
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
          {rating > 0 && googleCount > 0 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <GoogleLogo />
              <span className="font-semibold text-primary">{rating}</span>
              <StarRow rating={rating} />
              <span className="text-neutral-dim text-sm">({googleCount} reviews)</span>
            </div>
          )}
        </motion.div>

        {items.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {items.slice(0, 6).map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: EASE, delay: i * 0.08 }}
                className="flex flex-col gap-4 p-card-pad rounded-2xl border border-silver bg-white shadow-card"
              >
                <div className="flex items-center gap-2">
                  <GoogleLogo />
                  <StarRow rating={review.rating || 5} />
                </div>
                <p className="text-neutral-dim text-sm leading-relaxed flex-1">{review.text}</p>
                <div className="text-sm font-semibold text-primary">
                  {review.author || review.name}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {copy.summary && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: EASE }}
            className="text-center"
          >
            <p className="text-neutral-dim text-sm">{copy.summary}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-label="Google" role="img">
      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" />
      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z" />
      <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z" />
      <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z" />
    </svg>
  );
}

function StarRow({ rating = 5 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill={s <= rating ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={s <= rating ? 0 : 1}
          className="text-accent"
          aria-hidden="true"
        >
          <path d="M7 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.1l-3.2 1.8.6-3.6L1.8 4.8l3.6-.5L7 1z" />
        </svg>
      ))}
    </div>
  );
}
