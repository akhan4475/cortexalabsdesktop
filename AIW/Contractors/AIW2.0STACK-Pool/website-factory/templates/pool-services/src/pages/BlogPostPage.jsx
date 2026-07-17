import { useParams, Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import ContactForm from '../components/ContactForm';
import CTABand from '../components/CTABand';
import Footer from '../components/Footer';
import brandDNA from '../config/brand-dna';

function renderContent(block, i) {
  if (block.type === 'p') return <p key={i} className="font-body text-base text-ink leading-relaxed mb-4">{block.text}</p>;
  if (block.type === 'h2') return <h2 key={i} className="font-heading text-2xl text-ink mt-8 mb-3">{block.text}</h2>;
  if (block.type === 'list') return (
    <ul key={i} className="space-y-2 mb-4 pl-4">
      {block.items?.map((item, j) => (
        <li key={j} className="font-body text-sm text-ink flex items-start gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5" aria-hidden="true">
            <circle cx="7" cy="7" r="6" fill="rgb(var(--accent))" opacity="0.15" />
            <path d="M4.5 7l2 2 3-3" stroke="rgb(var(--accent))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {item}
        </li>
      ))}
    </ul>
  );
  return null;
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = brandDNA.blog_posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <>
        <NavBar />
        <main className="min-h-screen bg-neutral flex items-center justify-center">
          <div className="text-center">
            <p className="font-heading text-3xl text-ink mb-3">Post Not Found</p>
            <Link to="/blog" className="font-body text-sm font-semibold text-primary hover:text-accent transition-colors">Back to blog</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <title>{`${post.title} | ${brandDNA.company.shortName}`}</title>
      <meta name="description" content={post.excerpt || ''} />
      <NavBar />
      <main>
        {/* Post hero */}
        <section
          className="pt-32 pb-16"
          style={{ background: 'linear-gradient(135deg, rgb(var(--primary-dark)) 0%, rgb(var(--primary-slate)) 100%)' }}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              {post.category && (
                <span className="font-body text-xs font-semibold text-accent uppercase tracking-wider">{post.category}</span>
              )}
              {post.date && <span className="font-body text-xs text-white/50">{post.date}</span>}
              {post.readTime && <span className="font-body text-xs text-white/50">{post.readTime}</span>}
            </div>
            <h1 className="font-heading text-3xl lg:text-4xl text-white mb-4">{post.title}</h1>
            {post.excerpt && (
              <p className="font-body text-lg text-white/70">{post.excerpt}</p>
            )}
          </div>
        </section>

        {post.cover && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
            <img src={post.cover} alt={post.title} className="w-full rounded-xl shadow-card-lg" loading="lazy" />
          </div>
        )}

        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-section-gap">
          {post.content?.map((block, i) => renderContent(block, i))}
          {!post.content && post.body && (
            <div className="font-body text-base text-ink leading-relaxed prose max-w-none">
              {post.body}
            </div>
          )}
        </article>

        <ContactForm />
        <CTABand />
      </main>
      <Footer />
    </>
  );
}
