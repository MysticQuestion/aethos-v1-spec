import { PLANETS, type Planet } from './planets';
import { normalizeLongitude } from './signs';

export type CalculationMode = 'demo' | 'server' | 'external';
export interface CelestialPosition { body: Planet; longitude: number; latitude: number; speedInLongitude: number; calculatedAt: string; calculationMode: CalculationMode; isDemo: boolean; }
export interface EphemerisParams { body: Planet; isoDate: string; birthLocation?: string; }
export interface EphemerisProvider { mode: CalculationMode; getPlanetPosition(params: EphemerisParams): Promise<CelestialPosition>; getPlanetPositions(params: Omit<EphemerisParams, 'body'> & { bodies?: Planet[] }): Promise<CelestialPosition[]>; }

function stableSeed(input: string): number { return [...input].reduce((sum, char) => sum + char.charCodeAt(0) * 17, 0); }

export class DemoEphemerisProvider implements EphemerisProvider {
  mode: CalculationMode = 'demo';
  async getPlanetPosition(params: EphemerisParams): Promise<CelestialPosition> {
    const planetIndex = PLANETS.indexOf(params.body);
    const daySeed = stableSeed(`${params.isoDate}:${params.birthLocation ?? 'earth'}`);
    const longitude = normalizeLongitude(planetIndex * 32.7 + daySeed * (0.013 + planetIndex * 0.001));
    const speedInLongitude = Number((((planetIndex + 1) * 0.11) * (daySeed % 11 === planetIndex ? -1 : 1)).toFixed(3));
    return { body: params.body, longitude, latitude: 0, speedInLongitude, calculatedAt: new Date().toISOString(), calculationMode: 'demo', isDemo: true };
  }
  async getPlanetPositions(params: Omit<EphemerisParams, 'body'> & { bodies?: Planet[] }): Promise<CelestialPosition[]> {
    return Promise.all((params.bodies ?? PLANETS).map((body) => this.getPlanetPosition({ ...params, body })));
  }
}
