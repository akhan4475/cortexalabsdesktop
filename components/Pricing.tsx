import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, ArrowRight, PhoneCall, Star } from 'lucide-react';

const tiers = [
  {
    name: 'Launch',
    price: '$800',
    billing: 'one-time',
    badge: null,
    tagline: 'Get online. Get found. Start getting calls.',
    result: 'Stop losing jobs to competitors with a better-looking website. One booked job online pays for this many times over.',
    cta: 'Get My Website',
    featured: false,
    items: [
      { service: 'Custom website design & build',   result: 'Looks pro — converts visitors to calls'   },
      { service: 'Mobile-first & blazing fast',     result: 'Google rewards speed with higher rankings' },
      { service: 'Click-to-call + contact forms',   result: 'More inbound calls, fewer missed leads'    },
      { service: 'Google Business Profile setup',   result: 'Show up in "near me" map results'          },
      { service: 'Hosting + domain assistance',     result: 'Live in under 2 weeks'                    },
    ],
  },
  {
    name: 'Grow',
    price: '$1,500',
    billing: '/mo',
    badge: 'Most Popular',
    tagline: '2,000+ visitors. 60–100 leads. 2–3 extra jobs/month.',
    result: 'Most clients are ROI-positive within their first month. The website pays for itself — then keeps compounding.',
    cta: 'Start Growing',
    featured: true,
    items: [
      { service: 'Everything in Launch',           result: 'Custom site, fast, Google-ready'           },
      { service: 'Local SEO (ongoing monthly)',    result: 'Page 1 rankings for 10+ local searches'    },
      { service: 'Google ranking management',      result: '2,000–3,000 targeted visitors/month'       },
      { service: 'Competitor gap analysis',        result: 'Know exactly what beats you — then fix it' },
      { service: 'Monthly leads & traffic report', result: 'See your ROI in black and white'            },
    ],
  },
  {
    name: 'Scale',
    price: '$4,000',
    billing: '/mo',
    badge: 'Full-Service',
    tagline: 'Fill your calendar. Stop chasing. They come to you.',
    result: 'Built for contractors ready to grow a team. Meta ads + AI follow-up means leads come in while you sleep.',
    cta: "Let's Scale",
    featured: false,
    items: [
      { service: 'Everything in Grow',              result: 'SEO + site working 24/7'                     },
      { service: 'Meta Ads (Facebook + Instagram)', result: 'Reach homeowners before they search Google'  },
      { service: 'AI lead follow-up (60-sec)',      result: 'Never lose a job to a faster competitor again'},
      { service: 'CRM + calendar integration',      result: 'Leads book themselves on your calendar'      },
      { service: 'Dedicated account manager',       result: 'One person. Total accountability.'           },
    ],
  },
];

const PricingCard: React.FC<{ tier: typeof tiers[0]; index: number }> = ({ tier, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-8% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.1 }}
      className={`relative flex flex-col rounded-3xl overflow-hidden ${
        tier.featured
          ? 'bg-[#040405] border border-[#CD3D35]/50 shadow-[0_0_60px_rgba(205,61,53,0.12)]'
          : 'bg-[#040405] border border-white/8'
      }`}
    >
      {/* Featured top accent */}
      {tier.featured && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CD3D35] to-transparent" />
      )}

      {/* Header */}
      <div className={`px-7 pt-8 pb-6 ${tier.featured ? 'bg-[#CD3D35]/5' : ''}`}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-gray-500 text-[10px] font-bold tracking-[0.22em] uppercase mb-1">{tier.name}</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-white text-4xl font-extrabold leading-none">{tier.price}</span>
              <span className="text-gray-500 text-sm">{tier.billing}</span>
            </div>
          </div>
          {tier.badge && (
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
              tier.featured
                ? 'bg-[#CD3D35] text-white'
                : 'bg-white/10 text-gray-300 border border-white/10'
            }`}>
              {tier.badge}
            </span>
          )}
        </div>

        <p className={`text-sm font-semibold leading-snug mb-3 ${tier.featured ? 'text-white' : 'text-gray-200'}`}>
          {tier.tagline}
        </p>
        <p className="text-gray-500 text-xs leading-relaxed">{tier.result}</p>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/8 mx-7" />

      {/* Services list */}
      <div className="px-7 py-6 flex-1 space-y-4">
        {tier.items.map((item, i) => (
          <div key={i} className="flex gap-3">
            <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${tier.featured ? 'text-[#CD3D35]' : 'text-gray-500'}`} />
            <div>
              <p className="text-white text-sm font-medium leading-snug">{item.service}</p>
              <p className="text-gray-600 text-xs mt-0.5 italic">{item.result}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-7 pb-7">
        <button className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
          tier.featured
            ? 'bg-[#CD3D35] hover:bg-[#B83530] text-white shadow-lg shadow-[#CD3D35]/20'
            : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
        }`}>
          {tier.cta}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

const Pricing: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef as React.RefObject<Element>, { once: true });
  const bannerRef = useRef<HTMLDivElement>(null);
  const bannerInView = useInView(bannerRef as React.RefObject<Element>, { once: true, margin: '-8% 0px' });

  return (
    <section id="pricing" className="py-24 bg-horizon-bg border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="text-gray-500 text-[10px] font-bold tracking-[0.25em] uppercase mb-4">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-5 leading-tight">
            Pick your <span className="text-[#CD3D35]">growth plan.</span>
          </h2>
          <p className="text-gray-400 text-base max-w-lg mx-auto leading-relaxed">
            Every tier is built around one goal: more jobs booked. Start where you are, scale when you're ready.
          </p>
        </motion.div>

        {/* Shoulder–Head–Shoulder grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
          {tiers.map((tier, i) => (
            <div key={i} className={tier.featured ? 'md:-mt-8' : 'md:mb-0'}>
              <PricingCard tier={tier} index={i} />
            </div>
          ))}
        </div>

        {/* Contact for custom banner */}
        <motion.div
          ref={bannerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={bannerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 bg-[#040405] border border-white/8 rounded-2xl px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-[#CD3D35]" />
            </div>
            <div>
              <p className="text-white font-bold text-base">Need something bigger?</p>
              <p className="text-gray-500 text-sm">Multi-location, white-label, enterprise — let's build something custom.</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white font-semibold text-sm transition-all whitespace-nowrap shrink-0">
            <PhoneCall className="w-4 h-4 text-[#CD3D35]" />
            Book a Strategy Call
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default Pricing;
