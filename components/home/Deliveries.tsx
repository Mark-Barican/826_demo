import Image from 'next/image';
import { RuledGrid, RULED_CELL } from '@/components/common/RuledGrid';
import { Section } from '@/components/common/Section';

/**
 * Client deliveries.
 *
 * The previous version captioned eight of these photographs as a Porsche
 * Taycan, Range Rover Sport, BMW M3 Competition, Mercedes-AMG G63, Audi RS6
 * Avant, Nissan GT-R Nismo and Ford Mustang Dark Horse. 826's library contains
 * none of those vehicles - it is Ford, Tesla, Toyota, Nissan, Kawasaki, Vespa,
 * PCX, Giorno and Lambretta - so every one of those captions was invented.
 *
 * They are gone. The photographs carry the section on their own, and the folder
 * name is the only thing actually known about them, so the alt text says only
 * what can be supported.
 *
 * TODO(826): if Mark supplies real vehicle and date captions for
 * `public/work/customers/*`, reinstate them per-photo. Until then nothing here
 * asserts what any individual car is. Ten photographs exist; all ten are shown
 * (the old grid dropped two for no reason).
 */

const DELIVERY_COUNT = 10;

export function Deliveries() {
  return (
    <Section
      tone="ink"
      label="Deliveries"
      title="Handed back."
      intro="Photographs from 826's own studios, taken as vehicles go back to their owners."
      revealBody={false}
    >
      <RuledGrid as="ul" className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: DELIVERY_COUNT }, (_, i) => {
          const n = String(i + 1).padStart(2, '0');
          return (
            <li key={n} data-reveal className={`${RULED_CELL} relative aspect-[4/5] bg-surface`}>
              <Image
                src={`/work/customers/customer-${n}.jpg`}
                alt={`Customer vehicle photographed at an 826 studio (${i + 1} of ${DELIVERY_COUNT})`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover brightness-[0.85] transition-[filter] duration-500 hover:brightness-100"
              />
            </li>
          );
        })}
      </RuledGrid>
    </Section>
  );
}
