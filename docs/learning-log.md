# Learning Log

Design decisions and lessons from working in this codebase.
Newest entries at the top.

## 2026-10-05 — Scope: target tier per problem type

- **Tags:** research-solving, limits, design
- **Task:** decide how far to take each problem type, weighing difficulty, time before graduation, and how reliably the app solves what users type.
- **Decision:** One variable: Tier 2. That's the Rational Root Theorem with deflation, the quadratic formula, square-free factorization, and substitution tricks (e.g. `y = x^2`) limited to cases whose answers stay in shapes we already handle. Muller's method is required on top. Linear systems: Tier 3. That's Gaussian elimination with exact fractions, a rank check for 0/1/infinitely many solutions, parametric answers (`x = 1 − t, y = t`), and showing the steps, which is built last because it's UI polish. Non-linear systems: resultants (eliminate a variable from 2 equations in 2 unknowns), with Gröbner bases as a committed goal. If Gröbner slips, iterated resultants (eliminate one variable at a time) give a rougher 3-variable path.
- **Alternatives considered:** Newton's method for systems (one solution per starting guess and can miss solutions; not needed for approximate output, because resultants hand off to the one-variable chain, which already has Muller). Gröbner as a hard requirement with no fallback (rough odds ~35%, and it's built in the last phase). One-variable Tier 3, i.e. the cubic formula and Kronecker factoring (new answer shapes like cube roots and nested radicals that the simplifier would have to handle). Accepting nested radicals now (deferred, see Revisit).
- **Lesson:** substitution and resultants both turn a system into one-variable polynomials, so the one-variable chain does the work for two problem types. Those polynomials tend to be high degree (two quadratics give degree 4), so effort on Muller pays off more than effort on the cubic formula. *Reduce a new problem to one you've already solved*, then make the shared piece solid.
- **Revisit:** the Phase 1 non-linear research decides whether Gröbner looks realistic. Back-substituting an approximate root gives a polynomial with approximate coefficients, which only Muller can handle, so `Polynomial` must accept non-`Fraction` coefficients on the approximate path. Decide nested radicals and the cubic formula together, since they share the simplifier cost.

## 2026-10-05 — One-variable solve chain

- **Tags:** research-solving, limits
- **Task:** choose the order of the exact methods for one variable, and when to hand off to Muller's method.
- **Decision:** 1) Square-free factorization always runs first: divide `p` by `gcd(p, p')`, with the GCD found by Euclid's algorithm, so later steps see each root once. 2) Rational Root Theorem + deflation as one loop: clear denominators to get integer coefficients; test each `p/q` candidate with synthetic division; a leftover of 0 means it's a root, and the quotient is the smaller polynomial. 3) What's left goes by degree. Degree 0: done (if the input itself was constant, the answer is "no solution" for `5 = 0` or "every number" for `0 = 0`). Degree 1: `x = −b/a`. Degree 2: the quadratic formula, always the general path, with the simplifier cleaning up. Degree 3+: Muller. Worked by hand: `2x^3 − x^2 − 4x + 2` gives `1/2, ±√2`. `x^4 − 4x^2 + 4` has no rational roots, but `gcd(p, p') = x^2 − 2` exposes it.
- **Alternatives considered:** special-casing easy quadratics like `b = 0` (more branches to test, and the simplifier must handle `(p ± q√d) / r` anyway). Skipping square-free factorization (misses irrational repeated roots like `(x^2 − 2)^2`, and repeated roots slow Muller down). The cubic formula for degree 3 (see the scope entry).
- **Lesson:** Muller isn't only a backup for code we didn't write. By the Abel–Ruffini theorem, some degree-5+ polynomials (e.g. `x^5 − x − 1`) have no exact answer using radicals at all. A degree-n polynomial always has n roots counting repeats. That's an *invariant* (a fact that must always hold), and it makes a cheap test: fewer roots back means something was dropped.
- **Revisit:** square-free factorization loses repeat counts (`(x − 1)^2` comes out as "1, once"); still open. Substitution tricks are limited for now; nested radicals and the cubic formula get decided together.

## 2026-10-02 — Parser: math.js (tentative)

- **Tags:** choice-parser, research-input
- **Task:** check whether math.js can turn typed equations into a tree the converter can read (spike in `spikes/mathjs/`).
- **Decision:** math.js with `number: 'Fraction'` passes every test, so it's the choice unless Compute Engine beats it. Tested: `2x`, `3(x+1)` and `^` work. Decimals stay exact (`0.1` → `1/10`, stored with `BigInt`). math.js reads `=` as assignment, so we split on `=`, parse each side, and subtract. No `=` means simplify/expand/factor. Two or more `=`, and scientific notation, are out of scope and get a clear error message.
- **Alternatives considered:** expr-eval, math-expression-evaluator, Nerdamer, Algebrite, algebra.js (no longer maintained); writing our own parser (a few hundred lines, with tricky cases like `-x^2`, `2^3^2` and implicit multiplication, which delays the solvers when math.js already passes); the default number type (rounds decimals to binary before the converter sees them); moving terms across `=` in the text (doing the parser's job by hand); scientific notation by text rewrite (can't tell `2e3` from `2·e`) or the `BigNumber` setting (a second number type for rarely typed input).
- **Lesson:** exactness lost at the input edge can't be recovered later, so make values exact where they enter. Keep library types at the edge too, and translate them into our own types in the converter (*anti-corruption layer*). That boundary is also what makes swapping the parser later cheap.
- **Revisit:** test Compute Engine (CortexJS, maintained) with the same inputs, especially `0.1` and `=`; use it only to parse, never to solve, though its solver could serve as a *test oracle*. Custom parser is a stretch goal after the core solvers. The converter must reject non-polynomials (`sin(x)`, `1/x`, `x^0.5`).

## 2026-10-01 — Language for the math

- **Tags:** choice-language
- **Task:** choose whether the math core is JavaScript or C++ compiled to WebAssembly (with JavaScript for display).
- **Decision:** JavaScript for everything, with a C++ pivot kept possible for individual slow solvers.
- **Alternatives considered:** C++/WebAssembly lost for now. Polynomial solving at this size takes microseconds in JavaScript, C++ needs an outside library (GMP) for the exact fractions JavaScript's `BigInt` gives for free, and every value crossing the language line must be converted and is harder to debug.
- **Lesson:** don't pay for speed before measuring a need for it. A clean boundary (solvers take `Polynomial` in, give answers out) lets you defer the decision and replace one piece later instead of guessing now.
- **Revisit:** pivot a solver to C++ only if a realistic input is noticeably slow (roughly over a second), most likely Gröbner bases in phase 7. To keep that cheap, solvers stay plain functions with no Vue, DOM, or shared state.

## 2026-10-01 — How equations are stored

- **Tags:** design
- **Task:** choose the internal format that the parser produces and every solver reads.
- **Decision:** one standard sparse polynomial form — every equation becomes `polynomial = 0`, stored as a list of `{ coef, powers }` terms; systems are lists of these. Coefficients are exact fractions (`BigInt` numerator/denominator), and polynomial code reaches them only through `Fraction` functions.
- **Alternatives considered:** keep the parser's expression tree (every solver must re-simplify it, and all of them break if the parser changes); a separate format per problem type (needs a classifier, plus conversions between formats, and every shared feature written three times).
- **Lesson:** put one standard format in the middle and translate into it at the edge. Only the converter knows the parser library (an *anti-corruption layer*). Depending on the coefficient's operations instead of its insides keeps letter coefficients possible later, without building for them now and paying for *speculative generality*.
- **Revisit:** letter coefficients are out of scope; approximation methods can't support them, and matrix methods would need case splits. Answer/root storage is a separate decision, still open.
