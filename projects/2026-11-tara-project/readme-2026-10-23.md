---
title: "TARA Round 2 2026 project: reading collusion versus correlated agreement inside a model"
status: draft
updated: 2026-10-23
depends_on: ["GLOSSARY.md", "hypotheses/HYPOTHESES.md", "foundations/08-mechanistic-detection.md", "projects/2026-10-apart-collusion-sprint/README.md"]
---

# TARA project brief

**Program facts (taraprogram.org, fetched 2026-10-23).** TARA (Technical Alignment Research
Accelerator) Round 2 2026: 14 weeks, part-time, ARENA curriculum (neural network
foundations, transformers, mechanistic interpretability, reinforcement learning, model
evaluations). Program started 2026-09-12. Final project presentations 2026-12-12. The final
three weeks are project work with teacher and peer guidance. Certification needs 11 of 14
Saturday sessions and a project presentation.

**Not published:** the topic submission format and due date. **Action:** ask the teacher
for the template and deadline this week, paste both into `TOPIC-SUBMISSION.md` section 0,
and adjust. The project window 2026-11-21 to 2026-12-12 is an inference from "final three
weeks"; confirm it.

## 1. Why this topic

The sprint (2026-10-23 to 2026-10-25) produces labeled trajectories under eight regimes
that differ in exactly one factor each. That dataset is the missing control set for
activation-based collusion detection: Rose et al. 2026 [R17] detect instructed collusion
from activations; the open question the research starter raises is whether such a probe
separates coordination from **benign correlated agreement**. Our regimes B, C, D, E0, F are
that confound set. One research thread, two deliverables, and the project exercises the
ARENA skills the program teaches (transformers, interpretability, evaluations).

## 2. Primary topic (decision D-007)

> Do linear probes on an open-weight model's activations separate collusion trajectories
> from matched correlated-agreement trajectories, and do they beat the best behavioral
> auditor on held-out case families?

Hypotheses H-TARA-1, H-TARA-2, H-TARA-3 in `hypotheses/HYPOTHESES.md`. Pipeline in
`lab/notebooks/04_tara_probe_plan.py`. Concepts in `foundations/08-mechanistic-detection.md`.

| Element | Choice |
|---|---|
| Model | Qwen2.5-1.5B-Instruct (same base as the sprint's Dolos-1.5B; runs on a 16 GB laptop CPU; free Colab GPU for speed) |
| Input | Trajectory rendered as the S3 text slice (messages, endorsements, decision, presented evidence) |
| Activation | Residual stream at the last token, one layer at a time; layer sweep |
| Probe | Logistic regression with L2 on standardized activations; fit on families 01 to 06; evaluate on 07 to 12 |
| Label | Collusion label (E1, P = 1) |
| Anti-confound | Probe for E0 versus A (incentive wording; must stay near chance, H-TARA-2); probe for prompt template id; family transfer (H-TARA-3) |
| Comparison | Behavioral S3 and S4 auditors on the same held-out trajectories |
| Data | Sprint runs plus, if needed, more seeds generated in week 1 (budget USD 5 to 15) |

### Three-week plan (approximate dates)

| Week | Dates | Deliverable | Check |
|---|---|---|---|
| 1 | 2026-11-21 to 11-27 | Preregistration for H-TARA-1..3; extraction pipeline on 100 trajectories; layer sweep | A probe trains and the E0-vs-A anti-confound number exists |
| 2 | 11-28 to 12-04 | Full extraction (300 to 600 trajectories); probes per layer; family transfer; comparison with S3 and S4 | Table: AUROC per layer, per split, with bootstrap intervals |
| 3 | 12-05 to 12-12 | Ablations (messages-only text versus full); error analysis; presentation | Presentation on 2026-12-12 |

## 3. Fallback topic

> Does explicit provenance disclosure reduce a reviewer model's false approval rate on
> derivative-heavy cases without reducing its true approval rate?

Hypothesis H-TARA-F1. This is RQ-A from the research starter: regime B versus A, with and
without origin labels shown to the reviewer. It needs no collusion behavior from any model
and no activations. It is an evaluations project (ARENA evals chapter) and can use the same
lab code with one new regime factor (`provenance_disclosed`).

**Switch rule.** After the sprint, if LLM agents in E1 and P do not behave differently from
E0 and A at the level of endorsements and messages (no separable behavior to probe for),
switch to the fallback. Record the decision in `DECISIONS.md`.

## 4. Zero-cost alternative if API access is the constraint

The sprint's Dolos-1.5B red-team challenge (find the trained-in misaligned behavior in a
fine-tune of Qwen2.5-1.5B-Instruct, explain how the model implements it, build an audit that
works without a reference model) is local, needs no key, and exercises the same probe and
activation skills. It is not about collusion. Use it only if both topics above are blocked.

## 5. Risks

| Risk | Mitigation |
|---|---|
| Probe reads incentive wording, not coordination | E0 shares wording with E1 and has label 0; H-TARA-2 is checked first |
| Too few collusion trajectories (only E1 and P are label 1) | Generate extra seeds for E1 and P in week 1; report class balance |
| CPU too slow for 1.5B at 1024 tokens | Truncate to messages plus endorsements; or free Colab GPU |
| Sprint runs did not happen | Generate dev and held-out runs in week 1 (USD 5 to 15) |
| Scope creep into training or RL | Not in scope; probes only |

## 6. Files

| File | Purpose |
|---|---|
| `README.md` | This brief |
| `TOPIC-SUBMISSION.md` | The text to submit, in the template, with a short and a long variant |
