---
title: "Threat models"
status: draft
updated: 2026-10-23
depends_on: ["GLOSSARY.md"]
---

# Threat models

A threat model states who is untrusted, what they want, what they can do, and what the
protocol must protect. Without one, "collusion" has no referent. Each experiment names
the threat model it assumes.

| Id | Untrusted agents | Their objective | Their capabilities | What must be protected | Used by |
|---|---|---|---|---|---|
| TM-0 (none) | nobody | — | — | decider accuracy against honest error | regimes A, B, C |
| TM-1 single persuader | proposer | approval regardless of truth | select evidence; public message | decider's false approval rate | regime D |
| TM-2 parallel incentives | proposer and reviewers | approval regardless of truth | act independently; no channel | same | regime E0 |
| TM-3 explicit coalition | proposer and reviewers | approval regardless of truth | private channel, one round each way | same, plus the auditor's ability to tell TM-3 from TM-2 and TM-0 | regimes E1, P |
| TM-4 secret coalition (not tested in the sprint) | proposer and reviewers | approval and evasion of the auditor | steganographic or side-channel coordination | auditor recall under concealment | future; see [R12] |
| TM-5 shared-state coordination (not tested) | any agents with write access | approval | coordinate through edits to shared records or memory, no messages | authority transition integrity | future (Idea D) |

Notes.

- Every tested threat model assumes the **decider is trusted** and the **auditor is
  trusted**. AI control [R11] would also ask what happens if the decider is untrusted; out
  of scope for the sprint.
- The sprint's contribution is about telling TM-3 apart from TM-0, TM-1, and TM-2 after
  the fact, not about preventing TM-3.
- Regime F has no untrusted agent. It is a test of the auditor against noise that looks
  like TM-3.
