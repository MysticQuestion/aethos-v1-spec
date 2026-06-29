import type { CelestialPosition, EphemerisParams } from '../ephemeris';
import type { HouseCusp } from '../houses';
import type { CalculationMode } from '../metadata';
import type { ProviderStatus } from './provider-status';

export interface EphemerisProviderV2 {
  id: string;
  label: string;
  mode: CalculationMode;
  version: string;
  getPlanetPosition(input: EphemerisParams): Promise<CelestialPosition>;
  getPlanetPositions(input: Omit<EphemerisParams, 'body'>): Promise<CelestialPosition[]>;
  getHouses?(input: { isoDate: string; latitude?: number; longitude?: number; houseSystem?: string }): Promise<HouseCusp[]>;
  getProviderStatus(): Promise<ProviderStatus>;
}
