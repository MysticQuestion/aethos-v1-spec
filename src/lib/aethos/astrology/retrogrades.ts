export type PlanetarySpeed = 'retrograde' | 'direct' | 'stationary';
export function detectRetrograde(speedInLongitude: number): boolean { return speedInLongitude < 0; }
export function detectStation(previousSpeed: number, currentSpeed: number): boolean { return Math.sign(previousSpeed) !== Math.sign(currentSpeed) || Math.abs(currentSpeed) < 0.02; }
export function classifyPlanetarySpeed(speedInLongitude: number): PlanetarySpeed { if (Math.abs(speedInLongitude) < 0.02) return 'stationary'; return speedInLongitude < 0 ? 'retrograde' : 'direct'; }
