import brandDNA from '../config/brand-dna';

const StarRow = ({ rating = 5 }) => (
  <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map(s => (
      <svg key={s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
        className={`w-4 h-4 ${s <= rating ? 'text-[var(--color-star)]' : 'text-neutral-dim'}`}
        aria-hidden="true">
        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
      </svg>
    ))}
  </div>
);

export default function ReviewTiles() {
  const items = brandDNA.reviews.items.slice(0, 6);

  return (
    <section
      id="reviews"
      className="bg-[var(--color-surface)] py-section-gap-lg"
      aria-labelledby="reviews-heading"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-body font-semibold uppercase tracking-[0.12em] text-primary mb-2">
              {brandDNA.copy.reviews.label}
            </p>
            <h2
              id="reviews-heading"
              className="font-heading font-bold uppercase text-4xl text-ink leading-tight"
            >
              {brandDNA.copy.reviews.heading}
            </h2>
          </div>
          {brandDNA.reviews.googleUrl && (
            <a
              href={brandDNA.reviews.googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-body font-semibold text-primary hover:text-primary-dark transition-colors whitespace-nowrap shrink-0"
            >
              Read All {brandDNA.reviews.googleCount > 0 ? `${brandDNA.reviews.googleCount} ` : ''}Reviews on Google &rarr;
            </a>
          )}
        </header>

        {items.length > 0 ? (
          <ul
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            role="list"
            aria-label="Customer reviews"
          >
            {items.map((rev, i) => (
              <li
                key={i}
                className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[6px] p-6 flex flex-col gap-3"
              >
                <StarRow rating={rev.rating || 5} />
                <blockquote className="text-sm font-body text-neutral leading-relaxed line-clamp-4 flex-1">
                  "{rev.text}"
                </blockquote>
                <footer className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--color-border)]">
                  <cite className="text-xs font-body font-semibold text-ink not-italic">
                    {rev.author || rev.name}
                  </cite>
                  <span className="text-xs font-body text-neutral-dim">{rev.source || 'Google'}</span>
                </footer>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm font-body text-neutral">Reviews will appear here after Stage 2 research.</p>
          </div>
        )}
      </div>
    </section>
  );
}
