---
title: "Electric potential and potential energy"
navTitle: "Electric potential"
summary: >-
  Field and potential are the same information written two ways, related by an
  integral one direction and a derivative the other. Working with the scalar is
  almost always easier.
objectives:
  - Distinguish electric potential energy from electric potential
  - Compute potential by integrating the field along a path
  - Recover the field from the potential by differentiation
  - Use superposition to find the potential of several point charges
  - Read equipotential surfaces and relate them to field lines
scope: em
status: complete
standard: none
---

Chapter 8 gave you the field, which is a vector at every point in space. Adding
vectors is work, and most questions do not need the vector — they need an energy
or a voltage. Those are scalars, and this chapter is about the fact that you can
get them without ever adding a vector.

## Two quantities that are easy to confuse

**Electric potential energy** $U$ belongs to a *configuration of charges*. It is
measured in joules, and it is what changes when a charge moves.

**Electric potential** $V$ belongs to a *point in space*, independent of what is
sitting there. It is measured in volts, one volt being one joule per coulomb:

$$V = \frac{U}{q} \qquad\Longleftrightarrow\qquad U = qV$$

The distinction is the same one as between the gravitational field $g$ and the
potential energy $mgh$ — the field is a property of the source, the energy needs
a test object to be an energy *of*.

:::pitfall
A point with a high potential is not a point with a lot of energy. A proton and
an electron at the same point have the same $V$ and *opposite* $U$, because
$U = qV$ and their charges have opposite signs.

This is exactly why the electron accelerates towards high potential and the
proton away from it. Nothing about the point changed; the sign of $q$ did.
:::

## From the field to the potential

Moving a charge against the field takes work, and that work is stored. Dividing
out the charge:

$$\Delta V = V_b - V_a = -\int_a^b \vec E\cdot d\vec\ell$$

The minus sign says the potential *falls* in the direction the field points,
which is the direction a positive charge would be pushed. For a point charge,
taking $V = 0$ infinitely far away:

$$V(r) = \frac{1}{4\pi\varepsilon_0}\frac{q}{r} = \frac{kq}{r}$$

```math verify
int k*q/r**2 dr = -k*q/r
d/dr (k*q/r) = -k*q/r**2
```

The first line is the integration; the second differentiates the answer back to
the field, which is the honest check. Notice the exponents: the **field** falls
as $1/r^2$, the **potential** as $1/r$. Confusing the two is the most common
error in this unit, and the integral above is why they differ — integrating
$r^{-2}$ raises the power by one.

## Superposition, and why the scalar is easier

Potentials add as numbers:

$$V = k\sum_i \frac{q_i}{r_i}$$

No components, no angles, no diagram. The field from the same charges needs each
vector resolved and added, which is several times the work and several times the
opportunities for a sign error.

```math verify
k*2/r + k*(-1)/r = k/r
k*q/a + k*q/b = k*q*(a + b)/(a*b)
```

The first line is worth reading twice: a $+2$ and a $-1$ charge equidistant from
a point give a *nonzero* potential there, and the signs simply add. Two equal
and opposite charges equidistant give exactly zero — but the field there is not
zero at all, because the two field vectors point the same way.

:::warning
**$V = 0$ does not mean $\vec E = 0$, and $\vec E = 0$ does not mean $V = 0$.**

Midway between $+q$ and $-q$, the potential is zero and the field is at its
strongest. Inside a charged hollow conductor, the field is zero everywhere and
the potential is a constant equal to its surface value — not zero.

They are related by a derivative, and a function can be zero where its slope is
not, and flat where its value is not.
:::

## From the potential back to the field

The relation inverts, and this direction is often the useful one:

$$E_x = -\frac{\partial V}{\partial x}$$

The field is the negative gradient of the potential — it points **downhill** in
$V$, steeply where $V$ changes fast.

```math verify
d/dr (-k*q/r) = k*q/r**2
d/dx (-(-3*x**2)) = 6*x
```

If a region has $V = -3x^2$, then $E_x = 6x$: a field growing linearly with
position, pointing away from the origin on the right.

This inversion is the reason the scalar route is worth taking. Compute the
potential by summing numbers, then differentiate once to recover the whole field
vector. You never add a single vector.

## Equipotentials

An **equipotential** is a surface on which $V$ is constant. Three facts follow
immediately from $\vec E = -\nabla V$:

- **Moving a charge along an equipotential takes no work**, since $\Delta V = 0$
  and $W = q\Delta V$.
- **Field lines cross equipotentials at right angles.** A component of $\vec E$
  along the surface would mean $V$ changing along it, which contradicts
  "equipotential".
- **Closely spaced equipotentials mean a strong field**, because the same step
  in $V$ happens over a shorter distance, and the field is the rate of change.

A conductor in equilibrium is an equipotential — chapter 10 opens with that, and
it is the same statement as "the field inside is zero".

:::quiz
{
  "question": "Two equal positive charges sit a distance 2d apart. At the midpoint between them, what are the field and the potential?",
  "options": [
    {
      "text": "E = 0, and V = 2kq/d, which is not zero",
      "correct": true,
      "why": "The two field vectors are equal and opposite there, so they cancel. The potentials are both +kq/d and add as numbers to 2kq/d. This is the standard demonstration that E = 0 and V = 0 are independent conditions."
    },
    {
      "text": "Both are zero, since the charges are symmetric",
      "correct": false,
      "why": "The symmetry cancels the field, because it is a vector and the two contributions point oppositely. It does not cancel the potential, which is a scalar: two positive charges both contribute positive potential and they add."
    },
    {
      "text": "E = 2kq/d², and V = 0",
      "correct": false,
      "why": "Exactly backwards. The field contributions cancel by symmetry and the potentials add. This is the answer you get by treating the potential as though it had a direction."
    },
    {
      "text": "E = 0 and V = 0, because the potential is defined as zero where the field vanishes",
      "correct": false,
      "why": "The zero of potential is a choice — conventionally at infinity — and it is not tied to where the field vanishes. V is fixed by the integral of E along a path from the reference point, not by E at the point itself."
    }
  ]
}
:::

:::recap
- $V$ is potential, a property of a point, in volts; $U = qV$ is potential
  energy, a property of a charge placed there, in joules.
- $\Delta V = -\int \vec E\cdot d\vec\ell$ going one way,
  $\vec E = -\nabla V$ coming back. Same information, two forms.
- A point charge has $E \propto 1/r^2$ but $V \propto 1/r$ — the integration
  raises the power.
- Potentials superpose as signed numbers, which is why the scalar route beats
  adding field vectors nearly every time.
- $V = 0$ and $\vec E = 0$ are independent: between two equal positive charges
  the field vanishes and the potential does not.
- Field lines meet equipotentials at right angles, and crowd where the field is
  strong.
:::
