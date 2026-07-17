import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './index.css';

import HomePage from './pages/HomePage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import ServiceDetailPage from './pages/ServiceDetailPage.jsx';
import PortfolioPage from './pages/PortfolioPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ReviewsPage from './pages/ReviewsPage.jsx';
import ServiceAreasPage from './pages/ServiceAreasPage.jsx';
import ServiceAreaDetailPage from './pages/ServiceAreaDetailPage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import BlogPostPage from './pages/BlogPostPage.jsx';
import FaqPage from './pages/FaqPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

/**
 * Scroll-to-hash on initial mount and on every navigation. Universal.
 */
function ScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    const id = hash.slice(1);
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [pathname, hash]);
  return null;
}

/**
 * Router shell. Module 2D fills {{PAGE_IMPORTS}} with the niche's
 * generated page imports and {{ROUTES}} with the niche's route list
 * derived from the niche sitemap.
 */
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/service-areas" element={<ServiceAreasPage />} />
          <Route path="/service-areas/:citySlug" element={<ServiceAreaDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
