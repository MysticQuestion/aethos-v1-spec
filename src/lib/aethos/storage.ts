import { generateAethosProfile } from './profile';
import { generateTimingWindows } from './timing';
import type { AethosState, BirthIntake, JournalEntry, StorageMode, AethosReport } from './types';

const STORAGE_KEY = 'aethos.local.state.v1';

export function getStorageMode(): StorageMode {
  const env = import.meta.env as Record<string, string | undefined>;
  return env.VITE_SUPABASE_URL && (env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY) ? 'supabase' : 'local';
}

export function emptyState(): AethosState {
  const profile = generateAethosProfile();
  return { profile, journalEntries: [], reports: [], timingWindows: generateTimingWindows(profile) };
}

export function loadLocalAethosState(): AethosState {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyState();
  const parsed = JSON.parse(raw) as AethosState;
  return { ...emptyState(), ...parsed };
}

export function saveLocalAethosState(state: AethosState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearLocalAethosState(): AethosState {
  window.localStorage.removeItem(STORAGE_KEY);
  return emptyState();
}

export function upsertIntake(state: AethosState, intake: BirthIntake): AethosState {
  const profile = generateAethosProfile(intake);
  return { ...state, intake, profile, timingWindows: generateTimingWindows(profile) };
}

export function addJournalEntry(state: AethosState, entry: JournalEntry): AethosState {
  return { ...state, journalEntries: [entry, ...state.journalEntries] };
}

export function addReport(state: AethosState, report: AethosReport): AethosState {
  return { ...state, reports: [report, ...state.reports] };
}
