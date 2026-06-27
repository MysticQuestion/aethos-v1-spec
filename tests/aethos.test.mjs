import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Aethos app defines required MVP routes', () => {
  const source = readFileSync('src/app/main.ts', 'utf8');
  for (const route of ['/onboarding', '/dashboard', '/profile', '/journal', '/reports', '/methodology', '/settings']) {
    assert.match(source, new RegExp(`['\"]${route}['\"]`));
  }
});

test('No forbidden deterministic fate language appears in app source', () => {
  const source = readFileSync('src/app/main.ts', 'utf8').toLowerCase();
  for (const phrase of ['unlock your destiny', 'guaranteed prediction', 'ai psychic']) {
    assert.equal(new RegExp(`\\b${phrase}\\b`).test(source), false);
  }
});
