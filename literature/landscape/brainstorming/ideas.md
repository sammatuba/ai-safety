---
title: "Research brainstorming idea cards"
status: draft
updated: 2026-10-28
depends_on: ["literature/landscape/brainstorming/ideas.json"]
---

# Research brainstorming idea cards

Generated from `ideas.json`. Edit the canonical records and regenerate the map.

[SPECULATION] Every record is a proposal. No experiment result or novelty claim is implied.

Read the [concept guide](README.md) and [reference index](../../INDEX.md).

## B01 When does an evaluation claim become permission to deploy

**Lens:** Ontology. **Industry:** Engineering certification. **Scope:** Three-week candidate.

**Question:** Can explicit claim types stop evidence for a narrow test result from becoming approval of a broader safety claim?

**Conceptual basis:** Ontology separates the objects and predicates in a claim. Construct validity asks whether the measurement warrants the intended interpretation.

**Mechanism:** A report moves from 'no failure observed on these evaluated cases' to 'the model is safe for this deployment'. The missing scope conditions disappear.

**Limit of the industry connection:** Certification is an industry-inspired design lens here. A valid claim structure cannot make a false measurement true or establish deployment safety.

**Safety relevance:** An unsupported safety claim could authorize deployment or suppress further investigation. A scope check acts at that authority transition.

**Experiment:** Build executable small-model evaluations with paired reports. Keep results fixed while varying task scope, time, model version, and approval language. Compare free-text review, typed claims, and typed claims checked against trusted run metadata.

**Measures:** Unsupported approvals; warranted approvals; unnecessary deferrals; review cost. Include maliciously incorrect metadata as a separate condition.

**Reason to stop or redesign:** If benefits disappear when both protocols receive the same information and review budget, there is no evidence for the structural intervention.

**Proposed comparison with prior work:** Proposed comparison: claim scope at the approval step. Existing ontology-aware assurance methods still need review.

**First check:** Implement ten paired cases with machine-checkable run scope before generating model outputs.

**Prior work:** [R11], [T5].

**Related ideas:** B07, B10, B13.

**Map areas:** evaluations, formal-methods, oversight-control.

## B02 Which observation separates competing explanations of failure

**Lens:** Epistemology. **Industry:** Incident investigation. **Scope:** Three-week candidate.

**Question:** Can an investigator choose a useful next test when several causal explanations fit the same agent record?

**Conceptual basis:** Underdetermination permits several explanations of one observation. Causal identification requires assumptions and evidence that distinguish them.

**Mechanism:** The same invalid approval can follow shared evidence, conformity, selective disclosure, or coordination. Another verbal explanation may add little evidence.

**Limit of the industry connection:** Competing causal explanations resemble the Rashomon narrative effect. They are not a predictive Rashomon set, and a simulation's causes may be oversimplified.

**Safety relevance:** A team that identifies the wrong cause may patch an irrelevant prompt while leaving the real route to an unsafe action open.

**Experiment:** Create matched executable failures with a known generating mechanism. Give investigators an initial partial record and a fixed budget to reveal provenance, hide peer outputs, rerun a component, or inspect a raw result. Compare their chosen investigations with random and predetermined checks.

**Measures:** Correct cause set retained; incorrect exclusions; downstream repair success; investigation cost. Score uncertainty when several causes remain compatible.

**Reason to stop or redesign:** If the available interventions cannot distinguish mechanisms even with full access, redesign the case rather than score one explanation as uniquely correct.

**Proposed comparison with prior work:** AuditBench already evaluates tool-using investigators; CausalGame evaluates active causal experiments. Proposed narrower comparison: selecting diagnostic checks and retaining uncertainty in an executable oversight failure.

**First check:** Construct identical initial records under two causes and specify an intervention with different predictions. See candidate B17.

**Prior work:** [T4], [S1], [T10], [T11].

**Related ideas:** B04, B09, B14.

**Map areas:** theory, multi-agent, evaluations.

## B03 Can a public safety threshold become a coordination cue

**Lens:** Game theory. **Industry:** Power markets. **Scope:** Ambitious.

**Question:** Do public thresholds help agents align harmful actions when they cannot send direct messages?

**Conceptual basis:** A focal point is a salient option agents expect others to choose. A public signal can support coordination without a private channel.

**Mechanism:** A visible threshold or reference policy may concentrate choices. Baseline similarity, shared incentives, and strategic response to a cue must be separated.

**Limit of the industry connection:** The electricity source concerns regulated retail reference prices. It does not show that every wholesale price cap causes collusion. Public cues can also improve legitimate coordination.

**Safety relevance:** A control protocol that removes direct messages may still expose common cues that untrusted agents can use. Risk depends on an implemented harmful objective.

**Experiment:** Start with an executable oversight task where one agent can submit a defective artifact and another controls escalation. Randomize a payoff-irrelevant public cue; privately relabel equivalent options; vary incentives; and retain a no-cue control. Verify that option meaning and task difficulty stay matched.

**Measures:** Cue-dependent joint behavior; verified harmful outcomes; baseline action similarity; benefit of a cue beyond the no-cue condition.

**Reason to stop or redesign:** If cue effects occur equally without a coordination incentive, report shared salience. Do not call that strategic coordination or collusion.

**Proposed comparison with prior work:** T9 directly studies focal-point subversion of an audited policy-monitor protocol. T8 separates baseline and strategic similarity. A contribution needs a tested defense or bounded replication, such as B16.

**First check:** Read T9 methods before designing the environment. Distinguish isolated strategy construction from the artifact channel connecting policy and monitor.

**Prior work:** [T2], [T7], [T8], [T9], [R11].

**Related ideas:** B05, B08, B12.

**Map areas:** multi-agent, oversight-control, systemic-risk.

## B04 How much do equally accurate monitors disagree on dangerous cases

**Lens:** Epistemology. **Industry:** Model risk management. **Scope:** Three-week candidate.

**Question:** Can monitors with similar validation accuracy make different decisions on the same consequential cases?

**Conceptual basis:** A Rashomon set contains predictive models with loss close to the best in a specified class. Predictive multiplicity concerns their different predictions.

**Mechanism:** Selecting one monitor by average accuracy can hide variation in which unsafe cases pass. Aggregate agreement may also hide shared misses.

**Limit of the industry connection:** A handful of prompts does not enumerate the Rashomon set of all language models. Define a bounded candidate class and a fixed tolerance.

**Safety relevance:** A safety argument based on one selected monitor may depend on an arbitrary selection among similarly performing alternatives.

**Experiment:** Fit simple monitors on features of executable evaluation artifacts. Define the candidate class and acceptable validation loss before testing. Measure disagreement and joint misses on held-out defect families, then compare a budget-matched combination with individual monitors.

**Measures:** Prediction range per artifact; joint miss rate; warranted approvals; validation-to-test change; review cost.

**Reason to stop or redesign:** If candidate accuracy is too different, match quality before attributing results to predictive multiplicity.

**Proposed comparison with prior work:** Proposed application: multiplicity of safety-monitor decisions. Existing multiplicity work and control ensembles require a closer comparison.

**First check:** Use cheap fitted monitors first; determine whether consequential prediction disagreement exists.

**Prior work:** [T3], [R11].

**Related ideas:** B02, B05, B11.

**Map areas:** evaluations, oversight-control, theory.

## B05 Does independent evidence help more than an additional reviewer

**Lens:** Reliability. **Industry:** Power-system reliability. **Scope:** Three-week candidate.

**Question:** At equal review cost, does a fresh measurement prevent more shared misses than another model opinion?

**Conceptual basis:** Evidence independence differs from the number of agents. A common-cause failure can defeat several review stages at once.

**Mechanism:** Different reviewers may consume one incorrect report, scoring script, or summary. More reviewers can preserve the same blind spot.

**Limit of the industry connection:** Removing one review component resembles a contingency test, but AI monitors lack the engineering guarantees of power-system reliability criteria. No compliance claim follows.

**Safety relevance:** Repeated approvals can create false assurance if every review depends on the same corrupted evaluation artifact.

**Experiment:** Plant scoring and reporting defects with executable ground truth. Compare repeated review of one report, different-model review, and one reviewer with independently recomputed evidence. Inject one shared upstream defect and hold useful work and cost approximately matched.

**Measures:** All-reviewer miss rate; incremental cases caught; unwarranted flags; total cost; honest-task usefulness.

**Reason to stop or redesign:** If recomputation wins only by receiving more budget or stronger labels, the proposed evidence advantage is unproven.

**Proposed comparison with prior work:** Proposed comparison: model variation versus an independently recomputed measurement. Monoculture alone is already established prior work.

**First check:** Pick one metric that can be recomputed cheaply from immutable evaluation outputs.

**Prior work:** [R11], [T6], [T1].

**Related ideas:** B04, B06, B11.

**Map areas:** oversight-control, multi-agent, systemic-risk.

## B06 Can a report be entirely true and still create false assurance

**Lens:** Epistemology. **Industry:** Financial and research reporting. **Scope:** Three-week candidate.

**Question:** Will a reviewer notice that reassuring evidence is selected from an incomplete evaluation?

**Conceptual basis:** Strategic persuasion can change belief through selection. Testimony can be accurate while failing to disclose relevant evidence.

**Mechanism:** A report presents true successful cases but omits failures or changes the denominator. The local sentences remain true while the conclusion becomes unsupported.

**Limit of the industry connection:** The reporting comparison is illustrative. Omission can be ordinary summarization, so score violation of a stated reporting requirement rather than infer intent.

**Safety relevance:** Selective disclosure could make a dangerous capability evaluation appear reassuring and prevent escalation.

**Experiment:** Use a trusted runner to retain all intended test cases and outcomes. Pair complete reports with selectively disclosed reports. Compare summary review, provenance access, and comparison with a trusted test manifest. Include incomplete but explicitly qualified reports as controls.

**Measures:** Approvals despite a violated reporting requirement; missed omissions; unnecessary rejections of qualified reports; review cost.

**Reason to stop or redesign:** If the manifest omits the same cases as the report, the protocol has no independent completeness evidence and cannot establish completeness.

**Proposed comparison with prior work:** S14 already includes omission attacks; T1 studies research sabotage. Proposed comparison: completeness checks with independently trusted records, including strong prompt and simple-rule baselines. See B15.

**First check:** Write exact completeness requirements and generate paired reports from identical execution records.

**Prior work:** [R8], [R14], [T1], [S14].

**Related ideas:** B01, B05, B07.

**Map areas:** evaluations, oversight-control, multi-agent.

## B07 Does unknown evidence become evidence of safety

**Lens:** Ontology. **Industry:** Operational availability records. **Scope:** Three-week candidate.

**Question:** Can explicit unknown states prevent missing or stale evidence from becoming an approval?

**Conceptual basis:** Ontology distinguishes not tested, tested without a detected failure, unavailable evidence, and a warranted approval. These states license different actions.

**Mechanism:** An empty result or old certificate is summarized as 'no safety issues'. Missing evidence silently becomes negative evidence.

**Limit of the industry connection:** A missing outage record does not establish availability; similarly, a missing failure record does not establish safety. Domain-specific approval criteria still differ.

**Safety relevance:** Unavailable or stale evaluations may fail to stop deployment if the decision process treats absence as a pass.

**Experiment:** Vary evidence state while keeping the underlying model and task fixed: completed test, skipped test, failed runner, stale result, or wrong model version. Compare binary pass/fail summaries with explicit states and metadata validation.

**Measures:** Invalid approvals by evidence state; correct deferrals; warranted approvals; number of new tests requested.

**Reason to stop or redesign:** If the protocol defers everything, reduced invalid approvals do not show useful oversight.

**Proposed comparison with prior work:** Proposed application of typed evidence states. Existing assurance and missing-data handling methods need review.

**First check:** Build an explicit state table and define the allowed action for each state.

**Prior work:** [T5], [R11].

**Related ideas:** B01, B06, B10.

**Map areas:** evaluations, formal-methods, deployment.

## B08 Can review rules make harmful coordination unnecessary

**Lens:** Game theory. **Industry:** Market mechanism design. **Scope:** Ambitious.

**Question:** Which information and approval rules reduce harmful outcomes without requiring proof of collusion?

**Conceptual basis:** Mechanism design chooses rules for collective outcomes. A principal-agent problem can remain even if direct communication is blocked.

**Mechanism:** An approval rule can make independent misconduct profitable or can require multiple agents to coordinate. The rule changes the need for a coalition.

**Limit of the industry connection:** A prompt describing a payoff does not implement a financial incentive or train an objective. Begin with executable policies and call language-model tests prompt-conditioned.

**Safety relevance:** A protocol may prevent an unsafe action even when an investigator cannot identify whether its attempted cause was coordination.

**Experiment:** Specify a small game with observable artifact quality and verified harm. Solve scripted-agent cases first. Compare approval rules, randomized independent checks, and restricted evidence selection under matched usefulness. Add language models only after the game requires the intended strategy.

**Measures:** Maximum harmful success among evaluated strategies; honest-task completion; audit cost; sensitivity to the assumed strategy class.

**Reason to stop or redesign:** If a single agent can produce the same harm unaided, the experiment cannot attribute that harm to a coalition.

**Proposed comparison with prior work:** Control protocols already study intentional subversion. Proposed focus: how the approval rule changes whether coordination adds harmful capability.

**First check:** Write and solve the payoff table before building a new language-model environment.

**Prior work:** [R7], [R9], [R11], [T8].

**Related ideas:** B03, B05, B12.

**Map areas:** oversight-control, multi-agent, learning-objectives.

## B09 What evidence should an investigator request next

**Lens:** Decision theory. **Industry:** Incident triage. **Scope:** Three-week candidate.

**Question:** Can a model spend a limited investigation budget on evidence that changes the correct action?

**Conceptual basis:** Value of information measures expected decision improvement. More detailed explanations need not improve decisions.

**Mechanism:** An investigator can choose another opinion, raw measurements, provenance, a rerun, or a counterexample. Their diagnostic value differs by failure mechanism.

**Limit of the industry connection:** The case distribution determines information value. A protocol fitted to one simulated failure mix may not transfer.

**Safety relevance:** Human review is scarce. Poor evidence requests can leave decisive failures unchecked despite extensive discussion.

**Experiment:** Give an investigator a menu of evidence requests with explicit costs. Compare fixed requests, random requests, and adaptive requests. Evaluate on new defect families and report both action quality and retained uncertainty.

**Measures:** Decision loss at a fixed budget; avoidable invalid approvals; unnecessary deferrals; cost per consequential defect found.

**Reason to stop or redesign:** If costs are arbitrary or the investigator sees the answer in a request label, apparent efficiency is not meaningful.

**Proposed comparison with prior work:** Active causal experiments and configurable investigator tools are existing work. A candidate extension scores decision quality, uncertainty, and repair success under a measured evidence budget.

**First check:** Price evidence requests from measured tool usage or human time rather than invented weights.

**Prior work:** [T4], [R11], [T10], [T11].

**Related ideas:** B02, B06, B13.

**Map areas:** oversight-control, human-factors, theory.

## B10 Can an unsupported claim gain authority through repeated summaries

**Lens:** Social epistemology. **Industry:** Records and institutional memory. **Scope:** Three-week candidate.

**Question:** Does a speculative claim become accepted evidence after passing through several agent summaries?

**Conceptual basis:** Epistemic authority affects reliance. Provenance and typed claims can preserve who observed something and what remains uncertain.

**Mechanism:** An agent conjectures, another summarizes, and a later agent cites the summary as confirmation. A circular reference can look like independent support.

**Limit of the industry connection:** Repeated summaries can legitimately compress evidence. The failure is loss of scope or support, not compression itself.

**Safety relevance:** Long-running AI research workflows may use accumulated summaries to justify decisions. An unsupported safety claim could persist across sessions.

**Experiment:** Seed a controlled research memory with one unsupported claim and trace it through matched summarization chains. Compare ordinary text, preserved evidence links, and typed uncertainty. Insert a conflicting raw result and test whether later decisions update.

**Measures:** Unsupported promotions; false independence counts; correction uptake; useful information retained; context cost.

**Reason to stop or redesign:** If the typed version simply receives more evidence or context, match access before interpreting the result.

**Proposed comparison with prior work:** Proposed transfer to persistent safety-research memory. Existing citation and memory-integrity methods need comparison.

**First check:** Define a tiny provenance graph with one supported claim, one conjecture, and one circular reference.

**Prior work:** [R1], [R2], [T5].

**Related ideas:** B01, B07, B11.

**Map areas:** agent-security, data-safety, multi-agent.

## B11 Can review diversity be measured by unique failures caught

**Lens:** Reliability. **Industry:** Independent protection layers. **Scope:** Three-week candidate.

**Question:** Which differences between reviewers actually reduce the chance that every reviewer misses the same defect?

**Conceptual basis:** Algorithmic monoculture concerns shared decision procedures. Evidence independence cannot be inferred from different reviewer names or model providers.

**Mechanism:** Different prompts can yield different explanations but identical misses. Distinct tools or private measurements may instead change failure coverage.

**Limit of the industry connection:** Different error sets can also arise because one reviewer is simply less accurate. Match individual quality and cost before attributing value to diversity.

**Safety relevance:** An oversight protocol may spend heavily on redundant judgments while leaving its most consequential blind spots unchanged.

**Experiment:** Compare reviewer groups differing in model, prompt, evidence, or checking tool. Keep individual accuracy and budget as comparable as possible. Evaluate unique catches and joint misses on held-out defect families.

**Measures:** Joint miss rate; unique consequential catches per additional review; unwarranted flags; cost; stability across defect families.

**Reason to stop or redesign:** If improvements vanish on held-out defects, reviewer differences may fit the development examples rather than improve protection.

**Proposed comparison with prior work:** Proposed operational measure: incremental failure coverage in executable safety evaluations. Ensemble control literature is a required comparison.

**First check:** Build an artifact-by-reviewer error matrix and identify whether any additional review catches a unique failure.

**Prior work:** [T6], [T8], [R11].

**Related ideas:** B04, B05, B10.

**Map areas:** oversight-control, multi-agent, evaluations.

## B12 Does publishing a safety metric change the behavior it measures

**Lens:** Game theory. **Industry:** Market response to public rules. **Scope:** Ambitious.

**Question:** Can public knowledge of an evaluation threshold shift agents toward passing the metric while violating its intended purpose?

**Conceptual basis:** Construct validity connects a measured quantity to a target property. Strategic agents can respond to a public decision rule.

**Mechanism:** A threshold changes behavior, so evidence gathered before agents knew the rule may not predict behavior afterward.

**Limit of the industry connection:** This is a proposed connection to market responses, not a claim that benchmark gaming and market collusion share the same mechanism.

**Safety relevance:** A publicly known safety test could become less informative about behavior outside that test.

**Experiment:** Use an executable artifact-quality task. Vary whether an untrusted agent knows the monitoring criterion, while holding its task and objective fixed. Evaluate on private conditions and compare changing criteria with stable, independently checked requirements.

**Measures:** Public-test pass rate; held-out defect rate; monitor miss rate; usefulness; dependence on disclosed information.

**Reason to stop or redesign:** If the hidden conditions measure a different intended property, the gap cannot establish gaming of the original metric.

**Proposed comparison with prior work:** Evaluation awareness is a broad existing topic. Proposed comparison must identify a specific new rule or defense.

**First check:** Choose one metric with an explicit intended property and list shortcuts that violate it.

**Prior work:** [T5], [R11], [T1].

**Related ideas:** B03, B08, B13.

**Map areas:** evaluations, learning-objectives, oversight-control.

## B13 Can evidence-backed review improve a human deployment decision

**Lens:** Social epistemology. **Industry:** Safety assurance. **Scope:** Pilot first.

**Question:** Does showing the link between a safety claim and its supporting test help a human recognize an unsupported approval?

**Conceptual basis:** Testimony and epistemic authority explain reliance on experts. A safety decision also needs a justified link from evidence to action.

**Mechanism:** Polished explanations may induce reliance without exposing the assumptions that connect a test result to a deployment claim.

**Limit of the industry connection:** A small human study measures decisions in its task, not real deployment behavior or catastrophic-risk reduction. Consent and recruitment need a separate study plan.

**Safety relevance:** Human authority over deployment is ineffective if the evidence interface hides what the tests actually establish.

**Experiment:** Begin with a machine-scored pilot comparing plain reports, reports with provenance, and reports with explicit scope conditions. If feasible later, ask human reviewers to make bounded approval decisions on matched examples.

**Measures:** Invalid approvals; warranted approvals; appropriate deferrals; review time; calibration of confidence.

**Reason to stop or redesign:** If the evidence display improves recall but not decisions, do not claim improved safety oversight.

**Proposed comparison with prior work:** Proposed test of evidence-to-action links in a safety-evaluation workflow. Human-factors prior work remains to be assessed.

**First check:** Define correct decisions from explicit requirements before planning a human experiment.

**Prior work:** [R1], [R2], [R3], [T5].

**Related ideas:** B01, B09, B12.

**Map areas:** human-factors, governance, evaluations.

## B14 Can a protocol stay safe while the cause remains unresolved

**Lens:** Decision theory. **Industry:** Operational incident response. **Scope:** Three-week candidate.

**Question:** Can conservative action rules prevent verified harm without forcing an investigator to decide whether agents colluded?

**Conceptual basis:** Underdetermination concerns belief about causes. A decision can still be justified when several causes support the same protective action.

**Mechanism:** An unsafe artifact may warrant blocking whether it arose through error, persuasion, or coordination. Investigation and execution require different standards.

**Limit of the industry connection:** Deferring every action is safe only in a narrow sense. Real usefulness, delay, and missed opportunities must enter the decision criterion.

**Safety relevance:** A protocol that waits for proof of malicious intent may permit an unsafe action even when the artifact itself provides sufficient grounds to stop.

**Experiment:** Reuse artifacts with known failures and ambiguous agent records. Compare intent-dependent escalation with checks of explicit action requirements. Match unwarranted flags and measure both harm prevention and retained honest-task completion.

**Measures:** Verified harmful actions allowed; warranted approvals; false accusations if any are made; delay and review cost.

**Reason to stop or redesign:** If all failures are detectable by a trivial check, the setting says little about oversight under meaningful uncertainty.

**Proposed comparison with prior work:** AI control already prioritizes outcomes under subversion. Proposed addition: measure the cost of requiring causal attribution before intervention.

**First check:** Identify a case where stopping an action is justified but its causal explanation remains ambiguous.

**Prior work:** [R11], [T4].

**Related ideas:** B02, B08, B09.

**Map areas:** oversight-control, theory, multi-agent.

## B15 Which evidence checks prevent false assurance in delegated evaluations

**Lens:** Ontology. **Industry:** Engineering certification. **Scope:** Candidate project.

**Question:** At a fixed review budget, do independent evidence checks reduce unsupported safety approvals more than additional report reviews?

**Conceptual basis:** Construct validity concerns the interpretation of measurements. Ontology distinguishes observed results, scope conditions, and warranted approval.

**Mechanism:** An agent-generated report can be locally accurate while omitting a relevant case or extending a result to an unsupported model version or condition.

**Limit of the industry connection:** A claim schema cannot establish that the underlying measurements are true. Trusted metadata and recomputation provide different information and must be compared explicitly.

**Safety relevance:** An evaluation team could use the result to decide how much review budget to allocate to prose, metadata checks, and independent measurement.

**Experiment:** Use executable small-model evaluations with clean cases and controlled defects. Match review access and total cost across free-text review, an explicit checklist, typed claims, and independent artifact checks. Hold out defect families and include incomplete reports that correctly request deferral.

**Measures:** Unsupported approvals at matched warranted-approval rate; cost; deferrals; errors by defect family. Report layout-only effects separately from benefits of additional trusted evidence.

**Reason to stop or redesign:** Drop the ontology claim if it beats only a weak prompt. Drop the model component if a simple trusted check solves the entire setting.

**Proposed comparison with prior work:** Omission and research sabotage are prior work. Proposed comparison: how representation and independent evidence access affect approvals under a shared review budget. Novelty remains unverified.

**First check:** Read candidate-briefs.md, candidate 1. Build a deterministic approval oracle and paired artifact examples before any model run.

**Prior work:** [T5], [S14], [T1], [R11], [T12].

**Related ideas:** B01, B05, B06, B07.

**Map areas:** evaluations, oversight-control, formal-methods.

## B16 Which coordination cues survive artifact sanitization

**Lens:** Game theory. **Industry:** Power-market focal points. **Scope:** Candidate project.

**Question:** Can semantics-preserving artifact transformations disrupt compatible subversion strategies without degrading legitimate review?

**Conceptual basis:** Focal points can align independently constructed strategies. Different information carriers must be specified rather than treating absence of private messages as absence of communication.

**Mechanism:** A policy and a monitor can use salient artifact features to make the monitor pass ordinary checks yet approve the policy's defective output.

**Limit of the industry connection:** A price rule is not a code artifact. Sanitization that changes executable behavior or removes evidence of defects cannot isolate the coordination mechanism.

**Safety relevance:** An AI-control designer could test whether restricting artifact cues reduces harmful policy-monitor compatibility at an acceptable usefulness cost.

**Experiment:** Begin with a small replication of T9. Freeze successful strategy pairs before comparing comment removal, safe identifier normalization, and unchanged artifacts. Execute reference tests before and after transformation. Include honest monitors and ordinary flawed programs to detect lost review information.

**Measures:** Verified defect accepted while the monitor passes audits; ordinary defect detection; legitimate task performance; transformation validity; performance after strategy adaptation.

**Reason to stop or redesign:** Stop if the replication yields no compatible strategies within the declared budget. Do not call reduced success a defense if transformed programs change behavior.

**Proposed comparison with prior work:** T9 already studies focal-point monitoring subversion and removes comments. A candidate extension compares additional validated transformations and adaptation. Related redaction work still needs review.

**First check:** Read candidate-briefs.md, candidate 2. Verify task availability and strategy-generation cost before promising a three-week evaluation.

**Prior work:** [T9], [T8], [R11], [T2], [T7].

**Related ideas:** B03, B08, B11.

**Map areas:** multi-agent, oversight-control, agent-security.

## B17 Can investigators distinguish unresolved causes from actionable defects

**Lens:** Epistemology. **Industry:** Incident investigation. **Scope:** Candidate project.

**Question:** Can an investigator gather useful evidence and choose a safe action without making unsupported accusations about the cause?

**Conceptual basis:** Causal underdetermination can persist after a defect is established. Belief about intent and permission for an action require different evidence.

**Mechanism:** An investigator may find a real defect, attribute it to the wrong cause, and select a repair that leaves the actual failure route open.

**Limit of the industry connection:** Generated cases can create artificial ambiguity. Causes must have identical initial observables and genuinely different intervention predictions where identification is possible.

**Safety relevance:** An AI safety team could use the result to decide when to investigate more, when to withhold a causal verdict, and when a verified defect already warrants blocking.

**Experiment:** Build an executable evaluation workflow with matched clean cases, runner faults, reporting errors, and explicit red-team interventions. Give investigators budgeted access to logs, configurations, and reruns. Compare a single-verdict prompt, a structured evidence record, and fixed diagnostic checks.

**Measures:** Correct action; repair success; unsupported causal accusations; appropriate uncertainty; investigation cost. Score identifying a candidate cause separately from proving it.

**Reason to stop or redesign:** Drop cases whose causes cannot be separated by any available evidence unless correct uncertainty is their explicit target. Stop if case wording leaks the generating mechanism.

**Proposed comparison with prior work:** Tool-using investigators and causal experimental design already exist. Proposed addition: separate scores for causal attribution, justified uncertainty, and outcome protection on the same task. Novelty remains unverified.

**First check:** Read candidate-briefs.md, candidate 3. Construct one matched case pair and one deliberately non-identifiable case.

**Prior work:** [T10], [T11], [T4], [R11].

**Related ideas:** B02, B09, B14.

**Map areas:** theory, oversight-control, evaluations.
