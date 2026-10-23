---
id: "R17"
slug: "narcbench-collusion-interpretability"
title: "Detecting Multi-Agent Collusion Through Multi-Agent Interpretability"
short: "Rose et al. 2026"
authors: ["Rose, Aaron", "Cullen, Carissa", "Abdelnabi, Sahar", "Torr, Philip", "Kaplowitz, Brandon Gary", "Schroeder de Witt, Christian"]
year: 2026
venue: "preprint (arXiv v4, revised 2026-10-12)"
arxiv: "2604.01151"
doi: null
urls:
  paper: "https://arxiv.org/abs/2604.01151"
  code: "https://github.com/aaronrose227/narcbench"
status: "preprint"
read_status: "stub"
closeness: 5
extraction:
  basis: "starter-annotation"
  sources_used: ["https://arxiv.org/abs/2604.01151", "archive/2026-10-20-research-starter.md"]
  date: "2026-10-23"
updated: "2026-10-23"
---

# Rose et al. 2026: Detecting Multi-Agent Collusion Through Multi-Agent Interpretability

> **Stub.** Verified metadata and the research starter's annotation only. This file makes no
> claim about the paper's content until `read_status` is `pass1` or later.

## Claim in one sentence

(not yet read)

## Why this matters for my question

Per the research starter's annotation: the paper introduces NARCBench and activation-based detection of collusive behavior across groups, including distribution-shift tests. The starter notes the distinction between benchmark labels for instructed collusion and evidence that a deployed model would choose to collude. This is the nearest work for the TARA project (H-TARA-1 to 3) and our regimes are designed as the confound set its probes would need.

## Setup
- Actors / agents: (not yet read)
- Information available to each: (not yet read)
- Incentives and objectives: (not yet read)
- Communication channels: (not yet read)
- Who decides / who judges: (not yet read)

## Methods
- Formal assumptions: (not yet read)
- Intervention / experimental condition: (not yet read)
- Baselines: (not yet read)
- Dataset / sample / model / compute: (not yet read)
- Metrics and evaluation: (not yet read)

## Evidence
- Strongest result and exact figure/table: (not yet read)
- Strongest alternative explanation: (not yet read)
- What is established vs merely proposed: (not yet read)

## Limitations
- Threat-model assumptions: (not yet read)
- Confounds: (not yet read)
- Generalization limits: (not yet read)
- What was not tested: (not yet read)

## My synthesis
- This paper answers: (not yet read)
- It leaves open: (not yet read)
- Closest other papers: (not yet read)
- One potential follow-up experiment: (not yet read)

## Agent card

```json
{
  "id": "R17",
  "short": "Rose et al. 2026",
  "year": 2026,
  "venue": "preprint (arXiv v4, revised 2026-10-12)",
  "status": "preprint",
  "closeness": 5,
  "one_liner": "NARCBench, collusion detection from activations, and generalization under shift.",
  "tests_hypotheses": [
    "H-TARA-1",
    "H-TARA-2",
    "H-TARA-3",
    "H-CORE-4"
  ],
  "regimes_related": [
    "E0",
    "E1",
    "P"
  ]
}
```
