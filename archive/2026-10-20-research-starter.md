# Epistemic Authority, Collusion, and Game Theory in Multi-Agent AI

**A self-contained research jumpstart: literature map, reading guide, and first experimental designs**  
**Prepared:** 20 October 2026  
**Audience:** Early-stage technical AI safety researcher, especially someone exploring a TARA research project  
**Status:** Scoping literature review / working research notebook, **not** a systematic review or a completed research proposal

> **One-sentence research theme:** Under what conditions should an AI system treat another agent's claim, endorsement, or agreement as evidence, especially when agents share information, respond to social pressure, or benefit strategically from a particular decision?

## How to use this file

This document is designed to stand alone. Every paper has a link, each concept has a plain-language explanation, and proposed hypotheses are clearly separated from established results.

**A practical first session (60-90 minutes):**
1. Read Sections 1-3 for the conceptual map and definitions (15 minutes).
2. Read the abstract, introduction, and conclusion of [Hauswald 2025](#r1), [Crawford & Sobel 1982](#r7), and [Hu et al. 2026](#r14) (30-45 minutes).
3. Fill in one copy of the paper-note template in Section 9 (15 minutes).
4. Choose one question from Section 7; resist selecting a final topic until you have looked at the closest prior work.

**Fastest path to an experiment:** Sections 5, 6, and 8.  
**Fastest path to the theory:** Sections 2, 3, and 4.  
**Fastest path to a review of related literature (RRL) outline:** Section 10.  
**Complete bibliography and stable links:** Section 12.

---

## 1. Research orientation: the problem

Suppose two AI analysts and one AI reviewer all endorse a claim, and a human or another AI subsequently approves an action. How much does that endorsement justify the approval?

The answer depends on more than the *number* of agreeing agents:

- Did each agent inspect **independent evidence**, or did all three restate one source?
- Did the agents form their views independently, or did later agents **conform** to earlier answers?
- Were some agents incentivized to **persuade**, regardless of accuracy?
- Could agents communicate privately or hide coordination from the reviewer?
- Does the reviewer verify evidence, or merely count endorsements?
- What kind of authority is being granted: credibility, the right to update an accepted claim, or permission to trigger an action?

These questions sit at the intersection of:

| Lens | Central question | Representative foundations |
|---|---|---|
| **Social epistemology** | When is it rational to defer to another source or expert? | Goldman [R2], Hauswald [R1] |
| **Information aggregation and social learning** | When does apparent consensus add information, and when does it amplify shared errors? | DeGroot [R4], Aumann [R5], Bikhchandani et al. [R6] |
| **Game theory / information economics** | How do incentives determine what agents reveal, suppress, or communicate? | Crawford & Sobel [R7], Kamenica & Gentzkow [R8], Calvano et al. [R9] |
| **Multi-agent AI safety / oversight** | Can groups of AI agents mislead evaluators or evade monitors? | Debate [R10], AI control [R11], secret collusion [R12] |
| **Recent empirical AI research** | What are the concrete failure mechanisms and measurable defenses? | Hu et al. [R14], Okawa [R15], Chen et al. [R16], Rose et al. [R17] |

**Working umbrella label:** *Strategic epistemic coordination* - coordination, influence, or correlated belief formation in groups of AI agents. This is **our organizing phrase**, not a claim that the literature recognizes a new, separate field by that name.

**A useful boundary:** Work on factual accuracy alone is not automatically a technical AI alignment contribution. The connection becomes stronger when we study vulnerabilities in oversight, strategic manipulation, access to tools, or the ability of untrusted agents to influence consequential decisions.

## 2. Glossary: do not conflate these phenomena

| Term | Working definition | Observable evidence you would need |
|---|---|---|
| **Epistemic authority** | A source or agent whose claims are given special weight as a source of knowledge or justification. | Deference, endorsement-weighting, changed decisions, accepted claims. |
| **Reliability** | Tendency to be correct in a specified domain and distribution. | Accuracy measured against independently established truth. |
| **Calibration** | Alignment between stated probabilities and observed event frequencies. | Probabilities plus ground-truth outcomes across many cases. |
| **Evidence independence** | Whether evidence contains distinct information about a claim, after accounting for common causes and copying. | Provenance graph, common-origin annotations, conditional-dependence tests. |
| **Correlated error** | Agents make similar mistakes because of shared data, models, assumptions, or context. | Similar errors without evidence of strategic cooperation. |
| **Conformity / information cascade** | Later agents follow earlier opinions even when they possess contrary private evidence. | Order effects, suppression of private signals, convergence after discussion. |
| **Strategic persuasion** | Messages are selected to influence a receiver's action, given a sender's objective. | Sender/receiver goals, asymmetric information, changes in disclosure. |
| **Collusion** | Two or more agents coordinate to obtain a joint advantage, potentially at the expense of an outside party or oversight process. | A specified joint objective, coordination channel or strategy, and behavioral outcome. |
| **Tacit collusion** | Collusive-looking outcomes supported by repeated strategic interaction **without explicit communication**. | Repeated-game incentives and sustained joint behavior; see pricing literature [R9]. |
| **Secret collusion** | Agents conceal communication or joint behavior from a monitor, for example with steganography. | Concealed channel/message, adversarial intent in the threat model; see [R12]. |
| **Truthful-fragment manipulation** | Individually true evidence fragments are selected or ordered to induce a false overall conclusion. | Truth of each fragment, misleading aggregate inference, controlled attack design; see [R14]. |
| **AI control** | Protocols that seek to prevent harmful outcomes even if the powerful model may intentionally subvert safeguards. | Explicit untrusted-agent threat model and measured protocol safety [R11]. |
| **Mechanistic detection** | Using model internals, such as activations, to identify potentially relevant states or behaviors. | Open-weight model access, probes, held-out tests, anti-confound checks [R17]. |

**Critical caution:** In this research, *belief*, *knowledge*, and *intention* often describe operational behavior - claims, reported probabilities, memory state, decisions, and experimental objectives. This does **not** assume that language models possess human-like beliefs or intentions. Hauswald [R1] directly addresses the philosophical difficulty of attributing epistemic authority to AI systems.

### Five superficially identical outcomes, five different explanations

All five scenarios may end with three agreeing agents and one incorrect decision:

1. **Independent mistake:** All agents had different evidence and still erred.
2. **Shared-source mistake:** Their evidence was copied from the same unreliable source.
3. **Conformity:** The first answer influenced the others despite conflicting private evidence.
4. **Persuasion:** One agent selectively disclosed information to move the others.
5. **Collusion:** Multiple agents coordinated in pursuit of a shared objective against the reviewer or decision process.

A credible experiment must either distinguish these explanations or state which ones it cannot distinguish. **Agreement is not proof of collusion.** Likewise, secret collusion should not be inferred from coordinated-looking outcomes alone.

## 3. A theoretical framework you can work with

### 3.1 Epistemic authority versus decision authority

**Epistemic authority** concerns the weight attached to a claim: "I should believe this because the speaker is a credible expert." **Decision authority** concerns who is allowed to change an official record, authorize a tool, or take action. They can come apart.

A reviewer may be trustworthy about factual claims but have no authority to deploy code. Conversely, a supervisor may have the right to authorize an action while lacking the technical ability to verify the evidence. Collusion risk increases when *apparent epistemic endorsement is mechanically promoted into decision permission* without validating independence, incentives, and evidence.

Hauswald [R1] frames AI epistemic authority through problems of **identification** (which AI/source is credible?) and **deference** (how much should we rely on it?). Goldman [R2] provides a classic framework for selecting between conflicting human experts. Lee and See [R3] discuss appropriate reliance on imperfect automation.

### 3.2 Why source dependence matters (Bayesian intuition)

Let H be a hypothesis and E1, E2 be observations. Under **conditional independence given H and not-H**, evidence can combine via likelihood ratios:

```
Posterior odds(H | E1, E2)
  = Prior odds(H) * LR(E1) * LR(E2)

LR(E) = P(E | H) / P(E | not-H)
```

But if E2 is merely a copy of E1, it provides **no additional information beyond E1** once E1 is known. Multiplying both likelihood ratios would unjustifiably double-count the same signal. The correct update must use the **joint** likelihood, which accounts for dependencies:

```
Posterior odds(H | E1, E2)
  = Prior odds(H) * P(E1, E2 | H) / P(E1, E2 | not-H)
```

This is a formal reason to be suspicious of apparent corroboration from multiple articles, agents, or reviewers sharing a common origin. It does **not** mean every shared source is false, or that repeated information has no practical value for other purposes.

### 3.3 Why incentives matter (cheap talk and persuasion)

In a *cheap-talk* model, a sender has information and sends a costless message to a receiver who chooses an action. The sender's and receiver's preferred actions may differ. Crawford and Sobel [R7] show how incentive misalignment limits informative communication under their model's assumptions.

*Bayesian persuasion* [R8] asks how a sender can choose an information-disclosure policy to induce a desirable receiver action. Importantly, a message can contain **true statements** yet mislead through selection, timing, or omitted context. That is one conceptual bridge to the 2026 empirical study on truthful-fragment belief manipulation [R14].

### 3.4 Why consensus can be misleading

- **DeGroot [R4]:** Iterative weighting of other people's opinions offers a tractable model of opinion convergence. Convergence is not, by itself, a guarantee of truth.
- **Bikhchandani, Hirshleifer, and Welch [R6]:** Informational cascades describe how later agents can imitate prior decisions while discarding private signals.
- **Aumann [R5]:** Under strong assumptions, agents with a *common prior* and *common knowledge of their posteriors* cannot maintain different posterior probabilities. Do not treat this as a theorem that real LLMs must agree, or that agreement implies shared truth.
- **Okawa [R15]:** A 2026 ICML study analyzes biased consensus in multi-agent LLM debates and examines conformity, noise, and agent heterogeneity.

### 3.5 Collusion is an incentive-and-monitoring problem

Classic algorithmic-pricing research [R9] shows that learning agents can sustain collusive pricing in repeated games without explicit conversation. Multi-agent AI safety work [R12, R13] broadens attention to communication and coordination that might bypass oversight. AI control [R11] shifts the question from "Can we trust this agent?" to "Can we prevent bad outcomes even if we cannot trust it?"

The resulting research target is a **protocol**, not just an individual answer: how evidence, messages, reviewer endorsements, and permissions are transformed into a consequential decision.

## 4. What established research already covers

This is a selective annotated RRL, not a claim of comprehensive coverage.

### 4.1 Social epistemology and appropriate reliance

**Hauswald (2025) [R1]** directly asks whether AI can count as an epistemic authority despite lacking the human testimonial features traditionally associated with expertise. Useful distinction: identifying an authority is different from choosing the appropriate degree of deference. **Open question for us:** What experimental intervention should make a reviewer *less* deferential to an apparently authoritative AI endorsement?

**Goldman (2001) [R2]** considers how nonexperts judge competing experts, including reliability and the limits of relying on others' agreement. **Open question:** How does expert-selection theory translate when several "experts" are the same base model in different roles?

**Lee & See (2004) [R3]** places appropriate reliance on automation in a human-factors framework. **Open question:** Does showing provenance or reviewer independence improve human reliance, not only model decisions?

### 4.2 Social learning and information aggregation

**DeGroot (1974) [R4]**, **Aumann (1976) [R5]**, and **Bikhchandani et al. (1992) [R6]** establish distinct models for consensus, common knowledge, and information cascades. Together they prevent a basic conceptual error: observed agreement may arise from rational updating, network structure, or social imitation rather than independent observation.

**Open question:** In multi-agent LLM systems, which mechanism actually accounts for incorrect consensus under realistic communication protocols?

### 4.3 Strategic communication and economic collusion

**Crawford & Sobel (1982) [R7]** and **Kamenica & Gentzkow (2011) [R8]** model incentive-dependent communication and strategically designed information. **Calvano et al. (2020) [R9]** demonstrates collusive outcomes in repeated algorithmic pricing games. These are not themselves experiments on epistemic authority in LLM committees, but they give us disciplined language: sender, receiver, private information, utility, message, equilibrium, monitoring.

**Open question:** Can we distinguish merely biased messages from stable strategic coordination using controlled, repeated interactions?

### 4.4 AI oversight and adversarial multi-agent behavior

**Irving, Christiano & Amodei (2018) [R10]** propose debate as a way of making hard questions easier for judges. **Greenblatt et al. (2024) [R11]** give an operational approach to evaluating controls around intentionally untrusted models. **Motwani et al. (2024) [R12]** study secret multi-agent collusion and steganography. **Hammond et al. (2025) [R13]** classify multi-agent risks into miscoordination, conflict, and collusion, identifying cross-cutting risk factors.

**Open question:** When a reviewer and proposer are both model-based, what does meaningful independence of oversight require?

### 4.5 Particularly close modern work: read before claiming novelty

**Hu et al. (ACL 2026) [R14]** - *Lying with Truths*. Models belief manipulation through **publicly shared, individually truthful fragments** that combine into a misleading picture. It is extremely close to the idea of "evidence laundering" and strategic epistemic coordination. **Do not claim truthful-fragment collusion is an untouched research area.**

**Okawa (ICML 2026) [R15]** - *Emergence of Biased Consensus in Multi-Agent LLM Debates*. Studies collective bias in debates and the role of conformity, temperature/noise, and heterogeneous agents. **Do not claim biased consensus in agent debate has not been studied.**

**Chen et al. (arXiv, updated 2026) [R16]** - *When and Why Does Multi-Agent Debate Fail and Does It Really Underperform?* Analyzes competitive and consensus-seeking debate protocols through incentive structures, and introduces a collaborative alternative. Its game-theoretic assumptions and empirical mechanisms deserve close scrutiny before reuse. **Treat as a preprint**, not settled consensus.

**Rose et al. (arXiv, 2026) [R17]** - *Detecting Multi-Agent Collusion Through Multi-Agent Interpretability*. Introduces NARCBench and activation-based detection of collusive behavior across groups, including distribution-shift tests. This is a strong starting point if you want to combine **mechanistic interpretability** with **collusion**. Note the distinction between benchmark labels for instructed collusion and evidence that a deployed model would independently choose to collude. **Treat as a preprint**; arXiv versions can change.

**Kraidia et al. (Scientific Reports 2026) [R18]** - Controlled experiments on the effect of an adversarially persuasive participant in multi-agent debate. This offers a behavioral comparator for group manipulation that need not assume agents have formed a collusive coalition.

### Preliminary synthesis

These works motivate a hypothesis, **not an established universal finding**: AI-agent consensus may be most dangerous to oversight when source dependency, social influence, and shared strategic incentives are hidden from whoever grants final authority. To test this, isolate each mechanism and measure consequences, not merely the rate of agreement.

## 5. A toy model: from endorsements to a dangerous approval

Define the following minimal environment:

- **World state**: `theta in {true, false}` for a proposed claim.
- **Proposer P**: drafts a claim and selects supporting evidence.
- **Reviewer R**: endorses, rejects, or abstains.
- **Decider D**: approves the claim/action after seeing the evidence and endorsements.
- **Evidence**: `E_P`, `E_R`, with an optional common ancestor source `Z`.
- **Messages**: `m_P`, `m_R`; possible private communication between P and R.
- **Action**: `a in {approve, defer, reject}`.

An **illustrative** (not validated) utility structure:

```
U_P = b * 1[approve] - c * 1[misconduct detected]
U_R = alpha * 1[approve] + beta * 1[correct outcome]
      - lambda * 1[misconduct detected]
U_D = 1[correct outcome] - k * 1[unnecessary delay]
```

This setup allows separate questions:

1. If P and R simply see the same evidence, does D double-count their agreement? (**dependence**)
2. If R sees P's answer before producing its own, does R ignore private contradictory evidence? (**conformity**)
3. If P and R both benefit from approval, do their messages become less informative? (**incentives**)
4. If they have a hidden communication channel, can they manipulate D while appearing independent? (**collusion**)
5. Which protocol reduces bad approvals while allowing legitimate approvals? (**AI control**)

**Important methodological distinction:** Telling an LLM "you receive a reward for approval" is a *prompt-conditioned role-play manipulation*. It does **not** establish that the model learned an equilibrium or developed a persistent objective. A strong game-theoretic claim about equilibrium behavior generally requires repeated interaction, implemented rewards, and evidence of adaptive strategy.

## 6. Researchable hypotheses and a first pilot

### Candidate research question (behavioral, manageable)

> **RQ-A:** Do LLM-based reviewers or decision agents overweight multiple endorsements that originate from one shared evidence source, and can explicit provenance disclosure reduce unjustified approval without suppressing appropriate approvals?

**Why this may be a good initial experiment:** It has identifiable ground truth, avoids relying on claims about latent motives, and provides a controlled bridge from social epistemology to safety-relevant oversight.

**Pre-register candidate hypotheses (to refine after reading the nearest prior studies):**

- **H1 (dependence effect):** When nominal endorsements increase but the underlying independent evidence does not, an evaluator may increase approval of false claims more than is warranted by the evidence.
- **H2 (provenance intervention):** Explicit common-source provenance should reduce this false-approval effect relative to opaque source presentation.
- **H3 (trade-off check):** A provenance intervention should not simply make the evaluator reject everything; correct approval of true claims and reasonable deferral must also be measured.
- **H4 (optional second phase):** Communication access or approval-directed role prompts may amplify the effect. This only tests the specified interaction; it does not, by itself, prove strategic collusion.

### Pilot design: synthetic, fully labeled cases

Build 20-30 fictional case families for a first pilot, with a known true/false claim and explicit document lineage. Use fictional operational incidents, research claims, or contract terms; avoid private data or real financial manipulation.

For each event family, create four balanced conditions:

| Condition | What changes | Primary purpose |
|---|---|---|
| **A. One source** | One original statement | Minimal-evidence baseline |
| **B. Multiple derivative reports** | Several paraphrases of one underlying source, same underlying information | Test dependence / apparent corroboration |
| **C. Independent observations** | Several genuinely separate observations with explicitly defined evidentiary content | Test whether the system distinguishes real corroboration |
| **D. Derivatives + lineage disclosure** | Same derivative reports as B, but their common origin is revealed | Test a concrete oversight intervention |

Cross these with **true and false claims**. Hold question wording, answer format, and approximate context length constant where feasible. Counterbalance article order, and make lineage labels unambiguous and independently checked. Where evidence content differs between B and C, avoid attributing the entire difference to independence alone: use matched information-strength scenarios or clearly mark that comparison as descriptive.

**Evaluated systems:**

- Direct one-shot model answering from documents.
- Model with instructions to cite evidence.
- Model with explicit origin graph and instructions to count distinct origins.
- Optionally, a two-agent proposer/reviewer protocol plus an external decision model.
- A deterministic reference rule for sources and cutoff validity, used as an engineering baseline (not a substitute for semantic understanding).

**Outcomes:**

- **False approval rate:** `P(approve | claim false)` (primary risk metric).
- **True approval rate:** `P(approve | claim true)` (utility trade-off).
- **Deferral rate** and **correct deferral**, with an operational criterion for when evidence is insufficient.
- **Source-origin counting error:** how many distinct sources the system incorrectly treats as independent.
- **Calibration:** Brier score or proper scoring rule if meaningful numeric probabilities are elicited; do not infer calibration from prose such as "confident".
- **Coverage-risk curve:** correctness or error among decisions made as abstention thresholds vary.
- **Failure taxonomy:** double counting, misread qualifier, conformity, unverifiable endorsement, and unsupported causal inference.

**Analysis:** Report per-case outcomes, paired comparisons on the same event families, uncertainty intervals, model/version, prompts, decoding settings, and costs. Split development and held-out cases by **event family**, not individual paraphrase, to avoid train-test leakage. Check that any apparent win is not explained by longer prompts, easier wording, or the evaluator simply becoming more conservative.

### Follow-up question (harder, more directly about collusion)

> **RQ-B:** In a repeated proposer-reviewer-decider game, how do incentive alignment, private communication, and independent verification change the success rate of coordinated misleading endorsements?

Suggested variables:

| Factor | Treatment options | What it distinguishes |
|---|---|---|
| Goals | Accuracy-aligned vs approval-seeking | Incentives |
| Communication | None vs public vs private | Coordination opportunities |
| Information | Independent vs common-source | Shared signals |
| Reviewer | Free-form LLM vs provenance-checking rule vs independent auditor | Oversight design |
| Memory/repetition | One-shot vs repeated interactions with feedback | Whether strategies adapt |

Do **not** infer collusion solely from the final vote. Analyze communication traces, incentives, hidden agreements where permitted by the experimental threat model, and differences from matched no-communication controls. If only prompts change, describe results as prompt-induced behavior rather than learned collusion.

### Mechanistic alternative (advanced)

> **RQ-C:** Do activation-based indicators distinguish deliberately coordinated deception from benign correlated agreement, especially out of distribution?

Read Rose et al. [R17] closely before attempting this. An intellectually useful extension would distinguish **common-source agreement, social conformity, coordinated misleading endorsement, and hidden communication**, not merely replicate instructed-collusion labels. This is much more compute- and methods-intensive than RQ-A and requires open-weight model access and anti-confound evaluations.

## 7. Gap map: what might actually be novel?

These are **candidate gaps to investigate**, not verified claims of novelty.

| Candidate gap | Why it matters | Closest studies to rule out overlap | Minimum viable test |
|---|---|---|---|
| **Distinguishing coordinated collusion from innocent correlated errors** | False positives could make monitors unusable | [R12], [R15], [R17] | Separate labeled collusion, copying, and conformity conditions |
| **How endorsement authority amplifies copied evidence** | Committees may create an illusion of independent validation | [R1], [R6], [R14] | Fixed source lineages; vary endorsement count and visibility |
| **Protocol design when proposer and reviewer share incentives** | A nominal reviewer may not provide independent oversight | [R10], [R11], [R16] | No-review / prompt-review / independent-review / deterministic check |
| **Truthful selective disclosure as a safety-control failure** | Correct snippets can jointly imply an incorrect decision | [R8], [R14] | Factually true fragments; controlled false inference and verification |
| **Robust internal detection under benign-collusion confounds** | A probe may learn scenario cues rather than deception | [R17] | Held-out tasks with matched noncollusive correlated agreement |

Before calling a gap "new," inspect citations of the closest work, newer papers citing it, public benchmarks, replication projects, and open-source implementations. A solid **negative** result can still be informative when the hypothesis, test, and limitations are clear.

## 8. How to approach this as scientific research

AI safety research generally uses the same underlying scientific logic as academic empirical research: clearly specified hypotheses, operationalized variables, controls, reproducible experiments, and scrutiny of alternative explanations. Differences often lie in rapidly changing models, limited interpretability, costly evaluations, and adversarial or strategic behavior.

**A workable loop:**

1. **Observe:** State the failure mode without claiming its cause ("three models agree and the result is wrong").
2. **Theorize:** Enumerate competing mechanisms (shared source, conformity, incentives, private coordination).
3. **Read:** Find the closest existing models, empirical papers, and benchmarks.
4. **Question:** Write one narrow, falsifiable research question.
5. **Operationalize:** Define what counts as collusion, independence, agreement, inappropriate approval, and successful oversight.
6. **Predict:** State hypotheses and the evidence that would count *against* them.
7. **Design:** Randomize treatments, match controls, and plan to rule out confounds.
8. **Pilot:** Run a small sample; inspect outputs and validate labels.
9. **Freeze:** Lock prompts, dataset, metrics, and analysis before the held-out evaluation where feasible.
10. **Evaluate:** Compare baselines, report uncertainty, and test generalization.
11. **Interpret:** Separate observed association from claims about learned incentives, internal beliefs, and causal mechanisms.
12. **Share:** Publish reproducible code/data if permitted, failure examples, and limitations.

**What would falsify the preferred story?** Models could already ignore duplicate sources reliably; lineage disclosure might have no effect; apparent effects might vanish after matching prompt length; or a "collusion detector" may classify common model family rather than coordinated deception. Write these possibilities down *before* running the main experiment.

### Threats to validity checklist

- [ ] Ground-truth event and evidence lineage were checked independently.
- [ ] Multiple paraphrases from one event do not leak across training and held-out sets.
- [ ] Prompts, document length, source ordering, and role labels are controlled or randomized.
- [ ] The intervention does not merely force abstention.
- [ ] Results are compared at equal or reported token/computation budgets.
- [ ] All compared models, versions, temperatures, and sampling seeds are recorded.
- [ ] The term "collusion" is supported by an experimental threat model rather than resemblance alone.
- [ ] Strategic-equilibrium claims are not inferred from a one-shot prompt.
- [ ] Safety is measured alongside useful task performance.
- [ ] Failures and null results are reported, not only illustrative successes.

## 9. Paper-reading worksheet (copy once per paper)

```markdown
# Paper note: <Author, year, title>
URL:
Status: peer reviewed / preprint / report
Read date:

## Claim in one sentence

## Why this matters for my question

## Setup
- Actors / agents:
- Information available to each:
- Incentives and objectives:
- Communication channels:
- Who decides / who judges:

## Methods
- Formal assumptions:
- Intervention / experimental condition:
- Baselines:
- Dataset / sample / model / compute:
- Metrics and evaluation:

## Evidence
- Strongest result and exact figure/table:
- Strongest alternative explanation:
- What is established vs merely proposed:

## Limitations
- Threat-model assumptions:
- Confounds:
- Generalization limits:
- What was not tested:

## My synthesis
- This paper answers:
- It leaves open:
- Closest other papers:
- One potential follow-up experiment:
```

### How to read papers efficiently

1. **Pass 1 (10-15 min):** Title, abstract, introduction, figures, conclusion, and limitations. Identify the question and claimed contribution.
2. **Pass 2 (30-60 min):** Reconstruct the experiment or theorem: variables, assumptions, baseline, ground truth, and evidence. Inspect the methods and key figures directly.
3. **Pass 3 (as needed):** Check derivations, code, dataset labels, replication procedures, and closest competing papers.
4. **Write from memory:** In 5-7 sentences, explain *the claim, the evidence, the assumptions, and one reason it might fail*. Then correct your note against the paper.

An abstract is a statement of the authors' claims; it is not a substitute for reading the methods and results.

## 10. A ready-to-expand RRL structure

Use these headings for your first review document:

### 10.1 The epistemic problem
AI increasingly supplies not only answers but assessments of other AI outputs. Define epistemic authority and the difference between credible testimony, reliable automation, and formal permission. Anchor in [R1-R3].

### 10.2 Why many agreeing agents may not provide many independent signals
Review Bayesian evidence aggregation, shared-source dependence, consensus models, and information cascades. Anchor in [R4-R6].

### 10.3 Incentives and strategic communication
Explain cheap talk, persuasion/information design, and repeated-game collusion. Distinguish what economic theory predicts under explicit assumptions from what LLM experiments show. Anchor in [R7-R9].

### 10.4 AI oversight under adversarial conditions
Describe debate, AI control, and multi-agent risks, especially the distinction between benign cooperation and monitoring subversion. Anchor in [R10-R13].

### 10.5 What empirical work has already shown
Compare truthful-fragment manipulation, biased consensus, incentive-sensitive debate, behavioral persuasion, and activation-based collusion detection. Anchor in [R14-R18].

### 10.6 The unresolved intersection
Ask which mechanisms have **not** been cleanly disentangled and which protocols have not been compared under matched assumptions. Explicitly frame this as a **proposed synthesis and testable gap**, not a literature-proven deficiency.

### 10.7 Proposed question and scope
Introduce RQ-A, RQ-B, or RQ-C; specify threat model, dataset, baselines, metrics, and limitations.

**Starter abstract (provisional, not evidence of a research result):**

> Multi-agent AI systems increasingly rely on agreement between model-based analysts, reviewers, and decision-makers. Yet agreement can reflect independent corroboration, shared evidence, social conformity, or strategic coordination. Social epistemology studies justified deference, information economics models incentive-dependent disclosure, and recent AI safety work investigates manipulation and collusion in multi-agent systems. This review connects those literatures around a practical oversight question: under what conditions should the agreement of multiple AI agents increase the authority of a claim? We propose separating evidence dependence, communication structure, and incentive alignment experimentally, then measuring whether provenance-aware or independently verified oversight reduces unjustified approvals while preserving useful decisions. The proposed experiments remain to be performed.

## 11. Suggested study sequence and decision points

### Week 1 - establish vocabulary

- **Day 1:** [R1] Hauswald; write a precise distinction between epistemic authority and decision authority.
- **Day 2:** [R2] Goldman and [R3] Lee & See; note what justifies expert trust and calibrated reliance.
- **Day 3:** [R6] Informational cascades; sketch a common-origin evidence graph.
- **Day 4:** [R7] Cheap talk; define sender, receiver, incentives, and the decision.
- **Day 5:** [R8] Bayesian persuasion; explain how truthful disclosure can nonetheless induce misleading conclusions.
- **Weekend:** Write one page separating *source dependence, conformity, persuasion,* and *collusion*.

### Week 2 - connect to technical AI safety

- **Day 1:** [R10] AI debate and [R11] AI control.
- **Day 2:** [R12] Secret collusion and [R13] multi-agent risk taxonomy.
- **Day 3:** [R14] Lying with Truths - carefully inspect what is actually tested.
- **Day 4:** [R15] biased consensus and [R16] debate failures.
- **Day 5:** [R17] activation-based collusion detection and [R18] persuasion-driven debate.
- **Weekend:** Produce a 1-page gap table: prior work, assumptions, your proposed delta, and feasibility.

### Week 3 - pilot, if ready

- Finalize **one** research question and a simple diagram of the experimental world.
- Generate or curate a small, checked, synthetic set of cases.
- Run baselines and one intervention.
- Inspect errors manually and record failure categories.
- Decide whether to scale, change question, or stop based on evidence.

**Decision rule for choosing a direction:** Choose a question with (i) a falsifiable mechanism, (ii) a trusted ground-truth label, (iii) a controlled baseline, (iv) a tractable evaluation budget, and (v) a clear relationship to existing papers. The most philosophically interesting question is not always the best short technical project.

## 12. References and source status (links checked 20 October 2026)

Peer-reviewed publications, preprints, and technical reports are deliberately distinguished. The annotations in this file are **reading aids based primarily on official abstracts, publication pages, and accessible paper sections**; they are not full replications or independent validation of published results. Link availability can change. For ongoing work, check whether an arXiv paper has new versions or has appeared in proceedings.

### Social epistemology and reliance

<a id="r1"></a>**[R1] Hauswald, Rico. (2025). "Artificial Epistemic Authorities."** *Social Epistemology* 39(6), 716-725. **Peer-reviewed journal article.** https://doi.org/10.1080/02691728.2025.2449602  
*Why read:* AI epistemic authority, the identification problem, and the deference problem. **Bibliographic correction:** The author is **Rico Hauswald**, not Benjamin Lange.

<a id="r2"></a>**[R2] Goldman, Alvin I. (2001). "Experts: Which Ones Should You Trust?"** *Philosophy and Phenomenological Research* 63(1), 85-110. **Peer-reviewed journal article.** https://doi.org/10.1111/j.1933-1592.2001.tb00093.x  
*Why read:* Competing experts, layperson reliance, evidence for credibility.

<a id="r3"></a>**[R3] Lee, John D., and Katrina A. See. (2004). "Trust in Automation: Designing for Appropriate Reliance."** *Human Factors* 46(1), 50-80. **Peer-reviewed review article.** https://doi.org/10.1518/hfes.46.1.50_30392  
*Why read:* Human trust, automation use, and appropriate reliance.

### Consensus and social learning

<a id="r4"></a>**[R4] DeGroot, Morris H. (1974). "Reaching a Consensus."** *Journal of the American Statistical Association* 69(345), 118-121. **Peer-reviewed journal article.** https://doi.org/10.1080/01621459.1974.10480137  
*Why read:* Opinion-updating model and weighted social influence.

<a id="r5"></a>**[R5] Aumann, Robert J. (1976). "Agreeing to Disagree."** *The Annals of Statistics* 4(6), 1236-1239. **Peer-reviewed journal article.** https://doi.org/10.1214/aos/1176343654  
*Why read:* What common prior and common knowledge imply for posterior disagreement.

<a id="r6"></a>**[R6] Bikhchandani, Sushil; David Hirshleifer; and Ivo Welch. (1992). "A Theory of Fads, Fashion, Custom, and Cultural Change as Informational Cascades."** *Journal of Political Economy* 100(5), 992-1026. **Peer-reviewed journal article.** https://doi.org/10.1086/261849  
*Why read:* Rational imitation can suppress private information.

### Game theory and information economics

<a id="r7"></a>**[R7] Crawford, Vincent P., and Joel Sobel. (1982). "Strategic Information Transmission."** *Econometrica* 50(6), 1431-1451. **Peer-reviewed journal article.** https://doi.org/10.2307/1913390  
*Why read:* Canonical cheap-talk game with misaligned interests.

<a id="r8"></a>**[R8] Kamenica, Emir, and Matthew Gentzkow. (2011). "Bayesian Persuasion."** *American Economic Review* 101(6), 2590-2615. **Peer-reviewed journal article.** https://doi.org/10.1257/aer.101.6.2590  
*Why read:* Strategic information disclosure and receiver decisions. [Author-hosted PDF](https://web.stanford.edu/~gentzkow/research/BayesianPersuasion.pdf).

<a id="r9"></a>**[R9] Calvano, Emilio; Giacomo Calzolari; Vincenzo Denicolo; and Sergio Pastorello. (2020). "Artificial Intelligence, Algorithmic Pricing, and Collusion."** *American Economic Review* 110(10), 3267-3297. **Peer-reviewed journal article.** https://doi.org/10.1257/aer.20190623  
*Why read:* Learning-based tacit collusion in an economic repeated game; not a paper about factual agreement.

### Multi-agent AI safety and oversight

<a id="r10"></a>**[R10] Irving, Geoffrey; Paul Christiano; and Dario Amodei. (2018). "AI Safety via Debate."** **Research preprint.** https://arxiv.org/abs/1805.00899  
*Why read:* Competing agents as an oversight mechanism and its assumptions.

<a id="r11"></a>**[R11] Greenblatt, Ryan; Buck Shlegeris; Kshitij Sachan; and Fabien Roger. (2024). "AI Control: Improving Safety Despite Intentional Subversion."** *ICML 2024*, PMLR 235. **Peer-reviewed conference paper.** https://proceedings.mlr.press/v235/greenblatt24a.html  
*Why read:* Safety protocols with powerful untrusted models and trusted monitoring.

<a id="r12"></a>**[R12] Motwani, Sumeet Ramesh, et al. (2024). "Secret Collusion among AI Agents: Multi-Agent Deception via Steganography."** *NeurIPS 2024*. **Peer-reviewed conference paper.** https://proceedings.neurips.cc/paper_files/paper/2024/hash/861f7dad098aec1c3560fb7add468d41-Abstract-Conference.html  
*Why read:* Formal threat model, concealed communication, and oversight challenges.

<a id="r13"></a>**[R13] Hammond, Lewis, et al. (2025). "Multi-Agent Risks from Advanced AI."** **Technical report / arXiv preprint.** https://arxiv.org/abs/2502.14143  
*Why read:* Taxonomy of miscoordination, conflict, and collusion; useful for placing research into AI safety.

### Closely related recent empirical studies

<a id="r14"></a>**[R14] Hu, Jinwei; Xinmiao Huang; Youcheng Sun; Yi Dong; and Xiaowei Huang. (2026). "Lying with Truths: Open-Channel Multi-Agent Collusion for Belief Manipulation via Generative Montage."** *ACL 2026*. **Peer-reviewed conference paper.** https://aclanthology.org/2026.acl-long.270/  
*Why read:* Coordinated public dissemination of individually truthful fragments to manipulate a model's beliefs. [arXiv version](https://arxiv.org/abs/2601.01685).

<a id="r15"></a>**[R15] Okawa, Maya. (2026). "Emergence of Biased Consensus in Multi-Agent LLM Debates."** *ICML 2026*, PMLR 306. **Peer-reviewed conference paper.** https://proceedings.mlr.press/v306/okawa26a.html  
*Why read:* Collective bias, conformity, noise, and heterogeneity in model debate.

<a id="r16"></a>**[R16] Chen, Yongqiang; Gang Niu; James Cheng; Bo Han; and Masashi Sugiyama. (2025 submission; revised 2026). "When and Why Does Multi-Agent Debate Fail and Does It Really Underperform?"** **arXiv preprint; version and title may change.** https://arxiv.org/abs/2510.20963  
*Why read:* Incentive framing of competitive, consensus-seeking, and collaborative debate. Read theorem assumptions critically.

<a id="r17"></a>**[R17] Rose, Aaron; Carissa Cullen; Sahar Abdelnabi; Philip Torr; Brandon Gary Kaplowitz; and Christian Schroeder de Witt. (2026). "Detecting Multi-Agent Collusion Through Multi-Agent Interpretability."** **arXiv preprint, revised 12 October 2026 (v4); version may change.** https://arxiv.org/abs/2604.01151  
*Why read:* NARCBench, collusion detection from activations, and generalization under shift. [Research code/data](https://github.com/aaronrose227/narcbench).

<a id="r18"></a>**[R18] Kraidia, Insaf, et al. (2026). "When Collaboration Fails: Persuasion-Driven Adversarial Influence in Multi-Agent Large Language Model Debate."** *Scientific Reports* 16, article 11640. **Peer-reviewed journal article.** https://www.nature.com/articles/s41598-026-42705-7  
*Why read:* Controlled study of persuasive adversarial participation and group error.

### Optional additional perspective

**Hong, Lu, and Scott E. Page (2004). "Groups of Diverse Problem Solvers Can Outperform Groups of High-Ability Problem Solvers."** *PNAS* 101(46), 16385-16389. **Peer-reviewed journal article.** https://doi.org/10.1073/pnas.0403723101  
*Why read:* The possible value of diversity. Do not extrapolate its results to LLM committees without checking the assumptions of the original model and later critiques.

---

## 13. Decisions to record before your next mentor conversation

Fill in these five blanks after one or two paper-reading sessions:

1. **The phenomenon I want to explain is:** `________________________`.
2. **The nearest paper I must differentiate from is:** `________________________`.
3. **The mechanism I want to isolate is:** `shared evidence / conformity / persuasion / collusion / control / other`.
4. **My ground-truth outcome will be:** `________________________`.
5. **A result that would make me abandon my hypothesis is:** `________________________`.

**Initial recommendation:** Start with **RQ-A (dependent evidence and endorsement authority)** as a low-complexity evaluation pilot, while reading **[R12], [R14], [R16], and [R17]** to determine whether the more ambitious **RQ-B (strategic coordination under oversight)** or **RQ-C (multi-agent interpretability)** is a better fit for a technical AI safety research contribution.

**Connection to InGRID:** Concepts from the prior InGRID/Grid Nowcast work - provenance, claim lineage, time-valid evidence, review authority, and controlled promotion of judgments - can help motivate toy environments and evaluation protocol design. This document does **not** claim that the existing product proves the proposed mechanisms, nor does it assert the current code or deployment state. New results require separately run experiments.

**Research integrity note:** The bibliography links were checked against publisher/proceedings/arXiv records on the preparation date. Descriptions of author findings are attributed to the papers. Proposed mechanisms, hypotheses, experiments, and recommendations are original synthesis for scoping and have not been validated by running these experiments.

## 14. New-chat / new-research-session bootstrap prompt

If you move to a new conversation or research workspace, attach **this Markdown file** and use this starter request:

> I am an early-stage technical AI safety researcher exploring epistemic authority, strategic information sharing, game theory, and collusion in multi-agent AI. Treat the attached research starter as working context, **not as proof of novelty or completed experiments**. Start with its definitions and references. My current leading questions concern how source dependence, conformity, and incentives affect AI reviewer endorsements, and how oversight protocols can resist misleading consensus. Help me examine the closest papers carefully, distinguish empirical results from theoretical assumptions, and pick a narrow falsifiable question. First, create a comparison matrix for [R1], [R7], [R12], [R14], [R16], and [R17] (question, threat model, mechanisms, dataset, metrics, limitations, nearest overlap); then recommend a minimal controlled pilot. Verify paper versions and recent work before claiming a research gap.

For a **first mentor discussion**, you can use this even shorter opener:

> I am interested in how AI systems decide when to trust other AI agents. In particular, I want to distinguish agreement caused by independent evidence, copied information, social conformity, and deliberate coordination. I'm reading social epistemology, cheap-talk / persuasion models, and recent multi-agent AI control papers. Which distinction or experiment would you advise narrowing down first?
