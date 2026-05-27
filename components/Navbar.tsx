import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home',         id: 'top'          },
  { name: 'Services',     id: 'process'      },
  { name: 'Process',      id: 'services'     },
  { name: 'Case Studies', id: 'case-studies' },
  { name: 'Pricing',      id: 'pricing'      },
  { name: 'Contact',      id: 'contact'      },
];

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, onLoginClick }) => {
  const [active, setActive] = useState('top');

  const handleNavClick = (id: string) => {
    setActive(id);
    onNavigate(id);
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.25 }}
      role="navigation"
      aria-label="Site Navigation"
    >
      <div className="bg-[#040405]/90 backdrop-blur-md border border-white/10 rounded-full flex items-center px-3 py-2 gap-1 shadow-2xl whitespace-nowrap">

        {/* Nav links */}
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => handleNavClick(link.id)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
              active === link.id
                ? 'text-white bg-white/10'
                : 'text-[#888889] hover:text-white hover:bg-white/5'
            )}
          >
            {link.name}
          </button>
        ))}

        {/* Separator */}
        <div className="w-px h-5 bg-white/10 mx-1 shrink-0" />

        {/* Login button */}
        <button
          onClick={onLoginClick}
          className="flex items-center gap-2 px-5 py-2 bg-[#CD3D35] hover:bg-[#B83530] text-white font-semibold rounded-full transition-all active:scale-95 text-sm shrink-0"
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#B83530')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#CD3D35')}
        >
          <LogIn className="w-3.5 h-3.5" />
          Login
        </button>

      </div>
    </motion.nav>
    </div>
  );
};

export default Navbar;
