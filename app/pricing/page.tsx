import { Metadata } from 'next';
import { PageHeader } from '@/components/common/PageHeader';
import { PricingCalculator } from '@/components/pricing/PricingCalculator';
import { toVehicleSegment } from '@/lib/data/pricing';

export const metadata: Metadata = {
  title: 'Packages & Pricing',
  description:
    'Package prices for paint protection film, ceramic coating and paint correction, by vehicle segment.',
};

/**
 * Pricing.
 *
 * `?segment=` opens the page on a given vehicle class, which is what the
 * homepage vehicle router links to. The value is narrowed through
 * `toVehicleSegment` rather than cast, because it arrives from the URL.
 *
 * The stats bar previously claimed warranties of "3 to 10 Years", a
 * "100% Optical TPU" film grade and a "40-Point Map" paint depth check. None of
 * those are published - see lib/data/claims.ts. What is here is countable from
 * the data on this page.
 */
export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ segment?: string }>;
}) {
  const { segment } = await searchParams;
  const initialSegment = toVehicleSegment(segment) ?? undefined;

  return (
    <main className="tone-ink min-h-screen bg-surface text-fg">
      <PageHeader
        title="What it costs."
        subtitle="Pick the vehicle, see the packages and what each one actually includes. Prices are per vehicle, not per panel."
        breadcrumbs={[{ label: 'Packages & pricing' }]}
      />

      <PricingCalculator initialSegment={initialSegment} />
    </main>
  );
}
