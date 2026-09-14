---
title: "Conductors, capacitors and dielectrics"
navTitle: "Capacitors"
summary: >-
  A conductor in equilibrium has no field inside it, and that single fact
  determines everything else — where the charge sits, what the field outside
  looks like, and why a capacitor stores energy in the gap rather than on
  the plates.
objectives:
  - State and use the equilibrium conditions inside a conductor
  - Find the field and potential of a charged conductor using Gauss's law
  - Derive the capacitance of a parallel-plate capacitor from the field
  - Compute stored energy, and say where the energy actually is
  - Combine capacitors in series and parallel, and explain the reversal
  - Predict what a dielectric does at fixed charge and at fixed voltage
scope: em
status: complete
standard: none
---

Chapter 8 put charges in space and found the field. This chapter puts them in
metal, where they are free to move — and a charge distribution free to move
arranges itself, which turns out to settle almost every question before you
have to calculate anything.

## The one fact about conductors

**In electrostatic equilibrium, the electric field inside a conductor is zero.**

This is not an assumption; it is what equilibrium *means*. If a field existed
inside, it would push the free charges, they would move, and the arrangement
would not be static. So the charges rearrange until their own field cancels
whatever was applied, and then they stop. Everything below follows.

Three consequences worth having at your fingertips:

- **Excess charge lives entirely on the surface.** Take any Gaussian surface
  just inside the conductor: $E = 0$ everywhere on it, so the flux is zero, so
  by Gauss's law the enclosed charge is zero. That holds for every interior
  surface, so nothing is left inside.
- **A conductor is an equipotential.** With $E = 0$ inside,
  $\Delta V = -\int \vec E\cdot d\vec\ell = 0$ between any two points of it —
  surface included, since the surface is part of the conductor.
- **The field at the surface is perpendicular to it.** A parallel component
  would push charge along the surface, and equilibrium forbids that.

:::pitfall
"The field inside a conductor is zero" is about **the material of the
conductor**, not about any hollow region inside it.

Put a charge $q$ inside a cavity in a neutral conductor and the cavity has a
perfectly good field. What happens is that $-q$ is induced on the cavity wall
and $+q$ appears on the outer surface, so the metal itself still sees zero.
Reading the rule as "no field anywhere inside the outer boundary" gets this
backwards.
:::

## Capacitance

Put charge $+Q$ on one conductor and $-Q$ on another. A potential difference
$V$ appears between them, and — this is the useful part — it is **proportional
to $Q$**, because doubling every charge doubles every field and so doubles
every potential difference. The constant of proportionality depends only on
the geometry:

$$C = \frac{Q}{V}$$

That is the definition, and it says nothing about plates. Any two conductors
have a capacitance.

### The parallel-plate case, derived

Two plates of area $A$ a distance $d$ apart, with $d$ small enough that the
field between them is uniform. Gauss's law on one plate gives
$E = \sigma/\varepsilon_0 = Q/(\varepsilon_0 A)$, and the potential difference
across a uniform field is just $V = Ed$:

$$V = \frac{Qd}{\varepsilon_0 A}
\qquad\Longrightarrow\qquad
C = \frac{Q}{V} = \frac{\varepsilon_0 A}{d}$$

```math verify
# symbols: A, d
(Q*d/(e*A))/Q = d/(e*A)
Q/(Q*d/(e*A)) = e*A/d
```

Both lines are the same algebra in the two directions: the potential per unit
charge, and its reciprocal. Notice what $C$ depends on — area and separation
and nothing else. **Not** on $Q$, and **not** on $V$. Those cancelled.

:::warning
$C = Q/V$ tempts a conclusion it does not support: that charging a capacitor
more raises its capacitance. It does not. Add charge and $V$ rises in exact
proportion, leaving $Q/V$ fixed.

Capacitance is a property of the geometry, in the same way that resistance is
a property of the wire rather than of the current you happen to run through it.
:::

## Stored energy, and where it lives

Charging a capacitor means moving charge from one plate to the other against
the potential difference that the already-moved charge has created. The first
charge crosses for free; the last crosses against the full $V$. So the energy
is an integral, not a product:

$$U = \int_0^Q V\,dq = \int_0^Q \frac{q}{C}\,dq = \frac{Q^2}{2C}$$

```math verify
# symbols: C
int Q/C dQ = Q**2/(2*C)
```

That is the same structure as the spring in chapter 3.1 — the force grows as
you compress, so the energy is $\tfrac12 kx^2$ rather than $kx$ — and the same
factor of a half, arriving for the same reason.

Using $Q = CV$ the result wears three faces, all identical:

$$U = \frac{Q^2}{2C} = \frac{1}{2}CV^2 = \frac{1}{2}QV$$

```math verify
# symbols: C
(C*V)**2/(2*C) = C*V**2/2
C*V**2/2 = (C*V)*V/2
```

Pick whichever two of $Q$, $V$, $C$ the problem gives you.

### The energy is in the field

$U = \tfrac12 CV^2$ suggests the energy belongs to the capacitor. Substituting
the parallel-plate results says otherwise. With $C = \varepsilon_0 A/d$ and
$V = Ed$:

$$U = \frac{1}{2}\cdot\frac{\varepsilon_0 A}{d}\cdot (Ed)^2
    = \frac{1}{2}\varepsilon_0 E^2 \cdot (Ad)$$

```math verify
(e*A/d)*(E*d)**2/2 = e*E**2*(A*d)/2
```

and $Ad$ is exactly the volume of the gap. So the energy per unit volume is

$$u = \frac{1}{2}\varepsilon_0 E^2$$

a quantity that mentions no plates, no area, no separation — only the field.
That is the physical statement: **the energy is stored in the field**, at a
density $\tfrac12\varepsilon_0 E^2$ wherever the field happens to be. The
capacitor is just a convenient way to make a strong field in a known volume.

This matters later. The same argument in chapter 12 gives a magnetic energy
density, and the two together are what lets an electromagnetic wave carry
energy through empty space, where there is no capacitor to store it in.

## Combining capacitors

**In parallel**, both capacitors span the same two nodes, so they share $V$
while the charges add:

$$Q_{\text{tot}} = Q_1 + Q_2 = (C_1 + C_2)V
\qquad\Longrightarrow\qquad
C_{\text{parallel}} = C_1 + C_2$$

**In series**, the same charge is on each — the inner plates are an isolated
conductor that started neutral, so whatever leaves one is what arrives at the
other — while the voltages add:

$$V_{\text{tot}} = \frac{Q}{C_1} + \frac{Q}{C_2}
\qquad\Longrightarrow\qquad
\frac{1}{C_{\text{series}}} = \frac{1}{C_1} + \frac{1}{C_2}$$

```math verify
# symbols: C1, C2
Q/C1 + Q/C2 = Q*(C1 + C2)/(C1*C2)
1/(1/C1 + 1/C2) = C1*C2/(C1 + C2)
```

:::note
These are the **opposite** of the resistor rules, and the reason is worth one
sentence rather than a mnemonic.

Resistors in series resist more because the current fights through both.
Capacitors in series store *less* because the same charge now has to climb two
potential hills instead of one — and capacitance measures charge per volt, so
more volts for the same charge means less capacitance.

Parallel plates in parallel simply make a bigger plate, which is why those add.
:::

## Dielectrics

Slide an insulating slab into the gap. Its molecules polarise, lining up
against the applied field, and their own field opposes it. The field inside
the material drops by a factor $\kappa$, the dielectric constant, and so

$$C \to \kappa C \qquad (\kappa > 1)$$

Everything else follows from that one change — but **what** follows depends on
what you hold fixed, and this is where the exam questions live.

| Held fixed | $C$ | $Q$ | $V$ | $E$ | $U$ |
|---|---|---|---|---|---|
| Disconnected battery — $Q$ fixed | $\times\kappa$ | — | $\div\kappa$ | $\div\kappa$ | $\div\kappa$ |
| Battery still attached — $V$ fixed | $\times\kappa$ | $\times\kappa$ | — | — | $\times\kappa$ |

```math verify
# symbols: C
(Q**2/(2*(k*C))) = (Q**2/(2*C))/k
((k*C)*V**2/2) = k*(C*V**2/2)
```

The first line is the disconnected case, the second the connected one — and the
checked algebra says the energy goes *down* in one and *up* in the other, for
the same slab and the same capacitor.

That is not a contradiction. Disconnected, the slab is pulled in and the field
does the work, so the stored energy falls. Connected, the battery supplies the
extra charge, and it does work $\Delta Q\cdot V$ — twice the energy the
capacitor gains, with the other half dissipated. The question "does inserting a
dielectric raise or lower the energy?" has no answer until you say whether the
battery is still there.

:::quiz
{
  "question": "A capacitor is charged, then disconnected from the battery. A dielectric slab of constant κ is inserted. What happens to the voltage across it?",
  "options": [
    {
      "text": "It falls by a factor of κ, because Q is fixed while C rises",
      "correct": true,
      "why": "Disconnected means no path for charge to leave, so Q is stuck. V = Q/C, and C has gone up by κ, so V goes down by κ. The field between the plates drops by the same factor, which is the physical statement underneath."
    },
    {
      "text": "It stays the same, because voltage is set by the battery",
      "correct": false,
      "why": "That is the fixed-V case — and the battery has been disconnected, so it is no longer setting anything. Whether the battery is attached is the whole content of this kind of question."
    },
    {
      "text": "It rises by a factor of κ, because the capacitor stores more",
      "correct": false,
      "why": "Capacitance rising with Q fixed means voltage falls, not rises: C = Q/V with Q constant puts C and V on opposite sides. The stored energy falls too, from Q²/2C."
    },
    {
      "text": "It falls by κ², since both C and Q change",
      "correct": false,
      "why": "Q does not change — there is nowhere for charge to go once the battery is disconnected. Only the connected case changes Q, and there it is V that stays put."
    }
  ]
}
:::

:::recap
- The field inside a conductor in equilibrium is zero, because otherwise the
  charges would still be moving. Excess charge sits on the surface, the
  conductor is an equipotential, and the surface field is perpendicular.
- $C = Q/V$ depends only on geometry. Charging a capacitor does not change it.
- For parallel plates, $C = \varepsilon_0 A/d$, derived from Gauss's law and
  $V = Ed$ rather than recalled.
- $U = \tfrac{Q^2}{2C} = \tfrac12 CV^2 = \tfrac12 QV$, and the factor of a half
  is an integration — the charge is moved against a rising voltage.
- The energy density is $\tfrac12\varepsilon_0 E^2$: the energy is in the field,
  not on the plates.
- Capacitors add in parallel and add reciprocally in series, the opposite of
  resistors, because capacitance is charge per volt and series adds volts.
- A dielectric multiplies $C$ by $\kappa$. Everything after that depends on
  whether $Q$ or $V$ is held fixed — decide that first, every time.
:::
