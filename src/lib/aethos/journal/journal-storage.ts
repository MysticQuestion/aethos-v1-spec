import { clampScale } from './ema';
import { extractEmaTags, getEntriesForDateRange } from './journal-analysis';
import type { EmaJournalEntry } from './journal-types';

export function createJournalEntry(input: Partial<EmaJournalEntry> & { freeText: string }): EmaJournalEntry { const now = new Date().toISOString(); return { id: input.id ?? `ema-${Date.now()}`, mood: clampScale(input.mood ?? 5), stress: clampScale(input.stress ?? 5), focus: clampScale(input.focus ?? 5), sleepQuality: clampScale(input.sleepQuality ?? 5), socialConnection: clampScale(input.socialConnection ?? 5), conflictLevel: clampScale(input.conflictLevel ?? 5), creativity: clampScale(input.creativity ?? 5), decisionPressure: clampScale(input.decisionPressure ?? 5), bodyEnergy: clampScale(input.bodyEnergy ?? 5), clarity: clampScale(input.clarity ?? 5), freeText: input.freeText.trim(), tags: input.tags?.length ? input.tags : extractEmaTags(input.freeText), linkedTimingWindowIds: input.linkedTimingWindowIds ?? [], createdAt: input.createdAt ?? now, updatedAt: now }; }
export function updateJournalEntry(entries: EmaJournalEntry[], id: string, patch: Partial<EmaJournalEntry>): EmaJournalEntry[] { return entries.map((entry) => entry.id === id ? { ...entry, ...patch, updatedAt: new Date().toISOString() } : entry); }
export function deleteJournalEntry(entries: EmaJournalEntry[], id: string): EmaJournalEntry[] { return entries.filter((entry) => entry.id !== id); }
export { getEntriesForDateRange };
