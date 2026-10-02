# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working agreement: this project is for learning

The developer is building this to learn, and wants the finished work to be
their own. Efficiency is welcome only where it doesn't do the learning for
them. This section overrides the global "Explain-Then-Build" contract and
the /design skill wherever they conflict.

- **Design decisions: the developer proposes first.** Ask for their approach
  and reasoning before offering any. Then critique it: point out gaps,
  tradeoffs they missed, and inputs that break it. Suggest an alternative
  only if their approach has a real problem, and say what the problem is.
- **Code is split by type.**
  - The developer writes the math core and every solver: `Fraction`,
    `Polynomial`, the converter, and all solving methods. Don't write this
    code, even partly. Review it when asked.
  - Claude may write plumbing: project setup, build config, test setup,
    and basic Vue layout.
  - If it's unclear which side something falls on, ask.
- **When the developer is stuck, give escalating hints.** In order: a guiding
  question, then a hint, then a pointer to the exact spot or concept. Give
  the full answer only when they ask for it directly.
- **Research: the developer goes first.** They read the sources and bring
  findings. Claude checks them, corrects mistakes, and points out what was
  missed. Don't hand them a summary of a method they haven't read about yet.

## Current state

There is no code yet. The repo holds only the planning documents:

- `docs/2026-10-01-honors-project-proposal.md` — what will be built and the planned phases.
- `docs/2026-10-01-honors-project-evaluation.md` — how the committee will grade it.
- `docs/learning-log.md` — design decisions and lessons, newest first. Entries are added with `/log`.
- `docs/roadmap.md` — build order by phase, with the current phase marked. Follow it over the proposal's outline.

There are no build, lint, or test commands yet. Once the app is scaffolded, replace this section with the real commands (including how to run one test).

## What the project is

An undergraduate honors project: a **polynomial solver web app** that parses polynomial equations typed by the user, simplifies them, and solves them with both symbolic (exact) and numerical (approximate) methods.

Planned stack: **JavaScript + Vue**. The math is JavaScript too. A slow solver may later be rewritten in C++ compiled to WebAssembly, so solvers must stay plain functions (`Polynomial` in, answer out) with no Vue, DOM, or shared state. For parsing input, use a third-party math parser if one fits. Write a custom parser only if none does. This choice is itself graded (see below), so record why a parser was picked or rejected.

## Required capabilities (from the grading rubric)

The "app works" criterion (30%) names these problem classes. Treat them as the scope:

1. Polynomials in one variable — solved **exactly**, and by **numerical approximation**.
2. Linear polynomial systems in several variables (planned: matrix methods).
3. Non-linear polynomial systems in several variables (method still to be researched).

Specific features from the proposal:

- Muller's Method for numerical roots. It is chosen because it finds **complex** roots, so the number type must support complex values.
- A user toggle between exact-value output and numerical output.
- Symbolic simplification, factoring, and expansion.
- Logic that decides whether a problem can be solved exactly or needs numerical approximation.

## Architecture direction

The proposal implies these boundaries. Keep them separate so the math can be tested without the UI:

- **Parser** — text in, internal equation representation out.
- **Internal representation** — the polynomial/system data model shared by everything else. Decide this early; every other part depends on it.
- **Solvers** — symbolic and numerical, as plain JS with no Vue dependency.
- **Vue UI** — input, the exact/numerical toggle, and result display only.

## Grading weights that should shape the work

- Research quality — 30% (solving methods; methods for entering math).
- Quality of applying the research — 20% (choice of language, parser, front end).
- App works and solves significant problems — 30%.
- Presentation — 20%.

Half the grade is about research and justified choices, not code. When a design decision is made (parser, number representation, solving method), write down the alternatives and the reason. The final deliverables also include documentation and a written paper on the methods, the design process, and the solver's limits.
