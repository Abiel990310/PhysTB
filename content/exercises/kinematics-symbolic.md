---
id: kinematics-symbolic
title: "Four kinematics results, in symbols"
difficulty: core
chapter: motion-in-one-dimension
topics: [kinematics]
scope: mech
---

Answer each in **symbols**, not numbers. Physics C asks for symbolic answers far
more often than the algebra-based course does, and an answer in letters is worth
more than one in decimals: you can check its units, take its limits, and see
what it depends on.

Write powers with `^` or `**`, and use `v0` and `x0` for initial values.

```answer
prompt: A particle starts at x0 with velocity v0 and constant acceleration a. Where is it at time t?
reference: x0 + v0*t + a*t**2/2
variable: x0 v0 a t
accept:
  - x0 + v0*t + a*t^2/2
  - x0 + t*v0 + 0.5*a*t^2
  - (2*x0 + 2*v0*t + a*t^2)/2
reject:
  - x0 + v0*t + a*t^2
  - x0 + v0*t
  - v0*t + a*t^2/2
```

```answer
prompt: A ball is dropped from rest at height h. What is its speed on reaching the ground, in terms of g and h?
reference: sqrt(2*g*h)
variable: g h
positive: g h
accept:
  - (2*g*h)^(1/2)
  - sqrt(2gh)
reject:
  - 2*g*h
  - sqrt(g*h)
  - g*h^2/2
```

```answer
prompt: A particle's position is x(t) = A*t^3. What is its acceleration at time t?
reference: 6*A*t
variable: A t
accept:
  - 6*t*A
  - 3*2*A*t
reject:
  - 3*A*t^2
  - 6*A
  - A*t^3/6
```

```answer
prompt: A projectile is launched at speed v0 at angle q above the horizontal. What is its time of flight, landing at the same height, in terms of v0, g and q?
reference: 2*v0*sin(q)/g
variable: v0 g q
accept:
  - 2*v0*sin(q)*g^(-1)
  - v0*sin(q)*2/g
reject:
  - v0*sin(q)/g
  - 2*v0*cos(q)/g
  - 2*v0/g
```

## Hints
- The first two are the constant-acceleration equations. Do not recall them — integrate `a` twice, and remember that the two constants of integration *are* the initial conditions.
- For the dropped ball, the third equation (the one without `t`) is quickest, but energy gets there in one line too.
- Acceleration is the second derivative. Differentiate twice; do not look for an equation to plug into.
- For the projectile, the vertical motion is the whole problem. Horizontal velocity never affects when it lands.

## Notes
**Position under constant acceleration.** Integrating $a$ gives $v = v_0 + at$,
and integrating that gives $x = x_0 + v_0 t + \tfrac12 at^2$. The common wrong
answer, $at^2$ without the half, is what you get by integrating carelessly — and
it is worth noticing that the half comes from the integration, not from a rule.

**The dropped ball.** From $v^2 = v_0^2 + 2a\Delta x$ with $v_0 = 0$, $a = g$
and $\Delta x = h$: $v = \sqrt{2gh}$. Answering $2gh$ forgets the root, which a
units check catches instantly — $2gh$ has units of velocity *squared*.

**Acceleration from position.** $x = At^3$, so $v = 3At^2$ and $a = 6At$.
Answering $3At^2$ means stopping one derivative early, which is the single most
common slip in this topic.

**Time of flight.** Vertically the ball leaves at $v_0\sin\theta$ and must
return to the same height, so by symmetry it spends $v_0\sin\theta/g$ going up
and the same coming down: $t = 2v_0\sin\theta/g$. Answering
$v_0\sin\theta/g$ gives the time to the *top*, which is half the answer, and is
the mistake that symmetry argument is there to prevent.
