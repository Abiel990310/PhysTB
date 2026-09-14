---
title: "Motion in one dimension"
navTitle: "1-D motion"
summary: >-
  Position, velocity and acceleration are one function and its two derivatives.
  Once you see that, the kinematic equations stop being things to memorise.
objectives:
  - Relate position, velocity and acceleration by differentiation
  - Derive the constant-acceleration equations rather than recalling them
  - Say exactly when those equations do not apply
  - Read motion off a graph and a graph off motion
scope: mech
status: complete
standard: none
---

Physics C is the calculus-based course, and this chapter is where that stops
being a label. In the algebra-based course the kinematic equations are five
facts to memorise. Here they are consequences of one definition, and you can
rebuild them in thirty seconds if you forget them.

**Velocity is the derivative of position. Acceleration is the derivative of
velocity.**

$$v(t) = \frac{dx}{dt} \qquad a(t) = \frac{dv}{dt} = \frac{d^2x}{dt^2}$$

That is the entire content of one-dimensional kinematics. Everything else is
consequence.

## Differentiating a motion

Given a position function, the rest follows mechanically.

$$x(t) = 5t^3 - 2t^2 + 7$$

```math verify
d/dt (5*t**3 - 2*t**2 + 7) = 15*t**2 - 4*t
d/dt (15*t**2 - 4*t) = 30*t - 4
```

So $v(t) = 15t^2 - 4t$ and $a(t) = 30t - 4$. Note the constant $7$ vanished at
the first step: **where the object starts has no effect on how it moves.** Shift
the origin and the velocity is unchanged, which is the derivative telling you
something physical rather than algebraic.

Questions this now answers immediately:

- *When is it at rest?* Solve $v(t) = 0$: at $t = 0$ and $t = \tfrac{4}{15}$.
- *When is the acceleration zero?* $30t - 4 = 0$, so $t = \tfrac{2}{15}$.
- *When does it change direction?* When $v$ changes sign — which is not the same
  as $v = 0$, since $v$ can touch zero without crossing it.

:::pitfall
**Speed is not velocity.** Speed is $|v|$, and it can increase while the
velocity decreases — an object moving in the $-x$ direction and speeding up has
velocity going from $-2$ to $-5$, which is decreasing, while its speed goes from
$2$ to $5$.

The reliable test: **speed increases when $v$ and $a$ have the same sign**, and
decreases when they have opposite signs. Exam questions ask this constantly and
it is the one place sign conventions genuinely bite.
:::

## Deriving the constant-acceleration equations

When $a$ is constant, integrate twice. Nothing is memorised.

Starting from $\tfrac{dv}{dt} = a$ and integrating:

$$v(t) = v_0 + at$$

Integrating again, since $\tfrac{dx}{dt} = v$:

$$x(t) = x_0 + v_0 t + \tfrac{1}{2}a t^2$$

```math verify
d/dt (v + a*t) = a
d/dt (b + v*t + a*t**2/2) = a*t + v
```

The first verified line says the velocity equation really does have constant
acceleration $a$; the second says differentiating the position equation returns
the velocity equation. Those two checks are the derivation.

The third equation, the one without $t$, comes from eliminating $t$ between
them:

$$v^2 = v_0^2 + 2a\,\Delta x$$

It is worth having, because problems that give you a distance and ask for a
speed would otherwise need solving a quadratic for $t$ first.

:::warning
**These three equations are only valid when acceleration is constant.**

That condition is stated so often it stops being heard, and then it gets applied
to a problem where $a$ depends on time, position, or velocity — air resistance,
a spring, a rocket losing mass — and the answer is confidently wrong.

If $a$ is not constant, go back to the definitions and integrate. That always
works; the shortcuts do not.
:::

```math verify
int a dt = a*t
int (v + a*t) dt = v*t + a*t**2/2
```

Those are the two integrations, checked. The constants of integration are
$v_0$ and $x_0$ — the initial conditions, which is what a constant of
integration always is in physics.

## Motion as a graph

The derivative relationship shows up geometrically, and reading it off a graph
is a standard exam task:

| On a position–time graph | means |
|---|---|
| slope | velocity |
| zero slope | at rest |
| curvature | acceleration |

| On a velocity–time graph | means |
|---|---|
| slope | acceleration |
| area under the curve | displacement |
| area below the axis | motion backwards |

:::graph
{
  "kind": "secant",
  "title": "x(t) = t² − 3t: drag h towards zero to read the velocity at t = 0.5",
  "fn": "t**2 - 3*t",
  "domain": [-0.3, 3.2],
  "range": [-3, 2],
  "at": 0.5,
  "controls": [
    { "name": "h", "label": "h", "min": 0.02, "max": 2, "step": 0.01, "value": 1.5 }
  ]
}
:::

The velocity at $t = 0.5$ is $2(0.5) - 3 = -2$, and the secant slope converges
on exactly that. Negative velocity means moving in the $-x$ direction, which on
this graph is the descending part of the parabola.

```math verify
d/dt (t**2 - 3*t) = 2*t - 3
```

Note that the *area* interpretation belongs to velocity–time graphs, not
position–time graphs. Area under a position–time curve has no physical meaning,
and confusing the two is a reliable way to lose marks.

:::quiz
{
  "question": "An object has velocity v = −4 m/s and acceleration a = −2 m/s². What is happening to its speed?",
  "options": [
    {
      "text": "Increasing, because v and a have the same sign",
      "correct": true,
      "why": "Speed is |v|. Velocity goes −4, −6, −8…, so its magnitude grows. Same signs means the acceleration pushes in the direction of travel, which always speeds an object up."
    },
    {
      "text": "Decreasing, because the acceleration is negative",
      "correct": false,
      "why": "A negative acceleration slows things down only when the velocity is positive. Here it acts in the same direction as the motion, so it speeds the object up."
    },
    {
      "text": "Constant, since both are negative and cancel",
      "correct": false,
      "why": "Velocity and acceleration are not quantities that cancel — one is the rate of change of the other. A nonzero acceleration always changes the velocity."
    },
    {
      "text": "Decreasing, because the object is moving backwards",
      "correct": false,
      "why": "Direction of travel alone says nothing about speed. Which way the acceleration points relative to the motion is what matters, and here it points the same way."
    }
  ]
}
:::

:::recap
- $v = \tfrac{dx}{dt}$ and $a = \tfrac{dv}{dt}$. Everything in 1-D kinematics
  follows from these two definitions.
- The constant-acceleration equations come from integrating twice, with $v_0$
  and $x_0$ as the constants of integration.
- They apply **only** when acceleration is constant. Otherwise return to the
  definitions and integrate.
- Speed is $|v|$, and it increases exactly when $v$ and $a$ share a sign.
- Slope of position–time is velocity; slope of velocity–time is acceleration;
  area under velocity–time is displacement. Area under position–time means
  nothing.
:::
