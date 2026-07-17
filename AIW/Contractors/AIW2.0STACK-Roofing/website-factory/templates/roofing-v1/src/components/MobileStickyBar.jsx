import brandDNA from '../config/brand-dna';

export default function MobileStickyBar() {
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 sm:hidden bg-[var(--color-dark-section)] border-t border-white/10 flex"
      role="complementary"
      aria-label="Quick contact"
    >
      <a
        href={brandDNA.contact.phoneTelLink}
        className="flex-1 flex items-center justify-center gap-2 py-4 font-heading font-bold uppercase text-sm text-white bg-white/5 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
          className="w-4 h-4 text-primary" aria-hidden="true">
          <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
        </svg>
        Call Now
      </a>
      <div className="w-px bg-white/10" aria-hidden="true" />
      <a
        href="#estimate"
        className="flex-1 flex items-center justify-center gap-2 py-4 font-heading font-bold uppercase text-sm bg-primary hover:bg-primary-dark text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
          className="w-4 h-4" aria-hidden="true">
          <path d="M2.695 14.762l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
        </svg>
        Free Estimate
      </a>
    </div>
  );
}
