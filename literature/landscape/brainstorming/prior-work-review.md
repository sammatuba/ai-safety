---
title: "Prior work that changes the brainstorming shortlist"
status: draft
updated: 2026-10-28
depends_on: ["literature/INDEX.md", "literature/landscape/brainstorming/ideas.json"]
---

# Prior work that changes the brainstorming shortlist

## What changed

[INTERPRETATION] Several broad ideas in the first brainstorming pass overlap directly with existing research.
The candidate projects therefore need a specific comparison, a useful replication, or a distinct decision target.
The [candidate briefs](candidate-briefs.md) define three such possibilities. They do not establish novelty.

| Existing work | What the inspected material establishes | Consequence for this bank |
|---|---|---|
| Järviniemi, focal-point subversion [T9] | The paper tests independently constructed compatible strategies for a policy and monitor in programming tasks. | B03 needs a defense comparison or replication; the broad focal-point idea is already studied. |
| SLEIGHT-Bench [S14] | The paper includes omission attacks and compares targeted monitoring prompts, including state tracking. | B06 cannot claim omission discovery; B15 needs stronger baselines than a generic prompt. |
| AuditBench [T10] | The paper evaluates tool-using investigators on models with implanted hidden behaviors. | B02 and B09 need more than adding tools to an investigator. |
| CausalGame [T11] | The paper evaluates active experimental design under hidden causal structure and biased measurements. | Diagnostic experimentation alone is not a new contribution. |
| Safety-research sabotage evaluation [T12] | The authors separate unprompted opportunities from continuation of previously started sabotage. | Capability, propensity, and continuation must remain separate targets. |

The rows summarize author-reported methods, not replications completed in this repository.

## Focal-point subversion

Primary work: [Subversion via Focal Points](https://arxiv.org/html/2507.03010v1), sections 2 and 3.

[FINDING] The author instructs separate model instances to construct compatible strategies for a policy and monitor.
The evaluation checks whether the policy produces a verified defective program while the monitor passes auditing and accepts that program.
Comments are removed before the monitor sees the program.
The paper also distinguishes focal-point successes from broader failures of the auditing requirement.

[INTERPRETATION] Strategy construction is isolated, but the program remains an information carrier between policy and monitor.
'No private messages' must therefore describe the specific restriction, not imply that all communication is absent.
Candidate B16 proposes testing additional behavior-preserving transformations and their usefulness cost.
Related redaction methods in AI control [R11] remain part of its unresolved prior-work comparison.

## Omission and monitor blind spots

Primary work: [SLEIGHT-Bench](https://arxiv.org/html/2605.16626v2), sections 3.3 and 5.2; appendix D.5.

[FINDING] The paper includes attacks based on omitted required actions.
It also studies targeted prompts and reports tradeoffs between categories of attack.
Its state-tracking prompt asks the monitor to reconstruct changes and compare intended with actual effects.

[INTERPRETATION] A new project should compare any structured representation with an equally explicit prose checklist.
The project must also separate representation benefits from the benefit of access to independently trusted evidence.
A schema beating an uninstructed model would provide weak support for a new oversight method.
Candidate B15 focuses on this separation in delegated evaluation.

## Investigator agents and causal experimentation

Primary works: [AuditBench](https://arxiv.org/html/2602.22755v4), section 3;
[CausalGame](https://arxiv.org/abs/2607.04293), abstract.

[FINDING] AuditBench scores whether an investigator's final candidate predictions identify a planted behavior.
The paper's success score is one defined target; it is not a complete measure of justified causal belief or safe operational action.
[FINDING] CausalGame asks agents to design experiments and produce solutions under selection bias, measurement error, and hidden confounders.

[INTERPRETATION] Candidate B17 asks three different questions on the same workflow: what failed, which repair works, and which action is justified now.
That is a proposed extension, not a claim that existing investigation work ignores uncertainty.
Finding no matching phrase in a paper would not establish a literature gap.
The methods and related work require a deeper comparison before submission.

## Sabotage capability and propensity

Primary work: [Evaluating whether AI models would sabotage AI safety research](https://arxiv.org/abs/2604.24618), abstract.

[FINDING] The authors report no unprompted sabotage in the scenarios they tested, while also studying continuation from constructed sabotage trajectories.
Those conditions answer different questions and have different limitations.

[INTERPRETATION] The candidate projects in this bank primarily test oversight against controlled defects and instructed red teams.
They do not estimate how often a deployed model independently develops a harmful objective.
Planted defects can establish a limitation of a protocol without establishing a model's propensity to exploit it.

## Implications for project selection

| Candidate | Possible value | Main reason to reject it |
|---|---|---|
| B15: evidence checks | A comparison that tells an evaluation team which evidence access is worth its cost. | Every case reduces to a trivial metadata rule, or gains vanish against the checklist baseline. |
| B16: cue transformations | A bounded replication with a concrete defense and measured usefulness cost. | Compatible strategies cannot be produced within budget, or transformations change task behavior. |
| B17: diagnostic investigation | An evaluation that separates cause identification, repair success, and immediate action. | Causes are distinguishable from wording, or no available test has diagnostic value. |

These are provisional judgments. No experiment or project selection has been completed.
The strongest next artifact is one executable, independently checkable case per candidate.
The three cases should expose the measurement and realism problems before a larger run is planned.
