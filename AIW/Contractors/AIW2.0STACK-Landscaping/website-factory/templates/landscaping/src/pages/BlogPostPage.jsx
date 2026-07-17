import { useParams, Link } from 'react-router-dom';
import brandDNA from '../config/brand-dna.js';
import NavBar from '../components/NavBar.jsx';
import CtaFinalSection from '../components/CtaFinalSection.jsx';
import FooterSection from '../components/FooterSection.jsx';
import MobileBottomBar from '../components/MobileBottomBar.jsx';
import TrustBar from '../components/TrustBar.jsx';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = brandDNA.blog_posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <>
        <TrustBar />
        <NavBar />
        <main className="pt-26 min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-neutral-dim">Post not found.</p>
          <Link to="/blog" className="text-accent font-semibold hover:text-accent-dark transition-colors">
            Back to Blog
          </Link>
        </main>
        <FooterSection />
      </>
    );
  }

  return (
    <>
      <TrustBar />
      <NavBar />
      <main className="pt-26">
        <article className="max-w-3xl mx-auto px-6 py-section-gap-lg">
          {post.category && (
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">{post.category}</span>
          )}
          <h1 className="font-heading text-4xl font-semibold text-primary mt-2 mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-neutral-dim mb-8 pb-8 border-b border-silver">
            {post.date && <span>{post.date}</span>}
            {post.readTime && <span>{post.readTime}</span>}
          </div>
          {post.cover && (
            <img
              src={post.cover}
              alt={post.title}
              className="w-full rounded-2xl mb-8 aspect-[16/9] object-cover shadow-card-lg"
            />
          )}
          <div className="prose prose-neutral max-w-none">
            {post.body ? (
              <div dangerouslySetInnerHTML={{ __html: post.body }} />
            ) : post.content ? (
              post.content.map((block, i) => {
                if (block.type === 'h2') {
                  return <h2 key={i} className="font-heading text-2xl font-semibold text-primary mt-8 mb-3">{block.text}</h2>;
                }
                if (block.type === 'list') {
                  return (
                    <ul key={i} className="list-disc pl-6 text-neutral-dim leading-relaxed mb-4">
                      {(block.items || []).map((item, j) => <li key={j}>{item}</li>)}
                    </ul>
                  );
                }
                return <p key={i} className="text-neutral-dim leading-relaxed mb-4">{block.text}</p>;
              })
            ) : (
              <p className="text-neutral-dim">{post.excerpt}</p>
            )}
          </div>
        </article>
        <CtaFinalSection />
      </main>
      <FooterSection />
      <MobileBottomBar />
    </>
  );
}
