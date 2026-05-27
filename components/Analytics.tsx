import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, ArrowUpRight, Quote } from 'lucide-react';

// ─── Template data — fill in with real client info ────────────────────────────
const caseStudies = [
  {
    featured: true,
    tag: 'Pool Contractor',
    tagColor: '#1a4a6b',
    tagText: '#5bc4f5',
    client: '[Client Company Name]',
    location: '[City, State]',
    services: ['Custom Website', 'Local SEO', 'Meta Ads'],
    challenge:
      '[Describe the challenge the client was facing before working with Cortexa Labs — e.g. no online presence, losing jobs to competitors, outdated website, etc.]',
    metrics: [
      { value: '+312%',  label: 'More Leads',           sub: 'vs. 6 months prior' },
      { value: '$85K',   label: 'Extra Revenue / Mo',   sub: 'from 2–3 new jobs'  },
      { value: 'Page 1', label: 'Google Rankings',      sub: 'for 14 local keywords' },
    ],
    quote: '"[Paste the client\'s testimonial here — what did working with Cortexa Labs actually do for their business?]"',
    author: '[First Name], [Client Company]',
  },
  {
    featured: false,
    tag: 'Roofing Contractor',
    tagColor: '#2a1a0a',
    tagText: '#f5a623',
    client: '[Client Company Name]',
    location: '[City, State]',
    services: ['Custom Website', 'Local SEO'],
    challenge: '[Client challenge summary]',
    metrics: [
      { value: '+187%', label: 'Website Traffic',  sub: 'month over month'   },
      { value: '3×',    label: 'More Booked Jobs', sub: 'within 60 days'    },
      { value: '#1',    label: 'Local Ranking',    sub: '"roofer near me"'   },
    ],
    quote: '"[Client testimonial]"',
    author: '[First Name], [Client Company]',
  },
  {
    featured: false,
    tag: 'Landscaping Contractor',
    tagColor: '#0d2a0d',
    tagText: '#4ade80',
    client: '[Client Company Name]',
    location: '[City, State]',
    services: ['Custom Website', 'Meta Ads'],
    challenge: '[Client challenge summary]',
    metrics: [
      { value: '+240%', label: 'Lead Increase',    sub: 'in first 90 days'  },
      { value: '$32K',  label: 'Added Revenue/Mo', sub: 'from Meta Ads'     },
      { value: '2.8×',  label: 'ROAS',             sub: 'on Meta campaigns' },
    ],
    quote: '"[Client testimonial]"',
    author: '[First Name], [Client Company]',
  },
];

// ─── Featured card ─────────────────────────────────────────────────────────────
const FeaturedCard: React.FC<{ cs: (typeof caseStudies)[0] }> = ({ cs }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-8% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative bg-[#040405] border border-white/8 rounded-3xl overflow-hidden"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CD3D35] to-transparent" />

      <div className="grid lg:grid-cols-[1fr_420px]">

        {/* Left — context */}
        <div className="p-10 border-b lg:border-b-0 lg:border-r border-white/8">

          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold tracking-wide"
              style={{ backgroundColor: cs.tagColor, color: cs.tagText }}
            >
              {cs.tag}
            </span>
            <span className="inline-flex items-center gap-1.5 text-gray-500 text-xs">
              <MapPin className="w-3 h-3" /> {cs.location}
            </span>
            <span className="ml-auto text-[10px] font-bold tracking-[0.2em] uppercase text-[#CD3D35] bg-[#CD3D35]/10 border border-[#CD3D35]/20 px-3 py-1 rounded-full">
              Featured
            </span>
          </div>

          {/* Client name */}
          <h3 className="text-white text-2xl font-bold mb-1">{cs.client}</h3>

          {/* Services */}
          <div className="flex flex-wrap gap-2 mb-8">
            {cs.services.map((s) => (
              <span key={s} className="px-2.5 py-1 bg-white/5 border border-white/8 rounded-md text-xs text-gray-400 font-medium">
                {s}
              </span>
            ))}
          </div>

          {/* Challenge */}
          <div className="mb-8">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-600 mb-2">The Challenge</p>
            <p className="text-gray-400 text-sm leading-relaxed">{cs.challenge}</p>
          </div>

          {/* Quote */}
          <div className="border border-white/8 bg-white/[0.02] rounded-2xl p-6 relative">
            <Quote className="w-6 h-6 text-[#CD3D35]/40 mb-3" />
            <p className="text-white/70 text-sm italic leading-relaxed mb-4">{cs.quote}</p>
            <p className="text-gray-500 text-xs font-semibold">— {cs.author}</p>
          </div>
        </div>

        {/* Right — metrics */}
        <div className="p-10 flex flex-col justify-center gap-4">
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-gray-600 mb-2">Results</p>
          {cs.metrics.map((m, i) => (
            <div
              key={i}
              className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 group hover:border-white/15 hover:bg-white/[0.05] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-[#CD3D35] text-4xl font-extrabold leading-none tracking-tight">
                  {m.value}
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#CD3D35]/50 mt-1 group-hover:text-[#CD3D35] transition-colors" />
              </div>
              <p className="text-white font-semibold text-base">{m.label}</p>
              <p className="text-gray-600 text-xs mt-0.5">{m.sub}</p>
            </div>
          ))}
        </div>

      </div>
    </motion.div>
  );
};

// ─── Regular card ──────────────────────────────────────────────────────────────
const RegularCard: React.FC<{ cs: (typeof caseStudies)[0]; delay: number }> = ({ cs, delay }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-8% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      className="bg-[#040405] border border-white/8 rounded-3xl overflow-hidden flex flex-col group hover:border-white/15 transition-colors duration-300"
    >
      {/* Card header */}
      <div className="p-7 border-b border-white/8">
        <div className="flex items-center justify-between mb-4">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold tracking-wide"
            style={{ backgroundColor: cs.tagColor, color: cs.tagText }}
          >
            {cs.tag}
          </span>
          <span className="inline-flex items-center gap-1 text-gray-600 text-xs">
            <MapPin className="w-3 h-3" /> {cs.location}
          </span>
        </div>
        <h3 className="text-white font-bold text-lg mb-3">{cs.client}</h3>
        <div className="flex flex-wrap gap-1.5">
          {cs.services.map((s) => (
            <span key={s} className="px-2 py-0.5 bg-white/5 border border-white/8 rounded text-[11px] text-gray-400">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 divide-x divide-white/8">
        {cs.metrics.map((m, i) => (
          <div key={i} className="p-5 text-center">
            <p className="text-[#CD3D35] text-2xl font-extrabold leading-none mb-1">{m.value}</p>
            <p className="text-white text-xs font-semibold leading-tight">{m.label}</p>
            <p className="text-gray-600 text-[10px] mt-0.5">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Quote */}
      <div className="p-7 mt-auto">
        <div className="border border-white/8 bg-white/[0.02] rounded-xl p-5">
          <Quote className="w-4 h-4 text-[#CD3D35]/40 mb-2" />
          <p className="text-white/60 text-xs italic leading-relaxed mb-3">{cs.quote}</p>
          <p className="text-gray-600 text-[11px] font-semibold">— {cs.author}</p>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Section ───────────────────────────────────────────────────────────────────
const Analytics: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef as React.RefObject<Element>, { once: true });

  return (
    <section id="case-studies" className="py-24 bg-horizon-bg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-gray-500 text-[10px] font-bold tracking-[0.25em] uppercase mb-4">
            Case Studies
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white max-w-xl leading-tight">
              Real results.<br />
              <span className="text-[#CD3D35]">Real contractors.</span>
            </h2>
            <p className="text-gray-400 text-base max-w-sm leading-relaxed md:text-right">
              Every number below is from a real campaign run for a real contractor — no made-up stats, no averages.
            </p>
          </div>
        </motion.div>

        {/* Featured */}
        <div className="mb-6">
          <FeaturedCard cs={caseStudies[0]} />
        </div>

        {/* Grid of 2 */}
        <div className="grid md:grid-cols-2 gap-6">
          {caseStudies.slice(1).map((cs, i) => (
            <RegularCard key={i} cs={cs} delay={i * 0.1} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Analytics;
