---
title: "Three model-focused research proposals for expert feedback"
status: draft
updated: 2026-10-29
depends_on: ["literature/INDEX.md", "literature/landscape/brainstorming/review-2026-10-29.md", "DECISIONS.md"]
---

# Three model-focused research proposals for expert feedback

Latest portfolio as of 2026-10-29. All proposed mechanisms are [SPECULATION].
This document preserves the final form drafts from the session.
The feasibility scores concern small initial studies, not publication readiness.
The owner chooses scores and collaborators. No project is selected or submitted.

Start with the [reading path](../../study/research-reading-2026-10-29.md).
The [related-literature review](../../literature/landscape/brainstorming/review-2026-10-29.md) records overlap and limits.

## Idea 1

**Project title:** Does Human Cancellation Survive AI Agent Delegation and Replanning?

**PROBLEM: What catastrophic AI risk is your project directed towards solving?**

Human control over powerful artificial intelligence (AI) systems depends on being able to stop dangerous activities.
A coordinating agent might acknowledge cancellation while delegated agents or replacement plans continue pursuing the same objective.
In consequential workflows, this could undermine human intervention and allow harmful activity to continue.

**GOAL: What will your project produce to help reduce this risk?**

I will produce an evaluation of whether human cancellation remains effective across delegated tasks and revised plans.
I will test whether explicit records of canceled objectives reduce unauthorized continuation while preserving unrelated permitted work.

**PROJECT PLAN: How will you achieve this goal?**

I will build short simulated workflows where models select actions and delegate subtasks.
After work has been assigned, a human instruction will cancel one objective while leaving another authorized.

I will compare a single-agent condition with delegated execution and delegated execution requiring replanning.
Matched controls will introduce a temporary failure instead of cancellation, so recovery should remain appropriate.

The main intervention will record the canceled objective and which existing subtasks it covers.
I will score subsequent actions against predefined rules, including whether renamed or reassigned tasks recreate the canceled objective.
Measures will include unauthorized continuation, permitted task completion, and unnecessary stoppage.
I will test on task families excluded from prompt development.

**Suggested feasibility:** 4/5.

**Area:** AI Control. Additional selections: evals; multi-agent systems.

**Prior-work positioning, outside the form:** T23 studies user retractions; T24 studies asynchronous replanning.
The proposed extension concerns withdrawal of authority across delegated work.
T14 and T25 constrain claims about shutdown behavior.

## Idea 2

**Project title:** Do Safety Outcome Labels Distort AI Evaluators' Choice of Follow-Up Tests?

**PROBLEM: What catastrophic AI risk is your project directed towards solving?**

An evaluation can show no harmful outcome because a model declined an action or because an external restriction prevented it.
These observations support different conclusions about safety.
If AI evaluators overlook that distinction, they may fail to test dangerous behavior before developers grant powerful systems greater access or autonomy.

**GOAL: What will your project produce to help reduce this risk?**

I will test whether the labels attached to evaluation results affect which safety tests models choose next.
The project will assess whether clearer descriptions help evaluators uncover failures that broad outcome labels leave unexplored.

**PROJECT PLAN: How will you achieve this goal?**

I will create evaluation records showing model refusal, unavailable tools, and externally blocked actions.
For each record, the underlying evidence will remain identical across conditions.
Only its presentation will change: a broad outcome label, a description of the observed mechanism, equivalent plain-language prose, or no summary label.

Evaluator models will choose follow-up tests from the same menu under a fixed budget.
The tests will change relevant conditions, such as tool availability, in a controlled environment with independently checkable outcomes.

I will measure failures discovered, useful tests selected, and unsupported final conclusions.
Direct comprehension questions will distinguish failure to understand the evidence from failure to use it.
Testing will include task families excluded from prompt development.

**Suggested feasibility:** 4/5.

**Area:** evals. Additional selections: Scalable Oversight; alignment science.

**Prior-work positioning, outside the form:** T20 studies evidence recovery; T21 studies specification-based testing.
T26 studies budgeted measurement selection. T10 and T11 also constrain broad investigation claims.
The proposed distinction concerns presentation of identical evidence and the evaluator's subsequent choice.
A benefit over equally informative prose is not assumed.

## Idea 3

**Project title:** Assigning Safety Responsibility for Interacting Tasks in AI Teams

**PROBLEM: What catastrophic AI risk is your project directed towards solving?**

Specialized AI agents may each satisfy their assigned requirements while their combined actions create a hazard.
In critical infrastructure or advanced AI development, safety checks limited to individual tasks could miss dangerous interactions.
As more consequential work is delegated, these gaps could contribute to large-scale accidents without malicious intent or collusion.

**GOAL: What will your project produce to help reduce this risk?**

I will evaluate whether assigning responsibility for interactions between tasks improves AI teams' safety.
The project will identify when local checks are sufficient and when teams need explicit responsibility for the complete workflow.

**PROJECT PLAN: How will you achieve this goal?**

I will start with two-agent planning tasks governed by explicit safety constraints.
One possible setting is maintenance scheduling, where individually acceptable schedules can jointly violate an availability requirement.

Where possible, I will keep the planning problem fixed and change task assignments.
The relevant interaction will fall within one agent's responsibility or cross between agents.
I will compare local safety duties with explicit duties to check interactions.
Both conditions will receive the same information and computation budget.

I will measure unsafe joint plans, hazards identified, and successful completion of safe plans.
A single-agent baseline and direct hazard-recognition checks will help separate responsibility effects from reasoning difficulty.
I will evaluate on held-out planning cases.

**Suggested feasibility:** 3/5.

**Area:** multi-agent systems. Additional selections: Scalable Oversight; evals.

**Prior-work positioning, outside the form:** T22 studies responsibility diffusion under intentionally harmful requests.
T17 studies distributed information and supplies strong comprehension controls.
T27 supplies system-safety theory about interaction and responsibility boundaries.
The candidate contrast concerns benign objectives and a fixed hazard under different responsibility assignments.

## Energy connection and boundaries

[INTERPRETATION] Idea 3 offers the clearest starting connection to the owner's energy experience.
Synthetic constraints can measure model decisions before physical-system simulation is introduced.
Operational validity and physical grid consequences require separate domain validation.
A non-energy case family would help distinguish a general model failure from domain unfamiliarity.

The Center for AI Safety overview [W8] supports organizational-risk and loss-of-control framing.
The Department of Energy announcement [W9] distinguishes unintentional AI failures from hostile use and attacks against AI.
The grid prototype [T28] distinguishes model behavior from externally enforced constraints.

No proposal establishes catastrophic outcomes, private motives, or learned behavior.
No new paid inference budget is authorized.

