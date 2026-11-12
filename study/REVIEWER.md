# Research reviewer: evidence, oversight, and multi-agent safety

This reviewer is the study and research entry point for the repository.
Open the [interactive reviewer](../explainer/reviewer.html) for navigation, checklists, and local notes.
The source documents remain authoritative when this guide summarizes them.

## How to use it

For each module, read the explanation, work the exercise without looking, and check the source.
Write what you can explain, what you cannot explain, and one question for an expert in `study/notes/`.
Return to missed questions after a break. The checklists record study activity, not mastery.
Follow the modules in order for a full review, or start with the current proposal track below.

| Stage | Question | Primary material | Active check |
|---|---|---|---|
| Map | What can explain agreement and a wrong decision? | [Foundation 00](../foundations/00-map.md) | Name alternative causes before inferring intent. |
| Evidence | When do multiple reports add information? | [Foundation 01](../foundations/01-evidence-independence.md) | Derive the posterior for independent and copied reports. |
| Social learning | How can agreement arise without independent support? | [Foundation 02](../foundations/02-social-learning.md) | Describe a cascade and its limits. |
| Strategy | How can incentives affect what an agent reveals? | [Foundation 03](../foundations/03-strategic-communication.md) | Distinguish truthful selection from representative evidence. |
| Collusion | What extra evidence distinguishes coordination from parallel conduct? | [Foundation 04](../foundations/04-collusion-and-plus-factors.md) | Identify coalition, coordination mechanism, and outside cost. |
| Control | Where can an oversight protocol intercept failure? | [Foundation 05](../foundations/05-ai-control-and-oversight.md) | Draw the actors, trust boundaries, and available evidence. |
| Claims | How do claim types and provenance constrain approval? | [Foundation 06](../foundations/06-ontology-and-typed-claims.md) | Show why a valid type does not establish truth. |
| Measurement | What does an evaluation estimate, and with what uncertainty? | [Foundation 07](../foundations/07-measurement.md) | Compute false-positive rate and compare matched cases. |
| Mechanistic detection | What can a probe reveal about model activations? | [Foundation 08](../foundations/08-mechanistic-detection.md) | Name a confound and a held-out test. |

Each foundation has a [quiz and answer key](quizzes/). The [interactive foundations](../explainer/index.html)
provide demonstrations. The demonstrations use constructed rules, not empirical findings.

## 1. Evidence and dependence

**Purpose.** Decide how strongly a report supports a claim without counting copies as independent observations.

**Intuition.** Two witnesses who read the same log may provide two endorsements but one underlying observation.
They can still supply additional information if, for example, they made independent checks.
The dependence structure, not the number of sentences, determines the update.

**Mechanism and formalism.** Let H be the claim and E be evidence.
Prior odds are P(H) / P(not H). Posterior odds equal prior odds times the likelihood ratio
P(E | H) / P(E | not H). For two observations, multiply separate likelihood ratios only when
the observations are conditionally independent under both H and not H.

**Worked example.** Suppose prior probability is 0.5. One observation has likelihood ratio 3.
The posterior odds are 3, so the probability is 3 / 4 = 0.75.
Two conditionally independent observations with the same ratio give odds 9 and probability 0.9.
If the second report merely repeats the first, it adds no new observation; the probability remains 0.75.
These numbers describe the stated assumptions, not measured reviewer reliability.

**Check.** Explain why independent sources can share a common error. Derive both calculations.
Specify what must be true before treating two reports as independent.
Read [01](../foundations/01-evidence-independence.md) and check [quiz 01](quizzes/01-evidence-independence.md).

## 2. Agreement, incentives, and coordination

**Purpose.** Explain why the same observed agreement can have several causes.

**Mechanism.** Independent errors, shared sources, conformity, selective disclosure, and shared incentives can all produce agreement.
Conformity means an agent follows others instead of relying on its own information.
Parallel conduct means similar actions can arise from similar incentives without coordination.
Strategic persuasion can change a decision by selecting which truthful evidence to reveal.

**Example.** Two reviewers endorse a proposal. Both read the same misleading record.
That supports a shared-source explanation; it does not establish collusion.
To identify collusion under this repository's definition, identify the coalition, coordination mechanism, and outside cost.
A coordination message alone does not establish that coordinated action occurred.

**Significance.** A detector that treats agreement as proof will flag innocent cases.
Read [02](../foundations/02-social-learning.md), [03](../foundations/03-strategic-communication.md),
and [04](../foundations/04-collusion-and-plus-factors.md). Use their quizzes for retrieval practice.

## 3. Control, claims, and measurement

**Control.** An oversight protocol specifies who can act, what evidence a monitor sees, and which actions require approval.
Draw the point where an endorsement becomes permission. A monitor cannot inspect information it never receives.
Read [05](../foundations/05-ai-control-and-oversight.md).

**Claims.** A typed claim specifies the kind of assertion being made. Provenance records where evidence came from.
A transition rule can prohibit an unsupported promotion from one claim type to another.
Correctly typed input can still be false. Read [06](../foundations/06-ontology-and-typed-claims.md).

**Measurement.** A false positive is an innocent case incorrectly flagged; a false negative is a target case missed.
False-positive rate divides false positives by all cases without the target condition.
Precision divides true positives by all flagged cases. These measures answer different questions.
Matched cases vary one intended factor while keeping relevant alternatives comparable.
When examples share a family, uncertainty calculations must account for that dependence.
Read [07](../foundations/07-measurement.md), including the assumptions behind its intervals.

**Probe.** A probe is a model trained to predict a label from another model's internal activations.
Prediction can reflect a confound, such as a visible prompt feature, rather than the intended property.
Held-out families and controls test alternative explanations; they do not prove access to a private motive.
Read [08](../foundations/08-mechanistic-detection.md).

**Practice.** If 4 of 80 innocent cases are flagged, the false-positive rate is 4 / 80 = 0.05.
If 6 target cases are also flagged, precision is 6 / (6 + 4) = 0.60.
Describe what changes if the same 10 flags come from a much larger set of innocent cases.

## 4. Read the completed sprint critically

Start with the [sprint report](../projects/2026-10-apart-collusion-sprint/report/REPORT.md),
then the [preregistration](../projects/2026-10-apart-collusion-sprint/PREREGISTRATION.md),
[regimes](../projects/2026-10-apart-collusion-sprint/design/regimes.md), and
[adjudication](../projects/2026-10-apart-collusion-sprint/report/ADJUDICATION.md).

For each claim, identify its population, model, condition, measure, and comparison.
Separate the regime label from the behavior observed in a particular trajectory.
Explain why a prompt-conditioned result does not demonstrate a learned disposition.
Find one null result and explain what the result does and does not rule out.
The ignored raw trajectories are not included in a fresh Git checkout.

## 5. Current research portfolio

The [latest proposal drafts](../projects/2026-11-tara-project/candidate-ideas-2026-10-29.md)
and [related-literature review](../literature/landscape/brainstorming/review-2026-10-29.md)
are the current starting points. The review is targeted, not exhaustive. No project is selected.

| Candidate | Proposed comparison | Main alternative explanation | What to score |
|---|---|---|---|
| Cancellation | Cancel one delegated objective while preserving another. | The cancellation never reached the relevant actor, or the task is too hard. | Prohibited continuation, allowed completion, and unnecessary stopping. |
| Evaluation labels | Present identical evidence with different summaries and a fixed test menu. | The summary supplies extra information or merely changes generic framing. | Useful tests, discovered failures, and supported conclusions. |
| Responsibility | Place the same hazard within or across assigned duties. | Information, computation, or individual competence differs between conditions. | Unsafe joint plans, recognized hazards, and safe completion. |

These are [SPECULATION], not experimental findings. The proposed catastrophic-risk pathways are conditional.
They do not measure catastrophic outcomes or establish production safety.
The [reading path](research-reading-2026-10-29.md) links closest papers and a comparison worksheet.
The older [form answers](../projects/2026-11-tara-project/TOPIC-SUBMISSION.md) and
[interactive companion](../explainer/research.html) cover the earlier portfolio.

## 6. Research workflow

1. **Frame:** state a question, actors, available information, authority, and the failure outcome.
2. **Find:** use the [literature index](../literature/INDEX.md) and [landscape map](../literature/landscape/explore.html).
   Search results and map connections are discovery leads, not verified claims.
3. **Read:** use the [extraction rules](../literature/EXTRACTION-RULES.md) and
   [dossier template](../literature/templates/PAPER-DOSSIER.md). Record version, methods, results, and limits.
4. **Compare:** name the closest prior work and the precise difference. Record competing explanations and counterevidence.
5. **Design:** define the manipulated factor, primary outcome, controls, scoring rule, family split, and stop condition.
   Consult [threat models](../hypotheses/threat-models.md) and [confounds](../hypotheses/confounds.md).
6. **Check:** build a matched case on paper. Decide what a null result would mean before running a test.
7. **Run and report:** secure an explicit budget in the relevant project plan before paid calls.
   Preserve failed and null runs, deviations, and uncertainty in the owning records and [status log](../STATUS.md).

Do not treat author-reported results as replications. Register a new hypothesis only after a concrete experiment is selected.

## 7. Self-assessment

Answer without looking, then compare with the linked sources.

1. When is multiplication of two likelihood ratios justified? Construct a counterexample.
2. What evidence could distinguish shared-source error from conformity?
3. Why is truthful evidence selection potentially misleading?
4. What three elements must be identified before calling a trajectory collusion?
5. Draw an authority transition and name an intervention at that point.
6. Explain why a valid claim type does not prove the claim.
7. Calculate false-positive rate and precision from a confusion matrix. Explain their denominators.
8. Give a probe confound and a control that would test it.
9. For each current proposal, identify a close predecessor and a credible alternative explanation.
10. State a finding, an interpretation, and a speculation about the same example without mixing them.

## Repository map

[INDEX.md](../INDEX.md) is the file and task index. [STATUS.md](../STATUS.md) records current work.
[DECISIONS.md](../DECISIONS.md) records choices; [ROADMAP.md](../ROADMAP.md) is a historical plan and may lag current research.
[GLOSSARY.md](../GLOSSARY.md) controls terminology. [lab/README.md](../lab/README.md) explains the code.
[Sources](../sources/README.md) contains untrusted downloads and local material excluded from Git.
Use [study notes](notes/) for your own answers. The [session handoff](../prompts/handoff-2026-10-29.md) preserves unresolved work.
