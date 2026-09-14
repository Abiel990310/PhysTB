import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import matter from 'gray-matter';
import { createRenderer } from './markdown.ts';
import { url } from './base.ts';
import { LANGUAGE } from './language.ts';
import type { AnswerPart, Book, Chapter, Difficulty, Exercise, NavEntry, Part } from './types.ts';

export const CONTENT_DIR = 'content';

/** Directory and file names are `NN-slug`; the number only sets the order. */
function splitOrder(name: string): { order: number; slug: string } {
  const match = /^(\d+)[-_](.+)$/.exec(name);
  if (!match) return { order: 999, slug: name };
  return { order: Number(match[1]), slug: match[2] };
}

const asArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.map(String) : typeof v === 'string' && v ? [v] : [];

/** Split an exercise body on its `## Section` headings. */
function splitSections(body: string): Record<string, string> {
  const out: Record<string, string> = { prompt: '' };
  const parts = body.split(/^##\s+(.+?)\s*$/m);
  out.prompt = parts[0].trim();
  for (let i = 1; i < parts.length; i += 2) {
    out[parts[i].trim().toLowerCase()] = parts[i + 1].trim();
  }
  return out;
}

export async function loadBook(root: string): Promise<Book> {
  const render = await createRenderer();
  const contentRoot = join(root, CONTENT_DIR);

  const entries = await readdir(contentRoot, { withFileTypes: true });
  const partDirs = entries
    .filter((e) => e.isDirectory() && e.name !== 'exercises' && !e.name.startsWith('.'))
    .map((e) => ({ name: e.name, ...splitOrder(e.name) }))
    .sort((a, b) => a.order - b.order);

  const parts: Part[] = [];

  for (const dir of partDirs) {
    const partPath = join(contentRoot, dir.name);
    const files = (await readdir(partPath))
      .filter((f) => f.endsWith('.md') && f !== 'index.md')
      .map((f) => ({ file: f, ...splitOrder(basename(f, '.md')) }))
      .sort((a, b) => a.order - b.order);

    // A part's own metadata lives in its index.md.
    let partTitle = dir.slug;
    let partSummary = '';
    const indexPath = join(partPath, 'index.md');
    if (existsSync(indexPath)) {
      const meta = matter(await readFile(indexPath, 'utf8')).data;
      partTitle = String(meta.title ?? dir.slug);
      partSummary = String(meta.summary ?? '');
    }

    const chapters: Chapter[] = [];
    for (const f of files) {
      const raw = await readFile(join(partPath, f.file), 'utf8');
      const { data, content } = matter(raw);
      const { html, headings, exercises, text } = render(content);

      chapters.push({
        slug: String(data.slug ?? f.slug),
        partSlug: dir.slug,
        title: String(data.title ?? f.slug),
        navTitle: String(data.navTitle ?? data.title ?? f.slug),
        summary: String(data.summary ?? ''),
        objectives: asArray(data.objectives),
        requires: asArray(data.requires),
        standard: String(data.standard ?? LANGUAGE.defaultStandard),
        scope: data.scope === 'em' ? 'em' : data.scope === 'both' ? 'both' : 'mech',
        status: data.status === 'complete' ? 'complete' : 'draft',
        order: f.order,
        headings,
        exercises,
        words: text.split(/\s+/).filter(Boolean).length,
        html,
        text,
      });
    }

    parts.push({
      slug: dir.slug,
      title: partTitle,
      summary: partSummary,
      order: dir.order,
      chapters,
    });
  }

  const exercises = await loadExercises(contentRoot, render);
  return { title: 'AP Physics C', parts, exercises };
}

/**
 * Read the ```answer blocks out of an exercise body.
 *
 * Deliberately a plain line format rather than JSON or YAML: these are written
 * by hand, several to a file, and the cost of a misplaced brace should not be a
 * problem that silently fails to load.
 */
function parseAnswerParts(body: string): AnswerPart[] {
  const field = (src: string, name: string): string | null => {
    const m = src.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
    return m ? m[1].trim() : null;
  };
  const list = (src: string, name: string): string[] => {
    const m = src.match(new RegExp(`^${name}:\\s*\\n((?:\\s+- .*\\n?)+)`, 'm'));
    if (!m) return [];
    return m[1]
      .split('\n')
      .map((l) => l.replace(/^\s*-\s*/, '').trim())
      .filter(Boolean);
  };

  const out: AnswerPart[] = [];
  for (const [, block] of body.matchAll(/```answer\n([\s\S]*?)```/g)) {
    const prompt = field(block, 'prompt');
    const reference = field(block, 'reference');
    if (!prompt || !reference) continue;
    out.push({
      prompt,
      reference,
      mode: field(block, 'mode') === 'antiderivative' ? 'antiderivative' : 'expression',
      variable: field(block, 'variable') ?? 'x',
      positive: field(block, 'positive') ?? '',
      accept: list(block, 'accept'),
      reject: list(block, 'reject'),
    });
  }
  return out;
}

/**
 * Strip the `answer` blocks out of prose before rendering it.
 *
 * They are the problem's data, not its text — the reader sees an input box
 * built from them, and showing the reference answer in the prompt would give
 * the game away.
 */
function withoutAnswerBlocks(body: string): string {
  return body.replace(/```answer\n[\s\S]*?```/g, '').trim();
}

async function loadExercises(
  contentRoot: string,
  render: Awaited<ReturnType<typeof createRenderer>>,
): Promise<Exercise[]> {
  const dir = join(contentRoot, 'exercises');
  if (!existsSync(dir)) return [];

  const files = (await readdir(dir)).filter((f) => f.endsWith('.md'));
  const out: Exercise[] = [];

  for (const file of files.sort()) {
    const { data, content } = matter(await readFile(join(dir, file), 'utf8'));
    const sections = splitSections(content);
    const difficulty = (['intro', 'core', 'stretch', 'deep'] as const).includes(
      data.difficulty as Difficulty,
    )
      ? (data.difficulty as Difficulty)
      : 'core';

    const promptSource = sections.prompt ?? '';

    out.push({
      id: String(data.id ?? basename(file, '.md')),
      title: String(data.title ?? basename(file, '.md')),
      difficulty,
      chapter: String(data.chapter ?? ''),
      topics: asArray(data.topics),
      scope: ['mech', 'em', 'both'].includes(String(data.scope)) ? String(data.scope) : 'mech',
      promptHtml: render(withoutAnswerBlocks(promptSource)).html,
      parts: parseAnswerParts(promptSource),
      hints: (sections.hints ?? '')
        .split(/^[-*]\s+/m)
        .map((h) => h.trim())
        .filter(Boolean)
        .map((h) => render(h).html),
      solutionNotesHtml: render(sections.notes ?? '').html,
    });
  }
  return out;
}

/** Flatten the book into the linear reading order used for prev/next links. */
export function toNav(book: Book): NavEntry[] {
  return book.parts.flatMap((part) =>
    part.chapters.map((ch) => ({
      slug: ch.slug,
      title: ch.title,
      part: part.title,
      url: url(`${part.slug}/${ch.slug}/`),
    })),
  );
}
