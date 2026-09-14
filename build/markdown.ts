import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import katexPlugin from '@vscode/markdown-it-katex';
import katex from 'katex';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createHighlighter, type Highlighter } from 'shiki';
import type { Heading } from './types.ts';
import { LANGUAGE } from './language.ts';

/** Languages we highlight at build time. */
const LANGS: string[] = [...LANGUAGE.grammars];

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  highlighterPromise ??= createHighlighter({
    themes: ['vitesse-light', 'vitesse-dark'],
    langs: LANGS,
  });
  return highlighterPromise;
}

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Flags on a fenced code block, written after the language:
 *
 *     ```java run std=java21 title="Hello, world"
 *
 * `run` adds a compile-and-run panel, `bytecode` adds a javap panel, and
 * `hidden` marks lines that are compiled but not shown (see stripHidden).
 */
interface FenceMeta {
  lang: string;
  run: boolean;
  bytecode: boolean;
  title: string;
  standard: string;
  flags: Set<string>;
}

function parseFenceInfo(info: string): FenceMeta {
  const parts = info.trim().match(/(?:[^\s"]+|"[^"]*")+/g) ?? [];
  const lang = parts.shift() ?? 'text';
  const meta: FenceMeta = {
    lang,
    run: false,
    bytecode: false,
    title: '',
    standard: '',
    flags: new Set(),
  };
  for (const part of parts) {
    const eq = part.indexOf('=');
    if (eq === -1) {
      meta.flags.add(part);
      continue;
    }
    const key = part.slice(0, eq);
    const value = part.slice(eq + 1).replace(/^"|"$/g, '');
    if (key === 'title') meta.title = value;
    else if (key === 'std') meta.standard = value;
  }
  meta.run = meta.flags.has(LANGUAGE.flags.run);
  meta.bytecode = meta.flags.has(LANGUAGE.flags.disassemble);
  return meta;
}

/**
 * Lines ending in `// [hidden]` are sent to the compiler but hidden from the
 * reader, so an example can stay focused without failing to compile.
 */
function splitHidden(source: string): { shown: string; full: string } {
  const lines = source.split('\n');
  const shown = lines.filter((l) => !/\/\/\s*\[hidden\]\s*$/.test(l));
  const full = lines.map((l) => l.replace(/\s*\/\/\s*\[hidden\]\s*$/, ''));
  return { shown: shown.join('\n').replace(/\n+$/, ''), full: full.join('\n').replace(/\n+$/, '') };
}

/**
 * A generic `:::name args … :::` block. Prose containers get their body parsed
 * as Markdown; raw containers (memviz, exercise) keep their body verbatim so
 * the client can parse it.
 */
const RAW_CONTAINERS = new Set(['memviz', 'exercise', 'quiz', 'graph']);
const PROSE_CONTAINERS: Record<string, { label: string; cls: string }> = {
  note: { label: 'Note', cls: 'note' },
  tip: { label: 'Tip', cls: 'tip' },
  pitfall: { label: 'Pitfall', cls: 'pitfall' },
  warning: { label: 'Undefined behaviour', cls: 'warning' },
  standards: { label: 'From the standard', cls: 'standards' },
  history: { label: 'How we got here', cls: 'history' },
  practice: { label: 'Practice', cls: 'practice' },
  recap: { label: 'Recap', cls: 'recap' },
};

function containerPlugin(md: MarkdownIt): void {
  md.block.ruler.before('fence', 'container', (state, startLine, endLine, silent) => {
    const start = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    if (start + 3 > max) return false;
    if (state.src.slice(start, start + 3) !== ':::') return false;

    const info = state.src.slice(start + 3, max).trim();
    const spaceAt = info.indexOf(' ');
    const name = (spaceAt === -1 ? info : info.slice(0, spaceAt)).toLowerCase();
    const args = spaceAt === -1 ? '' : info.slice(spaceAt + 1).trim();
    if (!name || (!RAW_CONTAINERS.has(name) && !(name in PROSE_CONTAINERS))) return false;
    if (silent) return true;

    // Find the closing fence, tracking nesting so containers can hold containers.
    let depth = 1;
    let line = startLine;
    while (line < endLine - 1) {
      line += 1;
      const from = state.bMarks[line] + state.tShift[line];
      const to = state.eMarks[line];
      const text = state.src.slice(from, to).trim();
      if (text.startsWith(':::')) {
        if (text === ':::') depth -= 1;
        else depth += 1;
        if (depth === 0) break;
      }
    }

    const token = state.push('container_open', 'div', 1);
    token.markup = ':::';
    token.info = name;
    token.meta = { name, args };
    token.map = [startLine, line];

    if (RAW_CONTAINERS.has(name)) {
      const body: string[] = [];
      for (let i = startLine + 1; i < line; i += 1) {
        body.push(state.getLines(i, i + 1, 0, false));
      }
      token.meta.body = body.join('\n');
    } else {
      state.md.block.tokenize(state, startLine + 1, line);
    }

    const close = state.push('container_close', 'div', -1);
    close.markup = ':::';
    close.info = name;
    close.meta = { name };

    state.line = line + 1;
    return true;
  });

  md.renderer.rules.container_open = (tokens, idx) => {
    const { name, args, body } = tokens[idx].meta as { name: string; args: string; body?: string };
    if (name === 'memviz') {
      return `<figure class="widget"><tb-memviz><template data-role="spec">${escapeHtml(body ?? '')}</template></tb-memviz></figure>\n`;
    }
    if (name === 'exercise') {
      return `<tb-exercise data-id="${escapeHtml(args)}"></tb-exercise>\n`;
    }
    if (name === 'graph') {
      return `<tb-graph><template data-role="spec">${escapeHtml(body ?? '')}</template></tb-graph>\n`;
    }
    if (name === 'quiz') {
      return `<tb-quiz><template data-role="spec">${escapeHtml(body ?? '')}</template></tb-quiz>\n`;
    }
    const kind = PROSE_CONTAINERS[name];
    const label = args || kind.label;
    return `<aside class="callout callout--${kind.cls}"><p class="callout__label">${escapeHtml(label)}</p>\n`;
  };

  md.renderer.rules.container_close = (tokens, idx) => {
    const { name } = tokens[idx].meta as { name: string };
    return RAW_CONTAINERS.has(name) ? '' : '</aside>\n';
  };
}

export interface RenderResult {
  html: string;
  headings: Heading[];
  exercises: string[];
  text: string;
}

export async function createRenderer(): Promise<(src: string) => RenderResult> {
  const highlighter = await getHighlighter();

  const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

  /**
   * Mathematics is typeset, not spelled out.
   *
   * `$x^2$` inline and `$$ … $$` as a display block. KaTeX renders these at
   * build time, so the published page carries finished HTML and MathML — no
   * client-side library, no flash of raw LaTeX before it resolves, and a
   * screen reader gets the MathML rather than a pile of backslashes.
   *
   * `throwOnError` is on deliberately. A mis-typed formula should stop the
   * build with the source in the message, the same way a mathematical claim
   * that does not check stops it. The alternative is KaTeX quietly rendering
   * the broken source in red on the live page, which is how a chapter ships
   * looking wrong.
   */
  // The package is CJS with a `default` wrapper, while its type declarations
  // describe a bare function. Both are true depending on how it is loaded, so
  // take whichever is actually callable rather than trusting either.
  const katexMd = (
    typeof katexPlugin === 'function'
      ? katexPlugin
      : (katexPlugin as unknown as { default: typeof katexPlugin }).default
  ) as Parameters<MarkdownIt['use']>[0];

  md.use(katexMd, {
    throwOnError: true,
    strict: false,
    output: 'htmlAndMathml',
  });
  md.use(containerPlugin);

  let headings: Heading[] = [];
  /**
   * `math verify` blocks are the chapter's mathematics, not its source code.
   *
   * They were rendering as a code fence full of SymPy syntax, which is exactly
   * the plain-text-equation problem this book should not have. They now render
   * as typeset display maths carrying a mark that says the build proved them —
   * which is the single most distinctive thing about this book, and it was
   * previously invisible to the reader.
   *
   * The LaTeX comes from `build/math-latex.json`, generated before the build by
   * the same parse the checker uses, so the page cannot display one equation
   * while the build verified another. A missing entry falls back to the plain
   * source: visibly worse, never wrong.
   */
  const latexFor: Record<string, string> = (() => {
    try {
      const here = fileURLToPath(new URL('.', import.meta.url));
      return JSON.parse(readFileSync(`${here}math-latex.json`, 'utf8')) as Record<string, string>;
    } catch {
      return {};
    }
  })();

  /** Render one `math verify` block as typeset, visibly-checked mathematics. */
  const renderProved = (content: string): string => {
    const rows = content
      .split('\n')
      .map((line) => line.split('#')[0].trim())
      .filter(Boolean)
      .map((source) => {
        const tex = latexFor[source];
        const body = tex
          ? katex.renderToString(tex, {
              displayMode: true,
              throwOnError: false,
              output: 'htmlAndMathml',
            })
          : `<code>${escapeHtml(source)}</code>`;
        return `<li class="proved__row">${body}</li>`;
      })
      .join('');

    return `<figure class="proved">
      <ul class="proved__list">${rows}</ul>
      <figcaption class="proved__mark">checked by the build</figcaption>
    </figure>\n`;
  };

  md.use(anchor, {
    level: [2, 3],
    slugify: (s: string) =>
      s
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-'),
    callback: (token, info) => {
      const level = Number(token.tag.slice(1));
      if (level === 2 || level === 3) {
        headings.push({ id: info.slug, text: info.title, level: level as 2 | 3 });
      }
    },
  });

  const highlight = (code: string, lang: string): string =>
    highlighter.codeToHtml(code, {
      lang: LANGS.includes(lang) ? lang : 'text',
      themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
      defaultColor: false,
      cssVariablePrefix: '--sh-',
    });

  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];

    // Checked mathematics is typeset, not shown as source. This has to live
    // here rather than in its own rule: markdown-it keeps one fence renderer,
    // and this assignment replaces any earlier one.
    if (token.info.trim() === 'math verify') return renderProved(token.content);

    const meta = parseFenceInfo(token.info);
    const { shown, full } = splitHidden(token.content);
    const highlighted = highlight(shown, meta.lang);

    const caption = meta.title
      ? `<figcaption class="code__title">${escapeHtml(meta.title)}</figcaption>`
      : '';

    if (!meta.run && !meta.bytecode) {
      return `<figure class="code">${caption}${highlighted}</figure>\n`;
    }

    const attrs = [
      meta.run ? 'data-run="1"' : '',
      meta.bytecode ? 'data-bytecode="1"' : '',
      meta.standard ? `data-std="${escapeHtml(meta.standard)}"` : '',
      meta.flags.has('autorun') ? 'data-autorun="1"' : '',
      meta.flags.has(LANGUAGE.flags.expectError) ? 'data-expect-error="1"' : '',
      meta.flags.has(LANGUAGE.flags.expectThrow) ? 'data-expect-throw="1"' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      `<figure class="widget"><tb-runner ${attrs}>` +
      `${caption}` +
      `<div data-role="rendered">${highlighted}</div>` +
      `<template data-role="source">${escapeHtml(full)}</template>` +
      `</tb-runner></figure>\n`
    );
  };

  return (src: string): RenderResult => {
    headings = [];
    const env = {};
    const html = md.render(src, env);
    const exercises = [...src.matchAll(/^:::exercise\s+(\S+)/gm)].map((m) => m[1]);
    const text = src
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/[#*_>`\[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return { html, headings: [...headings], exercises, text };
  };
}

export { escapeHtml };
