# Radix

A web app that solves polynomial equations. You type an equation, and Radix simplifies it and finds its roots, exactly when it can (`x = 1/2`, `x = ±√2`) and numerically when it can't.

Radix is my undergraduate honors project. It's built from scratch to learn the math behind it, so the solvers don't call a computer algebra library.

## Status

Early. The exact-arithmetic core is in place: fractions, terms, and polynomials with add, subtract, multiply, and long division. There's no UI or parser yet. [docs/roadmap.md](docs/roadmap.md) has the build order and marks the current phase.

## What it will solve

| Problem | Method | Answer |
|---|---|---|
| One variable, like `2x³ − x² − 4x + 2 = 0` | square-free decomposition, rational root theorem, quadratic formula, then Muller's method for what's left | exact where possible, numeric otherwise, with a toggle between the two |
| Linear systems | Gaussian elimination with exact fractions | one solution, none, or a parametric family (`x = 1 − t, y = t`) |
| Non-linear systems | resultants, with Gröbner bases as the goal | reduces to the one-variable case |

Muller's method finds complex roots, so answers can be complex numbers. Some equations have no exact answer in radicals at all (`x⁵ − x − 1 = 0`, by the Abel–Ruffini theorem), and those always get a numeric one.

## Getting started

You need Node.js. Then:

```
npm install
npm run dev
```

The app runs at http://localhost:5173.

## Commands

```
npm test              # run all tests, re-running on every save
npx vitest run        # run all tests once
npm run typecheck     # check TypeScript types (tests and the dev server skip this)
npm run lint          # run ESLint
npm run build         # typecheck, then build into dist/
```

## Project layout

```
src/math/     the math core and solvers: plain TypeScript, no Vue
src/App.vue   the UI
docs/         proposal, roadmap, and the learning log
spikes/       throwaway experiments, kept outside the app
```

The math has no UI imports, so it's tested on its own and any single solver could later move to C++ compiled to WebAssembly if it turns out too slow.

## Built with

TypeScript, Vue, Vite, and Vitest. Fractions use JavaScript's `BigInt`, so coefficients stay exact at any size.

## Design decisions

Every decision, with the alternatives and why they lost, is in [docs/learning-log.md](docs/learning-log.md). The final paper is built from it.
