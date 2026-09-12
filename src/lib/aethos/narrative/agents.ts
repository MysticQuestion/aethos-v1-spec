export interface AgentOutput { agent: string; notes: string[]; }
export function ConflictAgent(): AgentOutput { return { agent: 'ConflictAgent', notes: ['Identify pressure without framing it as fate.'] }; }
export function CharacterAgent(): AgentOutput { return { agent: 'CharacterAgent', notes: ['Describe agency, values, and observed habits.'] }; }
export function SettingAgent(): AgentOutput { return { agent: 'SettingAgent', notes: ['Name timing context and environmental constraints.'] }; }
export function PlotAgent(): AgentOutput { return { agent: 'PlotAgent', notes: ['Sequence start, peak, end, and reflection prompts.'] }; }
export function ExpositionAgent(): AgentOutput { return { agent: 'ExpositionAgent', notes: ['Open with data mode and interpretive limits.'] }; }
export function RisingActionAgent(): AgentOutput { return { agent: 'RisingActionAgent', notes: ['Summarize theme escalation and journal signals.'] }; }
export function ClimaxAgent(): AgentOutput { return { agent: 'ClimaxAgent', notes: ['Highlight the highest-reflection window.'] }; }
export function FallingActionAgent(): AgentOutput { return { agent: 'FallingActionAgent', notes: ['Offer integration practices, not prescriptions.'] }; }
export function ResolutionAgent(): AgentOutput { return { agent: 'ResolutionAgent', notes: ['Close with agency-preserving next steps.'] }; }
