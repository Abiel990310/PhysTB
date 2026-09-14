/**
 * Scanning and checking of the book's mathematical claims.
 *
 * This is what `npm run verify:snippets` is to the compiled books: the step
 * that decides whether the prose is allowed to say what it says. A chapter
 * whose mathematics does not check does not ship.
 *
 * Claims live in fenced blocks that read like a textbook:
 *
 *     ```math verify
 *     d/dx x**3 = 3*x**2
 *     int x*exp(x) dx = exp(x)*(x - 1) + C
 *     lim x->0 sin(x)/x = 1
 *     sum n=0..oo 1/2**n = 2
 *     sin(x)**2 + cos(x)**2 = 1
 *     ```
 *
 * SymPy decides each one. Anything it cannot decide is reported as `unproved`
 * and fails the run — not because the claim is wrong, but because the book may
 * not assert something no program could check. Rewrite it into a form that
 * checks, or delete it.
 */

import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { join, relative } from 'node:path';
import { glob } from 'node:fs/promises';

export interface Claim {
  file: string;
  line: number;
  source: string;
  kind: 'deriv' | 'integ' | 'limit' | 'sum' | 'ident';
  lhs: string;
  rhs: string;
  var?: string;
  to?: string;
  lo?: string;
  hi?: string;
  /** Symbols the block declares positive, via `# assume: m > 0`. */
  positive?: string[];
  /** Multi-character symbols the block declares, via `# symbols: v0, x0`. */
  symbols?: string[];
}

export type Verdict = Claim & { status: 'ok' | 'wrong' | 'unproved'; detail: string | null };

const ROOT = process.cwd();


/** Split on the last top-level `=`, so `d/dx x = 1` survives an `=` inside. */
export function splitClaim(text: string): [string, string] | null {
  let depth = 0;
  for (let i = text.length - 1; i >= 0; --i) {
    const c = text[i];
    if (c === ')') depth++;
    else if (c === '(') depth--;
    else if (c === '=' && depth === 0 && text[i - 1] !== '<' && text[i + 1] !== '=') {
      return [text.slice(0, i).trim(), text.slice(i + 1).trim()];
    }
  }
  return null;
}

export function parseClaim(source: string, file: string, line: number): Claim | string {
  const split = splitClaim(source);
  if (!split) return 'no top-level "=" — a claim must state what equals what';
  const [left, rhs] = split;

  let m = left.match(/^d\/d([a-zA-Z])\s+(.+)$/);
  if (m) return { file, line, source, kind: 'deriv', var: m[1], lhs: m[2], rhs };

  m = left.match(/^int\s+(.+?)\s+d([a-zA-Z])$/);
  if (m) return { file, line, source, kind: 'integ', var: m[2], lhs: m[1], rhs };

  m = left.match(/^lim\s+([a-zA-Z])\s*->\s*(\S+)\s+(.+)$/);
  if (m) return { file, line, source, kind: 'limit', var: m[1], to: m[2], lhs: m[3], rhs };

  m = left.match(/^sum\s+([a-zA-Z])\s*=\s*(\S+?)\.\.(\S+)\s+(.+)$/);
  if (m)
    return { file, line, source, kind: 'sum', var: m[1], lo: m[2], hi: m[3], lhs: m[4], rhs };

  return { file, line, source, kind: 'ident', lhs: left, rhs };
}

export async function collect(dir = 'content'): Promise<{ claims: Claim[]; bad: string[] }> {
  const claims: Claim[] = [];
  const bad: string[] = [];

  for await (const path of glob(join(ROOT, dir, '**', '*.md'))) {
    const rel = relative(ROOT, path);
    const lines = (await readFile(path, 'utf8')).split('\n');
    let inBlock = false;
    let positive: string[] = [];
    let symbols: string[] = [];

    for (let i = 0; i < lines.length; ++i) {
      const line = lines[i];
      if (/^```math\s+verify\s*$/.test(line.trim())) {
        inBlock = true;
        positive = [];
        symbols = [];
        continue;
      }
      if (inBlock && line.trim().startsWith('```')) { inBlock = false; continue; }
      if (!inBlock) continue;

      const assume = line.match(/^\s*#\s*assume:\s*(.+)$/);
      if (assume) {
        // "b > 0, m > 0" -> ['b', 'm']. Only positivity is supported; anything
        // else would need a richer assumption model than this book has needed.
        positive = assume[1]
          .split(',')
          .map((c) => c.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)\s*>\s*0$/)?.[1])
          .filter((n): n is string => Boolean(n));
        continue;
      }

      // "# symbols: v0, x0" keeps those names whole. SymPy splits an unfamiliar
      // multi-character symbol into single-letter factors, so `v0` would
      // otherwise parse as v times 0 — the number zero — with no error
      // anywhere. Physics notation is full of subscripts; this is how a claim
      // gets to use the same letters the prose does.
      const declare = line.match(/^\s*#\s*symbols:\s*(.+)$/);
      if (declare) {
        symbols = declare[1]
          .split(/[\s,]+/)
          .filter((n) => /^[A-Za-z_]\w*$/.test(n));
        continue;
      }

      const text = line.split('#')[0].trim();       // `#` starts a comment
      if (!text) continue;

      const parsed = parseClaim(text, rel, i + 1);
      if (typeof parsed === 'string') bad.push(`${rel}:${i + 1}  ${text}\n         ${parsed}`);
      else {
        claims.push({
          ...parsed,
          ...(positive.length > 0 ? { positive } : {}),
          ...(symbols.length > 0 ? { symbols } : {}),
        });
      }
    }
  }
  return { claims, bad };
}

export function runPython(claims: Claim[]): Promise<Verdict[]> {
  return new Promise((resolve, reject) => {
    const py = spawn('python3', [join(ROOT, 'scripts', 'check_math.py')]);
    let out = '';
    let err = '';
    py.stdout.on('data', (d) => (out += d));
    py.stderr.on('data', (d) => (err += d));
    py.on('error', reject);
    py.on('close', (code) => {
      if (code !== 0) return reject(new Error(err.trim() || `python exited ${code}`));
      try {
        resolve(JSON.parse(out) as Verdict[]);
      } catch {
        reject(new Error(`could not read the checker's output: ${out.slice(0, 400)}`));
      }
    });
    py.stdin.end(JSON.stringify(claims));
  });
}

