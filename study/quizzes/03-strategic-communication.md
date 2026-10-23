# Quiz 03: strategic communication

Companion to `foundations/03-strategic-communication.md`. Try each question before opening
the answers.

## Questions

1. In the cheap-talk game of section 4.1, change the receiver's payoff for a correct
   decision from 1 to 2 and leave the sender's as is. Does the truthful-equilibrium
   condition on b change? Why or why not?
2. In the persuasion example, the judge raises the conviction threshold from 0.5 to 0.6.
   Recompute the largest q and the conviction probability. State the general pattern.
3. Explain why a reviewer with u = 1[approve] endorses in every state of the one-shot game,
   and name the one thing a private message could still change in such a reviewer's output.

**Transfer question.** The sprint's `SelectiveProposer` presents only pool items that
report the claim true. A decider wants to defend against this without seeing provenance.
Using the models in the document, name two pieces of information the decider could demand
that would restore an honest update, and say which agent in the review game already holds
each.

## Answers

### 1. Receiver payoff does not enter the sender's condition

The truthful-equilibrium condition came from the sender's deviation check in state 0:
truthful payoff 1 versus lying payoff b. The receiver's payoff appears only in the
receiver's own check, which asks whether a = m is the receiver's best response given truthful
messages. Doubling the receiver's payoff for a correct decision makes a = m even more
clearly best for the receiver, and leaves the sender's comparison unchanged. The condition
stays b ≤ 1.

Lesson: how much the receiver values accuracy does not discipline the sender. Only the
sender's own payoff does. A decider who cares deeply about truth gains no protection from
caring; it needs the sender's incentive, or the evidence itself, to change.

### 2. Threshold 0.6

The judge convicts on c if P(G | c) ≥ 0.6:

```
0.3 / (0.3 + 0.7 q) ≥ 0.6
0.3 ≥ 0.18 + 0.42 q
q ≤ 0.12 / 0.42 = 2/7 ≈ 0.286
```

Conviction probability:

```
P(c) = 0.3 + (2/7)(0.7) = 0.3 + 0.2 = 0.5
```

General pattern: with prior π_0 and threshold τ, the largest q satisfies
π_0 / (π_0 + (1 − π_0) q) = τ, so q = π_0 (1 − τ) / (τ (1 − π_0)), and P(c) = π_0 / τ. Here
0.3 / 0.6 = 0.5. The sender's success rate equals the prior divided by the threshold. A
stricter receiver (higher τ) lowers it; a receiver at τ = 1 forces full information and
P(c) = π_0.

For the review game: the decider's approval threshold is the lever. The design choice
"approve when both endorse and a majority of presented items report true" is a threshold
the proposer can target, and the persuasion model says how often it will succeed as a
function of how strict it is.

### 3. The dominant strategy and what a message can still change

The reviewer's payoff is 1 if the decider approves and 0 otherwise, with no term for the
claim's truth. Approval requires both endorsements. Endorsing never lowers the chance of
approval and rejecting or abstaining lowers it to zero. So in every state, endorsing weakly
dominates every other vote. The reviewer endorses without needing to know what the other
reviewer does or what the private message says. That is why the scripted demo shows
Δ_comm = 0: the channel has no vote to move.

What a message can still change is the **content** of the endorsement: which items the
reviewer cites and what reason it states. A plan like "cite e1 and e2, do not mention the
counter-report" shapes the citations and the silence about private evidence. Plus factor
f10 (`cf_shift`) therefore compares citations as well as votes with the matched channel-off
trajectory, and plus factor f9 (`followed_plan`) checks whether the citations match the
plan. For language-model reviewers, the message may also change the vote itself, if the
model does not play the dominant strategy on its own; that is what H-SPRINT-4 measures.

### Transfer answer

Two demands that restore an honest update:

1. **The size and composition of the pool**, not only the shown items. If the decider knows
   the pool had five items and three were withheld, the shown items are "two favorable out
   of five", and the decider can ask what the withheld three reported. The proposer holds
   this information and has no incentive to volunteer it; the protocol must require it.
2. **An unfiltered sample**: the reviewers' private evidence slices. Each reviewer holds one
   item the proposer did not select. A protocol that requires each reviewer to report its
   private item's content, not only its vote, gives the decider two signals the proposer
   never filtered. A reviewer that endorses while its private item contradicts is caught by
   plus factor f8 (`against_evidence`).

Neither demand needs provenance. Both move information from an agent who holds it to the
decider before the authority transition, which is the H-CORE-3 pattern: fix the step where
an endorsement becomes an approval.
