import { useState } from 'react';
import brandDNA from '../config/brand-dna';
import StickyNav from '../components/StickyNav';
import PageHero from '../components/PageHero';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
      className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
      <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
    </svg>
  );
}

export default function BlogListPage() {
  const posts = brandDNA.blog_posts || [];
  const categories = brandDNA.blog_categories || ['All'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? posts
    : posts.filter(p => p.category === activeCategory);

  return (
    <>
      <StickyNav />
      <main>
        <PageHero
          label={brandDNA.copy.blog.label}
          heading={brandDNA.pages.blog.heading}
          subtext={brandDNA.pages.blog.subheading}
          breadcrumbLabel="Blog"
        />

        <section className="bg-[var(--color-bg)] py-section-gap-lg">
          <div className="max-w-[1200px] mx-auto px-6">

            {/* Category filter */}
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-10" role="list" aria-label="Filter by category">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 text-sm font-body font-medium rounded-[4px] border transition-colors ${
                      activeCategory === cat
                        ? 'bg-primary text-white border-primary'
                        : 'bg-[var(--color-surface)] text-neutral border-[var(--color-border)] hover:border-primary hover:text-primary'
                    }`}
                    aria-pressed={activeCategory === cat}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-sm font-body text-neutral">No posts in this category yet.</p>
              </div>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
                {filtered.map((post) => (
                  <li key={post.slug}>
                    <article className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[6px] overflow-hidden flex flex-col h-full">
                      <div className="bg-[var(--color-dark-section)] h-36 flex items-center justify-center">
                        <span className="text-xs font-body font-semibold uppercase tracking-wider text-white/40">
                          {post.category}
                        </span>
                      </div>
                      <div className="p-5 flex flex-col gap-3 flex-1">
                        <div className="flex items-center gap-3 text-xs font-body text-neutral-dim flex-wrap">
                          <span className="bg-primary/10 text-primary font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                            {post.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarIcon /> {post.dateDisplay}
                          </span>
                          <span>{post.readTime}</span>
                        </div>
                        <h2 className="font-heading font-bold text-lg text-ink leading-snug">
                          <a href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                            {post.title}
                          </a>
                        </h2>
                        <p className="text-sm font-body text-neutral leading-relaxed flex-1">{post.excerpt}</p>
                        <a
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 text-sm font-body font-semibold text-primary hover:text-primary-dark transition-colors mt-2"
                        >
                          Read more &rarr;
                        </a>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyBar />
    </>
  );
}
