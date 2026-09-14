---
title: "Momentum and impulse"
navTitle: "Momentum"
summary: >-
  Integrate the second law over time instead of distance and momentum falls
  out — the companion result to the work–energy theorem.
objectives:
  - Relate impulse to change in momentum by integration
  - Apply conservation of momentum to collisions
  - Distinguish elastic from inelastic collisions by what is conserved
  - Locate and use the centre of mass
scope: mech
status: complete
standard: none
---

Chapter 3 integrated $\sum F = ma$ over **distance** and got energy. Integrate
the same equation over **time** and you get momentum. The two results are
siblings, and knowing which to reach for is most of the skill in mechanics.

$$\vec p = m\vec v \qquad\qquad \sum\vec F = \frac{d\vec p}{dt}$$

The second form is how Newton actually stated the law, and it is more general
than $\vec F = m\vec a$: it still holds when the mass changes, which $ma$ does
not.

## Impulse is an integral

Integrating the second law over an interval:

$$\vec J = \int_{t_1}^{t_2}\vec F\,dt = \Delta\vec p$$

```math verify
int F dt = F*t
d/dt (m*v) = 0
```

The second line says something physical: with $m$ and $v$ both constant,
momentum does not change — which is Newton's first law, arriving as a special
case rather than a separate assumption.

For a constant force impulse is $F\Delta t$, and for a varying one it is the
**area under the force–time graph** — the same relationship between an integral
and an area as in chapter 3.

:::note
This is why airbags, crumple zones and bending your knees on landing work.
Stopping means a fixed $\Delta p$, so $F\Delta t$ is fixed. Stretching the
collision over more time reduces the force proportionally. The impulse is not
negotiable; how long you take to absorb it is.
:::

## Conservation

When no external force acts on a system, $\tfrac{d\vec p}{dt} = 0$, so total
momentum is constant:

$$\sum \vec p_{\text{before}} = \sum \vec p_{\text{after}}$$

Two cautions that decide most problems:

**It is a vector statement.** Momentum is conserved componentwise. A
two-dimensional collision gives two independent equations, and treating it as
one scalar equation loses half the information.

**"No external force" means on the system you chose.** Internal forces cancel in
pairs by the third law, which is why they can be ignored — but choosing the
system badly puts a large force outside it. During a brief collision, external
forces like gravity contribute negligible impulse because $\Delta t$ is tiny,
which is why momentum is treated as conserved through a collision even though
gravity has not switched off.

## Elastic and inelastic

| | momentum | kinetic energy |
|---|---|---|
| **elastic** | conserved | conserved |
| **inelastic** | conserved | **not** conserved |
| **perfectly inelastic** | conserved | not conserved; bodies stick |

Momentum is conserved in **every** collision. Kinetic energy is not, and the
lost energy goes into deformation, heat and sound.

For a perfectly inelastic collision the algebra is short, because there is one
final velocity:

$$m_1v_1 + m_2v_2 = (m_1+m_2)v_f$$

```math verify
# assume: m > 0
(m*v + m*0)/(2*m) = v/2
```

That verified line is the classic case: equal masses, one at rest, sticking
together. The result is half the original speed — and therefore a quarter of the
original kinetic energy, since $K$ goes as $v^2$. **Half the kinetic energy is
gone**, which is not a small correction and is where the deformation energy
went.

:::pitfall
The most common error is assuming kinetic energy is conserved because nothing
was said about it. Unless a problem says *elastic* — or the objects visibly
bounce apart without deformation — assume it is not.

Conversely, never assume momentum is *not* conserved. It always is, given a
sensible choice of system.
:::

## Centre of mass

For a system of particles,

$$\vec r_{\text{cm}} = \frac{\sum m_i \vec r_i}{\sum m_i}$$

and for a continuous body the sum becomes an integral:

$$\vec r_{\text{cm}} = \frac{1}{M}\int \vec r\,dm$$

```math verify
int x dx = x**2/2
(1*0 + 3*4)/(1 + 3) = 3
```

The second line is a two-particle centre of mass: masses $1$ and $3$ at
positions $0$ and $4$ sit with their centre at $3$, which is closer to the
heavier one, as it must be.

The reason the centre of mass matters: **it moves as though all the mass were
concentrated there and all external forces applied there.** An exploding
firework's fragments follow complicated paths, and their centre of mass
continues along the original parabola as though nothing happened — because the
explosion's forces are internal and cancel.

:::quiz
{
  "question": "A 2 kg cart at 3 m/s strikes a stationary 4 kg cart and they stick together. What fraction of the kinetic energy survives?",
  "options": [
    {
      "text": "One third",
      "correct": true,
      "why": "Momentum gives 6 = 6·v_f, so v_f = 1 m/s. Before: ½·2·9 = 9 J. After: ½·6·1 = 3 J. Three of nine survive — the other two thirds went into deformation and heat."
    },
    {
      "text": "All of it, since momentum is conserved",
      "correct": false,
      "why": "Momentum is conserved in every collision; kinetic energy is a separate question. In a perfectly inelastic collision energy is always lost — sticking together is what losing it looks like."
    },
    {
      "text": "One half",
      "correct": false,
      "why": "One half is the answer for equal masses with one at rest. Here the masses differ, and the fraction surviving depends on the ratio — working it through gives one third."
    },
    {
      "text": "None of it, since the carts end up moving together",
      "correct": false,
      "why": "They end up moving, so kinetic energy is not zero. All of it would be lost only if the combined body came to rest, which needs equal and opposite momenta."
    }
  ]
}
:::

:::recap
- $\vec p = m\vec v$ and $\sum\vec F = \tfrac{d\vec p}{dt}$, which is the more
  general statement of the second law.
- Impulse $\vec J = \int\vec F\,dt = \Delta\vec p$: the area under a
  force–time graph.
- Momentum is conserved in every collision, componentwise. Kinetic energy is
  conserved only in elastic ones.
- Equal masses, one at rest, sticking: final speed is halved and half the
  kinetic energy is gone.
- The centre of mass moves as if all mass and all external force acted there —
  which is why an explosion does not deflect it.
:::
