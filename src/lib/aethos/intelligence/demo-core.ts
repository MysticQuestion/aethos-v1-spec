import type { AethosProfile } from '../types';
import type { NatalChart } from '../astrology/natal';
import type { TransitEvent } from '../astrology/transits';
import type { CelestialPosition } from '../astrology/ephemeris';
import { calculateAspect } from '../astrology/aspects';
import { generateTimingWindows, type IntelligenceTimingWindow } from '../astrology/timing-windows';
import { aggregateThemeScores } from './theme-scores';
import { buildPatternMap, type PatternMapItem } from './pattern-map';
import { generateCalibrationInsight, type CalibrationInsight } from './calibration';
import type { EmaJournalEntry } from '../journal/journal-types';

function pos(body: CelestialPosition['body'], longitude: number, speedInLongitude: number): CelestialPosition { return { body, longitude, latitude: 0, speedInLongitude, calculatedAt: new Date().toISOString(), calculationMode: 'demo', isDemo: true }; }

export interface IntelligenceSnapshot { natalChart: NatalChart; transitEvents: TransitEvent[]; windows: IntelligenceTimingWindow[]; patternMap: PatternMapItem[]; calibration: CalibrationInsight; }

export function createDemoIntelligenceSnapshot(profile: AethosProfile, entries: EmaJournalEntry[]): IntelligenceSnapshot {
  const natalPositions = [pos('Sun', 14, 1), pos('Moon', 82, 12), pos('Mercury', 201, 1.2), pos('Venus', 250, 1.1), pos('Mars', 104, 0.8), pos('Saturn', 286, 0.05)];
  const natalChart: NatalChart = { id: `demo-chart-${profile.id}`, input: { displayName: profile.displayName, birthDate: '1990-01-01', birthTimeUnknown: profile.isSample, birthLocation: 'Demo location', houseSystem: 'whole-sign' }, positions: natalPositions, aspects: [], houses: [], calculationMode: 'demo', isDemo: true, dataQualityNotes: ['Demo ephemeris: sample deterministic positions, not Swiss Ephemeris-grade calculations.', profile.isSample ? 'Sample profile; houses and angles are disabled or treated as low confidence.' : 'Use server ephemeris for production calculations.'] };
  const transitPositions = [pos('Mars', 104, 0.7), pos('Saturn', 194, -0.01), pos('Mercury', 14, -0.03), pos('Venus', 82, 1.1), pos('Moon', 286, 12)];
  const today = new Date().toISOString().slice(0, 10);
  const transitEvents: TransitEvent[] = [];
  for (const transit of transitPositions) {
    for (const natal of natalPositions) {
      const aspect = calculateAspect(transit, natal);
      if (!aspect) continue;
      transitEvents.push({ id: `${today}-${transit.body}-${natal.body}-${aspect.type}`, transitBody: transit.body, natalTarget: natal.body, aspect, orb: aspect.orb, exactDate: today, transitPosition: transit, natalPosition: natal, rationale: `${transit.body} ${aspect.type} natal ${natal.body} within ${aspect.orb}° orb.` });
    }
  }
  transitEvents.splice(12);
  const windows = generateTimingWindows(transitEvents, natalChart, entries.length);
  const patternMap = buildPatternMap(aggregateThemeScores(transitEvents)).slice(0, 6);
  const calibration = generateCalibrationInsight(entries, windows);
  return { natalChart, transitEvents, windows, patternMap, calibration };
}
