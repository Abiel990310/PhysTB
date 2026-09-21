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

/**
 * A claim that will not typeset is a claim the reader meets as raw SymPy.
 *
 * `markdown.ts` falls back to plain text so the page is never *wrong*, and
 * that fallback stays — it covers a missing or stale cache. But a claim the
 * pipeline has already looked at and failed to render is a different thing:
 * it is a known defect that ships silently, and one did. Every claim in a
 * block carrying `# symbols:` rendered as source for months because this
 * script's renderer parsed without the declarations the checker used.
 *
 * So: shipping raw SymPy for a proved equation stops the build.
 */
const unrendered = Object.entries(map)
  .filter(([, tex]) => !tex)
  .map(([source]) => source);

if (unrendered.length > 0) {
  console.error(`\n  ${unrendered.length} claim(s) could not be typeset:`);
  for (const source of unrendered) console.error(`    ${source}`);
  console.error(
    '\n  These would reach the reader as raw SymPy source. The cause is almost\n' +
      '  always a declaration the checker has and the renderer does not.\n',
  );
  process.exit(1);
}

await writeFile(OUT, JSON.stringify(map, null, 2), 'utf8');
console.log(`  typeset ${Object.keys(map).length} verified claims`);
