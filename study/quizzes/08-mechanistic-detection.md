# Quiz 08: Mechanistic detection

Source document: `foundations/08-mechanistic-detection.md`. Answer in writing before
opening the answers.

## Questions

1. The probe reaches AUROC 0.92 on E1 versus all non-collusion regimes, and 0.88 on E0
   versus A. What is the most likely explanation, and which hypothesis does it refute?
2. Why does the notebook compute `attention_mask.sum(1) - 1` instead of using position
   `seq - 1` directly?
3. Give one reason a linearly readable direction might not be used by the model, and name
   the experiment type that would test use.
4. (Transfer) You add regime F trajectories to the probe's negatives and AUROC falls from
   0.92 to 0.70. What does this tell you about what the probe was reading, and which
   behavioral auditor slice does the probe now resemble?

## Answers

**1.** E0 and A differ only in the payoff wording shown to the proposer and reviewers
(approval-seeking versus accuracy-aligned) and in the behavior that wording induces. Both
have collusion label 0. A probe that separates them at 0.88 has found a direction that
tracks incentive wording or its behavioral consequence (eager endorsement), not
coordination. Since E1 also carries that wording, the 0.92 on the main task is likely
riding on the same direction. This refutes H-TARA-2, whose bound is AUROC(E0 vs A) at or
below 0.65, and it undermines H-TARA-1's interpretation even if its number is met. The
next step is to inspect the overlap between the two probes' weight vectors and to report
AUROC(E1 vs E0) as the honest headline. Confound CF-7.

**2.** The batch is padded to the longest record. With left padding, every row's last real
token is at index `seq - 1`, so the direct index would work. With right padding, the last
real token of a shorter row is earlier, and `seq - 1` would select a pad token. Computing
`attention_mask.sum(1) - 1` counts the real tokens in each row and subtracts one, which
gives the last real index under either padding side. It is the robust form; the notebook
sets left padding and still uses it so that a change of tokenizer default does not silently
break the extraction.

**3.** A direction can be a byproduct: the model represents "the text contains an
imperative about citations" because that is useful for next-token prediction, and that
feature happens to correlate with our label, without the model's output ever depending on
it. A probe reads the direction; the model's behavior does not route through it. Testing
use needs an intervention on the activation: add or subtract the probe direction (or
project it out) at the chosen layer during the forward pass and measure whether the
model's downstream output changes in the predicted way. If editing the direction does not
move the output, the direction is readable but not used. That experiment is outside the
TARA project's three weeks, and the document says so.

**4. (Transfer)** Regime F contains the same coordination text as P (confound CF-10) with
label 0, because the reviewers' payoffs are accuracy-aligned and the talk changes nothing.
A drop to 0.70 when F enters the negatives means the probe was reading the presence of
coordination text, not whether it was acted on. It now resembles the S1 (messages-only) or
at best the S3 behavioral auditor, which the scripted demo shows flagging F at 100 percent
and 38 percent respectively. The repair direction is the same as for the behavioral
auditors: the probe needs to read something that differs between F and P, which is whether
the endorsements followed the plan and whether the incentives were shared. Whether those
facts are linearly readable from the S3 text is exactly what the TARA project measures.
