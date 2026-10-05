# Learning Log

Design decisions and lessons from working in this codebase.
Newest entries at the top.

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
