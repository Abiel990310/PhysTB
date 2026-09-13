# PhysTB

An interactive **AP Physics C** textbook — Mechanics and Electricity &
Magnetism — where every result is checked against a simulation that runs.

In the same family as [CppTB](https://github.com/Abiel990310/CppTB),
[JavaTB](https://github.com/Abiel990310/JavaTB),
[CsaTB](https://github.com/Abiel990310/CsaTB) and
[CalTB](https://github.com/Abiel990310/CalTB).

> **Not an official College Board product.** AP® is a trademark of the College
> Board, which does not endorse and is not involved with this book. Every
> practice question here is original, written to the same shapes the exam uses —
> none is reproduced from a real exam.

## The idea

The sibling books lean on a compiler: a claim is true because the program runs.
Here the equivalent is a simulation. Every closed-form result in the prose is
checked against a numerical integration of the same setup, and the build fails
if they disagree — so the formula on the page and the physics underneath it are
never allowed to drift apart.

You get the same thing to hold: set the initial conditions, watch the motion,
with the analytic solution drawn over the top.

## Two exams

Mechanics and E&M are separate exams with largely separate content, so they are
two parts of this book. Pick one; nothing forces you through the other.

## Status

Earliest stage — the engine is not built yet, and some of it waits on CalTB,
whose symbolic verifier and graph widget are shared. See
[`docs/ROADMAP.md`](docs/ROADMAP.md).
