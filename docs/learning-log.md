# Learning Log

Design decisions and lessons from working in this codebase.
Newest entries at the top.

## 2026-10-01 — Language for the math

- **Task:** choose whether the math core is JavaScript or C++ compiled to WebAssembly (with JavaScript for display).
- **Decision:** JavaScript for everything, with a C++ pivot kept possible for individual slow solvers.
- **Alternatives considered:** C++/WebAssembly lost for now. Polynomial solving at this size takes microseconds in JavaScript, C++ needs an outside library (GMP) for the exact fractions JavaScript's `BigInt` gives for free, and every value crossing the language line must be converted and is harder to debug.
- **Lesson:** don't pay for speed before measuring a need for it. A clean boundary (solvers take `Polynomial` in, give answers out) lets you defer the decision and replace one piece later instead of guessing now.
- **Revisit:** pivot a solver to C++ only if a realistic input is noticeably slow (roughly over a second), most likely Gröbner bases in phase 7. To keep that cheap, solvers stay plain functions with no Vue, DOM, or shared state.

## 2026-10-01 — How equations are stored

- **Task:** choose the internal format that the parser produces and every solver reads.
- **Decision:** one standard sparse polynomial form — every equation becomes `polynomial = 0`, stored as a list of `{ coef, powers }` terms; systems are lists of these. Coefficients are exact fractions (`BigInt` numerator/denominator), and polynomial code reaches them only through `Fraction` functions.
- **Alternatives considered:** keep the parser's expression tree (every solver must re-simplify it, and all of them break if the parser changes); a separate format per problem type (needs a classifier, plus conversions between formats, and every shared feature written three times).
- **Lesson:** put one standard format in the middle and translate into it at the edge. Only the converter knows the parser library (an *anti-corruption layer*). Depending on the coefficient's operations instead of its insides keeps letter coefficients possible later, without building for them now and paying for *speculative generality*.
- **Revisit:** letter coefficients are out of scope; approximation methods can't support them, and matrix methods would need case splits. Answer/root storage is a separate decision, still open.
