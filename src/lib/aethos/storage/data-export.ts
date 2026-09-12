export interface AethosExportEnvelope<T = unknown> { version: 'aethos-export-v1'; exportedAt: string; storageMode: 'local' | 'supabase'; payload: T; }
export function createExportEnvelope<T>(payload: T, storageMode: 'local' | 'supabase'): AethosExportEnvelope<T> { return { version: 'aethos-export-v1', exportedAt: new Date().toISOString(), storageMode, payload }; }
