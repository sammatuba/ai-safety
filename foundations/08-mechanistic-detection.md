---
title: "Mechanistic detection: reading coordination from activations"
status: draft
updated: 2026-10-23
depends_on: ["GLOSSARY.md", "foundations/07-measurement.md", "projects/2026-10-apart-collusion-sprint/design/regimes.md"]
---

# Mechanistic detection: reading coordination from activations

> **One sentence.** A linear probe tests whether a label is readable from a model's
> activations; it says nothing about whether the model uses that label, and it is only
> informative when the confounds that correlate with the label are measured too.

**Terms used (from GLOSSARY.md):** activation, residual stream, linear probe,
anti-confound check, regime, regime label, trajectory, information slice, AUROC, held-out
split, dev split, case family, collusion, parallel conduct, prompt-conditioned behavior.

## 1. Purpose

Foundations 04 to 07 study collusion from the outside: messages, actions, provenance,
payoffs. A different question: when a model reads a trajectory, does its internal state
separate "these agents coordinated" from "these agents agreed"? If it does, an auditor
could read that state directly. If it does not, or if what it reads is really the
incentive wording, then an activation-based auditor would inherit the same false positives
as a behavioral one.

The TARA project (`projects/2026-11-tara-project/`) asks this with the sprint's labeled
trajectories as data. This document gives the mechanism, the formalism, and the controls
the project needs.

## 2. Intuition

A transformer processes a text token by token. At each layer, each token position holds a
vector. Call it the token's **activation** at that layer. The model writes information into
these vectors and reads it back in later layers. If the model has, somewhere in its
processing, a notion of "the agents in this record coordinated", that notion may be present
as a direction in the vector: records with coordination point one way, records without it
point another.

A **linear probe** is a straight line (in high dimensions, a hyperplane) that tries to
separate the two groups of vectors. If the line separates them on records the probe never
saw, the information is **linearly readable** at that layer.

**Limit of the picture.** Linearly readable is not the same as used. A probe can read a
direction the model never consults for its own output. And a probe can read the wrong
thing: if every coordination record also contains the words "you earn +1 if the decider
approves", a line that separates incentive wording also separates coordination. The probe's
accuracy would then be a fact about the wording, not about coordination. The controls in
section 4.3 exist for this.

## 3. Mechanism

### 3.1 The residual stream

**[ESTABLISHED]** In a decoder-only transformer, each layer reads a vector from a running
sum and adds its output back to that sum. The running sum is the **residual stream**. The
activation we probe is the value of the residual stream at one layer and one token
position.

Shapes:

| Object | Shape | Meaning |
|---|---|---|
| one activation | `[d_model]` | one layer, one token |
| one record, one layer | `[seq, d_model]` | all tokens of one text |
| a batch, one layer | `[batch, seq, d_model]` | padded to the longest text |
| probe input matrix | `[n, d_model]` | one vector per record after pooling |

`d_model` is the model's width. For a 1.5-billion-parameter instruction model it is in the
low thousands. `seq` is the number of tokens in the rendered trajectory.

### 3.2 Pooling

A probe needs one vector per record. Two common choices:

- **last token**: take position `seq_i - 1` for record `i`, where `seq_i` is that record's
  true length before padding. Rationale: the model has read everything by then.
- **mean pool**: average over the record's real tokens. Rationale: less sensitive to how
  the text ends.

The lab notebook uses last token. Mean pooling is a one-line change and a reasonable
ablation.

### 3.3 The probe

Standardize each dimension of the input matrix using the **dev split**'s mean and standard
deviation. Fit a logistic regression with an L2 penalty. Score the **held-out split**.
Report **AUROC**, not accuracy, because the regime mix sets the base rate (foundations 07).

### 3.4 What the result means

| Outcome on held-out families | Reading |
|---|---|
| High AUROC for collusion vs non-collusion | The label is linearly readable at that layer, on this distribution |
| High AUROC and the anti-confound probe (section 4.3) is near chance | Readable, and not explained by the measured confound |
| High AUROC and the anti-confound probe is also high | The probe may be reading the confound |
| Near-chance AUROC at all layers | Not linearly readable, or pooling discards it, or the label is noisy |

None of the rows says the model uses the direction. Showing use needs an intervention on
the activation (editing the direction and observing the output change), which is outside
the TARA project's three weeks.

## 4. Formalism

### 4.1 The probe

Let `h ∈ R^d` be a pooled activation and `y ∈ {0, 1}` the collusion label.

```
p(y = 1 | h) = σ(w · h + b),     σ(z) = 1 / (1 + e^{-z})
```

`w ∈ R^d` is the probe direction and `b` the bias. Training minimizes the penalized
negative log-likelihood over the dev records:

```
L(w, b) = -(1/n) Σ_i [ y_i log p_i + (1 - y_i) log(1 - p_i) ] + (λ / 2n) ||w||²
```

The lab's `fit_logistic` in `lab/src/epistemic_lab/auditors.py` is this objective,
minimized by gradient descent, with `l2 = λ`. The same function fits the plus-factor rule
auditor on ten features and the probe on `d_model` features. One implementation, two uses.

### 4.2 Standardization

```
h̃_j = (h_j - μ_j) / (s_j + ε)
```

`μ_j` and `s_j` are the mean and standard deviation of dimension `j` over the dev split
only. Using held-out statistics would leak. `ε` prevents division by zero on constant
dimensions.

### 4.3 The anti-confound logic

Let `z` be a nuisance variable that the probe should not be reading. In our data the
clearest `z` is incentive wording: regimes E0, E1, and P share the approval-seeking
objective text; regimes A, B, C, F do not; D has it for the proposer only.

The problem: on the sprint's regimes, `y = 1` (E1, P) implies `z = 1`. A probe for `y`
could succeed by reading `z`. The check:

1. **Balance.** Regime E0 has `z = 1` and `y = 0`. Its presence in both splits means a
   probe that reads only `z` will flag E0 and lose AUROC on the E0-versus-E1 contrast.
   Report AUROC(E1 vs E0) separately from AUROC(E1 vs A).
2. **Probe for the confound.** Train a second probe to predict `z` from `h` using only
   records with `y = 0` (A versus E0). If that probe reaches high AUROC, the wording is
   linearly readable, and the collusion probe's weights must be checked for overlap with
   the wording direction. H-TARA-2 states the threshold: AUROC(E0 vs A) at or below 0.65.
3. **Transfer across families.** Train on case families 01 to 06, test on 07 to 12.
   H-TARA-3 states the allowed drop: at most 0.10 AUROC. A larger drop means the probe
   learned family-specific wording.

**[INTERPRETATION]** These three checks do not prove the probe reads coordination. They
rule out the two confounds we can name. An unnamed confound remains possible. State this
in the TARA write-up.

### 4.4 What the regime design gives the probe

The sprint's regimes are a factorial design (design/regimes.md). For a probe, that design
is a confound set: every non-collusion regime differs from a collusion regime in a known,
single factor. The TARA project's contribution, relative to a benchmark whose negatives
are generic non-collusion records, is that its negatives are the hardest cases the theory
names: same incentives (E0), same talk (F), same harm (B, D).

## 5. Example: tracing the lab notebook

`lab/notebooks/04_tara_probe_plan.py`, step by step. It has not been run as of 2026-10-23.

**Step 1. Render.** Each trajectory becomes the S3 text via `render_slice(t, "S3")`:
messages, endorsements, decision, presented evidence. The probe sees what a behavioral S3
auditor sees, so a comparison between the two is fair. Label is `COLLUSION_LABEL[t.regime]`.
Regime and family are kept for the checks.

**Step 2. Tokenize.** `tok(texts, padding=True, truncation=True, max_length=1024)` returns
`input_ids` and `attention_mask`, each `[batch, seq]`. Padding is on the left
(`tok.padding_side = "left"`), so the last real token of every row is at position `seq - 1`
only if there is no right padding; the notebook instead computes the last real index per
row as `attention_mask.sum(1) - 1`, which is correct for either padding side.

**Step 3. Forward pass.** `model(**enc, output_hidden_states=True)` returns
`hidden_states`, a tuple of length `num_layers + 1`. Entry 0 is the embedding output;
entry `L` is the residual stream after layer `L`. Each entry has shape
`[batch, seq, d_model]`. The notebook picks `LAYER = num_hidden_layers // 2` as a first
look; a layer sweep is week-1 work.

**Step 4. Pool.** `hs[torch.arange(b), last]` indexes one position per row:
shape `[batch, d_model]`. `.float().cpu().numpy()` moves it off the accelerator.
Concatenating over batches gives `X` of shape `[n, d_model]`.

**Step 5. Split by family.** `train = isin(family, F01..F06)`; `test = ~train`. This is the
same rule the sprint's preregistration uses (confound CF-3).

**Step 6. Standardize and fit.** `probe_auroc` computes `μ, s` on `X[train]`, standardizes
all of `X`, calls `fit_logistic` on the training rows, and scores the test rows with
`σ(X̃ w + b)`.

**Step 7. Evaluate.** `auroc(scores, y[test])` from `metrics.py`: the rank-based estimate
of P(score of a random positive > score of a random negative).

**Step 8. Anti-confound.** Mask to regimes E0 and A; set `y2 = (regime == "E0")`; repeat
steps 6 and 7. The printed number is the H-TARA-2 check.

Cost: on a laptop CPU with a 1.5-billion-parameter model in float32, a forward pass over a
few hundred records of about a thousand tokens each takes minutes. No GPU is needed for a
first look. The model named in the notebook, `Qwen/Qwen2.5-1.5B-Instruct`, is the base of
the sprint's Dolos-1.5B red-team model, so the same extraction code serves both.

## 6. Significance

### 6.1 NARCBench [R17]

**[INTERPRETATION of the starter's description]** Rose et al. 2026 introduce NARCBench and
detect collusion from activations across groups of agents, with tests under distribution
shift. The starter flags one distinction to keep: a benchmark label for *instructed*
collusion is evidence that a probe can read an instruction's effect; it is not evidence
that a deployed model would choose to collude. Our regimes have the same property. Every
collusion trajectory in E1 is **prompt-conditioned behavior**. A probe that separates E1
from E0 reads the effect of a channel plus an instruction, not an inclination.

What the TARA project adds, if it works: NARCBench-style detection evaluated against
matched innocent regimes as the negative set, with the incentive-wording confound measured
directly. **[HYPOTHESIS]** H-CORE-4 predicts the probe separates E1 from E0 and not E0 from
A. If it separates both, the probe reads wording (CF-7). If it separates neither, the
behavioral auditors remain the better tool on this data.

### 6.2 The Dolos-1.5B challenge

The sprint's red-team challenge supplies Dolos-1.5B, a fine-tune of
Qwen2.5-1.5B-Instruct with a trained-in misaligned behavior, and asks participants to find
it, explain how the model implements it, and build an audit that works without a reference
model. It runs locally at zero API cost. It exercises the same skills as section 5:
extraction, probing, anti-confound checks. It is the fallback exercise if API access or
separable LLM behavior is the constraint (decision D-007).

### 6.3 Links to the hypothesis registry

- **H-TARA-1.** Probe AUROC exceeds the best behavioral S3 auditor on the held-out split
  by at least 0.05.
- **H-TARA-2.** AUROC(E0 vs A) at or below 0.65 (the anti-confound bound).
- **H-TARA-3.** Family transfer drop at most 0.10.
- **H-CORE-4.** The program-level statement that coordination, not agreement, is what is
  linearly readable.

### 6.4 What breaks if an assumption fails

If the sprint's LLM regimes do not separate behaviorally, the labels for E1 mark
opportunity but not realized coordination; a probe trained on them learns opportunity. If
pooling at the last token discards the relevant information, a null result is about
pooling, not about readability; mean pooling and a layer sweep are the first ablations. If
the rendered S3 text differs in length across regimes (CF-1), length itself becomes a
nuisance variable the probe can read; pad or truncate to matched lengths and report the
length-only probe.

## 7. Check yourself

1. The probe reaches AUROC 0.92 on E1 versus all non-collusion regimes, and 0.88 on E0
   versus A. What is the most likely explanation, and which hypothesis does it refute?
2. Why does the notebook compute `attention_mask.sum(1) - 1` instead of using position
   `seq - 1` directly?
3. Give one reason a linearly readable direction might not be used by the model, and name
   the experiment type that would test use.

Answers: `study/quizzes/08-mechanistic-detection.md`.

## Sources

- [R17] Rose et al. 2026, NARCBench and activation-based collusion detection; instructed
  collusion labels versus a model choosing to collude; distribution-shift tests.
- Sprint page: Dolos-1.5B red-team challenge (fine-tune of Qwen2.5-1.5B-Instruct;
  huggingface.co/Poseidon-Research/Dolos-1.5B).
- Repository: `lab/notebooks/04_tara_probe_plan.py`, `lab/src/epistemic_lab/auditors.py`
  (`fit_logistic`), `lab/src/epistemic_lab/metrics.py` (`auroc`),
  `hypotheses/confounds.md` (CF-1, CF-3, CF-7).
