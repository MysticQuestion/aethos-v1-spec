import type { AethosProfile, TimingWindow } from './types';

function isoDate(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

export function generateTimingWindows(profile?: AethosProfile): TimingWindow[] {
  const name = profile?.displayName ?? 'Sample';
  return [
    {
      id: 'timing-integration',
      title: `${name}: Integration window`,
      startDate: isoDate(-2),
      peakDate: isoDate(0),
      endDate: isoDate(5),
      domain: 'practice',
      confidence: profile?.isSample ? 'sample' : 'medium',
      summary: 'A context marker for consolidating observations before making larger commitments.',
      prompt: 'What are you ready to integrate before choosing the next step?',
    },
    {
      id: 'timing-decision',
      title: 'Decision clarity window',
      startDate: isoDate(3),
      peakDate: isoDate(7),
      endDate: isoDate(12),
      domain: 'decision',
      confidence: 'medium',
      summary: 'Useful for comparing options, naming constraints, and identifying what evidence is still missing.',
      prompt: 'What would make this decision simpler, safer, and more reversible?',
    },
  ];
}
