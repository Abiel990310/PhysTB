---
id: energy-symbolic
title: "Energy, without plugging in numbers"
difficulty: core
chapter: work-and-energy
topics: [energy, work]
scope: mech
---

Energy arguments are shorter than force arguments whenever the path is
complicated and only the endpoints matter. These four are all one line each
*if* you start from energy, and considerably worse if you start from Newton's
second law.

Answer in symbols. Use `k` for a spring constant, `q` for an angle.

```answer
prompt: A spring of constant k is compressed a distance d from its natural length. How much elastic potential energy is stored?
reference: k*d**2/2
variable: k d
positive: k d
accept:
  - k*d^2/2
  - 0.5*k*d^2
  - (1/2)*k*d^2
reject:
  - k*d^2
  - k*d/2
  - k*d^3/6
```

```answer
prompt: That spring launches a block of mass m horizontally on a frictionless surface. What speed does the block leave with, in terms of k, d and m?
reference: d*sqrt(k/m)
variable: k d m
positive: k d m
accept:
  - sqrt(k*d^2/m)
  - sqrt(k/m)*d
  - (k*d^2/m)^(1/2)
reject:
  - d*sqrt(m/k)
  - k*d^2/(2*m)
  - sqrt(2*k*d/m)
```

```answer
prompt: A block slides from rest down a frictionless incline of height h. What is its speed at the bottom, in terms of g and h?
reference: sqrt(2*g*h)
variable: g h
positive: g h
accept:
  - (2*g*h)^(1/2)
  - sqrt(2gh)
reject:
  - sqrt(2*g*h*sin(q))
  - sqrt(g*h)
  - 2*g*h
```

```answer
prompt: A force F acts on a block over a displacement d, at angle q between them. How much work does it do?
reference: F*d*cos(q)
variable: F d q
accept:
  - d*F*cos(q)
  - cos(q)*F*d
reject:
  - F*d*sin(q)
  - F*d
  - F*d*tan(q)
```

## Hints
- Elastic potential energy is the integral of the spring force over the compression, not the force times the compression — the force is not constant.
- For the launched block, all the stored energy becomes kinetic. Set the two expressions equal and solve.
- On the incline, the angle is a distraction: gravity is conservative, so only the height change matters.
- Work is a dot product. Only the component of the force along the displacement does any.

## Notes
**Spring energy.** $U = \int_0^d kx\,dx = \tfrac12 kd^2$. Answering $kd^2$
forgets that the force grows from zero — it is the integral, not a product. The
factor of a half is the integration, exactly as it was for $\tfrac12 at^2$.

**Launch speed.** $\tfrac12 kd^2 = \tfrac12 mv^2$, so $v = d\sqrt{k/m}$. Both
halves cancel, which is worth noticing. The inverted answer $d\sqrt{m/k}$ fails
the sanity check that a heavier block must leave more slowly, not faster.

**Down the incline.** $mgh = \tfrac12 mv^2$ gives $v = \sqrt{2gh}$, the same
answer as a free drop from the same height — and the mass cancels, so it is the
same for every block. That is the whole reason to use energy here: the incline's
angle and length never enter.

**Work at an angle.** $W = \vec F\cdot\vec d = Fd\cos\theta$. The cosine, not the
sine: at $\theta = 0$ the force is along the motion and does the most work, and
$\cos 0 = 1$ while $\sin 0 = 0$. Checking the extreme case takes two seconds and
settles which function it is every time.
