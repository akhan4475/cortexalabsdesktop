import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import brandDNA from '../config/brand-dna';

function OfferCard({ offer, index, reduce }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: reduce ? 0 : index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-neutral-dim rounded-xl p-6 shadow-card flex flex-col"
    >
      <div className="inline-block bg-accent/10 text-accent font-body text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4 self-start">
        {offer.label}
      </div>
      <p className="font-body text-base text-ink leading-relaxed flex-1">{offer.description}</p>
      <Link
        to="/contact"
        className="mt-6 text-center bg-primary hover:bg-primary-dark text-white font-body text-sm font-semibold px-5 py-2.5 rounded-md transition-all duration-150 hover:scale-[1.01] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Claim This Offer
      </Link>
    </motion.div>
  );
}

const FALLBACK_OFFERS = [
  { label: 'New Customer Special', description: 'First pool cleaning service at a reduced rate. No contracts required.' },
  { label: 'Weekly Service Plan', description: 'Full-service weekly maintenance including chemical balancing and debris removal.' },
  { label: 'Green Pool Recovery', description: 'Guaranteed pool clearing within 48 hours or the service is free.' },
];

export default function Pricing() {
  const reduce = useReducedMotion();
  const offers = brandDNA.special_offers.length > 0 ? brandDNA.special_offers : FALLBACK_OFFERS;

  return (
    <section id="pricing" className="bg-primary-dark py-section-gap lg:py-section-gap-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-accent mb-3">
            {brandDNA.copy.offers.label}
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl text-white mb-4">
            {brandDNA.copy.offers.heading}
          </h2>
          {brandDNA.copy.offers.body && (
            <p className="font-body text-lg text-white/70 max-w-2xl mx-auto">
              {brandDNA.copy.offers.body}
            </p>
          )}
          {brandDNA.copy.offers.detail && (
            <p className="font-body text-sm text-white/50 mt-2">{brandDNA.copy.offers.detail}</p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer, i) => (
            <OfferCard key={offer.label} offer={offer} index={i} reduce={reduce} />
          ))}
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mt-10"
        >
          <p className="font-body text-sm text-white/50">{brandDNA.copy.privacyLine}</p>
        </motion.div>
      </div>
    </section>
  );
}
