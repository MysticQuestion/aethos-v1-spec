import type { NatalChartInput, NatalChart } from '../astrology/natal';
import type { TransitEvent, DateRange } from '../astrology/transits';
import type { IntelligenceTimingWindow } from '../astrology/timing-windows';
import type { ProviderStatus } from '../astrology/providers/provider-status';
import type { CalculationMetadata, CalculationMode } from '../astrology/metadata';
import type { OrbConfig } from '../astrology/aspects';

export interface ApiError { code: string; message: string; details?: Record<string, unknown>; }
export interface ApiResult<T> { data?: T; error?: ApiError; warnings: string[]; }
export interface ChartRequest extends NatalChartInput { birthTimeKnown?: boolean; latitude?: number; longitude?: number; timezone: string; zodiacMode: 'tropical' | 'sidereal'; calculationMode: CalculationMode; }
export interface ChartResponse { natalChart: NatalChart; calculationMetadata: CalculationMetadata; warnings: string[]; }
export interface TransitRequest { natalChartId?: string; natalChart?: NatalChart; dateRange: DateRange; providerMode: CalculationMode; transitBodies?: string[]; orbConfig?: OrbConfig; }
export interface TransitResponse { transitEvents: TransitEvent[]; retrogradeEvents: unknown[]; calculationMetadata: CalculationMetadata; warnings: string[]; }
export interface TimingWindowsRequest { transitEvents: TransitEvent[]; journalBaseline?: unknown; userProfile?: unknown; }
export interface TimingWindowsResponse { timingWindows: IntelligenceTimingWindow[]; themeScores: unknown; confidenceNotes: string[]; warnings: string[]; }
export interface ProviderStatusResponse extends ProviderStatus {}

export const API_CONTRACTS = {
  chart: 'POST /api/aethos/chart',
  transits: 'POST /api/aethos/transits',
  timingWindows: 'POST /api/aethos/timing-windows',
  providerStatus: 'GET /api/aethos/provider-status',
} as const;

export function validateChartRequest(input: Partial<ChartRequest>): ApiError[] {
  const errors: ApiError[] = [];
  if (!input.birthDate) errors.push({ code: 'VALIDATION_ERROR', message: 'birthDate is required.' });
  if (!input.birthTimeKnown && !input.birthTime) errors.push({ code: 'VALIDATION_WARNING', message: 'Birth time is unknown; houses and angles must be disabled or low confidence.' });
  if (!input.birthLocation) errors.push({ code: 'VALIDATION_ERROR', message: 'birthLocation is required.' });
  if (!input.timezone) errors.push({ code: 'VALIDATION_ERROR', message: 'timezone is required for reproducibility.' });
  return errors;
}
