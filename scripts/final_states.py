"""
Integrate a list of systems and report where each one ends up.

This exists only to be compared against `src/lib/ode.ts`, by
`scripts/verify-ode.ts`. It deliberately reuses `check_sim.py`'s own rk4 and
expression compiler rather than reimplementing them, because a copy would
drift and then the comparison would be checking the copy instead of the thing
that decides whether the book's physics is true.
"""

from __future__ import annotations

import json
import re
import sys

from check_sim import compile_rate, rk4


def parse_spec(text: str):
    def field(name: str):
        m = re.search(rf"^\s*{name}:\s*(.+)$", text, re.M)
        return m.group(1).strip() if m else None

    names, rates = [], []
    for piece in field("rates").split(","):
        m = re.match(r"\s*(\w+)'\s*=\s*(.+)$", piece)
        names.append(m.group(1))
        rates.append(m.group(2).strip())

    init = field("init")
    state = []
    for name in names:
        m = re.search(rf"\b{name}\s*=\s*([^,]+)", init)
        state.append(float(m.group(1).strip()))

    span = float(re.match(r"\s*0\s*\.\.\s*(.+)$", field("span")).group(1))
    return names, rates, state, span


def main() -> None:
    payload = json.load(sys.stdin)
    steps = payload["steps"]
    out = []

    for spec in payload["systems"]:
        names, rate_sources, state, span = parse_spec(spec)
        compiled = [compile_rate(src, names) for src in rate_sources]
        dt = span / steps
        for i in range(steps):
            state = rk4(compiled, state, i * dt, dt)
        out.append(list(state))

    json.dump(out, sys.stdout)


if __name__ == "__main__":
    main()
