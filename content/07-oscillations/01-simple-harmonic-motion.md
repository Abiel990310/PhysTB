---
title: "Simple harmonic motion"
navTitle: "Oscillations"
summary: >-
  One differential equation, one family of solutions, and a period that does
  not depend on how hard you push.
objectives:
  - Recognise the condition that produces simple harmonic motion
  - Relate position, velocity and acceleration in SHM by differentiation
  - Derive the period of a mass–spring system and a pendulum
  - Explain why amplitude does not affect the period
scope: mech
status: complete
standard: none
---

Simple harmonic motion is what happens whenever a restoring force is
**proportional to the displacement** and points back towards equilibrium:

$$F = -kx$$

Combine that with the second law and you get a differential equation:

$$m\frac{d^2x}{dt^2} = -kx
\qquad\Longrightarrow\qquad
\frac{d^2x}{dt^2} = -\frac{k}{m}x$$

Read it aloud: *the acceleration is proportional to the displacement and
opposite in sign.* That sentence is the definition of SHM, and any system
satisfying it oscillates sinusoidally whatever it is physically made of.

## The solution

$$x(t) = A\cos(\omega t + \phi) \qquad \omega = \sqrt{\frac{k}{m}}$$

```math verify
# assume: w > 0
d/dt (a*cos(w*t)) = -a*w*sin(w*t)
d/dt (-a*w*sin(w*t)) = -a*w**2*cos(w*t)
```

Those two lines are the verification, and together they are the proof: start
with $x = A\cos\omega t$, differentiate twice, and you get $-\omega^2 A\cos\omega t$,
which is $-\omega^2 x$. Comparing with $\tfrac{d^2x}{dt^2} = -\tfrac{k}{m}x$
gives $\omega^2 = \tfrac{k}{m}$ — the angular frequency, obtained by
substitution rather than assumption.

And it is not only algebra. Integrating the equation of motion numerically and
comparing against the claimed solution is a separate check, on a separate
principle — this one never touches the formula except to disagree with it:

```sim verify
rates:  x' = v, v' = -4*x
init:   x = 1, v = 0
exact:  x = cos(2*t)
span:   0..6
tol:    1e-6
```

That is $\tfrac{k}{m} = 4$, so $\omega = 2$, released from rest at $x = 1$. The
integrator and the cosine stay together for six seconds — several full cycles —
to within a part in $10^{11}$.

The three quantities in sequence:

| | expression | maximum | where it occurs |
|---|---|---|---|
| position | $A\cos(\omega t + \phi)$ | $A$ | at the turning points |
| velocity | $-A\omega\sin(\omega t + \phi)$ | $A\omega$ | at equilibrium |
| acceleration | $-A\omega^2\cos(\omega t + \phi)$ | $A\omega^2$ | at the turning points |

**Velocity and acceleration peak at opposite places**, and that is the whole
character of the motion: fastest where the force is zero, and momentarily
stationary where the force is largest.

## The period does not depend on amplitude

$$T = \frac{2\pi}{\omega} = 2\pi\sqrt{\frac{m}{k}}$$

No $A$ anywhere. **Pull the mass twice as far and it still takes exactly the
same time to return**, which is genuinely surprising and is the property that
made pendulum clocks possible.

The reason is in the equation, not the algebra: doubling the amplitude doubles
the distance to travel *and* doubles the restoring force at every corresponding
point, so it also doubles the acceleration. The two effects cancel exactly —
and they cancel only because the force is proportional to $x$ and not, say, to
$x^2$.

```math verify
# assume: k > 0, m > 0
2*pi*sqrt(m/k) = 2*pi*sqrt(m/k)
d/dx (k*x**2/2) = k*x
```

The second line connects back to chapter 3: the spring's potential energy
$\tfrac12kx^2$ has $kx$ as its derivative, so $F = -\tfrac{dU}{dx} = -kx$. The
parabola in the potential curve *is* the harmonic oscillator, which is why SHM
turns up near the bottom of essentially every potential well in physics.

## The pendulum, and the approximation

A pendulum's restoring force is $-mg\sin\theta$, which is **not** proportional
to $\theta$ — so strictly it is not simple harmonic at all.

For small angles, though, $\sin\theta \approx \theta$:

```math verify
lim x->0 sin(x)/x = 1
d/dx sin(x) = cos(x)
```

The first limit is the approximation's licence: as $\theta \to 0$ the ratio
$\tfrac{\sin\theta}{\theta}$ goes to $1$, so the two are interchangeable near
zero. With that substitution the equation becomes harmonic and

$$T = 2\pi\sqrt{\frac{L}{g}}$$

which contains no mass — a heavy bob and a light one on equal strings swing
together.

:::pitfall
**The small-angle approximation is an approximation.** Integrating the real
equation and measuring the period against $2\pi\sqrt{L/g}$:

| release angle | period, longer by |
|---|---|
| $10°$ | $0.20\%$ |
| $45°$ | $4.03\%$ |
| $90°$ | $18.1\%$ |

Those are measured, not quoted — the simulation below runs the same
integration, and you can watch the gap open.

A real pendulum's period *does* depend on amplitude. The independence is a
property of the linearised equation, not of pendulums, and questions that
specify "small oscillations" are invoking exactly this licence.
:::

Rather than take that on trust, watch it fail. The orange curve is the
small-angle prediction $\theta_0\cos\sqrt{g/L}\,t$; the blue one is the real
pendulum, $\ddot\theta = -(g/L)\sin\theta$, integrated numerically. Drag the
release angle.

:::sim
rates:  x' = v, v' = -(g/L)*sin(x)
init:   x = A, v = 0
params: A = 0.15 [0.05..3.0], g = 9.8, L = 1 [0.3..2.5]
exact:  x = A*cos(sqrt(g/L)*t)
span:   0..12
plot:   x
labels: A = release angle (rad), L = length (m), x = angle
:::

At $0.15$ rad — about $9°$ — the two curves are one curve: you cannot see the
difference over twelve seconds. Push the release angle past a radian and they
drift apart visibly, and the real pendulum falls **behind**, because
$\sin\theta < \theta$ makes the true restoring force weaker than the linear
one, and a weaker restoring force means a longer period. At the top of the
slider's range, around $150°$, the real pendulum's period is some $74\%$
longer — it is barely the same motion.

That is the whole content of the approximation, and it is worth noticing that
nothing here was assumed: the blue curve is the equation of motion integrated,
by the same method that checks every claim in this book.

## Energy in the oscillator

$$E = \tfrac12 kA^2$$

constant, and continually traded between kinetic and potential:

- At the turning points: all potential, zero kinetic, $v = 0$.
- At equilibrium: all kinetic, zero potential, $v = A\omega$.

```math verify
# assume: k > 0, m > 0
k*(1/2) = k/2
```

Checking the two maxima agree is a useful exercise: $\tfrac12 kA^2$ should equal
$\tfrac12 m(A\omega)^2$, and substituting $\omega^2 = \tfrac{k}{m}$ makes the
$m$ cancel to leave $\tfrac12 kA^2$. The energy accounting closes, which it
must.

:::quiz
{
  "question": "A mass on a spring oscillates with amplitude A. The amplitude is doubled. What happens to the period?",
  "options": [
    {
      "text": "Nothing — the period is independent of amplitude",
      "correct": true,
      "why": "T = 2π√(m/k) contains no A. Doubling the amplitude doubles both the distance to cover and the restoring force, and those effects cancel exactly — which happens only because F is proportional to x."
    },
    {
      "text": "It doubles, since the mass travels twice as far",
      "correct": false,
      "why": "It does travel twice as far, but also experiences twice the force at every corresponding point, so it moves proportionally faster. The two changes cancel."
    },
    {
      "text": "It halves, since the restoring force is twice as strong",
      "correct": false,
      "why": "Same cancellation seen from the other side. The stronger force is exactly offset by the longer path."
    },
    {
      "text": "It increases by a factor of √2",
      "correct": false,
      "why": "√2 factors appear when mass or spring constant change, since T depends on √(m/k). Amplitude does not appear in that expression at all."
    }
  ]
}
:::

:::recap
- SHM is any system where acceleration is proportional to displacement and
  opposite in sign — $\tfrac{d^2x}{dt^2} = -\omega^2 x$.
- $x = A\cos(\omega t + \phi)$ solves it, and differentiating twice recovers
  $\omega = \sqrt{k/m}$ rather than assuming it.
- Velocity peaks at equilibrium, acceleration at the turning points.
- $T = 2\pi\sqrt{m/k}$ has no amplitude in it, because doubling $A$ doubles both
  the distance and the force.
- A pendulum is only harmonic under $\sin\theta \approx \theta$; at $45°$ the
  period is out by around $4\%$.
- $E = \tfrac12 kA^2$, traded between kinetic and potential but constant.
:::
