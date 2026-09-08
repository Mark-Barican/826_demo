export interface BranchDetail {
  slug: string;
  name: string;
  badge: string;
  tagline: string;
  address: string;
  /** The landmark the branch sits inside, as 826 states it. */
  locatedIn: string | null;
  city: string;
  /** Published mobile number, as supplied by 826. */
  phone: string;
  /** null until 826 publishes a real inbox - never a plausible-looking guess. */
  email: string | null;
  /**
   * This studio's own Facebook page. Supplied by Mark on 2026-09-07.
   *
   * Every studio runs its own page, which is why this lives on the branch
   * rather than in one global list. The Quezon City page doubles as the
   * business-wide one in the footer - see SOCIAL in lib/data/brand.ts, and keep
   * the two in step if it ever changes.
   *
   * Still `string | null` on purpose: a new studio opens before its page
   * exists, and the UI renders the link only when there is one.
   */
  facebook: string | null;
  hours: { days: string; time: string }[];
  /** null where no photograph of the branch exists. Never another branch's. */
  image: string | null;
  mapsUrl: string;
  /**
   * Map pin. `precision: 'area'` means this locates the neighbourhood, not the
   * doorway - 826 has not published street addresses, so these must not be
   * presented as exact. Replace with surveyed coordinates when available.
   */
  coords: { lat: number; lng: number; precision: 'area' | 'exact' };
  description: string;
  capacity: string;
  features: string[];
  cleanroomSpecs: { label: string; value: string }[];
}

export const BRANCHES: BranchDetail[] = [
  {
    slug: 'c5-libis',
    name: '826 C5 Libis',
    badge: 'Flagship Studio',
    tagline: 'Cleanroom PPF installation suite and exotic automotive protection center.',
    address: 'C5, Libis, Quezon City',
    locatedIn: 'Inside Dampa sa Libis Restaurant',
    city: 'Quezon City',
    phone: '0956 330 8477',
    email: null,
    facebook: 'https://www.facebook.com/826C5Libis/',
    hours: [
      { days: 'Monday-Saturday', time: '8:00 AM-6:00 PM' },
      { days: 'Sunday', time: 'By Prior Appointment' },
    ],
    image: '/work/branches/c5-libis.jpg',
    mapsUrl: 'https://maps.google.com/?q=C5+Libis+Quezon+City',
    coords: { lat: 14.6221, lng: 121.0792, precision: 'area' },
    description:
      'Our C5 Libis flagship is engineered specifically for uncompromising paint protection film and supercar preservation. Featuring high-grade positive-pressure cleanroom bays, dedicated high-CRI inspection lighting, and a private client lounge overlooking the detailing floor.',
    capacity: '8 Active Indoor Detailing Bays',
    features: [
      'Positive-pressure HEPA filtered cleanroom bays',
      'In-house high-precision Graphtec digital plotter suite',
      'Secured climate-controlled overnight vehicle staging',
      'VIP lounge with espresso bar & high-speed Wi-Fi',
    ],
    cleanroomSpecs: [
      { label: 'Air Filtration', value: 'Dual-Stage HEPA Positive Pressure' },
      { label: 'Lighting Temperature', value: '5500K True Daylight Spectrum (CRI > 96)' },
      { label: 'Water Purification', value: '4-Stage Deionized & Reverse Osmosis' },
      { label: 'Security', value: '24/7 CCTV & Monitored Access Control' },
    ],
  },
  {
    slug: 'scout-limbaga-qc',
    name: '826 Scout Limbaga',
    badge: 'Central Metro Studio',
    tagline: 'Precision paint restoration and multi-stage ceramic coating center.',
    address: 'Scout Limbaga Street, Quezon City',
    locatedIn: null,
    city: 'Quezon City',
    phone: '0919 572 8529',
    email: null,
    facebook: 'https://www.facebook.com/826quezoncity/',
    hours: [
      { days: 'Monday-Saturday', time: '8:00 AM-6:00 PM' },
      { days: 'Sunday', time: 'Closed' },
    ],
    image: '/work/branches/scout-limbaga-qc.jpg',
    mapsUrl: 'https://maps.google.com/?q=Scout+Limbaga+Quezon+City',
    coords: { lat: 14.6335, lng: 121.0331, precision: 'area' },
    description:
      'Located in the heart of Quezon City, our Scout Limbaga studio specializes in intensive multi-stage paint correction, concours prep, and nano-ceramic applications. Built with bespoke LED diffuse arrays to reveal the finest paint imperfections.',
    capacity: '6 Dedicated Correction & Coating Bays',
    features: [
      'Diffused LED inspection ceiling arrays',
      'Comprehensive ultrasonic paint thickness profiling',
      'Shortwave infrared thermal baking lamps',
      'Full interior deep-steam sanitization suite',
    ],
    cleanroomSpecs: [
      { label: 'Curing Tech', value: 'Shortwave Infrared (IR) Mobile Arrays' },
      { label: 'Lighting Rig', value: '360° Multi-Angle CRI 98 Inspection LEDs' },
      { label: 'Wash Bay Drain', value: 'Oil-Water Separator System' },
      { label: 'Security', value: 'Secured Indoor Bay Enclosure' },
    ],
  },
  {
    slug: 'ortigas-extension-cainta',
    name: '826 Ortigas Extension',
    badge: 'East Metro Facility',
    tagline: 'Full-service detailing, ceramic protection, and SUV fleet specialist.',
    address: 'Ortigas Extension, Cainta, Rizal',
    locatedIn: 'Inside OAX Complex',
    city: 'Cainta / East Metro',
    phone: '0968 230 1740',
    email: null,
    facebook: 'https://www.facebook.com/826AutoAesthetic/',
    hours: [
      { days: 'Monday-Saturday', time: '8:00 AM-6:00 PM' },
      { days: 'Sunday', time: '9:00 AM-4:00 PM' },
    ],
    image: '/work/branches/ortigas-extension-cainta.jpg',
    mapsUrl: 'https://maps.google.com/?q=Ortigas+Extension+Cainta',
    coords: { lat: 14.5793, lng: 121.1221, precision: 'area' },
    description:
      'Conveniently situated along the Ortigas Extension corridor, this high-capacity facility caters to large luxury SUVs, high-mileage daily drivers, and performance fleets seeking multi-year ceramic shields and paint rejuvenation.',
    capacity: '10 Detailing & Wash Bays',
    features: [
      'High-clearance bays accommodating lifted SUVs & commercial luxury vans',
      'Dual undercarriage pressure wash sanitization bay',
      'Fast-track ceramic express maintenance lanes',
      'Comfortable air-conditioned customer workspace',
    ],
    cleanroomSpecs: [
      { label: 'Bay Clearance', value: '4.2 Meters Overhead Clearance' },
      { label: 'Water Pressure', value: 'Triplex Plunger 180 Bar System' },
      { label: 'Air Supply', value: 'Dry-Air Compressed Pneumatic Lines' },
      { label: 'Capacity', value: 'High Throughput Studio Flow' },
    ],
  },
  {
    slug: 'batasan-san-mateo',
    name: '826 Batasan - San Mateo',
    badge: 'North East Hub & Moto Suite',
    tagline: 'Specialized motorcycle PPF, ceramic detailing, and vehicle preservation.',
    address: '826 Batasan-San Mateo',
    locatedIn: null,
    city: 'San Mateo, Rizal',
    phone: '0928 663 7984',
    email: null,
    facebook: 'https://www.facebook.com/826CoatingAndProtection/',
    hours: [
      { days: 'Monday-Saturday', time: '8:00 AM-6:00 PM' },
      { days: 'Sunday', time: 'By Prior Appointment' },
    ],
    image: '/work/branches/batasan-san-mateo.jpg',
    mapsUrl: 'https://maps.google.com/?q=Batasan+San+Mateo+Road',
    coords: { lat: 14.6968, lng: 121.1012, precision: 'area' },
    description:
      'Our Batasan-San Mateo studio features a dedicated two-wheel cleanroom bay alongside automotive detailing bays. Equipped with specialized motorcycle lifts, high-heat ceramic baking fixtures, and custom templating tables for scooters and superbikes.',
    capacity: '5 Automotive Bays + 4 Motorcycle Lift Bays',
    features: [
      'Pneumatic motorcycle service lifts and wheel clamps',
      'High-heat ceramic exhaust & motor curing ovens',
      'Dedicated Vespa & modern classic moto detailing zone',
      'Full automotive paint correction and PPF installation',
    ],
    cleanroomSpecs: [
      { label: 'Moto Lifts', value: 'Heavy-Duty Hydraulic Locking Platforms' },
      { label: 'Metal Polishing', value: 'Rotary Felt & Ultrasonic Degreasing' },
      { label: 'Exhaust Cure', value: 'Localized High-Heat Radiant Emitters' },
      { label: 'Security', value: 'Gated Perimeter with 24/7 Guards' },
    ],
  },
  {
    // Supplied by 826 on 2026-09-03 and previously absent from this file.
    // Everything here is either given or left empty: no photograph exists for
    // this branch, and no equipment, capacity or certification claims have been
    // published for it, so none are asserted.
    slug: 'dasmarinas-cavite',
    name: '826 Dasmariñas',
    badge: 'Cavite Studio',
    tagline: 'Paint protection, ceramic coating and detailing for Cavite and the south.',
    address: 'Dasmariñas, Cavite',
    locatedIn: 'Inside Aguinaldo Complex',
    city: 'Dasmariñas, Cavite',
    phone: '0936 970 8211',
    email: null,
    facebook: 'https://www.facebook.com/826AutoAestheticAndProtection/',
    hours: [],
    image: null,
    mapsUrl: 'https://maps.google.com/?q=Aguinaldo+Complex+Dasmarinas+Cavite',
    coords: { lat: 14.3294, lng: 120.9367, precision: 'area' },
    description:
      'The 826 studio serving Cavite and the southern corridor, inside the Aguinaldo Complex in Dasmariñas.',
    capacity: '',
    features: [],
    cleanroomSpecs: [],
  },
];

/**
 * The branch the site falls back to when no branch is in context (header,
 * footer, booking form).
 *
 * 826 has not published a head-office or concierge line - the previous
 * '+63 (02) 8826-5424' and 'concierge@826detailing.ph' were invented. Scout
 * Limbaga is used because it is the studio named in the watermark burned into
 * 826's own job photographs. Confirm this is the right number to lead with.
 */
export const PRIMARY_BRANCH =
  BRANCHES.find((b) => b.slug === 'scout-limbaga-qc') ?? BRANCHES[0];

/**
 * The number of studios, derived rather than written out.
 *
 * Dasmarinas was added to BRANCHES on 2026-09-03 and eleven separate places
 * across the site went on claiming "four" / "4 studios" - the homepage, the
 * footer, the header drawer, the philosophy stats bar, and the about, work and
 * contact pages. Several grids were also sized `lg:grid-cols-4`, so the fifth
 * studio rendered as an orphan. Import these instead of typing a number.
 */
export const STUDIO_COUNT = BRANCHES.length;

const COUNT_WORDS = [
  'Zero', 'One', 'Two', 'Three', 'Four', 'Five',
  'Six', 'Seven', 'Eight', 'Nine', 'Ten',
] as const;

/** Title-case English word for STUDIO_COUNT, for use in prose headings. */
export const STUDIO_COUNT_WORD: string =
  COUNT_WORDS[STUDIO_COUNT] ?? String(STUDIO_COUNT);
