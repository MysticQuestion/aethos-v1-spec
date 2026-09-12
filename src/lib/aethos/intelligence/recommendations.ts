import type { IntelligenceTimingWindow } from '../astrology/timing-windows';
export function recommendReflection(windows: IntelligenceTimingWindow[]): string { return windows[0]?.suggestedReflection ?? 'Begin with one grounded observation from today.'; }
