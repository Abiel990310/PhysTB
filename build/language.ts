/**
 * Everything about this book that is specific to one language.
 *
 * In the compiled books this file describes a programming language and its
 * compiler. This book has no compiler: its claims are settled by SymPy and by
 * numerical simulation, not by running a program the reader sees.
 *
 * The file still exists because the rest of the engine — the markdown
 * pipeline, the page templates, the search index — reads from it rather than
 * hard-coding a language, and stripping it out would mean editing a dozen
 * files that are otherwise identical to their siblings. Keeping it inert is
 * cheaper than forking the engine, and it leaves the door open: if this book
 * ever wants a runnable sample — a numerical demonstration, say — this is
 * where that gets described.
 *
 * What follows is deliberately a stub. Nothing here compiles or runs anything.
 */

/** Kept for structural compatibility with the sibling books; unused here. */
export type Action = 'run';

export const LANGUAGE = {
  id: 'physics',
  name: 'Physics',

  /**
   * The fence word. `python` because the expression syntax authors write in
   * `math verify` blocks is SymPy's, so Python highlighting is the closest
   * honest match for the occasional illustrative snippet.
   */
  fence: 'python',
  grammars: ['python', 'text', 'json', 'bash', 'diff'],

  /** No backend compiles anything here. Present so shared code can read them. */
  sourceFile: 'main.py',
  mainClass: 'main',

  /** A chapter's `standard` is meaningless in this book; one inert value. */
  standards: { none: 'none' } as Record<string, string>,
  defaultStandard: 'none',

  /** No second view — there is no disassembly of a theorem. */
  disassembly: null,

  /**
   * No behavioural flags: a sample here is illustrative, and the things that
   * must be *true* are asserted in `math verify` blocks, which the markdown
   * pipeline leaves alone and `verify:math` reads directly.
   */
  flags: {
    run: 'run',
    expectError: 'expect-error',
    /**
     * Inert, but kept so the shared markdown pipeline can read them without a
     * fork. Nothing in this book sets them, because nothing here is compiled.
     */
    disassemble: 'disassemble',
    expectThrow: 'expect-throw',
  },

  uncaughtReport: /^Traceback \(most recent call last\)/m,
  marker: '[tb]',
} as const;

/** Present for signature compatibility with the sibling books. Always inert. */
export function releaseFor(_standard: string | undefined): string {
  return LANGUAGE.standards[LANGUAGE.defaultStandard];
}
