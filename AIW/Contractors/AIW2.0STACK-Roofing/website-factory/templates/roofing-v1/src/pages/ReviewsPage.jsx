import StickyNav from '../components/StickyNav';
import PageHero from '../components/PageHero';
import ReviewTiles from '../components/ReviewTiles';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';

export default function ReviewsPage() {
  return (
    <>
      <StickyNav />
      <main>
        <PageHero
          heading="What Our Customers Say"
          subtext="Real reviews from real homeowners. Every job is reviewed. We let the work speak."
          breadcrumb="Reviews"
        />
        <ReviewTiles />
        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyBar />
    </>
  );
}
