# PhysTB — working notes for Claude

An interactive **AP Physics C** textbook — Mechanics and E&M — in the same
family as CppTB, JavaTB, CsaTB and CalTB.

**Seven chapters written, 46 claims checked.** Mechanics covers kinematics,
Newton's laws, energy, momentum, rotation and oscillations; E&M covers
electrostatics, RC circuits and magnetism. Gravitation and induction are the
main gaps. The engine, KaTeX and the graph widget came across from CalTB.

The simulation harness is **built**: `sim verify` blocks state an equation of
motion and a claimed solution, and `npm run verify` integrates the one and
compares it against the other. That is the book's premise, and it is now
enforced rather than promised. `docs/ROADMAP.md` has the rest.

## What makes this book different

The compiled books lean on a compiler. Here the machine is a **simulation**:
every closed-form result in the prose is checked against a numerical integration
of the same setup, and the build fails if they disagree. Until that harness
exists, this book cannot honour the family's rule — which is why it comes before
any prose.

E&M's real difficulty is geometry, so field and equipotential visualisers matter
more here than anywhere else in the family.

## Settled decisions — do not relitigate

- **Two parts, one repo.** Mechanics and E&M are separate exams with separate
  content, but they share an engine, widgets and calculus prerequisites.
- **Take from CalTB, do not fork.** The symbolic verifier and the interactive
  graph widget are shared. If CalTB has not built them yet, that is a reason to
  work on CalTB, not to write a second copy here.
- **Link to CalTB for the calculus.** This book does not re-teach derivatives.
- **Problems are original**; College Board questions are copyrighted.
- **Not an official College Board product**, and nothing may imply otherwise.

## Before writing any chapter

The roadmap's first item is checking the unit lists against the current CED for
both exams. What is there was written from knowledge, not the published
document.

## Scheduling

Covered by **`trig_017zYznE5wwj44ZGRirzmBRL`**, the shared 07:00 UTC+8 routine.
One item per run. Do not create a second Routine.

## When porting the engine

From CsaTB, minus the compiler backend, and carry these deliberately:

- The **search index must use `url()`** from `build/base.ts`, never a raw
  `/part/chapter/` — these sites are served from `/<repo>/`, and a raw path 404s
  invisibly, because `npm run dev` serves from `/`. That bug shipped in two
  books before it was caught.
- **Per-site localStorage progress keys** — the family shares one github.io
  origin, so a generic key lets one book overwrite another's progress.
- **Theme key `tb-theme`**, shared on purpose so a reader's choice follows them
  across the family.
