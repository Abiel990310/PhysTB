---
id: circuit-reductions
title: "Reduce it, then read the power off"
difficulty: core
chapter: dc-circuits
topics: [circuits, resistance, power]
scope: em
---

Four questions about the same handful of ideas: what is shared, what adds, and
which face of the power formula the given quantities suit.

Answer in symbols. Write $\varepsilon$ as `E` and internal resistance as `r`.

```answer
prompt: Two resistors R1 and R2 in parallel. Give the equivalent resistance.
reference: R1*R2/(R1 + R2)
variable: R1 R2
positive: R1 R2
accept:
  - 1/(1/R1 + 1/R2)
  - R2*R1/(R2 + R1)
reject:
  - R1 + R2
  - 1/R1 + 1/R2
  - (R1 + R2)/(R1*R2)
```

```answer
prompt: Three identical resistors R, all in parallel. Give the equivalent resistance.
reference: R/3
variable: R
positive: R
accept:
  - (1/3)*R
  - 1/(3/R)
reject:
  - 3*R
  - R/2
  - 3/R
```

```answer
prompt: A battery of emf E and internal resistance r drives an external resistance R. Give the current.
reference: E/(R + r)
variable: E R r
positive: E R r
accept:
  - E*(R + r)^(-1)
  - E/(r + R)
reject:
  - E/R
  - E/r
  - E*(R + r)
```

```answer
prompt: Same battery and load. Give the power dissipated in the external resistance R.
reference: E**2*R/(R + r)**2
variable: E R r
positive: E R r
accept:
  - (E/(R + r))**2*R
  - E^2*R/(R + r)^2
reject:
  - E**2/R
  - E**2*R/(R + r)
  - E**2/(R + r)**2
```

## Hints
- In parallel the two resistors share a voltage and their currents add, so it is the reciprocals that add. Product over sum is the shortcut, and it works for exactly two.
- Three in parallel is the reciprocal rule three times. Check the result against the rule that a parallel combination is smaller than its smallest member.
- Internal resistance is in series with the load, so the battery drives the current through their sum.
- For the power, you have the current and the resistance it flows through — so $I^2R$ is the face that needs no extra work.

## Notes
**Two in parallel.** $\tfrac{1}{R_{eq}} = \tfrac{1}{R_1} + \tfrac{1}{R_2}$
rearranges to $\tfrac{R_1R_2}{R_1+R_2}$. The tempting wrong answer
$\tfrac{1}{R_1} + \tfrac{1}{R_2}$ is the reciprocal of the answer — it is
$1/R_{eq}$, not $R_{eq}$, and forgetting the final flip is the standard slip.

**Three identical.** $\tfrac{1}{R_{eq}} = \tfrac{3}{R}$, so $R_{eq} = R/3$.
Sanity check: smaller than $R$, as every parallel combination must be. Answering
$3R$ is the series result, and answering $3/R$ is the un-flipped reciprocal
again.

**The current.** The internal resistance sits in series with the load — the same
current passes through both — so the battery sees $R + r$ and delivers
$\varepsilon/(R+r)$. Answering $\varepsilon/R$ treats the battery as ideal,
which is the whole point of the question.

**The power.** The current is $\varepsilon/(R+r)$ and it flows through $R$, so
$P = I^2R = \tfrac{\varepsilon^2 R}{(R+r)^2}$. Reaching for $V^2/R$ with
$V = \varepsilon$ gives $\varepsilon^2/R$, which is wrong because $\varepsilon$
is not the voltage across $R$ — the terminal voltage is, and it is smaller.

Worth noticing what this expression does: it is zero at $R = 0$ and zero as
$R \to \infty$, so it peaks somewhere between. Differentiating puts the peak at
$R = r$, which the chapter verifies — maximum power reaches a load matched to
the source.
