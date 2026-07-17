import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import NavBar from '../components/NavBar';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import brandDNA from '../config/brand-dna';

function PostCard({ post, index, reduce }) {
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: reduce ? 0 : index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-neutral-dim rounded-xl overflow-hidden shadow-card hover:shadow-card-lg transition-shadow duration-200 flex flex-col"
    >
      {post.cover && (
        <div className="aspect-[16/9] overflow-hidden bg-neutral">
          <img
            src={post.cover}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          {post.category && (
            <span className="font-body text-xs font-semibold text-accent uppercase tracking-wider">{post.category}</span>
          )}
          {post.date && (
            <span className="font-body text-xs text-silver">{post.date}</span>
          )}
          {post.readTime && (
            <span className="font-body text-xs text-silver">{post.readTime}</span>
          )}
        </div>
        <h2 className="font-heading text-xl text-ink mb-2">{post.title}</h2>
        {post.excerpt && (
          <p className="font-body text-sm text-silver leading-relaxed flex-1 mb-4">{post.excerpt}</p>
        )}
        <Link
          to={`/blog/${post.slug}`}
          className="font-body text-sm font-semibold text-primary hover:text-accent transition-colors inline-flex items-center gap-1"
        >
          Read more
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </motion.article>
  );
}

export default function BlogPage() {
  const reduce = useReducedMotion();
  const posts = brandDNA.blog_posts;

  return (
    <>
      <title>{`Pool Care Blog | ${brandDNA.company.shortName}`}</title>
      <meta name="description" content={`Pool care tips, maintenance guides, and local advice from ${brandDNA.company.name}.`} />
      <NavBar />
      <main>
        <section
          className="pt-32 pb-16"
          style={{ background: 'linear-gradient(135deg, rgb(var(--primary-dark)) 0%, rgb(var(--primary-slate)) 100%)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-accent mb-3">
              {brandDNA.copy.blog.label}
            </p>
            <h1 className="font-heading text-4xl lg:text-5xl text-white mb-4">
              {brandDNA.copy.blog.heading}
            </h1>
            {brandDNA.copy.blog.body && (
              <p className="font-body text-lg text-white/70 max-w-xl mx-auto">
                {brandDNA.copy.blog.body}
              </p>
            )}
          </div>
        </section>

        <section className="bg-neutral py-section-gap lg:py-section-gap-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, i) => (
                  <PostCard key={post.slug} post={post} index={i} reduce={reduce} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="font-body text-base text-silver">No blog posts yet. Check back soon.</p>
              </div>
            )}
          </div>
        </section>

        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
