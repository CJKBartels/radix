# Roadmap

Build order for the polynomial solver. Phases follow dependencies (what has to exist before what) and risk (uncertain work early). This replaces the topic-based order in the proposal's outline.

**Current phase:** 1

**Every phase:** write tests alongside the code, and add a `/log` entry for each design decision. The final paper is assembled from the learning log.

## Open questions

- **Why build a solver when libraries (Compute Engine, math.js) already solve polynomials?** Write a one-to-two sentence answer for the paper's introduction and the defense.
- **How do users enter math:** a plain text box, or a visual editor like MathLive? This is half of the rubric's research category. Decide by the end of phase 3.
- **Keeping repeat counts:** square-free factorization turns `(x − 1)^2` into "1, once". Decide how the chain keeps multiplicities before phase 5.
- **Nested radicals and the cubic formula:** decide together, since they share the simplifier cost. Until then, substitution tricks stay limited to answers in shapes we already handle.

## Phase 0 — Storage format ✅

- One standard sparse polynomial form with exact fraction coefficients. See the learning log entry "How equations are stored".

## Phase 1 — Research that blocks building

- ✅ Language for the math: JavaScript. Pivot a single solver to C++/WebAssembly only if a realistic input takes over about a second (see learning log).
- 🔶 Evaluate parser libraries against concrete inputs: implicit multiplication (`2x`, `3(x+1)`), `^`, `=`, and decimals. The only requirement is that it outputs a tree the converter can read. math.js passes (see learning log); next, run the same inputs through Compute Engine, then decide.
- Decide how answers are stored: exact roots (`√2`), complex numbers, approximations, and the exact/approximate toggle.
- ✅ One-variable solve chain: square-free factorization → Rational Root Theorem + deflation loop → by degree left: 0 done, 1 `−b/a`, 2 quadratic formula, 3+ Muller (see learning log).
- ✅ Scope per problem type: one variable Tier 2, linear systems Tier 3, non-linear systems resultants with Gröbner bases as a goal (see learning log).
- Research methods for non-linear systems: resultants (chosen) and Gröbner bases (goal). This is the riskiest part of the project, so it's researched now even though it's built last. The research should say whether Gröbner looks realistic; if not, iterated resultants are the fallback.

## Phase 2 — Core math (no UI)

- `Fraction`: exact arithmetic on `BigInt` numerator/denominator.
- `Polynomial`: add, multiply, raise to a power, degree, divide with remainder, derivative, GCD (Euclid's algorithm). Coefficients are reached only through `Fraction` functions, so approximate coefficients can be swapped in later for back-substitution.
- Converter: parser tree → `Polynomial` (moves everything to one side, then expands).

## Phase 3 — Walking skeleton

- A minimal Vue page: type an equation → parse → convert → solve linear and quadratic in one variable → display the answer.
- Rough, but connected from input box to displayed answer. Every later phase adds to a working app.

## Phase 4 — One variable, approximate

- Complex number type.
- Muller's Method with deflation (divide out each root once found).
- After this phase, every one-variable polynomial gets an answer. It's the safety net for the rubric's main category.

## Phase 5 — One variable, exact, plus the toggle

- Square-free factorization, fraction roots (rational root theorem), factoring found roots out, exact radical output, factored-form display.
- Substitution tricks (`y = x^2`), limited to answers in shapes we already handle.
- Logic that decides whether an exact answer is possible.
- Exact/approximate toggle, with tests that both modes agree.

## Phase 6 — Linear systems

- Gaussian elimination with exact fractions.
- Detect "no solution" and "infinitely many solutions" (rank check).
- Parametric answers for the infinite case (`x = 1 − t, y = t`).
- UI for entering more than one equation.
- Showing the elimination steps: built last, after phase 7's resultants work.

## Phase 7 — Non-linear systems

- Resultants for 2 equations in 2 unknowns, handing the result to the one-variable chain, then back-substituting and dropping fake solutions.
- Gröbner bases for 3+ variables (committed goal). Fallback if it slips: iterated resultants.

## Phase 8 — Wrap-up

- Testing focused on the solver's limits, and a limitations write-up.
- Stretch goal: custom parser, swapped in behind the converter.
- Stretch goal: cubic formula, if nested radicals were accepted.
- Assemble the paper from the learning log.
- Defense preparation.
