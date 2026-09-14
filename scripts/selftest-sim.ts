/**
 * Check the simulation checker.
 *
 * Same reasoning as the mathematics self-test: the harness is the only thing
 * standing between this book and physics that does not hold, so it needs its
 * own test — including claims that must FAIL, since a checker that quietly
 * stopped catching those would look identical to a green build.
 */

import { collectSims, runSims } from './sim-lib.ts';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const { sims, bad } = await collectSims(join('scripts', 'fixtures'));

if (bad.length > 0) {
  for (const b of bad) console.log(`  FAIL could not parse: ${b}`);
  process.exit(1);
}

// Read the expectations back out of the fixture, in block order.
const text = await readFile(join(process.cwd(), 'scripts', 'fixtures', 'sim-selftest.md'), 'utf8');
const expected = [...text.matchAll(/#\s*expect:\s*(ok|wrong)/g)].map((m) => m[1]);

if (expected.length !== sims.length) {
  console.log(`  FAIL fixture has ${sims.length} blocks but ${expected.length} expectations`);
  process.exit(1);
}

const verdicts = await runSims(sims);

let failures = 0;
for (let i = 0; i < verdicts.length; ++i) {
  const got = verdicts[i].status;
  if (got === expected[i]) {
    console.log(`  ok   ${expected[i].padEnd(5)} ${verdicts[i].exact_var} = ${verdicts[i].exact}`);
  } else {
    failures++;
    console.log(`  FAIL ${verdicts[i].exact_var} = ${verdicts[i].exact}`);
    console.log(`       expected ${expected[i]}, got ${got} — ${verdicts[i].detail}`);
  }
}

if (failures > 0) {
  console.log(`\n${failures} of ${verdicts.length} failed. The simulation harness is not trustworthy.`);
  process.exit(1);
}

const ok = expected.filter((e) => e === 'ok').length;
console.log(`\nSimulation harness verified: ${ok} correct results confirmed, ` +
            `${expected.length - ok} wrong ones caught.`);
