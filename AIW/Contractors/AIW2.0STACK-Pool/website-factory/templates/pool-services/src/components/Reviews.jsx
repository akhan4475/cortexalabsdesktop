import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import brandDNA from '../config/brand-dna';

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="14" height="14" viewBox="0 0 14 14" fill={n <= rating ? 'rgb(var(--accent))' : 'none'} stroke="rgb(var(--accent))" strokeWidth="1" aria-hidden="true">
          <path d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7L7 1z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const author = review.author || review.name || 'Verified Customer';
  return (
    <article className="bg-white border border-neutral-dim rounded-xl p-6 shadow-card flex flex-col gap-3">
      <StarRating rating={review.rating || 5} />
      <p className="font-body text-sm text-ink leading-relaxed flex-1 italic">
        &ldquo;{review.text}&rdquo;
      </p>
      <div className="flex items-center justify-between pt-2 border-t border-neutral-dim">
        <span className="font-body text-sm font-semibold text-ink">{author}</span>
        {review.source && (
          <span className="font-body text-xs text-silver capitalize">{review.source}</span>
        )}
      </div>
    </article>
  );
}

const FALLBACK_REVIEWS = [
  { author: 'Sarah M.', source: 'Google', rating: 5, text: 'They showed up on time, left my pool spotless, and explained everything they did. Best pool service I have ever used.' },
  { author: 'James R.', source: 'Google', rating: 5, text: 'Had a green pool nightmare and they cleared it in under 48 hours. Incredible turnaround. Highly recommend.' },
  { author: 'Linda K.', source: 'Google', rating: 5, text: 'Professional, friendly, and thorough. My pool has never looked this good. We switched from our old company and have no regrets.' },
];

export default function Reviews() {
  const reduce = useReducedMotion();
  const items = brandDNA.reviews.items.length > 0 ? brandDNA.reviews.items : FALLBACK_REVIEWS;
  const [page, setPage] = useState(0);

  const COLS = 3;
  const totalPages = Math.ceil(items.length / COLS);
  const visible = items.slice(page * COLS, page * COLS + COLS);

  return (
    <section id="reviews" className="bg-neutral py-section-gap lg:py-section-gap-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-6"
        >
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-accent mb-3">
            {brandDNA.copy.reviews.label}
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl text-ink mb-3">
            {brandDNA.copy.reviews.heading}
          </h2>
          {brandDNA.copy.reviews.body && (
            <p className="font-body text-lg text-silver max-w-xl mx-auto mb-2">
              {brandDNA.copy.reviews.body}
            </p>
          )}
        </motion.div>

        {/* Aggregate stats */}
        {(brandDNA.reviews.rating > 0 || brandDNA.reviews.totalReviewCount > 0) && (
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-10"
          >
            {brandDNA.reviews.googleStat && (
              <div className="text-center">
                <p className="font-heading text-3xl text-ink tabular-nums">{brandDNA.reviews.googleStat}</p>
                <p className="font-body text-xs text-silver">{brandDNA.reviews.googleLabel}</p>
              </div>
            )}
            {brandDNA.reviews.facebookStat && (
              <div className="text-center">
                <p className="font-heading text-3xl text-ink tabular-nums">{brandDNA.reviews.facebookStat}</p>
                <p className="font-body text-xs text-silver">{brandDNA.reviews.facebookLabel}</p>
              </div>
            )}
            {brandDNA.copy.reviews.summary && (
              <p className="font-body text-sm text-silver max-w-xs text-center">{brandDNA.copy.reviews.summary}</p>
            )}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={reduce ? false : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? {} : { opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visible.map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}
          </motion.div>
        </AnimatePresence>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8" role="group" aria-label="Review pages">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Page ${i + 1}`}
                aria-current={i === page ? 'true' : undefined}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  i === page ? 'bg-accent scale-125' : 'bg-neutral-dim hover:bg-silver'
                }`}
              ></button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
