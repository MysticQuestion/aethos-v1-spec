import { DemoEphemerisProvider } from '../ephemeris';
import type { EphemerisProviderV2 } from './ephemeris-provider';
import { createDemoProviderStatus } from './provider-status';

export class DemoEphemerisProviderV2 extends DemoEphemerisProvider implements EphemerisProviderV2 {
  id = 'demo-ephemeris';
  label = 'Deterministic Demo Ephemeris';
  version = 'demo-ephemeris-v1';
  async getProviderStatus() { return createDemoProviderStatus(); }
}
