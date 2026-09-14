"""
Turn verified claims into LaTeX, so the reader sees typeset mathematics.

The `math verify` blocks are the chapter's real mathematics — the equations the
prose is arguing about — and they were being shown as raw SymPy source, which
is both ugly and precisely the "plain text equations" failure this book exists
to avoid.

SymPy's own `latex()` does the conversion, rather than a hand-rolled one on the
TypeScript side. That matters for a reason beyond convenience: the LaTeX the
reader sees is generated from the *same parse* that the checker proved. A
separate converter could drift, and then the page would display one equation
while the build verified another — the worst possible failure for a book whose
whole claim is that what you read has been checked.

Reads the same claim JSON `check_math.py` does; writes {source: latex}.
"""

from __future__ import annotations

import json
import sys

from sympy import Derivative, Integral, Limit, Sum, Eq, latex, oo

from check_math import parse, LOCALS


def render(claim: dict) -> str:
    kind = claim["kind"]
    lhs = parse(claim["lhs"])
    rhs = parse(claim["rhs"])

    if kind == "deriv":
        var = parse(claim["var"])
        return latex(Eq(Derivative(lhs, var), rhs, evaluate=False))

    if kind == "integ":
        var = parse(claim["var"])
        # Render the antiderivative with its constant, since that is how it is
        # written on paper even though the checker differentiates it away.
        return latex(Eq(Integral(lhs, var), rhs, evaluate=False))

    if kind == "limit":
        var = parse(claim["var"])
        to = parse(claim["to"])
        # dir="+-" is the two-sided limit. SymPy's Limit defaults to the
        # right-hand one and renders it "x \to 0^+", which would print a
        # different statement from the one the checker proved.
        return latex(Eq(Limit(lhs, var, to, dir="+-"), rhs, evaluate=False))

    if kind == "sum":
        var = parse(claim["var"])
        lo, hi = parse(claim["lo"]), parse(claim["hi"])
        return latex(Eq(Sum(lhs, (var, lo, hi)), rhs, evaluate=False))

    return latex(Eq(lhs, rhs, evaluate=False))


def main() -> None:
    claims = json.load(sys.stdin)
    out = {}
    for claim in claims:
        try:
            out[claim["source"]] = render(claim)
        except Exception as exc:                 # a claim that will not render
            out[claim["source"]] = ""            # falls back to plain text
            print(f"latex: could not render {claim['source']}: {exc}", file=sys.stderr)
    json.dump(out, sys.stdout)


if __name__ == "__main__":
    main()
