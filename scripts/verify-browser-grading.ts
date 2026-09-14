/**
 * The two graders must agree.
 *
 * `scripts/grade_answer.py` decides equivalence symbolically and is the
 * authority; `src/lib/answer.ts` decides it numerically and is what a reader
 * actually meets on the page. Those are different methods, and nothing but this
 * script stops them drifting apart.
 *
 * Drift here is worse than an ordinary bug. A reader told their correct answer
 * is wrong does not file an issue — they conclude the book is broken and stop
 * trusting every verdict it gives them, including the true ones. So every case
 * in the grading fixture and every answer listed in every problem is run
 * through both graders, and one mismatched verdict fails the build.
 *
 * When it does fail, the Python verdict is right by definition. Fix the
 * TypeScript.
 */

import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { join, relative, basename } from 'node:path';
import { glob } from 'node:fs/promises';

import { grade, type Mode } from '../src/lib/answer.ts';

const ROOT = process.cwd();

interface Case {
  readonly where: string;
  readonly given: string;
  readonly reference: string;
  readonly mode: Mode;
  readonly variable: string;
  readonly positive: string;
}

function field(body: string, name: string): string | null {
  const m = body.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : null;
}

function list(body: string, name: string): string[] {
  const m = body.match(new RegExp(`^${name}:\\s*\\n((?:\\s+- .*\\n?)+)`, 'm'));
  if (!m) return [];
  return m[1].split('\n').map((l) => l.replace(/^\s*-\s*/, '').trim()).filter(Boolean);
}

async function fromFixture(): Promise<Case[]> {
  const path = join(ROOT, 'scripts', 'fixtures', 'grading.md');
  const text = await readFile(path, 'utf8');
  const block = /```grade fixture\n([\s\S]*?)```/.exec(text);
  if (!block) throw new Error('scripts/fixtures/grading.md has no `grade fixture` block');

  return block[1]
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((line) => {
      const [reference, mode, , given, variables] = line.split('|').map((s) => s.trim());
      return {
        where: 'fixture',
        given,
        reference,
        mode: mode as Mode,
        // The fifth column is optional and names the variables; a calculus
        // problem has only x. Dropping it here would hand the browser grader a
        // different question from the one SymPy was asked, and every
        // multi-variable case would "disagree" for no reason.
        variable: variables || 'x',
        positive: '',
      };
    });
}

async function fromProblems(): Promise<Case[]> {
  const out: Case[] = [];
  for await (const path of glob(join(ROOT, 'content', 'exercises', '*.md'))) {
    const id = basename(path, '.md');
    const text = await readFile(path, 'utf8');
    for (const [, body] of text.matchAll(/```answer\n([\s\S]*?)```/g)) {
      const reference = field(body, 'reference');
      if (!reference) continue;
      const mode = (field(body, 'mode') ?? 'expression') as Mode;
      const variable = field(body, 'variable') ?? 'x';
      const positive = field(body, 'positive') ?? '';
      const where = `${id}  ${field(body, 'prompt') ?? ''}`;
      for (const given of [reference, ...list(body, 'accept'), ...list(body, 'reject')]) {
        out.push({ where, given, reference, mode, variable, positive });
      }
    }
  }
  return out;
}

function askPython(cases: Case[]): Promise<Array<{ correct: boolean; detail: string }>> {
  return new Promise((resolve, reject) => {
    const py = spawn('python3', [join(ROOT, 'scripts', 'grade_answer.py')], {
      cwd: join(ROOT, 'scripts'),
    });
    let out = '';
    let err = '';
    py.stdout.on('data', (d) => (out += d));
    py.stderr.on('data', (d) => (err += d));
    py.on('error', reject);
    py.on('close', (code) => {
      if (code !== 0) return reject(new Error(err.trim() || `python exited ${code}`));
      resolve(JSON.parse(out));
    });
    py.stdin.end(JSON.stringify(
      cases.map((c) => ({
        given: c.given, reference: c.reference, mode: c.mode,
        var: c.variable, positive: c.positive,
      })),
    ));
  });
}

const cases = [...(await fromFixture()), ...(await fromProblems())];
const authoritative = await askPython(cases);

let mismatches = 0;

cases.forEach((c, i) => {
  const python = authoritative[i].correct;
  const browser = grade(c.given, c.reference, c.mode, c.variable, c.positive);
  if (python === browser.correct) return;

  mismatches++;
  console.log(`  DISAGREE  ${c.where}`);
  console.log(`            reference "${c.reference}"  answer "${c.given}"  (${c.mode})`);
  console.log(`            SymPy says ${python ? 'correct' : 'wrong'}: ${authoritative[i].detail}`);
  console.log(`            browser says ${browser.correct ? 'correct' : 'wrong'}: ${browser.detail}`);
});

if (mismatches === 0) {
  const accepted = authoritative.filter((a) => a.correct).length;
  console.log(
    `\nBoth graders agree on all ${cases.length} answers ` +
    `(${accepted} accepted, ${cases.length - accepted} rejected).`,
  );
  process.exit(0);
}

console.log(`\n${mismatches} of ${cases.length} answers are graded differently in the browser.`);
console.log('The Python verdict is the correct one. Fix src/lib/answer.ts.');
process.exit(1);
