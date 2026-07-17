import { useEffect, useState } from 'react';
import brandDNA from '../config/brand-dna.js';

function isBusinessOpen() {
  const bh = brandDNA.businessHours;
  if (!bh || !bh.tz || !bh.open || !bh.close) return false;
  try {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      timeZone: bh.tz,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
    return timeStr >= bh.open && timeStr < bh.close;
  } catch {
    return false;
  }
}

export default function MobileBottomBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(isBusinessOpen());
  }, []);

  const copy = brandDNA.copy;
  const contact = brandDNA.contact;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden flex h-14 shadow-floating">
      <a
        href={contact.phoneTelLink}
        className="flex-1 flex items-center justify-center gap-2 bg-accent text-primary-dark font-semibold text-sm"
      >
        <PhoneIcon />
        {copy.mobileCallLabel || 'Call Now'}
      </a>
      <a
        href="#contact-form"
        className="flex-1 flex items-center justify-center gap-2 bg-primary border-t border-l border-primary-slate text-ink font-semibold text-sm"
      >
        {copy.buttonText}
      </a>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 2.5C2 2 2.5 1.5 3 1.5h2L6.5 4.5l-1.5 1C5.5 7 7.5 9.5 9.5 11l1-1.5 3 1.5v2c0 .5-.5 1-1 1C4 14 2 7 2 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
