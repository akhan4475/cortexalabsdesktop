import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './index.css';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import OwnerPage from './pages/OwnerPage';
import TeamPage from './pages/TeamPage';
import ReviewsPage from './pages/ReviewsPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import ServicesPage from './pages/ServicesPage';
import ServiceRoofReplacementPage from './pages/ServiceRoofReplacementPage';
import ServiceRoofRepairPage from './pages/ServiceRoofRepairPage';
import ServiceStormDamagePage from './pages/ServiceStormDamagePage';
import ServiceEmergencyRepairPage from './pages/ServiceEmergencyRepairPage';
import InsuranceClaimsPage from './pages/InsuranceClaimsPage';
import ServiceAreasPage from './pages/ServiceAreasPage';
import AreaPage from './pages/AreaPage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import CertificationsPage from './pages/CertificationsPage';
import FinancingPage from './pages/FinancingPage';
import FAQPage from './pages/FAQPage';
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

        <Route path="/about" element={<AboutPage />} />
        <Route path="/about/owner" element={<OwnerPage />} />
        <Route path="/about/team" element={<TeamPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/certifications" element={<CertificationsPage />} />
        <Route path="/financing" element={<FinancingPage />} />
        <Route path="/faq" element={<FAQPage />} />

        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/roof-replacement" element={<ServiceRoofReplacementPage />} />
        <Route path="/services/roof-repair" element={<ServiceRoofRepairPage />} />
        <Route path="/services/storm-damage" element={<ServiceStormDamagePage />} />
        <Route path="/services/emergency-roof-repair" element={<ServiceEmergencyRepairPage />} />
        <Route path="/insurance-claims" element={<InsuranceClaimsPage />} />

        <Route path="/insurance" element={<InsuranceClaimsPage />} />
        <Route path="/storm-damage" element={<ServiceStormDamagePage />} />
        <Route path="/estimate" element={<HomePage />} />

        <Route path="/service-areas" element={<ServiceAreasPage />} />
        <Route path="/areas/:citySlug" element={<AreaPage />} />
        <Route path="/service-areas/:citySlug" element={<AreaPage />} />

        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
