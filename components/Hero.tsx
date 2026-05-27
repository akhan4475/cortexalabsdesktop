import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Wrench, Cpu, Star } from 'lucide-react';

interface HeroProps {
  onBookConsultation: () => void;
  onViewDashboard: () => void;
}

const bullets = [
  { icon: BarChart2, bold: 'Transparent', text: ': We show you all the work we complete each month.' },
  { icon: Wrench,    bold: 'Custom',      text: ': We build your website and AI tools from scratch to fit your business.' },
  { icon: Cpu,       bold: 'Results-Driven', text: ': Every system is engineered to generate more leads and booked jobs.' },
];

// overlapping avatar photos for trust badge
const avatars = [
  'https://s3-media0.fl.yelpcdn.com/bphoto/Iq9edzPjXCUczDmzHMBSew/180s.jpg',
  'https://intactroofing.com/wp-content/uploads/2026/01/cropped-intact-roofing-vaughan-richmond-hill-king-city-416-616-6761.webp',
  'https://cdn.homeadvisor.com/files/eid/131450000/131451618/12991826_logo.png',
  'https://s3-media0.fl.yelpcdn.com/bphoto/VFdALM0cTn0OCm5QeKruAA/348s.jpg',
];

const leftContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const leftItem = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

const Stars = ({ size = 'w-4 h-4' }: { size?: string }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`${size} fill-yellow-400 text-yellow-400`} />
    ))}
  </div>
);

const Hero: React.FC<HeroProps> = ({ onBookConsultation }) => {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">

      {/* ── Background ── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://wallpapers.com/images/hd/construction-pictures-kts203mm0wflinpv.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Blur as a separate transparent backdrop layer */}
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(7px)' }} />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#131317] to-transparent" />
      </div>

      {/* ── Content row ── */}
      <div className="relative z-10 flex-1 flex items-center justify-between px-8 md:px-14 lg:px-20 pt-28 pb-16 gap-8">

        {/* LEFT */}
        <motion.div
          variants={leftContainer}
          initial="hidden"
          animate="visible"
          className="max-w-xl"
        >
          <motion.p variants={leftItem} className="text-gray-400 text-[12px] font-bold tracking-[0.28em] uppercase mb-5">
            AI-Powered Web Agency
          </motion.p>

          <motion.h1 variants={leftItem} className="text-[3.6rem] md:text-[5.4rem] font-display font-extrabold text-white leading-[1.04] mb-8 tracking-tight">
            Cortexa<br />Labs
          </motion.h1>

          <motion.div variants={leftItem} className="space-y-4 mb-10">
            {bullets.map((b, i) => (
              <div key={i} className="flex items-start gap-3">
                <b.icon className="w-[20px] h-[20px] text-[#CD3D35] mt-[3px] shrink-0" strokeWidth={2.2} />
                <p className="text-gray-300 text-[17px] md:text-[18px] leading-snug">
                  <strong className="text-white font-semibold">{b.bold}</strong>{b.text}
                </p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={leftItem}>
            <button
              onClick={onBookConsultation}
              className="px-8 py-3.5 bg-[#CD3D35] text-white font-bold rounded-lg hover:bg-[#B83530] active:scale-95 transition-all text-[19px]"
            >
              Book a Call
            </button>
          </motion.div>
        </motion.div>

        {/* RIGHT — stacked cards pushed to far right */}
        <div className="hidden lg:flex flex-col gap-4 w-[420px] xl:w-[455px] shrink-0">

          {/* ── 1. Review card (top) ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
              {/* Stars + name + photo */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <Stars size="w-[18px] h-[18px]" />
                  <p className="text-white font-bold text-base mt-2 leading-tight">Yarleyd</p>
                  <p className="text-gray-400 text-xs mt-0.5">From Pintos Painting</p>
                </div>
                <img
                  src="https://i.postimg.cc/3Nbd7pcN/515020637-1054941080147153-6023406906585044367-n.jpg"
                  alt="Yarleyd"
                  className="w-[76px] h-[76px] rounded-full object-cover object-center border-2 border-white/25 shrink-0"
                />
              </div>

              {/* Quote box */}
              <div className="border border-white/15 rounded-xl bg-white/5 px-4 py-3">
                <p className="text-white/90 text-sm font-semibold italic leading-relaxed text-center">
                  "If you're looking for an awesome quality website reach out to Cortexa Labs. They will get you right!"
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── 2. Trust badge pill (bottom) ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.75, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-[#1a1a1a]/90 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-5 px-7 py-[18px] shadow-2xl">
              {/* Overlapping avatars */}
              <div className="flex -space-x-3 shrink-0">
                {avatars.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="w-[53px] h-[53px] rounded-full border-[2.5px] border-[#1a1a1a] object-cover"
                    style={{ zIndex: i }}
                  />
                ))}
              </div>

              {/* Rating text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-extrabold text-[26px] leading-none">5/5</span>
                  <Stars size="w-[19px] h-[19px]" />
                </div>
                <p className="text-gray-300 text-[12px] font-bold uppercase tracking-[0.15em] italic">
                  Happy Contractors
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
