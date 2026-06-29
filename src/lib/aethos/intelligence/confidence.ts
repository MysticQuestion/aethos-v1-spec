import type { NatalChart } from '../astrology/natal';
import type { TransitEvent } from '../astrology/transits';

export function calculateWindowIntensity(events: TransitEvent[]): number {
  if (!events.length) return 0;
  return Number(Math.min(1, events.reduce((sum, event) => sum + Math.max(0, 1 - event.orb / 8), 0) / Math.max(3, events.length)).toFixed(2));
}

export function calculateConfidenceScore(events: TransitEvent[], natalChart?: NatalChart, journalCount = 0): number {
  const eventSignal = Math.min(0.45, events.length * 0.03);
  const providerSignal = natalChart?.isDemo ? 0.15 : 0.35;
  const birthTimeSignal = natalChart?.input.birthTimeUnknown ? 0.05 : 0.1;
  const journalSignal = Math.min(0.25, journalCount * 0.015);
  return Number(Math.min(0.95, eventSignal + providerSignal + birthTimeSignal + journalSignal).toFixed(2));
}
