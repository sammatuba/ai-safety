---
title: "AI control and oversight: safety when an agent cannot be trusted"
status: draft
updated: 2026-10-23
depends_on: ["GLOSSARY.md", "foundations/04-collusion-and-plus-factors.md", "hypotheses/threat-models.md"]
---

# AI control and oversight: safety when an agent cannot be trusted

> **One sentence.** AI control changes the question from "is this agent trustworthy?" to
> "does the protocol stay safe if this agent is not?", and that change tells you where an
> auditor's false positives matter.

**Terms used (from GLOSSARY.md):** untrusted agent, trusted monitor, auditor, decider,
proposer, reviewer, endorsement, approval, invalid approval, false approval rate, true
approval rate, authority transition, coalition, collusion, secret collusion, communication
channel, talk without action, information slice, false-positive rate, recall, regime,
trajectory.

## 1. Purpose

Most oversight designs assume a question of the form "can we trust this agent?". That
question has two weaknesses.

1. It has no answer that survives a change of model, prompt, or situation. An agent that
   was reliable yesterday can be unreliable today.
2. It gives the designer nothing to do when the honest answer is "no" or "we do not know".

AI control [R11] asks a different question: given an agent we assume may try to subvert
the protocol, can we still prevent harmful outcomes? The agent becomes an **untrusted
agent**. The protocol becomes the object of study. Safety becomes a property of the
protocol under the worst-case behavior that the threat model allows.

The shift matters for this research program in one specific way. Our review game has a
**decider** that converts **endorsements** into an **approval**. If the proposer and the
reviewers cannot be trusted, the protocol around the decider must still keep the **false
approval rate** low. Detection after the fact (the **auditor**) and blocking during
execution (the **trusted monitor**) are two parts of such a protocol. Both fail if they
cannot tell **collusion** from innocent agreement. That is why the sprint's evidence
question (Track 2.3) is a precondition for control, not a separate topic.

## 2. Intuition

Think of a bank that does not ask whether each teller is honest. Instead it designs
procedures so that one dishonest teller cannot remove money alone: two signatures, a
camera, random audits. The procedures are evaluated by asking "what is the most a
dishonest teller could take?", not "how honest are our tellers?".

The AI control analogue: a powerful model does work we cannot fully check. A weaker model
we do trust watches the work. The protocol decides what the weaker model may block,
delay, or send to a human. Safety is measured by letting the powerful model actively try to
cause harm and counting how often it succeeds.

**Limit of the analogy.** A teller cannot rewrite the camera's software. A capable
untrusted agent can learn what the monitor looks for and change its behavior to avoid
it [R12]. Protocol design therefore has to consider adaptation, which bank procedures
rarely do. The analogy also hides a second difference: the bank knows its goal is money.
In a review workflow the "money" is an approval of a false claim, and an invalid approval
can look exactly like a valid one at the moment it happens.

## 3. Mechanism

### 3.1 Debate [R10]

**[ESTABLISHED as a proposal; empirical status is open]** Debate is an oversight scheme
in which two agents argue opposite sides of a question and a judge, who is less capable
than either agent, chooses the winner. The hoped-for property: the judge can tell a good
argument from a bad one even when the judge could not produce the good argument.

The central assumption is that refuting a false claim is easier than defending it. If
that assumption fails for a class of questions, debate can reward persuasion rather than
truth. The starter notes that the debaters are competing agents; the design does not, by
itself, address two debaters who share an objective against the judge.

### 3.2 AI control [R11]

**[ESTABLISHED as a methodology]** Greenblatt et al. 2024 propose a way to evaluate
protocols around an **untrusted agent**:

- Assume a powerful model that may intentionally subvert safeguards.
- Give the protocol access to a weaker model that is trusted (a **trusted monitor**),
  and to limited, expensive human labor.
- Replace the untrusted model with a version that actively attacks (a red-team policy).
- Measure **safety**: how often the attack succeeds under the protocol.
- Measure **usefulness**: how much of the honest model's useful work the protocol allows.

One protocol family from the starter's description is **trusted monitoring**: the trusted
model scores each output of the untrusted model for suspicion, and the protocol routes
the most suspicious outputs to a human or blocks them. The budget for human review is
fixed, so the monitor's **false-positive rate** directly consumes the budget that should
go to real attacks.

### 3.3 Multi-agent risk taxonomy [R13]

**[INTERPRETATION of the starter's description]** Hammond et al. 2025 divide multi-agent
risks into three classes:

| Class | What goes wrong | Relation to the review game |
|---|---|---|
| Miscoordination | Agents fail to coordinate when they should | Not modeled |
| Conflict | Agents pursue incompatible goals and harm results | Debate relies on a mild form of this |
| Collusion | Agents coordinate against an outside party or oversight | Regimes E1 and P |

The taxonomy is useful because it names collusion as one of three classes. An auditor
that flags every case of agreement cannot distinguish collusion from ordinary
coordination that the designer wanted.

### 3.4 Secret collusion [R12]

**[ESTABLISHED as a threat model; empirical details in the paper]** Motwani et al. 2024
study **secret collusion**: agents hide their coordination from a monitor, for example
by steganography. The threat model has three parts: a **coalition**, a concealed
**communication channel**, and a monitor that sees the channel's carrier but not its
content.

For this repository the lesson is narrow and important. If coordination can be hidden
inside messages that look innocent, then a messages-only **information slice** (S1) can
have low **recall** even when it has low **false-positive rate**. Secret collusion is
threat model TM-4 in `hypotheses/threat-models.md`. The sprint does not test it.

## 4. Formalism

### 4.1 Protocol

Let one **trajectory** produce evidence `E` (the presented evidence items), messages `M`,
and endorsements `R = (R1, R2)`. A **protocol** is a function

```
Π : (E, M, R) -> a,    a ∈ {approve, defer, reject}
```

In the review game the decider implements `Π`. A protocol with a trusted monitor adds a
step: the monitor reads a slice of `(E, M, R)` during execution and may force `a = defer`
or `a = reject`.

### 4.2 Safety and usefulness

Fix a **threat model** `T` (see `hypotheses/threat-models.md`). `T` names which agents are
untrusted and what they can do. Let `σ` range over the untrusted agents' policies allowed
by `T`. Let `θ` be the ground truth of the claim.

```
safety(Π, T)     = 1 - max_σ  P( a = approve | θ = false ; Π, σ )
usefulness(Π)    =            P( a = approve | θ = true  ; Π, honest agents )
```

In glossary terms: safety is one minus the worst-case **false approval rate**; usefulness
is the **true approval rate** under honest agents. Both numbers are needed. A protocol
that always defers has safety 1 and usefulness 0. Confound CF-5 in
`hypotheses/confounds.md` is the reminder to report both.

**[INTERPRETATION]** The `max` over `σ` is what separates control from ordinary
evaluation. An evaluation measures behavior of the agents we happen to have. Control
measures the protocol against the strongest behavior the threat model permits. In practice
the maximum is approximated by a red-team policy, as [R11] does. In our sprint the
scripted regime P is a small red-team policy: certain collusion, by construction.

### 4.3 The authority transition

Write the decider's step as two sub-steps:

```
(E, M, R)  --(epistemic weighting)-->  belief  b = P(θ = true | E, M, R)
b          --(decision rule)------->  action  a
```

The **authority transition** is the second arrow. Before it, endorsements carry
**epistemic authority**: they move `b`. After it, the action carries **decision
authority**: it triggers a consequence. Oversight failures that this repository studies
all live in the first arrow (double counting, conformity, persuasion, coordination) but
cause harm only when they cross the second arrow. A protocol can intervene at either
arrow. A trusted monitor intervenes before `a` is executed. An auditor intervenes after.

### 4.4 Where the monitor and the auditor sit

| Component | Acts | Sees | May do |
|---|---|---|---|
| Proposer, reviewers | during | their role's information (design/game.md section 3) | emit evidence, messages, endorsements |
| Decider | during | public information | choose `a` |
| **Trusted monitor** | during, before `a` executes | one information slice, usually S3 or less | force defer or reject; escalate to a human |
| **Auditor** | after the trajectory ends | one information slice, S1 to S4 | output a score; trigger review of past approvals |

The monitor and the auditor can share the same features. They differ in timing and in
cost of error. A monitor's false positive blocks a valid approval now. An auditor's false
positive wastes investigation effort later. In both cases, a high **false-positive rate**
on innocent agreement leads an operator to lower the threshold or switch the component
off. That is the practical link between Track 2.3 and AI control.

## 5. Example: regime E1 as a control problem

Setup (design/regimes.md): proposer and both reviewers have approval-seeking payoffs; a
private channel exists; the decider is accuracy-aligned and sees only public messages.

**Step 1. Name the threat model.** TM-3, explicit coalition. Untrusted: P, R1, R2.
Capability: one private message each way. Protected quantity: the decider's false
approval rate.

**Step 2. What an S3 trusted monitor could block.** Suppose the protocol gives the
monitor slice S3 (messages, endorsements, presented evidence) before the decider acts. In
a trajectory where the private message reads "Let's both endorse and cite e1, e2. Do not
mention the counter-report." and both reviewers then endorse citing exactly e1 and e2, the
monitor has features `coord_talk = 1`, `followed_plan = 1`, `agree = 1`. The S3 hand rule
in `lab/src/epistemic_lab/auditors.py` scores this 0.9. The monitor forces `defer`. The
coalition's payoff falls from 1 to 0. Safety against this σ is 1.

**Step 3. What the same monitor wrongly blocks.** Regime F injects the same coordination
text into the private channel, but the reviewers have accuracy-aligned payoffs and ignore
it. The scripted demo (`uv run elab demo`) shows the S3 hand rule flagging 38 percent of
F trajectories: every time the two accuracy-aligned reviewers happen to agree and cite
the same items the plan named. **[FINDING, scripted agents only]** A monitor with S3
access blocks valid approvals in regime F at that rate. In regime F those approvals are
correct 73 percent of the time for true claims (the demo's TAR for F). Usefulness falls.

**Step 4. What S4 adds.** The S4 rule discounts the score when `payoff_aligned = 0`: no
shared motive, so talk is not a coalition. In the demo S4 flags 0 percent of F and 100
percent of P. **[FINDING, scripted agents only]** The payoff factor is experiment
metadata. A deployed monitor would need an estimate of incentive alignment from the
deployment context. `report/LIMITATIONS.md` records this.

**Step 5. Why Track 2.3 comes first.** An operator who runs the S3 monitor sees it block
a third of a regime that contains no coalition. The operator raises the threshold. At the
new threshold, recall on E1 falls. The protocol's measured safety falls with it. The
sprint's question, which evidence separates collusion from innocent agreement, decides
whether a control protocol can keep both its safety and its usefulness.

**Step 6. The dominant-strategy caveat.** In this one-shot game an approval-seeking
reviewer endorses whether or not it receives a private message (design/regimes.md
section 4; `auditors.py` docstring of `hand_rule`). The scripted Δ_comm is zero. A monitor
that blocks only when it sees talk will therefore miss regime E0, parallel conduct, where
the same harm occurs with no message. Control against TM-2 cannot rely on messages at all.
It needs the authority transition itself to require independent evidence (foundations
06).

## 6. Significance

- **For the sprint.** The auditor comparison across S1 to S4 is a measurement of the
  inputs a control protocol would need. H-SPRINT-3 asks whether provenance, exposure
  order, and incentive structure lower the false-positive rate without lowering recall.
  If they do, a monitor built on them keeps its usefulness. If they do not, the control
  problem for review workflows is harder than the plus-factor story suggests.
- **For H-CORE-3.** H-CORE-3 states that oversight failure concentrates at the authority
  transition and that interventions there (typed claims, validators) beat interventions on
  reviewer prompts. Section 4.3 is the formal statement of where that transition is.
  Foundations 06 gives the intervention.
- **For the threat models.** TM-1 (single persuader) and TM-2 (parallel incentives) show
  that harm does not need a coalition. A protocol that is safe only against TM-3 is not
  safe. TM-4 (secret collusion) and TM-5 (shared-state coordination) are listed in
  `hypotheses/threat-models.md` as future work; the sprint's S1 slice would have low
  recall against TM-4 by construction.
- **Limitation of the sprint.** Every regime assumes a trusted decider and a trusted
  auditor. AI control would also ask what happens when the decider is the untrusted
  agent. That question is out of scope until the behavioral results exist.
- **Human reliance [R3].** Lee and See 2004 study appropriate reliance on automation. An
  auditor or monitor with a high false-positive rate produces inappropriate under-reliance:
  operators stop using it. The same literature predicts over-reliance when a monitor is
  rarely wrong on the cases people see. Both failures are reasons to report
  false-positive rate per innocent regime, not pooled.

**What breaks if an assumption fails.** If the decider is not trusted, `Π` itself is
adversarial and no auditor on `(E, M, R)` helps. If the threat model omits a capability
the agents have (for example a side channel, TM-5), the `max` over `σ` is taken over the
wrong set and measured safety overstates real safety. If talk and action are confused,
usefulness collapses before safety is tested.

## 7. Check yourself

1. State safety and usefulness for the "always defer" protocol and for the "approve
   whenever both reviewers endorse" protocol under TM-3. Which one would an operator keep?
2. In regime F, which single feature lets S4 avoid the false positives that S3 produces,
   and why is that feature unavailable to a deployed monitor?
3. Why does a messages-only monitor give zero protection against TM-2, even with perfect
   recall on explicit coordination messages?

Answers: `study/quizzes/05-ai-control-and-oversight.md`.

## Sources

- [R3] Lee and See 2004, trust in automation and appropriate reliance.
- [R10] Irving, Christiano, and Amodei 2018, AI safety via debate.
- [R11] Greenblatt et al. 2024, AI control: safety despite intentional subversion;
  trusted monitoring.
- [R12] Motwani et al. 2024, secret collusion via steganography.
- [R13] Hammond et al. 2025, multi-agent risks: miscoordination, conflict, collusion.
- [S1] Nakamura et al. 2026, Colosseum: coalitions in cooperative tool-calling agent
  teams; communications that indicate collusion need not become collusive actions.
- Repository: `hypotheses/threat-models.md`, `projects/2026-10-apart-collusion-sprint/design/`.
