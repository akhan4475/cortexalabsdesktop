import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface BookingPageProps {
  onBack: () => void;
}

const BookingPage: React.FC<BookingPageProps> = ({ onBack }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen flex flex-col items-center bg-horizon-bg relative animate-in fade-in duration-500">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        <button 
          onClick={onBack}
          className="mb-8 px-6 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-2 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
        
        <div className="w-full bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
            {/* Calendly inline widget begin */}
            <div 
                className="calendly-inline-widget" 
                data-url="https://calendly.com/horizondigitalagent/horizon-digital?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=000000&text_color=ffffff&primary_color=3ece8d" 
                style={{ minWidth: '320px', height: '700px' }} 
            />
            {/* Calendly inline widget end */}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;