"""
Check a closed-form physics result against a numerical integration of the same setup.

This is what a compiler is to CppTB and what SymPy is to the algebra: the thing
that decides whether the book is allowed to say what it says. A chapter claims
that a mass on a spring obeys x = A cos(wt); this integrates the actual equation
of motion and compares, so the formula on the page and the physics underneath it
cannot quietly drift apart.

Why numerical rather than symbolic: most equations of motion worth writing about
have no closed form at all — drag, coupled oscillators, anything with a
velocity-dependent force. Integrating works on all of them, and the ones that do
have closed forms are exactly the cases where the comparison is meaningful.

RK4 with a fixed step, because it is short enough to read and accurate enough
that a disagreement means physics rather than arithmetic. A tolerance a claim
cannot meet at a sane step size is the claim's problem, not the integrator's —
so the report always includes the step actually used.
"""

from __future__ import annotations

import json
import math
import sys

from sympy import lambdify, symbols
from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication_application,
)

TRANSFORMS = standard_transformations + (implicit_multiplication_application,)


def compile_rate(expr_text: str, names: list[str]):
    """Turn "−4*x" into a callable of (t, *state)."""
    args = symbols(["t", *names])
    expr = parse_expr(expr_text, transformations=TRANSFORMS)
    return lambdify(args, expr, "math")


def rk4(rates, state: list[float], t: float, dt: float) -> list[float]:
    """One classical Runge–Kutta step. Fourth order, so error per step is dt^5."""
    def deriv(tt, s):
        return [f(tt, *s) for f in rates]

    k1 = deriv(t, state)
    k2 = deriv(t + dt / 2, [s + dt / 2 * k for s, k in zip(state, k1)])
    k3 = deriv(t + dt / 2, [s + dt / 2 * k for s, k in zip(state, k2)])
    k4 = deriv(t + dt, [s + dt * k for s, k in zip(state, k3)])

    return [
        s + dt / 6 * (a + 2 * b + 2 * c + d)
        for s, a, b, c, d in zip(state, k1, k2, k3, k4)
    ]


def check(sim: dict) -> dict:
    try:
        names = list(sim["names"])
        rates = [compile_rate(sim["rates"][n], names) for n in names]
        state = [float(sim["init"][n]) for n in names]

        which = sim["exact_var"]
        if which not in names:
            return {**sim, "status": "wrong",
                    "detail": f"exact names {which!r}, which is not one of {names}"}
        index = names.index(which)

        exact = lambdify(symbols("t"), parse_expr(sim["exact"], transformations=TRANSFORMS), "math")

        t0, t1 = float(sim["span"][0]), float(sim["span"][1])
        tol = float(sim["tol"])

        steps = 20000
        dt = (t1 - t0) / steps

        t = t0
        worst = 0.0
        worst_at = t0
        for _ in range(steps):
            state = rk4(rates, state, t, dt)
            t += dt
            error = abs(state[index] - exact(t))
            if error > worst:
                worst, worst_at = error, t

        if not math.isfinite(worst):
            return {**sim, "status": "wrong",
                    "detail": "the integration blew up — check the rates and the span"}

        if worst <= tol:
            return {**sim, "status": "ok",
                    "detail": f"worst disagreement {worst:.3e} over {steps} steps of {dt:.2e}"}

        return {**sim, "status": "wrong",
                "detail": (f"disagrees by {worst:.3e} at t = {worst_at:.4f}, "
                           f"tolerance {tol:.1e} (step {dt:.2e})")}

    except Exception as exc:
        return {**sim, "status": "wrong", "detail": f"{type(exc).__name__}: {exc}"}


def main() -> None:
    sims = json.load(sys.stdin)
    json.dump([check(s) for s in sims], sys.stdout)


if __name__ == "__main__":
    main()
