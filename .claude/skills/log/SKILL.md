---
name: log
description: Add an entry to docs/learning-log.md for a design decision or lesson that just settled in this project. Use when the developer types /log, or says yes after being offered a log entry.
---

# Add a learning-log entry

The learning log (`docs/learning-log.md`) is the project record. The final
paper and the defense presentation are assembled from it, so every entry
must be readable on its own months later, by someone who wasn't in the
session.

This is separate from the vault (`Ravings Of A Mad Man`). The vault holds
general concepts with no project details. The log holds this project's
specific decisions, with the alternatives and the reasons.

## Steps

1. Work out what was decided in this session. If more than one decision
   settled, propose one entry per decision. If nothing settled yet, say so
   and don't write an entry.
2. Draft the entry in the format below and show it to the developer.
   **Don't write to the file yet.**
3. Apply the developer's edits. Write only after they approve.
4. Insert the entry at the top of the entries, directly under the intro
   paragraph (newest first).

## Entry format

```markdown
## YYYY-MM-DD — <Short topic> (add "(tentative)" if it may still change)

- **Tags:** <one or more tags from the list below, comma-separated>
- **Task:** what had to be decided, in one sentence.
- **Decision:** what was chosen, plus the concrete facts behind it (tests run, inputs tried, numbers measured).
- **Alternatives considered:** each alternative and the specific reason it lost.
- **Lesson:** the general idea worth keeping. Name the pattern in italics (*anti-corruption layer*) after showing what it is.
- **Revisit:** what's still open, and what would make us change this decision.
```

## Tags

Tags say which part of the paper and grading rubric an entry feeds (see
`docs/2026-10-01-honors-project-evaluation.md`). An entry can have several.

| Tag | Use for | Rubric |
|---|---|---|
| `research-solving` | how a solving method works, and why it was picked | 1.1 |
| `research-input` | how users type math, and parsing approaches | 1.2 |
| `choice-language` | programming language choices | 2.1 |
| `choice-parser` | which parser was picked or rejected | 2.2 |
| `choice-frontend` | Vue and UI choices | 2.3 |
| `design` | internal architecture: data model, module boundaries | paper: program design |
| `limits` | what the solver can't do, and why | paper: limitations |

Don't invent new tags in an entry. If none fits, tell the developer and
suggest adding one to this table.

## Writing rules

- Record only what actually happened in the session. Don't fill a field
  with a guess. If a field is unknown, ask.
- Plain words, one idea per sentence. Define any term the paper's reader
  might not know.
- Keep each field to a few sentences. The paper expands it later.
