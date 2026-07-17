import StickyNav from '../components/StickyNav';
import PageHero from '../components/PageHero';
import BeforeAfterGallery from '../components/BeforeAfterGallery';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';

export default function GalleryPage() {
  return (
    <>
      <StickyNav />
      <main>
        <PageHero
          heading="Our Work"
          subtext="Before and after photos from real jobs in your area. No stock images."
          breadcrumb="Gallery"
        />
        <BeforeAfterGallery />
        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyBar />
    </>
  );
}
