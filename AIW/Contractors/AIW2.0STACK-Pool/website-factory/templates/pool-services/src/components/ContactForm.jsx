import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import brandDNA from '../config/brand-dna';

const SERVICES = [
  'Pool Cleaning',
  'Pool Maintenance',
  'Pool Repair',
  'Pool Opening / Closing',
  'Chemical Service',
  'Green Pool Recovery',
  'Pool Installation',
  'Other',
];

function Field({ label, id, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-body text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error && <p className="font-body text-xs text-red-600" role="alert">{error}</p>}
    </div>
  );
}

export default function ContactForm() {
  const reduce = useReducedMotion();
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'A valid email is required.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  };

  const inputClass =
    'font-body text-sm text-ink bg-white border border-neutral-dim rounded-md px-3.5 py-2.5 w-full placeholder:text-silver/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-150';

  return (
    <section id="contact" className="bg-neutral py-section-gap lg:py-section-gap-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: info */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-accent mb-3">
              Contact Us
            </p>
            <h2 className="font-heading text-4xl lg:text-5xl text-ink mb-4">
              {brandDNA.copy.formHeader}
            </h2>
            {brandDNA.copy.formSubtext && (
              <p className="font-body text-lg text-silver leading-relaxed mb-8">
                {brandDNA.copy.formSubtext}
              </p>
            )}

            <div className="space-y-5">
              <a
                href={brandDNA.contact.phoneTelLink}
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 14 14" fill="rgb(var(--primary))" aria-hidden="true">
                    <path d="M2.5 1a1 1 0 0 0-1 1c0 5.523 4.477 10 10 10a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1 5.99 5.99 0 0 1-1.879-.3 1 1 0 0 0-1.03.243l-1.22 1.22a8.025 8.025 0 0 1-3.034-3.034l1.22-1.22a1 1 0 0 0 .243-1.03A5.99 5.99 0 0 1 5.5 3a1 1 0 0 0-1-1H2.5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-body text-xs text-silver">{brandDNA.copy.mobileCallLabel || 'Call us'}</p>
                  <p className="font-body text-base font-semibold text-ink group-hover:text-primary transition-colors">{brandDNA.contact.phone}</p>
                </div>
              </a>

              {brandDNA.contact.email && (
                <a href={`mailto:${brandDNA.contact.email}`} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      <path d="M2 4h14v10H2V4z" stroke="rgb(var(--primary))" strokeWidth="1.5" fill="none" />
                      <path d="M2 4l7 6 7-6" stroke="rgb(var(--primary))" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-body text-xs text-silver">Email us</p>
                    <p className="font-body text-base font-semibold text-ink group-hover:text-primary transition-colors">{brandDNA.contact.email}</p>
                  </div>
                </a>
              )}

              {brandDNA.hours.display && brandDNA.hours.display.map((row) => (
                <div key={row.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      <circle cx="9" cy="9" r="7" stroke="rgb(var(--primary))" strokeWidth="1.5" />
                      <path d="M9 5v4l2.5 2.5" stroke="rgb(var(--primary))" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-body text-xs text-silver">{row.label}</p>
                    <p className="font-body text-base font-semibold text-ink">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-xl border border-neutral-dim shadow-card p-6 sm:p-8"
          >
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12l5 5L20 7" stroke="rgb(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-heading text-2xl text-ink mb-2">Request Received</h3>
                <p className="font-body text-sm text-silver">We will be in touch within one business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Your name" id="name" error={errors.name}>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Smith"
                      autoComplete="name"
                      className={inputClass}
                      aria-required="true"
                    />
                  </Field>
                  <Field label="Phone number" id="phone" error={errors.phone}>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="(555) 000-0000"
                      autoComplete="tel"
                      className={inputClass}
                      aria-required="true"
                    />
                  </Field>
                </div>

                <Field label="Email address" id="email" error={errors.email}>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={inputClass}
                    aria-required="true"
                  />
                </Field>

                <Field label="Service needed" id="service" error={errors.service}>
                  <select
                    id="service"
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select a service</option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Message (optional)" id="message" error={errors.message}>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your pool or situation..."
                    className={`${inputClass} resize-none`}
                  />
                </Field>

                <button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent-dark text-white font-body text-base font-semibold py-3 rounded-md transition-all duration-150 hover:scale-[1.01] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {brandDNA.copy.submitButton}
                </button>

                {brandDNA.copy.privacyLine && (
                  <p className="font-body text-xs text-silver text-center">{brandDNA.copy.privacyLine}</p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
