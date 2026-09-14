/**
 * Pre-render every verified claim to LaTeX, for the markdown pipeline to use.
 *
 * markdown-it renders synchronously and SymPy is a separate process, so the
 * conversion cannot happen during rendering. This runs before the build,
 * collects the claims, and writes the LaTeX beside them.
 *
 * If the cache is missing or stale, `markdown.ts` falls back to showing the
 * claim as plain text — visibly worse, never wrong.
 */

import { writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { collect } from './math-lib.ts';

const OUT = join(process.cwd(), 'build', 'math-latex.json');

function toLatex(claims: unknown[]): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    const py = spawn('python3', [join(process.cwd(), 'scripts', 'latex_math.py')], {
      cwd: join(process.cwd(), 'scripts'),
    });
    let out = '';
    let err = '';
    py.stdout.on('data', (d) => (out += d));
    py.stderr.on('data', (d) => (err += d));
    py.on('error', reject);
    py.on('close', (code) => {
      if (err.trim()) console.log(err.trim());
      if (code !== 0) return reject(new Error(err.trim() || `python exited ${code}`));
      resolve(JSON.parse(out) as Record<string, string>);
    });
    py.stdin.end(JSON.stringify(claims));
  });
}

const { claims } = await collect();
const map = claims.length > 0 ? await toLatex(claims) : {};
await writeFile(OUT, JSON.stringify(map, null, 2), 'utf8');
console.log(`  typeset ${Object.keys(map).length} verified claims`);
