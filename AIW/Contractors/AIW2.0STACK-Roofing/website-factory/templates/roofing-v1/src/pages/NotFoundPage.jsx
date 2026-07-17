import brandDNA from '../config/brand-dna';
import StickyNav from '../components/StickyNav';
import Footer from '../components/Footer';

export default function NotFoundPage() {
  return (
    <>
      <StickyNav />
      <main className="bg-[var(--color-bg)] min-h-[60vh] flex flex-col items-center justify-center px-6 text-center py-24">
        <p className="font-heading font-bold text-7xl text-primary mb-4" aria-hidden="true">404</p>
        <h1 className="font-heading font-bold uppercase text-4xl text-white mb-4">Page Not Found</h1>
        <p className="text-base font-body text-silver mb-8 max-w-[400px]">
          That page doesn't exist. Head back home or call us directly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/"
            className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-[var(--color-bg)] font-heading font-bold uppercase tracking-wide text-sm px-7 py-3.5 rounded-[4px] transition-colors"
          >
            Back to Home
          </a>
          <a
            href={brandDNA.contact.phoneTelLink}
            className="inline-flex items-center justify-center border border-white/30 hover:border-white text-white font-heading font-bold uppercase tracking-wide text-sm px-7 py-3.5 rounded-[4px] transition-colors"
          >
            {brandDNA.contact.phone}
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
