import { redirect } from 'next/navigation';

/**
 * `/gallery` used to re-export `/work` wholesale, so two URLs served byte-identical
 * pages - a duplicate-content problem, and two places for the same thing to drift.
 * The portfolio lives at /work; this is kept only so existing links still resolve.
 */
export default function GalleryPage() {
  redirect('/work');
}
