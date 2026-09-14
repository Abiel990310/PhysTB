/**
 * Verify every practice problem.
 *
 * A problem states a question, a reference answer, and a list of answers that
 * must be accepted and rejected. This runs all of them through the same grader
 * a reader's submission goes through, so a problem cannot ship claiming an
 * answer is acceptable when the grader would refuse it.
 *
 * The rejected list is not optional. A problem whose grader accepts everything
 * is not a problem, and requiring at least one rejection makes that impossible
 * to ship by accident.
 */

import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { join, relative, basename } from 'node:path';
import { glob } from 'node:fs/promises';

interface Part {
  id: string;
  file: string;
  prompt: string;
  reference: string;
  mode: string;
  variable: string;
  positive: string;
  accept: string[];
  reject: string[];
}

const ROOT = process.cwd();

function field(body: string, name: string): string | null {
  const m = body.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : null;
}

function list(body: string, name: string): string[] {
  const m = body.match(new RegExp(`^${name}:\\s*\\n((?:\\s+- .*\\n?)+)`, 'm'));
  if (!m) return [];
  return m[1]
    .split('\n')
    .map((l) => l.replace(/^\s*-\s*/, '').trim())
    .filter(Boolean);
}

async function collect(): Promise<{ parts: Part[]; bad: string[] }> {
  const parts: Part[] = [];
  const bad: string[] = [];

  for await (const path of glob(join(ROOT, 'content', 'exercises', '*.md'))) {
    const rel = relative(ROOT, path);
    const text = await readFile(path, 'utf8');
    const id = basename(path, '.md');

    const blocks = [...text.matchAll(/```answer\n([\s\S]*?)```/g)].map((m) => m[1]);
    if (blocks.length === 0) {
      bad.push(`${rel}  has no \`\`\`answer block`);
      continue;
    }

    for (const body of blocks) {
      const reference = field(body, 'reference');
      const prompt = field(body, 'prompt');
      if (!reference) { bad.push(`${rel}  an answer block has no "reference:"`); continue; }
      if (!prompt) { bad.push(`${rel}  an answer block has no "prompt:"`); continue; }

      const accept = list(body, 'accept');
      const reject = list(body, 'reject');

      if (reject.length === 0) {
        bad.push(`${rel}  "${prompt}" lists nothing under "reject:" — a problem that ` +
                 `accepts everything is not a problem`);
        continue;
      }

      parts.push({
        id,
        file: rel,
        prompt,
        reference,
        mode: field(body, 'mode') ?? 'expression',
        variable: field(body, 'variable') ?? 'x',
        positive: field(body, 'positive') ?? '',
        accept: [reference, ...accept],   // the reference must grade itself correct
        reject,
      });
    }
  }
  return { parts, bad };
}

function gradeAll(items: unknown[]): Promise<Array<{ correct: boolean; detail: string }>> {
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
    py.stdin.end(JSON.stringify(items));
  });
}

const { parts, bad } = await collect();
for (const b of bad) console.log(`  bad  ${b}`);

if (parts.length === 0 && bad.length === 0) {
  console.log('\nNo practice problems yet.');
  process.exit(0);
}

const items = parts.flatMap((p) => [
  ...p.accept.map((given) => ({ given, reference: p.reference, mode: p.mode, var: p.variable, positive: p.positive })),
  ...p.reject.map((given) => ({ given, reference: p.reference, mode: p.mode, var: p.variable, positive: p.positive })),
]);

const graded = await gradeAll(items);

let cursor = 0;
let failures = bad.length;

for (const p of parts) {
  const mine = graded.slice(cursor, cursor + p.accept.length + p.reject.length);
  cursor += mine.length;

  const wrong: string[] = [];
  p.accept.forEach((given, i) => {
    if (!mine[i].correct) wrong.push(`should accept "${given}" — ${mine[i].detail}`);
  });
  p.reject.forEach((given, i) => {
    const r = mine[p.accept.length + i];
    if (r.correct) wrong.push(`should reject "${given}" but accepted it`);
  });

  if (wrong.length === 0) {
    console.log(`  ok   ${p.id}  "${p.prompt}"  (${p.accept.length} accepted, ${p.reject.length} rejected)`);
  } else {
    failures++;
    console.log(`  FAIL ${p.id}  "${p.prompt}"`);
    for (const w of wrong) console.log(`         ${w}`);
  }
}

if (failures === 0) {
  console.log(`\nAll ${parts.length} problems grade as documented.`);
  process.exit(0);
}
console.log(`\n${failures} problems are broken.`);
process.exit(1);
