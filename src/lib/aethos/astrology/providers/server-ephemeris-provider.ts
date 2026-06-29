import type { CelestialPosition, EphemerisParams } from '../ephemeris';
import { DemoEphemerisProviderV2 } from './demo-ephemeris-provider';
import type { EphemerisProviderV2 } from './ephemeris-provider';
import type { ProviderStatus } from './provider-status';

export class ServerEphemerisProvider implements EphemerisProviderV2 {
  id = 'server-ephemeris';
  label = 'Server Ephemeris Contract';
  mode = 'server' as const;
  version = 'server-contract-v1';
  private fallback = new DemoEphemerisProviderV2();
  constructor(private endpoint?: string) {}
  async getPlanetPosition(input: EphemerisParams): Promise<CelestialPosition> { return this.fallback.getPlanetPosition(input); }
  async getPlanetPositions(input: Omit<EphemerisParams, 'body'>): Promise<CelestialPosition[]> { return this.fallback.getPlanetPositions(input); }
  async getProviderStatus(): Promise<ProviderStatus> { return { activeProvider: this.id, calculationMode: this.mode, serverConfigured: Boolean(this.endpoint), swissEphemerisAvailable: false, warnings: ['Server ephemeris contract is configured as a placeholder. Falling back to deterministic demo values until a server provider is deployed.'], requiredEnvVars: ['VITE_AETHOS_EPHEMERIS_URL'] }; }
}
