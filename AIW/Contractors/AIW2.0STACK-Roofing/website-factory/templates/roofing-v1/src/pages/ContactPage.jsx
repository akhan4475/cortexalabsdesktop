import brandDNA from '../config/brand-dna';
import StickyNav from '../components/StickyNav';
import PageHero from '../components/PageHero';
import EstimateForm from '../components/EstimateForm';
import Footer from '../components/Footer';
import MobileStickyBar from '../components/MobileStickyBar';

export default function ContactPage() {
  return (
    <>
      <StickyNav />
      <main>
        <PageHero
          heading="Get in Touch"
          subtext="Call, text, or fill out the form. We respond the same day."
          breadcrumb="Contact"
        />

        <section className="bg-[var(--color-surface-alt)] py-section-gap-lg">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Contact details */}
              <div>
                <h2 className="font-heading font-bold uppercase text-3xl text-ink mb-6">Contact Info</h2>
                <div className="flex flex-col gap-5">
                  <div>
                    <p className="text-xs font-body font-semibold uppercase tracking-wide text-neutral mb-1">Phone</p>
                    <a
                      href={brandDNA.contact.phoneTelLink}
                      className="text-xl font-heading font-bold text-ink hover:text-primary transition-colors"
                    >
                      {brandDNA.contact.phone}
                    </a>
                  </div>
                  {brandDNA.contact.email && (
                    <div>
                      <p className="text-xs font-body font-semibold uppercase tracking-wide text-neutral mb-1">Email</p>
                      <a
                        href={`mailto:${brandDNA.contact.email}`}
                        className="text-base font-body text-ink hover:text-primary transition-colors"
                      >
                        {brandDNA.contact.email}
                      </a>
                    </div>
                  )}
                  {brandDNA.contact.address && (
                    <div>
                      <p className="text-xs font-body font-semibold uppercase tracking-wide text-neutral mb-1">Address</p>
                      <p className="text-base font-body text-neutral">{brandDNA.contact.address}</p>
                    </div>
                  )}
                  {brandDNA.contact.hours && (
                    <div>
                      <p className="text-xs font-body font-semibold uppercase tracking-wide text-neutral mb-1">Hours</p>
                      <p className="text-base font-body text-neutral">{brandDNA.contact.hours}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Inline form */}
              <EstimateForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileStickyBar />
    </>
  );
}
