import type { ReportType, SymbolicSystem, UserIntention } from './types';

export const INTENTIONS: Array<{ value: UserIntention; label: string }> = [
  { value: 'self-understanding', label: 'Self-understanding' },
  { value: 'timing-clarity', label: 'Timing clarity' },
  { value: 'decision-support', label: 'Decision support' },
  { value: 'journaling', label: 'Journaling' },
  { value: 'practitioner-report', label: 'Practitioner report' },
];

export const SYSTEMS: Array<{ value: SymbolicSystem; label: string; status: string }> = [
  { value: 'western-astrology', label: 'Western astrology', status: 'V1 lens' },
  { value: 'human-design', label: 'Human Design', status: 'V1 lens' },
  { value: 'numerology', label: 'Numerology', status: 'V1 lens' },
  { value: 'journaling', label: 'Journaling patterns', status: 'V1 signal' },
  { value: 'vedic-preview', label: 'Vedic astrology', status: 'Research preview' },
  { value: 'bazi-preview', label: 'BaZi', status: 'Research preview' },
  { value: 'i-ching-preview', label: 'I Ching', status: 'Research preview' },
];

export const REPORT_TYPES: Array<{ value: ReportType; label: string; description: string }> = [
  { value: 'core-brief', label: 'Aethos Core Brief', description: 'Identity patterns, strengths, growth edges, and reflection prompts.' },
  { value: 'timing-brief', label: 'Timing Brief', description: 'Current timing windows as context markers, not predictions.' },
  { value: 'decision-lens', label: 'Decision Lens', description: 'Structured considerations for a decision context.' },
  { value: 'journal-pattern-summary', label: 'Journal Pattern Summary', description: 'Observed themes from reflective writing.' },
  { value: 'practitioner-overview', label: 'Practitioner Overview', description: 'A concise handoff for coaching or advisory sessions.' },
];
