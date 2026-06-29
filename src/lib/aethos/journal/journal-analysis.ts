import type { EmaJournalEntry } from './journal-types';
export function getEntriesForDateRange(entries: EmaJournalEntry[], startDate: string, endDate: string): EmaJournalEntry[] { return entries.filter((entry) => entry.createdAt.slice(0, 10) >= startDate && entry.createdAt.slice(0, 10) <= endDate); }
export function extractEmaTags(text: string): string[] { const lower = text.toLowerCase(); return ['decision', 'stress', 'sleep', 'relationship', 'work', 'creativity'].filter((tag) => lower.includes(tag)); }
