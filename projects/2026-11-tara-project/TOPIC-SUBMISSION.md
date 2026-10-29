---
title: "TARA ideas form answers"
status: draft
updated: 2026-10-28
depends_on: ["projects/2026-11-tara-project/form-answers.json", "DECISIONS.md"]
---

# TARA ideas form answers

Generated from `form-answers.json`. Edit that file and regenerate.

Draft status: copy-ready. The owner will submit the form manually.

## Personal fields

Name: Jan Samuel Matuba

Email: jscmatuba@gmail.com

Slack handle, city, group members, and collaborator preference: fill these in the actual form.

All three ideas are provided for the owner to choose and submit once.

Feasibility scores below are suggestions for the owner to choose.

## Idea 1: Finding and Fixing Failures in AI Safety Evaluations

Role: recommended first idea.

**Project title:** Finding and Fixing Failures in AI Safety Evaluations

**PROBLEM:** AI developers may use AI agents to run safety evaluations and summarize results. If agents omit tests or misreport outcomes, humans could underestimate dangerous capabilities and grant unsafe permissions. This could weaken safeguards against loss of control over powerful AI systems.

**GOAL:** I will build a small evaluation for AI investigators that inspect faulty safety evaluations. It will measure whether investigators find useful evidence, recommend effective repairs, and avoid unsupported approvals or accusations.

**PROJECT PLAN:** I will build a small, executable evaluation workflow with clean cases and controlled failures in test execution, scoring, and reporting. Investigators will receive limited access to logs, raw results, and reruns. I will compare a standard investigation prompt, an explicit checklist, and a structured evidence record under matched evidence and computation budgets. I will execute recommended repairs and measure repair success, approval decisions, unsupported causal claims, and cost. I will evaluate on held-out failure families.

**Suggested feasibility:** 3/5.

**Suggested area:** AI evaluations and AI control.

**Open to collaborators:** pending owner preference.

## Idea 2: Which Evidence Checks Prevent False Assurance in AI Evaluations?

Role: recommended second idea.

**Project title:** Which Evidence Checks Prevent False Assurance in AI Evaluations?

**PROBLEM:** AI safety reviews can approve reassuring reports that omit required tests or extend results beyond their supported scope. If these reports guide deployment, humans may give powerful AI systems more access than the evidence warrants. Several reviewers can repeat the same mistake when they rely on one report.

**GOAL:** I will produce a reproducible set of evaluation artifacts and compare ways to check their claims. The goal is to identify evidence checks that prevent unsupported approvals while preserving warranted approvals.

**PROJECT PLAN:** I will create paired reports with complete evidence, omitted results, incorrect scoring, and unsupported changes in model version or scope. I will compare an explicit prose checklist with typed claim fields, both with and without access to independent artifacts. I will include simple executable checks as baselines. I will measure unsupported approvals, warranted approvals, deferrals, and review cost on held-out failure families. This separates benefits from clearer representation and benefits from additional trusted evidence.

**Suggested feasibility:** 3/5.

**Suggested area:** AI evaluations and scalable oversight.

**Open to collaborators:** pending owner preference.

## Idea 3: Can Artifact Sanitization Reduce Coordination Against AI Monitors?

Role: optional third idea.

**Project title:** Can Artifact Sanitization Reduce Coordination Against AI Monitors?

**PROBLEM:** An untrusted AI system and an untrusted monitor could use shared artifact features to coordinate against an oversight protocol. Blocking private messages may leave these cues available. If the monitor approves harmful outputs, humans could lose an important safeguard around powerful AI systems.

**GOAL:** I will test whether transformations that preserve program behavior disrupt compatible subversion strategies without reducing legitimate defect detection. The project will produce a bounded replication and a comparison of candidate defenses.

**PROJECT PLAN:** I will first attempt a small replication of published focal-point subversion in a programming-task setting. I will freeze sampled strategies and compare unchanged programs, comment removal, and validated identifier normalization. I will check program behavior before and after each transformation. I will measure verified defects accepted by monitors that still pass audits, ordinary defect detection, and useful task performance. If replication does not produce suitable cases within the declared budget, I will report that limit and restrict the project to the replication.

**Suggested feasibility:** 2/5.

**Suggested area:** AI control and multi-agent safety.

**Open to collaborators:** pending owner preference.

## Prior work and scope

The proposal makes no novelty claim. Review the linked candidate briefs before final project selection.

[Candidate briefs](../../literature/landscape/brainstorming/candidate-briefs.md).

[Interactive reading pages](../../explainer/research.html).

The earlier probe proposal is preserved in `topic-submission-2026-10-23.md`.
