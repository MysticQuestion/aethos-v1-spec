import type { ThemeScoreMap, TimingTheme } from './theme-scores';
export interface PatternMapItem { theme: TimingTheme; score: number; note: string; }
export function buildPatternMap(scores: ThemeScoreMap): PatternMapItem[] { return Object.entries(scores).map(([theme, score]) => ({ theme: theme as TimingTheme, score, note: score > 1 ? 'Elevated observation theme' : 'Background theme' })).sort((a, b) => b.score - a.score); }
