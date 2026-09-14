/**
 * Collect the simulation checks declared in the book.
 *
 * A `sim verify` block states an equation of motion, an initial condition, and
 * the closed-form result the chapter claims. The checker integrates the first
 * and compares against the last.
 *
 *     ```sim verify
 *     rates:  x' = v, v' = -4*x
 *     init:   x = 1, v = 0
 *     exact:  x = cos(2*t)
 *     span:   0..6
 *     tol:    1e-4
 *     ```
 *
 * Deliberately declarative. An author states the physics and the claim; nothing
 * here lets them write the comparison themselves, which is the point — a check
 * you can tune until it passes is not a check.
 */

import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { join, relative } from 'node:path';
import { glob } from 'node:fs/promises';

export interface Sim {
  file: string;
  line: number;
  names: string[];
  rates: Record<string, string>;
  init: Record<string, number>;
  exact_var: string;
  exact: string;
  span: [number, number];
  tol: number;
  source: string;
}

export type SimVerdict = Sim & { status: 'ok' | 'wrong'; detail: string };

const ROOT = process.cwd();

function parseBlock(body: string, file: string, line: number): Sim | string {
  const fields: Record<string, string> = {};
  for (const raw of body.split('\n')) {
    const text = raw.split('#')[0].trim();
    if (!text) continue;
    const at = text.indexOf(':');
    if (at < 0) return `"${text}" is not a "key: value" line`;
    fields[text.slice(0, at).trim()] = text.slice(at + 1).trim();
  }

  for (const need of ['rates', 'init', 'exact', 'span', 'tol']) {
    if (!(need in fields)) return `missing "${need}:"`;
  }

  const rates: Record<string, string> = {};
  const names: string[] = [];
  for (const piece of fields.rates.split(/,(?![^(]*\))/)) {
    const m = piece.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)'\s*=\s*(.+)$/);
    if (!m) return `"${piece.trim()}" is not of the form "x' = expression"`;
    names.push(m[1]);
    rates[m[1]] = m[2].trim();
  }

  const init: Record<string, number> = {};
  for (const piece of fields.init.split(',')) {
    const m = piece.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(-?[\d.eE+-]+)$/);
    if (!m) return `"${piece.trim()}" is not of the form "x = number"`;
    init[m[1]] = Number(m[2]);
  }
  for (const n of names) if (!(n in init)) return `no initial value given for ${n}`;

  const exactMatch = fields.exact.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
  if (!exactMatch) return `"exact:" must read "x = expression"`;

  const spanMatch = fields.span.match(/^(-?[\d.]+)\s*\.\.\s*(-?[\d.]+)$/);
  if (!spanMatch) return `"span:" must read "a..b"`;

  return {
    file,
    line,
    names,
    rates,
    init,
    exact_var: exactMatch[1],
    exact: exactMatch[2].trim(),
    span: [Number(spanMatch[1]), Number(spanMatch[2])],
    tol: Number(fields.tol),
    source: fields.rates,
  };
}

export async function collectSims(dir = 'content'): Promise<{ sims: Sim[]; bad: string[] }> {
  const sims: Sim[] = [];
  const bad: string[] = [];

  for await (const path of glob(join(ROOT, dir, '**', '*.md'))) {
    const rel = relative(ROOT, path);
    const lines = (await readFile(path, 'utf8')).split('\n');

    for (let i = 0; i < lines.length; ++i) {
      if (lines[i].trim() !== '```sim verify') continue;
      const start = i;
      const body: string[] = [];
      for (++i; i < lines.length && !lines[i].trim().startsWith('```'); ++i) body.push(lines[i]);

      const parsed = parseBlock(body.join('\n'), rel, start + 1);
      if (typeof parsed === 'string') bad.push(`${rel}:${start + 1}  ${parsed}`);
      else sims.push(parsed);
    }
  }
  return { sims, bad };
}

export function runSims(sims: Sim[]): Promise<SimVerdict[]> {
  return new Promise((resolve, reject) => {
    const py = spawn('python3', [join(ROOT, 'scripts', 'check_sim.py')]);
    let out = '';
    let err = '';
    py.stdout.on('data', (d) => (out += d));
    py.stderr.on('data', (d) => (err += d));
    py.on('error', reject);
    py.on('close', (code) => {
      if (code !== 0) return reject(new Error(err.trim() || `python exited ${code}`));
      try {
        resolve(JSON.parse(out) as SimVerdict[]);
      } catch {
        reject(new Error(`could not read the checker's output: ${out.slice(0, 300)}`));
      }
    });
    py.stdin.end(JSON.stringify(sims));
  });
}
