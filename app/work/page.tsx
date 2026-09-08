import { Metadata } from 'next';
import { PageHeader } from '@/components/common/PageHeader';
import { GalleryView } from '@/components/gallery/GalleryView';
import { BRAND_NAME } from '@/lib/data/brand';

export const metadata: Metadata = {
  title: 'Our Work & Gallery',
  description: `Completed paint protection film installations, ceramic coating, paint correction and motorcycle work from ${BRAND_NAME}.`,
};

/**
 * Portfolio.
 *
 * The stats bar used to claim "500+ Vehicles" and "98% Optical Purity", neither
 * of which 826 has published, alongside "4 Metro Studios" when there are five.
 * What is left is countable from the data in this repository.
 */
export default function WorkPage() {

  return (
    <main className="tone-ink min-h-screen bg-surface text-fg">
      <PageHeader
        title="Work"
        subtitle="Paint protection film, ceramic coating, correction and motorcycle work, photographed in 826's own studios."
        breadcrumbs={[{ label: 'Work' }]}
      />

      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 sm:py-28">
        <GalleryView />
      </section>
    </main>
  );
}
