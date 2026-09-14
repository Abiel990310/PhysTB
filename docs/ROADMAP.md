# What to write next

Take the top unticked item. One item per session, one item per commit.

## Read this first

**The unit lists below are not verified against the current CED.** They were
written from knowledge, not from the College Board's published Course and Exam
Description. Before anything is written:

- [ ] **Check the current CED for both exams.** Confirm units, order, exam
      weightings, and the equation sheet's contents. Record the date of the
      check and what changed.

## Two exams, one repo

Physics C Mechanics and Physics C Electricity & Magnetism are separate exams,
taken independently, with largely disjoint content. That makes them two **parts**
of one book, not two repos — they share an engine, a widget set, and the same
calculus prerequisites, and duplicating all of that to separate them would buy
nothing.

This is the opposite case from CalTB, where BC contains AB. Here neither
contains the other, so neither is filtered away: a reader picks a part.

## Depends on CalTB

Physics C is the calculus-based course, and this book should link into CalTB
rather than re-teach derivatives and integrals. Where a chapter needs a
technique, one sentence and a link across.

Two pieces of machinery are shared and should be **taken from CalTB rather than
rebuilt**:

- the symbolic verifier (`verify:math`)
- the interactive graph widget

## The engine work, which comes first

- [ ] **Port the site engine** from CsaTB, minus the compiler backend.
- [ ] **Take the symbolic verifier and graph widget from CalTB** once they
      exist. Do not fork them.
- [ ] **Simulation as the analogue of "the program runs".** Every closed-form
      result in the prose is checked against a numerical integration of the same
      setup, and the build fails if they disagree. A projectile with drag, an
      RC transient, a charged particle in a field — the analytic answer and the
      integrator must agree, and when they do not, one of them is wrong.
- [ ] **A simulation widget** where the reader sets initial conditions and
      watches the motion, with the analytic solution drawn over the top so
      agreement is visible rather than asserted.
- [ ] **Field visualisers for E&M** — vector fields, equipotentials, flux
      through a surface. The geometry is most of the difficulty in E&M, and it
      is the thing a static diagram serves worst.
- [ ] **Units as a first-class failure.** A right number with wrong units is a
      specific, common, gradeable mistake and deserves its own message, not to
      be folded into "wrong".
- [ ] **Rubric-point scoring** for free response, as in the sibling books.

## Provisional structure

### Part 1 — Mechanics

- [x] 1 Kinematics
- [x] 2 Newton's laws
- [x] 3 Work, energy, and power
- [x] 4 Systems of particles and linear momentum
- [x] 5 Rotation
- [x] 6 Oscillations
- [ ] 7 Gravitation

### Part 2 — Electricity and Magnetism

- [x] 8 Electrostatics
- [ ] 9 Conductors, capacitors, dielectrics
- [x] 10 Electric circuits
- [x] 11 Magnetic fields
- [ ] 12 Electromagnetism

## Rules specific to this book

- **Problems are original.** College Board questions are copyrighted; write to
  the archetypes, never transcribe.
- **This is not an official College Board product** and must not imply it is.
- **Every result is checked against a simulation**, or it is deleted.
- **Symbols carry units.** A derivation that does not survive a dimensional
  check is wrong, and checking it is cheap enough to do automatically.
