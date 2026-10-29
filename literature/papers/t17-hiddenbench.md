---
id: "T17"
slug: "hiddenbench"
title: "Systematic Failures in Collective Reasoning under Distributed Information in Multi-Agent LLMs"
short: "HiddenBench"
authors: ["Li, Yuxuan", "Naito, Aoi", "Shirado, Hirokazu"]
year: 2026
venue: "ICML 2026; arXiv v4"
arxiv: "2505.11556"
doi: "10.48550/arXiv.2505.11556"
urls:
  paper: "https://arxiv.org/abs/2505.11556"
  code: null
status: "peer-reviewed"
read_status: "pass1"
closeness: 5
extraction:
  basis: "full-text"
  sources_used: ["https://arxiv.org/html/2505.11556v4"]
  date: "2026-10-29"
updated: "2026-10-29"
---

# HiddenBench: Systematic Failures in Collective Reasoning under Distributed Information in Multi-Agent LLMs

## Claim

The authors introduce a 65-task benchmark for collective reasoning with distributed
information. A structured communication protocol improves tested performance.

## Setup

Hidden Profile agents receive shared facts favoring a wrong option and separate unique
facts supporting the correct option. Full Profile agents receive all facts.

## Methods

The authors generated tasks with GPT-4.1, filtered them using Full and Hidden Profile
accuracy thresholds, and evaluated 15 models with 10 sessions per task. Ablations
tested communication and disclosure protocols.

## Evidence

The authors report 30.1% group accuracy with distributed information versus 80.7%
for single agents with complete information. On 18 tasks, structured communication
reached 0.800 for GPT-4.1 and 0.727 for Gemini-2.5-Flash.

## Limitations

The authors note that task semantics affect recognition of relevant facts. The controlled
scenarios do not establish reliability in operational settings.

## My synthesis

HiddenBench isolates whether agents surface information held by their partners.
Its Full Profile control helps separate individual comprehension from interaction failure.
Its main manipulation concerns who knows which facts, rather than who owns a safety duty.
The structured protocol gives agents a process for sharing evidence and checking a leading option.
This work is a strong precedent for matched individual and group controls.
It does not test whether hazards that span tasks change how agents should divide responsibility.
Any comparison should still control total information and interaction budget.

## Reading record

Read the arXiv HTML full text, version 4 dated 2026-05-13. Inspected sections 3–6
and appendices A.2–A.4, including task construction, results, interventions, and limitations.
No code or dataset was executed or reused.

## Agent card

```json
{"id":"T17","short":"HiddenBench","year":2026,"venue":"ICML 2026; arXiv v4, 2026-05-13","status":"peer-reviewed","closeness":5,"one_liner":"Bibliographic record for multi-agent collective reasoning under distributed information.","tests_hypotheses":[],"regimes_related":[]}
```
