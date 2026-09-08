export interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  popular?: boolean;
  warranty: string;
  duration: string;
  prices: {
    sedan: string;
    suv: string;
    largeSuv: string;
    supercar: string;
    motorcycle?: string;
  };
  inclusions: string[];
  recommendedFor: string;
}

export interface AddOnService {
  name: string;
  price: string;
  description: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'single-stage-enhance',
    name: 'Essential Paint Polish & Glass Seal',
    tagline: 'One polishing pass to take out light swirls, then a sealant so the shine holds for about six months.',
    warranty: '6-Month Durability',
    duration: '1-2 Days',
    prices: {
      sedan: '₱12,500',
      suv: '₱14,500',
      largeSuv: '₱16,500',
      supercar: '₱18,000',
      motorcycle: '₱7,500',
    },
    inclusions: [
      'Multi-stage pH-neutral decon wash & iron fallout removal',
      'Synthetic clay bar decontamination',
      '1-Stage machine polish (50-65% defect removal)',
      'High-solids synthetic paint sealant',
      'Windshield rain-repellent treatment',
      'Tire dressing & exterior plastic rejuvenation',
    ],
    recommendedFor: 'A newish car with light wash marks, or a yearly tidy-up.',
  },
  {
    id: 'signature-ceramic-3yr',
    name: 'Signature Quartz Ceramic 9H (3-Year)',
    tagline: 'Full polish to remove existing scratches, then two layers of ceramic coating to lock the finish in.',
    popular: true,
    warranty: '3-Year Warranty Certificate',
    duration: '2-3 Days',
    prices: {
      sedan: '₱24,000',
      suv: '₱28,000',
      largeSuv: '₱32,000',
      supercar: '₱36,000',
      motorcycle: '₱16,000',
    },
    inclusions: [
      'Ultrasonic paint depth gauge report',
      '2-Stage paint correction (85-90% defect removal)',
      'Dual-layer 9H SiO2 Ceramic base & top coat',
      'All exterior glass hydrophobic nanocoat',
      'Wheel face & brake caliper ceramic protection',
      'Shortwave infrared (IR) thermal panel bake',
      'Free 6-month inspection and top-up wash',
    ],
    recommendedFor: 'Anyone who wants the car to stay glossy and be easy to wash for the next few years.',
  },
  {
    id: 'graphene-diamond-5yr',
    name: 'Diamond Graphene Matrix (5-Year)',
    tagline: 'Our longest-lasting coating. Three layers, slicker to wash, and it copes better with heat and dark paint.',
    warranty: '5-Year Warranty Certificate',
    duration: '3 Days',
    prices: {
      sedan: '₱38,000',
      suv: '₱42,000',
      largeSuv: '₱48,000',
      supercar: '₱55,000',
      motorcycle: '₱22,000',
    },
    inclusions: [
      '3-Stage concours paint correction (95%+ optical clarity)',
      'Triple-layer Reduced Graphene Oxide (rGO) matrix',
      'Wheels-off full barrel & suspension ceramic coat',
      'Complete interior steam sterilization & leather guard',
      'All exterior trim & headlight UV shield',
      'Annual maintenance inspection & complimentary reload',
    ],
    recommendedFor: 'Dark-coloured cars, and anything parked outside in the heat.',
  },
  {
    id: 'ppf-front-track',
    name: 'Front Track Pack Self-Healing PPF',
    tagline: 'Clear film on the parts that get hit most - bonnet, bumper, mirrors - where stone chips actually land.',
    warranty: '5-Year Limited Film Warranty',
    duration: '2-3 Days',
    prices: {
      sedan: '₱48,000',
      suv: '₱55,000',
      largeSuv: '₱62,000',
      supercar: '₱68,000',
    },
    inclusions: [
      'Full front bumper & splitter',
      'Full hood & front fenders (wrapped edges where accessible)',
      'Side mirrors, headlights & A-pillars',
      'Door edge guards & door cup protection',
      'Single-stage paint prep polish beneath film',
      'Ceramic coating top coat applied over entire vehicle',
    ],
    recommendedFor: 'Daily highway drivers who keep picking up chips on the front end.',
  },
  {
    id: 'ppf-full-armor',
    name: 'Full Body Armor PPF (10-Year)',
    tagline: 'Clear film over every painted panel, with the edges wrapped by hand so you cannot see where it ends.',
    popular: true,
    warranty: '10-Year Limited Warranty',
    duration: '4-5 Days',
    prices: {
      sedan: '₱145,000',
      suv: '₱165,000',
      largeSuv: '₱185,000',
      supercar: '₱195,000',
      motorcycle: '₱28,000',
    },
    inclusions: [
      '100% painted body panel coverage with self-healing TPU',
      'Wrapped and tucked edges on all accessible seams',
      'Headlights, taillights, gloss black B/C pillars, and rocker panels',
      'Full multi-stage paint prep polishing',
      'Graphene ceramic top coat over all film surfaces',
      'Wheels-off ceramic coating & full interior detail included',
      'Annual inspection & complimentary edge sealing checks',
    ],
    recommendedFor: 'Owners keeping the car long term who want the original paint untouched underneath.',
  },
];

export const ADD_ON_SERVICES: AddOnService[] = [
  {
    name: 'Windshield Armor Protection Film (WPF)',
    price: '₱18,000',
    description: 'Optically clear 4-mil outer glass film preventing costly rock chips and pitted windshields.',
  },
  {
    name: 'Wheels-Off Complete Ceramic Detailing',
    price: '₱8,500',
    description: 'Wheels removed, deep acid-free decon, full barrel & caliper 9H ceramic coating.',
  },
  {
    name: 'Ceramic Leather & Alcantara Interior Shield',
    price: '₱12,000',
    description: 'Deep dye-transfer extraction, factory matte nourishment, and hydrophobic barrier.',
  },
  {
    name: 'Engine Bay Concours Steam & Ceramic Seal',
    price: '₱4,500',
    description: 'Dry vapor steam cleaning of plastics and hoses, dressed in natural satin anti-static seal.',
  },
  {
    name: 'Headlight & Taillight Tinted / Clear PPF',
    price: '₱6,000',
    description: 'Protects polycarbonate lenses from yellowing UV damage, rock pits, and sandblast hazing.',
  },
];

export const PRICING_FAQS = [
  {
    q: 'How does self-healing Paint Protection Film (PPF) work?',
    a: 'Our TPU films feature an elastomeric polyurethane top layer that flows back into its original lattice structure when exposed to heat (sunlight, warm water, or a heat gun), instantly eliminating swirl marks, wash marring, and light scratches.',
  },
  {
    q: 'What is the difference between Ceramic Coating and PPF?',
    a: 'Ceramic Coating provides extreme gloss, chemical resistance, UV protection, and self-cleaning water beading, but cannot stop physical rock chips. PPF is a thick physical barrier (8-10 mils) engineered specifically to absorb high-velocity impact from gravel and rocks.',
  },
  {
    q: 'How long does a full PPF or Ceramic installation take?',
    a: 'A Full Body PPF requires 4 to 5 working days in our climate-controlled cleanroom to allow proper wet application, edge drying, and thermal curing. Ceramic coatings typically require 2 to 3 days including paint correction and infrared baking.',
  },
  {
    q: 'Can I wash my car immediately after picking it up?',
    a: 'We recommend waiting 7 days before the first wash to allow the adhesives or coating cross-links to reach full chemical hardness. We provide a full aftercare briefing and guidance booklet upon delivery.',
  },
];

/**
 * Vehicle segments, and the single source of truth for them.
 *
 * This list existed twice - inline in `PricingCalculator` and again in
 * `BookingForm`, with different labels in each, so the segment a customer chose
 * on the pricing page was described differently on the booking form. The keys
 * are the same keys used by `PricingTier['prices']`.
 *
 * The example vehicles are illustrations of each class, not claims about work
 * 826 has done.
 */
export type VehicleSegmentId = keyof PricingTier['prices'];

export interface VehicleSegment {
  id: VehicleSegmentId;
  label: string;
  examples: string;
}

export const VEHICLE_SEGMENTS: readonly VehicleSegment[] = [
  { id: 'sedan', label: 'Sedan / hatch', examples: 'Civic, Model 3, C-Class, 3-Series, Golf' },
  { id: 'suv', label: 'Crossover / mid-size SUV', examples: 'Model Y, RAV4, CR-V, GLC, X3, Macan' },
  { id: 'largeSuv', label: 'Full-size SUV / pickup', examples: 'Land Cruiser, Patrol, Ranger Raptor, Navara, Defender' },
  { id: 'supercar', label: 'Supercar / exotic', examples: 'GT-R, 911, Ferrari, Lamborghini, McLaren' },
  { id: 'motorcycle', label: 'Motorcycle / scooter', examples: 'Vespa, Lambretta, superbike, maxi-scooter' },
];

/** Narrow an untrusted string (a URL query value) to a real segment id. */
export function toVehicleSegment(
  value: string | null | undefined,
): VehicleSegmentId | null {
  const hit = VEHICLE_SEGMENTS.find((s) => s.id === value);
  return hit ? hit.id : null;
}
