/**
 * Verify every closed-form result against a numerical integration.
 *
 * The physics counterpart of `verify:math`. A chapter that states a solution to
 * an equation of motion has to show that integrating the equation produces it.
 */

import { collectSims, runSims } from './sim-lib.ts';

const { sims, bad } = await collectSims();

for (const b of bad) console.log(`  bad  ${b}`);

if (sims.length === 0 && bad.length === 0) {
  console.log('\nNo simulation checks found yet.');
  process.exit(0);
}

const verdicts = await runSims(sims);

let failed = bad.length;
for (const v of verdicts) {
  if (v.status === 'ok') {
    console.log(`  ok   ${v.file}:${v.line}  ${v.exact_var} = ${v.exact}`);
    console.log(`         ${v.detail}`);
  } else {
    failed++;
    console.log(`  WRONG ${v.file}:${v.line}  ${v.exact_var} = ${v.exact}`);
    console.log(`         ${v.detail}`);
  }
}

if (failed === 0) {
  console.log(`\nAll ${verdicts.length} results agree with the integrated equations.`);
  process.exit(0);
}

console.log(`\n${failed} of ${verdicts.length + bad.length} simulation checks failed.`);
process.exit(1);
