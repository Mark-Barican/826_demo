import { HeroSection } from '@/components/hero/HeroSection';
import { BrandPartners } from '@/components/home/BrandPartners';
import { SpecPlate } from '@/components/home/SpecPlate';
import { VehicleRouter } from '@/components/home/VehicleRouter';
import { BeforeAfterSection } from '@/components/home/BeforeAfterSection';
import { Disciplines } from '@/components/home/Disciplines';
import { SelectedWork } from '@/components/home/SelectedWork';
import { StudioNetwork } from '@/components/home/StudioNetwork';
import { Deliveries } from '@/components/home/Deliveries';
import { ActionRow } from '@/components/home/ActionRow';

/**
 * Homepage.
 *
 * The order below is the design. The previous page ran six sections that were
 * structurally the same object - kicker, light heading, arrow link, grid of
 * bordered dark cards - on one unbroken dark field, so nothing could read as
 * more important than anything else.
 *
 * The tone column now alternates ink / paper / ink / paper, and exactly two
 * moments use the display type tier: the hero and the spec plate. That is what
 * both reference sites do, and it is the whole reason their pages have rhythm.
 */
export default function Home() {
  return (
    <main className="min-h-screen">
      {/* 01 - scroll-driven film sequence. Untouched: the canvas, frame ladder
             and phase copy are load-bearing and heavily reasoned. */}
      <HeroSection />

      {/* 02 - the film brands 826 works with. */}
      <BrandPartners />

      {/* 03 - the annotated specification plate, on paper. */}
      <SpecPlate />

      {/* 04 - what are we protecting? Routes into pricing by segment. */}
      <VehicleRouter />

      {/* 05 - correction, as an inspection plate on paper. */}
      <BeforeAfterSection />

      {/* 06 - the five disciplines, as vertical-labelled panels. */}
      <Disciplines />

      {/* 07 - recent work, in bands of three and four. */}
      <SelectedWork />

      {/* 08 - where the studios are, map-led, on paper. */}
      <StudioNetwork />

      {/* 09 - deliveries. */}
      <Deliveries />

      {/* 10 - three doors out. */}
      <ActionRow />
    </main>
  );
}
