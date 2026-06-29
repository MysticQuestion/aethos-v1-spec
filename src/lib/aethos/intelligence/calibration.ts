import type { IntelligenceTimingWindow } from '../astrology/timing-windows';
import type { EmaJournalEntry } from '../journal/journal-types';

export interface JournalAverages { mood: number; stress: number; focus: number; sleepQuality: number; clarity: number; count: number; }
export interface CalibrationInsight { status: 'learning' | 'ready'; summary: string; baseline?: JournalAverages; windowAverage?: JournalAverages; }

function avg(entries: EmaJournalEntry[], key: keyof Pick<EmaJournalEntry, 'mood' | 'stress' | 'focus' | 'sleepQuality' | 'clarity'>): number { return entries.length ? Number((entries.reduce((sum, entry) => sum + entry[key], 0) / entries.length).toFixed(1)) : 0; }
export function calculateJournalAverages(entries: EmaJournalEntry[]): JournalAverages { return { mood: avg(entries, 'mood'), stress: avg(entries, 'stress'), focus: avg(entries, 'focus'), sleepQuality: avg(entries, 'sleepQuality'), clarity: avg(entries, 'clarity'), count: entries.length }; }
export function getEntriesNearTimingWindow(entries: EmaJournalEntry[], window: IntelligenceTimingWindow): EmaJournalEntry[] { return entries.filter((entry) => entry.createdAt.slice(0, 10) >= window.startDate && entry.createdAt.slice(0, 10) <= window.endDate); }
export function compareWindowToBaseline(entries: EmaJournalEntry[], window: IntelligenceTimingWindow): CalibrationInsight {
  if (entries.length < 5) return { status: 'learning', summary: 'Not enough journal history yet. Aethos needs repeated check-ins before it can estimate personal timing correlations.' };
  const baseline = calculateJournalAverages(entries);
  const windowEntries = getEntriesNearTimingWindow(entries, window);
  if (windowEntries.length < 2) return { status: 'learning', summary: 'More entries near this timing window are needed before comparison is useful.', baseline };
  const windowAverage = calculateJournalAverages(windowEntries);
  return { status: 'ready', baseline, windowAverage, summary: `During windows tagged ${window.primaryTheme}, your stress score has averaged ${windowAverage.stress} compared with your baseline of ${baseline.stress}. Treat this as a pattern to observe, not a deterministic forecast.` };
}
export function generateCalibrationInsight(entries: EmaJournalEntry[], windows: IntelligenceTimingWindow[]): CalibrationInsight { return windows[0] ? compareWindowToBaseline(entries, windows[0]) : { status: 'learning', summary: 'No timing window is available for calibration yet.' }; }
