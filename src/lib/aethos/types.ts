export type UserIntention = 'self-understanding' | 'timing-clarity' | 'decision-support' | 'journaling' | 'practitioner-report';
export type SymbolicSystem = 'western-astrology' | 'human-design' | 'numerology' | 'journaling' | 'vedic-preview' | 'bazi-preview' | 'i-ching-preview';
export type ConfidenceLevel = 'sample' | 'low' | 'medium' | 'high';
export type StorageMode = 'local' | 'supabase';
export type JournalTheme = 'identity' | 'timing' | 'decision' | 'relationship' | 'work' | 'health-adjacent' | 'practice';
export type ReportType = 'core-brief' | 'timing-brief' | 'decision-lens' | 'journal-pattern-summary' | 'practitioner-overview';

export interface BirthIntake {
  displayName: string;
  birthDate: string;
  birthTime?: string;
  birthTimeUnknown: boolean;
  birthLocation: string;
  currentLocation?: string;
  intention: UserIntention;
  preferredSystems: SymbolicSystem[];
  createdAt: string;
}

export interface AethosProfile {
  id: string;
  displayName: string;
  isSample: boolean;
  identitySummary: string;
  corePatterns: string[];
  strengths: string[];
  growthEdges: string[];
  timingSensitivities: string[];
  reflectionPrompts: string[];
  systems: SymbolicSystem[];
  confidence: ConfidenceLevel;
  updatedAt: string;
}

export interface TimingWindow {
  id: string;
  title: string;
  startDate: string;
  peakDate: string;
  endDate: string;
  domain: JournalTheme;
  confidence: ConfidenceLevel;
  summary: string;
  prompt: string;
}

export interface JournalEntry {
  id: string;
  createdAt: string;
  mood: number;
  theme: JournalTheme;
  decisionContext?: string;
  body: string;
  extractedThemes: string[];
}

export interface AethosReport {
  id: string;
  type: ReportType;
  title: string;
  generatedAt: string;
  markdown: string;
  confidenceNotes: string[];
}

export interface AethosState {
  intake?: BirthIntake;
  profile?: AethosProfile;
  journalEntries: JournalEntry[];
  reports: AethosReport[];
  timingWindows: TimingWindow[];
}
