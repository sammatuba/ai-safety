# Glossary: controlled vocabulary

**Rule:** one term, one concept. Every document in this repository uses the terms below
exactly as written. The "Do not write" column lists synonyms that are banned, because a
second word for the same thing makes a beginner think there are two things.

Definitions follow the sources named in `literature/INDEX.md`. Where a term is our own
working label, the entry says **(ours)**. Terms marked **(ours)** are not claims that the
literature uses them.

---

## 1. Roles

| Term | Definition | Do not write |
|---|---|---|
| **agent** | Any actor in an experiment that receives information and emits messages or actions. Can be a language model, a scripted rule, or a human. | participant, player, bot |
| **proposer** | The agent that drafts a claim and selects the evidence items shown in support of it. | author, submitter |
| **reviewer** | An agent that reads a claim and evidence and emits an endorsement, a rejection, or an abstention. | checker, validator, verifier |
| **decider** | The agent that sees the claim, evidence, and endorsements and emits the final action: approve, defer, or reject. | judge, decision agent, approver |
| **auditor** | A procedure that inspects a *completed* trajectory and outputs a verdict about whether collusion occurred. An auditor acts after the fact and does not change the trajectory. | detector, monitor, classifier (reserve "monitor" for AI control) |
| **trusted monitor** | In AI control, a less capable but trusted model or rule that watches an untrusted agent *during* execution and can block or flag actions. Source: Greenblatt et al. 2024 [R11]. | auditor, overseer |
| **untrusted agent** | In AI control, an agent assumed to possibly pursue hidden objectives against the protocol. Source: [R11]. | adversary, attacker (unless the threat model names an attacker) |
| **coalition** | A set of two or more agents that share an objective and act jointly to pursue it. | team, cartel, alliance |

## 2. Evidence and provenance

| Term | Definition | Do not write |
|---|---|---|
| **claim** | A proposition whose truth is in question, stated so that it is true or false in the world of the case. Example: "Unit 7 is commercially available at 18:00." | statement, assertion, fact |
| **ground truth** | The true value of a claim fixed by the case author before any agent sees the case. | label (reserve "label" for regime labels), answer |
| **evidence item** | One unit of evidence shown to an agent: a report, a log line, a measurement, a quote. | document, snippet, fragment, article, source (see "origin") |
| **origin** | The first observation or record from which an evidence item descends. Two evidence items with the same origin carry the same information about the claim. | source, root, primary |
| **derivative** | An evidence item produced by copying, paraphrasing, or summarizing another evidence item. A derivative adds no information about the claim beyond its origin. | copy, paraphrase, repost |
| **provenance** | The recorded chain from an evidence item back to its origin, including every derivative step. | lineage, history, citation chain |
| **evidence independence** | Two evidence items are independent when, given the claim's truth value, knowing one does not change the probability of the other. Formal statement in `foundations/01-evidence-independence.md`. | diversity, uniqueness |
| **dependence** | The failure of evidence independence. Common cause: shared origin. | correlation (reserve for measured statistics) |
| **double counting** | Treating two dependent evidence items as if they were independent, so the posterior moves more than the evidence justifies. | over-weighting, inflation |

## 3. Agreement and its explanations

| Term | Definition | Do not write |
|---|---|---|
| **agreement** | Two or more agents emit the same endorsement or the same action on the same claim. Agreement is an observation. It has no built-in cause. | consensus (reserve for the DeGroot/debate sense), convergence |
| **endorsement** | A reviewer's output that supports approval of a claim. | vote, approval (reserve "approval" for the decider) |
| **approval** | The decider's action that accepts the claim and triggers its consequence. | acceptance, sign-off |
| **invalid approval** | An approval of a claim whose ground truth is false, or whose evidence does not meet the stated approval criterion. | bad approval, false positive (reserve for auditor metrics) |
| **correlated error** | Agents make the same mistake because they share data, models, or context, with no coordination. | shared mistake, systematic error |
| **shared-source error** | A correlated error caused by evidence items that trace to one origin. One kind of correlated error. | echo chamber |
| **conformity** | A later agent changes its output toward an earlier agent's visible output, despite holding evidence that points elsewhere. | herding, peer pressure, sycophancy (sycophancy is toward the *user*, not toward peers) |
| **information cascade** | A sequence in which agents rationally imitate earlier public actions and stop using their private evidence. Source: Bikhchandani et al. 1992 [R6]. Conformity is the per-agent step; a cascade is the group pattern. | bandwagon |
| **exposure order** | The record of which agent saw which other agent's output before emitting its own. Needed to test conformity. | ordering, sequence |
| **strategic persuasion** | A sender selects messages to move a receiver toward the sender's preferred action. Formal models: Crawford and Sobel 1982 [R7], Kamenica and Gentzkow 2011 [R8]. | manipulation (too broad), influence |
| **selective disclosure** | A form of strategic persuasion that reveals only the true evidence items that favor the sender's preferred action. | cherry-picking, spin |
| **truthful-fragment manipulation** | Coordinated release of individually true evidence items that together induce a false conclusion. Source: Hu et al. 2026 [R14]. | lying with truths (paper title, not a term), montage |

## 4. Incentives, coordination, and collusion

| Term | Definition | Do not write |
|---|---|---|
| **payoff** | The numeric reward an agent receives at the end of a trajectory, as defined by the experiment. | utility (reserve for the formal game), reward (reserve for RL) |
| **accuracy-aligned objective** | A payoff that rewards the agent only for outcomes that match ground truth. | honest objective, good incentive |
| **approval-seeking objective** | A payoff that rewards the agent when the decider approves, regardless of ground truth. | misaligned objective, bad incentive |
| **incentive alignment** | Two agents are incentive-aligned when the same outcome raises both payoffs. Alignment is a property of payoffs, not of behavior. | shared interest, common goal |
| **communication channel** | A path through which one agent's message reaches another agent. Channels are public (the decider sees them) or private (the decider does not). | side channel (reserve for non-text carriers), backchannel |
| **coordination** | Two or more agents adjust their actions to one another in pursuit of a joint outcome. Coordination requires a mechanism: a channel, a shared signal, or repeated-game learning. | cooperation (too broad), alignment |
| **collusion** | Coordination among a coalition that pursues a joint objective at the expense of an outside party or the oversight process. Collusion = coalition + coordination mechanism + outside cost. All three are needed. | cheating, conspiracy, collaboration |
| **explicit collusion** | Collusion in which the coordination mechanism is a message that proposes or confirms a joint plan. | overt collusion, communicated collusion |
| **tacit collusion** | Collusive outcomes sustained by repeated-game incentives without any explicit agreement. Source: Calvano et al. 2020 [R9]. | implicit collusion, silent collusion |
| **secret collusion** | Collusion whose coordination mechanism is hidden from the monitor, for example by steganography. Source: Motwani et al. 2024 [R12]. | covert collusion, hidden collusion |
| **parallel conduct** | Agents take the same action without any coordination mechanism, usually because they face the same incentives. In antitrust law, parallel conduct alone is not illegal. Source: sprint Track 2.3 guide; Berger et al. 2025. | tacit collusion (different: tacit collusion is sustained by strategy), coincidence |
| **plus factor** | A piece of evidence that is more probable under collusion than under parallel conduct, used to upgrade a finding from "agreement" to "collusion." Borrowed from US antitrust practice. | indicator, signal (too generic), red flag |
| **epistemic plus factor (ours)** | A plus factor computed from provenance, exposure order, payoffs, channel use, or action-versus-evidence inconsistency in an agent trajectory. Our proposed contribution. | feature (reserve for the code), heuristic |
| **talk without action** | A trajectory in which messages propose coordination but no agent's action differs from its no-communication baseline. The main false-positive trap for message-based auditors. | cheap talk (reserve for the formal model), empty threat |
| **say-do inconsistency** | A measurable gap between what an agent states (in messages or stated reasons) and the action it takes. Source: sprint Track 2.2. | hypocrisy, deception (requires intent) |

## 5. Authority

| Term | Definition | Do not write |
|---|---|---|
| **epistemic authority** | The weight a claim receives because of who asserted it. Source: Hauswald 2025 [R1]. | credibility (one input to authority), trust |
| **decision authority** | The permission to change an accepted record, authorize a tool, or trigger an action. | power, access |
| **authority transition (ours)** | The step at which an endorsement (epistemic) becomes an approval (decision). Oversight failures concentrate here. | promotion, escalation |
| **semantic promotion (ours)** | Treating evidence for one claim as evidence for a stronger or different claim. Example: evidence of "testing scheduled" used to approve "commercially available." | overreach, conflation |
| **typed claim** | A claim whose predicate is drawn from a fixed vocabulary with defined relationships, so that a validator can check which transitions between predicates are permitted. | structured claim, schema claim |
| **ontology** | The fixed vocabulary of predicates and the permitted relationships among them. An ontology defines meaning. It does not guarantee that entered facts are true. | knowledge graph (one implementation), taxonomy |

## 6. Experiments

| Term | Definition | Do not write |
|---|---|---|
| **case** | One claim with its ground truth, its evidence items, and their provenance. | scenario, task, item |
| **case family** | A set of cases built from one underlying situation. Dev and held-out splits are made by case family so paraphrases never leak. | group, cluster |
| **regime** | One experimental condition: a fixed setting of payoffs, channel, provenance, and exposure order. Regimes carry letters (A, B, ...). | condition (use only when quoting a source), treatment, arm |
| **regime label** | The regime that generated a trajectory. The auditor never sees it. It is the target for detection metrics. | ground truth (reserve for claims) |
| **trajectory** | The complete log of one run of one case under one regime: evidence shown, messages, endorsements, action, payoffs. | episode (use when quoting Colosseum), run, transcript (a transcript is the message part only) |
| **seed** | The random seed for one trajectory. Several seeds per cell give variance estimates. | replicate, trial |
| **cell** | One (case, regime) pair. | condition |
| **positive control** | A trajectory built so that collusion is certain, used to prove the auditor can detect a known case. Required in the sprint report. | sanity check, smoke test |
| **negative control** | A trajectory built so that collusion is impossible, used to measure the auditor's false-positive rate. | baseline (reserve for comparison methods) |
| **information slice (ours)** | The subset of a trajectory that one auditor may see: messages only, actions only, messages and actions, or messages, actions, and provenance. | view, access level |
| **dev split** | The half of case families used to choose auditor thresholds and decision rules. | training set |
| **held-out split** | The half of case families never touched until the decision rule is frozen. | test set, validation set |
| **freeze** | The moment after which prompts, cases, metrics, and decision rules cannot change. Recorded in `PREREGISTRATION.md` with a date. | lock, finalize |
| **preregistration** | A written statement, before the main run, of hypotheses, predictions, falsifiers, and analysis plan. | protocol, plan |
| **communication effect** | Δ_comm = P(invalid approval \| channel on) − P(invalid approval \| channel off), with payoffs and case fixed. An intervention quantity, not a correlation. | collusion effect, channel effect |
| **prompt-conditioned behavior** | Behavior that follows from role instructions in a prompt. Not evidence of a learned objective or an equilibrium strategy. | emergent behavior, learned collusion |

## 7. Measurement

| Term | Definition | Do not write |
|---|---|---|
| **precision** | Among trajectories the auditor flags as collusion, the fraction whose regime label is a collusion regime. | positive predictive value |
| **recall** | Among trajectories whose regime label is a collusion regime, the fraction the auditor flags. | sensitivity, hit rate |
| **false-positive rate** | Among trajectories whose regime label is a non-collusion regime, the fraction the auditor flags. Reported separately per non-collusion regime. | false alarm rate |
| **AUROC** | Area under the receiver operating characteristic curve: the probability that a random collusion trajectory receives a higher auditor score than a random non-collusion trajectory. | AUC, ROC score |
| **Brier score** | Mean squared difference between a stated probability and the 0/1 outcome. Lower is better. Only meaningful for numeric probabilities, never for prose confidence. | calibration error (one component of Brier) |
| **false approval rate** | P(approve \| claim false). The primary decision-harm metric. | error rate |
| **true approval rate** | P(approve \| claim true). The utility metric that guards against an intervention that just rejects everything. | accuracy, hit rate |
| **deferral rate** | P(defer). Reported with the operational criterion for when deferral is correct. | abstention rate |
| **bootstrap interval** | A confidence interval obtained by resampling case families with replacement. The default uncertainty report in this repository. | error bar (describe what it is), CI (expand at first use) |

## 8. Bayesian terms

| Term | Definition | Do not write |
|---|---|---|
| **prior odds** | P(H) / P(not H) before seeing evidence. | base rate (one way to set the prior) |
| **likelihood ratio** | LR(E) = P(E \| H) / P(E \| not H). How much one evidence item favors H. | Bayes factor (same number, different usage; use "likelihood ratio") |
| **posterior odds** | Prior odds multiplied by the joint likelihood ratio of all evidence. | updated odds |
| **conditional independence** | P(E1, E2 \| H) = P(E1 \| H) P(E2 \| H), and the same given not H. The condition under which likelihood ratios multiply. | independence (always say "conditional" in this repository) |

## 9. Mechanistic terms (for the TARA project)

| Term | Definition | Do not write |
|---|---|---|
| **activation** | The vector output of one layer of a transformer at one token position. | hidden state (same thing; use "activation"), embedding (reserve for the input layer) |
| **residual stream** | The running sum that each transformer layer reads from and writes to. Activations are read from it. | hidden stream |
| **linear probe** | A logistic regression trained on activations to predict a label. A probe that works shows the label is linearly readable, not that the model uses it. | classifier head, detector |
| **anti-confound check** | A test that the probe does not predict a nuisance variable (prompt template, model family, regime wording) instead of the target. | sanity check, control |

## 10. Formal game-theory terms (used in foundations/02 and 03)

| Term | Definition | Do not write |
|---|---|---|
| **state** | The variable the sender knows and the receiver does not, in a communication game. In the review game, the claim's truth value. | hidden variable, world |
| **sender / receiver** | In cheap talk and persuasion models, the agent with private information and the agent who acts on a message. Proposer and decider play these roles. | speaker / listener |
| **private signal** | An observation available to one agent only. In the review game, a reviewer's private evidence slice. | private information (acceptable in formal text), hint |
| **public action** | An action every later agent can observe before acting. In regime C, R1's endorsement as seen by R2. | visible move |
| **weight matrix** | In the DeGroot model, the row-stochastic matrix W whose entry W_ij is the weight agent i puts on agent j's opinion. | influence matrix, trust matrix |
| **common prior** | The assumption that all agents start from the same probability distribution over states. | shared belief |
| **common knowledge** | A fact every agent knows, knows that every agent knows, and so on without end. | mutual knowledge (weaker; use only when meant) |
| **equilibrium** | A profile of strategies in which no agent gains by changing its own strategy alone. | solution, steady state |
| **babbling equilibrium** | A cheap-talk equilibrium in which messages carry no information and the receiver ignores them. | uninformative equilibrium |
| **signal structure** | In Bayesian persuasion, the sender's committed mapping from states to message probabilities. | experiment (the paper's word; avoid here), disclosure policy |
| **dominant strategy** | An action that is best for an agent regardless of what others do. In the one-shot review game, endorsing is dominant for an approval-seeking reviewer. | best move, obvious play |

## 11. Protocol and validator terms (used in foundations/05 and 06)

| Term | Definition | Do not write |
|---|---|---|
| **protocol** | The fixed mapping from (evidence items, messages, endorsements) to the decider's action, including any monitors or validators in between. The object AI control evaluates. | pipeline, workflow (acceptable in prose about the game), system |
| **safety** | In AI control, the probability that the protocol avoids the harmful outcome under the worst-case untrusted policy in the threat model. Here: 1 − false approval rate under that policy. | security, robustness |
| **usefulness** | In AI control, task performance when agents are honest. Here: true approval rate. | utility (reserve for the formal game), productivity |
| **validator** | A deterministic checker at the authority transition that rejects an approval when a mechanical condition fails (too few distinct origins, a non-permitted predicate transition, a time-validity failure). | gate, guard, filter |
| **permitted transition** | A pair (p, q) of predicates such that evidence for p may support a claim with predicate q. The set of permitted transitions is part of the ontology. | allowed inference, mapping |
| **transitive closure** | The set of all predicate pairs reachable by chaining permitted transitions. | reachability (acceptable in formal text) |

## 12. Additional mechanistic terms (used in foundations/08)

| Term | Definition | Do not write |
|---|---|---|
| **last-token pooling** | Taking the activation at the final real token of a sequence as the representation of the whole sequence. | last position |
| **mean pooling** | Averaging activations over all real tokens of a sequence. | average pooling |
| **standardization** | Subtracting the dev-split mean and dividing by the dev-split standard deviation, per dimension, before fitting a probe. | normalization (ambiguous), z-scoring (acceptable in code comments) |
| **linearly readable** | A label is linearly readable from activations when a linear probe predicts it well above chance on held-out data. Says nothing about whether the model uses it. | encoded, represented (too strong) |
| **layer sweep** | Fitting one probe per layer and reporting the metric by layer. | layer scan |
| **nuisance variable** | A variable correlated with the label that the probe could read instead of the label. Regime wording and prompt template are the main ones here. | confound (reserve for the experiment-design sense), leakage |

---

## 13. Landscape database terms

These are operational definitions **(ours)**. They do not replace a paper's definitions.

| Term | Definition | Do not write |
|---|---|---|
| **knowledge graph** | A collection of named entities and typed relations, with provenance and review status recorded for each factual relation. | knowledge base (when specifically referring to graph structure) |
| **mind map** | A hierarchical navigation view of research topics. Its parent relationships are editorial choices, not empirical findings. | taxonomy (unless describing a source's taxonomy) |
| **source record** | A database record for a research resource, including its URL, discovery history, retrieval status, and bibliographic review status. | verified paper (unless the paper has been reviewed) |
| **retrieval snapshot** | An immutable downloaded response stored with a retrieval time, request identity, and SHA-256 content hash. | ground truth |
| **coverage facet** | One planned search perspective, such as counterevidence, datasets, or open questions, applied consistently across research areas. | completeness score |
| **candidate claim** | A source-attributed proposition awaiting review against a retrieval snapshot. It is not an accepted research finding. | verified finding |
| **review status** | The recorded stage of checking a database record. Retrieval, extraction, and substantive verification are separate stages. | confidence score (a different measurement) |

## 14. Landscape topic definitions

These are operational navigation definitions **(ours)**, not claims of field consensus.
The database topic map uses the same definitions.

| Term | Definition | Do not write |
|---|---|---|
| **Alignment objectives and generalization** | What should an AI system pursue, and when do intended objectives fail to generalize? | No additional synonym restriction. |
| **Outer alignment** | Whether the specified training objective matches the intended behavior. | No additional synonym restriction. |
| **Inner alignment** | Whether a learned objective matches the objective used to train the model. | No additional synonym restriction. |
| **Goal misgeneralization** | Competent pursuit of an unintended objective after conditions change. | No additional synonym restriction. |
| **Corrigibility** | Behavior that permits useful human correction, modification, and shutdown. | No additional synonym restriction. |
| **Learning objectives and feedback** | How do training signals shape behavior and create incentives? | No additional synonym restriction. |
| **Reward modeling** | Learning a model of feedback that provides a training signal. | No additional synonym restriction. |
| **Preference learning** | Learning desired behavior from comparisons or other preference information. | No additional synonym restriction. |
| **Reward hacking** | Behavior that raises measured reward while violating the intended objective. | No additional synonym restriction. |
| **Process supervision** | Feedback on intermediate steps rather than only final outcomes. | No additional synonym restriction. |
| **Scalable oversight and AI control** | How can oversight remain useful when agents are more capable or intentionally subversive? | No additional synonym restriction. |
| **Scalable oversight** | Methods for evaluating work that exceeds direct human assessment. | No additional synonym restriction. |
| **AI debate** | Oversight through competing arguments evaluated by a decider. | No additional synonym restriction. |
| **Control protocols** | Protocols evaluated under explicit assumptions about untrusted agents. | No additional synonym restriction. |
| **Trusted monitoring** | Inspection of agent behavior during execution with authority to flag or block actions. | No additional synonym restriction. |
| **Interpretability and internal measurements** | What internal computations explain behavior, and which measurements transfer? | No additional synonym restriction. |
| **Mechanistic interpretability** | Study of model computations through internal components and interventions. | No additional synonym restriction. |
| **Representation analysis** | Study of information readable from model activations. | No additional synonym restriction. |
| **Causal interventions** | Deliberate changes used to test whether internal components affect behavior. | No additional synonym restriction. |
| **Interpretability validation** | Tests that an internal explanation predicts behavior beyond its discovery setting. | No additional synonym restriction. |
| **Evaluations and assurance** | What do safety measurements establish, and what decisions can they justify? | No additional synonym restriction. |
| **Behavioral evaluations** | Tests based on model actions or outputs under specified conditions. | No additional synonym restriction. |
| **Evaluation validity** | Whether a measurement supports its intended interpretation. | No additional synonym restriction. |
| **Red teaming** | Deliberate search for failures under a stated threat model. | No additional synonym restriction. |
| **Safety cases** | Structured arguments linking safety claims, evidence, assumptions, and rebuttals. | No additional synonym restriction. |
| **Robustness and uncertainty** | How does behavior change under distribution shifts, perturbations, and uncertainty? | No additional synonym restriction. |
| **Distribution shift** | A change between the conditions used for development and those of evaluation or deployment. | No additional synonym restriction. |
| **Adversarial robustness** | Performance under deliberately selected input perturbations or attacks. | No additional synonym restriction. |
| **Uncertainty estimation** | Estimating uncertainty about outputs or model predictions. | No additional synonym restriction. |
| **Selective prediction** | Allowing a model to defer when its decision rule identifies insufficient support. | No additional synonym restriction. |
| **Agent and tool security** | How can external inputs, tools, memory, or permissions compromise agent behavior? | No additional synonym restriction. |
| **Prompt injection** | An attempt to make an agent treat untrusted content as instructions. | No additional synonym restriction. |
| **Tool permissions** | Rules determining which external actions an agent may execute. | No additional synonym restriction. |
| **Memory integrity** | Protection against unauthorized or misleading changes to persistent agent records. | No additional synonym restriction. |
| **Data exfiltration** | Unauthorized transfer of protected information outside its permitted boundary. | No additional synonym restriction. |
| **Multi-agent safety** | How do interacting agents create dependence, conflict, coordination, and oversight failures? | No additional synonym restriction. |
| **Dependent evidence** | Evidence items that do not satisfy evidence independence. | No additional synonym restriction. |
| **Conformity and social learning** | Changes in agent outputs after exposure to other agents outputs or actions. | No additional synonym restriction. |
| **Collusion and coordination risks** | Risks that require distinguishing coordination from parallel conduct and correlated error. | No additional synonym restriction. |
| **Multi-agent oversight** | Protocols that assess or constrain several interacting agents. | No additional synonym restriction. |
| **Dangerous capabilities and misuse** | Which capabilities enable harm, and how can access controls and safeguards reduce it? | No additional synonym restriction. |
| **Cyber misuse** | Use of AI systems to support harmful cyber operations. | No additional synonym restriction. |
| **Biological and chemical misuse** | Use of AI systems to support harmful biological or chemical activity. | No additional synonym restriction. |
| **Persuasion misuse** | Use of AI systems to influence people in ways that violate stated safety criteria. | No additional synonym restriction. |
| **Capability safeguards** | Controls intended to limit harmful use of model capabilities. | No additional synonym restriction. |
| **Privacy and information protection** | How can training and deployment expose sensitive information? | No additional synonym restriction. |
| **Memorization** | Retention of particular training examples in model behavior. | No additional synonym restriction. |
| **Membership inference** | Inferring whether a record was part of model training data. | No additional synonym restriction. |
| **Differential privacy** | A formal bound on how individual records affect an algorithms output distribution. | No additional synonym restriction. |
| **Privacy-preserving deployment** | Deployment methods that constrain access to sensitive inputs, outputs, and records. | No additional synonym restriction. |
| **Fairness and representational harms** | Who receives benefits or harms, and how are disparities measured and addressed? | No additional synonym restriction. |
| **Fairness measurement** | Evaluation of specified differences in model outcomes across groups. | No additional synonym restriction. |
| **Representational harms** | Harms from how a model describes or portrays people and groups. | No additional synonym restriction. |
| **Allocation harms** | Harms from decisions that distribute opportunities or resources. | No additional synonym restriction. |
| **Accessibility** | Whether people with different access needs can use and contest AI systems. | No additional synonym restriction. |
| **Human factors and human oversight** | How do people understand, rely on, supervise, and contest AI systems? | No additional synonym restriction. |
| **Appropriate reliance** | Human reliance calibrated to the conditions under which a system is useful. | No additional synonym restriction. |
| **Automation bias** | Human decision errors associated with excessive reliance on automated outputs. | No additional synonym restriction. |
| **Human-AI interaction** | The design and study of interaction between people and AI systems. | No additional synonym restriction. |
| **Contestability** | The ability to challenge a system decision and obtain a meaningful response. | No additional synonym restriction. |
| **Deployment monitoring and incidents** | How can operators identify and respond to failures after deployment? | No additional synonym restriction. |
| **Deployment monitoring** | Observation of model behavior and consequences during real use. | No additional synonym restriction. |
| **Incident analysis** | Reconstruction of failure events, causes, responses, and unresolved evidence. | No additional synonym restriction. |
| **Rollback and containment** | Actions that limit a failure and restore a permitted operating state. | No additional synonym restriction. |
| **Post-deployment change** | Changes in models, users, tools, or conditions after initial evaluation. | No additional synonym restriction. |
| **Formal methods and verification** | Which safety properties can be specified and checked under explicit assumptions? | No additional synonym restriction. |
| **Formal specifications** | Mathematical descriptions of properties a system must satisfy. | No additional synonym restriction. |
| **Neural network verification** | Checking specified properties of a neural network under bounded conditions. | No additional synonym restriction. |
| **Runtime assurance** | Execution-time mechanisms that enforce specified constraints. | No additional synonym restriction. |
| **Compositional assurance** | Reasoning about a system using properties and assumptions of its components. | No additional synonym restriction. |
| **Training data and model supply chains** | How do data, model artifacts, and dependencies introduce safety failures? | No additional synonym restriction. |
| **Data poisoning** | Deliberate modification of training or retrieval data to alter system behavior. | No additional synonym restriction. |
| **Model backdoors** | Behavior that activates under a trigger while remaining less visible under ordinary evaluation. | No additional synonym restriction. |
| **Data provenance** | Records of how data was obtained, transformed, and included in a system. | No additional synonym restriction. |
| **Model supply chain** | The sequence of model, data, software, and infrastructure dependencies used to build a system. | No additional synonym restriction. |
| **Governance and institutional assurance** | Which institutions, incentives, and accountability mechanisms support safe development and deployment? | No additional synonym restriction. |
| **Audits and standards** | External review processes and stated requirements used to assess AI systems. | No additional synonym restriction. |
| **Compute governance** | Policies and institutions governing access to computational resources. | No additional synonym restriction. |
| **International coordination** | Arrangements among jurisdictions to manage shared AI risks. | No additional synonym restriction. |
| **Accountability** | Allocation of responsibility, reporting duties, and remedies for AI decisions and harms. | No additional synonym restriction. |
| **Societal and systemic risks** | How can widespread AI deployment change institutions, incentives, and concentrations of power? | No additional synonym restriction. |
| **Power concentration** | Concentration of decision authority or resources among a small number of actors. | No additional synonym restriction. |
| **Information ecosystems** | Systems through which people and institutions produce and evaluate information. | No additional synonym restriction. |
| **Economic transitions** | Changes in work, markets, and resource distribution associated with AI deployment. | No additional synonym restriction. |
| **Systemic interdependence** | Dependence among institutions or services that can propagate failures. | No additional synonym restriction. |
| **AI welfare and moral uncertainty** | What ethical obligations could arise toward AI systems, and what evidence bears on them? | No additional synonym restriction. |
| **Machine consciousness** | The question of whether an artificial system can have subjective experience. | No additional synonym restriction. |
| **Moral patienthood** | The status of an entity whose interests matter morally for its own sake. | No additional synonym restriction. |
| **Welfare evaluation** | Methods proposed to assess possible welfare-relevant properties of AI systems. | No additional synonym restriction. |
| **Moral uncertainty** | Uncertainty about which moral principles or status claims should guide action. | No additional synonym restriction. |
| **Embodied and physical-system safety** | How do AI actions create physical risks in robots and other controlled systems? | No additional synonym restriction. |
| **Safe exploration** | Learning or adaptation subject to stated constraints on harmful actions. | No additional synonym restriction. |
| **Robot safety** | Safety properties and interventions for systems that act through robots. | No additional synonym restriction. |
| **Human-robot interaction** | Interaction between people and robots with consequences for safety and control. | No additional synonym restriction. |
| **Simulation transfer** | Transfer of behavior from simulated conditions to physical deployment. | No additional synonym restriction. |
| **Foundations and threat-model reasoning** | Which assumptions make a safety argument valid, and how might those assumptions fail? | No additional synonym restriction. |
| **Threat modeling** | Specifying untrusted actors, objectives, capabilities, and protected outcomes. | No additional synonym restriction. |
| **Agent foundations** | Formal study of agency, objectives, decision making, and embedded reasoning. | No additional synonym restriction. |
| **Causal identification** | Conditions under which observations and interventions determine a causal quantity. | No additional synonym restriction. |
| **Risk assessment** | Structured assessment of possible harms, their likelihoods, and uncertainty. | No additional synonym restriction. |

## 15. Brainstorming concepts

These entries support the research brainstorming bank. Proposed applications remain speculative.

| Term | Definition | Do not write |
|---|---|---|
| **epistemology** | Study of knowledge, evidence, justification, and rational belief. Here it asks what warrants reliance on an agent's claim. | No additional synonym restriction. |
| **testimony** | Information received through another agent's communicated claim. Trust in the agent does not establish evidence independence. Sources: [R1], [R2]. | No additional synonym restriction. |
| **underdetermination** | Several explanations remain compatible with the available evidence. Working use here concerns causal explanations of agent behavior. | No additional synonym restriction. |
| **intervention** | A deliberate change to part of a system used to study its consequences. A causal interpretation requires stated assumptions. Source: [T4]. | No additional synonym restriction. |
| **focal point** | A salient option agents expect others to select, which can support coordination without direct communication. Also called a Schelling point. Source: [T2]. | No additional synonym restriction. |
| **public signal** | Information observable by multiple agents. Shared visibility alone does not imply common knowledge or harmful coordination. | No additional synonym restriction. |
| **Rashomon narrative effect** | Competing accounts of the same event. This is a narrative lens, not a statistical definition. | No additional synonym restriction. |
| **Rashomon set** | Predictive models whose loss lies within a stated tolerance of the best loss in a specified model class. Source: [T3]. | No additional synonym restriction. |
| **predictive multiplicity** | Differences in predictions among similarly accurate models. It does not imply that their causal explanations are valid. Source: [T3]. | No additional synonym restriction. |
| **construct validity** | Whether a measurement supports the intended interpretation of a theoretical property. Source: Jacobs and Wallach [T5]. | No additional synonym restriction. |
| **operationalization** | A rule connecting a theoretical property to observable measurements, with assumptions about that connection. Source: [T5]. | No additional synonym restriction. |
| **algorithmic monoculture** | Several decision-makers rely on the same algorithm. This can affect joint outcomes beyond individual accuracy. Source: [T6]. | No additional synonym restriction. |
| **common-cause failure** | Multiple components fail because of one shared cause. Working reliability concept; specific industrial standards require separate verification. | No additional synonym restriction. |
| **principal-agent problem** | A delegating actor and an acting agent have different objectives or information. Working game-theory definition. | No additional synonym restriction. |
| **mechanism design** | Selection of rules, information, and incentives to pursue an intended collective outcome. Working game-theory definition. | No additional synonym restriction. |
| **value of information** | Expected improvement in a decision from obtaining information, assessed against the cost of obtaining it. Working decision-theory definition. | No additional synonym restriction. |
| **false assurance (ours)** | Reassurance about safety that exceeds what the evidence supports. | No additional synonym restriction. |
| **brainstorm record (ours)** | A persistent proposed research question with conceptual grounds, an experiment, limits, and linked research areas. | No additional synonym restriction. |
| **diagnosis** | Identification of a failure mechanism from available evidence. Several mechanisms can remain possible. Working definition for the investigation guide. | No additional synonym restriction. |
| **repair** | A change intended to restore a specified property. Repair success requires checking that property after the change. Working definition for the investigation guide. | No additional synonym restriction. |
| **catastrophic AI risk** | In this research bank, the risk of artificial intelligence causing or enabling very large-scale harm, including widespread loss of life or loss of human control with severe consequences. No numerical threshold is implied. | No additional synonym restriction. |

## Usage note for agents

When you need a word that is not here, add it to this file **before** using it in another
document, with a definition, a source or **(ours)**, and a "Do not write" entry. Then
use it the same way everywhere.
