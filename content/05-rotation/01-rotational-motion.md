---
title: "Rotational motion"
navTitle: "Rotation"
summary: >-
  Every linear quantity has a rotational twin, and the analogy is exact. Learn
  the correspondence and you have learned the unit.
objectives:
  - Translate between linear and rotational quantities
  - Compute a moment of inertia, including by integration
  - Apply the rotational form of Newton's second law
  - Use the parallel axis theorem to change axes
scope: mech
status: complete
standard: none
---

Rotation looks like a new subject and is not. Every definition, law and theorem
from the first four chapters has an exact rotational counterpart, obtained by
one substitution table. Learning the table is faster than relearning mechanics.

| Linear | Rotational | Link |
|---|---|---|
| position $x$ | angle $\theta$ | $x = r\theta$ |
| velocity $v$ | angular velocity $\omega$ | $v = r\omega$ |
| acceleration $a$ | angular acceleration $\alpha$ | $a = r\alpha$ |
| mass $m$ | moment of inertia $I$ | $I = \sum mr^2$ |
| force $F$ | torque $\tau$ | $\tau = rF\sin\theta$ |
| momentum $p = mv$ | angular momentum $L = I\omega$ | |
| $F = ma$ | $\tau = I\alpha$ | |
| $K = \tfrac12 mv^2$ | $K = \tfrac12 I\omega^2$ | |

The kinematic relationships carry over unchanged, because they are the same
calculus:

$$\omega = \frac{d\theta}{dt} \qquad \alpha = \frac{d\omega}{dt} = \frac{d^2\theta}{dt^2}$$

```math verify
d/dt (3*t**2 - 2*t) = 6*t - 2
d/dt (6*t - 2) = 6
int (6*t) dt = 3*t**2
```

Given $\theta(t) = 3t^2 - 2t$, the angular velocity is $6t - 2$ and the angular
acceleration is a constant $6$ — exactly the procedure from chapter 1, with
different letters.

## Moment of inertia is not mass

$I = \sum m_i r_i^2$, or for a continuous body

$$I = \int r^2\,dm$$

The crucial difference from mass: **$I$ depends on where the axis is.** The same
object has different moments of inertia about different axes, so "the moment of
inertia of a rod" is not a well-formed phrase without saying about what.

```math verify
# assume: M > 0, L > 0
int x**2 dx = x**3/3
M/L*(L**3/3) = M*L**2/3
```

That second line is the derivation for a rod about its end: linear density
$\tfrac{M}{L}$, integrate $x^2$ from $0$ to $L$, and get $\tfrac{ML^2}{3}$.

About its **centre** instead, the integral runs from $-\tfrac{L}{2}$ to
$\tfrac{L}{2}$ and gives $\tfrac{ML^2}{12}$ — four times smaller, because mass
near the axis contributes barely anything. The $r^2$ weighting is why.

:::note
**The parallel axis theorem** connects them: $I = I_{\text{cm}} + Md^2$ for an
axis a distance $d$ from the centre of mass.

Check it here: $\tfrac{ML^2}{12} + M\left(\tfrac{L}{2}\right)^2
= \tfrac{ML^2}{12} + \tfrac{ML^2}{4} = \tfrac{ML^2}{3}$. The two results agree,
which is a free check on any moment of inertia you derive.
:::

```math verify
# assume: M > 0, L > 0
M*L**2/12 + M*(L/2)**2 = M*L**2/3
```

## Torque

$$\tau = rF\sin\theta$$

Only the component of force **perpendicular to the radius** produces torque.
Pushing a door towards its hinge does nothing, however hard — $\sin 0 = 0$ — and
pushing at the far edge perpendicular to the door is maximally effective.

That is why door handles are opposite the hinge, and it is the whole content of
the $r$ and $\sin\theta$ factors.

The rotational second law follows:

$$\sum \tau = I\alpha$$

Same structure as $\sum F = ma$, same method: identify the torques, sum them
with sign (conventionally anticlockwise positive), divide by $I$.

## Rolling combines both

An object rolling without slipping has **both** kinds of kinetic energy:

$$K = \tfrac12 Mv^2 + \tfrac12 I\omega^2$$

with $v = R\omega$ tying them together. That constraint is what "without
slipping" means mathematically.

The consequence is a famous result: **released from the same height, objects
race down an incline in order of their moment of inertia, regardless of mass or
radius.** A solid sphere ($I = \tfrac25 MR^2$) beats a solid cylinder
($\tfrac12 MR^2$), which beats a hoop ($MR^2$).

The reason is energy bookkeeping. The same $Mgh$ is available to every object,
and whatever goes into rotation is unavailable for translation. A hoop puts all
its mass at maximum $r$, so it diverts the most into spin and arrives last.

:::pitfall
Mass and radius **cancel** in that race. Students expect the heavy one or the
big one to win, and neither does — only the *distribution* of mass matters,
through the dimensionless coefficient in $I = cMR^2$.
:::

## What comes next

Angular momentum, rotational kinetic energy and their conservation laws are
unit 6's subject — chapter 6.1 takes them up, and this chapter's $I$ is exactly
what they are built on.

The division follows the course itself: unit 5 is **torque and rotational
dynamics**, which is $\tau = I\alpha$ and the moments of inertia it needs. Unit
6 is **energy and momentum of rotating systems**, which is units 3 and 4 with
the rotational substitutions.

:::quiz
{
  "question": "A uniform rod is pivoted at one end rather than at its centre. The same torque is applied. How does its angular acceleration compare?",
  "options": [
    {
      "text": "Four times smaller, because I is four times larger about the end",
      "correct": true,
      "why": "I is ML²/12 about the centre and ML²/3 about the end — a factor of four, which the parallel axis theorem gives as ML²/12 + M(L/2)². With τ = Iα and τ fixed, α is inversely proportional to I."
    },
    {
      "text": "Unchanged, since the torque and the rod's mass are the same",
      "correct": false,
      "why": "τ = Iα has three quantities in it, and moving the axis changes I. Mass alone does not determine the resistance to angular acceleration — its distribution about the chosen axis does."
    },
    {
      "text": "Four times larger, because the end is further from the centre of mass",
      "correct": false,
      "why": "Distance from the axis raises I, and a larger I means a smaller α for the same torque. The direction is inverted here: harder to spin up, not easier."
    },
    {
      "text": "Twice as small, since the end is L/2 from the centre",
      "correct": false,
      "why": "The shift distance is L/2, but the parallel axis theorem adds Md², and d is squared. That squaring is what turns a factor of two in distance into a factor of four in the result."
    }
  ]
}
:::

:::recap
- Every linear quantity has a rotational twin; the substitution table is the
  unit.
- $\omega = \tfrac{d\theta}{dt}$, $\alpha = \tfrac{d\omega}{dt}$ — the same
  calculus as chapter 1.
- $I = \int r^2 dm$ depends on the **axis**, so a moment of inertia is
  meaningless without one. The parallel axis theorem relates them and checks
  your work.
- Only the perpendicular force component makes torque: $\tau = rF\sin\theta$.
- Rolling without slipping ties $v$ to $\omega$ by $v = R\omega$; that
  constraint is what makes the two motions one problem.
- Angular momentum and rotational energy are unit 6, built on the $I$ defined
  here.
:::
