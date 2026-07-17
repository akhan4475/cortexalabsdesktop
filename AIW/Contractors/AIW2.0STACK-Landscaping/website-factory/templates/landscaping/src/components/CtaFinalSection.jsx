import { useState } from 'react';
import { motion } from 'framer-motion';
import brandDNA from '../config/brand-dna.js';

const EASE = [0.16, 1, 0.3, 1];

const SERVICE_OPTIONS = [
  'Landscape Design',
  'Lawn Maintenance',
  'Hardscaping',
  'Irrigation',
  'Sod Installation',
  'Other',
];

export default function CtaFinalSection() {
  const copy = brandDNA.copy;
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    zip: '',
    service: '',
    project: '',
  });

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-section-gap-lg bg-primary" id="contact-form">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <h2 className="font-heading text-4xl font-semibold text-ink mb-3">
              {copy.formHeader}
            </h2>
            <p className="text-neutral mb-8">{copy.formSubtext}</p>

            {submitted ? (
              <div className="rounded-2xl bg-accent/10 border border-accent/30 p-8 text-center">
                <p className="font-heading text-xl text-ink mb-2">Thanks, we got it.</p>
                <p className="text-neutral text-sm">We will respond within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    label="Full Name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  <FormField
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  <FormField
                    label="Zip Code"
                    name="zip"
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    value={form.zip}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral mb-1.5 uppercase tracking-wider">
                    Service
                  </label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    required
                    className="w-full bg-primary-slate/30 border border-primary-slate text-ink rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
                  >
                    <option value="">Select a service</option>
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral mb-1.5 uppercase tracking-wider">
                    Tell us about your project
                  </label>
                  <textarea
                    name="project"
                    value={form.project}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe what you have in mind..."
                    className="w-full bg-primary-slate/30 border border-primary-slate text-ink rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent resize-none placeholder:text-neutral/40"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent-dark text-primary-dark font-semibold text-base px-7 py-4 rounded-full transition-colors duration-150"
                >
                  {copy.submitButton}
                </button>
                <p className="text-xs text-neutral/60 text-center">{copy.privacyLine}</p>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.12 }}
            className="flex flex-col gap-6 lg:pt-[6.5rem]"
          >
            <ContactRow icon={<PhoneIcon />} label="Phone">
              <a href={brandDNA.contact.phoneTelLink} className="text-accent hover:text-accent-light transition-colors">
                {brandDNA.contact.phone}
              </a>
            </ContactRow>
            <ContactRow icon={<EmailIcon />} label="Email">
              <a href={`mailto:${brandDNA.contact.email}`} className="text-ink/80 hover:text-ink transition-colors">
                {brandDNA.contact.email}
              </a>
            </ContactRow>
            {brandDNA.hours.display.map((row, i) => (
              <ContactRow key={i} icon={<ClockIcon />} label={row.label}>
                <span className="text-ink/80">{row.value}</span>
              </ContactRow>
            ))}
            <div className="border-t border-primary-slate pt-6">
              <p className="text-neutral text-sm">
                Prefer to call?{' '}
                <a href={brandDNA.contact.phoneTelLink} className="text-accent font-semibold hover:text-accent-light transition-colors">
                  {brandDNA.contact.phone}
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FormField({ label, name, type, value, onChange, required, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-primary-slate/30 border border-primary-slate text-ink rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent placeholder:text-neutral/40"
        {...props}
      />
    </div>
  );
}

function ContactRow({ icon, label, children }) {
  return (
    <div className="flex items-center gap-4">
      <div className="shrink-0 w-10 h-10 rounded-full bg-primary-slate/40 flex items-center justify-center text-accent">
        {icon}
      </div>
      <div>
        <p className="text-xs text-neutral uppercase tracking-wider mb-0.5">{label}</p>
        {children}
      </div>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M2 2.5C2 2 2.5 1.5 3 1.5h2L6.5 4.5l-1.5 1C5.5 7 7 9.5 9 11l1-1.5 3 1.5v2c0 .5-.5 1-1 1C4 14 2 7 2 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 5l7 6 7-6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3" />
      <path d="M9 5v4l3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
