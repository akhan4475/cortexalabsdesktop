import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './index.css';

import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import PoolCleaningPage from './pages/PoolCleaningPage';
import PoolMaintenancePage from './pages/PoolMaintenancePage';
import PoolRepairPage from './pages/PoolRepairPage';
import PoolOpeningClosingPage from './pages/PoolOpeningClosingPage';
import AboutPage from './pages/AboutPage';
import ReviewsPage from './pages/ReviewsPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import ServiceAreasPage from './pages/ServiceAreasPage';
import LocationDetailPage from './pages/LocationDetailPage';
import FAQPage from './pages/FAQPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import NotFoundPage from './pages/NotFoundPage';

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

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/pool-cleaning" element={<PoolCleaningPage />} />
        <Route path="/pool-maintenance" element={<PoolMaintenancePage />} />
        <Route path="/pool-repair" element={<PoolRepairPage />} />
        <Route path="/pool-opening-closing" element={<PoolOpeningClosingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/service-areas" element={<ServiceAreasPage />} />
        <Route path="/service-areas/:citySlug" element={<LocationDetailPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
