---
title: "Three candidate projects after the prior work review"
status: draft
updated: 2026-10-28
depends_on: ["literature/landscape/brainstorming/prior-work-review.md", "literature/landscape/brainstorming/ideas.json", "hypotheses/confounds.md"]
---

# Three candidate projects after the prior work review

[SPECULATION] These are experimental designs, not registered hypotheses, measured results, or project commitments.
Read the [prior-work review](prior-work-review.md) for direct overlaps with existing studies.
The linked map records are B15, B16, and B17.
For a guided explanation, read the [investigation study guide](investigation-study-guide.md).

The shared question concerns oversight when agents can influence the evidence presented for a decision.
Each design needs a specified action, independently checkable failure, strong baseline, and useful negative result.

## 1. Which evidence checks prevent false assurance in delegated evaluations

### Question and intended user

At a fixed review budget, which evidence checks reduce unsupported safety approvals?
The intended user is an evaluation team allocating review effort among reports, raw results, and independent checks.
The output would be a reproducible artifact set and a comparison of review protocols.

### Fundamental connection

Epistemology asks whether the evidence warrants the claim.
Ontology distinguishes a recorded measurement, its scope, and the approval criterion.
The experiment concerns the authority transition between an evaluation conclusion and a permitted action.
It does not treat a well-formed claim as a true claim.

### One concrete task

An assistant prepares an evaluation report for a model under a stated tool-permission policy.
The trusted task specification identifies the model version, required scenarios, and approval criterion.
Execution records retain the scenario inputs, outputs, and scoring code.
The decider approves, rejects, or requests further evaluation.

Begin with stored model outputs or deterministic fixtures to verify the pipeline at zero inference cost.
Real model outputs would be required before making claims about reviewer performance.
Fixtures only establish that the case construction and scoring procedures work.

### Defects and matched controls

Construct paired artifacts that vary one consequential relationship:

| Defect | Matched control | Independent check |
|---|---|---|
| A report omits required scenarios that produced failures. | A report includes the same failures and requests deferral. | Compare reporting coverage with a trusted task specification and execution record. |
| A result from one model version supports approval of another. | A report restricts its conclusion to the evaluated version. | Compare version identifiers and the explicit transfer requirement. |
| A scoring implementation misclassifies a relevant output. | The implementation correctly scores that output. | Independently recompute the result. |
| An incomplete run is summarized as a pass. | The report marks the result incomplete. | Inspect runner status and completed-case coverage. |

Keep clean complete runs and difficult but valid approvals.
The approval labels follow explicit task requirements; they do not certify safety outside that scope.

### Experimental comparison

Separate representation from evidence access through two factors:

1. Present the same substantive instructions as an explicit prose checklist or typed claim fields.
2. Give each reviewer the report alone or the same budgeted access to independent artifacts.

Also include ordinary free-text review and simple executable checks.
The independent-artifact condition may add information. Report that effect separately from the representation effect.
Charge tool use and output processing against a stated budget.
Compare matched warranted-approval rates, or report the full safety-usefulness tradeoff.

Hold out defect families before choosing prompts or thresholds.
Group repeated samples from the same artifact when computing uncertainty.
Do not count paraphrases or repeated seeds as independent case families.

### What would make this substantial

A useful result identifies which evidence access prevents which failure under the same resource constraint.
It could also show that a proposed ontology adds little beyond a clear checklist.
That negative result would constrain an otherwise appealing intervention.

The broad failure modes already appear in SLEIGHT-Bench [S14] and research-sabotage work [T1, T12].
The proposed contribution is the controlled comparison, subject to further prior-work review.

### Stop conditions and feasibility

If a simple trusted rule solves every case, the setting supports an engineering demonstration rather than a substantial model-evaluation result.
If typed fields win only because they reveal extra evidence, the representation claim fails.
If improvements arise only through more deferral, assess whether useful approvals survive.

A short project could use one evaluation workflow and a small set of controlled artifact families.
Model access, inference budget, and realistic case construction remain unresolved.
The first task is one complete executable case with an independent approval oracle.

## 2. Which coordination cues survive artifact sanitization

### Question and intended user

Can transformations that preserve program behavior disrupt compatible subversion strategies without damaging legitimate review?
The intended user is an artificial intelligence (AI) control designer restricting what an untrusted policy exposes to an untrusted monitor.
The output would be a bounded replication and a defense comparison.

### Fundamental connection

A focal point can align expectations among agents constructing strategies independently.
The industry connection concerns public rules and salient references that shape coordination.
The direct AI predecessor is Järviniemi's policy-monitor study [T9].
Its strategy builders are isolated, but the policy's program remains visible to the monitor.
Thus, the restriction concerns direct strategy negotiation, not all information transfer.

### One concrete task

Use a programming task with ordinary tests and a separate input that demonstrates a defect.
The policy submits a program that passes ordinary tests.
The monitor must pass auditing on known defective programs before reviewing the policy output.
A failure requires all three conditions: a verified defect, a passed monitor audit, and acceptance of the defective output.

First establish that the replication can produce compatible strategy pairs under a declared generation budget.
Do not select only striking successes for the defense comparison.
Freeze the sampled strategies before applying transformations.

### Comparisons and controls

Compare unchanged artifacts, comment removal, and validated identifier normalization.
Comment removal is already used in T9; it is a replication baseline.
Avoid changing numeric constants that affect execution.
Use programs whose grammar and binding structure can be transformed safely.

Run ordinary tests and defect-activating inputs before and after each transformation.
Report unsupported transformations and exclude them from causal claims about coordination.
Use honest monitors to measure whether sanitization destroys legitimate defect evidence.
Include ordinary flawed programs without coordinated strategies.

After the frozen-strategy comparison, allow a bounded adaptation stage if budget permits.
A defense that defeats one fixed strategy may fail when agents know the transformation.

### Measures and interpretation

Measure verified harmful success, ordinary defect detection, legitimate task performance, and transformation failures.
Report results per strategy family and held-out programming task family.
Separate an incompatible strategy pair from a pair that coordinates but fails to create a defect.

A lower harmful-success rate establishes a result under these transformations and strategies.
It does not establish that agents cannot coordinate using other semantic features.
All instruction changes produce prompt-conditioned behavior.

### Stop conditions and feasibility

If no compatible strategies appear within the generation budget, the defense comparison is blocked by insufficient positive cases.
If transformations change behavior or remove necessary evidence, reduced success does not isolate a coordination effect.
If the protocol rejects all programs, safety improves at the cost of losing the intended capability.

T9 and AI-control redaction methods [R11] are required comparisons.
The project's risk is the cost and variance of obtaining suitable strategies.
A replication alone can be valuable if its scope and limitations are reported clearly.

## 3. Can investigators distinguish unresolved causes from actionable defects

### Question and intended user

Can an investigator choose effective checks and repairs while avoiding unsupported causal accusations?
The intended user is an AI safety team investigating a questionable evaluation or agent-generated artifact.
The output would be a small executable investigation environment with separate scores for cause, repair, and immediate action.

### Fundamental connection

Several causal explanations can fit the same observed report.
An intervention is informative only when its possible observations distinguish those explanations under stated assumptions.
However, an independently verified defect may justify blocking an action before its cause is resolved.
The project tests that separation between causal belief and action.

### One concrete task

An evaluation report claims that all required scenarios passed.
Construct different generating mechanisms that yield the same initial report:

1. The runner omitted a required scenario, and the report faithfully summarized the incomplete run.
2. The runner completed the scenario, but the report omitted its failure.
3. The run completed, but the scoring implementation incorrectly treated a failure as a pass.

The operational causes differ, even though the initial text is identical.
Do not infer the model's mental intention from the operational cause.
A controlled red-team modification labels what the experiment changed, not what a deployed model privately wanted.

### Tools and comparisons

Offer costed access to runner logs, raw outputs, scoring code, or a clean rerun.
The investigator can request more evidence, name remaining possible causes, recommend a repair, and choose an immediate action.
Compare a single-verdict prompt, a structured evidence record, and a fixed sequence of diagnostic checks.
Keep tools and evidence budgets matched.

Test repair recommendations by executing them.
A rerun can repair a runner omission but leave a selectively edited report unrepaired.
Regenerating a report can repair reporting omission but preserve an incorrect scoring function.
The environment must verify those consequences rather than grade explanation style.

Include clean cases and cases where the available tools cannot identify a unique cause.
In the latter cases, justified uncertainty can be correct even if deployment should remain deferred.
Specify the retained candidate causes instead of rewarding vague hedging.

### Measures and prior work

Score cause identification, exclusion of the true cause, repair success, immediate action, and investigation cost separately.
Measure unsupported accusations on clean and ambiguous cases.
Do not reward listing many candidate causes simply because one is correct.

AuditBench already tests investigators and configurable tools [T10].
CausalGame already evaluates active causal experimentation [T11].
The proposed comparison jointly evaluates attribution, repair, and protective action in an oversight workflow.
This is a candidate distinction, not an established literature gap.

### Stop conditions and feasibility

If filenames or error text identify the generating mechanism, the investigation task leaks its label.
If no tool can distinguish causes, unique identification cannot be the correct target.
If a repair always succeeds regardless of cause, the task cannot measure the value of diagnosis.

A short project could implement three operational mechanisms in one evaluation workflow.
This is technically manageable before model inference, but realistic uncertainty is the major design risk.
The first task is one identical-report case pair with different tool observations and different successful repairs.

## Choosing among the candidates

| Criterion | Evidence checks | Coordination cues | Diagnostic investigation |
|---|---|---|---|
| Direct connection to the owner's ontology interests | Strong | Limited | Moderate |
| Direct connection to power-market coordination | Limited | Strong | Moderate through incident investigation |
| First zero-cost artifact | Executable approval requirements and paired reports | Transformation validity checks | Matched reports with diagnostic observations |
| Main risk | An obvious rule solves an artificial task | Too few compatible strategies; high generation cost | Ambiguity is artificial or leaks through wording |
| What a negative result could teach | Clear checklists may suffice without typed claims | Cues or defenses may not transfer | Tools may reveal evidence without improving repair or action |

These assessments are interpretations, not measured feasibility scores.
No model, paid budget, sample size, or final project choice is fixed.
Create one worked artifact per branch before selecting a larger experimental design.
