import Link from 'next/link';
import Image from 'next/image';
import { Reveal } from '@/components/common/Reveal';
import { BRANCHES, PRIMARY_BRANCH, STUDIO_COUNT_WORD } from '@/lib/data/branches';
import { SERVICES } from '@/lib/data/services';
import { VERIFIED_CLAIMS } from '@/lib/data/claims';
import { BRAND_NAME, SOCIAL } from '@/lib/data/brand';
import { SocialLinks } from '@/components/common/SocialLinks';

/**
 * Footer.
 *
 * The studio banner is a hairline-ruled list, not a `lg:grid-cols-4` card grid
 * holding five branches - that combination left the fifth studio orphaned in an
 * otherwise empty row for three days after Dasmariñas was added. Both the
 * heading and the list now derive from BRANCHES.
 *
 * The "Studio Standards" column used to assert a 10-year warranty and Stek/XPEL
 * certification. Those are third-party claims nobody has confirmed 826 can
 * make, so they now come from `VERIFIED_CLAIMS`, which is empty until they are
 * evidenced - see lib/data/claims.ts. The column falls back to published hours,
 * which are real.
 *
 * The footer lives in the root layout, not in the route template, so it mounts
 * once and its reveals are never re-created on navigation. That is fine: the
 * route transition refreshes ScrollTrigger when it finishes, which re-measures
 * the footer against the new page's height and resets it if it has dropped back
 * below the fold.
 */
export function Footer() {
  return (
    <footer className="tone-ink border-t border-rule bg-surface-sunken text-fg">
      {/* Studio list */}
      <div className="border-b border-rule">
        <Reveal className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 lg:py-16">
          <div data-reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="type-meta block text-accent">Studio network</span>
              <h2 className="type-section mt-2">{STUDIO_COUNT_WORD} studios</h2>
            </div>
            <Link
              href="/branches"
              className="type-meta group inline-flex flex-col gap-2 text-fg-muted transition-colors hover:text-fg"
            >
              <span>All studios &amp; hours</span>
              <span
                aria-hidden
                className="h-px w-full max-w-[3rem] bg-accent transition-all duration-300 group-hover:max-w-full"
              />
            </Link>
          </div>

          <ul className="mt-10">
            {/* Unnumbered, like the studio list on the homepage. The ordinals
                were the left column of this grid, which is why the small-screen
                cells no longer need to start themselves in column two. */}
            {BRANCHES.map((b) => (
              <li key={b.slug} data-reveal className="border-t border-rule last:border-b">
                <Link
                  href={`/branches/${b.slug}`}
                  className="group grid grid-cols-1 items-baseline gap-x-8 gap-y-1 py-4 transition-colors hover:text-accent sm:grid-cols-[1fr_auto_auto]"
                >
                  <span className="type-card">{b.name.replace(/^826\s*/, '')}</span>
                  <span className="type-value text-fg-muted">{b.address}</span>
                  <span className="type-meta tabular-nums text-fg-muted">{b.phone}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* Links */}
      <Reveal className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 lg:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div data-reveal className="flex flex-col gap-6 lg:col-span-2">
            <Link href="/" className="inline-block">
              <Image
                src="/brand/826 logo.webp"
                alt={BRAND_NAME}
                width={130}
                height={45}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="max-w-sm type-detail text-fg-muted">
              {BRAND_NAME} installs paint protection film, corrects paint, and applies
              ceramic coating to cars and motorcycles across Metro Manila.
            </p>
            <div className="type-meta flex flex-col gap-1.5 text-fg-muted">
              <span className="text-fg">
                {PRIMARY_BRANCH.city}: {PRIMARY_BRANCH.phone}
              </span>
            </div>

            {/* Renders nothing until the URLs are in lib/data/brand.ts. The
                Facebook page here is the Quezon City one, which stands for the
                business; the other four belong to their own studio pages. */}
            <SocialLinks instagram={SOCIAL.instagram} facebook={SOCIAL.facebook} />
          </div>

          <FooterColumn title="Services">
            {SERVICES.map((s) => (
              <FooterLink key={s.slug} href={`/services/${s.slug}`}>
                {s.title}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Explore">
            <FooterLink href="/work">Work</FooterLink>
            <FooterLink href="/pricing">Packages &amp; pricing</FooterLink>
            <FooterLink href="/branches">Studios</FooterLink>
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/booking">Book a consultation</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterColumn>

          <FooterColumn title={VERIFIED_CLAIMS.length > 0 ? 'Standards' : 'Hours'}>
            {VERIFIED_CLAIMS.length > 0 ? (
              VERIFIED_CLAIMS.map((claim) => (
                <li key={claim.label} className="border-t border-rule-soft pt-3">
                  <span className="block text-sm text-fg">{claim.label}</span>
                  <span className="mt-1 block type-detail text-fg-muted">{claim.detail}</span>
                </li>
              ))
            ) : (
              <>
                {PRIMARY_BRANCH.hours.map((h) => (
                  <li key={h.days} className="type-value text-fg-muted">
                    <span className="block text-fg">{h.days}</span>
                    <span className="mt-0.5 block">{h.time}</span>
                  </li>
                ))}
                <li className="type-detail text-fg-muted">
                  Hours vary by studio. Check the studio page before travelling.
                </li>
              </>
            )}
          </FooterColumn>
        </div>

        <div data-reveal className="type-meta mt-14 flex flex-col items-start justify-between gap-4 border-t border-rule pt-8 text-fg-muted sm:flex-row sm:items-center">
          <span>&copy; {new Date().getFullYear()} {BRAND_NAME}</span>
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/terms" className="transition-colors hover:text-fg">
              Terms of use
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-fg">
              Privacy policy
            </Link>
            <span>Metro Manila, Philippines</span>
          </nav>
        </div>
      </Reveal>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div data-reveal>
      <h3 className="type-meta mb-5 text-fg">{title}</h3>
      <ul className="flex flex-col gap-0.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="block py-1.5 type-value text-fg-muted transition-colors hover:text-fg">
        {children}
      </Link>
    </li>
  );
}
