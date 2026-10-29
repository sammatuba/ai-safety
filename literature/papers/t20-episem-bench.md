---
id: "T20"
title: "EpiSEM-Bench: Evaluating Safety and Evidence Recovery in LLM Agents under Missing Evidence"
status: draft
updated: 2026-10-29
depends_on: ["literature/INDEX.md"]
read_status: pass1
authors: ["Qijin Zhang", "Hanzhen Wang", "Yuehan Zhao", "Haoyu Dai", "Yao Shu", "Zhongxiang Dai", "Shuang Qiu"]
year: 2026
version: "v1, 2026-10-22"
urls:
  paper: "https://arxiv.org/abs/2610.31650"
extraction:
  basis: "full-text"
  sources_used: ["https://arxiv.org/html/2610.31650v1"]
  date: 2026-10-29
---

# EpiSEM-Bench: Evaluating Safety and Evidence Recovery in LLM Agents under Missing Evidence

## Claim in one sentence

The authors introduce a benchmark that tests unsafe action and useful evidence recovery when safety-relevant facts are missing.

## Setup

The benchmark has 300 matched unsafe and safe task pairs across six domains. Each environment provides read tools, optional preparation tools, and a consequential commit tool. The evaluator checks commits against the complete environment state. Ten models were evaluated.

## Methods

The authors suppress annotated facts while keeping world state, rules, requests, and remaining true observations fixed. They compare complete evidence, persistent omission, and omission with an independent recovery source. They report safety, completion, recovery, boundary, and interaction-cost measures. Omission combinations are adaptively tested to find the first observed unsafe boundary or exhaust coverage.

## Evidence

Across ten models, evidence recovery reduced unsafe execution, but models differed in whether they sought missing facts and used them appropriately. The authors report both task-level regressions and gains. See Table 1 and Figures 2–3.

## Limitations

The authors state that GPT-6-Luna and Claude-Haiku-5.5 were selected as fast variants to limit inference cost and latency; results may not generalize to larger models in either family. The benchmark uses fact suppression and separate unsafe/safe twin rollouts. The reported evaluation covers six domains and ten models. No randomized category-label or prose intervention is tested.

## My synthesis

This is close prior work on evidence seeking and safety-relevant action after missing evidence. It does not test whether a category label changes an evaluator’s choice among follow-up tests. Its matched worlds, full-state oracle, and separate acquisition and action records are useful design patterns. The narrow candidate distinction is randomized framing of an identical trace and fixed test menu, with failure discovery scored against ground truth.

## Agent card

```json
{"id":"T20","short":"EpiSEM-Bench","year":2026,"venue":"arXiv v1, 2026-10-22","status":"preprint","closeness":5,"one_liner":"Benchmarks safety and useful evidence recovery under controlled fact omission.","tests_hypotheses":[],"regimes_related":[]}
```
