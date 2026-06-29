import type { AethosProfile } from '../types';
import type { IntelligenceTimingWindow } from '../astrology/timing-windows';
import type { EmaJournalEntry } from '../journal/journal-types';
import { appendScratchpadSection, createScratchpad } from './scratchpad';
import { CharacterAgent, ClimaxAgent, ConflictAgent, ExpositionAgent, FallingActionAgent, PlotAgent, ResolutionAgent, RisingActionAgent, SettingAgent } from './agents';
import { generateFinalReport, generatePlanningNotes, generateReportDraft } from './templates';

export interface OrchestratorInput { profile: AethosProfile; windows: IntelligenceTimingWindow[]; journalEntries: EmaJournalEntry[]; dataMode: string; calculationMode: string; }
export interface OrchestratorResult { scratchpadId: string; agentNotes: string[]; markdown: string; json: Record<string, unknown>; }

export function runNarrativeOrchestrator(input: OrchestratorInput): OrchestratorResult {
  let scratchpad = createScratchpad();
  scratchpad = appendScratchpadSection(scratchpad, 'INPUT_CONTEXT', `${input.profile.displayName} · ${input.dataMode} · ${input.calculationMode}`);
  scratchpad = appendScratchpadSection(scratchpad, 'CHART_FACTS', input.profile.identitySummary);
  for (const window of input.windows) scratchpad = appendScratchpadSection(scratchpad, 'TIMING_EVENTS', `${window.title}: ${window.interpretiveSummary}`);
  scratchpad = appendScratchpadSection(scratchpad, 'JOURNAL_SIGNALS', `${input.journalEntries.length} EMA journal entries available.`);
  scratchpad = appendScratchpadSection(scratchpad, 'INTERPRETIVE_CONSTRAINTS', 'No medical, legal, financial, psychiatric, or guaranteed predictive advice.');
  const agents = [ConflictAgent(), CharacterAgent(), SettingAgent(), PlotAgent(), ExpositionAgent(), RisingActionAgent(), ClimaxAgent(), FallingActionAgent(), ResolutionAgent()];
  const agentNotes = agents.flatMap((agent) => agent.notes.map((note) => `${agent.agent}: ${note}`));
  for (const note of [...generatePlanningNotes(scratchpad), ...agentNotes]) scratchpad = appendScratchpadSection(scratchpad, 'PLANNING_NOTES', note);
  scratchpad = appendScratchpadSection(scratchpad, 'RESPONSIBLE_USE_NOTES', 'This synthesis is a reflective brief, not a prediction.');
  const draft = generateReportDraft(scratchpad);
  const markdown = generateFinalReport(draft);
  return { scratchpadId: scratchpad.id, agentNotes, markdown, json: { scratchpad, agentNotes, inputSummary: { windows: input.windows.length, journalEntries: input.journalEntries.length } } };
}
