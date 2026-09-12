import type { TransitEvent } from '../astrology/transits';

export type TimingTheme = 'Agency' | 'Inner Life' | 'Structure' | 'Expression' | 'Relational Patterns' | 'Material Stability' | 'Conflict' | 'Renewal' | 'Visibility' | 'Rest' | 'Decision Pressure' | 'Communication' | 'Revision';
export type ThemeScoreMap = Record<TimingTheme, number>;

export const THEMES: TimingTheme[] = ['Agency', 'Inner Life', 'Structure', 'Expression', 'Relational Patterns', 'Material Stability', 'Conflict', 'Renewal', 'Visibility', 'Rest', 'Decision Pressure', 'Communication', 'Revision'];
export function emptyThemeScores(): ThemeScoreMap { return Object.fromEntries(THEMES.map((theme) => [theme, 0])) as ThemeScoreMap; }

export function mapTransitToThemeScore(event: TransitEvent): ThemeScoreMap {
  const scores = emptyThemeScores();
  const hard = ['conjunction', 'opposition', 'square'].includes(event.aspect.type);
  const weight = Math.max(0.1, 1 - event.orb / 8);
  if (['Mars', 'Sun'].includes(event.transitBody) || ['Mars', 'Sun'].includes(event.natalTarget)) scores.Agency += weight;
  if (event.transitBody === 'Mars' && hard) { scores.Conflict += weight; scores['Decision Pressure'] += weight * 0.7; }
  if (event.transitBody === 'Saturn' && hard) { scores.Structure += weight; scores['Decision Pressure'] += weight * 0.8; }
  if (event.transitBody === 'Venus') scores['Relational Patterns'] += weight;
  if (event.transitBody === 'Mercury') { scores.Communication += weight; if (event.transitPosition.speedInLongitude <= 0.02) scores.Revision += weight; }
  if (event.transitBody === 'Moon') { scores['Inner Life'] += weight; scores.Rest += weight * 0.4; }
  if (['Jupiter', 'Sun'].includes(event.transitBody)) scores.Visibility += weight * 0.6;
  if (['Pluto', 'Uranus', 'Neptune'].includes(event.transitBody)) scores.Renewal += weight * 0.5;
  return scores;
}

export function aggregateThemeScores(events: TransitEvent[]): ThemeScoreMap {
  const aggregate = emptyThemeScores();
  for (const event of events) {
    const scores = mapTransitToThemeScore(event);
    for (const theme of THEMES) aggregate[theme] = Number((aggregate[theme] + scores[theme]).toFixed(3));
  }
  return aggregate;
}
