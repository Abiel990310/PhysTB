---
title: "Magnetic fields and forces"
navTitle: "Magnetism"
summary: >-
  A force that depends on velocity, acts sideways, and never does work. Every
  strange property follows from the cross product.
objectives:
  - Apply the magnetic force law and determine its direction
  - Explain why a magnetic force does no work
  - Analyse circular motion in a uniform magnetic field
  - Use Ampère's law on a symmetric current distribution
scope: em
status: complete
standard: none
---

The electric force is simple: $\vec F = q\vec E$, along the field. The magnetic
force is not like that at all:

$$\vec F = q\vec v \times \vec B$$

Three consequences, all strange, all following from the cross product:

1. **A stationary charge feels nothing.** No $v$, no force.
2. **The force is perpendicular to the velocity**, so it changes direction
   without changing speed.
3. **A charge moving parallel to $\vec B$ feels nothing either** — the cross
   product of parallel vectors is zero.

Magnitude: $F = qvB\sin\theta$, with $\theta$ between $\vec v$ and $\vec B$.

## Direction: the right hand

Point your fingers along $\vec v$, curl them towards $\vec B$; your thumb gives
$\vec v \times \vec B$. For a **positive** charge that is the force direction;
for a negative charge it is the opposite.

That last clause is the source of most sign errors in this unit. Electrons go
the other way, always, and it is worth writing the charge's sign down before
touching the geometry.

## No work, ever

Because $\vec F \perp \vec v$ at every instant, the dot product $\vec F\cdot d\vec l$
is zero, and so

$$W_{\text{magnetic}} = 0$$

**A magnetic field can never change a particle's speed** — only its direction.
This is the same argument as the satellite in chapter 3.1, and the conclusion is
just as absolute.

:::note
This is worth holding onto when magnets appear to do work — lifting a paperclip,
driving a motor. In every such case the energy comes from somewhere else: the
field rearranges what is already moving, or an electric field induced by a
*changing* magnetic field does the work. The static magnetic force itself never
contributes.
:::

## Circular motion

A charge moving perpendicular to a uniform field feels a constant-magnitude
force always at right angles to its motion — which is precisely the condition
for a circle. Setting the magnetic force equal to the centripetal requirement:

$$qvB = \frac{mv^2}{r} \qquad\Longrightarrow\qquad r = \frac{mv}{qB}$$

```math verify
# assume: m > 0, q > 0, B > 0, v > 0
m*v**2/r*r/(q*B*v) = m*v/(q*B)
```

Faster particles travel wider circles; stronger fields tighten them. That
relationship is how mass spectrometers separate isotopes — same charge, same
field, different mass, different radius.

The **period** is more surprising:

$$T = \frac{2\pi m}{qB}$$

```math verify
# assume: m > 0, q > 0, B > 0, v > 0
2*pi*(m*v/(q*B))/v = 2*pi*m/(q*B)
```

That verified line is the derivation — circumference over speed — and the $v$
cancels. **The period does not depend on speed.** A fast particle traces a
proportionally larger circle at proportionally greater speed and takes exactly
as long, which is the principle the cyclotron is built on.

It is the same shape of result as the amplitude-independent period in chapter
6.1, and for a similar reason: two effects scaling together and cancelling.

## Fields from currents

Moving charges feel magnetic forces; they also **create** magnetic fields.

For a long straight wire:

$$B = \frac{\mu_0 I}{2\pi r}$$

falling off as $\tfrac1r$ — more slowly than a point charge's $\tfrac{1}{r^2}$,
because a wire is infinitely long rather than a point. The field circles the
wire; point your right thumb along the current and your fingers curl the way
$\vec B$ goes.

```math verify
# assume: I > 0, r > 0
d/dr (log(r)) = 1/r
```

That derivative is not decoration: integrating $\tfrac{1}{r}$ gives a logarithm,
which is why the potential energy of a wire's field behaves logarithmically and
why "the field at infinity is zero" needs more care here than for a point
charge.

## Ampère's law

The magnetic counterpart of Gauss's law:

$$\oint \vec B\cdot d\vec l = \mu_0 I_{\text{enclosed}}$$

Like Gauss's law, it is always true and only *useful* when symmetry lets you
pull $B$ out of the integral. Three cases where it does:

- **A long straight wire** — circular loop, gives $B = \tfrac{\mu_0 I}{2\pi r}$.
- **A solenoid** — rectangular loop, gives $B = \mu_0 n I$ inside, uniform.
- **A toroid** — circular loop inside the coils.

For the wire: take a circle of radius $r$ centred on it. By symmetry $B$ is
constant on that circle and parallel to it, so the integral is just $B(2\pi r)$,
and equating to $\mu_0 I$ gives the result in one line.

:::pitfall
Ampère's law counts only the current **enclosed by your loop**. A nearby wire
carrying a thousand amps outside the loop contributes nothing to the integral —
though it certainly contributes to $\vec B$ at each point.

The integral around the loop and the field at a point are different questions,
and conflating them is the standard error.
:::

:::quiz
{
  "question": "A proton enters a uniform magnetic field perpendicular to it and moves in a circle. Its speed is then doubled. What happens to the time for one orbit?",
  "options": [
    {
      "text": "Nothing — the period is independent of speed",
      "correct": true,
      "why": "T = 2πm/qB contains no v. The radius doubles, so the circumference doubles, and the particle covers it at double the speed. The two cancel exactly — which is what makes the cyclotron work."
    },
    {
      "text": "It halves, since the proton is moving twice as fast",
      "correct": false,
      "why": "It would, if the circle stayed the same size. But r = mv/qB doubles with the speed, so there is twice as far to go."
    },
    {
      "text": "It doubles, since the circle is twice as large",
      "correct": false,
      "why": "The circle is indeed twice as large, and the proton also travels twice as fast around it. Same time."
    },
    {
      "text": "It depends on the field strength as well as the speed",
      "correct": false,
      "why": "The period does depend on B — stronger fields give shorter periods — but that is not what changed here. Doubling v alone leaves T untouched."
    }
  ]
}
:::

:::recap
- $\vec F = q\vec v\times\vec B$: no force on a stationary charge, none on one
  moving along the field, and the force is always perpendicular to the motion.
- A magnetic force therefore does **no work** and can never change a particle's
  speed.
- Perpendicular entry gives a circle of radius $\tfrac{mv}{qB}$, with period
  $\tfrac{2\pi m}{qB}$ — independent of speed.
- A long wire's field is $\tfrac{\mu_0 I}{2\pi r}$, falling as $\tfrac1r$ rather
  than $\tfrac1{r^2}$.
- Ampère's law is always true and useful only under symmetry, and it counts
  only the current your loop encloses.
:::
