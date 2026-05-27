import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Search, Users, PhoneCall, Briefcase, TrendingUp, XCircle, CheckCircle2, Calculator, Zap } from 'lucide-react';

// ─── Comparison rows ──────────────────────────────────────────────────────────
const rows = [
  {
    Icon: Search,
    label: 'Google Visibility',
    bad:  'Not indexed / Page 5+',
    good: 'Page 1 — 10+ local keywords',
  },
  {
    Icon: Users,
    label: 'Monthly Website Visitors',
    bad:  '30 – 80  (word of mouth only)',
    good: '2,000 – 3,000  targeted visitors',
  },
  {
    Icon: PhoneCall,
    label: 'Leads Generated / Month',
    bad:  '1 – 3 leads',
    good: '60 – 100 qualified leads',
  },
  {
    Icon: Briefcase,
    label: 'New Jobs Added / Month',
    bad:  '0 from online',
    good: '2 – 3 extra booked jobs',
  },
  {
    Icon: TrendingUp,
    label: 'Online Revenue Impact',
    bad:  '$0 from Google / Meta',
    good: 'Depends on your niche ↓',
  },
];

// ─── Niche presets ────────────────────────────────────────────────────────────
const niches = [
  { label: 'Pool',         value: 40000 },
  { label: 'Roofing',      value: 12000 },
  { label: 'Remodeling',   value: 25000 },
  { label: 'Landscaping',  value: 8000  },
  { label: 'Painting',     value: 4000  },
  { label: 'Concrete',     value: 6000  },
  { label: 'Trade',        value: 4000  },
  { label: 'Construction', value: 50000 },
];

// ─── Slider component ─────────────────────────────────────────────────────────
const Slider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  onChange: (v: number) => void;
}> = ({ label, value, min, max, step = 1, prefix = '', suffix = '', onChange }) => {
  const pct = ((value - min) / (max - min)) * 100;
  const display = prefix + (value >= 1000 ? (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + 'K' : value) + suffix;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</label>
        <span className="text-white font-bold text-sm tabular-nums">{display}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #CD3D35 ${pct}%, rgba(255,255,255,0.12) ${pct}%)`,
          accentColor: '#CD3D35',
        }}
      />
      <div className="flex justify-between text-[10px] text-gray-600 mt-1">
        <span>{prefix}{min >= 1000 ? min / 1000 + 'K' : min}{suffix}</span>
        <span>{prefix}{max >= 1000 ? max / 1000 + 'K' : max}{suffix}</span>
      </div>
    </div>
  );
};

// ─── Main section ─────────────────────────────────────────────────────────────
const ComparisonSection: React.FC = () => {
  const [jobValue,    setJobValue]    = useState(12000);
  const [extraJobs,   setExtraJobs]   = useState(2);
  const [websiteCost, setWebsiteCost] = useState(1500);
  const [activeNiche, setActiveNiche] = useState('Roofing');

  const monthly       = extraJobs * jobValue;
  const firstYearNet  = monthly * 12 - websiteCost;
  const paybackDays   = monthly > 0 ? Math.round((websiteCost / monthly) * 30) : 0;

  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef as React.RefObject<Element>, { once: true });
  const cardRef = useRef<HTMLDivElement>(null);
  const cardInView = useInView(cardRef as React.RefObject<Element>, { once: true, margin: '-8% 0px' });
  const calcRef = useRef<HTMLDivElement>(null);
  const calcInView = useInView(calcRef as React.RefObject<Element>, { once: true, margin: '-8% 0px' });

  return (
    <section id="comparison" className="py-24 bg-horizon-bg border-b border-white/10 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-gray-500 text-[10px] font-bold tracking-[0.25em] uppercase mb-4">
            Revenue Calculator
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
              What is a real website<br />
              <span className="text-[#CD3D35]">actually worth to you?</span>
            </h2>
            <p className="text-gray-400 text-base max-w-xs leading-relaxed md:text-right">
              Plug in your numbers. See the gap between doing nothing and doing it right.
            </p>
          </div>
        </motion.div>

        {/* ── Comparison card ── */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 30 }}
          animate={cardInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-6 bg-[#040405] border border-white/8 rounded-3xl overflow-hidden"
        >
          {/* Column headers */}
          <div className="grid grid-cols-[1fr_auto_1fr]">
            <div className="flex items-center gap-2.5 px-7 py-5 border-b border-white/8 bg-red-500/5">
              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-red-300 font-bold text-sm">No / Poor Website</span>
            </div>
            <div className="w-px bg-white/8 border-b border-white/8" />
            <div className="flex items-center gap-2.5 px-7 py-5 border-b border-white/8 bg-[#CD3D35]/5">
              <CheckCircle2 className="w-4 h-4 text-[#CD3D35] shrink-0" />
              <span className="text-white font-bold text-sm">Cortexa Labs Website</span>
            </div>
          </div>

          {/* Metric rows */}
          {rows.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-[1fr_auto_1fr] ${i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.015]'}`}
            >
              {/* Bad value */}
              <div className="px-7 py-4 flex items-center gap-3 border-b border-white/5 last:border-b-0">
                <row.Icon className="w-4 h-4 text-red-500/60 shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider leading-none mb-1">{row.label}</p>
                  <p className="text-red-400/80 text-sm font-medium">{row.bad}</p>
                </div>
              </div>

              {/* Center divider */}
              <div className="w-px bg-white/8 border-b border-white/5" />

              {/* Good value */}
              <div className="px-7 py-4 flex items-center gap-3 border-b border-white/5 last:border-b-0">
                <row.Icon className="w-4 h-4 text-[#CD3D35]/70 shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider leading-none mb-1">{row.label}</p>
                  <p className="text-white text-sm font-semibold">{row.good}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Calculator card ── */}
        <motion.div
          ref={calcRef}
          initial={{ opacity: 0, y: 30 }}
          animate={calcInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
          className="bg-[#040405] border border-white/8 rounded-3xl overflow-hidden"
        >
          {/* Card header bar */}
          <div className="flex items-center gap-3 px-8 py-5 border-b border-white/8">
            <div className="w-8 h-8 rounded-lg bg-[#CD3D35]/15 border border-[#CD3D35]/25 flex items-center justify-center">
              <Calculator className="w-4 h-4 text-[#CD3D35]" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Revenue Impact Calculator</p>
              <p className="text-gray-600 text-xs">Plug in your niche — see your upside.</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/8">

            {/* Left — inputs */}
            <div className="p-8 space-y-7">

              {/* Niche quick-pick */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Your Niche</p>
                <div className="flex flex-wrap gap-2">
                  {niches.map((n) => (
                    <button
                      key={n.label}
                      onClick={() => { setActiveNiche(n.label); setJobValue(n.value); }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        activeNiche === n.label
                          ? 'bg-[#CD3D35] border-[#CD3D35] text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      {n.label}
                    </button>
                  ))}
                </div>
              </div>

              <Slider
                label="Average Job Value"
                value={jobValue}
                min={500}
                max={80000}
                step={500}
                prefix="$"
                onChange={setJobValue}
              />

              <Slider
                label="Extra Jobs / Month (from website)"
                value={extraJobs}
                min={1}
                max={5}
                step={1}
                suffix=" jobs"
                onChange={setExtraJobs}
              />

              <Slider
                label="Website Investment (one-time)"
                value={websiteCost}
                min={800}
                max={3000}
                step={100}
                prefix="$"
                onChange={setWebsiteCost}
              />
            </div>

            {/* Right — results */}
            <div className="p-8 flex flex-col gap-4 justify-center">

              {/* Monthly added revenue */}
              <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-600 mb-3">Monthly Revenue Added</p>
                <p className="text-5xl font-extrabold text-white tabular-nums leading-none">
                  ${monthly.toLocaleString()}
                </p>
                <p className="text-gray-600 text-xs mt-2">{extraJobs} jobs × ${jobValue.toLocaleString()} avg job value</p>
              </div>

              {/* First year net + payback row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#CD3D35]/8 border border-[#CD3D35]/20 rounded-2xl p-5">
                  <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#CD3D35]/70 mb-2">Year 1 Net Profit</p>
                  <p className={`text-2xl font-extrabold tabular-nums ${firstYearNet >= 0 ? 'text-white' : 'text-red-400'}`}>
                    {firstYearNet >= 0 ? '+' : ''}${Math.abs(firstYearNet).toLocaleString()}
                  </p>
                  <p className="text-gray-600 text-[10px] mt-1">after ${websiteCost.toLocaleString()} one-time build</p>
                </div>
                <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
                  <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-gray-600 mb-2">Yr 2+ Annual Net</p>
                  <p className="text-2xl font-extrabold tabular-nums text-white">
                    +${(monthly * 12).toLocaleString()}
                  </p>
                  <p className="text-gray-600 text-[10px] mt-1">no recurring website cost</p>
                </div>
              </div>

              {/* Payback callout */}
              {monthly > 0 && (
                <div className="flex items-center gap-3 bg-white/[0.03] border border-white/8 rounded-xl px-5 py-3.5">
                  <Zap className="w-4 h-4 text-[#CD3D35] shrink-0" />
                  <p className="text-gray-300 text-sm">
                    Your website pays for itself in{' '}
                    <span className="text-white font-bold">
                      {paybackDays <= 7 ? 'less than a week' : paybackDays <= 30 ? `${paybackDays} days` : `${Math.ceil(paybackDays / 30)} month${Math.ceil(paybackDays / 30) > 1 ? 's' : ''}`}
                    </span>
                    .
                  </p>
                </div>
              )}
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default ComparisonSection;
