import type { Scratchpad } from './scratchpad';
export function generatePlanningNotes(scratchpad: Scratchpad): string[] { return [`Inputs: ${scratchpad.sections.INPUT_CONTEXT.length}`, `Timing events: ${scratchpad.sections.TIMING_EVENTS.length}`, 'Constraint: interpretation must remain non-fatalistic.']; }
export function generateReportDraft(scratchpad: Scratchpad): string { return `## Narrative synthesis draft\n\n${scratchpad.sections.PLANNING_NOTES.join('\n')}\n\n${scratchpad.sections.RESPONSIBLE_USE_NOTES.join('\n')}`; }
export function generateFinalReport(draft: string): string { return `${draft}\n\nAethos supports reflection and planning. It does not replace professional judgment.`; }
