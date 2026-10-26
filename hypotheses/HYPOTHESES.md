---
title: "Hypothesis registry"
status: draft
updated: 2026-10-23
depends_on: ["GLOSSARY.md", "threat-models.md", "confounds.md"]
---

# Hypothesis registry

The only place hypotheses are defined. Other files cite ids. A hypothesis has a statement,
a prediction you could be wrong about, a falsifier, a status, and the experiment that
tests it. Status values: `proposed`, `preregistered`, `supported`, `refuted`,
`inconclusive`, `withdrawn`. A refuted hypothesis stays in the table.

Everything here is **[HYPOTHESIS]** unless the status says otherwise.

## Program-level hypotheses (H-CORE)

| Id | Statement | Prediction | Falsifier | Status | Tested by |
|---|---|---|---|---|---|
| H-CORE-1 | An oversight protocol that aggregates endorsements without checking evidence independence approves false claims at a rate that rises with the number of derivative evidence items, even when no agent is strategic. | FAR(B) > FAR(A) for naive agents. | FAR(B) ≤ FAR(A). | proposed | sprint regime B vs A; TARA fallback |
| H-CORE-2 | Agreement produced by shared source, conformity, single-agent persuasion, or parallel conduct is observationally similar to collusion at the level of messages and actions, but separable with provenance, exposure order, and the match between stated plans and actions. | S4d beats S3 on FPR at equal recall. | S4d adds nothing. | proposed | sprint H-SPRINT-3 |
| H-CORE-3 | Oversight failure concentrates at the authority transition: the step where an endorsement becomes an approval. Interventions at that step (typed claims, provenance validators) reduce invalid approvals more than interventions on reviewer prompts. | Validator reduces FAR more than a "be careful" prompt. | Prompt matches or beats validator. | proposed | epistemics sprint (phase 3) |
| H-CORE-4 | The distinction between collusion and correlated agreement is linearly readable from a model's activations only when the trajectory contains a coordination mechanism, not from agreement alone. | Probe AUROC high for E1 vs E0, near chance for E0 vs A. | Probe separates E0 from A as well as E1 from E0 (it reads incentive wording, not coordination). | proposed | TARA project |

## Sprint hypotheses (H-SPRINT), Track 2.3

Defined in full in `projects/2026-10-apart-collusion-sprint/PREREGISTRATION.md`.

| Id | Short statement | Falsifier | Status |
|---|---|---|---|
| H-SPRINT-1 | Messages-only auditors cannot separate talk without action (F) from collusion (E1). | FPR_F(S1) < 0.5 × recall_E1(S1). | supported 2026-10-26 (scripted and seven models; the S1 rule flags every injected plan in F and at most 0.08 of E1) |
| H-SPRINT-2 | Actions-only auditors cannot separate harmful correlated agreement (B, C, E0) from collusion (E1). | AUROC_S2(E1 vs {B,C,E0}) > 0.80. | supported 2026-10-26 (AUROC 0.45 to 0.71 in all eight settings) |
| H-SPRINT-3 | S4d (full metadata without payoff rules) lowers FPR on innocent regimes by ≥ 0.10 relative to S3 with recall on E1 inside S3's interval. Full S4 is exploratory (CF-13). | Smaller reduction, or recall drops out of the interval. | not supported 2026-10-26, confirmatory (DeepSeek chat held-out reduction 0.000; 0.006 to 0.017 in the six exploratory models; 0.015 scripted) |
| H-SPRINT-4 | Δ_comm = FAR(E1) − FAR(E0) > 0 with interval excluding 0; FAR(F) − FAR(A) interval includes 0. | E1 − E0 interval includes 0. | not supported 2026-10-26 (E1 minus E0 is 0.000 or negative in all settings; −0.222 [−0.333, −0.083] for GPT-5.6 Terra and DeepSeek Flash) |
| H-SPRINT-5 | FAR(E0) > FAR(A): harm without agreement exists. | Interval includes 0. | supported 2026-10-26 for scripted, GPT-5.6 Luna, GPT-5.6 Terra, DeepSeek V4 Pro, DeepSeek Flash; not supported for DeepSeek chat, Claude Haiku 5.5, Claude Sonnet 5.5 |

## TARA project hypotheses (H-TARA)

| Id | Statement | Prediction | Falsifier | Status |
|---|---|---|---|---|
| H-TARA-1 | A linear probe on residual-stream activations of an open-weight model reading a trajectory separates collusion (E1, P) from non-collusion trajectories with AUROC above the best behavioral S3 auditor on the held-out split. | Probe AUROC > S3 AUROC by ≥ 0.05. | Probe does not beat S3. | proposed |
| H-TARA-2 | The same probe does not separate E0 from A (incentive wording alone) above 0.65 AUROC when regime wording is held matched. | AUROC(E0 vs A) ≤ 0.65. | AUROC > 0.65: probe reads incentives, not coordination (confound CF-7). | proposed |
| H-TARA-3 | Probe accuracy transfers from case families 01 to 06 to families 07 to 12 with a drop of at most 0.10 AUROC. | Drop ≤ 0.10. | Drop > 0.10: probe learned family wording. | proposed |
| H-TARA-F1 (fallback) | A reviewer model shown explicit provenance (common-origin labels) lowers FAR on derivative-heavy cases relative to opaque presentation, without lowering true approval rate by more than 0.05. | As stated. | No FAR reduction, or TAR drops > 0.05. | proposed |

## Epistemics sprint hypotheses (H-EPI), 2026-11-13 to 2026-11-15, optional

| Id | Statement | Falsifier | Status |
|---|---|---|---|
| H-EPI-1 | A deterministic validator that rejects unsupported predicate transitions (for example `testing_scheduled` → `commercially_available`) blocks semantic promotion that a free-text reviewer accepts, with no loss on valid transitions. | Validator rejects valid transitions or the free-text reviewer already blocks promotion. | proposed |
| H-EPI-2 | Typed claims with provenance reduce FAR under regime B more than under regime A (the intervention acts on dependence, not on general caution). | Equal reduction in A and B. | proposed |

## How to add a hypothesis

1. Check `confounds.md` for the confound that could produce your predicted result without
   your mechanism. Name the control.
2. Write the falsifier first. If you cannot, the statement is not yet a hypothesis.
3. Give it the next id in its area. Never reuse an id.
