---
title: "TARA topic submission (draft)"
status: draft
updated: 2026-10-23
depends_on: ["README.md", "hypotheses/HYPOTHESES.md"]
---

# TARA topic submission

## 0. Program template and deadline

(Paste the teacher's template and the due date here. Until then, the long variant below
follows `templates/topic-submission.md`.)

## 1. Short variant (about 120 words, for a form field)

**Title:** Reading collusion versus correlated agreement from model activations

When several AI agents agree and a decision goes wrong, the cause may be shared evidence,
conformity, one persuasive agent, shared incentives, or actual coordination. Behavioral
auditors confuse these. I will test whether a linear probe on the activations of a small
open-weight model (Qwen2.5-1.5B-Instruct) separates coordinated trajectories from matched
innocent ones, using a labeled dataset of review-workflow trajectories under eight
controlled regimes that I built for the Apart AI Collusion Research Sprint. The key check is
negative: the probe must not separate "shared incentive, no channel" from the honest
baseline, or it is reading incentive wording. I compare against behavioral auditors on
held-out case families. Skills: transformers, mechanistic interpretability, evaluations.

## 2. Long variant (follows templates/topic-submission.md)

**Title (10 words or fewer):** Reading collusion versus correlated agreement from model activations

**One-sentence question:** Do linear probes on an open-weight model's residual-stream
activations separate collusion trajectories from matched correlated-agreement trajectories,
and do they beat the best behavioral auditor on held-out case families?

**Why it matters for AI safety (3 sentences):** Oversight protocols increasingly let AI
agents review other AI agents, and agreement among reviewers is treated as evidence. If an
auditor flags every correlated agreement as collusion it will be switched off; if it misses
real coordination it is useless. Activation-based detection has been shown for instructed
collusion [R17], but not against matched innocent explanations of the same agreement, which
is the case that decides whether such a monitor is deployable.

**Closest prior work and the delta:**
- Rose et al. 2026, NARCBench [R17]: activation-based collusion detection with distribution
  shift tests. Delta: our negatives are matched innocent regimes (shared source, conformity,
  persuasion, parallel conduct, talk without action), not generic non-collusion.
- Nakamura et al. 2026, Colosseum [S1]: audits collusion in cooperative tool-calling agent
  teams; notes collusive talk that does not become action. Delta: we probe the model, and
  we isolate one factor per regime.
- Hu et al. 2026, Lying with Truths [R14]: belief manipulation by truthful fragments. Delta:
  our regime D is the single-agent version; we test whether a probe confuses it with collusion.
- Okawa 2026 [R15]: biased consensus from conformity in debate. Delta: regime C is the
  conformity control for the probe.

**Method (5 to 8 lines):** Trajectories come from a proposer-reviewer-decider review game
with eight regimes (A honest, B shared source, C conformity, D persuasion, E0 parallel
conduct, E1 explicit collusion, F talk without action, P scripted collusion). Each
trajectory is rendered as text (messages, endorsements, decision, evidence) and fed to
Qwen2.5-1.5B-Instruct. I extract the residual-stream activation at the last token for each
layer and fit an L2-regularized logistic probe on case families 01 to 06 with label
"collusion" (E1, P). I evaluate on families 07 to 12. I run the same procedure with label
"E0 versus A" as an anti-confound check, and with label "prompt template" as a second. I
compare probe AUROC with behavioral rule auditors (messages only, actions only, both, and
full metadata) on the same held-out trajectories.

**What I will measure, and the result that would refute my hypothesis:** AUROC with 95
percent bootstrap intervals by case family; false-positive rate per innocent regime at a
threshold frozen on the dev split. H-TARA-1 is refuted if the probe does not beat the
messages-plus-actions auditor by at least 0.05 AUROC. H-TARA-2 is refuted if the E0-versus-A
probe exceeds 0.65 AUROC (the probe reads incentives, not coordination). H-TARA-3 is refuted
if AUROC drops by more than 0.10 from dev to held-out families.

**Skills from the curriculum this uses:** transformer architecture (residual stream,
activations, tokenization), mechanistic interpretability (linear probes, confound
controls), model evaluations (AUROC, bootstrap, preregistration, held-out splits).

**Compute and data needs:** 16 GB laptop CPU or free Colab GPU; Qwen2.5-1.5B-Instruct
weights (about 3 GB); 300 to 600 labeled trajectories (existing from the sprint; extra seeds
cost USD 5 to 15 through an OpenAI-compatible API).

**Three-week plan:**
- Week 1: preregistration; extraction pipeline; layer sweep on 100 trajectories; the
  E0-versus-A anti-confound check first.
- Week 2: full extraction; probes per layer; family transfer; comparison with behavioral
  auditors; tables with intervals.
- Week 3: ablations (messages-only text versus full); error analysis of false positives per
  innocent regime; presentation.

**Risks and fallback:** If sprint LLM agents produce no separable coordination behavior,
there is nothing to probe. Fallback (H-TARA-F1): an evaluations project testing whether
explicit provenance disclosure lowers a reviewer model's false approval rate on
derivative-heavy cases without lowering its true approval rate. Same code, one new factor,
no activations required.

## 3. Preexisting work statement

The review game and auditors were built during the Apart sprint (2026-10-23 to 2026-10-25).
The TARA project adds the activation pipeline, probes, and anti-confound analysis. Concepts
of claim provenance come from my earlier Grid Nowcast ontology work; no code from it is used.
