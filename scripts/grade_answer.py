"""
Decide whether a reader's answer means the same thing as the reference.

This is the grading counterpart of `check_math.py`, and it exists because
string comparison is not acceptable here. A reader who writes `(x-1)e^x` for an
integral whose reference is `e^x*(x-1)` is right, and a grader that says
otherwise teaches them to distrust it — after which the grader is worse than
useless, because they stop reading its verdicts.

So equivalence is decided symbolically, with three allowances that reflect how
mathematics is actually written:

  * **the constant of integration** — any two antiderivatives differing by a
    constant are the same answer, so `x**2/2`, `x**2/2 + C` and `x**2/2 + 7`
    all pass when the reference is an antiderivative;
  * **unsimplified form** — `2*x/2` is `x`;
  * **numeric tolerance** — a decimal answer to a question with an exact answer
    is accepted when it is close enough, because a reader who writes 0.6667 for
    2/3 has done the mathematics.

What it does NOT allow is a wrong answer that happens to look similar, and the
self-test exists to keep it that way.
"""

from __future__ import annotations

import json
import sys

import sympy
from sympy import Symbol, simplify, diff, symbols

from check_math import parse, LOCALS

# Reader answers are more forgiving than authored claims: a reader writing "C"
# means the constant of integration, and one writing "e" means Euler's number.
CONST = Symbol("C")


def equivalent(given, reference, var, mode: str) -> tuple[bool, str]:
    """Is `given` the same answer as `reference`?"""
    if mode == "antiderivative":
        # Differentiate both and compare. Any constant differentiates away, so
        # this accepts every correct antiderivative without special-casing C.
        difference = simplify(diff(given, var) - diff(reference, var))
        if difference == 0:
            return True, "same derivative, so the same antiderivative"
        return False, f"differentiating your answer does not match: {simplify(diff(given, var))}"

    difference = simplify(given - reference)
    if difference == 0:
        return True, "equivalent"

    # Try harder before rejecting: these catch true-but-tangled forms.
    for harder in (sympy.expand_trig, sympy.radsimp, sympy.cancel, sympy.expand, sympy.factor):
        try:
            if simplify(harder(difference)) == 0:
                return True, "equivalent after simplification"
        except Exception:
            pass

    # A numeric answer to an exact question, close enough to count.
    if not difference.free_symbols:
        try:
            value = complex(difference.evalf())
            if abs(value) < 1e-6:
                return True, f"numerically equal to within {abs(value):.1e}"
            return False, f"differs by {simplify(difference)}"
        except (TypeError, ValueError):
            pass

    return False, f"not equivalent — the difference simplifies to {simplify(difference)}"


def names_in(spec: str) -> list[str]:
    """The variable names a problem declares, from its `variable:` field."""
    return [n for n in spec.replace(",", " ").split() if n]


def first_variable(spec: str):
    """The variable to differentiate against, from a `variable:` field.

    Physics problems name several — "in terms of g and h" is written
    `variable: g h` — but only antiderivative mode needs to pick one, and it is
    the first. Plain equivalence needs none: subtracting two expressions and
    simplifying settles it however many symbols they contain.
    """
    names = [n for n in spec.replace(",", " ").split() if n]
    return parse(names[0] if names else "x")


def grade(item: dict) -> dict:
    try:
        spec = item.get("var", "x")
        declared = names_in(spec)
        var = first_variable(spec)
        # Declaring the names matters more than it looks. SymPy splits any
        # multi-letter symbol it does not know into single-letter factors, so
        # `xy` becomes x*y — which is what a reader means — but `v0` becomes
        # v*0, which is ZERO. Initial velocity is the most common symbol in a
        # physics problem, and without this an answer of `v0 + a*t` would be
        # silently graded as `a*t`, and a reference of `v0` as nothing at all.
        # A physical quantity is positive, and saying so is the author's job,
        # not something the grader may assume. It matters: sqrt(d**2*k/m) is
        # |d|*sqrt(k/m), so without knowing d > 0 SymPy is right to refuse a
        # reader who cancelled the square. A compression distance is positive.
        positive = names_in(item.get("positive", ""))
        given = parse(item["given"], positive=positive, declared=declared)
        reference = parse(item["reference"], positive=positive, declared=declared)
        ok, detail = equivalent(given, reference, var, item.get("mode", "expression"))
        return {**item, "correct": ok, "detail": detail}
    except Exception as exc:
        # A reader's typo is a wrong answer with a helpful message, not a crash.
        return {**item, "correct": False,
                "detail": f"could not read that as an expression: {type(exc).__name__}: {exc}"}


def main() -> None:
    items = json.load(sys.stdin)
    json.dump([grade(i) for i in items], sys.stdout)


if __name__ == "__main__":
    main()
