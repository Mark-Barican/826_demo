import Image from 'next/image';

/**
 * A branch's photograph, or an honest stand-in.
 *
 * Not every branch has been photographed. Substituting another branch's plate
 * would misrepresent the place, and a grey box reads as a broken image, so a
 * branch without a photo gets a typographic plate at the same size and weight
 * as the others - deliberate rather than missing.
 */
export function BranchImage({
  src,
  name,
  city,
  sizes,
  priority = false,
  className = 'object-cover',
}: {
  src: string | null;
  name: string;
  city: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (src) {
    return (
      <Image src={src} alt={name} fill className={className} sizes={sizes} priority={priority} />
    );
  }

  // `@container` so the type below can be sized against this frame rather than
  // the viewport - see `.type-plate-name` in app/globals.css for why. The frame
  // itself must not parallax: see the `still` prop on components/common/Parallax.
  return (
    <div className="@container absolute inset-0 flex flex-col justify-end bg-surface-raised p-5 sm:p-6">
      <span className="type-meta text-accent">{city}</span>
      <span className="type-plate-name mt-2 block">{name}</span>
      <span className="mt-3 h-px w-16 bg-accent" aria-hidden="true" />
      <span className="type-plate-note mt-2 text-fg-muted">
        No studio photograph published for this branch yet.
      </span>
    </div>
  );
}
