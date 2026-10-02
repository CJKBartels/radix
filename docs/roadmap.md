# Roadmap

Build order for the polynomial solver. Phases follow dependencies (what has to exist before what) and risk (uncertain work early). This replaces the topic-based order in the proposal's outline.

**Current phase:** 1

**Every phase:** write tests alongside the code, and add a `/log` entry for each design decision. The final paper is assembled from the learning log.

## Phase 0 — Storage format ✅

- One standard sparse polynomial form with exact fraction coefficients. See the learning log entry "How equations are stored".

## Phase 1 — Research that blocks building

- ✅ Language for the math: JavaScript. Pivot a single solver to C++/WebAssembly only if a realistic input takes over about a second (see learning log).
- Evaluate parser libraries against concrete inputs: implicit multiplication (`2x`, `3(x+1)`), `^`, `=`, and decimals. The only requirement is that it outputs a tree the converter can read.
- Decide how answers are stored: exact roots (`√2`), complex numbers, approximations, and the exact/approximate toggle.
- Research methods for non-linear systems (for example resultants, Gröbner bases). This is the riskiest part of the project, so it's researched now even though it's built last. Prefer a method that reuses the one-variable solvers.

## Phase 2 — Core math (no UI)

- `Fraction`: exact arithmetic on `BigInt` numerator/denominator.
- `Polynomial`: add, multiply, raise to a power, degree. Coefficients are reached only through `Fraction` functions.
- Converter: parser tree → `Polynomial` (moves everything to one side, then expands).

## Phase 3 — Walking skeleton

- A minimal Vue page: type an equation → parse → convert → solve linear and quadratic in one variable → display the answer.
- Rough, but connected from input box to displayed answer. Every later phase adds to a working app.

## Phase 4 — One variable, approximate

- Complex number type.
- Muller's Method with deflation (divide out each root once found).
- After this phase, every one-variable polynomial gets an answer. It's the safety net for the rubric's main category.

## Phase 5 — One variable, exact, plus the toggle

- Fraction roots (rational root theorem), factoring found roots out, exact radical output, factored-form display.
- Logic that decides whether an exact answer is possible.
- Exact/approximate toggle, with tests that both modes agree.

## Phase 6 — Linear systems

- Gaussian elimination with exact fractions.
- Detect "no solution" and "infinitely many solutions".
- UI for entering more than one equation.

## Phase 7 — Non-linear systems

- Build the method chosen in phase 1, reusing the one-variable solvers where possible.

## Phase 8 — Wrap-up

- Testing focused on the solver's limits, and a limitations write-up.
- Assemble the paper from the learning log.
- Defense preparation.
