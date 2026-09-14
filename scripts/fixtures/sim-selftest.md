---
title: "Simulation self-test fixture"
---

Claims with known verdicts, asserted by `scripts/selftest-sim.ts`. The false one
matters most: a harness that stopped catching wrong physics would look exactly
like a passing build.

```sim verify
# expect: ok
rates:  x' = v, v' = -4*x
init:   x = 1, v = 0
exact:  x = cos(2*t)
span:   0..6
tol:    1e-6
```

```sim verify
# expect: ok
rates:  v' = -0.5*v
init:   v = 10
exact:  v = 10*exp(-0.5*t)
span:   0..8
tol:    1e-6
```

```sim verify
# expect: wrong
rates:  x' = v, v' = -4*x
init:   x = 1, v = 0
exact:  x = cos(3*t)
span:   0..6
tol:    1e-6
```

```sim verify
# expect: wrong
rates:  v' = -0.5*v
init:   v = 10
exact:  v = 10*exp(-0.4*t)
span:   0..8
tol:    1e-6
```
