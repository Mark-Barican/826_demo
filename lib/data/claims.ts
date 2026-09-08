/**
 * Third-party certifications, warranties and performance figures.
 *
 * WHY THIS FILE EXISTS
 *
 * The site was asserting a set of claims that nobody has confirmed 826 can
 * make, several of them naming other companies:
 *
 *   "Certified Stek & XPEL Pattern Cut"        was in Footer.tsx
 *   "Gyeon & Stek certified master technicians" was in branches.ts
 *   "Master Certification: Gyeon & Stek"        was in branches/[slug]/page.tsx
 *   "10-Year PPF Warranty" / "10-Year Certified" was in Footer.tsx, about
 *   "CRI 98 Certified"                          was in gallery.ts
 *   "500+ Vehicles" / "98% Optical Purity"      was in work/page.tsx
 *
 * Naming XPEL, Stek or Gyeon as a certifying body is a claim about *their*
 * programme, not 826's own work, and a warranty period is a contractual
 * promise. HeroSection.tsx already carries the correct instinct in a comment:
 * its copy is "deliberately free of warranty periods, coverage percentages and
 * durability figures" because 826 has published none. The rest of the site
 * contradicted it.
 *
 * HOW THIS WORKS
 *
 * `VERIFIED_CLAIMS` is the only list the UI reads, and it is empty. Components
 * render the block only when it has entries, so nothing appears until a claim
 * is confirmed. This mirrors `branches.ts`, where unpublished facts are `null`
 * with a comment rather than a plausible-looking guess.
 *
 * TO ENABLE A CLAIM: move it from PENDING_CONFIRMATION into VERIFIED_CLAIMS
 * once 826 can evidence it - a dealer/installer certificate number, the
 * manufacturer's warranty document, or the instrument's calibration record.
 */

export interface Claim {
  label: string;
  detail: string;
}

/** Rendered by the UI. Empty until 826 confirms something. */
export const VERIFIED_CLAIMS: Claim[] = [];

/**
 * Not rendered anywhere. Kept as the working list of what needs evidence, so
 * the questions are not lost now that the assertions are out of the markup.
 */
export const PENDING_CONFIRMATION: Array<Claim & { evidenceNeeded: string }> = [
  {
    label: 'PPF warranty period',
    detail: 'Previously stated as a 10-year warranty.',
    evidenceNeeded: 'The film manufacturer warranty document, and who honours it.',
  },
  {
    label: 'Stek / XPEL pattern-cut certification',
    detail:
      'Previously stated as "Certified Stek & XPEL Pattern Cut". Still unevidenced, '
      + 'and note that this is NOT the same question as the brand partnership below: '
      + 'Mark confirmed on 2026-09-06 that STEK, XPEL and LLumar are brand partners '
      + 'and their films are installed, which is a relationship 826 may state. '
      + 'Being certified BY one of them is a claim about their programme, and nobody '
      + 'has produced a certificate. The homepage band says "brand partners" and must '
      + 'not start saying "certified" - see lib/data/partners.ts.',
    evidenceNeeded: 'Installer or dealer certification from Stek and/or XPEL.',
  },
  {
    label: 'Gyeon certified technicians',
    detail: 'Previously stated as "Gyeon & Stek certified master technicians".',
    evidenceNeeded: 'Gyeon accreditation covering the named technicians.',
  },
  {
    label: 'Equipment and material brands',
    detail:
      'Mark removed the "What we work with" roster from /about on 2026-09-06 - it '
      + 'named Scangrip, Rupes, Gyeon, Stek and XPEL, which reads as a partnership '
      + 'or accreditation claim however it is captioned. The same names were also '
      + 'living in the data and still rendering: a "Gyeon & Stek certified master '
      + 'technicians" bullet on C5 Libis (removed outright - it was a certification '
      + 'claim), plus Scangrip and Rupes Bigfoot in branch and service copy (now '
      + 'described by what the equipment does instead).',
    evidenceNeeded:
      'RESOLVED FOR FILM BRANDS, 2026-09-06. Mark confirmed STEK, XPEL, LLumar and '
      + 'the studio own-brand film as brand partners and asked for them on the '
      + 'homepage, which they now are - see lib/data/partners.ts. Still open for '
      + 'everything else in the old roster: Scangrip, Rupes and Gyeon are equipment '
      + 'and chemical suppliers, not confirmed partners, and are still described by '
      + 'what they do rather than by name.',
  },
  {
    label: 'Lighting CRI rating',
    detail: 'Previously stated as CRI 96+ / CRI 98 certified.',
    evidenceNeeded: 'Fixture model and its published CRI, or a calibration record.',
  },
  {
    label: 'Vehicles completed',
    detail: 'Previously stated as 500+ vehicles.',
    evidenceNeeded: 'A job count from 826 records, with the period it covers.',
  },
  {
    label: 'Vehicle identifications in lib/data/gallery.ts',
    detail:
      'The gallery names specific models that do not match the photographs. ' +
      'Checked against the image files directly: /work/nissan/nissan-01.jpg is a ' +
      'Nissan Navara pickup but is captioned "Nissan GT-R R35"; /work/ford/ford-01.jpg ' +
      'is a Ranger Raptor pickup captioned "Ford Mustang 5.0 V8"; /work/tesla/* is a ' +
      'Model Y crossover captioned "Model 3 Performance"; /work/toyota/ holds several ' +
      'different vehicles, at least one of them a Mitsubishi, under one Land Cruiser ' +
      'caption. Folder names are not reliable either.',
    evidenceNeeded:
      'The real vehicle for each project from 826 job records. Not rewritten here, ' +
      'because replacing one set of guesses with another is no better.',
  },
  {
    label: 'Branch attribution in lib/data/gallery.ts',
    detail:
      'Projects are attributed to C5 Libis and other studios, but every photograph ' +
      'carries a burnt-in watermark reading "826 AUTO AESTHETIC & PROTECTION / SCT ' +
      'LIMBAGA QC", which suggests they are all Scout Limbaga jobs.',
    evidenceNeeded: 'Which studio actually did each job.',
  },
  {
    label: 'Correction percentage',
    detail: 'Previously stated as 98% optical purity / defect correction.',
    evidenceNeeded: 'How it is measured, or drop the figure and describe the process.',
  },
];
