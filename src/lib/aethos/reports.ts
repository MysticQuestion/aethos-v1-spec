import type { AethosProfile, AethosReport, JournalEntry, ReportType, TimingWindow } from './types';

const reportTitles: Record<ReportType, string> = {
  'core-brief': 'Aethos Core Brief',
  'timing-brief': 'Timing Brief',
  'decision-lens': 'Decision Lens',
  'journal-pattern-summary': 'Journal Pattern Summary',
  'practitioner-overview': 'Practitioner Overview',
};

export function generateAethosReport(type: ReportType, profile: AethosProfile, journalEntries: JournalEntry[], timingWindows: TimingWindow[]): AethosReport {
  const generatedAt = new Date().toISOString();
  const themes = [...new Set(journalEntries.flatMap((entry) => entry.extractedThemes))];
  const markdown = `# ${reportTitles[type]}\n\nGenerated: ${generatedAt}\n\n## User / intake summary\n${profile.displayName} has an ${profile.isSample ? 'sample' : 'active'} Aethos profile using ${profile.systems.join(', ')}.\n\n## Core profile summary\n${profile.identitySummary}\n\n## Key themes\n${profile.corePatterns.map((item) => `- ${item}`).join('\n')}\n\n## Timing context\n${timingWindows.map((window) => `- ${window.title}: ${window.summary}`).join('\n')}\n\n## Journal-derived observations\n${themes.length ? themes.map((theme) => `- ${theme}`).join('\n') : '- No journal patterns have been recorded yet.'}\n\n## Confidence notes\n- Confidence describes interpretive strength, source clarity, and user-confirmed relevance.\n- A timing window is not a command. It is a context marker for reflection and decision-making.\n\n## Reflection prompts\n${profile.reflectionPrompts.map((prompt) => `- ${prompt}`).join('\n')}\n\n## Responsible-use note\nAethos supports reflective self-knowledge. It does not provide medical, legal, financial, psychiatric, or guaranteed predictive advice.\n`;
  return {
    id: `report-${type}-${Date.now()}`,
    type,
    title: reportTitles[type],
    generatedAt,
    markdown,
    confidenceNotes: ['Interpretation is provisional.', 'Journal evidence should ground symbolic language.', 'No deterministic prediction is made.'],
  };
}
