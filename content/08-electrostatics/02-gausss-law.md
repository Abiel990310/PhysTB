---
title: "Gauss's law"
navTitle: "Gauss's law"
summary: >-
  Flux through a closed surface counts the charge inside and nothing else. It is
  always true, and it is useful exactly when the symmetry lets you pull E out of
  the integral.
objectives:
  - Compute electric flux through a surface
  - State Gauss's law and say why the shape of the surface does not matter
  - Choose a Gaussian surface that makes the integral trivial
  - Find the field of a sphere, a line and a sheet of charge
  - Explain why the field inside a uniform shell is zero
scope: em
status: complete
standard: none
---

Chapter 8.1 found fields by superposition: break the charge into pieces, add the
contributions as vectors, integrate. That always works and is often miserable.

Gauss's law is the shortcut, and it is a genuine shortcut only under symmetry.
The rest of the time it is still *true* — it is one of Maxwell's equations — but
it tells you a number without telling you the field, and knowing which case you
are in is most of the skill.

## Flux

**Electric flux** measures how much field passes through a surface:

$$\Phi_E = \int \vec E\cdot d\vec A$$

The dot product is doing the work. $d\vec A$ points perpendicular to the
surface, so field that lies *along* the surface contributes nothing, and field
straight through contributes everything. A flat area $A$ in a uniform field at
angle $\theta$ to the normal gives $\Phi = EA\cos\theta$ — same cosine, same
reason, as work in chapter 3.1.

Flux is a scalar, and it is signed: outward through a closed surface is
positive, inward negative.

## The law

$$\oint \vec E\cdot d\vec A = \frac{Q_{\text{enc}}}{\varepsilon_0}$$

The total flux out of any **closed** surface depends only on the charge
**enclosed**. Not on where inside it sits, not on the shape of the surface, and
not on any charge outside.

That last clause surprises people, so it is worth saying why. A charge outside
the surface has all its field lines entering and leaving again — every line in
is a line out, so its net contribution is zero. It absolutely does affect the
field at each point of the surface; it just cannot change the total.

:::pitfall
**Zero flux does not mean zero field.** Put a Gaussian surface next to a point
charge, not enclosing it: the flux is exactly zero and the field on that surface
is nowhere zero.

Gauss's law constrains a *total*. Reading it as a statement about $\vec E$ at
any particular point is the most common way to misuse it.
:::

## When it is a shortcut

The law is always true. It gives you the field only when you can find a surface
on which $E$ is constant and either parallel or perpendicular to $d\vec A$
everywhere — because only then does $\oint \vec E\cdot d\vec A$ collapse to
$E \times (\text{area})$ and let you solve for $E$.

Three symmetries do this, and they are the three the exam uses:

| Symmetry | Gaussian surface | What collapses |
|---|---|---|
| Spherical | a sphere | $E$ is constant on it, radial everywhere |
| Cylindrical (a long line) | a coaxial cylinder | $E$ radial; ends contribute nothing |
| Planar (a large sheet) | a "pillbox" through the sheet | $E$ perpendicular; sides contribute nothing |

Anything else — a finite rod, two unequal charges, a cube of charge — has no
such surface, and you are back to integrating superposition.

### A point charge, and the consistency check

Put a sphere of radius $r$ around a charge $q$. By symmetry $E$ is the same
everywhere on it and points radially out, so the flux is $E \cdot 4\pi r^2$:

```math verify
(q/(4*pi*e*r**2))*4*pi*r**2 = q/e
```

That line reads backwards as the derivation: if
$E = \tfrac{q}{4\pi\varepsilon_0 r^2}$, then the flux is $\tfrac{q}{\varepsilon_0}$,
which is what the law demands. So Gauss's law returns **Coulomb's law** exactly.

It has to. The two are not independent facts, and that $4\pi$ in Coulomb's
constant is there precisely because a sphere has area $4\pi r^2$.

### A long line of charge

Linear charge density $\lambda$, a coaxial cylinder of radius $r$ and length
$h$. The flat ends have $\vec E$ lying *in* them and contribute no flux; the
curved side has area $2\pi r h$ with $E$ constant and perpendicular:

```math verify
(a/(2*pi*e*r))*2*pi*r*h = a*h/e
```

with $a$ standing for $\lambda$. The enclosed charge is $\lambda h$, so the law
gives $\lambda h/\varepsilon_0$ — matching — and

$$E = \frac{\lambda}{2\pi\varepsilon_0 r}$$

**$1/r$, not $1/r^2$.** Spreading charge along a line changes the falloff,
because the area of the relevant surface now grows like $r$ rather than $r^2$.

### A large sheet of charge

Surface density $\sigma$, and a pillbox poking through it with face area $A$.
The sides contribute nothing; **both** faces do:

```math verify
(s/(2*e))*2*A = s*A/e
```

The enclosed charge is $\sigma A$, so

$$E = \frac{\sigma}{2\varepsilon_0}$$

and there is no $r$ in it at all — **the field of an infinite sheet does not
depend on distance.** Move twice as far away and the field is identical.

That is not a trick of the idealisation so much as a consequence of it: moving
away weakens each piece of charge by $1/r^2$, but brings proportionally more of
the sheet into view, and for an infinite sheet those cancel exactly.

:::note
Two oppositely charged sheets — a parallel-plate capacitor — give
$\tfrac{\sigma}{2\varepsilon_0}$ each, adding to $\tfrac{\sigma}{\varepsilon_0}$
between them and cancelling to zero outside.

That is where chapter 10.1's $E = \sigma/\varepsilon_0$ comes from, and why
$C = \varepsilon_0 A/d$ has no $4\pi$ in it while Coulomb's law does.
:::

## Inside a uniform sphere of charge

Take total charge $Q$ spread evenly through a ball of radius $R$, and ask for
the field at $r < R$. A Gaussian sphere of radius $r$ encloses only the fraction
of the charge inside it, which scales as the volume — $Q r^3/R^3$:

```math verify
(Q*r/(4*pi*e*R**3))*4*pi*r**2 = Q*r**3/(R**3*e)
```

so

$$E_{\text{inside}} = \frac{Qr}{4\pi\varepsilon_0 R^3}$$

The field **grows linearly** from zero at the centre:

```math verify
d/dr (Q*r/(4*pi*e*R**3)) = Q/(4*pi*e*R**3)
```

a constant slope. Outside, the whole charge is enclosed and the field is the
point-charge one, falling as $1/r^2$. The two meet at the surface:

```math verify
Q*R/(4*pi*e*R**3) = Q/(4*pi*e*R**2)
```

which is the check worth doing on any piecewise field — if the two expressions
disagreed at $r = R$, one of them would be wrong.

### The hollow shell

Now put the charge on the *surface* only. A Gaussian sphere anywhere inside
encloses nothing, so the flux is zero, and by symmetry $E$ is the same all over
it — so $E$ itself is zero.

**The field inside a uniform spherical shell is zero everywhere**, not merely at
the centre. Chapter 10.1 opens with the conductor version of this fact, and it
is the same argument: no enclosed charge, no flux, no field.

The gravitational analogue is identical, because gravity is also an inverse
square law — which is why chapter 2.2 could say that a shell of mass pulls on
nothing inside it.

:::quiz
{
  "question": "A point charge q sits inside a cube. What is the flux out of one face?",
  "options": [
    {
      "text": "q/(6ε₀) only if the charge is at the centre; otherwise the law alone does not say",
      "correct": true,
      "why": "Gauss's law fixes the total flux at q/ε₀ whatever the shape or the position inside. Splitting it equally between six faces needs the symmetry of a centred charge; move it off-centre and the total is unchanged while the six faces no longer share it evenly."
    },
    {
      "text": "q/(6ε₀), always, since a cube has six faces",
      "correct": false,
      "why": "The total is always q/ε₀, but dividing by six assumes the faces are equivalent. That is only true when the charge sits at the centre — the law constrains the sum, not the distribution across faces."
    },
    {
      "text": "q/ε₀, because that is what Gauss's law gives",
      "correct": false,
      "why": "That is the flux through the whole closed surface. One face is part of it, so it carries part of the total."
    },
    {
      "text": "It cannot be found, because a cube has no useful symmetry",
      "correct": false,
      "why": "Too pessimistic. A cube is useless as a surface for extracting E, which is a different question — but the total flux is still exactly q/ε₀, and for a centred charge symmetry does split it six ways."
    }
  ]
}
:::

## Practice

:::exercise gauss-symmetries

:::recap
- Flux is $\int \vec E\cdot d\vec A$: only the component through the surface
  counts, and it is signed.
- $\oint \vec E\cdot d\vec A = Q_{\text{enc}}/\varepsilon_0$ — always true,
  independent of the surface's shape and of every charge outside it.
- It yields $\vec E$ **only** under spherical, cylindrical or planar symmetry,
  where $E$ comes out of the integral. Otherwise integrate superposition.
- Sphere gives $1/r^2$ and returns Coulomb's law; line gives $1/r$; sheet gives
  $\sigma/2\varepsilon_0$, independent of distance.
- Inside a uniform solid sphere the field grows linearly and matches the outside
  expression at the surface. Inside a shell it is zero everywhere.
- Zero flux does not mean zero field. The law constrains a total.
:::
