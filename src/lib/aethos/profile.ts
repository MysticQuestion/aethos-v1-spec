import type { AethosProfile, BirthIntake, SymbolicSystem } from './types';

export function normalizeBirthLocationInput(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

export function validateBirthIntake(intake: Partial<BirthIntake>): string[] {
  const errors: string[] = [];
  if (!intake.displayName?.trim()) errors.push('Display name is required.');
  if (!intake.birthDate) errors.push('Birth date is required.');
  if (!intake.birthTimeUnknown && !intake.birthTime) errors.push('Birth time is required unless unknown time is selected.');
  if (!intake.birthLocation?.trim()) errors.push('Birth location is required.');
  if (!intake.intention) errors.push('Primary intention is required.');
  if (!intake.preferredSystems?.length) errors.push('Choose at least one system or journaling signal.');
  return errors;
}

export function createSampleAethosProfile(): AethosProfile {
  return {
    id: 'sample-profile',
    displayName: 'Sample Seeker',
    isSample: true,
    identitySummary: 'A sample profile showing how Aethos organizes symbolic lenses, reflection, and timing context without claiming certainty.',
    corePatterns: ['Pattern recognition through reflective writing', 'Preference for structured self-inquiry', 'Sensitivity to transition periods'],
    strengths: ['Discernment', 'Creative synthesis', 'Capacity for patient observation'],
    growthEdges: ['Avoid treating symbolic language as authority', 'Test insights against lived evidence', 'Name uncertainty before acting'],
    timingSensitivities: ['Decision pressure', 'Identity transitions', 'Recovery and integration windows'],
    reflectionPrompts: ['What pattern is repeating, and what evidence supports that?', 'What choice preserves agency?', 'What would make this interpretation more or less useful?'],
    systems: ['western-astrology', 'human-design', 'numerology', 'journaling'],
    confidence: 'sample',
    updatedAt: new Date().toISOString(),
  };
}

export function generateAethosProfile(intake?: BirthIntake): AethosProfile {
  if (!intake) return createSampleAethosProfile();
  const systems = intake.preferredSystems.filter((system): system is SymbolicSystem => Boolean(system));
  return {
    id: `profile-${Date.now()}`,
    displayName: intake.displayName,
    isSample: false,
    identitySummary: `${intake.displayName} is building a structured profile around ${intake.intention.replace('-', ' ')}. This profile uses symbolic systems as interpretive lenses and journal evidence as grounding data.`,
    corePatterns: ['Self-observation before conclusion', 'Timing awareness as context', 'Personal synthesis across multiple lenses'],
    strengths: ['Reflective discipline', 'Pattern literacy', 'Ability to hold nuance'],
    growthEdges: ['Separate correlation from causation', 'Keep interpretations provisional', 'Return to direct lived evidence'],
    timingSensitivities: ['High-change weeks', 'Decision-making windows', 'Periods requiring rest and integration'],
    reflectionPrompts: ['What changed in the body, behavior, and environment?', 'Which interpretation is useful without becoming deterministic?', 'What action is reversible, kind, and evidence-aware?'],
    systems,
    confidence: intake.birthTimeUnknown ? 'medium' : 'high',
    updatedAt: new Date().toISOString(),
  };
}
