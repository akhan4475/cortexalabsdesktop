import brandDNA from '../config/brand-dna';

const ICONS = [
  <svg key="clock" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8" aria-hidden="true"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" /></svg>,
  <svg key="shield" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8" aria-hidden="true"><path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>,
  <svg key="trash" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8" aria-hidden="true"><path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" /></svg>,
  <svg key="doc" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8" aria-hidden="true"><path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75-6.75a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" /><path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" /></svg>,
  <svg key="star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8" aria-hidden="true"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>,
  <svg key="heart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8" aria-hidden="true"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>,
];

function normalizeItems(raw) {
  if (!raw || raw.length === 0) return [];
  return raw.map((item, i) => {
    if (typeof item === 'string') return { title: item, body: '', icon: ICONS[i % ICONS.length] };
    return { title: item.title || '', body: item.body || '', icon: ICONS[i % ICONS.length] };
  });
}

export default function WhyUs() {
  const items = normalizeItems(brandDNA.why_choose_us);
  if (items.length === 0) return null;

  return (
    <section className="bg-[var(--color-surface)] py-section-gap-lg" aria-labelledby="why-us-heading">
      <div className="max-w-[1200px] mx-auto px-6">
        <header className="mb-12 text-center">
          <p className="text-xs font-body font-semibold uppercase tracking-[0.12em] text-primary mb-2">
            {brandDNA.copy.whyChoose.label}
          </p>
          <h2 id="why-us-heading" className="font-heading font-bold uppercase text-4xl text-ink leading-tight">
            {brandDNA.copy.whyChoose.heading}
          </h2>
          {brandDNA.copy.whyChoose.body && (
            <p className="mt-3 text-base font-body text-ink max-w-[520px] mx-auto">
              {brandDNA.copy.whyChoose.body}
            </p>
          )}
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {items.map((item, i) => (
            <li key={i} className="flex flex-col items-start gap-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[6px] p-6">
              <div className="text-primary">{item.icon}</div>
              <div>
                <h3 className="font-heading font-bold uppercase text-lg text-ink mb-1">{item.title}</h3>
                {item.body && <p className="text-sm font-body text-ink leading-relaxed">{item.body}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
