# src/math

The math core: `Fraction`, `Polynomial`, the converter, and every solver.

Rule: nothing in this folder imports Vue, touches the DOM, or keeps shared
state. Solvers are plain functions (`Polynomial` in, answer out), so they
can be tested alone and swapped for C++/WebAssembly later if one is slow.

Tests sit next to the file they test: `fraction.ts` → `fraction.test.ts`.
