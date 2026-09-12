import type { CalculationMode } from '../metadata';

export interface ProviderStatus {
  activeProvider: string;
  calculationMode: CalculationMode;
  serverConfigured: boolean;
  swissEphemerisAvailable: boolean;
  warnings: string[];
  requiredEnvVars: string[];
}

export function createDemoProviderStatus(): ProviderStatus {
  return {
    activeProvider: 'demo-ephemeris',
    calculationMode: 'demo',
    serverConfigured: false,
    swissEphemerisAvailable: false,
    warnings: ['Demo ephemeris provider active. Outputs are deterministic samples, not astronomical calculations.'],
    requiredEnvVars: ['VITE_AETHOS_EPHEMERIS_URL'],
  };
}
