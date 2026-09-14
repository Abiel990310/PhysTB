---
title: "Faraday's law and induction"
navTitle: "Induction"
summary: >-
  A changing magnetic field makes an electric field. It is the last big idea in
  the course and the one that makes electricity generation possible.
objectives:
  - Compute magnetic flux and apply Faraday's law
  - Use Lenz's law to determine the direction of an induced current
  - Analyse a rod moving on rails
  - Explain why inductors resist changes in current
scope: em
status: complete
standard: none
---

Chapter 11 said a magnetic force does no work and can never change a particle's
speed. That is true of a *static* field. A **changing** one is a different
matter entirely, and the difference is this chapter.

## Flux

Flux measures how much field passes through a surface:

$$\Phi_B = \int \vec B\cdot d\vec A = BA\cos\theta$$

for a uniform field through a flat area, with $\theta$ between $\vec B$ and the
**normal** to the surface — not the surface itself. A loop face-on to the field
has maximum flux; edge-on it has zero.

Three ways to change it, and an exam question is always one of them:

1. **Change $B$** — move a magnet, or vary a current nearby.
2. **Change $A$** — stretch, squash, or slide part of the circuit.
3. **Change $\theta$** — rotate the loop, which is how a generator works.

## Faraday's law

$$\varepsilon = -\frac{d\Phi_B}{dt}$$

An EMF appears whenever flux changes, proportional to **how fast** it changes
rather than how large it is. A strong steady field induces nothing at all; a
weak one changing quickly induces plenty.

```math verify
d/dt (3*t) = 3
d/dt (cos(2*t)) = -2*sin(2*t)
```

The first is a flux growing steadily, giving a constant EMF. The second is a
rotating loop — $\Phi = BA\cos\omega t$ — giving $\varepsilon \propto \sin\omega t$,
which is alternating current arriving as a consequence rather than a design
choice.

That is worth pausing on: **AC is what you get when you rotate a loop in a
field.** The sinusoid in your wall socket is a cosine that has been
differentiated.

## Lenz's law and the minus sign

The minus sign is a physical statement: **the induced current opposes the change
that produced it.**

Push a magnet's north pole towards a loop and the loop's induced current makes
its own north pole facing the magnet, pushing back. Pull it away and the current
reverses to attract it.

:::note
Lenz's law is conservation of energy in disguise. If the induced current
*helped* the change, the magnet would accelerate on its own, inducing more
current, accelerating further — free energy.

Opposing the change is the only option consistent with energy conservation, and
that is why the sign is not adjustable.
:::

Working out a direction, reliably:

1. Which way does $\vec B$ point through the loop?
2. Is the flux increasing or decreasing?
3. The induced current opposes that — it maintains the flux that is vanishing,
   or fights the flux that is growing.
4. Right-hand rule: curl fingers with the current, thumb gives the loop's field.

## A rod on rails

The standard problem. A conducting rod of length $L$ slides at speed $v$ along
rails in a field $B$ perpendicular to the loop.

The enclosed area grows at $Lv$, so

$$\varepsilon = BLv$$

and the current is $\tfrac{BLv}{R}$.

The force on that current-carrying rod, by chapter 11, is $F = BIL$, and Lenz
says it **opposes the motion**:

$$F = \frac{B^2L^2v}{R}$$

```math verify
# assume: B > 0, L > 0, R > 0
B*L*v*B*L/R = B**2*L**2*v/R
```

A drag force proportional to velocity — the same form as the falling body in
chapter 2.1, which means the same exponential approach to a terminal speed if
the rod is pulled by a constant force. Two entirely different physical setups
producing the same differential equation is worth noticing.

The energy check closes it: the work you do pulling the rod equals the power
dissipated in the resistance, $I^2R$. Nothing is created; you are turning
mechanical work into heat through a magnetic intermediary.

## Inductance

A coil's own changing current changes its own flux, inducing an EMF that opposes
the change:

$$\varepsilon = -L\frac{dI}{dt}$$

An inductor resists **changes** in current the way a capacitor resists changes
in voltage — the pairing is exact, and the two components are duals throughout.

```math verify
# assume: R > 0, L > 0
d/dt (1 - exp(-R*t/L)) = R*exp(-R*t/L)/L
lim t->oo (1 - exp(-R*t/L)) = 1
```

An RL circuit gives the same exponential as the RC circuit in chapter 10.1, with
time constant $\tau = \tfrac{L}{R}$ instead of $RC$. The two shortcuts invert:

| at $t = 0$ | at $t \to \infty$ |
|---|---|
| an inductor **blocks** current change — acts like a break | acts like a **wire** |
| a capacitor acts like a **wire** | acts like a **break** |

Exactly opposite, which is the cleanest way to remember either.

Energy stored: $U = \tfrac12 LI^2$, in the magnetic field, mirroring
$\tfrac12 CV^2$ in the electric one.

```math verify
# assume: L > 0
d/dI (L*I**2/2) = I*L
```

:::quiz
{
  "question": "A bar magnet's north pole is pushed toward a conducting loop. Which way does the induced current flow, viewed from the magnet?",
  "options": [
    {
      "text": "Anticlockwise, making a north pole facing the magnet to oppose its approach",
      "correct": true,
      "why": "Lenz's law: the flux toward the loop is increasing, so the induced current opposes it by producing a north pole facing the incoming north pole. By the right-hand rule that current runs anticlockwise as seen from the magnet."
    },
    {
      "text": "Clockwise, making a south pole to attract the magnet",
      "correct": false,
      "why": "That would pull the magnet in faster, inducing more current, pulling harder — free energy. Lenz's law exists precisely to forbid it."
    },
    {
      "text": "No current flows, since the magnet is not touching the loop",
      "correct": false,
      "why": "Induction needs no contact — only changing flux. That is what makes transformers and wireless charging possible."
    },
    {
      "text": "It alternates, since the magnetic field is changing",
      "correct": false,
      "why": "The flux changes steadily in one direction while the magnet approaches, so the current has one direction. It reverses only when the motion reverses."
    }
  ]
}
:::

:::recap
- $\Phi_B = BA\cos\theta$, with $\theta$ measured from the **normal**. Change
  $B$, $A$ or $\theta$ and flux changes.
- $\varepsilon = -\tfrac{d\Phi_B}{dt}$: the rate of change matters, not the
  size. A steady field induces nothing.
- Rotating a loop gives $\varepsilon \propto \sin\omega t$ — AC is a
  consequence, not a design.
- Lenz's minus sign is energy conservation: a current that helped the change
  would be free energy.
- A rod on rails gives $\varepsilon = BLv$ and a velocity-proportional drag —
  the same equation as a falling body with air resistance.
- Inductors and capacitors are duals: at $t=0$ one is a break where the other is
  a wire, and they swap as $t \to \infty$.
:::
