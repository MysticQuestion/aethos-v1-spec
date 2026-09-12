export type CalculationMode = 'demo' | 'server' | 'external' | 'swiss';

export interface CalculationMetadata {
  calculationId: string;
  providerId: string;
  providerVersion: string;
  calculationMode: CalculationMode;
  generatedAt: string;
  inputHash: string;
  timezone: string;
  coordinates?: { latitude: number; longitude: number };
  houseSystem?: string;
  zodiacMode?: 'tropical' | 'sidereal';
  ephemerisSource?: string;
  warnings: string[];
}

export function createCalculationId(prefix = 'calc'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createInputHash(input: unknown): string {
  const stable = JSON.stringify(input, Object.keys(input as Record<string, unknown>).sort());
  let hash = 2166136261;
  for (let i = 0; i < stable.length; i += 1) {
    hash ^= stable.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function attachCalculationMetadata<T>(payload: T, metadata: CalculationMetadata): T & { calculationMetadata: CalculationMetadata } {
  return { ...payload, calculationMetadata: metadata };
}

export function validateCalculationMetadata(metadata: CalculationMetadata): string[] {
  const errors: string[] = [];
  if (!metadata.calculationId) errors.push('calculationId is required.');
  if (!metadata.providerId) errors.push('providerId is required.');
  if (!metadata.providerVersion) errors.push('providerVersion is required.');
  if (!metadata.inputHash) errors.push('inputHash is required.');
  if (!metadata.timezone) errors.push('timezone is required.');
  return errors;
}

export function compareCalculationInputs(a: unknown, b: unknown): boolean {
  return createInputHash(a) === createInputHash(b);
}
