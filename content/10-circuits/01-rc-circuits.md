---
title: "RC circuits"
navTitle: "RC circuits"
summary: >-
  A capacitor charging through a resistor is the differential equation of E&M,
  and the exponential it produces turns up everywhere afterwards.
objectives:
  - Apply Kirchhoff's rules to a single-loop circuit
  - Derive the charging and discharging equations
  - Interpret the time constant physically
  - Say what happens immediately after a switch closes, and long after
scope: em
status: complete
standard: none
---

Most circuit questions in this course are algebra. RC circuits are not — the
current depends on the charge, which depends on the current, and that circularity
is a differential equation. It is the E&M counterpart of the drag problem in
chapter 2.1, with the same shape of answer.

## The two rules

**Loop rule.** Around any closed loop, the potential changes sum to zero. This
is conservation of energy: go all the way round and you are back where you
started, so the total climb equals the total fall.

**Junction rule.** Current in equals current out at any junction. This is
conservation of charge, which does not pile up anywhere.

For a resistor and capacitor in series with a battery:

$$\varepsilon - IR - \frac{Q}{C} = 0$$

Since $I = \tfrac{dQ}{dt}$, that is

$$\varepsilon = R\frac{dQ}{dt} + \frac{Q}{C}$$

— one equation, one unknown function, and no way to treat it as arithmetic.

## The solution and the time constant

$$Q(t) = C\varepsilon\left(1 - e^{-t/RC}\right)
\qquad
I(t) = \frac{\varepsilon}{R}e^{-t/RC}$$

```math verify
# assume: R > 0, C > 0
d/dt (C*E*(1 - exp(-t/(R*C)))) = E*exp(-t/(R*C))/R
lim t->oo (1 - exp(-t/(R*C))) = 1
lim t->0 exp(-t/(R*C)) = 1
```

Those three checks are the whole story. The first confirms the current really is
the derivative of the charge. The second says the capacitor approaches full
charge $C\varepsilon$. The third says the initial current is $\tfrac{\varepsilon}{R}$
— the capacitor starts empty, so it offers no opposition at all and the resistor
alone sets the current.

The quantity $\tau = RC$ is the **time constant**, and it has units of seconds —
worth checking once, because it is not obvious that ohms times farads gives
time.

```math verify
# assume: R > 0, C > 0
1 - exp(-1) = 1 - exp(-1)
```

After one time constant the capacitor has reached $1 - e^{-1} \approx 63\%$ of
full charge; after three, about $95\%$; after five, over $99\%$. "Fully charged"
is a practical statement, never a mathematical one — the exponential never
reaches zero, exactly as terminal velocity was never reached in chapter 2.1.

## Discharging

Remove the battery and the capacitor drives its own current through the
resistor:

$$Q(t) = Q_0 e^{-t/RC}$$

```math verify
# assume: R > 0, C > 0
d/dt (Q*exp(-t/(R*C))) = -Q*exp(-t/(R*C))/(R*C)
```

The minus sign is the charge decreasing. Same time constant, same exponential —
which is why $RC$ characterises the circuit rather than any particular
experiment done on it.

## The two shortcuts worth knowing

Almost every exam question about an RC circuit asks about one of two instants,
and both are answered without touching the differential equation.

**Immediately after the switch closes** ($t = 0$):

- An **uncharged capacitor behaves like a wire.** It has no voltage across it
  yet, so it offers no opposition.
- Current is at its maximum, $\tfrac{\varepsilon}{R}$.

**A long time after** ($t \to \infty$):

- A **fully charged capacitor behaves like a break in the circuit.** No current
  flows into it.
- The capacitor's voltage equals whatever the circuit can supply.

:::note
Those two reductions turn a differential equation into a pair of simple resistor
problems, which is why they are worth more than the general solution on a timed
exam. Redraw the circuit twice — once with the capacitor as a wire, once as a
gap — and read off the answers.
:::

:::pitfall
**A capacitor's voltage cannot change instantaneously.** Charge has to flow to
change it, and finite current takes time.

Current *can* jump instantly — it does exactly that the moment the switch
closes. Confusing which quantity is continuous is the standard error here, and
it inverts the answer.
:::

## Energy

The capacitor stores

$$U = \tfrac12 C V^2 = \frac{Q^2}{2C}$$

```math verify
# assume: C > 0
d/dq (q**2/(2*C)) = q/C
```

That derivative is $\tfrac{Q}{C}$, which is the voltage — the same
force-is-the-derivative-of-potential-energy relationship from chapter 3.1,
appearing again in an electrical costume.

There is a result worth knowing here: charging a capacitor through a resistor
always dissipates **exactly as much energy in the resistor as ends up stored in
the capacitor**, regardless of $R$. Half the battery's energy is lost as heat no
matter how carefully you do it, which is a genuine limitation rather than an
engineering failure.

:::quiz
{
  "question": "A switch closes in a series RC circuit with an initially uncharged capacitor. What is the current immediately afterwards?",
  "options": [
    {
      "text": "ε/R, because an uncharged capacitor acts like a plain wire",
      "correct": true,
      "why": "With Q = 0 there is no voltage across the capacitor, so the loop rule leaves ε = IR. The capacitor opposes nothing yet, and the resistor alone sets the current."
    },
    {
      "text": "Zero, because the capacitor has no charge to drive a current",
      "correct": false,
      "why": "That describes the long-time behaviour, when the capacitor is full and blocks current. At t = 0 it is the opposite: an empty capacitor is the easiest thing in the circuit to push charge into."
    },
    {
      "text": "ε/R multiplied by 1 − e⁻¹, about 63% of maximum",
      "correct": false,
      "why": "That factor describes the charge after one time constant, not the current at t = 0. The current starts at maximum and decays from there."
    },
    {
      "text": "It cannot be determined without knowing C",
      "correct": false,
      "why": "C sets how long charging takes, through τ = RC, but not the starting current. At t = 0 the capacitor contributes no voltage whatever its capacitance."
    }
  ]
}
:::

## Watch the time constant

:::sim
rates:  q' = (V - q/C)/R
init:   q = 0
params: R = 3 [0.5..10], C = 2 [0.5..5], V = 5
exact:  q = C*V*(1 - exp(-t/(R*C)))
span:   0..40
plot:   q
labels: R = resistance (ohms), C = capacitance (F), q = charge (C)
:::

The charge climbs to $CV$ and the approach is exponential with time constant
$\tau = RC$. Raising either $R$ or $C$ slows the charging; raising $C$ also
raises the final charge, while raising $R$ does not. That asymmetry is worth
pausing on — $R$ controls only *how fast*, $C$ controls *how much and how fast*
— and it is immediate on the sliders and easy to miss in the algebra.


:::recap
- The loop rule is energy conservation and the junction rule is charge
  conservation.
- $\varepsilon = R\tfrac{dQ}{dt} + \tfrac{Q}{C}$ is a differential equation,
  and RC circuits are where E&M stops being algebra.
- $\tau = RC$ is the time constant: 63% charged after one, 95% after three,
  never quite 100%.
- At $t = 0$ an uncharged capacitor is a wire; at $t\to\infty$ a charged one is
  a gap. Those two pictures answer most questions.
- Capacitor voltage cannot jump; current can, and does, at the switch.
- $U = \tfrac{Q^2}{2C}$, whose derivative with respect to charge is the
  voltage — the same relationship as force and potential energy.
:::
