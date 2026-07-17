import brandDNA from '../config/brand-dna';

export default function Hero() {
  return (
    <section
      className="relative flex items-center min-h-[100svh] bg-[var(--color-bg)] overflow-hidden"
      aria-label="Hero"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-bg.jpg"
          alt={brandDNA.copy.hero.imageAlt}
          className="w-full h-full object-cover object-center"
          fetchpriority="high"
          decoding="async"
        />
        {/* Directional overlay — dark left for text legibility, fades right to show photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C1C26]/85 via-[#0C1C26]/55 to-[#0C1C26]/20" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 pt-[var(--nav-height)] pb-20 w-full">
        <div className="max-w-[640px]">
          {/* Eyebrow */}
          {brandDNA.copy.hero.eyebrow && (
            <p className="mb-4 text-xs font-body font-semibold uppercase tracking-[0.12em] text-primary motion-safe:animate-[fadeIn_0.4s_ease-out]">
              {brandDNA.copy.hero.eyebrow}
            </p>
          )}

          {/* Headline — bold condensed line + optional italic serif accent line */}
          <div className="mb-5 motion-safe:animate-[fadeIn_0.4s_ease-out_0.1s_both]">
            <h1 className="font-heading font-extrabold uppercase leading-[1.05] tracking-[-0.02em] text-white"
              style={{ fontSize: 'clamp(2.75rem, 6vw, 4.5rem)' }}
            >
              {brandDNA.copy.hero.headline}
            </h1>
            {brandDNA.copy.hero.headlineAccent && (
              <p className="text-primary leading-[1.1] mt-1"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 500 }}
              >
                {brandDNA.copy.hero.headlineAccent}
              </p>
            )}
          </div>

          {/* Subheadline */}
          <p className="text-lg font-body text-silver mb-6 leading-relaxed max-w-[520px] motion-safe:animate-[fadeIn_0.4s_ease-out_0.2s_both]">
            {brandDNA.copy.hero.subheadline}
          </p>

          {/* Star rating */}
          {brandDNA.reviews.googleCount > 0 && (
            <div className="flex items-center gap-2 mb-8 motion-safe:animate-[fadeIn_0.4s_ease-out_0.25s_both]">
              <div className="flex items-center gap-0.5" aria-label={`${brandDNA.reviews.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                    className="w-5 h-5 text-[var(--color-star)]" aria-hidden="true">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-body text-silver tabular-nums">
                {brandDNA.reviews.googleCount.toLocaleString()} Google Reviews
              </span>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 motion-safe:animate-[fadeIn_0.4s_ease-out_0.3s_both]">
            <a
              href="#estimate-form"
              className="inline-flex items-center justify-center gap-2 bg-primary text-[var(--color-bg)] px-7 py-[14px] font-heading font-semibold uppercase tracking-wide text-base rounded-[4px] hover:bg-primary-dark transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
            >
              {brandDNA.copy.buttonText.getEstimate}
            </a>
            <a
              href={brandDNA.contact.phoneTelLink}
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-7 py-[14px] font-body text-base rounded-[4px] hover:border-white hover:bg-white/5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden="true">
                <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
              </svg>
              Call {brandDNA.contact.phone}
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
