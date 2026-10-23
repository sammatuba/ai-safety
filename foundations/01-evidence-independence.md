---
title: "Evidence independence: why copies are not corroboration"
status: draft
updated: 2026-10-23
depends_on: ["GLOSSARY.md", "foundations/00-map.md"]
---

# Evidence independence: why copies are not corroboration

> **One sentence.** Likelihood ratios multiply only under conditional independence given
> the claim; a derivative of an evidence item has likelihood ratio 1 once its origin is
> known, so counting it again is an error with a computable size.

**Terms used:** claim, evidence item, origin, derivative, provenance, evidence independence,
dependence, double counting, prior odds, likelihood ratio, posterior odds, conditional
independence, correlated error.

## 1. Purpose

A decider sees three reports that say the same thing. Should its confidence rise three
times or once? If the three reports descend from one observation, the right answer is once.
A decider that updates three times has committed **double counting**. Double counting is
not a strategic failure. It happens with honest agents and true statements. It is the
simplest way an oversight protocol can be wrong, and it is the baseline against which every
strategic explanation must be compared.

## 2. Intuition

Think of each origin observation as one witness who looked. A derivative is someone who
heard the witness and repeated the story. Ten people repeating one witness give you one
witness. The limit of this picture: a repeater can add noise (misquote) or add information
(they also looked). Section 4.4 handles the partial case.

## 3. Mechanism

Inputs: a prior probability for the claim, a set of evidence items, and the provenance
graph (which items are origins, which are derivatives of which).

Steps:
1. Convert the prior probability to prior odds.
2. For each **origin**, compute its likelihood ratio from its reliability and what it reports.
3. Multiply prior odds by the likelihood ratios of the distinct origins only.
4. Convert posterior odds back to a probability.

A naive updater skips the provenance graph and multiplies once per **item**. The gap
between the two posteriors is the double-counting error.

## 4. Formalism

### 4.1 Odds and likelihood ratio

Let H be the claim ("the claim is true") and ¬H its negation. For a probability p:

```
odds(p) = p / (1 - p)            prob(o) = o / (1 + o)
```

For one evidence item E, the **likelihood ratio** is

```
LR(E) = P(E | H) / P(E | ¬H)
```

[ESTABLISHED] Bayes' theorem in odds form, for one item:

```
posterior odds(H | E) = prior odds(H) × LR(E)
```

Derivation: P(H|E)/P(¬H|E) = [P(E|H)P(H)/P(E)] / [P(E|¬H)P(¬H)/P(E)] = [P(H)/P(¬H)] × [P(E|H)/P(E|¬H)].

### 4.2 An origin with reliability r

Define an origin's **reliability** r as the probability that it reports the true value of
H. If the origin reports "true":

```
LR = P(reports true | H) / P(reports true | ¬H) = r / (1 - r)
```

If it reports "false": LR = (1 − r) / r. With r = 0.8, a true report has LR = 4 and a false
report has LR = 0.25. Note LR(true) × LR(false) = 1: one report each way cancels.

### 4.3 Two items: when do likelihood ratios multiply?

For two items E1, E2 the exact update uses the **joint** likelihood ratio:

```
posterior odds(H | E1, E2) = prior odds(H) × P(E1, E2 | H) / P(E1, E2 | ¬H)
```

[ESTABLISHED] If E1 and E2 are **conditionally independent given H and given ¬H**, that is

```
P(E1, E2 | H)  = P(E1 | H)  P(E2 | H)
P(E1, E2 | ¬H) = P(E1 | ¬H) P(E2 | ¬H)
```

then the joint ratio factorizes and LR(E1, E2) = LR(E1) × LR(E2). This is an identity under
the assumption. The assumption is the whole content.

### 4.4 A derivative has LR 1 given its origin

Let E1 be an origin report and E2 a derivative that copies E1 exactly. Then E2 is a
deterministic function of E1: P(E2 | E1, H) = P(E2 | E1, ¬H) = 1. Using the chain rule,

```
P(E1, E2 | H) / P(E1, E2 | ¬H)
  = [P(E1 | H) P(E2 | E1, H)] / [P(E1 | ¬H) P(E2 | E1, ¬H)]
  = P(E1 | H) / P(E1 | ¬H) × 1
  = LR(E1)
```

So the correct joint ratio is LR(E1), not LR(E1)². The naive updater is off by a factor of
LR(E1) in odds. With LR = 4 and prior 0.5, the correct posterior is 0.80 and the naive one is
0.94 after two items, 0.985 after three.

### 4.5 Partial dependence: a shared origin read with independent noise

Real derivatives are not exact copies. Suppose two reviewers each read the same origin Z
(reliability r = 0.8) and each transcribes it correctly with probability q = 0.9,
independently. Their reports E1, E2 are conditionally independent **given Z**, but not
given H, because Z is a common cause. The joint likelihood for both reporting "true":

```
P(E1 = E2 = true | H)  = P(Z = true | H)  q² + P(Z = false | H)  (1 - q)²
                       = 0.8 × 0.81 + 0.2 × 0.01 = 0.648 + 0.002 = 0.650
P(E1 = E2 = true | ¬H) = P(Z = true | ¬H) q² + P(Z = false | ¬H) (1 - q)²
                       = 0.2 × 0.81 + 0.8 × 0.01 = 0.162 + 0.008 = 0.170
joint LR = 0.650 / 0.170 = 3.82
```

The naive single-item LR is P(E = true | H)/P(E = true | ¬H) = (0.8 × 0.9 + 0.2 × 0.1) /
(0.2 × 0.9 + 0.8 × 0.1) = 0.74 / 0.26 = 2.85, and the naive product is 2.85² = 8.10. The
correct joint, 3.82, is below the origin's own LR of 4 (transcription noise loses a little)
and far below 8.10. Two readers of one document are worth a bit less than the document,
not twice the document.

### 4.6 What "independence" means in this repository

**Evidence independence** means conditional independence given H and given ¬H. It is a
property of the generating process, not of the wording. Two differently worded items from
one origin are dependent. Two identically worded items from two origins are independent.
Provenance, not text similarity, is the test. Text similarity is at best a weak proxy.

## 5. Example

Prior 0.5, reliability 0.8, three items all reporting "true".

| Provenance | Correct posterior odds | Correct posterior | Naive posterior | Error |
|---|---|---|---|---|
| three origins | 1 × 4 × 4 × 4 = 64 | 64/65 = 0.985 | 0.985 | 0 |
| one origin, two exact copies | 1 × 4 = 4 | 4/5 = 0.800 | 0.985 | +0.185 |
| one origin, two noisy readers (q = 0.9) | 1 × 3.82 | 0.793 | 0.890 (2.85² × ... see note) | about +0.10 |

Note for the last row: the naive updater using per-item LR 2.85 twice gets odds 8.10 and
posterior 0.890. Run `lab/notebooks/01_evidence_independence.py` for the first two rows and
extend it for the third.

In the review game, regime B gives each reviewer and the decider only derivatives of one
origin. The scripted naive reviewer counts items, so it behaves like the naive column. On
2026-10-23 the scripted demo measured a false approval rate of 0.167 in regime B against
0.017 in regime A (paired difference 0.150, 95 percent bootstrap interval [0.086, 0.200]).
That number is a property of our rules, not of any language model.

## 6. Significance

**[HYPOTHESIS] H-CORE-1.** Language-model reviewers and deciders will also double count:
their false approval rate rises with the number of derivative items even when ground truth
and origin count are fixed. Regime B versus A tests this with LLM agents.

**Why this matters for collusion research.** Every strategic explanation of a wrong
decision must beat this non-strategic one. If a decider double counts, a coalition does not
need to coordinate: it only needs to repeat. An auditor that cannot see provenance will
see repeated endorsements and may call them collusion. That is the shared-source false
positive the sprint's S4 slice is designed to remove (feature f5, `shared_origin`).

**What breaks if the assumption fails the other way.** Two reviewers that are the same
model, prompted the same way, reading different documents, still share a common cause:
their weights. Their errors are correlated even with perfect provenance (glossary:
correlated error). Provenance of evidence does not capture provenance of judgment. The
TARA project's anti-confound checks and the control literature's call for *diverse*
monitors both come from this gap.

**Connection to ontology (document 06).** The provenance graph is an ontological object: it
records which items derive from which. The validator in the November sprint counts roots of
that graph. This document gives the reason the count matters.

## 7. Check yourself

1. Prior 0.5, r = 0.8. Two independent reports: one says true, one says false. Posterior?
2. Prior 0.5, r = 0.8. Three items: origin A says true, a copy of A says true, origin B says
   false. Correct posterior? Naive posterior?
3. Two reviewers are the same model and read two different documents from two different
   origins. Which independence assumption still fails, and what feature in the auditor's
   design could detect it? (Hint: none of f1 to f10. Say why.)

## Sources

[R4] DeGroot 1974 (for the contrast with opinion averaging); [R6] Bikhchandani et al. 1992;
the Bayesian derivation is standard probability theory and needs no citation. The worked
numbers are ours. Full entries in `literature/INDEX.md`.
