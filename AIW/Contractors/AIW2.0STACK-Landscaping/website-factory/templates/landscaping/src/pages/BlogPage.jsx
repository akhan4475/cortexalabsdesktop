import { Link } from 'react-router-dom';
import brandDNA from '../config/brand-dna.js';
import NavBar from '../components/NavBar.jsx';
import CtaFinalSection from '../components/CtaFinalSection.jsx';
import FooterSection from '../components/FooterSection.jsx';
import MobileBottomBar from '../components/MobileBottomBar.jsx';
import TrustBar from '../components/TrustBar.jsx';

export default function BlogPage() {
  const posts = brandDNA.blog_posts;
  const copy = brandDNA.copy.blog;

  return (
    <>
      <TrustBar />
      <NavBar />
      <main className="pt-26">
        <section className="py-section-gap bg-primary text-ink">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <span className="text-accent font-semibold text-sm uppercase tracking-widest">{copy.label}</span>
            <h1 className="font-heading text-5xl font-semibold mt-2 mb-4">{copy.heading}</h1>
            <p className="text-neutral max-w-xl mx-auto">{copy.body}</p>
          </div>
        </section>
        <section className="py-section-gap-lg bg-white">
          <div className="max-w-7xl mx-auto px-6">
            {posts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="group flex flex-col rounded-2xl border border-silver overflow-hidden shadow-card hover:shadow-card-lg transition-all duration-200"
                  >
                    {post.cover && (
                      <img
                        src={post.cover}
                        alt={post.title}
                        className="w-full aspect-[16/9] object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    )}
                    <div className="p-5 flex flex-col gap-2 flex-1">
                      {post.category && (
                        <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                          {post.category}
                        </span>
                      )}
                      <h2 className="font-heading text-lg font-semibold text-primary group-hover:text-accent-dark transition-colors duration-150">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-neutral-dim leading-relaxed line-clamp-3">{post.excerpt}</p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-4 text-xs text-neutral-dim">
                        <span>{post.date}</span>
                        {post.readTime && <span>{post.readTime}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-neutral-dim py-16">
                Blog posts coming soon.
              </p>
            )}
          </div>
        </section>
        <CtaFinalSection />
      </main>
      <FooterSection />
      <MobileBottomBar />
    </>
  );
}
