/**
 * Check the answer grader.
 *
 * Two ways this can fail and both are silent. It can start rejecting correct
 * answers written differently, which destroys a reader's trust in it — and a
 * grader nobody believes is worse than none. Or it can start accepting wrong
 * ones, which is worse still.
 *
 * The fixture covers both directions deliberately.
 */

import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { join } from 'node:path';

interface Case {
  reference: string;
  mode: string;
  expect: boolean;
  given: string;
  variable: string;
}

const FIXTURE = join(process.cwd(), 'scripts', 'fixtures', 'grading.md');

const lines = (await readFile(FIXTURE, 'utf8')).split('\n');
const cases: Case[] = [];
let inBlock = false;

for (const raw of lines) {
  if (raw.trim() === '```grade fixture') { inBlock = true; continue; }
  if (inBlock && raw.trim().startsWith('```')) { inBlock = false; continue; }
  if (!inBlock) continue;

  const line = raw.trim();
  if (!line || line.startsWith('#')) continue;

  const parts = line.split('|').map((p) => p.trim());
  // A fifth column names the variables, for answers in more than one. It is
  // optional: a calculus problem has only x.
  if (parts.length < 4 || parts.length > 5) {
    console.log(`  FAIL malformed fixture line: ${line}`);
    process.exit(1);
  }
  cases.push({
    reference: parts[0],
    mode: parts[1],
    expect: parts[2] === 'yes',
    given: parts[3],
    variable: parts[4] || 'x',
  });
}

if (cases.length === 0) {
  console.log('The grading fixture is empty — this would pass without testing anything.');
  process.exit(1);
}

const results = await new Promise<Array<Case & { correct: boolean; detail: string }>>(
  (resolve, reject) => {
    const py = spawn('python3', [join(process.cwd(), 'scripts', 'grade_answer.py')], {
      cwd: join(process.cwd(), 'scripts'),
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
    // The grader reads `var`; the fixture column is called `variable`.
    py.stdin.end(JSON.stringify(cases.map((c) => ({ ...c, var: c.variable }))));
  },
);

let failures = 0;
for (let i = 0; i < results.length; ++i) {
  const r = results[i];
  const want = cases[i].expect;
  if (r.correct === want) {
    console.log(`  ok   ${want ? 'accept' : 'reject'}  ${r.given}  (ref ${r.reference})`);
  } else {
    failures++;
    console.log(`  FAIL ${r.given}  (ref ${r.reference})`);
    console.log(`       expected ${want ? 'accept' : 'reject'}, got ${r.correct ? 'accept' : 'reject'} — ${r.detail}`);
  }
}

if (failures > 0) {
  console.log(`\n${failures} of ${results.length} grading cases failed. The grader is not trustworthy.`);
  process.exit(1);
}

const accepted = cases.filter((c) => c.expect).length;
console.log(`\nGrader verified: ${accepted} correct answers accepted, ` +
            `${cases.length - accepted} wrong ones rejected.`);
