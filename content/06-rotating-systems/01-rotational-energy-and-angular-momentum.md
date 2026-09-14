---
title: "Rotational energy and angular momentum"
navTitle: "Rotating systems"
summary: >-
  Units 3 and 4 again, with every linear quantity replaced by its rotational
  counterpart. The translation is exact, which means there is almost nothing new
  to learn and one thing that is genuinely new.
objectives:
  - Compute rotational kinetic energy, and combine it with translational
  - Solve rolling problems by energy rather than by force
  - Define angular momentum for a particle and for a rigid body
  - Apply conservation of angular momentum, and say when it holds
  - Explain why a spinning skater speeds up without any torque
scope: mech
status: complete
standard: none
---

Unit 5 built the rotational second law, $\tau = I\alpha$. This unit does for
rotation what units 3 and 4 did for translation: energy and momentum. Almost
every result is the linear one with symbols swapped, and setting the two side by
side is the fastest way to learn both.

| Linear | Rotational |
|---|---|
| mass $m$ | moment of inertia $I$ |
| velocity $v$ | angular velocity $\omega$ |
| momentum $p = mv$ | angular momentum $L = I\omega$ |
| kinetic energy $\tfrac12 mv^2$ | $\tfrac12 I\omega^2$ |
| force $F = \tfrac{dp}{dt}$ | torque $\tau = \tfrac{dL}{dt}$ |
| work $\int F\,dx$ | $\int \tau\,d\theta$ |

The correspondence is not a mnemonic. Every rotational line is derived from its
linear partner by summing over the particles of the body, and the derivations
are why $I$ appears where $m$ does.

## Rotational kinetic energy

A particle at distance $r$ from the axis moves at $v = \omega r$, so its kinetic
energy is $\tfrac12 m\omega^2r^2$. Summing over the body and pulling out the
common $\omega$:

$$K_{\text{rot}} = \tfrac12\left(\textstyle\sum m_i r_i^2\right)\omega^2 = \tfrac12 I\omega^2$$

That sum *is* the moment of inertia — the same $I$ from $\tau = I\alpha$, arrived
at from energy instead of from torque. It appearing in both places is the reason
it is worth defining at all.

```math verify
int I*w dw = I*w**2/2
d/dw (I*w**2/2) = I*w
```

The integral is work done by a torque as the body speeds up, and it produces the
half for the same reason it did for $\tfrac12 mv^2$ and $\tfrac12 kx^2$: you are
integrating something that grows linearly.

## Rolling: both at once

A rolling object has kinetic energy of both kinds, and **rolling without
slipping** ties them together by $v = \omega R$:

$$K = \tfrac12 mv^2 + \tfrac12 I\omega^2 = \tfrac12 mv^2\left(1 + \frac{I}{mR^2}\right)$$

```math verify
m*v**2/2 + (c*m*R**2)*(v/R)**2/2 = m*v**2*(1 + c)/2
```

The checked line is the general case with $I = cmR^2$, where $c$ is a pure
number set by the shape: $\tfrac12$ for a solid cylinder, $\tfrac25$ for a solid
sphere, $1$ for a hoop. So a rolling body's energy is $\tfrac12 mv^2(1+c)$, and
the fraction going into rotation is $c/(1+c)$ — independent of mass, radius and
speed.

Race them down a ramp from rest. Energy conservation gives

$$mgh = \tfrac12 mv^2(1+c) \qquad\Longrightarrow\qquad v = \sqrt{\frac{2gh}{1+c}}$$

```math verify
m*(2*g*h/(1 + c))/2*(1 + c) = m*g*h
```

That line is the check that matters: substituting
$v^2 = \tfrac{2gh}{1+c}$ back into $\tfrac12 mv^2(1+c)$ returns $mgh$ exactly,
which is the energy balance the formula was derived from. Every $m$ and $R$ has
cancelled. **The winner depends only on the shape.**
The sphere ($c = 0.4$) beats the cylinder ($0.5$) beats the hoop ($1$), and a
large heavy hoop ties with a small light one. The hoop loses because all its
mass is at the rim, so the largest share of the energy goes into spinning rather
than into moving.

:::pitfall
A rolling object does **not** reach $\sqrt{2gh}$. That is the frictionless
sliding answer, and it is the $c = 0$ limit — an object with no moment of
inertia at all.

Applying $v = \sqrt{2gh}$ to anything that rolls is the single most common error
in this unit, and it is always an overestimate, because some of the energy went
into rotation.
:::

## Angular momentum

For a particle, angular momentum about a chosen origin is

$$\vec L = \vec r \times \vec p$$

and for a rigid body rotating about a fixed axis it collapses to the form worth
memorising:

$$L = I\omega$$

Newton's second law has an exact rotational twin:

$$\vec\tau_{\text{net}} = \frac{d\vec L}{dt}$$

so **when the net external torque is zero, $\vec L$ is constant.** That is the
conservation law, and like linear momentum it holds even through collisions and
explosions, where energy does not.

```math verify
d/dt (I*w*t) = I*w
```

:::note
Angular momentum is defined **about a point**, and the answer depends on which
point you choose. A particle moving in a straight line has nonzero angular
momentum about any origin not on that line — $L = mvd$, with $d$ the
perpendicular distance — and it is constant, because nothing is accelerating.

Choosing the origin well is most of the skill. Pick the point about which the
unknown forces exert no torque, and they disappear from the equation.
:::

## The skater

A skater pulls their arms in and spins faster. No torque acts, so $L = I\omega$
is fixed; halving $I$ doubles $\omega$. That much is standard. The part worth
noticing is the energy:

$$K = \tfrac12 I\omega^2 = \frac{L^2}{2I}$$

```math verify
I*w**2/2 = (I*w)**2/(2*I)
```

With $L$ fixed and $I$ halved, the kinetic energy **doubles**. Energy is not
conserved here, and it should not be: the skater's muscles did work pulling
their arms inward against the outward push of the rotation. The energy came from
them.

Anyone who expects both $L$ and $K$ to be conserved will find the numbers
contradict each other. Only one of them is protected by a conservation law, and
which one depends on whether something is doing work.

:::quiz
{
  "question": "A solid sphere and a hoop of the same mass and radius roll from rest down the same ramp. Which reaches the bottom first, and why?",
  "options": [
    {
      "text": "The sphere, because a smaller fraction of its energy goes into rotation",
      "correct": true,
      "why": "v = sqrt(2gh/(1+c)), with c = 0.4 for the sphere and 1 for the hoop. The sphere's mass sits closer to the axis, so less of the gravitational energy is taken up spinning it and more is left as translation. Mass and radius cancel entirely."
    },
    {
      "text": "They tie, because they have the same mass and fall the same height",
      "correct": false,
      "why": "That reasoning works for sliding without friction, where all the energy becomes translational. Rolling splits the energy, and the split is set by the shape — which is exactly what differs here."
    },
    {
      "text": "The hoop, because its larger moment of inertia gives it more angular momentum",
      "correct": false,
      "why": "More angular momentum is not an advantage in a race down a ramp — the finish depends on translational speed. The hoop's large I means more of the same energy budget is spent on rotation, leaving it moving more slowly."
    },
    {
      "text": "The sphere, because it is heavier at the centre so gravity pulls it harder",
      "correct": false,
      "why": "They have the same mass, so gravity pulls them equally, and in any case mass cancels out of the answer. The distribution of that mass is what matters, through I — not its amount."
    }
  ]
}
:::

:::recap
- Every rotational quantity is its linear partner with $m \to I$ and
  $v \to \omega$, and each is derived by summing over the body rather than
  asserted.
- $K_{\text{rot}} = \tfrac12 I\omega^2$, and the same $I$ appears here as in
  $\tau = I\alpha$.
- Rolling without slipping gives $K = \tfrac12 mv^2(1+c)$ for $I = cmR^2$, so
  down a ramp $v = \sqrt{2gh/(1+c)}$ — shape decides the race, and mass and
  radius cancel.
- A rolling object never reaches $\sqrt{2gh}$; that is the sliding answer.
- $\vec\tau = \tfrac{d\vec L}{dt}$, so zero net external torque conserves
  $\vec L$ — through collisions, where energy is not conserved.
- $L$ is defined about a point; choose the point that kills the unknown torques.
- With $L$ fixed, $K = L^2/2I$ rises as $I$ falls. The skater's muscles supplied
  the difference.
:::
