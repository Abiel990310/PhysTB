/**
 * A graph the reader moves.
 *
 * The book's position is that a picture of a secant line teaches almost
 * nothing, and dragging *h* towards zero while watching the slope settle
 * teaches the definition of a derivative. So this widget has no static mode:
 * every graph declares at least one control, and the interesting quantity is
 * always read out as a number that changes.
 *
 * Specs are JSON in a `:::graph` block. Two kinds so far, chosen because they
 * carry the two ideas the course is built on:
 *
 *   secant   a curve, a fixed point, and a second point h away — the
 *            difference quotient made visible
 *   riemann  a curve and n rectangles, with left/right/midpoint/trapezoid,
 *            showing which rule converges and how fast
 *
 * Adding a kind means adding a draw function and a readout. Resist adding a
 * general-purpose plotter: a preset that does one thing exactly right beats a
 * configurable one that does four things adequately.
 */

import { compile, sample, ExprError } from '../lib/expr.ts';

interface Control {
  readonly name: string;
  readonly label?: string;
  readonly min: number;
  readonly max: number;
  readonly step?: number;
  readonly value: number;
}

interface Spec {
  readonly kind: 'secant' | 'riemann';
  readonly title?: string;
  readonly fn: string;
  readonly domain: readonly [number, number];
  readonly range?: readonly [number, number];
  readonly controls?: readonly Control[];
  /** secant: the fixed point the secant pivots on. */
  readonly at?: number;
  /** riemann: the interval being integrated, and the rule. */
  readonly from?: number;
  readonly to?: number;
  readonly rule?: 'left' | 'right' | 'midpoint' | 'trapezoid';
  /** riemann: the exact value, so the error can be shown honestly. */
  readonly exact?: number;
}

const PAD = { left: 46, right: 14, top: 14, bottom: 30 };

export class TbGraph extends HTMLElement {
  #spec!: Spec;
  #fn!: (x: number) => number;
  #values = new Map<string, number>();
  #canvas!: HTMLCanvasElement;
  #readout!: HTMLElement;
  /** The figure, not the host: the --graph-* tokens are defined on `.graph`. */
  #figure!: HTMLElement;
  #rule: NonNullable<Spec['rule']> = 'left';

  connectedCallback(): void {
    const raw = this.querySelector('template[data-role="spec"]')?.innerHTML ?? '';
    try {
      this.#spec = JSON.parse(raw.replace(/&quot;/g, '"').replace(/&amp;/g, '&')) as Spec;
      this.#fn = compile(this.#spec.fn, ['x']) as (x: number) => number;
    } catch (err) {
      // A broken graph says so. Silently rendering an empty panel is how a
      // chapter ships with a demonstration that demonstrates nothing.
      this.innerHTML = `<p class="graph__error">This graph could not be built: ${
        err instanceof ExprError ? err.message : String(err)
      }</p>`;
      return;
    }

    this.#rule = this.#spec.rule ?? 'left';
    for (const c of this.#spec.controls ?? []) this.#values.set(c.name, c.value);
    this.#render();
  }

  #render(): void {
    const spec = this.#spec;
    const controls = (spec.controls ?? [])
      .map(
        (c) => `
        <label class="graph__control">
          <span class="graph__name">${c.label ?? c.name}</span>
          <input type="range" data-control="${c.name}"
                 min="${c.min}" max="${c.max}" step="${c.step ?? 0.01}" value="${c.value}">
          <output data-out="${c.name}">${c.value}</output>
        </label>`,
      )
      .join('');

    const rules =
      spec.kind === 'riemann'
        ? `<div class="graph__rules" role="group" aria-label="Rule">
             ${(['left', 'right', 'midpoint', 'trapezoid'] as const)
               .map(
                 (r) =>
                   `<button type="button" data-rule="${r}" class="${
                     r === this.#rule ? 'is-on' : ''
                   }">${r}</button>`,
               )
               .join('')}
           </div>`
        : '';

    this.innerHTML = `
      <figure class="graph">
        ${spec.title ? `<figcaption class="graph__title">${spec.title}</figcaption>` : ''}
        <canvas class="graph__canvas" width="720" height="380"></canvas>
        <div class="graph__readout" data-readout></div>
        ${rules}
        <div class="graph__controls">${controls}</div>
      </figure>`;

    this.#figure = this.querySelector('.graph')!;
    this.#canvas = this.querySelector('canvas')!;
    this.#readout = this.querySelector('[data-readout]')!;

    this.querySelectorAll<HTMLInputElement>('input[data-control]').forEach((input) => {
      input.addEventListener('input', () => {
        this.#values.set(input.dataset.control!, Number(input.value));
        this.querySelector(`[data-out="${input.dataset.control}"]`)!.textContent = input.value;
        this.#draw();
      });
    });

    this.querySelectorAll<HTMLButtonElement>('button[data-rule]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.#rule = btn.dataset.rule as NonNullable<Spec['rule']>;
        this.querySelectorAll('button[data-rule]').forEach((b) => b.classList.remove('is-on'));
        btn.classList.add('is-on');
        this.#draw();
      });
    });

    this.#draw();
  }

  /** Pick a y-range that shows the curve, unless the spec fixed one. */
  #yRange(): [number, number] {
    if (this.#spec.range) return [this.#spec.range[0], this.#spec.range[1]];
    const [a, b] = this.#spec.domain;
    let lo = Infinity;
    let hi = -Infinity;
    for (let i = 0; i <= 200; ++i) {
      const y = sample(this.#fn, a + ((b - a) * i) / 200);
      if (Number.isNaN(y)) continue;
      lo = Math.min(lo, y);
      hi = Math.max(hi, y);
    }
    if (!Number.isFinite(lo) || !Number.isFinite(hi)) return [-1, 1];
    if (hi - lo < 1e-9) return [lo - 1, hi + 1];
    const pad = (hi - lo) * 0.15;
    return [lo - pad, hi + pad];
  }

  #draw(): void {
    const ctx = this.#canvas.getContext('2d');
    if (!ctx) return;

    const W = this.#canvas.width;
    const H = this.#canvas.height;
    const [x0, x1] = this.#spec.domain;
    const [y0, y1] = this.#yRange();

    const px = (x: number) => PAD.left + ((x - x0) / (x1 - x0)) * (W - PAD.left - PAD.right);
    const py = (y: number) => H - PAD.bottom - ((y - y0) / (y1 - y0)) * (H - PAD.top - PAD.bottom);

    // Read from the figure, not from `this`. The tokens are declared on
    // `.graph`, so asking the host element returns nothing and every colour
    // silently falls back to its light-theme default — which is invisible on a
    // dark panel, and looks correct in light only by coincidence.
    const style = getComputedStyle(this.#figure);
    const ink = style.getPropertyValue('--graph-ink').trim() || '#1b1a18';
    const faint = style.getPropertyValue('--graph-faint').trim() || '#c9c4bb';
    const curve = style.getPropertyValue('--graph-curve').trim() || '#2f6f9f';
    const mark = style.getPropertyValue('--graph-mark').trim() || '#b3541e';
    const fill = style.getPropertyValue('--graph-fill').trim() || 'rgba(47,111,159,0.18)';

    ctx.clearRect(0, 0, W, H);

    // Axes, drawn at zero when zero is on screen and at the edge otherwise.
    ctx.strokeStyle = faint;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const yAxis = y0 <= 0 && y1 >= 0 ? py(0) : H - PAD.bottom;
    const xAxis = x0 <= 0 && x1 >= 0 ? px(0) : PAD.left;
    ctx.moveTo(PAD.left, yAxis);
    ctx.lineTo(W - PAD.right, yAxis);
    ctx.moveTo(xAxis, PAD.top);
    ctx.lineTo(xAxis, H - PAD.bottom);
    ctx.stroke();

    ctx.fillStyle = ink;
    ctx.font = '12px ui-monospace, monospace';
    ctx.fillText(y1.toFixed(2), 6, PAD.top + 10);
    ctx.fillText(y0.toFixed(2), 6, H - PAD.bottom);
    ctx.fillText(String(x0), PAD.left, H - 10);
    ctx.fillText(String(x1), W - PAD.right - 22, H - 10);

    if (this.#spec.kind === 'riemann') this.#drawRiemann(ctx, px, py, fill, mark);

    // The curve, broken wherever it is undefined.
    ctx.strokeStyle = curve;
    ctx.lineWidth = 2;
    ctx.beginPath();
    let drawing = false;
    for (let i = 0; i <= W; ++i) {
      const x = x0 + ((x1 - x0) * i) / W;
      const y = sample(this.#fn, x);
      if (Number.isNaN(y)) { drawing = false; continue; }
      if (drawing) ctx.lineTo(px(x), py(y));
      else { ctx.moveTo(px(x), py(y)); drawing = true; }
    }
    ctx.stroke();

    if (this.#spec.kind === 'secant') this.#drawSecant(ctx, px, py, mark, ink);
  }

  #drawSecant(
    ctx: CanvasRenderingContext2D,
    px: (x: number) => number,
    py: (y: number) => number,
    mark: string,
    ink: string,
  ): void {
    const a = this.#spec.at ?? 0;
    const h = this.#values.get('h') ?? 1;
    const fa = sample(this.#fn, a);
    const fb = sample(this.#fn, a + h);

    if (Number.isNaN(fa) || Number.isNaN(fb)) {
      this.#readout.textContent = 'undefined here';
      return;
    }

    const slope = (fb - fa) / h;

    // The secant, extended across the panel so its tilt is the visible thing.
    ctx.strokeStyle = mark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const [x0, x1] = this.#spec.domain;
    ctx.moveTo(px(x0), py(fa + slope * (x0 - a)));
    ctx.lineTo(px(x1), py(fa + slope * (x1 - a)));
    ctx.stroke();

    for (const [x, y] of [[a, fa], [a + h, fb]] as const) {
      ctx.fillStyle = mark;
      ctx.beginPath();
      ctx.arc(px(x), py(y), 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mark the interval h itself, on the axis between the two points, so the
    // thing being shrunk is visible rather than only named in the readout.
    const axisY = py(0);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px(a), axisY - 4);
    ctx.lineTo(px(a), axisY + 4);
    ctx.moveTo(px(a), axisY);
    ctx.lineTo(px(a + h), axisY);
    ctx.moveTo(px(a + h), axisY - 4);
    ctx.lineTo(px(a + h), axisY + 4);
    ctx.stroke();

    ctx.fillStyle = ink;
    ctx.font = '12px ui-monospace, monospace';
    ctx.fillText('h', (px(a) + px(a + h)) / 2 - 3, axisY + 16);

    this.#readout.innerHTML =
      `<span class="graph__stat">slope of the secant</span> ` +
      `<strong>${slope.toFixed(4)}</strong> ` +
      `<span class="graph__stat">at h =</span> <strong>${h.toFixed(3)}</strong>`;
  }

  #drawRiemann(
    ctx: CanvasRenderingContext2D,
    px: (x: number) => number,
    py: (y: number) => number,
    fill: string,
    mark: string,
  ): void {
    const from = this.#spec.from ?? this.#spec.domain[0];
    const to = this.#spec.to ?? this.#spec.domain[1];
    const n = Math.max(1, Math.round(this.#values.get('n') ?? 4));
    const w = (to - from) / n;

    let total = 0;
    ctx.fillStyle = fill;
    ctx.strokeStyle = mark;
    ctx.lineWidth = 1;

    for (let i = 0; i < n; ++i) {
      const left = from + i * w;
      const right = left + w;
      let height: number;

      if (this.#rule === 'left') height = sample(this.#fn, left);
      else if (this.#rule === 'right') height = sample(this.#fn, right);
      else if (this.#rule === 'midpoint') height = sample(this.#fn, (left + right) / 2);
      else height = (sample(this.#fn, left) + sample(this.#fn, right)) / 2;

      if (Number.isNaN(height)) continue;
      total += height * w;

      if (this.#rule === 'trapezoid') {
        const yl = sample(this.#fn, left);
        const yr = sample(this.#fn, right);
        ctx.beginPath();
        ctx.moveTo(px(left), py(0));
        ctx.lineTo(px(left), py(yl));
        ctx.lineTo(px(right), py(yr));
        ctx.lineTo(px(right), py(0));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        const top = py(height);
        const base = py(0);
        ctx.fillRect(px(left), Math.min(top, base), px(right) - px(left), Math.abs(base - top));
        ctx.strokeRect(px(left), Math.min(top, base), px(right) - px(left), Math.abs(base - top));
      }
    }

    const exact = this.#spec.exact;
    const error =
      exact === undefined
        ? ''
        : ` <span class="graph__stat">· error</span> <strong>${Math.abs(total - exact).toExponential(2)}</strong>`;
    this.#readout.innerHTML =
      `<span class="graph__stat">${this.#rule} sum, n =</span> <strong>${n}</strong> ` +
      `<span class="graph__stat">·</span> <strong>${total.toFixed(6)}</strong>${error}`;
  }
}
