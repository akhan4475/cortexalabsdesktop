import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Analytics from './components/Analytics';
import ComparisonSection from './components/ComparisonSection';
import Process from './components/Process';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BookingPage from './components/BookingPage';
import LoginPage from './components/LoginPage';
import CRM from './components/crm/CRM';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'booking' | 'login' | 'crm'>('home');
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);

  // Handle scroll after view change to 'home'
  useEffect(() => {
    if (view === 'home' && scrollTarget) {
      // Small timeout to ensure DOM is ready and rendered
      const timer = setTimeout(() => {
        if (scrollTarget === 'top') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const element = document.getElementById(scrollTarget);
            if (element) {
                const headerOffset = 100;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
        
                window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
                });
            }
        }
        setScrollTarget(null); // Reset
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [view, scrollTarget]);

  const handleNavigation = (sectionId: string) => {
    if (view !== 'home') {
        setView('home');
        setScrollTarget(sectionId);
    } else {
        // Already on home
        if (sectionId === 'top') {
             window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const element = document.getElementById(sectionId);
            if (element) {
                const headerOffset = 100;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
        
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }
  };
  
  const handleBookClick = () => {
      setView('booking');
      window.scrollTo(0, 0);
  };

  const handleLoginClick = () => {
      setView('login');
      window.scrollTo(0, 0);
  }

  const handleLoginSuccess = () => {
      setView('crm');
      window.scrollTo(0, 0);
  }
  
  const handleLogout = () => {
      setView('home');
      window.scrollTo(0, 0);
  }

  // Render logic
  if (view === 'crm') {
      return <CRM onLogout={handleLogout} />;
  }

  if (view === 'login') {
      return <LoginPage onBack={() => setView('home')} onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-horizon-bg text-white overflow-x-hidden font-sans selection:bg-horizon-accent selection:text-horizon-bg">
      <Navbar onNavigate={handleNavigation} onLoginClick={handleLoginClick} />
      <main>
        {view === 'home' ? (
            <>
                <Hero 
                    onBookConsultation={handleBookClick} 
                    onViewDashboard={() => handleNavigation('analytics')}
                />
                <Process />
                <Services />
                <Analytics />
                <ComparisonSection />
                <Contact />
            </>
        ) : (
            <BookingPage onBack={() => { setView('home'); window.scrollTo(0, 0); }} />
        )}
      </main>
      {view === 'home' && <Footer />}
    </div>
  );
};

export default App;