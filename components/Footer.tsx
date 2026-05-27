import React from 'react';
import { Facebook, Youtube, Instagram } from 'lucide-react';

const menuLinks = ['Home', 'Case Studies', 'Testimonials', 'Contact'];
const serviceLinks = ['Website Design', 'SEO', 'Meta Ads', 'Google Ads'];

const Footer: React.FC = () => {
  return (
    <footer className="bg-horizon-bg pt-6 pb-8 px-6">

      {/* Floating card */}
      <div className="max-w-4xl mx-auto bg-[#040405] border border-white/8 rounded-3xl px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">

          {/* Social */}
          <div>
            <p className="text-[#CD3D35] font-bold text-sm mb-4">Follow us:</p>
            <div className="flex gap-3">
              {[
                { Icon: Facebook,  href: '#' },
                { Icon: Youtube,   href: '#' },
                { Icon: Instagram, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/15 hover:border-white/20 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Menu */}
          <div>
            <p className="text-[#CD3D35] font-bold text-sm mb-4">Menu</p>
            <ul className="space-y-2">
              {menuLinks.map((item) => (
                <li key={item}>
                  <a href="#" className={`text-sm transition-colors ${item === 'Contact' ? 'text-white underline underline-offset-2' : 'text-gray-400 hover:text-white'}`}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="text-[#CD3D35] font-bold text-sm mb-4">Services</p>
            <ul className="space-y-2">
              {serviceLinks.map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-4xl mx-auto mt-4 flex items-center justify-between px-2">
        <p className="text-gray-600 text-xs">© {new Date().getFullYear()} Cortexa Labs Agency</p>
        <a href="#" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Privacy Policy</a>
      </div>

    </footer>
  );
};

export default Footer;
