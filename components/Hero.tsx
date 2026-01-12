import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ParticleSphere from './ParticleSphere';
import SpaceBackground from './SpaceBackground';

interface HeroProps {
    onBookConsultation: () => void;
    onViewDashboard: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBookConsultation, onViewDashboard }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(false);
  const subtext = "We engineer custom AI infrastructure to automate your operations, all controlled through a centralized dashboard.";

  useEffect(() => {
    // Delay the start of typing to allow the main hero animations to complete/settle
    const startDelay = 1500; 
    
    const timer = setTimeout(() => {
        setShowCursor(true);
        let currentIndex = 0;
        
        // Typing interval
        const intervalId = setInterval(() => {
            if (currentIndex <= subtext.length) {
                setDisplayedText(subtext.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(intervalId);
                // Cursor remains visible (showCursor stays true)
            }
        }, 30); // 30ms per character

        return () => clearInterval(intervalId);
    }, startDelay);

    return () => clearTimeout(timer);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30, 
      filter: 'blur(8px)',
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { 
        duration: 1.2,
        ease: [0.2, 0.65, 0.3, 0.9] as [number, number, number, number],
      }
    },
  };

  return (
    <section className="relative pt-32 pb-10 md:pt-48 md:pb-20 overflow-hidden flex flex-col items-center justify-center min-h-screen">
      
      {/* 3D Space Background */}
      <SpaceBackground />
      
      {/* Overlay gradient for better text readability at top/bottom edges if needed */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-horizon-bg/80 via-transparent to-horizon-bg/80 pointer-events-none"></div>

      <motion.div 
        className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col items-center text-center w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* Top Badge */}
        <motion.div
            variants={itemVariants}
            className="mb-8"
        >
            <div 
                onClick={onViewDashboard}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1F1F1F]/80 backdrop-blur-sm border border-white/10 text-gray-300 text-sm font-medium hover:border-white/20 transition-colors cursor-pointer group"
            >
                <span>Intelligent Agents × Dashboard</span>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-8 tracking-tight text-white max-w-5xl"
        >
            AI Infrastructure Engineered <br className="hidden md:block" />
            for Peak Performance
        </motion.h1>

        {/* Subtext with Typewriter Effect */}
        <motion.div
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed min-h-[60px] md:min-h-[3.5rem]"
        >
            <span>{displayedText}</span>
            {showCursor && (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className="inline-block w-0.5 h-5 ml-1 bg-horizon-accent align-middle shadow-[0_0_8px_rgba(62,206,141,0.8)]"
                />
            )}
        </motion.div>

        {/* Buttons */}
        <motion.div
            variants={itemVariants}
            className="flex justify-center mb-16"
        >
            <button
                onClick={onBookConsultation}
                className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105"
            >
                Book a Consultation
            </button>
        </motion.div>

        {/* Sphere Section */}
        <motion.div 
            variants={itemVariants}
            className="w-full h-[400px] md:h-[500px] relative flex items-center justify-center -mt-10"
        >
            {/* Gradient masks to fade the sphere into the background/section above */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-horizon-bg to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-horizon-bg to-transparent z-10 pointer-events-none" />
            
            <ParticleSphere />
        </motion.div>

      </motion.div>
    </section>
  );
};

export default Hero;