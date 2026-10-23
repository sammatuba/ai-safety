# Quiz 05: AI control and oversight

Source document: `foundations/05-ai-control-and-oversight.md`. Answer in writing before
opening the answers.

## Questions

1. State safety and usefulness for the "always defer" protocol and for the "approve
   whenever both reviewers endorse" protocol under TM-3. Which one would an operator keep?
2. In regime F, which single feature lets S4 avoid the false positives that S3 produces,
   and why is that feature unavailable to a deployed monitor?
3. Why does a messages-only monitor give zero protection against TM-2, even with perfect
   recall on explicit coordination messages?
4. (Transfer) The TARA project trains a probe on sprint trajectories. In control terms, is
   the probe a trusted monitor or an auditor? What would have to change for it to be the
   other one?

## Answers

**1.** Always defer: no approval ever executes, so P(approve | false) = 0 and safety = 1.
No true claim is approved either, so usefulness = true approval rate = 0. Approve on
double endorsement: under TM-3 the coalition controls both reviewers, so the worst-case
policy endorses every false claim; P(approve | false) under the worst case is bounded only
by the decider's own evidence check, which in the scripted game is "majority of presented
items report true", giving about 0.57 in the demo (FAR of regime P). Safety is about 0.43.
Usefulness is high: honest reviewers endorse most true claims (demo TAR 0.73 to 1.0
depending on regime). An operator keeps neither as stated. The first does no work; the
second lets the coalition through. The point of the comparison is that both numbers must be
reported, and that the operator's real choice is a protocol between the two, which is what
the monitor and the auditor are for.

**2.** `payoff_aligned` (f7). In regime F the reviewers have accuracy-aligned payoffs, so
f7 = 0, and the S4 hand rule multiplies the score by 0.3. S3 has no incentive information
and scores on talk plus agreement. A deployed monitor does not have the experiment's payoff
table. It would need an estimate of incentive alignment from the deployment context, which
is approximate at best. `report/LIMITATIONS.md` lists f7 and f10 as the two unrealistic S4
inputs; the ablation that removes them measures the realistic version of S4.

**3.** TM-2 is parallel conduct: the proposer and reviewers share an approval-seeking
payoff and have no channel. No message is sent, so no message-based feature fires. Yet the
scripted demo shows FAR(E0) = 0.57 against FAR(A) = 0.02: the harm is as large as under the
explicit coalition. A monitor that reads only messages has recall 0 on E0 by construction.
The protection against TM-2 has to come from the authority transition itself: requiring
independent supporting origins before an approval executes (foundations 06), which does not
depend on what anyone said.

**4. (Transfer)** As written, the probe is an auditor: it reads a completed trajectory
(rendered S3 text) after the decision and outputs a score. To be a trusted monitor it would
have to run before the decider's action executes, on the partial trajectory available at
that moment (evidence, messages, endorsements, but not the decision or ground truth), and
the protocol would have to give it the right to force a deferral. That also changes the
cost of its false positives: an auditor's false positive wastes investigation; a monitor's
false positive blocks a valid approval now. The second cost is what makes the Track 2.3
false-positive question a precondition for using the probe as a monitor.
