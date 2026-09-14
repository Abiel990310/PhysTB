"""
Decide whether the mathematical claims in the book are true.

Reads a JSON list of claims on stdin, writes a JSON list of verdicts on stdout.
The TypeScript side does the scanning and the reporting; this side only does
mathematics, so that the only thing trusted with a "true" is SymPy.

Three verdicts, and the third is the point:

    ok        proved true
    wrong     proved false, with a counterexample where one exists
    unproved  SymPy could not decide

`unproved` exists because `simplify(a - b)` returning something other than zero
means either "these differ" or "I could not show they are the same", and a
verifier that silently treats the second as the first would pass false claims —
while one that treats it as failure would block true ones. Both are worse than
saying which happened. A build may decide what to do with `unproved`; it must
never be reported as verified.
"""

from __future__ import annotations

import json
import random
import sys

import sympy
from sympy import Symbol, simplify, diff, integrate, limit, summation, oo, nsimplify
from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication_application,
)

TRANSFORMS = standard_transformations + (implicit_multiplication_application,)

# Names an author may use without declaring them.
LOCALS = {
    "x": Symbol("x"),
    "y": Symbol("y"),
    "t": Symbol("t"),
    "n": Symbol("n"),
    "k": Symbol("k"),
    "a": Symbol("a"),
    "b": Symbol("b"),
    "C": Symbol("C"),
    "oo": oo,
    "e": sympy.E,
    "pi": sympy.pi,
}

# Six capitals are already taken in SymPy's namespace, and every one of them is
# a letter physics uses constantly: Q is the assumptions registry, E is Euler's
# number, I is the imaginary unit, and N, S and O are utilities. Left alone, a
# circuits chapter writing I for current gets sqrt(-1), and one writing Q for
# charge gets an assumptions object — which fails loudly if you are lucky and
# silently if you are not.
#
# `C` is deliberately NOT in this list: it stays the constant of integration,
# which the integral check substitutes away. A chapter needing capacitance in
# an *integral* claim should name it something else.
for _name in ("Q", "E", "I", "N", "S", "O"):
    LOCALS[_name] = Symbol(_name)


def parse(text: str, positive=()):
    """
    Parse an expression, optionally with symbols declared positive.

    A claim may say `# assume: b > 0`, which matters because many true physical
    statements are false without it — a decay towards a limit runs the other way
    for a negative rate constant. The assumption is the author's, written in the
    source, rather than something the checker grants silently.
    """
    names = {**LOCALS}
    for name in positive:
        names[name] = Symbol(name, positive=True)
    return parse_expr(text, local_dict=names, transformations=TRANSFORMS)


def numeric_disagreement(expr, var, tries: int = 40):
    """
    Find a point where `expr` is clearly not zero.

    Used only to tell "these are different" from "I could not simplify it".
    Points that make the expression undefined are skipped rather than counted,
    since a removable singularity is not a counterexample.
    """
    rng = random.Random(20260913)
    for _ in range(tries):
        point = rng.uniform(0.3, 2.7)
        try:
            value = complex(expr.subs(var, point).evalf())
        except (TypeError, ValueError, ZeroDivisionError, AttributeError):
            continue
        if value != value:            # NaN: undefined here, not a disagreement
            continue
        if abs(value) > 1e-6:
            return point, value
    return None


def same_verdict(got, expected, var):
    """
    Classify whether `got` equals `expected`.

    Subtracting is the usual route, but it breaks on infinities: a limit of oo
    compared against oo gives oo - oo, which is nan, and nan is not zero — so
    every correct infinite limit would be reported undecidable. Structural
    equality is checked first for exactly that case.
    """
    if got == expected:
        return "ok", None
    if got in (oo, -oo) or expected in (oo, -oo):
        # One side is infinite and they are not the same object, so they differ:
        # oo vs -oo, or oo vs a finite value. Both are definite answers.
        return "wrong", f"{got} is not {expected}"
    return zero_verdict(got - expected, var)


def zero_verdict(difference, var):
    """Classify `difference` as provably zero, provably not, or undecided."""
    simplified = simplify(difference)
    if simplified == 0:
        return "ok", None

    # Try harder before giving up: these catch most true-but-tangled identities.
    for harder in (sympy.expand_trig, sympy.radsimp, sympy.cancel, sympy.expand):
        try:
            if simplify(harder(simplified)) == 0:
                return "ok", None
        except Exception:
            pass

    # A difference with nothing free in it is just a number, and a number is
    # either zero or it is not — there is nothing left to be undecided about.
    # Limits and sums land here, and without this they would be reported as
    # "could not decide" when they are plainly false.
    if not simplified.free_symbols:
        try:
            value = complex(simplified.evalf())
            if abs(value) > 1e-12:
                return "wrong", f"the two sides differ by {simplified} ({value.real:+.6g})"
        except (TypeError, ValueError):
            pass

    if var is not None:
        found = numeric_disagreement(simplified, var)
        if found is not None:
            point, value = found
            return "wrong", f"differs at {var} = {point:.4f} by {value.real:+.6g}"

    return "unproved", f"SymPy reduced the difference to {simplified!r}, not 0"


def check(claim: dict) -> dict:
    kind = claim["kind"]
    pos = tuple(claim.get("positive") or ())

    def p(text):
        return parse(text, pos)

    try:
        if kind == "deriv":
            #  d/dx <expr> = <claimed>
            var = p(claim["var"])
            got = diff(p(claim["lhs"]), var)
            status, detail = zero_verdict(got - p(claim["rhs"]), var)

        elif kind == "integ":
            #  int <expr> d<var> = <claimed antiderivative>, up to a constant.
            #  Differentiating the claim is what makes +C a non-issue: any two
            #  antiderivatives of the same function differ by a constant, and a
            #  constant differentiates away.
            var = p(claim["var"])
            claimed = p(claim["rhs"]).subs(LOCALS["C"], 0)
            status, detail = zero_verdict(diff(claimed, var) - p(claim["lhs"]), var)

        elif kind == "limit":
            var = p(claim["var"])
            got = limit(p(claim["lhs"]), var, p(claim["to"]))
            status, detail = same_verdict(got, p(claim["rhs"]), None)

        elif kind == "sum":
            var = p(claim["var"])
            got = summation(p(claim["lhs"]), (var, p(claim["lo"]), p(claim["hi"])))
            status, detail = same_verdict(got, p(claim["rhs"]), None)

        elif kind == "ident":
            lhs, rhs = p(claim["lhs"]), p(claim["rhs"])
            free = sorted(lhs.free_symbols | rhs.free_symbols, key=str)
            status, detail = zero_verdict(lhs - rhs, free[0] if free else None)

        else:
            return {**claim, "status": "wrong", "detail": f"unknown claim kind {kind!r}"}

    except Exception as exc:                       # a claim that cannot even be
        return {**claim, "status": "wrong",        # parsed is a broken claim
                "detail": f"{type(exc).__name__}: {exc}"}

    return {**claim, "status": status, "detail": detail}


def main() -> None:
    claims = json.load(sys.stdin)
    json.dump([check(c) for c in claims], sys.stdout)


if __name__ == "__main__":
    main()
