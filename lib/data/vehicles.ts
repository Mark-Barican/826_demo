import type { VehicleSegmentId } from './pricing';

/**
 * Marques to suggest in the booking form, split by what the vehicle actually
 * is.
 *
 * The list used to be one flat array of every brand 826 might see, so a
 * customer booking a Vespa was offered Land Rover and Ferrari, and a customer
 * booking a Fortuner was offered Ducati and Harley-Davidson. Roughly half of
 * every suggestion list was noise for the person reading it.
 *
 * It also carried "Nissan GT-R", which is a model and not a make - it sat in
 * the list next to "Nissan" as though they were two different manufacturers.
 *
 * These are SUGGESTIONS, never a closed set. The picker they feed lets any text
 * through, because a Lambretta, a kei truck or a rebadged import is still a
 * vehicle 826 would happily quote for, and a form that refuses to accept a real
 * car is worse than one that offers a shorter list.
 */

/** Ordered roughly by how many are on Philippine roads, exotics last. */
export const CAR_MAKES = [
  'Toyota',
  'Mitsubishi',
  'Nissan',
  'Honda',
  'Ford',
  'Isuzu',
  'Suzuki',
  'Hyundai',
  'Kia',
  'Mazda',
  'Chevrolet',
  'Subaru',
  'MG',
  'Geely',
  'Chery',
  'BYD',
  'Volkswagen',
  'Tesla',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Lexus',
  'Land Rover',
  'Jeep',
  'Volvo',
  'Mini',
  'Porsche',
  'Ferrari',
  'Lamborghini',
  'McLaren',
  'Aston Martin',
  'Bentley',
] as const;

/** Scooters first: the moto work 826 photographs is mostly Vespa and maxi. */
export const MOTORCYCLE_MAKES = [
  'Vespa',
  'Honda',
  'Yamaha',
  'Suzuki',
  'Kawasaki',
  'Lambretta',
  'SYM',
  'Kymco',
  'Royal Enfield',
  'KTM',
  'Ducati',
  'BMW Motorrad',
  'Triumph',
  'Harley-Davidson',
  'Aprilia',
  'Moto Guzzi',
] as const;

/**
 * The marques worth offering for a given vehicle class.
 *
 * Four of the five segments are cars; only `motorcycle` is not. Written as an
 * explicit check on that one rather than a lookup table with four identical
 * rows, so adding a sixth car segment to VEHICLE_SEGMENTS needs no edit here.
 */
export function makesFor(segment: VehicleSegmentId): readonly string[] {
  return segment === 'motorcycle' ? MOTORCYCLE_MAKES : CAR_MAKES;
}

/** What to call the thing, so the picker's own copy matches the choice above. */
export function vehicleNoun(segment: VehicleSegmentId): string {
  return segment === 'motorcycle' ? 'motorcycle' : 'car';
}
