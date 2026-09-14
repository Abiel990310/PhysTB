/**
 * Turn an author's expression into a function of one variable.
 *
 * Chapters write `x**2 - 3*x` or `sin(x)/x` in a graph spec, and the widget
 * needs to evaluate that thousands of times while a slider moves. The
 * expressions come from the book's own source, not from a reader, so this is
 * not a sandbox against an adversary — but it is still checked against a
 * whitelist before compiling, for two better reasons:
 *
 *   1. A typo should fail loudly at load with a message naming the expression,
 *      rather than silently producing NaN and a blank graph.
 *   2. The book is open source and its markdown is the kind of thing people
 *      copy. Anything that compiles arbitrary text is a bad pattern to publish
 *      even where it happens to be safe.
 *
 * SymPy syntax is what authors already write in `math verify` blocks, so `**`
 * is accepted for powers and rewritten to `Math.pow`.
 */

/** Everything an expression may name. Anything else is a typo or an attack. */
const ALLOWED = [
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2',
  'sinh', 'cosh', 'tanh',
  'exp', 'log', 'log2', 'log10', 'sqrt', 'cbrt',
  'abs', 'sign', 'floor', 'ceil', 'round', 'min', 'max', 'pow',
  'pi', 'e',
];

const IDENTIFIER = /[A-Za-z_][A-Za-z0-9_]*/g;

export class ExprError extends Error {}

/**
 * Compile `source` into `(vars) => number`.
 *
 * `params` names the variables the expression may use besides constants —
 * typically `['x']`, or `['x', 'h']` where a slider feeds in.
 */
export function compile(source: string, params: readonly string[]): (...args: number[]) => number {
  const known = new Set([...ALLOWED, ...params]);

  for (const name of source.match(IDENTIFIER) ?? []) {
    if (!known.has(name)) {
      throw new ExprError(
        `"${name}" is not something an expression may use, in: ${source}\n` +
          `Allowed: ${[...params].join(', ')}, and ${ALLOWED.join(', ')}.`,
      );
    }
  }

  if (/[^0-9A-Za-z_+\-*/%^().,\s]/.test(source)) {
    throw new ExprError(`unexpected character in: ${source}`);
  }

  // `**` first, so the `*` rewrite below cannot split it.
  const js = source
    .replace(/\*\*/g, '@POW@')
    .replace(/\^/g, '@POW@')
    .replace(/@POW@/g, '**');

  const prelude = ALLOWED.filter((n) => n !== 'pi' && n !== 'e')
    .map((n) => `const ${n} = Math.${n === 'sign' ? 'sign' : n};`)
    .join('');

  try {
    // eslint-disable-next-line no-new-func -- whitelisted above; see the header.
    const fn = new Function(
      ...params,
      `${prelude} const pi = Math.PI; const e = Math.E; return (${js});`,
    ) as (...args: number[]) => number;
    fn(...params.map(() => 1));            // fail now, not on the first frame
    return fn;
  } catch (cause) {
    throw new ExprError(`could not compile: ${source}\n${String(cause)}`);
  }
}

/**
 * Evaluate safely for plotting.
 *
 * A function being undefined somewhere is normal — `1/x` at zero, `log(x)`
 * left of it — and the plotter needs that to break the line rather than draw a
 * spike across the panel, so non-finite results come back as NaN by contract.
 */
export function sample(fn: (...a: number[]) => number, ...args: number[]): number {
  let y: number;
  try {
    y = fn(...args);
  } catch {
    return NaN;
  }
  return Number.isFinite(y) ? y : NaN;
}
