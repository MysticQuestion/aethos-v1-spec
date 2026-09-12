#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const candidates = [
  'src/routeTree.gen.ts',
  'src/routeTree.gen.tsx',
  'src/routes/routeTree.gen.ts',
  'src/routes/routeTree.gen.tsx',
];

const found = candidates
  .map((candidate) => resolve(process.cwd(), candidate))
  .filter((path) => existsSync(path));

for (const path of found) {
  console.log(`[route-tree] generated path=${path} timestamp=${new Date().toISOString()}`);
}

if (found.length > 1) {
  console.error('Duplicate TanStack Router routeTree generated files detected');
  for (const path of found) {
    console.error(` - ${path}`);
  }
  process.exit(1);
}

if (found.length === 0) {
  console.warn('[route-tree] no generated route tree file found; verify TanStack Router generation ran during build');
} else {
  console.log(`[route-tree] single generated route tree verified path=${found[0]}`);
}
