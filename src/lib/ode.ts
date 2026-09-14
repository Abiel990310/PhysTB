/**
 * Integrate an equation of motion in the browser.
 *
 * This is the reader-facing half of `scripts/check_sim.py`, and it is
 * deliberately the same method: classical RK4 with a fixed step. That matters
 * more than it sounds. The build proves a chapter's closed form by integrating
 * the equation of motion and comparing; if the animation on the page used a
 * different integrator, the reader would be watching something other than what
 * was proved, and the two could disagree with nobody noticing.
 * `scripts/verify-ode.ts` runs both against the same systems and fails the
 * build if they part company.
 *
 * Expressions are parsed by `src/lib/answer.ts`, the same parser that grades
 * practice answers. One parser, one set of rules about what `^` and `sin` mean.
 */

import { parse, evaluate, type Expr } from './answer.ts';

export interface System {
  /** State variable names, in order: ["x", "v"]. */
  readonly names: string[];
  /** One rate expression per name, as a function of t, the state, and params. */
  readonly rates: Expr[];
  readonly initial: number[];
  /** Constants the rates may refer to — the ones the reader can drag. */
  readonly params: Record<string, number>;
}

/** One classical Runge–Kutta step. Fourth order, so the error per step is dt^5. */
export function rk4(system: System, state: number[], t: number, dt: number): number[] {
  const deriv = (tt: number, s: number[]): number[] => {
    const env: Record<string, number> = { ...system.params, t: tt };
    system.names.forEach((name, i) => (env[name] = s[i]));
    return system.rates.map((r) => evaluate(r, env));
  };

  const k1 = deriv(t, state);
  const k2 = deriv(t + dt / 2, state.map((s, i) => s + (dt / 2) * k1[i]));
  const k3 = deriv(t + dt / 2, state.map((s, i) => s + (dt / 2) * k2[i]));
  const k4 = deriv(t + dt, state.map((s, i) => s + dt * k3[i]));

  return state.map((s, i) => s + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}

export interface Trace {
  readonly t: number[];
  /** One array per state variable, parallel to `t`. */
  readonly values: number[][];
}

/** Integrate from t = 0 to `span` in `steps` equal steps, recording every one. */
export function integrate(system: System, span: number, steps: number): Trace {
  const dt = span / steps;
  const t: number[] = [0];
  const values: number[][] = system.initial.map((v) => [v]);

  let state = [...system.initial];
  for (let i = 1; i <= steps; i++) {
    state = rk4(system, state, (i - 1) * dt, dt);
    t.push(i * dt);
    state.forEach((v, j) => values[j].push(v));
  }
  return { t, values };
}

/** Sample a closed-form expression of t at the same instants as a trace. */
export function sampleExact(expr: Expr, t: number[], params: Record<string, number>): number[] {
  return t.map((tt) => evaluate(expr, { ...params, t: tt }));
}

// ---------------------------------------------------------------------------
// The spec format, shared with `sim verify`
// ---------------------------------------------------------------------------

export interface Spec {
  readonly names: string[];
  readonly rateSources: string[];
  /**
   * Initial conditions, as source text rather than numbers.
   *
   * They may refer to parameters — a pendulum's release angle is the thing the
   * reader most wants to drag — so they cannot be resolved until the reader's
   * current parameter values are known.
   */
  readonly initialSources: string[];
  readonly params: Record<string, number>;
  /** Slider bounds for a parameter, when the author gave any. */
  readonly ranges: Record<string, [number, number]>;
  readonly exact: { name: string; source: string } | null;
  readonly span: number;
  /** Which state variables to draw. Defaults to all of them. */
  readonly plot: string[];
  readonly labels: Record<string, string>;
}

const num = (s: string): number => {
  const v = Number(s);
  if (!Number.isFinite(v)) throw new Error(`"${s}" is not a number`);
  return v;
};

/**
 * Read the block format the `sim verify` fences already use.
 *
 *     rates:  x' = v, v' = -(g/L)*sin(x)
 *     init:   x = 0.4, v = 0
 *     params: g = 9.8, L = 1 [0.2..3]
 *     exact:  x = 0.4*cos(sqrt(g/L)*t)
 *     span:   0..10
 *     plot:   x
 *
 * Keeping one format means a chapter can check a result and then hand the
 * reader the same system to play with, without stating it twice and without
 * the two drifting.
 */
export function parseSpec(text: string): Spec {
  const field = (name: string): string | null => {
    const m = text.match(new RegExp(`^\\s*${name}:\\s*(.+)$`, 'm'));
    return m ? m[1].trim() : null;
  };

  const rates = field('rates');
  const init = field('init');
  if (!rates) throw new Error('this simulation has no `rates:` line');
  if (!init) throw new Error('this simulation has no `init:` line');

  const names: string[] = [];
  const rateSources: string[] = [];
  for (const piece of splitTop(rates)) {
    const m = /^\s*(\w+)'\s*=\s*(.+)$/.exec(piece);
    if (!m) throw new Error(`"${piece.trim()}" is not of the form x' = ...`);
    names.push(m[1]);
    rateSources.push(m[2].trim());
  }

  const initialSources = names.map((name) => {
    const m = new RegExp(`\\b${name}\\s*=\\s*([^,]+)`).exec(init);
    if (!m) throw new Error(`\`init:\` says nothing about ${name}`);
    return m[1].trim();
  });

  const params: Record<string, number> = {};
  const ranges: Record<string, [number, number]> = {};
  for (const piece of splitTop(field('params') ?? '')) {
    if (!piece.trim()) continue;
    // `g = 9.8` or `L = 1 [0.2..3]` — the bracket makes it a slider.
    // The bounds are matched lazily up to the `..`. Excluding dots from them
    // instead would stop at the separator and also reject every decimal, which
    // is most of the bounds anyone writes.
    const m = /^\s*(\w+)\s*=\s*([^[\]]+?)\s*(?:\[\s*([^\]]*?)\s*\.\.\s*([^\]]*?)\s*\])?\s*$/.exec(piece);
    if (!m) throw new Error(`"${piece.trim()}" is not of the form name = value`);
    params[m[1]] = num(m[2]);
    if (m[3] !== undefined && m[4] !== undefined) ranges[m[1]] = [num(m[3]), num(m[4])];
  }

  const labels: Record<string, string> = {};
  for (const piece of splitTop(field('labels') ?? '')) {
    const m = /^\s*(\w+)\s*=\s*(.+)$/.exec(piece);
    if (m) labels[m[1]] = m[2].trim();
  }

  let exact: Spec['exact'] = null;
  const exactLine = field('exact');
  if (exactLine) {
    const m = /^\s*(\w+)\s*=\s*(.+)$/.exec(exactLine);
    if (!m) throw new Error(`"${exactLine}" is not of the form x = ...`);
    exact = { name: m[1], source: m[2].trim() };
  }

  const spanLine = field('span') ?? '0..10';
  const spanMatch = /^\s*0\s*\.\.\s*(.+)$/.exec(spanLine);
  if (!spanMatch) throw new Error(`\`span:\` should read 0..T, not "${spanLine}"`);

  const plotLine = field('plot');
  const plot = plotLine ? plotLine.split(/[\s,]+/).filter(Boolean) : [...names];

  return {
    names,
    rateSources,
    initialSources,
    params,
    ranges,
    exact,
    span: num(spanMatch[1].trim()),
    plot,
    labels,
  };
}

/** Split on commas that are not inside brackets, so `L = 1 [0.2..3]` survives. */
function splitTop(line: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of line) {
    if (ch === '(' || ch === '[') depth++;
    if (ch === ')' || ch === ']') depth--;
    if (ch === ',' && depth === 0) { out.push(current); current = ''; continue; }
    current += ch;
  }
  if (current.trim()) out.push(current);
  return out;
}

/** Turn a spec into a runnable system, with the reader's current parameters. */
export function build(spec: Spec, params: Record<string, number>): System {
  // Every name the rates may mention: the state, time, and the parameters.
  const known = new Set([...spec.names, 't', ...Object.keys(params)]);
  return {
    names: spec.names,
    rates: spec.rateSources.map((src) => parse(src, known)),
    // Initial conditions are evaluated against the parameters, never the state:
    // an initial condition that depended on the state would be circular.
    initial: spec.initialSources.map((src) => evaluate(parse(src, known), params)),
    params,
  };
}
