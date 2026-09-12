import { calculateAspect, type Aspect } from './aspects';
import { type HouseCusp, type HouseSystem } from './houses';
import { type EphemerisProvider, type CelestialPosition, type CalculationMode } from './ephemeris';
import { decimalToZodiac } from './signs';

export interface NatalChartInput { displayName: string; birthDate: string; birthTime?: string; birthTimeUnknown: boolean; birthLocation: string; houseSystem: HouseSystem; }
export interface NatalChart { id: string; input: NatalChartInput; positions: CelestialPosition[]; aspects: Aspect[]; houses: HouseCusp[]; calculationMode: CalculationMode; isDemo: boolean; dataQualityNotes: string[]; }

export async function createNatalChart(input: NatalChartInput, provider: EphemerisProvider): Promise<NatalChart> {
  const isoDate = input.birthTimeUnknown || !input.birthTime ? `${input.birthDate}T12:00:00` : `${input.birthDate}T${input.birthTime}:00`;
  const positions = await provider.getPlanetPositions({ isoDate, birthLocation: input.birthLocation });
  const aspects = positions.flatMap((position, index) => positions.slice(index + 1).map((other) => calculateAspect(position, other)).filter((aspect): aspect is Aspect => Boolean(aspect)));
  const houses = input.birthTimeUnknown ? [] : Array.from({ length: 12 }, (_, index) => {
    const longitude = index * 30;
    return { house: index + 1, longitude, sign: decimalToZodiac(longitude).sign, confidence: provider.mode === 'demo' ? 'low' as const : 'medium' as const };
  });
  const dataQualityNotes = [provider.mode === 'demo' ? 'Demo ephemeris: sample deterministic positions, not Swiss Ephemeris-grade calculations.' : 'Server ephemeris calculation mode.', input.birthTimeUnknown ? 'Birth time is unknown; houses and angles are disabled or treated as low confidence.' : 'Birth time provided; house confidence depends on provider accuracy.'];
  return { id: `natal-${Date.now()}`, input, positions, aspects, houses, calculationMode: provider.mode, isDemo: provider.mode === 'demo', dataQualityNotes };
}
