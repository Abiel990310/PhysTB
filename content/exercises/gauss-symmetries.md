---
id: gauss-symmetries
title: "Four Gaussian surfaces"
difficulty: core
chapter: gausss-law
topics: [electrostatics, gauss]
scope: em
---

Each part is the same three steps: pick the surface the symmetry hands you,
write the flux as $E$ times an area, and set it equal to
$Q_{\text{enc}}/\varepsilon_0$.

Write $\varepsilon_0$ as `eps`, and use `pi`. Answer in symbols.

```answer
prompt: A charge q sits somewhere inside a closed surface of any shape. What is the total flux out of it?
reference: q/eps
variable: q eps
positive: eps
accept:
  - (1/eps)*q
reject:
  - q/(2*eps)
  - q*eps
  - 0
```

```answer
prompt: An infinite line has linear charge density a. Give the field at distance r from it.
reference: a/(2*pi*eps*r)
variable: a eps r
positive: eps r
accept:
  - a/(2*eps*pi*r)
  - a*(2*pi*eps*r)^(-1)
reject:
  - a/(4*pi*eps*r**2)
  - a/(2*pi*eps*r**2)
  - a/(2*eps)
```

```answer
prompt: An infinite sheet has surface charge density s. Give the field a distance r from it.
reference: s/(2*eps)
variable: s eps r
positive: eps r
accept:
  - 0.5*s/eps
reject:
  - s/eps
  - s/(2*eps*r)
  - s/(2*pi*eps*r)
```

```answer
prompt: A ball of radius R carries total charge Q spread evenly through its volume. Give the field at a radius r inside it, r < R.
reference: Q*r/(4*pi*eps*R**3)
variable: Q r eps R
positive: eps r R
accept:
  - Q*r/(4*pi*eps*R^3)
  - (Q/(4*pi*eps))*(r/R**3)
reject:
  - Q/(4*pi*eps*r**2)
  - Q/(4*pi*eps*R**2)
  - Q*r**3/(4*pi*eps*R**3)
```

## Hints
- The first part is the law itself. Read the question again — it asks for the total flux, and Gauss's law gives exactly that, for any shape and any position inside.
- For the line, the useful surface is a coaxial cylinder. Its flat ends have the field lying in them and contribute no flux; only the curved side of area 2πrh counts, and it encloses charge a·h.
- For the sheet, the pillbox has **two** faces, and the field goes out through both. That factor of two is where the 2 in the denominator comes from.
- Inside the ball, only the charge within radius r is enclosed, and charge scales with volume — so the enclosed fraction is r³/R³, not r/R.

## Notes
**The flux.** $\Phi = q/\varepsilon_0$, whatever the surface looks like and
wherever inside the charge sits. Answering $0$ is the mistake of thinking a
lopsided position must unbalance something; it changes the field everywhere on
the surface and cannot change the total.

**The line.** Flux $= E \cdot 2\pi r h$ and $Q_{\text{enc}} = \lambda h$, so
$E = \tfrac{\lambda}{2\pi\varepsilon_0 r}$ — the $h$ cancels, which it must,
since an infinite line has no preferred length. The tempting wrong answer is
$1/r^2$: that is the point-charge falloff, and spreading the charge along a line
changes it, because the surface area now grows like $r$ rather than $r^2$.

**The sheet.** Flux $= E \cdot 2A$ through the two faces and
$Q_{\text{enc}} = \sigma A$, so $E = \tfrac{\sigma}{2\varepsilon_0}$ — with no
$r$ in it. The field genuinely does not weaken with distance, because moving
away weakens each piece of charge while bringing more of the sheet into view,
and for an infinite sheet those cancel exactly.

Answering $\sigma/\varepsilon_0$ forgets the second face — and is, not by
coincidence, the field *between* two oppositely charged sheets, where the two
contributions add.

**Inside the ball.** $Q_{\text{enc}} = Q\tfrac{r^3}{R^3}$, and flux
$= E\cdot 4\pi r^2$, so $E = \tfrac{Qr}{4\pi\varepsilon_0 R^3}$ — linear in $r$,
zero at the centre, and at $r = R$ it equals $\tfrac{Q}{4\pi\varepsilon_0 R^2}$,
which is the outside expression evaluated at the surface. That agreement is the
check worth making on any piecewise field.

Answering $\tfrac{Q}{4\pi\varepsilon_0 r^2}$ uses the whole charge at every
radius, which is the outside field applied where it does not hold.
