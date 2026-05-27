import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const serviceData = [
  {
    plain: 'Custom ',
    accent: 'Website Design',
    image: 'https://www.uqwebdesign.com/images/pd-web-design-and-development.jpg',
    description:
      "Your website is the first thing potential clients see. A professional, fast, and conversion-focused design drives more calls and booked jobs.",
    concerns: [
      'Generic templates look unprofessional',
      "Most agencies don't understand contractors",
      'Slow sites lose leads before they call',
    ],
    benefits: [
      'Fully custom-built, never templates',
      'Designed for contractor lead generation',
      'Fast, mobile-first performance',
    ],
  },
  {
    plain: 'Search Engine ',
    accent: 'Optimization',
    image: 'https://framerusercontent.com/images/fljCuNhDYBhTsoUC3hWlX7Spydo.webp?scale-down-to=1024&width=1200&height=800',
    description:
      "97% of people search online before hiring a local contractor. If you're not on page one of Google, your competitors are getting those calls.",
    concerns: [
      'SEO can feel like a black box',
      'Cheap agencies do the bare minimum',
      'Old tactics can hurt your rankings',
    ],
    benefits: [
      'Transparent monthly reporting',
      'Proven local SEO strategies',
      'Locally focused, modern techniques',
    ],
  },
  {
    plain: 'Meta ',
    accent: 'Ad Management',
    image: 'https://lifesight.io/wp-content/uploads/Meta-Ads-Dashboard.png',
    description:
      "Most contractors miss out on a flood of ready-to-buy leads hiding on Facebook & Instagram. We run targeted Meta campaigns that put your business in front of homeowners in your area.",
    concerns: [
      'Ad spend wasted on the wrong audience',
      'Hard to track what ads actually convert',
      'Most agencies set-and-forget campaigns',
    ],
    benefits: [
      'Hyper-targeted local audience targeting',
      'Full funnel tracking & ROI reporting',
      'Actively managed & optimized weekly',
    ],
  },
];

interface BlockProps {
  service: (typeof serviceData)[0];
  index: number;
}

const ServiceBlock: React.FC<BlockProps> = ({ service, index }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref as React.RefObject<Element>, {
    once: true,
    margin: '-8% 0px -8% 0px',
  });

  const imageLeft = index % 2 === 0;

  return (
    <div ref={ref} className="py-20 border-b border-white/10 last:border-b-0">
      <div className={`flex flex-col ${imageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: imageLeft ? -50 : 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full lg:w-[48%] shrink-0"
        >
          <div className="overflow-hidden rounded-2xl h-64 md:h-80">
            <img
              src={service.image}
              alt={`${service.plain}${service.accent}`}
              className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              draggable={false}
            />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: imageLeft ? 50 : -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.08 }}
          className="flex-1 min-w-0"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-5">
            <span className="text-white">{service.plain}</span>
            <span className="text-[#CD3D35]">{service.accent}</span>
          </h3>

          <p className="text-gray-400 leading-relaxed mb-10 max-w-lg text-base">
            {service.description}
          </p>

          <div className="grid grid-cols-2 gap-10">
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-4 pb-3 border-b border-white/20">
                Concerns
              </h4>
              {service.concerns.map((item, i) => (
                <div key={i} className="py-4 border-b border-white/10 last:border-b-0">
                  <p className="text-gray-400 text-sm">{item}</p>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-4 pb-3 border-b border-[#CD3D35]/50">
                Benefits
              </h4>
              {service.benefits.map((item, i) => (
                <div key={i} className="py-4 border-b border-white/10 last:border-b-0">
                  <p className="text-gray-400 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

const Process: React.FC = () => {
  return (
    <section id="process" className="bg-horizon-bg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="pt-24 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gray-500 text-[10px] font-bold tracking-[0.25em] uppercase mb-4">
              Our Services
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white">
              Attract <span className="text-[#CD3D35]">Higher-Quality</span> Leads
            </h2>
          </motion.div>
        </div>

        {/* Service blocks */}
        <div className="pb-16">
          {serviceData.map((service, i) => (
            <ServiceBlock key={i} service={service} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Process;
