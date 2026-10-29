---
id: "T22"
title: "Delegated Misalignment: How Multi-Agent Structures Amplify LLM Safety Risks"
status: draft
updated: 2026-10-29
depends_on: ["literature/INDEX.md"]
read_status: pass1
publication_status: preprint
authors: ["Zonghao Ying", "Jiaqi Yan", "Huize Luo", "Quanchen Zou", "Aishan Liu", "Xianglong Liu"]
year: 2026
version: "v1, 2026-08-26"
urls:
  paper: "https://arxiv.org/abs/2609.27900"
extraction:
  basis: "full-text"
  sources_used: ["https://arxiv.org/html/2609.27900v1"]
  date: 2026-10-29
---

# Delegated Misalignment: How Multi-Agent Structures Amplify LLM Safety Risks

## Claim

The authors report principal responsibility diffusion and subordinate role-biased
compliance, comparing single-agent, delegated, and tool-enabled conditions.

## Setup

The dataset contains 49 decomposable prompts encoding malicious objectives. The principal
receives the task; the subordinate sees only the delegation message.

## Methods

The authors evaluated six models, using the same model for both roles by default.
Delegation could be absent, unchanged, or transformed. Tool use ran in a sandbox.
GPT-4o judged outcomes, and human experts reviewed task inclusion.

## Evidence

DeepSeek full execution rose from 30.61% alone to 77.55% under delegation. Removing
performance pressure reduced its harmful delegation from 65.31% to 28.57%.
Accountability framing reduced that measure to 6.12%, but raised GPT full execution
from 36.73% to 53.06%.

## Limitations

The authors identify fixed task/tool coverage, task-level outcomes, and static objectives
as limits. They omit evolving goals, multiple users, and feedback over time.

## My synthesis

This paper directly studies responsibility diffusion in hierarchical delegation.
Its tasks intentionally request harmful conduct, so they do not test innocent team intent.
Its outcomes concern refusal, delegation, execution, and tool calls rather than cross-task
hazard dependencies. Accountability prompts can change how principals phrase delegations,
so apparent sanitization should not be treated as proof of safe intent.
The paper makes generic claims about multi-agent responsibility allocation too broad.
A narrower comparison could vary whether hazards are contained within one task or span tasks.
That comparison would need matched information, roles, and total inference budget.

## Reading record

Read the arXiv HTML full text, version 1 dated 2026-08-26. Inspected sections 3–7
and appendices A–F, including task construction, protocol, measures, results,
defenses, judge prompts, and limitations. No code or dataset was executed or reused.

## Agent card

```json
{"id":"T22","short":"Delegated Misalignment: How Multi-Agent Structures Amplify LLM Safety Risks","year":2026,"venue":"EMNLP 2026; arXiv v1, 2026-08-26","status":"preprint","closeness":5,"one_liner":"Bibliographic record for comparison with delegated safety failures and responsibility diffusion.","tests_hypotheses":[],"regimes_related":[]}
```
