import type { TransitEvent } from './transits';
import { aggregateThemeScores, THEMES, type ThemeScoreMap, type TimingTheme } from '../intelligence/theme-scores';
import { calculateConfidenceScore, calculateWindowIntensity } from '../intelligence/confidence';
import type { NatalChart } from './natal';

export interface IntelligenceTimingWindow { id: string; title: string; primaryTheme: TimingTheme; secondaryThemes: TimingTheme[]; startDate: string; peakDate: string; endDate: string; sourceEvents: TransitEvent[]; intensityScore: number; confidenceScore: number; themeScores: ThemeScoreMap; interpretiveSummary: string; suggestedReflection: string; recommendedActionExperiment: string; responsibleUseNote: string; }

function offsetDate(date: string, days: number): string { const parsed = new Date(`${date}T00:00:00Z`); parsed.setDate(parsed.getDate() + days); return parsed.toISOString().slice(0, 10); }
function topThemes(scores: ThemeScoreMap): TimingTheme[] { return [...THEMES].sort((a, b) => scores[b] - scores[a]).filter((theme) => scores[theme] > 0); }

export function generateTimingWindowSummary(window: Pick<IntelligenceTimingWindow, 'primaryTheme' | 'sourceEvents' | 'intensityScore'>): string { return `This window may be useful for observing ${window.primaryTheme.toLowerCase()} patterns because ${window.sourceEvents.length} structured transit signal(s) cluster around this period. Intensity ${Math.round(window.intensityScore * 100)}%.`; }
export function generateRecommendedReflection(theme: TimingTheme): string { return `What evidence do you notice around ${theme.toLowerCase()}, and what interpretation remains provisional?`; }
export function generateActionExperiment(theme: TimingTheme): string { return theme === 'Rest' ? 'rest' : theme === 'Communication' ? 'communicate' : theme === 'Decision Pressure' ? 'decide later' : 'observe'; }

export function generateTimingWindows(transitEvents: TransitEvent[], natalChart?: NatalChart, journalCount = 0): IntelligenceTimingWindow[] {
  const grouped = transitEvents.reduce<Record<string, TransitEvent[]>>((groups, event) => { (groups[event.exactDate] ??= []).push(event); return groups; }, {});
  return Object.entries(grouped).slice(0, 8).map(([date, events], index) => {
    const themeScores = aggregateThemeScores(events);
    const [primaryTheme = 'Inner Life', ...secondaryThemes] = topThemes(themeScores);
    const intensityScore = calculateWindowIntensity(events);
    const draft = { primaryTheme, sourceEvents: events, intensityScore };
    return { id: `window-${date}-${index}`, title: `${primaryTheme} timing window`, primaryTheme, secondaryThemes: secondaryThemes.slice(0, 3), startDate: offsetDate(date, -2), peakDate: date, endDate: offsetDate(date, 2), sourceEvents: events, intensityScore, confidenceScore: calculateConfidenceScore(events, natalChart, journalCount), themeScores, interpretiveSummary: generateTimingWindowSummary(draft), suggestedReflection: generateRecommendedReflection(primaryTheme), recommendedActionExperiment: generateActionExperiment(primaryTheme), responsibleUseNote: 'This is not a command or prediction. Treat it as a context marker for observation and planning.' };
  });
}

export function scoreTimingWindow(window: IntelligenceTimingWindow): number { return Number(((window.intensityScore + window.confidenceScore) / 2).toFixed(2)); }
