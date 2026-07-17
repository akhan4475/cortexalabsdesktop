import brandDNA from '../config/brand-dna.js';

export default function TrustBar() {
  return (
    <div className="hidden lg:flex w-full bg-primary text-neutral items-center justify-between px-6 h-10 text-sm">
      <span>
        Licensed, Bonded &amp; Insured
        {brandDNA.company.licenseNumber && (
          <span className="ml-2 opacity-70">#{brandDNA.company.licenseNumber}</span>
        )}
      </span>
      <a
        href={brandDNA.contact.phoneTelLink}
        className="text-accent font-medium hover:text-accent-light transition-colors duration-150"
      >
        {brandDNA.contact.phone}
      </a>
      <div className="flex items-center gap-2">
        {brandDNA.trust_badges.length > 0 && (
          <img
            src={`/badges/${brandDNA.trust_badges[0].filename}`}
            alt={brandDNA.trust_badges[0].alt}
            className="h-6 opacity-80 grayscale brightness-200"
          />
        )}
      </div>
    </div>
  );
}
