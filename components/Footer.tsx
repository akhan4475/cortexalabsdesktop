import React from 'react';
import { Twitter, Linkedin, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-horizon-bg border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center">
          <span className="text-xl font-display font-extrabold tracking-[0.2em] uppercase text-white">
            Horizon<span className="text-horizon-accent">AI</span>
          </span>
        </div>

        <div className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Horizon AI Agency. All rights reserved.
        </div>

        <div className="flex gap-4">
          <a href="#" className="p-2 text-gray-400 hover:text-horizon-accent transition-colors bg-white/5 rounded-full">
            <Twitter size={18} />
          </a>
          <a href="#" className="p-2 text-gray-400 hover:text-horizon-accent transition-colors bg-white/5 rounded-full">
            <Linkedin size={18} />
          </a>
          <a href="#" className="p-2 text-gray-400 hover:text-horizon-accent transition-colors bg-white/5 rounded-full">
            <Github size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;