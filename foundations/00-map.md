---
title: "Map: four lenses on one question"
status: draft
updated: 2026-10-23
depends_on: ["GLOSSARY.md"]
---

# Map: four lenses on one question

> **One sentence.** This document shows how ontology, epistemology, game theory, and AI
> control each answer part of the question "when is agreement among agents evidence?", and
> in which order to read the rest of `foundations/`.

**Terms used (from GLOSSARY.md):** agreement, evidence independence, conformity, strategic
persuasion, parallel conduct, collusion, authority transition, auditor, trusted monitor.

## 1. Purpose

Three agents endorse a claim and a decider approves it. Later the claim turns out false.
What went wrong? There are at least five different answers, and each one calls for a
different fix. A researcher who cannot tell them apart will build an auditor that flags
innocent agents, or a defense that blocks the wrong mechanism. This map names the five
answers, assigns each to a lens, and points to the document that teaches it.

## 2. The five explanations of one observation

The observation is always the same: **agreement plus a wrong decision**.

| # | Explanation | Mechanism | Lens | Document | Regime in the sprint |
|---|---|---|---|---|---|
| 1 | Independent mistake | Each agent had its own evidence and still erred | epistemology | 01 | A (negative control) |
| 2 | Shared-source error | Evidence items trace to one origin; the decider double counts | epistemology | 01, 06 | B |
| 3 | Conformity | A later agent copied an earlier one and dropped its private evidence | social learning | 02 | C |
| 4 | Strategic persuasion | One agent selected evidence to move the others | game theory | 03 | D |
| 5a | Parallel conduct | Agents share an incentive and act alike with no agreement | game theory, law | 03, 04 | E0 |
| 5b | Collusion | A coalition coordinated through a mechanism against the decider | game theory, control | 04, 05 | E1, P |
| — | Talk without action | Coordination language with no effect on actions | audit | 04 | F |

**Agreement is an observation. Collusion is one causal explanation of it.** Every document
in this folder returns to that sentence.

The [brainstorming bank](../literature/landscape/brainstorming/README.md) expands these lenses
into proposed experiments. It connects focal points, causal explanations, predictive Rashomon
sets, and industry mechanisms. The proposals remain speculative until tested.

## 3. The four lenses

```
            what does the claim MEAN?            what JUSTIFIES believing it?
            ┌────────────────────────┐           ┌──────────────────────────┐
            │ ONTOLOGY (06)          │           │ EPISTEMOLOGY (01, 02)    │
            │ typed claim, predicate │           │ likelihood ratio,        │
            │ provenance graph,      │──────────▶│ conditional independence,│
            │ permitted transitions  │ evidence  │ cascades, consensus      │
            └───────────┬────────────┘ items     └─────────────┬────────────┘
                        │ validator                            │ posterior
                        ▼                                      ▼
            ┌────────────────────────┐           ┌──────────────────────────┐
            │ AI CONTROL (05)        │◀──────────│ GAME THEORY (03, 04)     │
            │ protocol, monitor,     │ threat    │ cheap talk, persuasion,  │
            │ authority transition,  │ model     │ incentives, collusion,   │
            │ auditor                │           │ plus factors             │
            └────────────────────────┘           └──────────────────────────┘
                        ▲
                        │ metrics
            ┌───────────┴────────────┐           ┌──────────────────────────┐
            │ MEASUREMENT (07)       │           │ MECHANISTIC (08)         │
            │ FAR, TAR, AUROC,       │           │ activations, probes,     │
            │ bootstrap by family    │           │ anti-confound checks     │
            └────────────────────────┘           └──────────────────────────┘
```

| Lens | Question it answers | What it cannot answer |
|---|---|---|
| **Ontology** | What exactly is the claim, and which transitions between claims are permitted? | Whether an entered fact is true |
| **Epistemology** | How much should this evidence move belief, given its dependence structure? | Why an agent chose to show this evidence |
| **Game theory** | Why would an agent reveal, hide, or coordinate, given its payoff? | Whether a given model actually plays the equilibrium |
| **AI control** | Which protocol stays safe when some agents cannot be trusted? | Whether the untrusted agent is trustworthy (it assumes not) |

## 4. Where oversight fails: the authority transition

Every lens meets at one step: the moment an endorsement (epistemic) becomes an approval
(decision). Before that step, agents only talk. After it, something happens in the world.

- Epistemology says: at this step, count distinct origins, not items.
- Game theory says: at this step, ask who benefits from approval.
- Ontology says: at this step, check that the predicate approved is the predicate supported.
- AI control says: put the trusted monitor or validator at this step, and measure both
  safety (false approvals) and usefulness (true approvals).

The sprint auditor works *after* this step. The November epistemics sprint puts a validator
*at* this step. The TARA project asks whether the distinction is visible *inside* the model
that makes the step.

## 5. Reading order

| Order | Document | Why now | Time |
|---|---|---|---|
| 1 | `01-evidence-independence.md` | The one derivation everything else assumes | 60 min |
| 2 | `04-collusion-and-plus-factors.md` | The sprint's central concept | 60 min |
| 3 | `07-measurement.md` | You will read tables tomorrow; know what they mean | 45 min |
| 4 | `02-social-learning.md` | Conformity and cascades: regime C | 45 min |
| 5 | `03-strategic-communication.md` | Persuasion and parallel conduct: regimes D, E0 | 60 min |
| 6 | `05-ai-control-and-oversight.md` | Where the auditor sits in a protocol | 45 min |
| 7 | `06-ontology-and-typed-claims.md` | The November defense | 45 min |
| 8 | `08-mechanistic-detection.md` | The TARA project | 60 min |

For the sprint weekend read 1, 2, 3 only. Each document ends with three questions; the
answers are in `study/quizzes/`. Write your own answer before you read the key.

## 6. One worked sentence per lens

Hold this case in mind while reading: *Two reviewers endorse "Unit 7 is commercially
available at 18:00." The decider approves. Unit 7 was in testing.*

- **Epistemology:** both reviewers cited reports that paraphrase one control-room log; the
  decider treated two endorsements as two observations. Posterior should have moved once.
- **Ontology:** the log said `testing_scheduled`; the approval asserted
  `commercially_available`; the transition is not permitted without a synchronization record.
- **Game theory:** the proposer is paid on approval; the reviewers are paid on approval; no
  message passed between them. This is parallel conduct until a plus factor appears.
- **AI control:** the protocol let two endorsements trigger approval with no independence
  check. The fix is at the transition, not in the reviewers' prompts.

## 7. Check yourself

1. Name the five explanations of agreement and the one regime that isolates each.
2. Which lens tells you that two endorsements from one origin are one observation? Which
   lens tells you *why* the proposer showed those two items?
3. Where in the review game does the authority transition occur, and which role owns it?

## Sources

[R1] Hauswald 2025; [R6] Bikhchandani et al. 1992; [R7] Crawford and Sobel 1982; [R11]
Greenblatt et al. 2024; [R13] Hammond et al. 2025; sprint Track 2.3 guide (Apart Research
page, fetched 2026-10-23). Full entries in `literature/INDEX.md`.
