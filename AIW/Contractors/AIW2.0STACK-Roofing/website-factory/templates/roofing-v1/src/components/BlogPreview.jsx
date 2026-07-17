import brandDNA from '../config/brand-dna';

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
      className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
      <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
    </svg>
  );
}

export default function BlogPreview() {
  const posts = brandDNA.blog_posts;
  if (!posts || posts.length === 0) return null;

  const preview = posts.slice(0, 3);
  const featured = preview.find(p => p.featured) || preview[0];
  const rest = preview.filter(p => p !== featured);

  return (
    <section className="bg-[var(--color-bg)] py-section-gap-lg" aria-labelledby="blog-preview-heading">
      <div className="max-w-[1200px] mx-auto px-6">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-body font-semibold uppercase tracking-[0.12em] text-primary mb-2">
              {brandDNA.copy.blog.label}
            </p>
            <h2 id="blog-preview-heading" className="font-heading font-bold uppercase text-4xl text-ink leading-tight">
              {brandDNA.copy.blog.heading}
            </h2>
            {brandDNA.copy.blog.body && (
              <p className="mt-2 text-sm font-body text-neutral max-w-[480px]">{brandDNA.copy.blog.body}</p>
            )}
          </div>
          <a
            href="/blog"
            className="text-sm font-body font-semibold text-primary hover:text-primary-dark transition-colors whitespace-nowrap shrink-0"
          >
            All Posts &rarr;
          </a>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured post -- larger */}
          <article className="lg:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[6px] overflow-hidden flex flex-col">
            <div className="bg-[var(--color-dark-section)] h-40 flex items-center justify-center">
              <span className="text-xs font-body font-semibold uppercase tracking-wider text-white/40">
                {featured.category}
              </span>
            </div>
            <div className="p-6 flex flex-col gap-3 flex-1">
              <div className="flex items-center gap-3 text-xs font-body text-neutral-dim">
                <span className="bg-primary/10 text-primary font-semibold px-2.5 py-0.5 rounded-full">
                  {featured.category}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarIcon /> {featured.dateDisplay}
                </span>
                <span>{featured.readTime}</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-ink leading-snug">
                <a href={`/blog/${featured.slug}`} className="hover:text-primary transition-colors">
                  {featured.title}
                </a>
              </h3>
              <p className="text-sm font-body text-neutral leading-relaxed flex-1">{featured.excerpt}</p>
              <a
                href={`/blog/${featured.slug}`}
                className="inline-flex items-center gap-1 text-sm font-body font-semibold text-primary hover:text-primary-dark transition-colors mt-2"
              >
                Read the full guide &rarr;
              </a>
            </div>
          </article>

          {/* Side posts */}
          <div className="flex flex-col gap-4">
            {rest.map((post) => (
              <article
                key={post.slug}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[6px] p-5 flex flex-col gap-3"
              >
                <div className="flex items-center gap-2 text-xs font-body text-neutral-dim">
                  <span className="bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarIcon /> {post.dateDisplay}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-base text-ink leading-snug">
                  <a href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </a>
                </h3>
                <p className="text-xs font-body text-neutral leading-relaxed line-clamp-3">{post.excerpt}</p>
                <a
                  href={`/blog/${post.slug}`}
                  className="text-xs font-body font-semibold text-primary hover:text-primary-dark transition-colors"
                >
                  Read more &rarr;
                </a>
              </article>
            ))}

            {/* View all CTA card */}
            <div className="bg-primary/5 border border-primary/20 rounded-[6px] p-5 flex flex-col items-start gap-3">
              <p className="text-sm font-body font-semibold text-ink">
                More guides on insurance claims, materials, and maintenance.
              </p>
              <a
                href="/blog"
                className="inline-flex items-center gap-2 bg-primary text-white font-heading font-bold uppercase tracking-wide text-xs px-4 py-2.5 rounded-[4px] hover:bg-primary-dark transition-colors"
              >
                View All Posts
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
