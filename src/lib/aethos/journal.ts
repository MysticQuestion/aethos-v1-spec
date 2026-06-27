import type { JournalEntry, JournalTheme } from './types';

const KEYWORDS: Record<string, string[]> = {
  decision: ['choose', 'decision', 'option', 'commit', 'uncertain'],
  timing: ['timing', 'pressure', 'window', 'cycle', 'transition'],
  relationship: ['partner', 'friend', 'family', 'client', 'team'],
  work: ['work', 'project', 'career', 'money', 'deadline'],
  practice: ['meditation', 'ritual', 'study', 'rest', 'practice'],
};

export function extractJournalThemes(body: string): string[] {
  const lower = body.toLowerCase();
  const themes = Object.entries(KEYWORDS)
    .filter(([, words]) => words.some((word) => lower.includes(word)))
    .map(([theme]) => theme);
  return themes.length ? themes : ['reflection'];
}

export function createJournalEntry(input: { mood: number; theme: JournalTheme; decisionContext?: string; body: string }): JournalEntry {
  return {
    id: `journal-${Date.now()}`,
    createdAt: new Date().toISOString(),
    mood: Math.min(10, Math.max(1, input.mood)),
    theme: input.theme,
    decisionContext: input.decisionContext?.trim() || undefined,
    body: input.body.trim(),
    extractedThemes: extractJournalThemes(input.body),
  };
}
