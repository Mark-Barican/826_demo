import Link from 'next/link';
import Image from 'next/image';
import { Section } from '@/components/common/Section';

/**
 * Vehicle-type router, after XPEL's coverage tiles.
 *
 * Two things make this worth having rather than decorative. Each tile maps to a
 * real segment key in `lib/data/pricing.ts` and deep-links to the pricing page
 * with that segment preselected, so it answers "what will this cost me" in one
 * click. And each uses a photograph of that actual class of vehicle from 826's
 * own library.
 *
 * The tiles are 4:5. The job photography is 1080x1350 portrait, and the old
 * grid cropped it into 16/10 and square landscape frames, which threw most of
 * each vehicle away. Portrait tiles are what the assets already are.
 *
 * PHOTO CHOICE: picked by looking at the files, not by trusting the folder
 * names or `lib/data/gallery.ts`, both of which are wrong. `nissan/` is a
 * Navara pickup (gallery.ts calls it a GT-R), `ford/` is a Ranger Raptor
 * (gallery.ts calls it a Mustang), `tesla/` is a Model Y crossover rather than
 * a Model 3 sedan, and `toyota/` holds several different vehicles including a
 * Mitsubishi. There is no supercar in the library, so there is no
 * "Performance & Exotics" tile - the pricing page still carries that segment.
 */
const TILES = [
  {
    segment: 'sedan',
    label: 'Sedans & Coupes',
    image: '/work/toyota/toyota-03.jpg',
    alt: 'Silver sedan under the inspection lighting in an 826 studio',
  },
  {
    segment: 'suv',
    label: 'SUVs & Crossovers',
    image: '/work/tesla/tesla-02.jpg',
    alt: 'White Tesla crossover after paint protection film installation',
  },
  {
    segment: 'largeSuv',
    label: 'Pickups & 4x4s',
    image: '/work/ford/ford-01.jpg',
    alt: 'Ford Ranger Raptor pickup in an 826 studio bay',
  },
  {
    segment: 'motorcycle',
    label: 'Motorcycles & Scooters',
    image: '/work/kawasaki/kawasaki-01.jpg',
    alt: 'Kawasaki sportbike after paint protection film installation',
  },
] as const;

export function VehicleRouter() {
  return (
    <Section
      tone="ink"
      label="Start here"
      title="What are we protecting?"
      intro="Pick the class of vehicle and the packages, scopes of work and prices for it come up together."
      action={{ href: '/pricing', label: 'All packages & pricing' }}
      revealBody={false}
    >
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {TILES.map((tile) => (
          <li key={tile.segment} data-reveal>
            <Link
              href={`/pricing?segment=${tile.segment}`}
              className="group relative block overflow-hidden border border-rule transition-colors hover:border-accent"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={tile.image}
                  alt={tile.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover brightness-[0.78] transition-[filter,transform] duration-700 group-hover:brightness-100"
                />
                {/* Scrim only across the label band, so the vehicle stays legible. */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/55 to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                <span className="type-card text-white">{tile.label}</span>
                <span
                  aria-hidden
                  className="mb-1 h-px w-6 shrink-0 bg-brand transition-all duration-300 group-hover:w-10"
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
