---
title: "Social learning: consensus, cascades, and agreement"
status: draft
updated: 2026-10-23
depends_on: ["GLOSSARY.md", "foundations/01-evidence-independence.md", "hypotheses/HYPOTHESES.md"]
---

# Social learning: consensus, cascades, and agreement

> **One sentence.** Three classic models show three different ways a group can reach
> agreement without the agreement being a count of independent evidence.

**Terms used (from GLOSSARY.md):** agreement, conformity, information cascade, exposure
order, evidence independence, conditional independence, prior odds, likelihood ratio,
posterior odds, correlated error, regime, reviewer, decider.

**Terms used that are not in the glossary (standard in the source models):** *private
signal* (an observation one agent receives and others do not; in the review game this is a
reviewer's private evidence slice), *public action* (an action every later agent can see),
*weight matrix* (the DeGroot influence table), *common prior* and *common knowledge* (the
Aumann assumptions, defined in section 4.3).

## 1. Purpose

A decider sees that two reviewers agree. The question is how much that agreement should
move the decider's belief. Foundations document 01 answered this for evidence items: two
items move belief twice only if they are conditionally independent given the claim. This
document asks the same question for *agents*.

Agents are not passive evidence items. They observe each other, update on each other, and
imitate each other. Three models from social learning each isolate one mechanism:

| Model | Mechanism | What agreement means afterward |
|---|---|---|
| DeGroot consensus [R4] | repeated averaging of neighbors' opinions | a weighted average of starting opinions |
| Information cascades [R6] | sequential imitation of public actions | the first one or two private signals, copied |
| Aumann agreement [R5] | common prior plus common knowledge of posteriors | equal posteriors, under strong assumptions |

Without these models a reader makes one recurring error: treating "three agents agree" as
"three independent observations agree". Each model shows a way the count of agreeing agents
can be large while the count of independent signals is one.

## 2. Intuition

Picture three reviewers who each read one report and then talk until they agree.

- If they average their opinions over and over, they end at a number set by **who listens to
  whom**, not by **who was right** (DeGroot).
- If they act one after another and each can see earlier actions but not earlier evidence,
  the third reviewer may rationally copy the first two **even when its own evidence
  disagrees** (cascade).
- If they share the same starting beliefs and each fully knows what the others believe, they
  **must** end with the same belief; but that result says nothing about whether the shared
  belief is true (Aumann).

**Limit of the intuition.** These are models of idealized agents. A language model
reviewer is not a Bayesian updater and does not have a known weight matrix. The models tell
us which **patterns** to look for (order effects, suppressed private evidence, convergence
without new information). They do not tell us that a language model follows any one of them.

## 3. Mechanism

### 3.1 DeGroot consensus

Inputs: n agents, each with an opinion x_i(0) in [0, 1], and an n-by-n weight matrix W
where W_ij is how much agent i trusts agent j. Each row sums to 1.

Operation: at every step, each agent replaces its opinion with the weighted average of
everyone's current opinion.

Output: if the trust network is connected and not perfectly periodic, every opinion converges
to the same number, a fixed weighted average of the starting opinions.

### 3.2 Information cascades

Inputs: a binary state of the world; n agents acting in a fixed order; each agent receives
one private signal of known accuracy; each agent sees all earlier **actions** but no earlier
**signals**.

Operation: each agent computes its posterior from its own signal plus what the earlier
actions reveal, then acts.

Output: after a short run of identical actions, every later agent's action is fixed by the
public history, and private signals stop entering the record. This is an information
cascade.

### 3.3 Aumann agreement

Inputs: two agents with the same prior; each receives private information; each posterior
for an event is common knowledge (each knows the other's posterior, knows that the other
knows, and so on).

Output: the two posteriors are equal.

## 4. Formalism

### 4.1 DeGroot [R4]

**Definitions.**
- x(t) is the column vector of n opinions at step t.
- W is an n-by-n matrix with W_ij ≥ 0 and Σ_j W_ij = 1 for every row i (row-stochastic).

**Update (identity by definition).**

```
x(t+1) = W x(t)          so        x(t) = W^t x(0)
```

**Convergence [ESTABLISHED, standard Markov-chain result used by DeGroot].** If the
directed graph with an edge i → j whenever W_ij > 0 is strongly connected and aperiodic
(one positive diagonal entry is enough for aperiodicity), then W^t converges to a matrix
whose every row equals the same vector π. The vector π is the left eigenvector of W with
eigenvalue 1, normalized to sum to 1:

```
π W = π,     Σ_i π_i = 1
```

Then every agent's limiting opinion is the same number:

```
x_i(∞) = π · x(0) = Σ_j π_j x_j(0)     for every i
```

**Interpretation.** π_j is the long-run influence of agent j. It depends only on W (who
listens to whom). It does not depend on x(0) and it does not depend on which agent was
correct.

### 4.2 Information cascades [R6]

**Definitions.**
- State θ ∈ {H, L}, prior P(H) = 1/2.
- Agent k receives private signal s_k ∈ {h, l} with P(h | H) = P(l | L) = p, and 1/2 < p < 1.
- Signals are conditionally independent given θ (assumption).
- Agent k chooses action a_k ∈ {adopt, reject}. It adopts if its posterior P(H | everything
  it knows) > 1/2, rejects if < 1/2.
- Tie convention used in this document: when the posterior equals 1/2 exactly, the agent
  follows its own signal. (The source model uses a coin flip at ties; the cascade logic is
  the same, and our convention makes the derivation cleaner. This is our convention, not a
  claim about the paper.)

**Likelihood ratio of one signal (identity).**

```
LR(h) = P(h | H) / P(h | L) = p / (1 - p)
LR(l) = P(l | H) / P(l | L) = (1 - p) / p = 1 / LR(h)
```

**Posterior odds after k independent signals (identity under conditional independence).**

```
odds(H | s_1 ... s_k) = odds(H) × Π_k LR(s_k) = 1 × LR(h)^(#h - #l)
```

**The cascade argument.**

Agent 1 knows only s_1. It adopts if and only if s_1 = h. So a_1 reveals s_1 exactly.

Agent 2 knows s_1 (from a_1) and s_2. If both are h, odds = LR(h)^2 > 1: adopt. If they
differ, odds = 1, posterior = 1/2, tie: agent 2 follows s_2. So a_2 also reveals s_2 exactly
under our tie convention.

Agent 3 sees a_1 = a_2 = adopt and so knows s_1 = s_2 = h. Its odds before its own signal
are LR(h)^2. With s_3 = l, its odds become LR(h)^2 × LR(l) = LR(h) > 1. It adopts
**against its own signal**. Its action therefore reveals nothing about s_3. Agent 4 faces
the same public history and the same conclusion. The cascade is complete after two
identical actions.

**Probability the cascade is wrong (under our tie convention).** An adopt cascade starts
immediately when s_1 = s_2 = h. If the true state is L, that happens with probability
(1 − p)^2. The cascade then persists forever, no matter how many later agents hold the
correct signal l.

**Fragility.** The cascade rests on two private signals. One agent who is known to hold a
stronger signal, or any public release of raw evidence, can reverse it. A cascade is a
stack of imitation on a thin base of information.

### 4.3 Aumann agreement [R5]

**Assumptions.**
1. Common prior: both agents start from the same probability measure.
2. Each agent's posterior for event E is common knowledge.

**Result [ESTABLISHED].** Under 1 and 2, the two posteriors for E are equal.

**What the result does not say.**
- It does not say the shared posterior is correct.
- It does not say agents who merely *announce* equal posteriors satisfy the assumptions.
- It does not apply when priors differ, which is the normal case for two models trained
  differently, or for two role prompts of one model that encode different starting beliefs.
- It is silent on the process that produces common knowledge. Agreeing after one exchange
  of messages is not common knowledge of posteriors.

[INTERPRETATION] For our purposes Aumann is a warning, not a tool: "they agreed, so the
claim is probably true" borrows the force of a theorem whose assumptions we have not
checked and usually cannot check.

## 5. Example

### 5.1 DeGroot with three agents

Let agent 1 hold the correct value, 0.9, and the others hold 0.2 and 0.4:

```
x(0) = [0.9, 0.2, 0.4]

W = [ 0.5  0.3  0.2 ]      (agent 1 trusts itself 0.5, agent 2 0.3, agent 3 0.2)
    [ 0.2  0.6  0.2 ]
    [ 0.1  0.3  0.6 ]
```

Step 1:

```
x_1(1) = 0.5(0.9) + 0.3(0.2) + 0.2(0.4) = 0.45 + 0.06 + 0.08 = 0.59
x_2(1) = 0.2(0.9) + 0.6(0.2) + 0.2(0.4) = 0.18 + 0.12 + 0.08 = 0.38
x_3(1) = 0.1(0.9) + 0.3(0.2) + 0.6(0.4) = 0.09 + 0.06 + 0.24 = 0.39
```

Step 2:

```
x_1(2) = 0.5(0.59) + 0.3(0.38) + 0.2(0.39) = 0.295 + 0.114 + 0.078 = 0.487
x_2(2) = 0.2(0.59) + 0.6(0.38) + 0.2(0.39) = 0.118 + 0.228 + 0.078 = 0.424
x_3(2) = 0.1(0.59) + 0.3(0.38) + 0.6(0.39) = 0.059 + 0.114 + 0.234 = 0.407
```

The spread shrinks from 0.7 to 0.21 to 0.08. To find the limit, solve π W = π:

```
π_1 = 0.5 π_1 + 0.2 π_2 + 0.1 π_3     →  5 π_1 = 2 π_2 + π_3
π_3 = 0.2 π_1 + 0.2 π_2 + 0.6 π_3     →  2 π_3 = π_1 + π_2
```

Substitute π_3 = (π_1 + π_2)/2 into the first: 10 π_1 = 4 π_2 + π_1 + π_2, so 9 π_1 = 5 π_2
and π_2 = 1.8 π_1, π_3 = 1.4 π_1. Normalizing, 4.2 π_1 = 1:

```
π = [0.238, 0.429, 0.333]
```

(Check the middle equation: 0.3(0.238) + 0.6(0.429) + 0.3(0.333) = 0.071 + 0.257 + 0.100 =
0.429. It holds.)

Limiting consensus:

```
π · x(0) = 0.238(0.9) + 0.429(0.2) + 0.333(0.4) = 0.214 + 0.086 + 0.133 = 0.433
```

Every agent ends at 0.433. The correct value was 0.9. Agent 2 had the least accurate
opinion and the most influence (0.429), because the others listened to it. **Convergence
measured nothing about truth.** If we had swapped the opinions of agents 1 and 2, the group
would converge to 0.238(0.2) + 0.429(0.9) + 0.333(0.4) = 0.567 from the same information.

### 5.2 Cascade with p = 0.7

LR(h) = 0.7 / 0.3 = 7/3 ≈ 2.33. LR(l) = 3/7 ≈ 0.43.

| Agent | Public history | Own signal | Odds(H) | P(H) | Action |
|---|---|---|---|---|---|
| 1 | none | h | 7/3 | 0.70 | adopt |
| 2 | adopt (reveals h) | h | (7/3)^2 = 49/9 | 0.845 | adopt |
| 3 | adopt, adopt (reveals h, h) | **l** | 49/9 × 3/7 = 7/3 | **0.70** | adopt |
| 4 | adopt, adopt, adopt (reveals h, h, nothing) | l | 7/3 | 0.70 | adopt |

Agent 3 holds evidence against H and adopts with the same confidence agent 1 had with
evidence for H. From agent 3 onward, every action is identical and carries no information.
Ten agents in a row adopting looks like ten pieces of evidence. It is two.

If the true state is L, this wrong cascade starts with probability 0.3 × 0.3 = 0.09. One
run in eleven, with these parameters, locks every later agent into the wrong action.

### 5.3 Mapping to the review game

| Model | Where it appears in the review game | What to measure |
|---|---|---|
| DeGroot | not in the sprint; it needs repeated rounds of opinion exchange, as in multi-round debate | would need a repeated-round regime |
| Cascade | **regime C**: reviewer R2 sees R1's endorsement before acting (exposure order on) | does R2's endorsement follow R1 more often than its private evidence predicts |
| Aumann | the decider's inference "both endorsed, so approve" in every regime | whether the decider's approval probability tracks the number of **origins**, not the number of endorsements |

The scripted `ConformistReviewer` in the lab implements the cascade step directly: if an
earlier endorsement is visible, copy it. The LLM run tests whether a model reviewer behaves
like that when it is not told to.

## 6. Significance

**Where this matters for oversight.** The failure mode is a decider that treats the
agreement of two reviewers as two independent signals when it was one signal plus one
imitation. The mechanism is exposure order: R2 acted after seeing R1. Under conditional
independence of the reviewers' private evidence, two endorsements would justify a
posterior move of LR^2. After a cascade step, the justified move is LR^1.

**What breaks.** Every result above assumed conditionally independent private signals.
Foundations document 01 showed that derivatives of one origin violate this assumption.
Regime B (shared provenance) and regime C (exposure order) are therefore two separate ways
to get one signal counted twice: shared evidence and copied opinions. An auditor needs to
see provenance to detect the first and exposure order to detect the second. Neither is
visible in messages or votes alone. This is the argument behind **H-CORE-2** and the reason
**H-SPRINT-2** predicts that an actions-only auditor cannot separate regimes B and C from
collusion: at the level of votes and outcomes, a cascade and a coalition look the same.

**Connections to recent empirical work.**

- [FINDING, as described in the research starter] Okawa [R15] studies how collective bias
  emerges in multi-agent language-model debates and examines the roles of conformity, noise,
  and agent heterogeneity. That is the DeGroot and cascade picture tested on models.
- [FINDING, as described in the research starter; preprint] Chen et al. [R16] analyze when
  multi-agent debate fails, framing competitive and consensus-seeking protocols through
  their incentive structures. Treat its theorem assumptions as something to check, not reuse.
- [FINDING, as described in the research starter] Kraidia et al. [R18] run controlled
  experiments on a persuasive adversarial participant in debate. That is one agent pushing a
  group, closer to foundations document 03 than to this one, but the measured quantity, group
  error after interaction, is the same.

**[HYPOTHESIS]** For language-model reviewers, we expect the conformity rate in regime C to
be above zero even with accuracy-aligned payoffs, because models trained to be agreeable
may treat a visible earlier endorsement as evidence. The preregistered test is the C-versus-A
contrast in the sprint. If the conformity rate is zero, the mechanism is absent for this
model and regime C becomes a clean negative control.

**[SPECULATION]** Multi-round debate protocols may behave like DeGroot with a weight matrix
set by prompt order and verbosity rather than by accuracy. We have no measurement of this
and the sprint does not test it.

## 7. Check yourself

1. In the DeGroot example, agent 2 starts farthest from the truth yet has the largest
   influence weight. Change one entry of W so that agent 1 has the largest influence, keep
   rows summing to 1, and recompute π. What does the group converge to?
2. In the cascade with p = 0.7, suppose agent 3 announces its raw signal l instead of only
   its action. Recompute agent 4's odds if s_4 = l. Does the cascade survive?
3. A decider says: "Two reviewers with the same prior reached the same posterior, so by
   Aumann the claim is well supported." Name the two assumptions this sentence needs and
   state which one the review game violates by design.

Answers: `study/quizzes/02-social-learning.md`.

## Sources

[R4] DeGroot 1974, "Reaching a Consensus." [R5] Aumann 1976, "Agreeing to Disagree."
[R6] Bikhchandani, Hirshleifer, and Welch 1992, informational cascades. [R15] Okawa 2026,
biased consensus in multi-agent debate. [R16] Chen et al. 2025 (revised 2026), debate
failure, preprint. [R18] Kraidia et al. 2026, persuasion-driven adversarial influence in
debate. Full entries in `literature/INDEX.md`. The worked numbers in section 5 are ours.
