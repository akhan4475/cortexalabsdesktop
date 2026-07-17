import { useParams } from 'react-router-dom';
import brandDNA from '../config/brand-dna';
import StickyNav from '../components/StickyNav';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
    </svg>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = (brandDNA.blog_posts || []).find(p => p.slug === slug);

  if (!post) {
    return (
      <>
        <StickyNav />
        <main className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <p className="text-xs font-body font-semibold uppercase tracking-wider text-primary mb-3">Not Found</p>
            <h1 className="font-heading font-bold uppercase text-3xl text-ink mb-4">Post Not Found</h1>
            <p className="text-sm font-body text-neutral mb-6">
              That post may have moved. Check our blog for all current articles.
            </p>
            <a href="/blog" className="inline-flex items-center gap-2 bg-primary text-white font-heading font-bold uppercase tracking-wide text-sm px-6 py-3 rounded-[4px] hover:bg-primary-dark transition-colors">
              View All Posts
            </a>
          </div>
        </main>
        <Footer />
        <MobileStickyBar />
      </>
    );
  }

  const relatedPosts = (brandDNA.blog_posts || [])
    .filter(p => p.slug !== slug && p.category === post.category)
    .slice(0, 2);

  return (
    <>
      <StickyNav />
      <main>

        {/* Article header */}
        <div className="bg-[var(--color-dark-section)] pt-[calc(var(--nav-height)+56px)] pb-14">
          <div className="max-w-[1200px] mx-auto px-6">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-xs font-body text-white/50" role="list">
                <li><a href="/" className="hover:text-white transition-colors">{brandDNA.company.shortName}</a></li>
                <li aria-hidden="true">/</li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-white/80 truncate max-w-[200px]">{post.title}</li>
              </ol>
            </nav>

            <div className="max-w-[760px]">
              <span className="inline-block bg-primary/20 text-primary text-xs font-body font-semibold px-3 py-1 rounded-full mb-4">
                {post.category}
              </span>
              <h1 className="font-heading font-bold uppercase text-3xl md:text-4xl text-white leading-tight mb-5">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-body text-white/60">
                <span className="flex items-center gap-1.5"><CalendarIcon /> {post.dateDisplay}</span>
                <span className="flex items-center gap-1.5"><ClockIcon /> {post.readTime}</span>
                <span>By {post.author}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Article body + sidebar */}
        <div className="bg-[var(--color-bg)] py-section-gap-lg">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">

              {/* Main content -- H2/H3 structure for AI citability */}
              <article>
                <p className="text-base font-body text-neutral leading-relaxed mb-8 text-lg border-l-2 border-primary pl-5 italic">
                  {post.excerpt}
                </p>

                {(post.sections || []).map((section, i) => (
                  <div key={i} className="mb-8">
                    <h2 className="font-heading font-bold uppercase text-2xl text-ink mb-3">
                      {section.heading}
                    </h2>
                    <p className="text-base font-body text-neutral leading-relaxed">
                      {section.body}
                    </p>
                  </div>
                ))}

                {/* Author bio -- E-E-A-T: author credentials visible */}
                <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
                  <div className="flex items-start gap-4 bg-[var(--color-surface)] rounded-[6px] p-5 border border-[var(--color-border)]">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="font-heading font-bold text-primary text-lg">
                        {(post.author || 'J').charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-heading font-bold text-base text-ink">{post.author}</p>
                      <p className="text-xs font-body text-neutral-dim mb-2">{post.authorTitle}</p>
                      <p className="text-sm font-body text-neutral leading-relaxed">
                        {brandDNA.company.name} owner since {brandDNA.company.founded}. Licensed in {brandDNA.address.state}. {brandDNA.team.founder.yearsExp} years roofing {brandDNA.address.city} area homes.
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              {/* Sidebar */}
              <aside className="space-y-6">
                {/* CTA card */}
                <div className="bg-[var(--color-dark-section)] rounded-[6px] p-6 text-white sticky top-[calc(var(--nav-height)+20px)]">
                  <p className="font-heading font-bold uppercase text-xl mb-2">
                    Free Roof Inspection
                  </p>
                  <p className="text-sm font-body text-white/70 mb-5 leading-relaxed">
                    Questions about your roof? We inspect for free and give you a written report -- no charge, no obligation.
                  </p>
                  <a
                    href="/contact"
                    className="block text-center bg-primary text-white font-heading font-bold uppercase tracking-wide text-sm px-4 py-3 rounded-[4px] hover:bg-primary-dark transition-colors mb-3"
                  >
                    Schedule Free Inspection
                  </a>
                  <a
                    href={brandDNA.contact.phoneTelLink}
                    className="block text-center border border-white/30 text-white font-heading font-bold uppercase tracking-wide text-sm px-4 py-3 rounded-[4px] hover:border-white transition-colors"
                  >
                    {brandDNA.contact.phone}
                  </a>
                </div>

                {/* Related posts */}
                {relatedPosts.length > 0 && (
                  <div>
                    <p className="text-xs font-body font-semibold uppercase tracking-wider text-neutral-dim mb-4">
                      Related Posts
                    </p>
                    <div className="space-y-3">
                      {relatedPosts.map(rp => (
                        <a
                          key={rp.slug}
                          href={`/blog/${rp.slug}`}
                          className="block bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[6px] p-4 hover:border-primary transition-colors"
                        >
                          <p className="text-xs font-body text-neutral-dim mb-1">{rp.dateDisplay}</p>
                          <p className="text-sm font-heading font-bold text-ink hover:text-primary transition-colors leading-snug">
                            {rp.title}
                          </p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </div>

        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyBar />
    </>
  );
}
