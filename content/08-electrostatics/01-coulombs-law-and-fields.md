---
title: "Coulomb's law and the electric field"
navTitle: "Coulomb and fields"
summary: >-
  The first chapter of E&M, and the one that decides whether the rest makes
  sense: a field is what a charge does to space, before anything else arrives.
objectives:
  - Apply Coulomb's law and superpose forces from several charges
  - Define the electric field and explain why it is worth defining
  - Integrate a continuous charge distribution to find its field
  - Relate field to potential by differentiation
scope: em
status: complete
standard: none
---

Mechanics had one force law worth memorising. Electrostatics has another, and it
has the same inverse-square shape for reasons that are not coincidental:

$$F = \frac{1}{4\pi\varepsilon_0}\frac{|q_1 q_2|}{r^2} = k\frac{|q_1 q_2|}{r^2}$$

with $k \approx 8.99\times10^9\ \text{N·m}^2/\text{C}^2$.

Same $\tfrac{1}{r^2}$ as gravity, and for the same geometric reason: influence
spreading over a sphere thins out as the sphere's area grows, and area goes as
$r^2$. The differences from gravity are that charge comes in two signs, so the
force can repel, and that it is about $10^{36}$ times stronger — which is why
you do not fall through a chair.

## Superposition

Forces from several charges **add as vectors**, one pair at a time, with every
other charge ignored while you compute each contribution.

That independence is a physical fact and not an obvious one — it is why the
whole subject is tractable. There is no three-body correction; each pair
contributes exactly what it would contribute alone.

In practice: resolve into components, sum $F_x$ and $F_y$ separately, recombine
at the end. Summing magnitudes and hoping is the standard way to lose the
question.

## The field

Rather than asking about the force between two charges, ask what a single charge
does to the space around it:

$$\vec E = \frac{\vec F}{q_0} \qquad\Longrightarrow\qquad E = k\frac{|q|}{r^2}$$

**Why bother.** Coulomb's law needs two charges to say anything. The field is a
property of the source alone, defined everywhere, whether or not anything is
there to feel it. Compute it once and every subsequent question — what force on
a proton here, an electron there — is one multiplication.

The field also stops being a bookkeeping device when things move: changes in it
propagate at the speed of light, so the field carries energy and momentum of its
own. That is beyond this course, and it is the reason fields are taken seriously
rather than treated as a convenience.

:::note
$\vec E$ points the way a **positive** test charge would be pushed: away from
positive source charges, towards negative ones. For a negative charge placed in
the field, the force is opposite to $\vec E$.

This convention accounts for a large fraction of sign errors in E&M, and it is
worth restating on every problem rather than recalled at speed.
:::

## Continuous distributions

Real objects are not point charges. For a rod, ring or sheet, chop the object
into pieces $dq$, write the field of one piece, and integrate:

$$\vec E = \int d\vec E = \frac{1}{4\pi\varepsilon_0}\int\frac{dq}{r^2}\hat r$$

This is the calculus that makes it Physics C rather than Physics 2, and the
structure is always the same:

1. Choose $dq$ and express it via a density — $\lambda\,dx$ for a line,
   $\sigma\,dA$ for a surface.
2. Write $dE$ from that piece, with its distance and direction.
3. **Use symmetry to kill components before integrating.**
4. Integrate over the object.

Step 3 is where the work is saved. For a point on the axis of a uniformly
charged ring, every piece has a partner directly opposite whose perpendicular
contribution cancels it exactly — so only the axial component survives, and one
integral replaces two.

$$E_{\text{axis}} = \frac{1}{4\pi\varepsilon_0}\frac{qz}{(z^2+R^2)^{3/2}}$$

```math verify
# assume: R > 0
lim z->oo z/(z**2 + R**2)**(3/2)*(z**2)= 1
```

That limit is the check every derived field should get: **far away, any bounded
charge distribution looks like a point charge.** Multiplying the ring's field by
$z^2$ and letting $z\to\infty$ gives a constant, which is exactly the statement
that $E$ falls off as $\tfrac{1}{z^2}$ out there. A derived field that fails
this test is wrong, and the test costs nothing.

## Field and potential

Potential is to field what potential energy was to force, and the relationship
is the same derivative:

$$E_x = -\frac{dV}{dx} \qquad\qquad V = -\int \vec E\cdot d\vec l$$

```math verify
# assume: k > 0, q > 0
d/dx (k*q/x) = -k*q/x**2
```

That verified line is the whole relationship for a point charge: potential
$V = \tfrac{kq}{r}$, and its negative derivative is $\tfrac{kq}{r^2}$, which is
the field. Note the powers — **potential falls off as $\tfrac1r$, field as
$\tfrac{1}{r^2}$** — and that differentiating is what takes you from one to the
other.

Potential is usually the easier route, because it is a **scalar**. Superposing
potentials means adding numbers; superposing fields means adding vectors. Where
a problem offers both routes, take the potential and differentiate at the end.

:::quiz
{
  "question": "Two equal positive charges sit at (−a, 0) and (a, 0). What is the electric field at the origin?",
  "options": [
    {
      "text": "Zero, because the two contributions are equal and opposite",
      "correct": true,
      "why": "Each pushes a positive test charge away from itself, so one points in +x and the other in −x with equal magnitude. They cancel. Note the potential there is not zero — it is the sum of two positive scalars."
    },
    {
      "text": "2kq/a², pointing in the +x direction",
      "correct": false,
      "why": "This adds the magnitudes and ignores direction. Field is a vector; two equal vectors pointing opposite ways sum to zero, not to twice either."
    },
    {
      "text": "Zero, because the potential there is zero",
      "correct": false,
      "why": "The conclusion is right but the reasoning is not, and the premise is false: the potential is 2kq/a, decidedly nonzero. Field is the negative gradient of potential, so a nonzero potential with zero slope gives zero field."
    },
    {
      "text": "kq/a², pointing towards the nearer charge",
      "correct": false,
      "why": "Neither charge is nearer — the origin is equidistant — and the field of a positive charge points away from it, not towards it."
    }
  ]
}
:::

:::recap
- $F = k\tfrac{|q_1q_2|}{r^2}$: inverse-square because influence spreads over a
  sphere, and about $10^{36}$ times stronger than gravity.
- Forces superpose as vectors, pair by pair, with no correction terms.
- $\vec E = \tfrac{\vec F}{q_0}$ is a property of the source alone, defined
  whether or not anything is there to feel it.
- For continuous charge: express $dq$ by a density, use symmetry to cancel
  components, then integrate.
- Check any derived field by letting $r\to\infty$ — it must look like a point
  charge.
- $E_x = -\tfrac{dV}{dx}$. Potential goes as $\tfrac1r$, field as
  $\tfrac{1}{r^2}$, and potential is easier because it is a scalar.
:::
