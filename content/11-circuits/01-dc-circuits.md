---
title: "Current, resistance and DC circuits"
navTitle: "DC circuits"
summary: >-
  Two conservation laws, written for circuits. Everything else in this unit —
  series, parallel, internal resistance, power — follows from them.
objectives:
  - Define current and relate it to charge
  - Combine resistors in series and in parallel, and say why the rules differ
  - Apply Kirchhoff's rules to a multi-loop circuit
  - Account for a battery's internal resistance
  - Compute power dissipated, in whichever form the given quantities suit
scope: em
status: complete
standard: none
---

The previous units were about charges sitting still. A circuit is what happens
when you give them somewhere to go.

Almost nothing here is new physics. The junction rule is conservation of charge
and the loop rule is conservation of energy, both written for a circuit, and the
series and parallel formulas are consequences rather than facts to memorise.
Deriving them once is quicker than remembering which one has the reciprocals.

## Current

**Current** is the rate at which charge passes a point:

$$I = \frac{dQ}{dt}$$

measured in amperes, one ampere being one coulomb per second. It is a scalar,
despite having a direction associated with it.

**Conventional current** flows from $+$ to $-$ outside the battery — the
direction a *positive* charge would move. In a metal wire what actually moves is
electrons, going the other way. Every formula in this unit is written for
conventional current, and the exam expects it; the electrons' true direction
matters only when a question asks about them specifically.

## Resistance

A resistor opposes current, and for an **ohmic** material the opposition is
constant:

$$V = IR$$

Resistance depends on the material and the shape:

$$R = \frac{\rho L}{A}$$

Longer is more resistive, thicker is less — a wire is a pipe, and the analogy
carries this far honestly. $\rho$ is the resistivity, a property of the material
alone.

:::note
**Ohm's law is not a law of nature.** It is the statement that a particular
material has a constant resistance, and plenty of things do not: a diode, a
filament lamp as it heats, a transistor.

$V = IR$ always *defines* $R$ at an instant. It only *predicts* when $R$ is
constant, which is what "ohmic" means.
:::

## The two rules

**Junction rule.** Current in equals current out at any junction. This is
conservation of charge: charge does not accumulate at a point.

**Loop rule.** Around any closed loop the potential changes sum to zero. This is
conservation of energy: go all the way round and you are back where you started,
so the total climb equals the total fall.

Chapter 11.2 uses both on a single loop containing a capacitor, where they
produce a differential equation. Here they produce arithmetic.

## Series and parallel, derived

**In series**, there is one path, so **the current is the same** through each
resistor and the voltages add:

$$V = IR_1 + IR_2 = I(R_1 + R_2)
\qquad\Longrightarrow\qquad
R_{\text{series}} = R_1 + R_2$$

**In parallel**, both resistors span the same two nodes, so **the voltage is the
same** across each and the currents add:

$$I = \frac{V}{R_1} + \frac{V}{R_2}
\qquad\Longrightarrow\qquad
\frac{1}{R_{\text{parallel}}} = \frac{1}{R_1} + \frac{1}{R_2}$$

```math verify
# symbols: R1, R2
1/(1/R1 + 1/R2) = R1*R2/(R1 + R2)
```

That is the two-resistor shortcut, product over sum — worth knowing, and worth
knowing that it is **only** valid for exactly two. Three resistors need the
reciprocals written out.

```math verify
1/(1/R + 1/R) = R/2
```

Two equal resistors in parallel give half of one, which is the sanity check to
run on any parallel answer: **the result must be smaller than the smallest
resistor in the group.** Adding another path can only make it easier for current
to get through.

:::pitfall
These are the opposite of the capacitor rules in chapter 10.1, and the reason is
worth one sentence rather than a mnemonic.

Resistors in series resist more, because the current must fight through both.
Capacitors in series store *less*, because the same charge now has to climb two
potential hills — and capacitance is charge per volt, so more volts for the same
charge is less capacitance.

If you find yourself trying to recall which set has the reciprocals, derive it:
ask what is shared (current or voltage) and what adds.
:::

## A real battery

An ideal battery holds its terminals at a fixed potential difference no matter
what you draw. A real one has **internal resistance** $r$, and the current has
to pass through that too:

$$V_{\text{terminal}} = \varepsilon - Ir$$

where $\varepsilon$ is the emf. The terminal voltage is what a voltmeter across
the battery reads, and it **falls as the current rises**. Draw nothing and it
reads $\varepsilon$; short the battery and it reads nearly zero, with
$\varepsilon/r$ flowing.

That is why a car's headlights dim while the starter motor turns: the starter
draws an enormous current, the $Ir$ drop grows, and every other device sees the
reduced terminal voltage.

### How much power can it deliver?

With an external resistance $R$, the current is $\varepsilon/(R+r)$ and the
power delivered to $R$ is

```math verify
(E/(R + r))**2*R = E**2*R/(R + r)**2
```

with $E$ standing for $\varepsilon$. That expression is zero at both extremes —
no current when $R\to\infty$, no voltage across $R$ when $R = 0$ — so it has a
maximum in between. Differentiating:

```math verify
d/dR (E**2*R/(R + r)**2) = E**2*(r - R)/(R + r)**3
```

and the numerator vanishes when $R = r$:

```math verify
E**2*(r - r)/(r + r)**3 = 0
```

**Maximum power reaches the load when the external resistance equals the
internal one.** This is a genuinely calculus-based result and exactly the kind
of thing Physics C asks that the algebra-based course does not.

## Power

Charge falling through a potential difference gives up energy, at a rate

$$P = IV$$

and with $V = IR$ that wears two other faces:

```math verify
I*(I*R) = I**2*R
(V/R)*V = V**2/R
```

$$P = IV = I^2R = \frac{V^2}{R}$$

All three are the same statement. Which one to use is decided by what the
problem gives you, and choosing badly is how a one-line answer becomes three.

:::warning
$P = I^2R$ and $P = V^2/R$ point opposite ways, and picking the wrong one is a
standard error.

At **fixed current** — resistors in series — the largest resistor dissipates the
most. At **fixed voltage** — resistors in parallel — the *smallest* does, because
it draws the most current.

Decide what is being held constant before reaching for a formula.
:::

## Meters

- An **ammeter** measures current, so it goes **in series** and must have very
  low resistance, or it changes the current it is trying to measure.
- A **voltmeter** measures potential difference, so it goes **in parallel** and
  must have very high resistance, or it draws current through itself and lowers
  the voltage it is trying to measure.

Both requirements come from the same principle: a good instrument disturbs its
circuit as little as possible. Swapping them is destructive — a low-resistance
ammeter placed in parallel across a battery is a short circuit.

:::quiz
{
  "question": "Two resistors, 2 Ω and 6 Ω, are connected in parallel across a battery. Which dissipates more power, and why?",
  "options": [
    {
      "text": "The 2 Ω one, because parallel fixes the voltage and P = V²/R is larger for smaller R",
      "correct": true,
      "why": "Both see the same voltage, so the smaller resistor draws three times the current and dissipates three times the power. With voltage held constant, less resistance means more power."
    },
    {
      "text": "The 6 Ω one, because P = I²R grows with R",
      "correct": false,
      "why": "That form applies when the current is the same through both, which is the series case. In parallel the currents differ — and they differ in exactly the way that reverses the conclusion."
    },
    {
      "text": "They dissipate equally, since they share the same battery",
      "correct": false,
      "why": "Sharing a voltage is not sharing a power. P = V²/R still depends on R, and these differ by a factor of three."
    },
    {
      "text": "It cannot be decided without knowing the battery's emf",
      "correct": false,
      "why": "The emf scales both powers together, so the ratio — and therefore which is larger — is fixed by the resistances alone."
    }
  ]
}
:::

## Practice

:::exercise circuit-reductions

:::recap
- $I = \tfrac{dQ}{dt}$, and conventional current runs $+$ to $-$ outside the
  battery, opposite to the electrons in a wire.
- $V = IR$ defines resistance always and predicts only for ohmic materials.
  $R = \rho L/A$.
- Junction rule is conservation of charge, loop rule is conservation of energy.
  Series and parallel are consequences: ask what is shared and what adds.
- A parallel combination is always smaller than its smallest member; for exactly
  two, product over sum.
- A real battery gives $V = \varepsilon - Ir$, and delivers maximum power when
  the load matches its internal resistance.
- $P = IV = I^2R = V^2/R$. At fixed current the largest resistor dissipates
  most; at fixed voltage the smallest does.
- Ammeters go in series with low resistance, voltmeters in parallel with high.
:::
