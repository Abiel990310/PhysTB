# How to write a chapter

This book has two machines that decide whether it is allowed to say something,
and a third that hands the reader the same thing. Everything below is about
using them.

CalTB's `docs/AUTHORING.md` covers the mathematics checker in more detail and is
worth reading alongside this; the `math verify` syntax is identical.

## The rule

Nothing ships unverified. Every worked result in the prose is either proved
symbolically or checked against a numerical integration of the same setup. If a
claim cannot be demonstrated by something that runs, write the program or cut
the claim.

A textbook that is confidently wrong is worse than one that is short.

## Checking algebra: ```math verify

Same as CalTB. One claim per line, in one of five forms — `d/dx`, `int … dx`,
`lim x->a`, `sum n=a..b`, or a plain identity.

````
```math verify
d/dr (k*q/r) = -k*q/r**2
int Q/C dQ = Q**2/(2*C)
```
````

Two directives matter more here than they do in the calculus book:

**`# symbols: v0, x0`** declares multi-character names. SymPy splits any symbol
it has not been told about into single letters, so an undeclared `v0` parses as
*v* times *0* — the number zero. A kinematics claim written without this does
not fail; it reports `ok`, having proved a weaker statement with the initial
conditions silently deleted. The checker now refuses undeclared subscripted
names, and this is the line that satisfies it. Physics notation is full of
subscripts, so you will use it constantly.

**`# assume: m > 0, R > 0`** declares positivity. Many true physical statements
are false without it, and the assumption is the author's, written in the source,
rather than something the checker grants quietly.

One special case: **`C` is the constant of integration** to the checker and
capacitance to E&M. A block that says `# symbols: C` means the physical
quantity and keeps it; without that, `int Q/C dQ = Q**2/(2*C)` fails through a
division by zero.

## Checking physics: ```sim verify

State the equation of motion and the closed form you are claiming solves it.
The build integrates the first with RK4 and compares against the second.

````
```sim verify
rates:  x' = v, v' = -4*x
init:   x = 1, v = 0
exact:  x = cos(2*t)
span:   0..6
tol:    1e-6
```
````

This is the book's premise. Most equations of motion worth writing about have no
closed form at all, and the ones that do are exactly where a comparison means
something. A `tol` a claim cannot meet at a sane step size is the claim's
problem, not the integrator's.

## Showing the reader: `:::sim`

The same block format, minus `tol`, plus sliders. The reader gets the equation
of motion with parameters they can drag.

```
:::sim
rates:  x' = v, v' = -(g/L)*sin(x)
init:   x = A, v = 0
params: A = 0.15 [0.05..3.0], g = 9.8, L = 1 [0.3..2.5]
exact:  x = A*cos(sqrt(g/L)*t)
span:   0..12
plot:   x
labels: A = release angle (rad), x = angle
:::
```

- A parameter with `[lo..hi]` gets a slider; one without is a fixed constant.
- `init:` values may be expressions in the parameters, which is how the reader
  drags a release angle.
- **`exact:` is the point.** It draws underneath the integration, and the widget
  reports the largest gap between them. The pendulum above is one curve at 9°
  and visibly two at 150°, which teaches the small-angle approximation better
  than the paragraph next to it does.
- Omit `exact:` when there is no closed form. The absence is itself the lesson —
  chapter 2.1 does this deliberately with quadratic drag.

Never quote a number the simulation could measure. The period table in the
oscillations chapter is measured by this integration, and it happened to confirm
the two figures that chapter had been asserting.

## Problems

`content/exercises/*.md`, one file per problem, with ```answer blocks:

````
```answer
prompt: A ball is dropped from rest at height h. Its speed on landing, in terms of g and h?
reference: sqrt(2*g*h)
variable: g h
positive: g h
accept:
  - (2*g*h)^(1/2)
  - sqrt(2gh)
reject:
  - 2*g*h
  - sqrt(g*h)
```
````

- `variable:` lists every symbol the answer may use. Declare `v0`-style names
  here for the same reason as above.
- `positive:` names quantities that cannot be negative — masses, lengths, spring
  constants. Without it, cancelling a square root over a length is correctly
  refused, because `sqrt(d**2*k/m)` is `|d|*sqrt(k/m)` in general.
- **`reject:` may not be empty.** A problem whose grader accepts everything is
  not a problem, and the verifier enforces it.

Every listed answer is run through both graders, and `verify:browser` fails the
build if the symbolic and numeric ones disagree.

## Running it

```bash
npm run verify     # self-tests first, then every claim, simulation and problem
```

The self-tests run first, because a change that stopped the checkers catching
false physics would otherwise look exactly like a green build.

**`verify` cannot see the page.** It runs in Node and Python. `<tb-exercise>`
once shipped into every practice section with no custom element defining it —
verified perfectly, rendered as an empty box. After touching a component, the
exercise payload, or the build plumbing:

```bash
npm run build && node scripts/smoke-browser.mjs
```

Set `PW_CHROMIUM` to a browser binary if Playwright cannot find its own. It
usually cannot: the pinned Playwright asks for a build number the preinstalled
browser does not have, and the error it prints tells you to download one rather
than to point at the one already there.

```bash
PW_CHROMIUM=$(ls -d /opt/pw-browsers/chromium-*/chrome-linux/chrome | head -1) \
  node scripts/smoke-browser.mjs
```

It checks the mathematics reaches the reader typeset, too. A claim whose LaTeX
is missing from the cache falls back to raw SymPy source — correct, and the
plain-text-equation failure this book exists to avoid — so the smoke test fails
on any `.proved__row` that rendered as `<code>`.

## Structure

Units are the College Board's, and their names live in each part's `index.md`.
Mechanics is units 1–7, E&M is 8–13 continuing the numbering. Gravitation is
inside unit 2; it is not a unit of its own, whatever older material says.

Front-matter needs `objectives` — `/reference/` and `/progress/` are generated
from it, and a chapter without them becomes a blank row. Titles containing a
colon must be quoted. `status: complete` is a claim: set it when the prose is
finished, the claims check, and the recap is written.

Cross-references are checked. `verify:refs` resolves every "chapter N.M" against
the actual files; references into a sibling book are listed separately, since
they cannot be checked from here.
