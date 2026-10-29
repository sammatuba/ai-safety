---
title: "Research brainstorming from epistemology ontology and industry mechanisms"
status: draft
updated: 2026-10-28
depends_on: ["GLOSSARY.md", "literature/INDEX.md", "foundations/00-map.md", "DECISIONS.md"]
---

# Research brainstorming from epistemology ontology and industry mechanisms

## 1. Purpose

This section holds proposed research directions before they become registered hypotheses or project commitments.
The owner requested broader foundations and stronger safety relevance after the Apart collusion sprint.
The starting question is:

> What justifies turning an artificial intelligence (AI) system's claim into permission to act?

The [idea cards](ideas.md) contain seventeen proposals with experiments, limits, and reasons to stop.
The [interactive map](../explore.html#brainstorming) supports searching ideas and exploring their research-area connections.
The [canonical records](ideas.json) preserve these connections in a portable form.
The [prior-work review](prior-work-review.md) identifies direct overlaps with published research.
The [three candidate briefs](candidate-briefs.md) specify tasks, controls, measures, and stop conditions.
The [investigation study guide](investigation-study-guide.md) explains diagnosis, repair,
and catastrophic-risk relevance through expense records, test runs, and a power-market example.
The [interactive study companion](../../../explainer/research.html) adds eight reading chapters,
exercises, self-checks, local notes, and copy-ready project proposals.

[INTERPRETATION] This question connects the owner's interests without requiring every project to study collusion.
A report can create false assurance through error, missing evidence, or coordination.
The intended contribution must identify which safety decision improves and why.

## 2. Intuition

Imagine an agent runs tests on a new model. Several reviewers read its report and recommend deployment.
The report says that no failures appeared. However, the agent skipped the difficult cases.
Every reported result might be true. The broader approval can still exceed the evidence.

Five questions expose different weaknesses:

| Lens | Fundamental question | Concrete failure |
|---|---|---|
| Ontology | Which objects, states, and relationships does the claim describe? | A result for one version becomes approval of another version. |
| Epistemology | What evidence warrants belief, and how dependent is it? | Three reviewers rely on one incomplete report. |
| Causal reasoning | Which explanations fit, and which test can distinguish them? | Investigators blame coordination when a shared input caused the failures. |
| Game theory | Why would agents produce these messages and actions under these rules? | A public criterion rewards passing a metric while omitting its purpose. |
| Decision theory | Which action is justified under the remaining uncertainty? | A decider waits for proof of intent while an independently verified defect remains. |

**Ontology has two relevant senses.** Philosophical ontology asks which kinds of things exist and what distinguishes them.
For this bank, the practical question concerns claims, observations, agents, decisions, and evidence relationships.
The repository's technical ontology is narrower: defined predicates and permitted relationships among them.
Neither use implies that a schema establishes truth.

**Epistemology studies knowledge, evidence, and justification.** Its social branch asks when reliance on another agent is warranted.
Testimony supplies information through another agent's communicated claim.
The studies of epistemic authority and expert reliance provide starting points [R1, R2].
For oversight, an endorsement must earn its evidential weight through access, competence, and the relevant dependence structure.

## 3. Mechanism

### Testimony and evidence independence

An endorsement can transmit an observation, an inference, or another agent's endorsement.
These are different evidential relationships.
If three reports descend from one observation, counting them as three independent observations double counts evidence.
Model variety also does not establish evidence independence.

[SPECULATION] An effective oversight protocol may benefit more from one fresh measurement than from several additional opinions.
B05 and B11 turn this into a budget-matched comparison.
The relevant foundations are [evidence independence](../../../foundations/01-evidence-independence.md) and [AI control](../../../foundations/05-ai-control-and-oversight.md).

### Ontology and the scope of a safety claim

Consider four distinct claims:

1. The evaluation runner completed the intended tests.
2. The model produced no detected failure on those tests.
3. The evaluation provides evidence about a specified deployment condition.
4. The evidence meets the approval criterion for that deployment.

Each step requires additional assumptions or checks.
The second claim cannot establish the fourth by wording alone.
The record must identify the model version, evaluated cases, environment, measured property, and intended decision.

[INTERPRETATION] Many proposed ontology interventions target semantic promotion: evidence for one claim becomes support for a stronger claim.
Construct validity asks whether the measurement supports the intended interpretation [T5].
The paper's fairness setting motivates this connection; transfer to safety evaluation is a proposed application.

If a record is absent, the system must distinguish not tested from tested without a detected failure.
If a test used an old model version, the result remains about that version unless an explicit transfer argument applies.
B01 and B07 examine these distinctions.

### Rashomon and competing explanations

Three concepts must remain distinct:

| Concept | What varies | Appropriate research question |
|---|---|---|
| Rashomon narrative effect | Accounts of one event | Which account omits or frames which evidence? |
| Causal underdetermination | Mechanisms compatible with observations | Which intervention would distinguish their predictions? |
| Predictive Rashomon set | Models with similar loss within a defined class | How differently do similarly accurate monitors judge a case? |

[ESTABLISHED] The predictive Rashomon literature studies multiple similarly performing models [T3].
It does not establish that those models identify the event's true cause.
Several causal accounts can also fit one record without constituting a predictive Rashomon set.

[SPECULATION] An investigator could preserve several explanations until a diagnostic test separates them.
Instead of demanding a confident causal label, the evaluation could reward useful investigation and justified uncertainty.
B02 explores this direction. B04 instead studies prediction differences among a bounded set of monitors.
Pearl's account of causal inference supplies the framework for stating assumptions about interventions [T4].

### Focal points and power-market rules

A focal point is a salient option that agents expect others to select.
Schelling describes coordination without direct communication in his primary interview [T2].
A public signal can make an option salient even when agents cannot exchange private messages.
Its visibility alone does not establish common knowledge or harmful coordination.

[ESTABLISHED] Cooke's electricity-market report discusses regulated retail prices as possible policy-induced focal points [T7, printed page 29].
This is a specific institutional warning. It is not evidence that every wholesale price cap produces collusion.

[SPECULATION] A public safety threshold or example policy could similarly concentrate choices among AI agents.
However, concentration can arise through ordinary shared salience.
An experiment must separate baseline similarity from incentive-dependent adjustment and verify an outside cost before claiming collusion.
Ballestero and colleagues already examine baseline similarity and strategic coordination in AI games [T8].
Järviniemi directly studies focal-point subversion of a policy-monitor protocol [T9].
B16 therefore proposes a bounded replication and transformation comparison; its novelty remains unverified.

### Reliability and common causes

Several review layers can depend on one report, tool, dataset, or scoring function.
A shared defect can therefore defeat multiple layers.
Formal algorithmic monoculture work shows why joint outcomes require analysis beyond individual algorithm accuracy [T6].
Its decision setting does not directly establish failure rates for AI safety monitors.

[SPECULATION] A useful transfer from power-system contingency reasoning is to remove or corrupt one shared review dependency.
Then test whether the remaining protocol still prevents the specified harm.
This is an experiment design, not a claim of compliance with a power-system reliability standard.
B05 and B11 compare additional opinions with additional failure coverage.

### Incentives and mechanism design

A principal-agent problem occurs when a delegating actor and an acting agent have different objectives or information.
Mechanism design asks which rules and information arrangements support the desired collective outcome.
Cheap-talk and persuasion models distinguish what an agent says from why it says it [R7, R8].

The original sprint exposed a key design problem: independent endorsement could already earn the desired approval.
Thus, direct communication was often unnecessary for harm.
A new coordination environment must first establish that joint adjustment adds something a single agent cannot achieve alone.

[SPECULATION] Some approval rules may reduce harm even when the cause remains unresolved.
For example, an independently checked artifact requirement can block an invalid action without diagnosing intent.
AI control supplies existing work on outcome protection under intentional subversion [R11].
B08 and B14 need a specific comparison beyond that established framing.

### More industry connections worth exploring

These are design lenses, not claims about implemented industry standards.

| Industry lens | Proposed transfer | Necessary boundary |
|---|---|---|
| Financial reporting | Check the denominator and completeness of a reassuring report. | Accurate sentences do not establish dishonest intent; define a reporting requirement. |
| Engineering certification | Tie a certificate to a version, scope, and operating condition. | A valid certificate structure cannot establish the truth of its inputs. |
| Incident investigation | Choose evidence that separates candidate causes. | Investigator narratives alone cannot identify the causal mechanism. |
| Records management | Preserve uncertainty through summaries and persistent memory. | Compression can be legitimate; measure the loss of support or scope. |
| Independent protection layers | Measure additional failures caught by each review stage. | More reviewers do not necessarily create more evidence independence. |
| Market mechanism design | Change rules so harmful strategies become less effective. | Human equilibrium assumptions need testing before transfer to language models. |

## 4. Formalism

### Belief from dependent evidence

Let H be the safety-relevant claim and E the observed evidence.

    posterior odds(H | E) = prior odds(H) × P(E | H) / P(E | not H)

For several evidence items, the joint likelihood ratio is the relevant quantity.
Multiplying individual ratios requires conditional independence under both H and not H.
Three endorsements do not establish that condition.

### Identification through distinguishing tests

Let C(E) contain candidate causal explanations compatible with evidence E under stated modeling assumptions.
If two explanations assign the same observable distribution, E alone cannot distinguish them.
A useful intervention must produce different predicted observations under those explanations.
Successful identification still depends on the assumptions and candidate class [T4].

### Predictive Rashomon set

For a specified model class F, loss L, dataset D, and tolerance epsilon:

    R_epsilon = {f in F : L(f; D) <= inf[g in F] L(g; D) + epsilon}

Predictive multiplicity concerns differences in f(x) among models in this set.
Choose candidates on development data and evaluate consequential disagreement on held-out cases.
The set is relative to F, D, L, and epsilon [T3].

### Harmful outcomes that every reviewer misses

Let M_i mean that reviewer i misses a verified defect. The protocol's joint miss probability is:

    P(M_1 and M_2 and ... and M_k)

It equals the product of individual miss probabilities only if the miss events are mutually independent.
Estimate the joint event directly on matched artifacts and report uncertainty.
Also measure unwarranted flags, useful approvals, and review cost.

### Decisions under unresolved causes

One conservative proposed decision rule is:

    a_star = argmin[a] max[c in C(E)] ExpectedLoss(a | E, c)

This rule chooses an action with the smallest worst-case expected loss over the retained explanations.
It is an optional modeling choice, not a universal rule of rationality.
Its value depends on the candidate causes and losses, including delay and unnecessary deferral.
Bayesian alternatives require explicit prior probabilities over candidate explanations.

## 5. Example

An agent tests model version V1 and writes: 'No unsafe behavior was detected.'
The report omits a failed test batch. Two reviewers endorse it.
A deployment request concerns version V2 under different tool permissions.

The ontology question concerns the shift from V1 test results to V2 deployment approval.
The epistemology question concerns the two endorsements' dependence on one report.
The causal question asks whether the omission came from a runner failure, ordinary error, or strategic selection.
The game-theory question asks whether a public approval criterion encourages such omissions.
The decision question asks whether missing coverage already justifies further testing.

An investigator could request another review of the report, inspect the trusted run manifest, or rerun the missing batch.
B06 compares complete reporting checks. B09 compares the value of those requests.
B14 asks whether the decider can block the unsupported approval while leaving the cause unresolved.

The example is constructed. It is not evidence that a deployed agent has pursued this strategy.

## 6. Significance

[INTERPRETATION] The strongest shared direction concerns the evidence supporting AI safety decisions.
If agents generate that evidence, reviewers need to check what it establishes and which dependencies it contains.
An oversight protocol must also specify what action follows from unresolved uncertainty.

A useful project can improve one link in this chain:

    agent work -> measurements -> claims -> endorsements -> permission -> consequences

A small experiment cannot establish reduced catastrophic risk directly.
It can test a mechanism that could undermine evaluation of more capable systems.
Its report must identify the intended user, the changed decision, and the conditions for transfer.

Three promising combinations remain open:

1. **Claim scope and complete reporting:** combine B01, B06, and B07 in executable safety evaluations.
2. **Public coordination cues and control rules:** combine B03 and B08 after reviewing T8.
3. **Competing explanations and efficient investigation:** combine B02, B09, and B14.

These are editorial judgments, not evidence-based rankings or project commitments.
The first combination has a direct link to an evaluation decision and independently checkable artifacts.
The second has substantial prior-work overlap and needs a task where coordination adds harmful capability.
The third needs cases whose initial ambiguity is genuine and whose interventions have diagnostic value.

The prior-work review narrows these combinations to B15, B16, and B17.
Omission attacks already appear in SLEIGHT-Bench [S14].
Tool-using investigators and active causal experiments appear in AuditBench [T10] and CausalGame [T11].
The candidate briefs explain the proposed comparisons instead of claiming these broad ideas as new.

## Maintaining this section

Edit `ideas.json` to add or revise a record. Keep stable ids and preserve reasons for rejection.
Run the landscape `report` command from `lab/` to regenerate the idea cards and map.
The map includes idea-to-topic and idea-to-idea edges labeled speculation.
The idea bank is stored as versioned files; the SQLite evidence database does not hold these proposals.
Portable backups include the entire brainstorming directory.

Promote an idea only after identifying a concrete workflow, closest prior work, measurable failure, and feasible intervention.
Register a hypothesis in `hypotheses/HYPOTHESES.md` only when ready to commit to its prediction and falsifier.
No idea here implies authorization to spend application programming interface credits.
