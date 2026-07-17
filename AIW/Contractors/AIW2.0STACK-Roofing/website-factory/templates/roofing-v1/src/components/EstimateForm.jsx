import { useState } from 'react';
import brandDNA from '../config/brand-dna';

export default function EstimateForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', service: '', bestTime: '' });

  const services = ['Roof Replacement', 'Roof Repair', 'Storm Damage', 'Emergency Repair', 'Not Sure'];
  const times = ['Morning (8am-12pm)', 'Afternoon (12pm-5pm)', 'Evening (5pm-8pm)', 'ASAP'];

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="estimate-form"
      className="bg-[var(--color-surface-alt)] py-section-gap-lg"
      aria-labelledby="estimate-form-heading"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

          {/* Left: copy */}
          <div className="lg:w-[55%]">
            <h2
              id="estimate-form-heading"
              className="font-heading font-bold uppercase text-4xl text-ink leading-tight mb-4"
            >
              {brandDNA.copy.formHeader}
            </h2>
            <p className="text-base font-body text-neutral leading-relaxed mb-6 max-w-[440px]">
              {brandDNA.copy.formSubtext}
            </p>
            <a
              href={brandDNA.contact.phoneTelLink}
              className="inline-flex items-center gap-2 text-primary font-body font-semibold text-lg hover:text-primary-dark transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
              </svg>
              {brandDNA.contact.phone}
            </a>
          </div>

          {/* Right: form */}
          <div className="lg:w-[45%] w-full">
            {submitted ? (
              <div className="bg-white border border-[var(--color-border-light)] rounded-[6px] p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-primary" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-xl text-ink mb-2 uppercase">Request Sent</h3>
                <p className="text-sm font-body text-neutral">We'll call you back within 2 hours. If it's urgent, call us directly at{' '}
                  <a href={brandDNA.contact.phoneTelLink} className="text-primary font-semibold">{brandDNA.contact.phone}</a>.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white border border-[var(--color-border-light)] rounded-[6px] p-8 flex flex-col gap-4"
                noValidate
              >
                <div>
                  <label htmlFor="ef-name" className="block text-xs font-body font-semibold text-ink mb-1 uppercase tracking-wide">
                    Your Name <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  <input
                    id="ef-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border border-[var(--color-border-light)] rounded-[4px] px-3 py-2.5 text-sm font-body text-ink placeholder:text-neutral-dim focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="ef-phone" className="block text-xs font-body font-semibold text-ink mb-1 uppercase tracking-wide">
                    Phone Number <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  <input
                    id="ef-phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="(555) 000-0000"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border border-[var(--color-border-light)] rounded-[4px] px-3 py-2.5 text-sm font-body text-ink placeholder:text-neutral-dim focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="ef-service" className="block text-xs font-body font-semibold text-ink mb-1 uppercase tracking-wide">
                    Service Needed
                  </label>
                  <select
                    id="ef-service"
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="w-full border border-[var(--color-border-light)] rounded-[4px] px-3 py-2.5 text-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                  >
                    <option value="">Select a service...</option>
                    {services.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="ef-time" className="block text-xs font-body font-semibold text-ink mb-1 uppercase tracking-wide">
                    Best Time to Call
                  </label>
                  <select
                    id="ef-time"
                    name="bestTime"
                    value={form.bestTime}
                    onChange={handleChange}
                    className="w-full border border-[var(--color-border-light)] rounded-[4px] px-3 py-2.5 text-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                  >
                    <option value="">Any time...</option>
                    {times.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <button
                  type="submit"
                  className="mt-2 w-full bg-primary text-[var(--color-bg)] py-3.5 px-6 font-heading font-semibold uppercase tracking-wide text-base rounded-[4px] hover:bg-primary-dark transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {brandDNA.copy.submitButton}
                </button>
                <p className="text-xs font-body text-neutral text-center">{brandDNA.copy.privacyLine}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
