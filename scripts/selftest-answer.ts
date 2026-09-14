/**
 * The browser grader's own test.
 *
 * `verify-browser-grading.ts` checks that this grader agrees with SymPy on the
 * book's real answers. That is necessary but not sufficient: it only ever sees
 * answers the book happens to list, and those are not chosen to be hostile.
 *
 * These are. Numeric equivalence testing has one characteristic failure — two
 * different functions agreeing at the sample points — so several cases below
 * are wrong answers that coincide with the right one at the round numbers a
 * careless sampler would have picked: x**2 and 2*x agree at 0 and 2, x**3 and
 * x**2 agree at 0 and 1, and sin(x) is indistinguishable from x near the
 * origin. Each must still be rejected.
 *
 * The rest pin down the parser: implicit products, `**` against `^`, unary
 * minus binding looser than a power, right-associative exponentiation, and the
 * malformed input a reader will eventually type.
 */

import { grade, type Mode } from '../src/lib/answer.ts';
const cases: Array<[string, string, Mode, boolean]> = [
  // [given, reference, mode, expected]
  ['2x',            'x + x',        'expression', true],
  ['2x',            'x*2',          'expression', true],
  ['3sin(x)',       '3*sin(x)',     'expression', true],
  ['(x+1)(x-1)',    'x^2 - 1',      'expression', true],
  ['x^2',           'x**2',         'expression', true],
  ['-x^2',          '-(x**2)',      'expression', true],
  ['(-x)^2',        'x**2',         'expression', true],
  ['2^3^2',         '512',          'expression', true],   // right-assoc
  ['1/2x',          'x/2',          'expression', true],   // (1/2)*x
  ['sin(x)^2+cos(x)^2','1',         'expression', true],
  ['ln(x)',         'log(x)',       'expression', true],
  ['sqrt(x)',       'x^(1/2)',      'expression', true],
  ['2pi',           '2*pi',         'expression', true],
  ['0.6666666667',  '2/3',          'expression', true],
  // must be REJECTED
  ['x^2',           '2*x',          'expression', false],  // agree at 0 and 2
  ['x^2 + 1',       '(x+1)^2',      'expression', false],
  ['x^3',           'x^2',          'expression', false],  // agree at 0,1
  ['-x',            'x',            'expression', false],
  ['sin(x)',        'x',            'expression', false],  // agree near 0
  ['tan(x)',        'sin(x)/cos(x)','expression', true],
  ['x/x',           '1',            'expression', true],
  ['abs(x)',        'x',            'expression', false],  // differs for x<0
  ['x**2/2 + 5',    'x**2/2',       'antiderivative', true],
  ['x**2/2 + x',    'x**2/2',       'antiderivative', false],
  ['-cos(2*x)/4',   'sin(x)**2/2',  'antiderivative', true],
  ['-cos(x)**2/2',  'sin(x)**2/2',  'antiderivative', true],
  ['sin(x)**2/2',   '-cos(x)**2/2', 'antiderivative', true],
  ['cos(x)**2/2',   'sin(x)**2/2',  'antiderivative', false],
  ['x^2/2 + C',     'x**2/2',       'antiderivative', true],
  ['oo',            'oo',           'expression', true],
  ['oo',            '5',            'expression', false],
  ['-oo',           'oo',           'expression', false],
  ['((x)',          'x',            'expression', false],
  ['x +',           'x',            'expression', false],
  ['y',             'x',            'expression', false],
  // Tolerance, pinned from both sides. A reader who rounds has done the
  // mathematics and must pass; one who is merely close has not. Without these
  // the tolerance could be loosened to something useless and every other case
  // here would still go green.
  ['0.6666666667',  '2/3',          'expression', true],   // rounded: accept
  ['0.667',         '2/3',          'expression', false],  // truncated: reject
  ['3.14',          'pi',           'expression', false],
  ['3.14159265359', 'pi',           'expression', true],
  ['x**2/2 + 0.0001*x', 'x**2/2',   'antiderivative', false],
];

/**
 * Answers in several variables, which is what a physics problem asks for.
 *
 * The `v0` cases are the important ones. SymPy splits any multi-character
 * symbol it has not been told about into single letters, so `v0` parses as
 * v times 0 — the number zero — unless the problem declares it. Initial
 * velocity is the most common symbol in mechanics, and without the declaration
 * `v0 + a*t` would be graded as `a*t` and nobody would ever see why.
 *
 * The rest guard the sampler: several variables must be walked through the
 * sample points independently. If they moved together, `g*h` and `g**2` would
 * agree everywhere and a wrong answer would pass.
 */
const multivariate: Array<[string, string, string, boolean]> = [
  ['sqrt(2*g*h)',      'sqrt(2*g*h)',       'g h',     true],
  ['sqrt(2gh)',        'sqrt(2*g*h)',       'g h',     true],
  ['(2*g*h)^(1/2)',    'sqrt(2*g*h)',       'g h',     true],
  ['sqrt(2*g*g)',      'sqrt(2*g*h)',       'g h',     false],
  ['g*h',              'g^2',               'g h',     false],
  ['g+h',              'h+g',               'g h',     true],
  ['g+h',              '2*g',               'g h',     false],
  ['m*v^2/2',          'v^2*m/2',           'm v',     true],
  ['m*v^2',            'm*v^2/2',           'm v',     false],
  ['G*M*m/r^2',        'G*M*m/r^2',         'G M m r', true],
  ['G*M*m/r',          'G*M*m/r^2',         'G M m r', false],
  ['v0 + a*t',         'a*t + v0',          'v0 a t',  true],
  ['v0',               'a*t + v0',          'v0 a t',  false],
  ['x0 + v0*t + a*t^2/2', 'a*t**2/2 + v0*t + x0', 'x0 v0 a t', true],
  ['x0 + v0*t + a*t^2',   'a*t**2/2 + v0*t + x0', 'x0 v0 a t', false],
  ['',              'x',            'expression', false],
];
let bad = 0;
for (const [g, r, m, want] of cases) {
  const v = grade(g, r, m);
  if (v.correct === want) continue;
  bad++;
  console.log(`  FAIL  "${g}" vs "${r}" [${m}]`);
  console.log(`        expected ${want ? 'accept' : 'reject'}, got ${v.correct ? 'accept' : 'reject'}: ${v.detail}`);
}
for (const [g, r, vars, want] of multivariate) {
  const v = grade(g, r, 'expression', vars);
  if (v.correct === want) continue;
  bad++;
  console.log(`  FAIL  "${g}" vs "${r}" [vars: ${vars}]`);
  console.log(`        expected ${want ? 'accept' : 'reject'}, got ${v.correct ? 'accept' : 'reject'}: ${v.detail}`);
}

const total = cases.length + multivariate.length;

if (bad === 0) {
  console.log(`\nGrader self-test: ${total} cases behave, including ` +
              `the near-misses designed to slip past a naive sampler.`);
  process.exit(0);
}
console.log(`\n${bad} of ${total} cases are graded wrongly.`);
process.exit(1);
