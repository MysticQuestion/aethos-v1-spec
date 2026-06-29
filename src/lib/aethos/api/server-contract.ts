import { createCalculationId, createInputHash, type CalculationMetadata } from '../astrology/metadata';
import { createDemoProviderStatus } from '../astrology/providers/provider-status';
import type { ChartRequest, ProviderStatusResponse } from './contracts';

export function createCalculationMetadataForRequest(request: ChartRequest, warnings: string[]): CalculationMetadata {
  return { calculationId: createCalculationId('chart'), providerId: 'demo-ephemeris', providerVersion: 'demo-ephemeris-v1', calculationMode: request.calculationMode, generatedAt: new Date().toISOString(), inputHash: createInputHash(request), timezone: request.timezone, coordinates: request.latitude !== undefined && request.longitude !== undefined ? { latitude: request.latitude, longitude: request.longitude } : undefined, houseSystem: request.houseSystem, zodiacMode: request.zodiacMode, ephemerisSource: request.calculationMode === 'demo' ? 'deterministic-demo-provider' : 'server-contract', warnings };
}

export function getProviderStatusContract(): ProviderStatusResponse { return createDemoProviderStatus(); }
