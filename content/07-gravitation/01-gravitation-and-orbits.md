---
title: "Gravitation and orbits"
navTitle: "Gravitation"
summary: >-
  The same inverse-square law as electrostatics, with one sign and no
  shielding — and the orbital results that follow from it.
objectives:
  - Apply Newton's law of gravitation and relate it to mg
  - Derive orbital speed and period from circular motion
  - Use gravitational potential energy with the correct zero point
  - Compute escape velocity from energy conservation
scope: mech
status: complete
standard: none
---

$$F = G\frac{m_1 m_2}{r^2}$$

The same $\tfrac{1}{r^2}$ shape as Coulomb's law in chapter 8.1, and for the
same geometric reason — influence spread over a sphere thins as the sphere
grows. Two differences matter:

- **Gravity has one sign.** Mass is always positive and the force is always
  attractive. There is no gravitational repulsion and therefore no shielding —
  you cannot build a gravitational Faraday cage.
- **It is vastly weaker**, by around $10^{36}$. It dominates at astronomical
  scale only because charge cancels and mass does not.

## Where $mg$ comes from

Near the surface of a planet, $r$ barely changes, so the whole $\tfrac{GM}{r^2}$
factor is effectively constant:

$$g = \frac{GM}{R^2}$$

```math verify
# assume: G > 0, M > 0, R > 0
G*M/R**2 = G*M/R**2
d/dr (-G*M/r) = G*M/r**2
```

The second line is the important one and it reappears below: the derivative of
$-\tfrac{GM}{r}$ is $+\tfrac{GM}{r^2}$, which is why gravitational potential
energy has that form.

$mg$ is therefore not a separate law — it is $\tfrac{GMm}{r^2}$ with the
constants collected, valid only while the height change is small compared with
the planet's radius. At orbital altitude it is not.

:::pitfall
Astronauts in orbit are **not** beyond gravity. At the ISS's altitude $g$ is
still about $89\%$ of its surface value.

They are weightless because they are in free fall — falling around the planet
rather than into it. "Zero gravity" is a misnomer for "zero normal force", and
the distinction is a standard exam question.
:::

## Orbits

For a circular orbit, gravity supplies exactly the centripetal requirement:

$$\frac{GMm}{r^2} = \frac{mv^2}{r} \qquad\Longrightarrow\qquad v = \sqrt{\frac{GM}{r}}$$

```math verify
# assume: G > 0, M > 0, r > 0, m > 0
G*M*m/r**2 * r/m = G*M/r
```

The satellite's own mass cancels — **every object at a given radius orbits at
the same speed**, which is why a space station and a bolt floating beside it stay
together.

Note the counterintuitive consequence: a *higher* orbit is a *slower* one, since
$v \propto \tfrac{1}{\sqrt r}$. To catch something ahead of you in the same
orbit, you must slow down and drop to a lower, faster one.

The period follows from circumference over speed:

$$T = \frac{2\pi r}{v} = 2\pi\sqrt{\frac{r^3}{GM}}$$

```math verify
# assume: G > 0, M > 0, r > 0
(2*pi*r)/sqrt(G*M/r) = 2*pi*sqrt(r**3/(G*M))
```

That verified line is **Kepler's third law** — $T^2 \propto r^3$ — derived from
Newton's law in one step. Kepler found it by fitting data for decades; it falls
out of the inverse square in a line, which is the single best advertisement for
the theory.

## Potential energy, and the zero point

$$U = -\frac{GMm}{r}$$

The minus sign is not decoration and the chapter's most-asked question is what
it means.

**The zero is at infinity.** That is a choice, and it is the only convenient one
for an inverse-square force: putting $U = 0$ at the surface would make it depend
on which planet you are standing on. With zero at infinity, bound systems have
negative total energy and free ones have positive — which turns out to be the
useful classification.

```math verify
# assume: G > 0, M > 0, m > 0
d/dr (-G*M*m/r) = G*M*m/r**2
```

And that is the check from chapter 3.1 again: $F = -\tfrac{dU}{dr}$, so the
derivative of $-\tfrac{GMm}{r}$ must be the force magnitude, and it is.

$U = mgh$ is the near-surface approximation of this, with the zero moved to the
ground — which is fine as long as $h \ll R$.

## Escape velocity

Escaping means reaching infinity with at least zero speed left. Total energy
must therefore be $\ge 0$:

$$\tfrac12 mv^2 - \frac{GMm}{r} \ge 0 \qquad\Longrightarrow\qquad v_{\text{esc}} = \sqrt{\frac{2GM}{R}}$$

```math verify
# assume: G > 0, M > 0, R > 0
sqrt(2*G*M/R)/sqrt(G*M/R) = sqrt(2)
```

That verified ratio is a result worth carrying: **escape velocity is $\sqrt2$
times orbital speed** at the same radius. About $40\%$ more speed, not twice as
much, which is a smaller margin than most people guess.

Escape velocity is also independent of the escaping object's mass and of the
direction it is launched — energy conservation cares about neither.

:::quiz
{
  "question": "A satellite moves to a higher circular orbit. What happens to its speed?",
  "options": [
    {
      "text": "It decreases, since v = √(GM/r) falls as r grows",
      "correct": true,
      "why": "Higher orbits are slower. It is why catching something ahead of you in the same orbit requires dropping lower — a lower orbit is a faster one."
    },
    {
      "text": "It increases, because it has more gravitational potential energy",
      "correct": false,
      "why": "It does gain potential energy, and loses kinetic energy — the total energy rises while the speed falls. Those are separate quantities moving separately."
    },
    {
      "text": "It stays the same, since the satellite's mass has not changed",
      "correct": false,
      "why": "The satellite's mass cancels, which is why every object at a given radius orbits at the same speed. But the speed depends on r, which changed."
    },
    {
      "text": "It depends on how the satellite got there",
      "correct": false,
      "why": "Circular orbital speed is fixed by the radius alone. The route taken affects the fuel spent, not the final speed."
    }
  ]
}
:::

:::recap
- $F = \tfrac{Gm_1m_2}{r^2}$: inverse square like Coulomb, but one sign, no
  shielding, and about $10^{36}$ times weaker.
- $g = \tfrac{GM}{R^2}$, so $mg$ is the near-surface special case rather than a
  separate law.
- Orbiting objects are in free fall, not beyond gravity — $g$ at the ISS is
  about $89\%$ of its surface value.
- $v = \sqrt{GM/r}$: mass cancels, and higher orbits are slower.
- $T = 2\pi\sqrt{r^3/GM}$ is Kepler's third law, derived in one step from the
  inverse square.
- $U = -\tfrac{GMm}{r}$ with zero at infinity, so bound systems have negative
  total energy.
- $v_{\text{esc}} = \sqrt2 \times v_{\text{orbit}}$ at the same radius.
:::
