import { Link } from 'react-router-dom';
import brandDNA from '../config/brand-dna.js';
import NavBar from '../components/NavBar.jsx';
import FooterSection from '../components/FooterSection.jsx';
import TrustBar from '../components/TrustBar.jsx';

export default function NotFoundPage() {
  return (
    <>
      <TrustBar />
      <NavBar />
      <main className="pt-26 min-h-screen flex flex-col items-center justify-center gap-6 text-center px-6">
        <span className="font-heading text-8xl font-semibold text-primary/20">404</span>
        <h1 className="font-heading text-3xl font-semibold text-primary">Page Not Found</h1>
        <p className="text-neutral-dim max-w-sm">
          Sorry, we could not find that page. Head back home or get in touch.
        </p>
        <div className="flex gap-4">
          <Link
            to="/"
            className="inline-flex items-center bg-accent hover:bg-accent-dark text-primary-dark font-semibold px-6 py-3 rounded-full transition-colors duration-150"
          >
            Go Home
          </Link>
          <a
            href={brandDNA.contact.phoneTelLink}
            className="inline-flex items-center border border-primary text-primary font-semibold px-6 py-3 rounded-full hover:bg-primary hover:text-ink transition-colors duration-150"
          >
            Call Us
          </a>
        </div>
      </main>
      <FooterSection />
    </>
  );
}
