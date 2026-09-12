import type { CelestialPosition } from './ephemeris';

export type AspectType = 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile';
export interface OrbConfig { conjunction: number; opposition: number; trine: number; square: number; sextile: number; }
export interface Aspect { bodyA: string; bodyB: string; type: AspectType; exactAngle: number; orb: number; applying: boolean; }

const ASPECT_ANGLES: Record<AspectType, number> = { conjunction: 0, opposition: 180, trine: 120, square: 90, sextile: 60 };
export const DEFAULT_ORBS: OrbConfig = { conjunction: 8, opposition: 8, trine: 6, square: 6, sextile: 4 };

function angularDistance(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

export function calculateAspect(bodyA: CelestialPosition, bodyB: CelestialPosition, orbConfig: OrbConfig = DEFAULT_ORBS): Aspect | null {
  const distance = angularDistance(bodyA.longitude, bodyB.longitude);
  const candidates = (Object.entries(ASPECT_ANGLES) as Array<[AspectType, number]>)
    .map(([type, exactAngle]) => ({ type, exactAngle, orb: Math.abs(distance - exactAngle) }))
    .filter((candidate) => candidate.orb <= orbConfig[candidate.type])
    .sort((a, b) => a.orb - b.orb);
  const best = candidates[0];
  return best ? { bodyA: bodyA.body, bodyB: bodyB.body, type: best.type, exactAngle: best.exactAngle, orb: Number(best.orb.toFixed(2)), applying: bodyA.speedInLongitude > bodyB.speedInLongitude } : null;
}
