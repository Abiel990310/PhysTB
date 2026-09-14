/**
 * `<tb-sim>` — a physics simulation the reader can change and watch.
 *
 * This is the widget this book exists for. The other books have a compiler:
 * you change the program, you see what it does. Here the equivalent is the
 * equation of motion — change a parameter, watch the motion change — and it is
 * the only honest way to teach the thing the course is actually about, which is
 * that the formulas are consequences of an integration rather than facts.
 *
 * Two decisions do most of the teaching:
 *
 *   * **The closed form is drawn on top of the integration, not instead of
 *     it.** When a chapter gives an `exact:` line, the page shows both curves
 *     and reports the largest gap between them. On a pendulum that starts
 *     small, the two are indistinguishable; drag the amplitude up and the
 *     small-angle curve visibly separates. That divergence *is* the lesson
 *     about when sin θ ≈ θ may be used, and no amount of prose makes it as
 *     clear as watching it come apart.
 *   * **It is the same integrator the build uses.** `src/lib/ode.ts` is RK4
 *     with a fixed step, matching `scripts/check_sim.py`, and
 *     `scripts/verify-ode.ts` fails the build if the two ever disagree. A page
 *     that animated some other method would be showing the reader a different
 *     physics from the one the book proved.
 */

import { parse, type Expr } from '../lib/answer.ts';
import { build, integrate, parseSpec, sampleExact, type Spec, type Trace } from '../lib/ode.ts';

const PLOT_STEPS = 1200;

export class TbSim extends HTMLElement {
  #spec: Spec | null = null;
  #params: Record<string, number> = {};
  #canvas!: HTMLCanvasElement;
  #readout!: HTMLParagraphElement;
  #playing = false;
  // The whole curve is drawn on arrival. A reader who has to press Play before
  // seeing anything mostly does not press Play, and the comparison this widget
  // exists to make is visible at a glance. Play replays it from the start.
  #cursor = PLOT_STEPS;
  #frame = 0;

  connectedCallback(): void {
    const source = (this.textContent ?? '').trim();
    this.textContent = '';
    this.className = 'sim';

    let spec: Spec;
    try {
      spec = parseSpec(source);
    } catch (err) {
      this.innerHTML = `<p class="sim__error">This simulation will not load: ${
        escape((err as Error).message)
      }</p>`;
      return;
    }

    this.#spec = spec;
    this.#params = { ...spec.params };
    this.#render();
  }

  disconnectedCallback(): void {
    cancelAnimationFrame(this.#frame);
  }

  #render(): void {
    const spec = this.#spec!;

    const figure = document.createElement('figure');
    figure.className = 'sim__figure';

    this.#canvas = document.createElement('canvas');
    this.#canvas.className = 'sim__canvas';
    this.#canvas.setAttribute('role', 'img');
    this.#canvas.setAttribute(
      'aria-label',
      `Plot of ${spec.plot.join(' and ')} against time, integrated from the equation of motion`,
    );
    figure.append(this.#canvas);

    const controls = document.createElement('div');
    controls.className = 'sim__controls';

    const play = document.createElement('button');
    play.type = 'button';
    play.className = 'sim__play';
    play.textContent = 'Play';
    play.addEventListener('click', () => {
      this.#playing = !this.#playing;
      play.textContent = this.#playing ? 'Pause' : 'Play';
      if (!this.#playing) { cancelAnimationFrame(this.#frame); return; }
      // Pressing Play on a finished curve means "show me that again".
      if (this.#cursor >= PLOT_STEPS) this.#cursor = 1;
      this.#animate();
    });

    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'sim__reset';
    reset.textContent = 'Reset';
    reset.addEventListener('click', () => {
      this.#params = { ...spec.params };
      this.#cursor = PLOT_STEPS;
      this.#playing = false;
      play.textContent = 'Play';
      cancelAnimationFrame(this.#frame);
      this.querySelectorAll<HTMLInputElement>('.sim__slider').forEach((s) => {
        s.value = String(spec.params[s.dataset.name!]);
        s.dispatchEvent(new Event('input', { bubbles: false }));
      });
      this.#draw();
    });

    controls.append(play, reset);

    for (const [name, [lo, hi]] of Object.entries(spec.ranges)) {
      controls.append(this.#slider(name, lo, hi));
    }

    this.#readout = document.createElement('p');
    this.#readout.className = 'sim__readout';

    this.append(figure, controls, this.#readout);

    // The canvas is sized from its laid-out box, which is only known once it is
    // in the document — hence drawing after append, and again on resize.
    const redraw = () => this.#draw();
    requestAnimationFrame(redraw);
    new ResizeObserver(redraw).observe(figure);
  }

  #slider(name: string, lo: number, hi: number): HTMLElement {
    const wrap = document.createElement('label');
    wrap.className = 'sim__param';

    const text = document.createElement('span');
    text.className = 'sim__param-name';

    const input = document.createElement('input');
    input.type = 'range';
    input.className = 'sim__slider';
    input.dataset.name = name;
    input.min = String(lo);
    input.max = String(hi);
    input.step = String((hi - lo) / 100);
    input.value = String(this.#params[name]);

    const show = () => {
      const label = this.#spec!.labels[name] ?? name;
      text.textContent = `${label} = ${round(this.#params[name])}`;
    };
    show();

    input.addEventListener('input', () => {
      this.#params[name] = Number(input.value);
      show();
      // Changing a parameter means a different motion, so show all of it. A
      // partial curve left over from an animation would be reporting the gap
      // over a fraction of the span and calling it the largest.
      if (!this.#playing) this.#cursor = PLOT_STEPS;
      this.#draw();
    });

    wrap.append(text, input);
    return wrap;
  }

  #animate(): void {
    const step = () => {
      this.#cursor = Math.min(PLOT_STEPS, this.#cursor + Math.ceil(PLOT_STEPS / 240));
      this.#draw();
      if (this.#cursor >= PLOT_STEPS) {
        this.#playing = false;
        const play = this.querySelector<HTMLButtonElement>('.sim__play');
        if (play) play.textContent = 'Play';
        return;
      }
      this.#frame = requestAnimationFrame(step);
    };
    this.#frame = requestAnimationFrame(step);
  }

  #draw(): void {
    const spec = this.#spec!;
    const canvas = this.#canvas;
    const box = canvas.getBoundingClientRect();
    if (box.width === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(box.width * dpr);
    canvas.height = Math.round(box.height * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Read the tokens off the figure, which is where they are declared. Asking
    // the host element returns nothing, and every colour silently falls back to
    // a light-theme default that is invisible on a dark page.
    const style = getComputedStyle(canvas.parentElement!);
    const ink = style.getPropertyValue('--ink').trim() || '#222';
    const faint = style.getPropertyValue('--ink-faint').trim() || '#888';
    const line = style.getPropertyValue('--line').trim() || '#ddd';
    const accent = style.getPropertyValue('--accent').trim() || '#2563eb';
    const warn = style.getPropertyValue('--warn').trim() || '#b45309';

    let trace: Trace;
    let exactValues: number[] | null = null;
    try {
      const system = build(spec, this.#params);
      trace = integrate(system, spec.span, PLOT_STEPS);
      if (spec.exact) {
        const known = new Set(['t', ...Object.keys(this.#params)]);
        const expr: Expr = parse(spec.exact.source, known);
        exactValues = sampleExact(expr, trace.t, this.#params);
      }
    } catch (err) {
      ctx.clearRect(0, 0, box.width, box.height);
      ctx.fillStyle = warn;
      ctx.font = '13px system-ui, sans-serif';
      ctx.fillText((err as Error).message, 10, 20);
      return;
    }

    const shown = spec.plot
      .map((name) => ({ name, series: trace.values[spec.names.indexOf(name)] }))
      .filter((s) => s.series);

    const upto = this.#cursor;
    const finite = (v: number) => Number.isFinite(v);
    const pool = [
      ...shown.flatMap((s) => s.series.slice(0, upto + 1)),
      ...(exactValues ? exactValues.slice(0, upto + 1) : []),
    ].filter(finite);

    if (pool.length === 0) return;

    let lo = Math.min(...pool);
    let hi = Math.max(...pool);
    if (hi - lo < 1e-9) { hi += 1; lo -= 1; }
    const pad = (hi - lo) * 0.12;
    lo -= pad;
    hi += pad;

    const L = 44;
    const R = 12;
    const T = 12;
    const B = 28;
    const W = box.width - L - R;
    const H = box.height - T - B;

    const px = (t: number) => L + (t / spec.span) * W;
    const py = (v: number) => T + H - ((v - lo) / (hi - lo)) * H;

    ctx.clearRect(0, 0, box.width, box.height);

    // Axes and a zero line, which is most of what makes an oscillation readable.
    ctx.strokeStyle = line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(L, T);
    ctx.lineTo(L, T + H);
    ctx.lineTo(L + W, T + H);
    ctx.stroke();

    if (lo < 0 && hi > 0) {
      ctx.strokeStyle = line;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(L, py(0));
      ctx.lineTo(L + W, py(0));
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.fillStyle = faint;
    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(round(hi), L - 6, T + 10);
    ctx.fillText(round(lo), L - 6, T + H);
    ctx.textAlign = 'center';
    ctx.fillText('t = 0', L + 12, T + H + 18);
    ctx.fillText(`t = ${round(spec.span)}`, L + W - 16, T + H + 18);

    // The exact curve first, underneath, so the integration sits on top of it.
    if (exactValues) {
      ctx.strokeStyle = warn;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.45;
      stroke(ctx, trace.t, exactValues, upto, px, py);
      ctx.globalAlpha = 1;
    }

    const colours = [accent, ink, faint];
    shown.forEach((s, i) => {
      ctx.strokeStyle = colours[i % colours.length];
      ctx.lineWidth = 1.75;
      stroke(ctx, trace.t, s.series, upto, px, py);
    });

    this.#report(shown, exactValues, trace, upto);
  }

  #report(
    shown: Array<{ name: string; series: number[] }>,
    exactValues: number[] | null,
    trace: Trace,
    upto: number,
  ): void {
    const spec = this.#spec!;
    const bits: string[] = [`t = ${round(trace.t[upto])}`];

    for (const s of shown) {
      const label = spec.labels[s.name] ?? s.name;
      bits.push(`${label} = ${round(s.series[upto])}`);
    }

    if (exactValues && spec.exact) {
      const target = trace.values[spec.names.indexOf(spec.exact.name)];
      if (target) {
        let worst = 0;
        for (let i = 0; i <= upto; i++) {
          const d = Math.abs(target[i] - exactValues[i]);
          if (Number.isFinite(d) && d > worst) worst = d;
        }
        bits.push(`largest gap from the closed form: ${worst.toExponential(2)}`);
      }
    }

    this.#readout.textContent = bits.join(' · ');
  }
}

function stroke(
  ctx: CanvasRenderingContext2D,
  t: number[],
  values: number[],
  upto: number,
  px: (t: number) => number,
  py: (v: number) => number,
): void {
  ctx.beginPath();
  let drawing = false;
  for (let i = 0; i <= upto && i < values.length; i++) {
    const v = values[i];
    if (!Number.isFinite(v)) { drawing = false; continue; }
    const x = px(t[i]);
    const y = py(v);
    if (!drawing) { ctx.moveTo(x, y); drawing = true; }
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

const round = (v: number): string => {
  if (!Number.isFinite(v)) return '—';
  if (Math.abs(v) >= 1000 || (Math.abs(v) < 0.01 && v !== 0)) return v.toExponential(2);
  return String(Number(v.toFixed(3)));
};

const escape = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
