/**
 * Check the checker.
 *
 * `verify:math` is the only thing standing between this book and confidently
 * wrong mathematics, so it needs its own test. The fixture holds claims with
 * known verdicts — true ones, false ones, and one that is true but beyond what
 * SymPy will prove — and this asserts that each comes back as expected.
 *
 * The failure this exists to catch is the quiet one: a change that makes the
 * checker stop noticing false claims would otherwise look like a green build.
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseClaim, runPython, type Claim } from './math-lib.ts';

const FIXTURE = join(process.cwd(), 'scripts', 'fixtures', 'selftest.md');

const lines = (await readFile(FIXTURE, 'utf8')).split('\n');
const claims: Claim[] = [];
const expected: string[] = [];

let inBlock = false;
let expecting = '';
let positive: string[] = [];

for (let i = 0; i < lines.length; ++i) {
  const line = lines[i];
  if (/^```math\s+verify\s*$/.test(line.trim())) { inBlock = true; positive = []; continue; }
  if (inBlock && line.trim().startsWith('```')) { inBlock = false; continue; }
  if (!inBlock) continue;

  const marker = line.match(/^\s*#\s*expect:\s*(ok|wrong|unproved)\s*$/);
  if (marker) { expecting = marker[1]; continue; }

  // The fixture exercises author-declared assumptions too, so this parser has
  // to understand them — it reads the file itself rather than going through
  // collect(), and silently dropping the declaration made a true claim fail.
  const assume = line.match(/^\s*#\s*assume:\s*(.+)$/);
  if (assume) {
    positive = assume[1]
      .split(',')
      .map((c) => c.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)\s*>\s*0$/)?.[1])
      .filter((n): n is string => Boolean(n));
    continue;
  }

  const text = line.split('#')[0].trim();
  if (!text) continue;

  const parsed = parseClaim(text, 'fixture', i + 1);
  if (typeof parsed === 'string') {
    console.log(`  FAIL fixture:${i + 1}  ${text}\n       did not parse: ${parsed}`);
    process.exit(1);
  }
  claims.push(positive.length > 0 ? { ...parsed, positive } : parsed);
  expected.push(expecting);
}

if (claims.length === 0) {
  console.log('The fixture is empty — the self-test would pass without testing anything.');
  process.exit(1);
}

const verdicts = await runPython(claims);

let failures = 0;
for (let i = 0; i < verdicts.length; ++i) {
  const got = verdicts[i].status;
  const want = expected[i];
  if (got === want) {
    console.log(`  ok   ${want.padEnd(8)} ${verdicts[i].source}`);
  } else {
    failures++;
    console.log(`  FAIL ${verdicts[i].source}`);
    console.log(`       expected ${want}, got ${got} — ${verdicts[i].detail ?? 'no detail'}`);
  }
}

if (failures > 0) {
  console.log(`\n${failures} of ${verdicts.length} self-tests failed. The checker is not trustworthy.`);
  process.exit(1);
}

const counts = expected.reduce<Record<string, number>>((acc, e) => {
  acc[e] = (acc[e] ?? 0) + 1;
  return acc;
}, {});
console.log(
  `\nChecker verified: ${counts.ok ?? 0} true claims proved, ` +
    `${counts.wrong ?? 0} false claims caught, ` +
    `${counts.unproved ?? 0} correctly reported as undecidable.`,
);
