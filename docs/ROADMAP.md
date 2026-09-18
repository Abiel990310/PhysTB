# What to write next

Take the top unticked item. One item per session, one item per commit.

## Read this first

**The unit lists below are not verified against the current CED.** They were
written from knowledge, not from the College Board's published Course and Exam
Description. Before anything is written:

- [x] **Check the current CED for both exams.** Done 2026-09-14, and it
      mattered. The **2024-25 revision restructured both courses**, and this
      book had been written against the old shape:

      * Mechanics is seven units, and **gravitation is no longer one of them** —
        it sits inside unit 2, Force and Translational Dynamics. The chapter
        moved there.
      * **Unit 6 is Energy and Momentum of Rotating Systems**, which did not
        exist here at all; oscillations had been numbered 6 and is really 7.
      * E&M units are numbered **8 to 13**, continuing from Mechanics rather
        than restarting. Capacitors is unit 10, not 9.
      * **Unit 9, Electric Potential, was missing entirely** — a whole unit,
        between Gauss's law and capacitors, that the capacitors chapter already
        depended on.

      Both gaps are now written. Every part carries the College Board's own
      unit name in its `index.md`; before this, no part had one and the site
      displayed each unit as its raw directory slug.

- [ ] **Confirm against the CED PDFs themselves.** apcentral is blocked by this
      environment's network egress, so the structure above came from secondary
      sources that agree with each other. The unit names and order are
      consistent enough to trust; the **exam weightings** below are the part
      most worth a second look, since sources differed on the exact ranges for
      Mechanics.

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
- [x] **Simulation as the analogue of "the program runs".** Done 2026-09-14.
      `sim verify` blocks declare an equation of motion, an initial condition
      and the closed form the chapter claims; RK4 integrates the first and
      compares against the last. Deliberately declarative — an author states
      the physics and the claim and cannot write the comparison, because a
      check you can tune until it passes is not a check. It has its own
      self-test with two claims that must fail, since a harness that stopped
      catching wrong physics would look exactly like a green build.
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

### Part 1 — Mechanics (units 1-7)

| # | Unit | Weight | State |
|---|---|---|---|
| 1 | Kinematics | 10-20% | done |
| 2 | Force and Translational Dynamics | 20-25% | done; gravitation now lives here |
| 3 | Work, Energy, and Power | 15-20% | done |
| 4 | Linear Momentum | 10-15% | done |
| 5 | Torque and Rotational Dynamics | 20-25% | done |
| 6 | Energy and Momentum of Rotating Systems | 5-10% | done |
| 7 | Oscillations | 5-10% | done |

### Part 2 — Electricity and Magnetism (units 8-13)

| # | Unit | Weight | State |
|---|---|---|---|
| 8 | Electric Charges, Fields, and Gauss's Law | 15-25% | done — Coulomb/fields and Gauss's law |
| 9 | Electric Potential | 10-20% | done |
| 10 | Conductors and Capacitors | 10-15% | done |
| 11 | Electric Circuits | 15-25% | done — DC circuits and RC circuits |
| 12 | Magnetic Fields and Electromagnetism | 10-20% | done |
| 13 | Electromagnetic Induction | 10-20% | done |

Every unit has at least one chapter; units 2, 8 and 11 have two. The heaviest
unit still on a single chapter is **5**, Torque and Rotational Dynamics at
20-25% — it covers rotational kinematics, moment of inertia and torque in one
go, so a second chapter on rolling and statics would earn its place.

## Rules specific to this book

- **Problems are original.** College Board questions are copyrighted; write to
  the archetypes, never transcribe.
- **This is not an official College Board product** and must not imply it is.
- **Every result is checked against a simulation**, or it is deleted.
- **Symbols carry units.** A derivation that does not survive a dimensional
  check is wrong, and checking it is cheap enough to do automatically.
