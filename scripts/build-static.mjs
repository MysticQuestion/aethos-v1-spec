import { mkdirSync, copyFileSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { execFileSync } from 'node:child_process';

execFileSync('tsc', ['-p', 'tsconfig.build.json'], { stdio: 'inherit' });
mkdirSync('dist/src/app', { recursive: true });
copyFileSync('src/app/styles.css', 'dist/src/app/styles.css');
let html = readFileSync('index.html', 'utf8').replace('/src/app/main.ts', '/src/app/main.js');
writeFileSync('dist/index.html', html);
copyFileSync('vercel.json', 'dist/vercel.json');

function rewriteImports(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) rewriteImports(path);
    if (!path.endsWith('.js')) continue;
    let source = readFileSync(path, 'utf8');
    source = source.replace(/from '([^'.][^']*)'/g, "from '$1.js'");
    source = source.replace(/from '(\.{1,2}\/[^']+)'/g, (full, spec) => spec.endsWith('.js') ? full : `from '${spec}.js'`);
    source = source.replace(/import '(\.\/[^']+\.css)'/g, "import '$1'");
    writeFileSync(path, source);
  }
}
rewriteImports('dist/src');
console.log('Built static Aethos app to dist/');
