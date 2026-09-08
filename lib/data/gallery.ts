/**
 * NOTE ON VEHICLE NAMES (2026-09-06)
 *
 * Four entries named specific models that the photographs do not show. Checked
 * by opening the image files:
 *
 *   /work/tesla/*   a white Tesla Model Y crossover, not a Model 3 Performance
 *   /work/nissan/*  a Nissan Navara pickup (NAVARA decal visible), not a GT-R
 *   /work/ford/*    a Ford Ranger Raptor pickup (RAPTOR badge), not a Mustang
 *   /work/toyota/*  several different vehicles, one of them a Mitsubishi,
 *                   under a single Land Cruiser caption
 *
 * Those four now carry only what is visible in the frame. The remaining
 * two-wheeler entries look consistent with their photographs and are untouched.
 *
 * `branch` is still unverified for every entry - each photograph has a burnt-in
 * watermark reading "SCT LIMBAGA QC", which does not agree with the studios
 * assigned here, so the UI no longer prints it. See lib/data/claims.ts.
 */

export interface GalleryProject {
  id: string;
  title: string;
  category: 'ppf' | 'ceramic' | 'correction' | 'moto' | 'customer';
  categoryLabel: string;
  vehicle: string;
  service: string;
  branch: string;
  image: string;
  images?: string[];
  description: string;
  specs?: string[];
}

export const GALLERY_PROJECTS: GalleryProject[] = [
  // Tesla PPF
  {
    id: 'tesla-model-3-ppf',
    title: 'Tesla Crossover Full PPF Wrap',
    category: 'ppf',
    categoryLabel: 'Paint Protection Film',
    vehicle: 'Tesla crossover',
    service: 'Full Body Self-Healing TPU PPF + Ceramic Topcoat',
    branch: '826 C5 Libis',
    image: '/work/tesla/tesla-01.jpg',
    images: [
      '/work/tesla/tesla-01.jpg',
      '/work/tesla/tesla-02.jpg',
      '/work/tesla/tesla-03.jpg',
      '/work/tesla/tesla-04.jpg',
    ],
    description:
      'Complete vehicle protection wrap with hand-wrapped edges on all curved panels, mirrors, and aero pillars, finished with molecular hydrophobic coating.',
    specs: ['10-Mil Self-Healing Film', 'Wrapped Panel Edges', '10-Year Warranty'],
  },
  // Nissan GT-R / Z
  {
    id: 'nissan-gtr-ceramic',
    title: 'Nissan Navara Multi-Stage Correction & Ceramic Coating',
    category: 'ceramic',
    categoryLabel: 'Ceramic Coating',
    vehicle: 'Nissan Navara',
    service: '3-Stage Paint Correction + 9H Graphene Matrix',
    branch: '826 Scout Limbaga QC',
    image: '/work/nissan/nissan-01.jpg',
    images: [
      '/work/nissan/nissan-01.jpg',
      '/work/nissan/nissan-02.jpg',
      '/work/nissan/nissan-03.jpg',
      '/work/nissan/nissan-04.jpg',
    ],
    description:
      'Precision optical leveling of soft Japanese clear coat to remove 98% of swirls, locked under three layers of thermal-cured graphene nanocoating.',
    specs: ['9H+ Hardness Matrix', 'Brembo Caliper Ceramic', 'Shortwave IR Cured'],
  },
  // Toyota Land Cruiser & GR
  {
    id: 'toyota-landcruiser-armor',
    title: 'Full Front PPF & Ceramic Coating',
    category: 'ppf',
    categoryLabel: 'Paint Protection Film',
    vehicle: 'Sedan',
    service: 'Front Track PPF + High-Gloss Ceramic Body Armor',
    branch: '826 Ortigas Extension Cainta',
    image: '/work/toyota/toyota-01.jpg',
    images: [
      '/work/toyota/toyota-01.jpg',
      '/work/toyota/toyota-02.jpg',
      '/work/toyota/toyota-03.jpg',
      '/work/toyota/toyota-04.jpg',
      '/work/toyota/toyota-05.jpg',
      '/work/toyota/toyota-06.jpg',
      '/work/toyota/toyota-07.jpg',
      '/work/toyota/toyota-08.jpg',
    ],
    description:
      'High-impact off-road and highway rock chip barrier for the massive front fascia, grille surround, and mirrors, with hydrophobic body and wheel protection.',
    specs: ['Impact-Zone PPF Shield', 'Ceramic Glass & Rims', '7-Year Durability'],
  },
  // Ford Performance
  {
    id: 'ford-performance-detail',
    title: 'Ford Ranger Raptor Paint Correction',
    category: 'correction',
    categoryLabel: 'Paint Correction',
    vehicle: 'Ford Ranger Raptor',
    service: '2-Stage Machine Polish & Signature Sealant',
    branch: '826 C5 Libis',
    image: '/work/ford/ford-01.jpg',
    images: ['/work/ford/ford-01.jpg', '/work/ford/ford-02.jpg'],
    description:
      'Jewelling of deep metallic black factory paint to optical mirror perfection with high-temperature engine bay detail.',
    specs: ['Optical Depth Boost', 'Engine Bay Restored', 'CRI 98 Certified'],
  },
  // Vespa Classic & Modern
  {
    id: 'vespa-sprint-ppf',
    title: 'Vespa Sprint S Full Body Precision PPF Wrap',
    category: 'moto',
    categoryLabel: 'Motorcycle & Scooters',
    vehicle: 'Vespa Sprint S 150',
    service: 'Full Monocoque Body PPF + Ceramic Wheel & Leather Care',
    branch: '826 Batasan - San Mateo',
    image: '/work/vespa/vespa-01.jpg',
    images: [
      '/work/vespa/vespa-01.jpg',
      '/work/vespa/vespa-02.jpg',
      '/work/vespa/vespa-03.jpg',
      '/work/vespa/vespa-04.jpg',
      '/work/vespa/vespa-05.jpg',
    ],
    description:
      'Meticulous template design around curved metal monocoque chassis, glovebox, legshield, and chrome accents, protecting against city scuffs.',
    specs: ['Full Monocoque TPU Wrap', 'Leather Saddle Guard', '5-Year Warranty'],
  },
  // Lambretta Series
  {
    id: 'lambretta-v-special',
    title: 'Lambretta V200 Special Bespoke Protection',
    category: 'moto',
    categoryLabel: 'Motorcycle & Scooters',
    vehicle: 'Lambretta V200 Special',
    service: 'Multi-Stage Paint Enhancement + Ceramic Matrix',
    branch: '826 Batasan - San Mateo',
    image: '/work/lambretta/lambretta-01.jpg',
    images: [
      '/work/lambretta/lambretta-01.jpg',
      '/work/lambretta/lambretta-02.jpg',
      '/work/lambretta/lambretta-03.jpg',
      '/work/lambretta/lambretta-04.jpg',
      '/work/lambretta/lambretta-05.jpg',
    ],
    description:
      'Classic Italian profile with multi-stage paint refinement, ceramic exhaust heat guard, and waterproof vinyl seat nourishment.',
    specs: ['Custom Curve Templating', 'Exhaust Heat Ceramic', 'Hydrophobic Finish'],
  },
  // Honda Giorno
  {
    id: 'honda-giorno-retro',
    title: 'Honda Giorno+ Retro Urban Protection Wrap',
    category: 'moto',
    categoryLabel: 'Motorcycle & Scooters',
    vehicle: 'Honda Giorno+ 125',
    service: 'Full Body PPF Wrap & Floorboard Armor',
    branch: '826 Batasan - San Mateo',
    image: '/work/giorno/giorno-01.jpg',
    images: [
      '/work/giorno/giorno-01.jpg',
      '/work/giorno/giorno-02.jpg',
      '/work/giorno/giorno-03.jpg',
      '/work/giorno/giorno-04.jpg',
      '/work/giorno/giorno-05.jpg',
      '/work/giorno/giorno-06.jpg',
    ],
    description:
      'Complete high-gloss self-healing coverage over delicate retro fairings and front fascia to resist daily urban wear.',
    specs: ['Curved Fairing PPF', 'Self-Healing Tech', 'UV-Block Barrier'],
  },
  // Kawasaki Superbike
  {
    id: 'kawasaki-ninja-track',
    title: 'Kawasaki Ninja Performance PPF & High-Heat Ceramic',
    category: 'moto',
    categoryLabel: 'Motorcycle & Scooters',
    vehicle: 'Kawasaki Ninja ZX-Series',
    service: 'Track Fairing PPF + 1000°C Exhaust Ceramic',
    branch: '826 Batasan - San Mateo',
    image: '/work/kawasaki/kawasaki-01.jpg',
    images: [
      '/work/kawasaki/kawasaki-01.jpg',
      '/work/kawasaki/kawasaki-02.jpg',
      '/work/kawasaki/kawasaki-03.jpg',
    ],
    description:
      'Aerodynamic fairing and fuel tank protection against track debris and knee friction, with high-temperature ceramic on headers.',
    specs: ['High-Speed Impact PPF', '1000°C Exhaust Coat', 'Tank Grip Armor'],
  },
  // Honda PCX Series
  {
    id: 'honda-pcx-touring',
    title: 'Honda PCX Maxi-Scooter Full Protection',
    category: 'moto',
    categoryLabel: 'Motorcycle & Scooters',
    vehicle: 'Honda PCX 160',
    service: 'Full Body PPF & Smoked Headlight Protection',
    branch: '826 Batasan - San Mateo',
    image: '/work/pcx/pcx-01.jpg',
    images: ['/work/pcx/pcx-01.jpg', '/work/pcx/pcx-02.jpg', '/work/pcx/pcx-03.jpg'],
    description:
      'Complete fairing wrap including windscreen, luggage floorboards, and tail assembly.',
    specs: ['Windshield PPF', 'Full Cowl Wrap', 'Hydrophobic Finish'],
  },
  // Customer Deliveries
  {
    id: 'customer-delivery-01',
    title: 'Client Delivery & Studio Handoff Series',
    category: 'customer',
    categoryLabel: 'Client Handoffs',
    vehicle: 'Executive Sedans & SUVs',
    service: 'Final Quality Inspection & Handover',
    branch: 'All Flagship Studios',
    // customer-01/02/03 are scooter and motorcycle handovers, so they do not
    // belong under an "Executive Sedans & SUVs" label. The cover moves to 04
    // with them, which is the first car in the set.
    image: '/work/customers/customer-04.jpg',
    images: [
      '/work/customers/customer-04.jpg',
      '/work/customers/customer-05.jpg',
      '/work/customers/customer-06.jpg',
      '/work/customers/customer-07.jpg',
      '/work/customers/customer-08.jpg',
      '/work/customers/customer-09.jpg',
      '/work/customers/customer-10.jpg',
    ],
    description:
      'The moment of perfection: client handover under true daylight inspection illumination with full warranty certification.',
    specs: ['Warranty Certificate', 'Aftercare Consultation', 'Maintenance Kit'],
  },
];
