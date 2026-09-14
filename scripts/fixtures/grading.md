---
title: "Answer-grading fixture"
---

Cases with known verdicts, asserted by `verify:grading`. The `no` cases matter
most: a grader that stopped rejecting wrong answers would look like a passing
build, and a grader that rejects right ones destroys its own credibility.

```grade fixture
# reference | mode | yes/no | answer | variables (optional, default x)
x**2/2 | antiderivative | yes | x**2/2
x**2/2 | antiderivative | yes | x**2/2 + C
x**2/2 | antiderivative | yes | x**2/2 + 7
x**2/2 | antiderivative | yes | x*x/2
x**2/2 | antiderivative | no  | x**2
x**2/2 | antiderivative | no  | x**2/2 + x
exp(x)*(x - 1) | antiderivative | yes | (x - 1)*exp(x)
exp(x)*(x - 1) | antiderivative | yes | x*exp(x) - exp(x)
exp(x)*(x - 1) | antiderivative | no  | exp(x)*(x + 1)
2/3 | expression | yes | 2/3
2/3 | expression | yes | 4/6
2/3 | expression | yes | 0.6666666667
2/3 | expression | no  | 3/2
sin(x)**2 + cos(x)**2 | expression | yes | 1
(x + 1)**2 | expression | yes | x**2 + 2*x + 1
(x + 1)**2 | expression | no  | x**2 + 1
1/(x + 2) | expression | yes | (x + 2)**(-1)
pi/2 | expression | yes | pi/2
pi/2 | expression | no  | pi/4
x**2/2 | antiderivative | no  | this is not an expression

# `^` means a power, not Python's bitwise XOR. Without convert_xor these parse
# silently into something else — `a*t^2/2` raises no error and is simply a
# different expression — and every reader who types a caret means a power.
x**2 | expression | yes | x^2
512 | expression | yes | 2^3^2
x**2/2 | antiderivative | yes | x^2/2
x**2 + 2*x + 1 | expression | no | x^2 + 1

# Answers in several variables, which is what a physics problem asks for.
# `v0` is the case worth staring at: SymPy splits any multi-character symbol it
# has not been told about into single letters, so an undeclared `v0` parses as
# v times 0 — the number zero. Initial velocity is the most common symbol in
# mechanics, so these pin the declaration that prevents it.
sqrt(2*g*h) | expression | yes | sqrt(2gh) | g h
sqrt(2*g*h) | expression | no  | sqrt(2*g*g) | g h
g**2 | expression | no  | g*h | g h
a*t + v0 | expression | yes | v0 + a*t | v0 a t
a*t + v0 | expression | no  | v0 | v0 a t
a*t**2/2 + v0*t + x0 | expression | yes | x0 + v0*t + a*t^2/2 | x0 v0 a t
a*t**2/2 + v0*t + x0 | expression | no  | x0 + v0*t + a*t^2 | x0 v0 a t
G*M*m/r**2 | expression | no  | G*M*m/r | G M m r
```
