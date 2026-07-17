# 09 - Wireframe: Landscaping Template
Generated: 2026-06-30

ASCII wireframes per page type. Each section documents: layout variant, composition, brand-dna paths, SSIM region weight.

---

## Homepage (HomePage.jsx)

### TrustBar
```
Layout: full-bleed strip, 40px height
Variant: 3-column horizontal, desktop-only (hidden mobile)

+--license-left--+------phone-center------+--bbb-right--+
| Licensed &     |  📞 (555) 555-0100     |  [BBB logo] |
| Insured #XXXXX |                        |             |
+----------------+------------------------+-------------+

brand-dna paths:
  company.licenseNumber
  contact.phone
  contact.phoneTelLink
  trust_badges[0..1] (BBB badge)

SSIM region weight: 0.05 (strip, small)
threshold: 0.70
```

### NavBar
```
Layout: full-width sticky, transparent -> primary on scroll
Variant: logo-left / nav-center / cta-right

+--logo--+--Residential--Commercial--Portfolio--About--Blog--+--[phone]--[Get a Free Quote]--+

Mobile:
+--logo--+                                                    +--[☰]--+
  -> slide-in: full-screen dark overlay, nav items stacked, CTA button bottom

brand-dna paths:
  company.name
  company.shortName
  contact.phone
  contact.phoneTelLink
  copy.buttonText

SSIM region weight: 0.05
threshold: 0.70
```

### HeroSection
```
Layout: full-bleed, 100vh, left-text / right-image
Variant: asymmetric split (55/45), dark overlay

+--------------------------------------------------+
|  [EYEBROW: ⭐⭐⭐⭐⭐ N Google Reviews]            |
|                                                  |
|  H1: Transform Your                  [PROJECT    |
|      [City] Yard                      PHOTO      |
|                                       full bleed |
|  Subline: Responsive, on time,        behind     |
|  done right -- from first call        overlay]   |
|  to final cleanup.                              |
|                                                  |
|  [Get a Free Estimate]  [📞 Call (555) 000-0000] |
|                                                  |
|  ✓ Licensed & Insured  ✓ Same-Day Response  ✓ Free Estimates |
|                                                  |
|                    [chevron ↓]                   |
+--------------------------------------------------+

brand-dna paths:
  reviews.rating
  reviews.googleCount
  copy.hero.eyebrow
  copy.hero.headline
  copy.hero.subheadline
  copy.hero.imageAlt
  copy.buttonText
  copy.mobileCallLabel
  contact.phone
  contact.phoneTelLink
  copy.heroTrustChips[]
  previous_projects[0].filename (hero background)

SSIM region weight: 0.35
threshold: 0.65
above-fold: YES
```

### TrustBarInline
```
Layout: full-width band, 80px height, centered
Variant: 4-stat horizontal strip on light background

+--------+----------+----------+----------+
|  ⭐4.9  | 150+     | 20+ yrs  | Licensed |
| Rating | Reviews  | Serving  | & Insured|
+--------+----------+----------+----------+

brand-dna paths:
  reviews.rating
  reviews.totalReviewCount
  team.founder.yearsExp
  company.licenseNumber
  copy.heroTrustChips[]

SSIM region weight: 0.10
threshold: 0.70
```

### ServicesSection
```
Layout: 3-column card grid (desktop), 2-col (tablet), 1-col (mobile)
Variant: icon-card, 6 cards

+-----+-----+-----+
| 🌿  | 🪨  | 💧  |
| Landscape | Hardscaping | Irrigation |
| Design   |            |           |
+-----+-----+-----+
| 🌱  | 🌳  | 🌾  |
| Lawn | Tree  | Sod   |
| Maint| Care  | Install|
+-----+-----+-----+

Section heading (Fraunces): "Our Services"
Section subline: "Full-service landscaping for [City] homeowners"

brand-dna paths:
  copy.services.label
  copy.services.heading
  copy.services.body
  services[] { slug, name, iconPath, body }

SSIM region weight: 0.08
threshold: 0.60
```

### PortfolioSection
```
Layout: 2-column masonry grid (desktop), 1-col (mobile)
Variant: before/after split-card with flip interaction

+--[Before | After]--+--[Before | After]--+
| Project label      | Project label      |
| City, Service, Yr  | City, Service, Yr  |
+--------------------+--------------------+
+--[Before | After]--+--[Before | After]--+
|                    |                    |
+--------------------+--------------------+

Section heading: "Our Work"
Body: "Every project is unique. Here's what we've delivered."
Below grid: "Like what you see? Let's plan yours." + [Get a Free Estimate]

brand-dna paths:
  copy.gallery.label
  copy.gallery.heading
  copy.gallery.body
  previous_projects[] { filename, alt, caption, category }

SSIM region weight: 0.20
threshold: 0.60
above-fold: NO (reaches fold on desktop at ~1300px scroll)
```

### WhyChooseSection
```
Layout: 2-column grid, icon + heading + body per item (desktop), 1-col (mobile)
Variant: 4-card with leading icon

+--[icon] We Show Up On Time        --+--[icon] You See Results         --+
| We give you a time window and stick | Before/after photos of your yard  |
| to it. No waiting around all day.   | document every project we complete.|
+-------------------------------------+------------------------------------+
+--[icon] We Communicate             --+--[icon] No Mess Left Behind     --+
| One point of contact start to finish.| Full site cleanup when we're done.|
+--------------------------------------+----------------------------------+

brand-dna paths:
  copy.whyChoose.label
  copy.whyChoose.heading
  copy.whyChoose.body
  why_choose_us[] (array of title strings)

SSIM region weight: 0.05
threshold: 0.60
```

### ProcessSection
```
Layout: 3-step horizontal timeline (desktop), vertical stack (mobile)
Variant: numbered steps with connector line

  [1]————————[2]————————[3]
   |           |           |
Free      Custom       We Build
Consult   Design +     It Right
          Quote

Step descriptions below each number.
Badge: "Most clients are booked within 48 hours."

brand-dna paths:
  copy.process.label
  copy.process.heading
  copy.process.body
  copy.process.badgeText
  copy.process.badgeSubtext
  process_steps[] { n, title, description }

SSIM region weight: 0.05
threshold: 0.65
```

### ReviewsSection
```
Layout: 3-column card grid (desktop), 1-col (mobile)
Variant: Google-branded review cards

+--[G]--+--[G]--+--[G]--+
|⭐⭐⭐⭐⭐|⭐⭐⭐⭐⭐|⭐⭐⭐⭐⭐|
|"Text.."| "Text"| "Text"|
|-- Name | --Name| --Name|
+--------+-------+-------+

Heading: "[N] Happy Homeowners in [City]"
Subline + link: "See all reviews on Google"

brand-dna paths:
  copy.reviews.label
  copy.reviews.heading
  copy.reviews.body
  copy.reviews.summary
  reviews.rating
  reviews.googleCount
  reviews.items[] { author, rating, text, source }

SSIM region weight: 0.05
threshold: 0.65
```

### FounderSection
```
Layout: split 50/50 (desktop), stacked (mobile)
Variant: photo left, text right

+--[OWNER PHOTO]--+--"Meet [Name]"--+
|                 | Founded in [Yr] |
|                 | [Para 1]        |
|                 | [Para 2]        |
|                 |                 |
|                 | Vision: [text]  |
|                 | Mission: [text] |
+                 +-----------------+

brand-dna paths:
  copy.founder.label
  copy.founder.heading
  copy.founder.para1
  copy.founder.para2
  copy.founder.visionLabel
  copy.founder.vision
  copy.founder.missionLabel
  copy.founder.mission
  team.founder { name, displayName, title, yearsExp }
  team_group_photo (optional)

SSIM region weight: 0.04
threshold: 0.60
```

### ServiceAreasSection
```
Layout: 2-column (list left, map right) desktop, stacked mobile
Variant: city-pill list + embedded Google Map

+--City List--+--[Map embed]--+
| • Dallas    |               |
| • Plano     |  [MAP]        |
| • Allen     |               |
| • Frisco    |               |
| • McKinney  |               |
+-------------+---------------+

Heading: "Serving [City] and Surrounding Areas"
Body: "Not sure if we cover your neighborhood? Call us."

brand-dna paths:
  copy.serviceAreas.label
  copy.serviceAreas.heading
  copy.serviceAreas.body
  serviceAreas[] (array of city strings)
  contact.mapsEmbedUrl

SSIM region weight: 0.04
threshold: 0.55
```

### FaqSection
```
Layout: single column accordion, max-width 720px centered
Variant: 6 items, expand on click

Q: How much does landscaping cost in [City]?
Q: Do you offer free estimates?
Q: How long does a landscaping project take?
Q: Are you licensed and insured?
Q: Do you help with irrigation systems?
Q: What areas do you serve?

FAQPage schema markup on this section.

brand-dna paths:
  copy.faq.label
  copy.faq.heading
  faq[] { q, a }

SSIM region weight: 0.04
threshold: 0.60
```

### CtaFinalSection
```
Layout: 2-column (form left, contact info right) desktop, stacked mobile
Variant: dark background (primary), full-width

+--FORM--+--CONTACT--+
| Name   | 📞 (555)  |
| Phone  |           |
| Email  | 📧 email  |
| Zip    |           |
| Service| Hours:    |
| Project| M-F 7-6   |
| [Submit]|          |
| privacy |          |
+--------+-----------+

Heading (Fraunces, 36px, ink): "Get Your Free Landscape Estimate"
Subline: "We respond within 2 hours. No commitment, no hard sell."

brand-dna paths:
  copy.formHeader
  copy.formSubtext
  copy.submitButton
  copy.privacyLine
  copy.mobileCallLabel
  contact.phone
  contact.phoneTelLink
  contact.email
  hours.display[]

SSIM region weight: 0.15
threshold: 0.70
above-fold: NO (anchor target from all CTAs)
```

### FooterSection
```
Layout: 4-column (desktop), 2-col (tablet), 1-col (mobile)
Variant: dark (primary) background

+--Logo+Tagline--+--Nav--+--Services--+--Contact--+
| [Logo]         | Home  | Design     | 📞 phone  |
| "Tagline"      | About | Hardscaping| 📧 email  |
| [Social icons] | Port. | Irrigation | 📍 address|
|                | Blog  | Lawn Care  |           |
+----------------+-------+------------+-----------+
| License: #XXXXX | © 2026 [Company]. All Rights Reserved. |

brand-dna paths:
  company.name
  company.tagline
  company.licenseNumber
  contact.phone
  contact.email
  address.full
  social { facebook, instagram, linkedin }
  copy.copyright
  copy.footerCta
  services[] (first 4)
  credit { agency }

SSIM region weight: 0.04
threshold: 0.55
```

---

## MobileBottomBar (persistent overlay, mobile only)

```
+--[📞 Call Now]--+--[Get a Free Estimate]--+
  (tel: link)       (scrolls to #contact-form)

Fixed position, bottom: 0, full-width, 56px height.
Hides during business hours if chat widget is active.
During business hours: "Call Now" (accent fill) | "Get a Free Estimate" (outline).
Outside hours: "Get a Free Estimate" (accent fill) | "See Our Work" (outline).

brand-dna paths:
  copy.mobileCallLabel
  copy.buttonText
  contact.phoneTelLink
  businessHours { tz, open, close }
```

---

## Per-page wireframes

### ServicesPage (/services)
Sections: NavBar, HeroSection (services-focused headline), ServicesSection (expanded with body copy per service), CtaFinalSection, FooterSection

### PortfolioPage (/portfolio)
Sections: NavBar, PortfolioSection (full expanded, filter by service type), CtaFinalSection, FooterSection

### AboutPage (/about)
Sections: NavBar, FounderSection (expanded), WhyChooseSection, ReviewsSection, CtaFinalSection, FooterSection

### ServiceAreasPage (/service-areas)
Sections: NavBar, ServiceAreasSection (expanded, city list + map), CtaFinalSection, FooterSection

### ServiceAreaDetailPage (/service-areas/[city-slug])
Sections: NavBar, HeroSection (city-specific headline), ServicesSection, ReviewsSection (city-filtered), CtaFinalSection, FooterSection

### ServiceDetailPage (/services/[slug])
Sections: NavBar, HeroSection (service-specific headline), PortfolioSection (service-filtered), ProcessSection, FaqSection (service-specific), CtaFinalSection, FooterSection

### BlogPage (/blog)
Sections: NavBar, blog index grid, CtaFinalSection, FooterSection

### BlogPostPage (/blog/[slug])
Sections: NavBar, article, CtaFinalSection, FooterSection

### ContactPage (/contact)
Sections: NavBar, CtaFinalSection (full-width), ServiceAreasSection, FooterSection

### FaqPage (/faq)
Sections: NavBar, FaqSection (full expanded), CtaFinalSection, FooterSection

### NotFoundPage (/*)
Sections: NavBar, 404 message + primary CTA, FooterSection
