---
title: "Forces and the second law"
navTitle: "Newton's second law"
summary: >-
  F = ma is a differential equation, not an arithmetic formula. Treating it as
  one is what separates this course from the algebra-based version.
objectives:
  - Draw a free-body diagram and turn it into equations
  - Apply the second law componentwise
  - Solve a motion problem where the force is not constant
  - Identify third-law pairs and say why they never cancel
scope: mech
status: complete
standard: none
---

$$\sum \vec{F} = m\vec{a}$$

Everyone arrives knowing this. What Physics C adds is that $\vec a$ is
$\tfrac{d^2\vec x}{dt^2}$, which makes the second law a **differential
equation** — and once the force depends on position or velocity, that is the
only way to use it.

## The procedure, which never changes

1. **Pick the object.** One body at a time. Most errors are forces from the
   wrong free-body diagram.
2. **Draw every force acting *on* it.** Not forces it exerts on other things —
   those belong to other diagrams.
3. **Choose axes.** Along the motion, if there is an obvious direction.
4. **Write $\sum F = ma$ once per axis.**
5. **Solve.**

The discipline is the content. A tidy free-body diagram turns most problems into
algebra; a sloppy one cannot be rescued by any amount of cleverness afterwards.

## Componentwise, always

$\sum\vec F = m\vec a$ is one vector equation, which means two independent scalar
equations in a plane:

$$\sum F_x = m a_x \qquad \sum F_y = m a_y$$

They do not interact. For a block on an incline of angle $\theta$, with axes
tilted along the surface:

$$mg\sin\theta - f = ma_x \qquad N - mg\cos\theta = 0$$

The second gives $N = mg\cos\theta$, which feeds the friction $f = \mu N$ in the
first. That is the usual structure: **the perpendicular equation supplies the
normal force, and the parallel equation gives the motion.**

:::pitfall
$N = mg$ **only on level ground with nothing else pushing vertically.** On an
incline it is $mg\cos\theta$; in a lift it is $m(g \pm a)$; with someone pressing
down it is larger still.

Normal force is whatever the perpendicular equation says it is. It is not a
formula to remember — it is an unknown to solve for, every time.
:::

## When the force is not constant

Here is where the calculus earns its place. Suppose a body falls with linear
drag, so the net force is $mg - bv$. Then

$$m\frac{dv}{dt} = mg - bv$$

The acceleration depends on the velocity, which is changing — so no kinematic
equation applies, and there is no constant $a$ to plug in anywhere.

What can be read off immediately is the **terminal velocity**: motion stops
changing when $\tfrac{dv}{dt} = 0$, which needs $mg = bv$, so

$$v_{\text{term}} = \frac{mg}{b}$$

The full solution is

$$v(t) = \frac{mg}{b}\left(1 - e^{-bt/m}\right)$$

```math verify
# assume: b > 0
d/dt (a*(1 - exp(-b*t))) = a*b*exp(-b*t)
lim t->oo (1 - exp(-b*t)) = 1
```

And the equation itself can be integrated and compared against that solution,
which is a stronger claim than differentiating it:

```sim verify
rates:  v' = 9.8 - 0.5*v
init:   v = 0
exact:  v = 19.6*(1 - exp(-0.5*t))
span:   0..12
tol:    1e-6
```

Drag the drag coefficient and watch where the velocity levels off. The orange
curve is the closed form above; the blue one is the equation of motion
integrated.

:::sim
rates:  v' = g - b*v
init:   v = 0
params: b = 0.5 [0.05..2.0], g = 9.8
exact:  v = (g/b)*(1 - exp(-b*t))
span:   0..20
plot:   v
labels: b = drag coefficient b/m, v = velocity (m/s)
:::

Terminal velocity is $g/b$ — halve the drag and the final speed doubles, which
the slider makes obvious and which the algebra states without ever making you
feel it.

Now the case with no closed form. Real drag at speed goes as $v^2$, not $v$, and
$\dot v = g - cv^2$ has a solution in $\tanh$ that no AP course asks for. The
integration does not care:

:::sim
rates:  v' = g - c*v*v
init:   v = 0
params: c = 0.02 [0.002..0.2], g = 9.8
span:   0..25
plot:   v
labels: c = drag coefficient c/m, v = velocity (m/s)
:::

There is no orange curve here because there is no formula to draw — and that is
the point of chapter 2.1. The equation of motion is the physics; a closed form
is a convenience that some problems happen to admit.

Those numbers are $g = 9.8$ and $\tfrac{b}{m} = 0.5$, giving a terminal velocity
of $19.6$ m/s. The integrator, which knows only the force law, tracks the
closed form for twelve seconds.

The first algebraic check confirms the shape of the solution — differentiating
gives an exponential decay, which is what a force that shrinks as you speed up
produces.
The second confirms the approach to terminal velocity: the bracket tends to $1$,
so $v \to \tfrac{mg}{b}$, and it gets there asymptotically rather than at any
particular moment.

:::note
"Reaches terminal velocity" is always an approximation. The exponential never
actually equals zero, so the body is always slightly below $v_\text{term}$ —
just not measurably, after a few multiples of the time constant $\tfrac{m}{b}$.
Exam answers that say "approaches" rather than "reaches" are the accurate ones.
:::

## The third law, and why nothing cancels

For every force there is an equal and opposite one, **on a different body.**
That last clause is the entire content of the law and the part that gets lost.

A book rests on a table. Two pairs are in play, and they are different:

- The book pulls the Earth up with the same force the Earth pulls the book down.
  *A third-law pair.*
- The table pushes the book up with the same magnitude as the book's weight.
  *Not a third-law pair* — both act on the book, and they are equal only because
  the book happens not to be accelerating.

The test: **a third-law pair acts on two different objects, so it can never
appear on the same free-body diagram.** Two forces on one diagram that cancel are
doing so because of the second law with $a = 0$, which is a coincidence of the
situation, not a law of nature. Put the book in a lift and the second pair stops
being equal while the first still is.

:::quiz
{
  "question": "A 2 kg block slides down a frictionless 30° incline. What is its acceleration along the slope?",
  "options": [
    {
      "text": "g·sin(30°) ≈ 4.9 m/s², independent of the mass",
      "correct": true,
      "why": "The parallel equation is mg sin θ = ma, and m cancels. That cancellation is why every object slides down a frictionless incline at the same rate — the same reason everything falls at the same rate."
    },
    {
      "text": "g ≈ 9.8 m/s², since gravity is unchanged by the incline",
      "correct": false,
      "why": "Gravity is unchanged, but the incline is not free fall — the normal force cancels the perpendicular component. Only the component along the slope, mg sin θ, drives the motion."
    },
    {
      "text": "g·cos(30°) ≈ 8.5 m/s²",
      "correct": false,
      "why": "cos θ gives the perpendicular component, which the normal force balances. The component along the direction of motion carries sin θ."
    },
    {
      "text": "2·g·sin(30°) ≈ 9.8 m/s², because the block has mass 2 kg",
      "correct": false,
      "why": "Mass appears on both sides — as weight in the force and as inertia in ma — and cancels. A heavier block feels more gravity and resists it proportionally more."
    }
  ]
}
:::

:::recap
- $\sum\vec F = m\vec a$ with $\vec a = \tfrac{d^2\vec x}{dt^2}$: a differential
  equation, and the only usable form once force depends on position or velocity.
- Work one body at a time, draw only the forces acting on it, and write the
  second law once per axis.
- The perpendicular equation supplies the normal force; $N = mg$ is a special
  case, not a definition.
- With velocity-dependent force, terminal velocity is where
  $\tfrac{dv}{dt} = 0$, and it is approached asymptotically, never reached.
- Third-law pairs act on **different bodies** and so never appear on one
  free-body diagram. Forces that cancel on a single diagram do so because
  $a = 0$, which is circumstance rather than law.
:::
