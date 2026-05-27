import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Globe, TrendingUp, Users, PhoneCall, Briefcase } from 'lucide-react';

const steps = [
  {
    number: '01',
    Icon: Globe,
    title: 'We Build Your Website',
    body: 'A fully custom, mobile-fast website built from scratch — no templates, no shortcuts. Designed specifically to showcase your work and turn visitors into booked jobs.',
    stat: '< 2 wks',
    statLabel: 'avg. launch time',
  },
  {
    number: '02',
    Icon: TrendingUp,
    title: 'You Climb Google Rankings',
    body: 'Our local SEO strategy earns you page-1 spots for searches like "pool contractor near me" or "roofing company [city]" — exactly when homeowners are ready to hire.',
    stat: 'Page 1',
    statLabel: 'Google results',
  },
  {
    number: '03',
    Icon: Users,
    title: '2–3K Visitors a Month',
    body: "Real homeowners in your service area land on your site every month — no cold calls, no door knocking. They're already searching for exactly what you do.",
    stat: '2,000–3,000',
    statLabel: 'monthly visitors',
  },
  {
    number: '04',
    Icon: PhoneCall,
    title: 'Leads Start Rolling In',
    body: 'A high-converting design paired with instant AI follow-up means a 3–5% conversion rate — turning 2,000 visitors into 60–100 qualified calls and form fills every month.',
    stat: '60–100',
    statLabel: 'leads / month',
  },
  {
    number: '05',
    Icon: Briefcase,
    title: '2–3 New Jobs Every Month',
    body: "You don’t need all 60 leads. Just 2–3 closed jobs a month is enough to change your business — and most clients see their first new job within the first 30 days.",
    stat: '+2–3 jobs',
    statLabel: 'per month',
  },
];

const niches = [
  { name: 'Pool',         avg: '$35,000 – $80,000',   monthly: '$70K–$160K'  },
  { name: 'Roofing',      avg: '$8,000 – $25,000',    monthly: '$16K–$50K'   },
  { name: 'Remodeling',   avg: '$15,000 – $50,000',   monthly: '$30K–$100K'  },
  { name: 'Landscaping',  avg: '$5,000 – $20,000',    monthly: '$10K–$40K'   },
  { name: 'Painting',     avg: '$2,500 – $10,000',    monthly: '$5K–$20K'    },
  { name: 'Concrete',     avg: '$3,000 – $15,000',    monthly: '$6K–$30K'    },
  { name: 'Trade',        avg: '$2,000 – $8,000',     monthly: '$4K–$16K'    },
  { name: 'Construction', avg: '$25,000 – $150,000',  monthly: '$50K–$300K'  },
];

const StepCard: React.FC<{ step: (typeof steps)[0]; index: number }> = ({ step, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-10% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.08 }}
      className="relative bg-[#040405] border border-white/8 rounded-2xl p-5 overflow-hidden group hover:border-white/15 transition-colors duration-300"
    >
      {/* Ghost number */}
      <span className="absolute -top-3 -right-1 text-[88px] font-extrabold text-white/[0.03] leading-none select-none pointer-events-none group-hover:text-white/[0.055] transition-colors duration-500">
        {step.number}
      </span>

      {/* Icon */}
      <div className="relative z-10 w-9 h-9 rounded-xl bg-[#CD3D35]/15 border border-[#CD3D35]/25 flex items-center justify-center mb-4">
        <step.Icon className="w-4 h-4 text-[#CD3D35]" strokeWidth={2} />
      </div>

      {/* Text */}
      <h3 className="relative z-10 text-white font-bold text-base leading-snug mb-2">{step.title}</h3>
      <p className="relative z-10 text-gray-400 text-sm leading-relaxed mb-5">{step.body}</p>

      {/* Stat pill */}
      <div className="relative z-10 inline-flex items-baseline gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1">
        <span className="text-white font-extrabold text-sm">{step.stat}</span>
        <span className="text-gray-500 text-xs">{step.statLabel}</span>
      </div>
    </motion.div>
  );
};

const MathSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-10% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mt-10 bg-[#040405] border border-white/8 rounded-3xl overflow-hidden"
    >
      {/* Top bar */}
      <div className="px-8 py-6 border-b border-white/8 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-[#CD3D35] animate-pulse" />
        <p className="text-gray-400 text-xs font-bold tracking-[0.22em] uppercase">The Math Is Simple</p>
      </div>

      <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/8">

        {/* Left: ROI funnel */}
        <div className="p-8 space-y-0">
          <p className="text-white font-bold text-xl mb-8 leading-snug">
            Here's what 2,500 monthly visitors<br />
            <span className="text-[#CD3D35]">actually means for your revenue.</span>
          </p>

          {[
            { label: '2,500 visitors land on your site', sub: 'Real homeowners in your city searching for your trade' },
            { label: '~4% convert → 100 leads/month', sub: 'Calls, texts, form fills — people who want a quote' },
            { label: 'You close 2–3 of those jobs', sub: "You don't even need to be great at sales" },
            { label: 'Website pays for itself in week 1', sub: 'Month 2 onwards? Pure profit on top' },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex flex-col items-center shrink-0 pt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#CD3D35] shrink-0" />
                {i < 3 && <div className="w-px flex-1 bg-[#CD3D35]/20 mt-1 h-10" />}
              </div>
              <div className="pb-6">
                <p className="text-white font-semibold text-base leading-snug">{item.label}</p>
                <p className="text-gray-500 text-sm mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: niche value table */}
        <div className="p-8">
          <p className="text-white font-bold text-xl mb-2">Average job value by niche</p>
          <p className="text-gray-500 text-sm mb-7">2 extra jobs/month. Here's what that looks like.</p>

          <div className="space-y-0 rounded-xl overflow-hidden border border-white/8">
            {niches.map((n, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 px-5 py-3.5 text-sm ${
                  i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'
                } border-b border-white/5 last:border-b-0`}
              >
                <span className="text-gray-300 font-medium">{n.name}</span>
                <span className="text-gray-400 text-xs self-center">avg {n.avg}</span>
                <span className="text-[#CD3D35] font-bold text-right">{n.monthly}</span>
              </div>
            ))}
          </div>

          <p className="text-gray-600 text-xs mt-4 italic">* Monthly revenue added from 2 extra closed jobs. Actual results vary by market and closing rate.</p>
        </div>

      </div>

      {/* Bottom callout */}
      <div className="px-8 py-6 border-t border-white/8 bg-[#CD3D35]/5">
        <p className="text-white/80 text-sm leading-relaxed">
          <span className="text-white font-bold">Most clients see their first new job within 30 days of launch.</span>{' '}
          Your website isn't a cost — it's the highest-ROI hire you'll ever make.
        </p>
      </div>

    </motion.div>
  );
};

const Services: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef as React.RefObject<Element>, { once: true });

  return (
    <section id="services" className="py-24 bg-horizon-bg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-gray-500 text-[10px] font-bold tracking-[0.25em] uppercase mb-4">
            Our Process
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white max-w-3xl leading-tight">
            Here's exactly how we'll get your company{' '}
            <span className="text-[#CD3D35]">more jobs.</span>
          </h2>
          <p className="text-gray-400 mt-5 text-lg max-w-xl leading-relaxed">
            No smoke and mirrors. Just a proven system that works for contractors — and the numbers to back it up.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <StepCard key={i} step={step} index={i} />
          ))}
        </div>

        {/* ROI math section */}
        <MathSection />

      </div>
    </section>
  );
};

export default Services;
