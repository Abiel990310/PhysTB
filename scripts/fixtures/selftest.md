---
title: "Self-test fixture"
---

Claims with known verdicts. `scripts/selftest-math.ts` asserts each one, so a
change to the checker that stops catching false mathematics fails loudly
instead of silently passing a wrong book.

```math verify
# expect: ok
d/dx x**3 = 3*x**2
d/dx sin(x)*cos(x) = cos(2*x)
d/dx log(x**2 + 1) = 2*x/(x**2 + 1)
int x*exp(x) dx = exp(x)*(x - 1) + C
int 1/x dx = log(x)
int 2*x dx = x**2 + 17
lim x->0 sin(x)/x = 1
lim x->oo (1 + 1/x)**x = e
lim x->0 1/x**2 = oo
lim x->oo x**2 = oo
sum n=0..oo 1/2**n = 2
sum n=1..oo 1/n**2 = pi**2/6
sin(x)**2 + cos(x)**2 = 1
(x - 1)*(x + 1) = x**2 - 1
```

```math verify
# expect: wrong
d/dx x**3 = 2*x**2
int x*exp(x) dx = exp(x)*(x + 1)
lim x->0 sin(x)/x = 0
lim x->0 1/x**2 = -oo
sin(x)**2 + cos(x)**2 = 2
sum n=1..oo 1/n**2 = pi**2/7
```

```math verify
# expect: unproved
asin(x) + acos(x) = pi/2
```

An assumption the author declares, which the checker honours. Without the
`assume` line this claim is false — a decay runs the other way when the rate
constant is negative — so this is also a test that the declaration is actually
being threaded through.

```math verify
# expect: ok
# assume: b > 0
lim t->oo (1 - exp(-b*t)) = 1
lim t->oo exp(-b*t) = 0
```

Capitals that SymPy already owns. `I` is its imaginary unit, `E` its Euler
number and `Q` its assumptions registry — and all three are letters physics uses
for current, EMF and charge. These confirm they behave as ordinary symbols, so
a circuits chapter means what it writes.

```math verify
# expect: ok
d/dI (I**2*R) = 2*I*R
d/dQ (Q**2/2) = Q
E*I = I*E
d/dt (Q*exp(-t)) = -Q*exp(-t)
```
