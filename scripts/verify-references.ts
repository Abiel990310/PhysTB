/**
 * Every "chapter N.M" in the prose must point at a chapter that exists.
 *
 * This exists because the unit restructure broke one silently. Related rates
 * said "which is why chapter 2.3 was worth the effort", meaning the chain
 * rule — and the chain rule had just moved to 3.1, where the College Board
 * puts it. Nothing failed. The build was green, the mathematics was all still
 * proved, and the sentence quietly pointed at a different chapter.
 *
 * A cross-reference is a claim like any other: it says a particular chapter
 * discusses a particular thing. This checks the cheap half of that claim — that
 * the chapter is there at all — and prints what each reference resolves to, so
 * a wrong-but-existing target is visible to a human reading the output.
 */

import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { glob } from 'node:fs/promises';

import matter from 'gray-matter';

const ROOT = process.cwd();
const CONTENT = join(ROOT, 'content');

/** unit number -> its directory name, from the NN- prefix. */
async function units(): Promise<Map<number, string>> {
  const out = new Map<number, string>();
  for (const entry of await readdir(CONTENT, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'exercises') continue;
    const m = /^(\d+)-/.exec(entry.name);
    if (m) out.set(Number(m[1]), entry.name);
  }
  return out;
}

async function chapterTitle(dir: string, n: number): Promise<string | null> {
  const prefix = String(n).padStart(2, '0') + '-';
  for (const file of await readdir(join(CONTENT, dir))) {
    if (file.startsWith(prefix) && file.endsWith('.md')) {
      const { data } = matter(await readFile(join(CONTENT, dir, file), 'utf8'));
      return String(data.title ?? file);
    }
  }
  return null;
}

const byUnit = await units();
let broken = 0;
let checked = 0;
const crossBook: string[] = [];

for await (const path of glob(join(CONTENT, '**/*.md'))) {
  const rel = relative(ROOT, path);
  if (rel.endsWith('index.md')) continue;
  const text = await readFile(path, 'utf8');

  // "chapter 2.3", and the same reference split across a line break. A
  // trailing "of <Book>" makes it a reference into a sibling book, which this
  // checker cannot resolve — those repos are not checked out here. They are
  // reported rather than skipped, because a silent skip is how the one in
  // PhysTB pointed at CalTB's chain rule for a day after that chapter moved
  // units and nothing noticed.
  for (const m of text.matchAll(/chapter\s+(\d+)\.(\d+)(\s+of\s+(\w+TB))?/gi)) {
    checked++;
    const [, unitStr, chStr, , otherBook] = m;
    if (otherBook) {
      crossBook.push(`${rel}  "chapter ${unitStr}.${chStr} of ${otherBook}"`);
      continue;
    }
    const unit = Number(unitStr);
    const dir = byUnit.get(unit);
    const title = dir ? await chapterTitle(dir, Number(chStr)) : null;

    if (!title) {
      broken++;
      const where = text.slice(0, m.index).split('\n').length;
      console.log(`  BROKEN ${rel}:${where}  "chapter ${unitStr}.${chStr}" — ` +
                  (dir ? `unit ${unit} has no chapter ${chStr}` : `there is no unit ${unit}`));
      continue;
    }
    console.log(`  ok     ${`${unitStr}.${chStr}`.padEnd(5)} ${title}`);
  }
}

if (crossBook.length > 0) {
  console.log(`\n${crossBook.length} reference(s) point into another book and cannot be`);
  console.log('checked from here. Confirm by hand if that book has been restructured:');
  for (const c of crossBook) console.log(`  ${c}`);
}

if (broken === 0) {
  console.log(`\nAll ${checked - crossBook.length} local chapter references resolve.`);
  process.exit(0);
}
console.log(`\n${broken} of ${checked} chapter references point at nothing.`);
process.exit(1);
