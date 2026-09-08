export interface ServiceDetail {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  heroImage: string;
  duration: string;
  warranty: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  process: { step: string; title: string; description: string }[];
  packages: { name: string; price: string; description: string; features: string[] }[];
}

export const SERVICES: ServiceDetail[] = [
  {
    slug: 'paint-protection-film',
    title: 'Paint Protection Film (PPF)',
    shortTitle: 'PPF Armor',
    tagline: 'A clear film over your paint that takes the rock chips and scratches instead of your car. Light marks heal themselves in the sun.',
    description:
      'Our flagship Paint Protection Film is the apex of automotive defense. Engineered with elastomeric optical clarity and micro-channel adhesive, each panel is precision digital-cut and hand-tucked around body seams in our climate-controlled cleanroom.',
    heroImage: '/work/tesla/tesla-01.jpg',
    duration: '3-5 Days',
    warranty: 'Up to 10-Year Limited Warranty',
    highlights: [
      'Full body, per panel or windshield - coverage is priced to what you need',
      'Transparent or coloured film, in high-gloss or satin finishes',
      'Instant thermal self-healing from swirl marks and wash scratches',
      'Advanced hydrophobic top-coat repels stains, tree sap, and road tar',
      'Edge-wrapped and hand-finished with zero razor contact on paintwork',
      'Films available: 826, XPEL, LLumar and Stek',
    ],
    specs: [
      { label: 'Film Thickness', value: '8.0-10.0 Mils TPU' },
      { label: 'Tensile Strength', value: '32 MPa High Tensile' },
      { label: 'Elongation at Break', value: '> 400%' },
      { label: 'Hydrophobic Contact Angle', value: '110° Superhydrophobic' },
      { label: 'UV Rejection Rate', value: '> 99% UV-A / UV-B Block' },
    ],
    process: [
      {
        step: '01',
        title: 'Precision Surface Decontamination',
        description: 'Multi-stage pH-neutral wash, iron fallout removal, and synthetic clay debarring to eliminate micro-particles.',
      },
      {
        step: '02',
        title: 'Single-Stage Paint Enhancement',
        description: 'Correction polishing to eliminate surface haze and ensure maximum gloss beneath the transparent film layer.',
      },
      {
        step: '03',
        title: 'Digital Plotting & Cleanroom Installation',
        description: 'Pattern plotted to exact millimeter CAD measurements, applied wet under sterile dust-free lighting.',
      },
      {
        step: '04',
        title: 'Contour Tucking & Edge Sealing',
        description: 'Edges are hand-wrapped behind panels where accessible, followed by infrared heat setting.',
      },
      {
        step: '05',
        title: 'Final Quality Inspection & Curing',
        description: '24-hour climate dwell, edge tension inspection under high-CRI inspection lamps.',
      },
    ],
    packages: [
      {
        name: 'Per Panel PPF',
        price: 'From ₱45,000',
        description:
          'Protection for the panels that actually get hit - hood, bumper, mirrors and the rest of the strike zone.',
        features: [
          'Full Front Bumper & Headlights',
          'Full Hood & Front Fenders',
          'Side Mirrors & Door Cups',
          'Any Single Panel Can Be Quoted On Its Own',
          'Self-Healing Topcoat',
        ],
      },
      {
        name: 'Full Body PPF',
        price: 'From ₱140,000',
        description:
          'Transparent or coloured film over every painted panel, protecting against scratches, chips and swirl marks.',
        features: [
          'All Painted Body Panels Covered',
          'Tucked & Wrapped Edges',
          'Headlights, Taillights & Gloss Pillars',
          'Transparent or Coloured Film',
          'Complimentary Ceramic Top Coat',
        ],
      },
      {
        name: 'Windshield PPF',
        price: 'Quoted on the vehicle',
        description:
          'An invisible shield over the windscreen, so stone strikes are far less likely to leave a chip or start a crack.',
        features: [
          'Full Windscreen Coverage',
          'Optically Clear - No Distortion',
          'Resists Chips & Crack Propagation',
          'Hydrophobic Surface In Rain',
          'Can Be Added To Any Other Package',
        ],
      },
    ],
  },
  {
    slug: 'ceramic-coating',
    title: 'Ceramic & Graphene Nanocoating',
    shortTitle: 'Ceramic Quartz',
    tagline: 'A hard glass-like layer on top of your paint. Water and dirt slide off, so washing is quicker and the shine lasts longer.',
    description:
      'A semi-permanent molecular bond that cures harder than factory clear coat, for a long-lasting high-gloss finish with real protection against water spots, UV and chemical damage. We apply ceramic and graphene coatings, self-healing graphene, and borophene for extra gloss and chemical resistance - and the same idea indoors, with a leather coating that keeps seats from staining, cracking and fading while leaving the hide feeling like hide.',
    heroImage: '/work/nissan/nissan-01.jpg',
    duration: '2-3 Days',
    warranty: '3 to 7 Years Warranty',
    highlights: [
      'Ceramic, graphene, self-healing graphene and borophene coatings available',
      'High-gloss finish that resists water spots, UV and chemical damage',
      'Hyper-slick surface creates extreme lotus-leaf water beading',
      'Interior leather coating protects against stains, cracking and fading',
      'Includes wheels-off coating and glass rain-repellent treatment',
    ],
    specs: [
      { label: 'Active Solids Content', value: '85% SiO2 + Reduced Graphene Oxide' },
      { label: 'Layer Hardness', value: '9H Pencil Scale Cured' },
      { label: 'Thermal Resistance', value: 'Up to 750°C' },
      { label: 'Chemical Resistance', value: 'pH 2 to pH 13' },
      { label: 'Durability', value: '36-84 Months with Maintenance' },
    ],
    process: [
      {
        step: '01',
        title: 'Deep Chemical Decontamination',
        description: 'Acid-free wheel deep clean, chemical iron dissolution, and solvent tar removal.',
      },
      {
        step: '02',
        title: '2-Stage Paint Correction',
        description: 'Compounding and finishing to remove 85-95% of swirls, holograms, and light scratches.',
      },
      {
        step: '03',
        title: 'Isopropanol Alcohol (IPA) Wipe Down',
        description: 'Complete removal of polishing oils to reveal bare clear coat for optimal ceramic adhesion.',
      },
      {
        step: '04',
        title: 'Multi-Layer Application',
        description: 'Base coat for molecular cross-linking, followed by graphene-infused hydrophobic top layer.',
      },
      {
        step: '05',
        title: 'Shortwave Infrared (IR) Curing',
        description: 'Controlled IR thermal baking across each panel to accelerate cross-linking and hardness.',
      },
    ],
    packages: [
      {
        name: 'Quartz Signature 3-Year',
        price: 'From ₱22,000',
        description: 'Multi-stage paint correction with dual-layer ceramic quartz protection.',
        features: [
          '2-Stage Paint Correction (85%+ Defect Removal)',
          'Dual Layer 9H Ceramic Base & Top Coat',
          'Windshield & Glass Hydrophobic Treatment',
          'Wheel Face & Caliper Coating',
          '3-Year Warranty Certificate',
        ],
      },
      {
        name: 'Graphene Diamond 5-Year',
        price: 'From ₱35,000',
        description: 'Graphene-infused matrix offering reduced water-spotting and superior thermal dissipation.',
        features: [
          '3-Stage Multi-Step Paint Correction',
          'Triple Layer Graphene Matrix Coating',
          'Wheels-Off Complete Barrel & Caliper Armor',
          'All Glass & Exterior Plastic Trim Sealed',
          '5-Year Warranty & First Year Service Free',
        ],
      },
      {
        name: 'Borophene Coating',
        price: 'Quoted on the vehicle',
        description:
          'Our most advanced coating chemistry, for the deepest gloss and the strongest chemical resistance of the three.',
        features: [
          'Multi-Stage Paint Correction First',
          'Borophene Layer Over A Ceramic Base',
          'Highest Gloss & Chemical Resistance We Offer',
          'Glass, Trim & Wheels Included',
          'Self-Healing Graphene Available On Request',
        ],
      },
    ],
  },
  {
    slug: 'nano-ceramic-tint',
    title: 'Nano Ceramic Tint',
    shortTitle: 'Ceramic Tint',
    tagline: 'Window film that keeps the heat and the glare out without making the glass hard to see through.',
    description:
      'Nano ceramic window film rejects heat and blocks ultraviolet light, cuts glare, and keeps the cabin comfortable on a Manila afternoon - while staying clear enough to see out of properly at night. Because the film is ceramic rather than metallic, it does not interfere with phone signal, GPS, radio or any of the sensors behind the glass.',
    heroImage: '/work/tesla/tesla-02.jpg',
    duration: '4-8 Hours',
    warranty: 'Film warranty per the manufacturer',
    highlights: [
      'Advanced heat rejection, so the cabin cools faster and stays cooler',
      'Blocks ultraviolet light that fades and cracks the interior',
      'Cuts glare from headlights and low sun without darkening your view',
      'Non-metallic, so phone signal, GPS and radio are unaffected',
      'Shade chosen with you, within what the law allows',
    ],
    specs: [
      { label: 'Film Type', value: 'Non-Metallic Nano Ceramic' },
      { label: 'Signal Interference', value: 'None - Passes GPS, Cellular, Radio' },
      { label: 'Coverage', value: 'Windscreen, Sides, Rear & Sunroof' },
      { label: 'Shades', value: 'Chosen at the studio' },
      { label: 'Turnaround', value: 'Same day on most vehicles' },
    ],
    process: [
      {
        step: '01',
        title: 'Glass Assessment & Shade Selection',
        description:
          'We look at the glass, talk through how dark you want to go, and agree the shade for each window before anything is cut.',
      },
      {
        step: '02',
        title: 'Deep Glass Decontamination',
        description:
          'Every pane is cleaned and scraped down to bare glass. Film traps whatever is left underneath it, permanently.',
      },
      {
        step: '03',
        title: 'Computer-Cut Patterns',
        description:
          'Film is plotted and cut to the exact shape of each window rather than trimmed against the glass in the car.',
      },
      {
        step: '04',
        title: 'Wet Application & Heat Shrinking',
        description:
          'Film is laid wet and heat-shrunk to the curve of the glass, then squeegeed out so no water or air is left behind.',
      },
      {
        step: '05',
        title: 'Cure & Handover',
        description:
          'A short cure before the windows are rolled down again. We tell you exactly how long to leave them alone.',
      },
    ],
    packages: [
      {
        name: 'Front Windscreen',
        price: 'Quoted on the vehicle',
        description:
          'The single biggest source of heat and glare in a car, and the one pane most people forget to do.',
        features: [
          'Full Windscreen Coverage',
          'Heat & UV Rejection',
          'Glare Reduction For Night Driving',
          'Clear Enough To See Through Properly',
        ],
      },
      {
        name: 'Full Vehicle Tint',
        price: 'Quoted on the vehicle',
        description: 'Every window on the car, shade agreed pane by pane.',
        features: [
          'Windscreen, Sides & Rear',
          'Sunroof Where Fitted',
          'Consistent Shade Across The Car',
          'No Signal Interference',
        ],
      },
    ],
  },
  {
    slug: 'paint-correction',
    title: 'Multi-Stage Paint Correction',
    shortTitle: 'Paint Correction',
    tagline: 'Machine polishing that removes the swirls and fine scratches already in your paint, so the colour looks deep again.',
    description:
      'Paint correction is the scientific refinement of automotive clear coat. Using digital ultrasonic depth gauges, LED daylight spectrum lights, and micro-abrasive compounds, we safely level imperfections while preserving clear coat thickness.',
    heroImage: '/work/toyota/toyota-01.jpg',
    duration: '2-4 Days',
    warranty: 'Permanent Defect Elimination',
    highlights: [
      'Digital paint depth gauge reading across 40+ body checkpoints',
      'Removes swirl marks, etching, buffer trails, and heavy scratches',
      'Preserves maximum clear coat structural integrity',
      'Prepared under high colour-rendering daylight studio lighting',
    ],
    specs: [
      { label: 'Defect Removal Rate', value: '90%-98% Optical Purity' },
      { label: 'Clear Coat Preserved', value: '> 95% Factory Thickness' },
      { label: 'Inspection Lighting', value: 'High-CRI 96+ Dual-Spectrum LED' },
      { label: 'Tooling', value: 'Dual-Action & Rotary Polishers' },
      { label: 'Abrasive Tech', value: 'Diminishing Micro-Abrasive Pastes' },
    ],
    process: [
      {
        step: '01',
        title: 'Paint Gauge Ultrasonic Depth Mapping',
        description: 'Documenting clear coat thickness per panel to determine safe compounding margins.',
      },
      {
        step: '02',
        title: 'Trim, Rubber & Emblem Masking',
        description: 'High-precision 3M automotive masking of all rubber gaskets, badges, and plastic edges.',
      },
      {
        step: '03',
        title: 'Stage 1: Heavy Defect Leveling',
        description: 'Wool or microfiber pad compounding to level deep scratches and oxidation.',
      },
      {
        step: '04',
        title: 'Stage 2: Medium Refining',
        description: 'Foam polishing to eliminate compounding micro-marring and restore color depth.',
      },
      {
        step: '05',
        title: 'Stage 3: Jewel Finishing Polish',
        description: 'Ultra-fine jewel pad burnishing to achieve razor-sharp mirror reflection and gloss.',
      },
    ],
    packages: [
      {
        name: 'Single Stage Enhancement',
        price: 'From ₱12,000',
        description: 'Removes light haze and minor wash swirls to dramatically boost gloss.',
        features: [
          '50% - 65% Defect Reduction',
          'High-Gloss Finishing Polish',
          'Polymer Sealant Application (6 months)',
          'Complete Exterior Decon Wash',
        ],
      },
      {
        name: 'Multi-Stage Concours Correction',
        price: 'From ₱24,000',
        description: 'Full multi-step compounding and jewelling to near-perfection.',
        features: [
          '90% - 98% Defect Removal',
          'Ultrasonic Paint Depth Report',
          'Orange Peel Smoothing (optional)',
          'Ready for PPF or Ceramic Coating',
        ],
      },
    ],
  },
  {
    slug: 'interior-detailing',
    title: 'Interior Rejuvenation & Leather Care',
    shortTitle: 'Interior Rejuvenation',
    tagline: 'A deep clean inside - seats, carpets and trim - with the leather fed and sealed so it does not dry out and crack.',
    description:
      'We treat luxury vehicle interiors with the discipline of bespoke upholstery restoration. From fine Nappa and semi-aniline leathers to Alcantara and carbon trim, every surface is sterilized, cleansed, and sealed in a natural, non-greasy matte factory finish.',
    heroImage: '/work/customers/customer-02.jpg',
    duration: '1-2 Days',
    warranty: 'Stain & UV Protection',
    highlights: [
      'Interior leather coating guards against stains, cracking and fading',
      'High-temperature dry vapor steam sterilization (kills 99.9% bacteria)',
      'pH-balanced leather cleansing that restores supple OEM matte touch',
      'Hydrophobic textile guard protects carpets and seats from liquid spills',
      'Zero greasy silicones, shiny residues, or synthetic perfumes',
    ],
    specs: [
      { label: 'Steam Temperature', value: '160°C Dry Vapor' },
      { label: 'Leather Treatment', value: 'Natural Collagen & UV Nourishment' },
      { label: 'Fabric Coating', value: 'Fluoropolymer Liquid Barrier' },
      { label: 'Finish', value: '100% OEM Natural Matte, Non-Slip' },
      { label: 'Odor Neutralization', value: 'Active Bio-Enzyme Ozonation' },
    ],
    process: [
      {
        step: '01',
        title: 'Dry Vacuum & High-Pressure Blowout',
        description: 'Extraction of fine dust from seat rails, vents, crevices, and carpeting.',
      },
      {
        step: '02',
        title: 'Dry Vapor Steam Extraction',
        description: 'Sterilization of headliners, carpets, and air conditioning ducts without over-wetting.',
      },
      {
        step: '03',
        title: 'Bespoke Leather Deep Cleaning',
        description: 'Gentle horsehair agitation lifting body oils and dye transfer from pores.',
      },
      {
        step: '04',
        title: 'Leather & Alcantara Barrier Treatment',
        description: 'Application of breathable ceramic leather guard to prevent abrasion and dye staining.',
      },
      {
        step: '05',
        title: 'Air Sanitization & Cabin Ozone',
        description: 'Complete removal of odors and biological contaminants for hospital-grade clean air.',
      },
    ],
    packages: [
      {
        name: 'Essential Interior Rejuvenation',
        price: 'From ₱8,500',
        description: 'Complete sanitization and conditioning for modern executive vehicles.',
        features: [
          'Full Steam Sanitization & Extraction',
          'Leather Cleansing & Conditioning',
          'Dashboard & Console UV Barrier',
          'Crystal Clear Glass Interior Polish',
        ],
      },
      {
        name: 'Master Leather & Ceramic Interior Armor',
        price: 'From ₱16,000',
        description: 'Comprehensive restorative treatment with full ceramic leather and fabric protection.',
        features: [
          'Deep Pore Dye Transfer Extraction',
          'Multi-Year Ceramic Leather Shield',
          'Fabric Hydrophobic Shield on Carpets/Mats',
          'Alcantara Restoration & Preservation',
          'Ozone Microbial Air Cycle',
        ],
      },
    ],
  },
  {
    slug: 'motorcycle-detailing',
    title: 'Bespoke Motorcycle Detailing & PPF',
    shortTitle: 'Moto PPF & Detail',
    tagline: 'The same paint protection and detailing work, sized for scooters, modern classics and big bikes.',
    description:
      'Motorcycles demand distinct detailing precision due to intricate fairings, exposed engine metallurgy, and vulnerable painted cowls. We provide custom-tailored PPF and high-heat ceramic coatings for Vespa, Lambretta, Honda, Kawasaki, Ducati, and custom builds.',
    heroImage: '/work/vespa/vespa-01.jpg',
    duration: '1-3 Days',
    warranty: '5-Year Moto PPF Warranty',
    highlights: [
      'Custom templated and hand-cut PPF for tight compound curves',
      'High-heat 1000°C ceramic coating for exhaust headers and engine blocks',
      'Chrome, brushed aluminum, and titanium metal polishing',
      'Leather saddle and vinyl seat waterproof protection',
    ],
    specs: [
      { label: 'Thermal Resistance', value: '1000°C Exhaust Ceramic' },
      { label: 'Film Flexibility', value: 'High Elastic TPU for Complex Curves' },
      { label: 'Target Platforms', value: 'Vespa, Lambretta, Superbikes, Cruisers' },
      { label: 'Corrosion Shield', value: 'Salt, Mud & Moisture Barrier' },
      { label: 'Finish Options', value: 'High Gloss or Satin Pearl' },
    ],
    process: [
      {
        step: '01',
        title: 'Fairing & Component Pre-Wash',
        description: 'Delicate hand wash with safe degreasing of chain, swingarm, and wheel spokes.',
      },
      {
        step: '02',
        title: 'Detailed Paint Correction',
        description: 'Precision 1-inch and 2-inch mini polishers removing scratches on fuel tanks and cowls.',
      },
      {
        step: '03',
        title: 'Custom PPF Installation',
        description: 'Applying self-healing film to front fender, leg shield, glove box, and rear cowls.',
      },
      {
        step: '04',
        title: 'High-Heat Ceramic Engine Coating',
        description: 'Sprayed ceramic protection on motor casing, headers, and rim spokes.',
      },
      {
        step: '05',
        title: 'Saddle & Trim Conditioning',
        description: 'Hydrophobic nourishment of genuine leather or marine-grade vinyl saddles.',
      },
    ],
    packages: [
      {
        name: 'Vespa & Scooter Complete PPF Wrap',
        price: 'From ₱25,000',
        description: 'Full body protection against daily city debris and parking scratches.',
        features: [
          'Full Leg Shield & Front Mudguard PPF',
          'Side Cowls & Glove Box Wrap',
          'Ceramic Coating on Wheels & Floorboard',
          'Saddle Weatherproof Treatment',
          '5-Year Film Warranty',
        ],
      },
      {
        name: 'Superbike & Cruiser Precision Armor',
        price: 'From ₱32,000',
        description: 'High-speed rock strike protection and 1000°C exhaust ceramic application.',
        features: [
          'Fuel Tank, Front Fairings & Windscreen PPF',
          'High-Heat Ceramic on Engine & Exhaust',
          'Carbon Fiber Component Sealing',
          'Full Rim & Sprocket Ceramic Coat',
        ],
      },
    ],
  },
];

/** How many disciplines 826 offers. Derived, so copy cannot drift from the data. */
export const SERVICE_COUNT = SERVICES.length;

/**
 * The same number as a word, for headings.
 *
 * Written out rather than counted at runtime because a heading reads better in
 * words, and because the list is short enough that a lookup is honest. Falls
 * back to the digit if the list ever outgrows it.
 */
const NUMBER_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];
export const SERVICE_COUNT_WORD = NUMBER_WORDS[SERVICE_COUNT] ?? String(SERVICE_COUNT);
