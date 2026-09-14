---
title: "Work and energy"
navTitle: "Work and energy"
summary: >-
  Work is an integral, and the work–energy theorem is what you get when you
  integrate the second law with respect to distance instead of time.
objectives:
  - Compute work as an integral, including for a varying force
  - State and use the work–energy theorem
  - Relate a conservative force to its potential energy by differentiation
  - Read equilibrium and stability off a potential energy curve
scope: mech
status: complete
standard: none
---

Chapter 2 integrated the second law with respect to **time** and got momentum.
Integrate it with respect to **distance** instead and you get energy. That is
the whole relationship between the two, and it explains why energy methods
sidestep time entirely — the variable was integrated away.

## Work is an integral

$$W = \int \vec F \cdot d\vec x$$

For a constant force along the motion this collapses to $W = Fd$, which is the
algebra-based formula and a special case. The general form is what you need the
moment the force varies.

A spring is the standard example. Hooke's law gives $F = -kx$, so stretching
from $0$ to $x$ takes

$$W = \int_0^x kx' \,dx' = \tfrac{1}{2}kx^2$$

```math verify
int k*x dx = k*x**2/2
d/dx (k*x**2/2) = k*x
```

Both directions are checked: integrating the force gives the energy, and
differentiating the energy gives the force back. That reciprocity is the subject
of the last section.

:::pitfall
The dot product matters. **A force perpendicular to the motion does no work.**

- The normal force on a block sliding along a floor: no work.
- The tension in a string whirling a ball in a circle: no work.
- Gravity on a satellite in a circular orbit: no work, which is why its speed is
  constant.

Students often add these into an energy balance and get a wrong answer that
looks carefully reasoned.
:::

## The work–energy theorem

$$W_{\text{net}} = \Delta K = \tfrac12 m v_f^2 - \tfrac12 m v_i^2$$

This is not a new law. It is the second law integrated over distance, and the
derivation is worth seeing once because it explains where the $\tfrac12 v^2$
comes from:

$$\int F\,dx = \int m\frac{dv}{dt}\,dx = \int m\frac{dv}{dt}\frac{dx}{dt}\,dt
 = \int m v \,dv = \tfrac12 m v^2 \Big|$$

```math verify
int m*v dv = m*v**2/2
d/dv (m*v**2/2) = m*v
```

The chain rule step in the middle — rewriting $dx$ as $\tfrac{dx}{dt}dt$ — is
the manoeuvre that converts an integral over distance into one over velocity.
This is chapter 2.3 of CalTB doing real work in a physics derivation.

## Conservative forces and potential energy

A force is **conservative** when the work it does depends only on the endpoints,
not the path taken. Gravity and springs are; friction is not.

For those forces, work can be stored as **potential energy**, defined so that

$$F_x = -\frac{dU}{dx}$$

The force is the negative gradient of the potential. The minus sign says objects
are pushed **downhill** in potential energy, which is the direction that lowers
$U$.

```math verify
d/dx (k*x**2/2) = k*x
d/dx (m*g*x) = m*g
```

Read those with the minus sign in mind: a spring with $U = \tfrac12 kx^2$ gives
$F = -kx$, restoring toward the origin; gravity with $U = mgh$ gives
$F = -mg$, pointing down.

## Reading a potential energy curve

This is a standard Physics C question type, and it is answered entirely by
calculus you already have.

Given a graph of $U(x)$:

| Feature of $U$ | Physical meaning |
|---|---|
| slope | minus the force |
| zero slope | equilibrium |
| minimum ($U'' > 0$) | **stable** equilibrium |
| maximum ($U'' < 0$) | **unstable** equilibrium |
| steepness | magnitude of the force |

The stability rule is just the second derivative test. At a minimum, a small
displacement produces a force pushing back toward the minimum; at a maximum, the
same displacement produces a force pushing further away.

For $U(x) = x^3 - 3x$:

```math verify
d/dx (x**3 - 3*x) = 3*x**2 - 3
d/dx (3*x**2 - 3) = 6*x
```

The equilibria are where $U' = 0$, so $x = \pm 1$. At $x = 1$ the second
derivative $6x$ is positive — a minimum, stable. At $x = -1$ it is negative — a
maximum, unstable. A marble placed at $x = -1$ stays only if placed perfectly;
nudge it and it runs away.

:::note
Total energy $E = K + U$ is constant when only conservative forces act. On a
potential curve, that means drawing a horizontal line at height $E$: the
particle is confined to the region where $U \le E$, since $K = E - U$ cannot be
negative. The points where the line meets the curve are **turning points**,
where the particle momentarily stops and reverses.
:::

:::quiz
{
  "question": "A satellite is in a circular orbit. How much work does gravity do on it over one complete orbit?",
  "options": [
    {
      "text": "Zero, because gravity is always perpendicular to the velocity",
      "correct": true,
      "why": "In a circular orbit the force points to the centre and the velocity is tangential, so F·dx = 0 at every instant. This is why orbital speed is constant — no work, so no change in kinetic energy."
    },
    {
      "text": "Zero, because it returns to its starting point and gravity is conservative",
      "correct": false,
      "why": "The conclusion is right and the reasoning proves something weaker. A conservative force does zero net work around any closed loop, but here the work is zero at every single instant, not merely in total."
    },
    {
      "text": "Positive, since gravity is what keeps it in orbit",
      "correct": false,
      "why": "Gravity supplies the centripetal acceleration, which changes the direction of the velocity, not its magnitude. Changing direction requires no work."
    },
    {
      "text": "It depends on the orbital radius and the satellite's mass",
      "correct": false,
      "why": "Both affect the force's magnitude, but the work is zero regardless because of the angle. A dot product with a perpendicular vector is zero whatever the magnitudes."
    }
  ]
}
:::

:::recap
- $W = \int \vec F\cdot d\vec x$. Constant force gives $Fd$ as a special case;
  a spring gives $\tfrac12 kx^2$.
- A force perpendicular to the motion does no work — normal forces, string
  tension in circular motion, gravity on a circular orbit.
- The work–energy theorem is the second law integrated over distance, which is
  where $\tfrac12 mv^2$ comes from.
- For conservative forces, $F_x = -\tfrac{dU}{dx}$: the force is the negative
  slope of the potential.
- On a $U(x)$ curve, zero slope means equilibrium; a minimum is stable, a
  maximum unstable — the second derivative test, doing physics.
:::
