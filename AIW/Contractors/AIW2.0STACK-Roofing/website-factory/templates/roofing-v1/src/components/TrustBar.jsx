import brandDNA from '../config/brand-dna';

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
    className="w-5 h-5 text-[var(--color-star)]" aria-hidden="true">
    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
  </svg>
);

export default function TrustBar() {
  const items = [
    {
      key: 'google',
      content: (
        <a href={brandDNA.reviews.googleUrl || '#reviews'} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex gap-0.5" aria-label={`${brandDNA.reviews.rating} stars`}>
            {[1,2,3,4,5].map(s => <StarIcon key={s} />)}
          </div>
          <span className="text-sm font-body tabular-nums whitespace-nowrap text-white/80">
            {brandDNA.reviews.googleCount > 0 ? `${brandDNA.reviews.googleCount} Google Reviews` : 'Google Reviews'}
          </span>
        </a>
      ),
    },
    {
      key: 'licensed',
      content: (
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary shrink-0" aria-hidden="true">
            <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-body whitespace-nowrap text-white/80">
            Licensed &amp; Insured
            {brandDNA.company.licenseNumber ? ` · Lic# ${brandDNA.company.licenseNumber}` : ''}
          </span>
        </div>
      ),
    },
    {
      key: 'years',
      content: (
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary shrink-0" aria-hidden="true">
            <path d="M5.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V12zM6 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H6zM7.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H8a.75.75 0 01-.75-.75V12zM8 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14A.75.75 0 008 13.25h-.01zM9.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V10zM10 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H10zM11.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V10zM12 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H12zM9.25 8a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V8zM13.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H14a.75.75 0 01-.75-.75V10zM14 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H14zM3.75 6a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75H4a.75.75 0 00.75-.75V6.75A.75.75 0 004 6h-.25zM4 3.25a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.25A.75.75 0 013 4.51V4a.75.75 0 01.75-.75H4z" />
            <path fillRule="evenodd" d="M2 2.75C2 1.784 2.784 1 3.75 1h12.5c.966 0 1.75.784 1.75 1.75v3.5A1.75 1.75 0 0116.25 8H3.75A1.75 1.75 0 012 6.25v-3.5zm15 0a.25.25 0 00-.25-.25H3.25a.25.25 0 00-.25.25v3.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25v-3.5zm0 6.75v8.75a.25.25 0 01-.25.25H3.25a.25.25 0 01-.25-.25V9.5h14z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-body whitespace-nowrap text-white/80">
            {brandDNA.team.founder.yearsExp ? `${brandDNA.team.founder.yearsExp}+ Years in Business` : 'Family Owned'}
          </span>
        </div>
      ),
    },
    {
      key: 'gaf',
      content: (
        <div className="flex items-center gap-3">
          {brandDNA.trust_badges.find(b => b.alt?.toLowerCase().includes('gaf')) ? (
            <img
              src={`/badges/${brandDNA.trust_badges.find(b => b.alt?.toLowerCase().includes('gaf')).filename}`}
              alt="GAF Certified Roofing Contractor"
              className="h-8 w-auto object-contain brightness-0 invert"
            />
          ) : (
            <span className="text-sm font-body font-semibold text-primary border border-primary/50 px-3 py-1 rounded-[2px] whitespace-nowrap">
              GAF CERTIFIED
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'bbb',
      content: (
        <div className="flex items-center gap-3">
          {brandDNA.trust_badges.find(b => b.alt?.toLowerCase().includes('bbb')) ? (
            <img
              src={`/badges/${brandDNA.trust_badges.find(b => b.alt?.toLowerCase().includes('bbb')).filename}`}
              alt="BBB Accredited Business"
              className="h-8 w-auto object-contain brightness-0 invert"
            />
          ) : (
            <span className="text-sm font-body font-semibold text-primary border border-primary/50 px-3 py-1 rounded-[2px] whitespace-nowrap">
              BBB A+
            </span>
          )}
        </div>
      ),
    },
  ];

  const doubled = [...items, ...items];

  return (
    <aside
      aria-label="Trust credentials"
      className="bg-[#0C1C26] border-b border-white/10 overflow-hidden"
    >
      <ul
        className="flex items-center animate-marquee-right"
        style={{ width: 'max-content' }}
        role="list"
      >
        {doubled.map((item, i) => (
          <li
            key={`${item.key}-${i}`}
            className="flex items-center py-5 px-8"
          >
            {item.content}
            <span className="ml-8 h-6 w-px bg-white/20 shrink-0" aria-hidden="true" />
          </li>
        ))}
      </ul>
    </aside>
  );
}
