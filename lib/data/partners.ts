/**
 * The film brands 826 works with.
 *
 * Confirmed by Mark on 2026-09-06: STEK, XPEL and LLumar. 826's own film was
 * listed here too and was removed on 2026-09-07 - this band is about the
 * brands 826 carries, and the site is already 826's.
 *
 * WHAT THIS DOES AND DOES NOT SAY. It says 826 is a brand partner and installs
 * these films, which is 826's own relationship to state. It does not say 826
 * is a *certified* or *accredited* installer for any of them - that is a claim
 * about someone else's programme and it is still unevidenced, so it stays in
 * PENDING_CONFIRMATION in lib/data/claims.ts. Keep that distinction in the copy
 * here: "brand partners" and "films we install" are fine, "certified" is not,
 * until there is a certificate to point at.
 *
 * ON THE ARTWORK. Two of the three files supplied on 2026-09-07 needed work
 * before they could go on a dark band, and the originals are kept beside the
 * derived ones so the source is never lost:
 *
 *   stek.png -> stek-transparent.png
 *     The supplied PNG had NO alpha channel at all. Its transparency
 *     checkerboard was baked in as real #fff / #eee pixels, which is what an
 *     aggregator screenshot looks like rather than a brand kit export. On the
 *     ink band it would have rendered as a pale checkered rectangle. Alpha was
 *     rebuilt from pixel darkness and the result cropped to the artwork.
 *
 *   llumar-white-640w.webp -> llumar-trimmed.webp
 *     Sound file, but with ~30px of transparent padding on every side, which
 *     would have made `height` below mean something different for this one mark
 *     than for the others. Cropped to its bounding box.
 *
 * If a proper vector arrives from any of the three brand portals, drop it in
 * and repoint `logo` - nothing else needs to change.
 */

export interface Partner {
  /** The brand's name, written the way the brand writes it. */
  name: string;
  /** What 826 uses it for. Read out to screen readers, not shown. */
  role: string;
  /**
   * Path to the logo under `public/brand/partners/`.
   * `null` renders a typographic wordmark instead - never a stand-in logo.
   */
  logo: string | null;
  /**
   * Rendered height in px, at desktop. Tuned by eye, NOT set to one number for
   * all three, and this is the whole reason the row looks like a set.
   *
   * These three marks are built completely differently: STEK is a wide
   * horizontal lockup that carries "| AUTOMOTIVE" (about 9:1), XPEL is a
   * compact italic wordmark (about 4:1), and LLumar is stacked with a sun above
   * the name (about 1.8:1). Give them all the same box height and the letters
   * come out at wildly different sizes - LLumar's name shrinks to nothing while
   * STEK's runs away with the row. What has to match is the SIZE OF THE
   * LETTERING, so the boxes are sized to make that true.
   *
   * Only meaningful alongside `logo`.
   */
  height?: number;
}

export const PARTNERS: Partner[] = [
  {
    name: 'STEK',
    role: 'Paint protection film',
    logo: '/brand/partners/stek-transparent.png',
    height: 22,
  },
  {
    name: 'XPEL',
    role: 'Paint protection film',
    logo: '/brand/partners/XPEL.webp',
    height: 20,
  },
  {
    name: 'LLumar',
    role: 'Paint protection and window film',
    logo: '/brand/partners/llumar-trimmed.webp',
    height: 36,
  },
];
