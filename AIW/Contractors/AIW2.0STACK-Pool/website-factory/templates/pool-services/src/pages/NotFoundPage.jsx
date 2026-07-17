import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import brandDNA from '../config/brand-dna';

export default function NotFoundPage() {
  return (
    <>
      <title>{`Page Not Found | ${brandDNA.company.shortName}`}</title>
      <NavBar />
      <main className="min-h-screen bg-neutral flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32 text-center">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgb(var(--primary)) 0%, rgb(var(--primary-slate)) 100%)' }}
            aria-hidden="true"
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M4 22c2.5-4 5-5 7.5-4s5 3.5 7.5 2.5 5-3.5 5-3.5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M4 27c2.5-4 5-5 7.5-4s5 3.5 7.5 2.5 5-3.5 5-3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
              <circle cx="18" cy="14" r="4" fill="white" opacity="0.85" />
            </svg>
          </div>
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-accent mb-3">404</p>
          <h1 className="font-heading text-4xl lg:text-5xl text-ink mb-4">Page Not Found</h1>
          <p className="font-body text-lg text-silver mb-8 max-w-md mx-auto">
            The page you are looking for does not exist. Let us help you find what you need.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="bg-primary hover:bg-primary-dark text-white font-body text-sm font-semibold px-6 py-3 rounded-md transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Back to Home
            </Link>
            <Link
              to="/contact"
              className="font-body text-sm font-semibold text-primary hover:text-accent border border-primary hover:border-accent px-6 py-3 rounded-md transition-all duration-150"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
