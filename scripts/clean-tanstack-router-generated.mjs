#!/usr/bin/env node
import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const candidates = [
  'src/routeTree.gen.ts',
  'src/routeTree.gen.tsx',
  'src/routes/routeTree.gen.ts',
  'src/routes/routeTree.gen.tsx',
];

let removed = 0;
for (const candidate of candidates) {
  const path = resolve(process.cwd(), candidate);
  if (existsSync(path)) {
    rmSync(path, { force: true });
    removed += 1;
    console.log(`[route-tree] removed stale generated file path=${path}`);
  }
}

console.log(`[route-tree] prebuild cleanup complete removed=${removed}`);
