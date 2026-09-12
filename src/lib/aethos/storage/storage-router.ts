import type { AethosProfile, AethosReport, BirthIntake } from '../types';
import type { NatalChart } from '../astrology/natal';
import type { TransitEvent } from '../astrology/transits';
import type { IntelligenceTimingWindow } from '../astrology/timing-windows';
import type { JournalEntry } from '../types';
import { readLocalJson, writeLocalJson } from './local-store';
import { isSupabaseConfigured } from './supabase-store';
import { createExportEnvelope } from './data-export';
import { deleteLocalAethosData, deleteProfileData } from './data-delete';

const keys = { profile: 'aethos.storage.profile.v1', birthIntake: 'aethos.storage.birthIntake.v1', natalChart: 'aethos.storage.natalChart.v1', transitEvents: 'aethos.storage.transitEvents.v1', timingWindows: 'aethos.storage.timingWindows.v1', journalEntries: 'aethos.storage.journalEntries.v1', reports: 'aethos.storage.reports.v1' } as const;
export type ActiveStorageMode = 'local' | 'supabase';
export function getActiveStorageMode(): ActiveStorageMode { return isSupabaseConfigured() ? 'supabase' : 'local'; }
export function getAethosStorageMode(): ActiveStorageMode { return getActiveStorageMode(); }
export function saveProfile(profile: AethosProfile): void { writeLocalJson(keys.profile, profile); }
export function loadProfile(): AethosProfile | null { return readLocalJson<AethosProfile | null>(keys.profile, null); }
export function saveBirthIntake(intake: BirthIntake): void { writeLocalJson(keys.birthIntake, intake); }
export function saveNatalChart(chart: NatalChart): void { writeLocalJson(keys.natalChart, chart); }
export function saveTransitEvents(events: TransitEvent[]): void { writeLocalJson(keys.transitEvents, events); }
export function saveTimingWindows(windows: IntelligenceTimingWindow[]): void { writeLocalJson(keys.timingWindows, windows); }
export function loadTimingWindows(): IntelligenceTimingWindow[] { return readLocalJson<IntelligenceTimingWindow[]>(keys.timingWindows, []); }
export function saveJournalEntry(entry: JournalEntry): void { writeLocalJson(keys.journalEntries, [entry, ...loadJournalEntries()]); }
export function loadJournalEntries(): JournalEntry[] { return readLocalJson<JournalEntry[]>(keys.journalEntries, []); }
export function saveReport(report: AethosReport): void { writeLocalJson(keys.reports, [report, ...loadReports()]); }
export function loadReports(): AethosReport[] { return readLocalJson<AethosReport[]>(keys.reports, []); }
export function exportAethosData(): string { const payload = Object.fromEntries(Object.entries(keys).map(([name, key]) => [name, readLocalJson<unknown>(key, null)])); return JSON.stringify(createExportEnvelope(payload, getActiveStorageMode()), null, 2); }
export function importAethosData(json: string): void { const envelope = JSON.parse(json) as { payload?: Record<string, unknown> }; if (!envelope.payload) throw new Error('Invalid Aethos export payload.'); for (const [name, value] of Object.entries(envelope.payload)) { const key = keys[name as keyof typeof keys]; if (key) writeLocalJson(key, value); } }
export { deleteLocalAethosData, deleteProfileData };
