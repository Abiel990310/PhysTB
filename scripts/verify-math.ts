/**
 * Verify every mathematical claim in the book.
 *
 * This is what `npm run verify:snippets` is to the compiled books: the step
 * that decides whether the prose is allowed to say what it says. A chapter
 * whose mathematics does not check does not ship.
 *
 * The claim syntax and the three verdicts are documented in `scripts/math-lib.ts`
 * and in `docs/AUTHORING.md`.
 */

import { collect, runPython } from './math-lib.ts';

const { claims, bad } = await collect();

for (const b of bad) console.log(`  bad  ${b}`);

if (claims.length === 0 && bad.length === 0) {
  console.log('\nNo mathematical claims found yet.');
  process.exit(0);
}

const verdicts = await runPython(claims);

let wrong = 0;
let unproved = 0;
for (const v of verdicts) {
  if (v.status === 'ok') {
    console.log(`  ok   ${v.file}:${v.line}  ${v.source}`);
  } else {
    if (v.status === 'wrong') wrong++;
    else unproved++;
    console.log(`  ${v.status === 'wrong' ? 'WRONG' : 'UNPRV'} ${v.file}:${v.line}  ${v.source}`);
    console.log(`         ${v.detail}`);
  }
}

const failed = wrong + unproved + bad.length;
if (failed === 0) {
  console.log(`\nAll ${verdicts.length} mathematical claims check out.`);
  process.exit(0);
}

console.log(
  `\n${failed} of ${verdicts.length + bad.length} claims did not check ` +
    `(${wrong} false, ${unproved} undecidable, ${bad.length} unparseable).`,
);
process.exit(1);
