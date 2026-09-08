import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/data/brand';
import { STUDIO_COUNT_WORD } from '@/lib/data/branches';

export const alt = `${BRAND_NAME} - ${BRAND_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * The Open Graph card - what a link to this site looks like when it is pasted
 * into Messenger, Viber, Facebook, iMessage or Slack.
 *
 * It carries the real mark rather than a drawn approximation of one. The logo
 * ships as `public/brand/826 logo.webp`, and Satori - the renderer behind
 * ImageResponse - does not decode WebP, so `public/og/826-logo.png` is a PNG
 * conversion of exactly that file, made once with sharp rather than at request
 * time. Read off disk and inlined as a data URI: Satori will not fetch a
 * relative URL, and there is no absolute one to give it until 826 confirms a
 * domain.
 *
 * NO CLAIMS ON THIS IMAGE. It is the most-shared surface the site has and the
 * least likely to be re-read, so it carries only the name, what the business
 * does, and a studio count that derives from the branch data. No warranty
 * period, no certification, no "500+ vehicles" - see lib/data/claims.ts.
 *
 * Drawn in the ink palette with the brand gold, which is the one place gold on
 * a dark field is unambiguously right. The hex values are literals because this
 * renders outside the browser: there is no CSS, no custom properties and no
 * tone system out here, so globals.css cannot reach it.
 */
export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), 'public/og/826-logo.png'));
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#08080a',
          padding: '72px 80px',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" width={380} height={100} />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 62,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: '#f4f4f5',
              maxWidth: 900,
            }}
          >
            {BRAND_TAGLINE}
          </div>

          {/* The one rule on the card, in brand gold, echoing the hairlines the
              site is built out of. */}
          <div style={{ display: 'flex', height: 3, width: 132, background: '#d4af37', marginTop: 40 }} />

          <div
            style={{
              display: 'flex',
              marginTop: 28,
              fontSize: 26,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#a1a1aa',
            }}
          >
            {STUDIO_COUNT_WORD} studios · Metro Manila
          </div>
        </div>
      </div>
    ),
    size,
  );
}
