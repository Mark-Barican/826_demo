import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { BRAND_NAME } from '@/lib/data/brand';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';
export const alt = BRAND_NAME;

/**
 * The iOS home-screen icon.
 *
 * `app/favicon.ico` already covers the browser tab properly - it is a real
 * multi-size .ico carrying 16, 32, 48 and 256px - so this is the piece that was
 * missing rather than a replacement for it. iOS ignores .ico entirely and falls
 * back to a screenshot of the page when there is no apple-touch-icon, which is
 * how a bookmarked site ends up with a thumbnail of its own header on somebody's
 * home screen.
 *
 * 180x180 is the size current iPhones ask for; iOS downscales it for everything
 * else. The mark is a wide wordmark (530x140), so it sits on a full-bleed ink
 * field with generous side margins rather than being stretched into a square -
 * iOS applies its own rounded mask on top, and anything near the edge is what
 * that mask cuts off.
 */
export default async function AppleIcon() {
  const logo = await readFile(join(process.cwd(), 'public/og/826-logo.png'));
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#08080a',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" width={132} height={35} />
      </div>
    ),
    size,
  );
}
