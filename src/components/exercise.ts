/**
 * `<tb-exercise>` — a practice problem the reader answers and gets marked.
 *
 * The compiled books in this family send a submission to a compiler. There is
 * no compiler here, so the equivalent is `src/lib/answer.ts`, which decides
 * whether what the reader typed *means* the same thing as the reference. That
 * matters more in calculus than it sounds: there is no canonical spelling of an
 * antiderivative, and three readers will hand in three different-looking
 * correct answers to the same integral.
 *
 * Two deliberate choices about how it behaves:
 *
 *   * **A wrong answer costs nothing.** There is no attempt counter and no
 *     lockout, because the reader is practising, not being examined, and a
 *     penalty just teaches them to guess less and give up sooner.
 *   * **The worked solution unlocks, it is not hidden.** Once every part is
 *     right — or the reader asks to see it — the notes appear. Hiding the
 *     explanation from someone who is stuck is how a practice section stops
 *     being used.
 */

import { grade, type Mode, type Verdict } from '../lib/answer.ts';

interface Part {
  prompt: string;
  reference: string;
  mode: Mode;
  variable: string;
  positive: string;
}

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  promptHtml: string;
  parts: Part[];
  hints: string[];
  solutionNotesHtml: string;
}

const escape = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Per-book, because every site in this family shares one origin. */
const STORE = 'phystb-practice';

function remember(id: string, index: number): void {
  try {
    const done = JSON.parse(localStorage.getItem(STORE) ?? '{}') as Record<string, number[]>;
    const mine = new Set(done[id] ?? []);
    mine.add(index);
    done[id] = [...mine].sort((a, b) => a - b);
    localStorage.setItem(STORE, JSON.stringify(done));
  } catch {
    // A reader with storage disabled still gets to practise; they just do not
    // get a tick when they come back. Never let this break the widget.
  }
}

function recalled(id: string): Set<number> {
  try {
    const done = JSON.parse(localStorage.getItem(STORE) ?? '{}') as Record<string, number[]>;
    return new Set(done[id] ?? []);
  } catch {
    return new Set();
  }
}

export class TbExercise extends HTMLElement {
  #problem: Problem | null = null;
  #solved = new Set<number>();

  async connectedCallback(): Promise<void> {
    const id = this.dataset.id;
    if (!id) return;

    this.className = 'exercise';
    this.innerHTML = '<p class="exercise__loading">Loading the problem…</p>';

    const problem = await load(id);
    if (!problem) {
      this.innerHTML = `<p class="exercise__error">There is no problem called
        <code>${escape(id)}</code>. If you followed a link here, it has gone stale.</p>`;
      return;
    }

    this.#problem = problem;
    this.#solved = recalled(id);
    this.#render();
  }

  #render(): void {
    const p = this.#problem!;
    const standalone = this.dataset.standalone === '1';

    this.innerHTML = '';

    if (!standalone) {
      const head = document.createElement('div');
      head.className = 'exercise__head';
      head.innerHTML =
        `<a class="exercise__title" href="${practiceUrl(p.id)}">${escape(p.title)}</a>` +
        `<span class="exercise__tag">${escape(p.difficulty)}</span>`;
      this.append(head);
    }

    if (p.promptHtml) {
      const prompt = document.createElement('div');
      prompt.className = 'exercise__prompt';
      prompt.innerHTML = p.promptHtml;
      this.append(prompt);
    }

    const list = document.createElement('ol');
    list.className = 'exercise__parts';
    p.parts.forEach((part, i) => list.append(this.#renderPart(part, i)));
    this.append(list);

    if (p.hints.length) this.append(this.#renderHints(p.hints));
    if (p.solutionNotesHtml) this.append(this.#renderSolution(p.solutionNotesHtml));

    this.#updateProgress();
  }

  #renderPart(part: Part, index: number): HTMLLIElement {
    const li = document.createElement('li');
    li.className = 'part';
    li.dataset.index = String(index);

    const question = document.createElement('p');
    question.className = 'part__prompt';
    question.textContent = part.prompt;

    const row = document.createElement('div');
    row.className = 'part__row';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'part__input';
    input.spellcheck = false;
    input.autocapitalize = 'off';
    input.setAttribute('autocomplete', 'off');
    input.placeholder = 'your answer';
    input.setAttribute('aria-label', `Answer for: ${part.prompt}`);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'part__check';
    button.textContent = 'Check';

    const verdict = document.createElement('p');
    verdict.className = 'part__verdict';
    verdict.setAttribute('role', 'status');
    verdict.hidden = true;

    const check = () => {
      const typed = input.value.trim();
      if (!typed) return;
      const result = grade(typed, part.reference, part.mode, part.variable, part.positive);
      show(result);
    };

    const show = (result: Verdict) => {
      verdict.hidden = false;
      verdict.className = `part__verdict ${result.correct ? 'is-right' : 'is-wrong'}`;
      verdict.textContent = result.correct
        ? `Correct — ${result.detail}.`
        : `Not yet: ${result.detail}.`;
      li.classList.toggle('is-right', result.correct);
      if (result.correct) {
        this.#solved.add(index);
        remember(this.#problem!.id, index);
        this.#updateProgress();
      }
    };

    button.addEventListener('click', check);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); check(); }
    });
    // A verdict about text the reader has since changed is misinformation.
    input.addEventListener('input', () => {
      verdict.hidden = true;
      li.classList.remove('is-right');
    });

    if (this.#solved.has(index)) li.classList.add('was-right');

    row.append(input, button);
    li.append(question, row, verdict);
    return li;
  }

  #renderHints(hints: string[]): HTMLElement {
    const box = document.createElement('div');
    box.className = 'exercise__hints';
    let shown = 0;

    const list = document.createElement('ol');
    list.className = 'hints';

    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'exercise__more';
    more.textContent = hints.length === 1 ? 'Show a hint' : `Show a hint (1 of ${hints.length})`;

    more.addEventListener('click', () => {
      const li = document.createElement('li');
      li.innerHTML = hints[shown];
      list.append(li);
      shown++;
      if (shown >= hints.length) more.remove();
      else more.textContent = `Another hint (${shown + 1} of ${hints.length})`;
    });

    box.append(list, more);
    return box;
  }

  #renderSolution(html: string): HTMLElement {
    const box = document.createElement('details');
    box.className = 'exercise__solution';

    const summary = document.createElement('summary');
    summary.textContent = 'How each one goes';
    box.append(summary);

    const body = document.createElement('div');
    body.className = 'prose';
    body.innerHTML = html;
    box.append(body);

    return box;
  }

  #updateProgress(): void {
    const total = this.#problem!.parts.length;
    const done = this.#solved.size;

    let bar = this.querySelector<HTMLParagraphElement>('.exercise__progress');
    if (!bar) {
      bar = document.createElement('p');
      bar.className = 'exercise__progress';
      this.querySelector('.exercise__parts')?.after(bar);
    }
    bar.textContent = done === total
      ? `All ${total} correct.`
      : `${done} of ${total} correct.`;
    bar.classList.toggle('is-done', done === total);
  }
}

// ---------------------------------------------------------------------------

const cache = new Map<string, Problem | null>();

function practiceUrl(id: string): string {
  return `${import.meta.env.BASE_URL}practice/${id}/`;
}

async function load(id: string): Promise<Problem | null> {
  if (cache.has(id)) return cache.get(id)!;
  try {
    // BASE_URL, not a raw "/data/…": these sites are served from /<repo>/, and
    // a root-relative fetch 404s there while looking fine in `npm run dev`.
    const res = await fetch(`${import.meta.env.BASE_URL}data/exercises/${id}.json`);
    const problem = res.ok ? ((await res.json()) as Problem) : null;
    cache.set(id, problem);
    return problem;
  } catch {
    cache.set(id, null);
    return null;
  }
}
