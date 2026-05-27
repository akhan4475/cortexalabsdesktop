import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, TreePine, Home, Building2, Wrench, PaintBucket, HardHat, Mountain } from 'lucide-react';

const contractors = [
  {
    title: 'Pool Contractors',
    icon: <Waves className="w-5 h-5" />,
    image: 'https://imaginepools.com/wp-content/uploads/2025/09/DSC_0830.webp',
  },
  {
    title: 'Landscape/Hardscape Contractors',
    icon: <TreePine className="w-5 h-5" />,
    image: 'https://i.ytimg.com/vi/vd86yhlILzw/maxresdefault.jpg',
  },
  {
    title: 'Roofing Contractors',
    icon: <Home className="w-5 h-5" />,
    image: 'https://images.ctfassets.net/wz4em6cftltu/3eGpqKHLbnKMjLoV31cEHZ/663bdec4e0eb6f551f2eafdfbe61f872/metal_roof.jpeg?w=1456&h=816&fl=progressive&q=50&fm=jpg',
  },
  {
    title: 'Construction Contractors',
    icon: <Building2 className="w-5 h-5" />,
    image: 'https://www.usnews.com/dims4/USNEWS/9ee218b/2147483647/thumbnail/970x647/quality/85/?url=https%3A%2F%2Fwww.usnews.com%2Fcmsmedia%2F4d%2Fe1%2F664d78894ef6a5833b05a6a9b7cb%2Fgettyimages-1397284746.jpg',
  },
  {
    title: 'Trade Contractors',
    icon: <Wrench className="w-5 h-5" />,
    image: 'https://cdn11.bigcommerce.com/s-bgnp0pk0ti/product_images/uploaded_images/what-are-the-components-of-a-residential-hvac-system-guid.png',
  },
  {
    title: 'Painting Contractors',
    icon: <PaintBucket className="w-5 h-5" />,
    image: 'https://certapro.com/lancaster/wp-content/uploads/sites/1395/cache/remote/pub-9fc1f065f07e441b8f35365c774f09ae-r2-dev/3134093871.jpg',
  },
  {
    title: 'Remodeling Contractors',
    icon: <HardHat className="w-5 h-5" />,
    image: 'https://terrapass.com/wp-content/uploads/2023/01/Green-Remodeling-in-Process.jpeg',
  },
  {
    title: 'Concrete Contractors',
    icon: <Mountain className="w-5 h-5" />,
    image: 'https://www.brickform.com/wp-content/uploads/2024/06/Finishing-1.jpg',
  },
];

const slides = [
  [contractors[0], contractors[1]],
  [contractors[2], contractors[3]],
  [contractors[4], contractors[5]],
  [contractors[6], contractors[7]],
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

const IndustriesSection: React.FC = () => {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const [autoKey, setAutoKey] = useState(0);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  // Auto-rotate — resets whenever autoKey changes (on manual nav)
  useEffect(() => {
    const timer = setInterval(() => {
      setDir(1);
      setPage(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoKey]);

  const goTo = (newPage: number) => {
    const newDir = newPage > page ? 1 : -1;
    setDir(newDir);
    setPage(newPage);
    setAutoKey(k => k + 1);
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    dragStartX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    isDragging.current = false;
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    if (Math.abs(x - dragStartX.current) > 5) isDragging.current = true;
  };

  const handlePointerUp = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;
    const endX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStartX.current - endX;
    if (diff > 60) goTo((page + 1) % slides.length);
    else if (diff < -60) goTo((page - 1 + slides.length) % slides.length);
  };

  return (
    <section className="py-16 bg-horizon-bg">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-[#040405] rounded-3xl overflow-hidden border border-white/5">

          {/* Header */}
          <div className="text-center pt-12 px-8 pb-10">
            <p className="text-gray-500 text-[10px] font-bold tracking-[0.25em] uppercase mb-5">
              Custom Websites Built for Contractors
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
              We love <span className="text-[#CD3D35]">serving</span> our industries
            </h2>
          </div>

          {/* Carousel */}
          <div
            className="px-8 overflow-hidden cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
          >
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={page}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="grid grid-cols-2 gap-4"
              >
                {slides[page].map((c, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/10 overflow-hidden bg-[#0a0a0f]"
                  >
                    {/* Card title row */}
                    <div className="flex items-center justify-center gap-2.5 py-4 border-b border-white/10">
                      <span className="text-white/70">{c.icon}</span>
                      <span className="text-white font-semibold text-sm md:text-base tracking-tight">
                        {c.title}
                      </span>
                    </div>
                    {/* Image — fixed height, object-cover fills consistently */}
                    <div className="h-52 md:h-64 overflow-hidden">
                      <img
                        src={c.image}
                        alt={c.title}
                        draggable={false}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center items-center gap-2 mt-6 mb-8">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  page === i ? 'bg-white w-7' : 'bg-white/25 w-2 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 border-t border-white/10">
            {[
              { value: '3k+', label: 'Monthly Website Visits' },
              { value: '4.9', label: 'Rating out of 5' },
              { value: '2+', label: 'New Clients / Month Per Client' },
            ].map((stat, i) => (
              <div
                key={i}
                className={`text-center py-9 ${i === 1 ? 'border-x border-white/10' : ''}`}
              >
                <p className="text-4xl md:text-5xl font-display font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-gray-500 text-sm mt-2">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;
