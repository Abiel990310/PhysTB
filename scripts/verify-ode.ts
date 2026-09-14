/**
 * The two integrators must agree.
 *
 * `scripts/check_sim.py` decides whether a chapter's closed form is true, by
 * integrating the equation of motion and comparing. `src/lib/ode.ts` integrates
 * the same equations in the reader's browser so they can watch the motion and
 * drag its parameters. If those two ever part company, the page shows the
 * reader a different physics from the one the book proved — and the book would
 * still be green, because nothing else compares them.
 *
 * So this runs every system in the fixture through both and requires the final
 * states to match to a tight tolerance. Both are classical RK4 with a fixed
 * step, so they should agree to near machine precision; a disagreement means
 * one of them has been changed.
 */

import { spawn } from 'node:child_process';
import { join } from 'node:path';

import { build, integrate, parseSpec } from '../src/lib/ode.ts';

const ROOT = process.cwd();
const STEPS = 4000;

/** Systems worth pinning: the ones the book actually animates or checks. */
const SYSTEMS: Array<{ what: string; spec: string }> = [
  {
    what: 'simple harmonic motion',
    spec: 'rates: x\' = v, v\' = -4*x\ninit: x = 1, v = 0\nspan: 0..6',
  },
  {
    what: 'linear drag towards terminal velocity',
    spec: 'rates: v\' = 9.8 - 0.5*v\ninit: v = 0\nspan: 0..12',
  },
  {
    what: 'the full pendulum, large amplitude',
    spec: 'rates: x\' = v, v\' = -9.8*sin(x)\ninit: x = 2.5, v = 0\nspan: 0..8',
  },
  {
    what: 'damped oscillation',
    spec: 'rates: x\' = v, v\' = -9*x - 0.7*v\ninit: x = 1, v = 0\nspan: 0..10',
  },
  {
    what: 'a capacitor charging through a resistor',
    spec: 'rates: q\' = (5 - q/2)/3\ninit: q = 0\nspan: 0..15',
  },
  {
    what: 'quadratic drag, which has no closed form worth writing',
    spec: 'rates: v\' = 9.8 - 0.02*v*v\ninit: v = 0\nspan: 0..20',
  },
];

function askPython(systems: typeof SYSTEMS): Promise<number[][]> {
  return new Promise((resolve, reject) => {
    const py = spawn('python3', [join(ROOT, 'scripts', 'final_states.py')], {
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
    py.stdin.end(JSON.stringify({ steps: STEPS, systems: systems.map((s) => s.spec) }));
  });
}

const theirs = await askPython(SYSTEMS);

let bad = 0;

SYSTEMS.forEach((system, i) => {
  const spec = parseSpec(system.spec);
  const trace = integrate(build(spec, spec.params), spec.span, STEPS);
  const mine = trace.values.map((series) => series[series.length - 1]);
  const other = theirs[i];

  const gaps = mine.map((v, j) => Math.abs(v - other[j]));
  const worst = Math.max(...gaps);
  const scale = Math.max(1, ...mine.map(Math.abs));

  if (worst <= 1e-9 * scale) {
    console.log(`  ok   ${system.what}  (agree to ${worst.toExponential(1)})`);
    return;
  }
  bad++;
  console.log(`  FAIL ${system.what}`);
  console.log(`       browser: ${mine.map((v) => v.toPrecision(10)).join(', ')}`);
  console.log(`       python:  ${other.map((v) => v.toPrecision(10)).join(', ')}`);
  console.log(`       worst gap ${worst.toExponential(3)} over ${STEPS} steps`);
});

if (bad === 0) {
  console.log(
    `\nBoth integrators agree on all ${SYSTEMS.length} systems. ` +
    `The motion a reader watches is the motion the build checked.`,
  );
  process.exit(0);
}
console.log(`\n${bad} systems are integrated differently in the browser.`);
process.exit(1);
