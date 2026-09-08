import Link from 'next/link';
import Image from 'next/image';
import { RuledGrid, RULED_CELL } from '@/components/common/RuledGrid';
import { Section } from '@/components/common/Section';
import { GALLERY_PROJECTS, type GalleryProject } from '@/lib/data/gallery';

/**
 * Selected work, as two full-bleed bands rather than a uniform three-column
 * grid of bordered cards.
 *
 * The band sizes are not arbitrary. The job photography is 1080px wide, so a
 * single frame stretched to a 1440px-plus display is visibly soft - the fix is
 * to run three or four frames across instead of one. A band of three followed
 * by a band of four also gives the section an internal rhythm that a repeating
 * grid cannot.
 *
 * Every frame is 4:5, which is the aspect the photographs actually are. The
 * previous grid forced them into 16/10 and cropped most of each vehicle out.
 */
export function SelectedWork() {
  const [bandOfThree, bandOfFour] = [
    GALLERY_PROJECTS.slice(0, 3),
    GALLERY_PROJECTS.slice(3, 7),
  ];

  return (
    <Section tone="ink" title="Recent work." bleed revealBody={false}>
      {/* The rule between the two bands is on the wrapper, not on the band:
          a RuledGrid clips its own first pixel, so a top border there would
          never be drawn. */}
      <div className="flex flex-col">
        <Band projects={bandOfThree} columns={3} priority />
        <div className="border-t border-rule">
          <Band projects={bandOfFour} columns={4} />
        </div>
      </div>
    </Section>
  );
}

function Band({
  projects,
  columns,
  priority = false,
}: {
  projects: GalleryProject[];
  columns: 3 | 4;
  priority?: boolean;
}) {
  const sizes =
    columns === 3
      ? '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw'
      : '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw';

  return (
    <RuledGrid
      as="ul"
      className={`grid-cols-2 sm:grid-cols-3 ${
        columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
      }`}
    >
      {projects.map((project) => (
        <li key={project.id} data-reveal className={`${RULED_CELL} tone-ink bg-surface`}>
          <Link href="/work" className="group block">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={project.image}
                alt={`${project.vehicle} - ${project.categoryLabel}`}
                fill
                sizes={sizes}
                priority={priority}
                className="object-cover brightness-[0.82] transition-[filter] duration-700 group-hover:brightness-100"
              />
            </div>

            <div className="flex items-baseline justify-between gap-4 p-4 sm:p-5">
              <div className="min-w-0">
                <h3 className="type-card line-clamp-2">{project.vehicle}</h3>
                {/* `project.branch` is deliberately not printed: every photograph
                    is watermarked "SCT LIMBAGA QC", which contradicts the studio
                    the data assigns. The service is 826's own claim about its
                    work and is safe to show. */}
                <p className="mt-2 line-clamp-1 type-detail text-fg-muted">{project.service}</p>
              </div>
              <span
                aria-hidden
                className="h-px w-5 shrink-0 bg-accent transition-all duration-300 group-hover:w-9"
              />
            </div>
          </Link>
        </li>
      ))}
    </RuledGrid>
  );
}
