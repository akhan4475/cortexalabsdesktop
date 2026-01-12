import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom Stylized 'N' Component
const StylizedN = () => (
  <div className="relative inline-flex items-center justify-center w-[0.8em] h-[0.72em] ml-[0.02em] mr-[0.22em]">
     <svg viewBox="0 0 90 100" className="w-full h-full fill-white overflow-visible">
        {/* Left Leg - Thicker (26) to match ExtraBold */}
        <rect x="0" y="0" width="26" height="100" />
        
        {/* Diagonal - Thicker connection */}
        <path d="M 0 0 L 26 0 L 90 100 L 64 100 Z" />
        
        {/* Right Leg (Shortened) - Thicker (26) */}
        <rect x="64" y="45" width="26" height="55" />
        
        {/* Glowing Dot - Larger (r=11) to match thickness */}
        <circle cx="77" cy="18" r="11" fill="#3ECE8D" style={{ filter: 'drop-shadow(0 0 6px rgba(62,206,141,0.9))' }} />
     </svg>
  </div>
);

interface NavbarProps {
    onNavigate: (sectionId: string) => void;
    onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, onLoginClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate('top');
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // Close mobile menu if it's open
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);

    const targetId = href.replace('#', '');
    onNavigate(targetId);
  };

  const navLinks = [
    { name: 'Process', href: '#process' },
    { name: 'Frameworks', href: '#services' },
    { name: 'Analytics', href: '#comparison' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/10 ${
        isScrolled ? 'bg-horizon-bg/80 backdrop-blur-md py-4' : 'bg-transparent py-6'
      }`}
    >
      {/* Spotlight Glow Effect on Bottom Border */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-horizon-accent/50 to-transparent shadow-[0_0_15px_rgba(62,206,141,0.4)]" />

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-10">
        <a href="#" onClick={scrollToTop} className="flex items-center group">
          <div className="text-2xl font-display font-extrabold tracking-[0.2em] uppercase text-white flex items-center">
            HORIZO
            <StylizedN />
            <span className="text-horizon-accent">AI</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium text-gray-300 hover:text-horizon-accent transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={onLoginClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-horizon-card border border-white/10 hover:border-horizon-accent/50 text-white font-semibold rounded-full hover:bg-white/5 transition-all active:scale-95 group"
          >
            <LogIn className="w-4 h-4 text-horizon-accent group-hover:text-white transition-colors" />
            Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-300 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-horizon-card border-b border-white/5 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-lg font-medium text-gray-300 hover:text-horizon-accent"
                >
                  {link.name}
                </a>
              ))}
              <button
                onClick={() => { setIsMobileMenuOpen(false); onLoginClick(); }}
                className="mt-4 px-5 py-3 bg-horizon-accent text-horizon-bg font-bold rounded-lg text-center flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Login
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;