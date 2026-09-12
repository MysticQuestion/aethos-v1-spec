import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function read(path) { return readFileSync(path, 'utf8'); }

test('Aethos app defines required MVP and timing lab routes', () => {
  const source = read('src/app/main.ts');
  for (const route of ['/onboarding', '/dashboard', '/profile', '/journal', '/reports', '/methodology', '/settings', '/timing-lab']) {
    assert.match(source, new RegExp(`['\"]${route}['\"]`));
  }
});

test('No forbidden deterministic fate language appears in app source', () => {
  const source = read('src/app/main.ts').toLowerCase();
  for (const phrase of ['unlock your destiny', 'guaranteed prediction', 'ai psychic']) {
    assert.equal(new RegExp(`\\b${phrase}\\b`).test(source), false);
  }
});

test('Astro kernel exposes deterministic utility functions', () => {
  assert.match(read('src/lib/aethos/astrology/signs.ts'), /export function decimalToZodiac/);
  assert.match(read('src/lib/aethos/astrology/signs.ts'), /export function normalizeLongitude/);
  assert.match(read('src/lib/aethos/astrology/aspects.ts'), /export function calculateAspect/);
  assert.match(read('src/lib/aethos/astrology/retrogrades.ts'), /export function detectRetrograde/);
  assert.match(read('src/lib/aethos/astrology/retrogrades.ts'), /export function detectStation/);
});

test('Timing and calibration layers expose required scoring functions', () => {
  assert.match(read('src/lib/aethos/intelligence/theme-scores.ts'), /export function aggregateThemeScores/);
  assert.match(read('src/lib/aethos/intelligence/confidence.ts'), /export function calculateConfidenceScore/);
  assert.match(read('src/lib/aethos/intelligence/calibration.ts'), /export function compareWindowToBaseline/);
  assert.match(read('src/lib/aethos/reports.ts'), /export function generateAethosReport/);
});

test('Backend/data layer exposes metadata, provider, storage, privacy, and route contracts', () => {
  assert.match(read('src/lib/aethos/astrology/metadata.ts'), /export function createInputHash/);
  assert.match(read('src/lib/aethos/astrology/metadata.ts'), /export function attachCalculationMetadata/);
  assert.match(read('src/lib/aethos/astrology/providers/demo-ephemeris-provider.ts'), /DemoEphemerisProviderV2/);
  assert.match(read('src/lib/aethos/astrology/providers/provider-status.ts'), /Demo ephemeris provider active/);
  assert.match(read('src/lib/aethos/storage/storage-router.ts'), /export function getActiveStorageMode/);
  assert.match(read('src/lib/aethos/storage/storage-router.ts'), /export function exportAethosData/);
  assert.match(read('src/lib/aethos/storage/data-delete.ts'), /export function deleteLocalAethosData/);
  assert.match(read('src/lib/aethos/api/contracts.ts'), /POST \/api\/aethos\/chart/);
  assert.match(read('src/app/main.ts'), /id="export"/);
});
