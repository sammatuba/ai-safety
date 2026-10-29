---
id: "T21"
title: "Specification-Based Testing of Large Language Models"
status: draft
updated: 2026-10-29
depends_on: ["literature/INDEX.md"]
read_status: pass1
authors: ["Kausar Moshood", "Jace Bolante", "Roshan Aditya Murali", "Manish Motwani"]
year: 2026
version: "v1, 2026-10-10"
urls:
  paper: "https://arxiv.org/abs/2610.14443"
  code: "https://github.com/ANSWER-OSU/LEST-Replication-Package"
extraction:
  basis: "full-text"
  sources_used: ["https://arxiv.org/html/2610.14443v1"]
  date: 2026-10-29
---

# Specification-Based Testing of Large Language Models

## Claim in one sentence

The authors introduce LEST, which maps documented safety claims to prompts, mutates prompts, and traces validated counterexamples back to claims.

## Setup

LEST uses system cards for Claude Opus 4.8 and GPT-5.5, 97 SORRY-Bench seed prompts, and three safety domains. Three annotators support claim identification and validation.

## Methods

Seven mutation operators generate tests from mapped seed prompts. The authors run five independent fuzzing runs with 20-minute budgets, then query each model on 1,836 unique mutations. Three response classifiers flag refusal-to-compliance candidates. Human annotators validate candidates for preserved intent and genuine compliance.

## Evidence

The authors identify 56 claims; 29 are prompt-testable and 17 are covered by a seed prompt. The classifiers flag 312 candidate transitions; 19 (6.1%) pass human validation. Those transitions expose counterexamples for 6 of 9 covered refusal-testable claims. See Sections 5.2.1–5.2.3.

## Limitations

The authors limit the study to black-box prompt-testable claims, refusal as the behavioral oracle, seven mutation operators, and three safety domains. They note subjective annotation, possible automated false negatives, mutation and response randomness, and limited external validity from two models and 97 seeds. The code, annotations, generated prompts, and evaluation data are released.

## My synthesis

This is the closest competitor on safety categories, test coverage, and discovered failures. Its category labels help map claims to existing tests; it does not randomize category wording or study an evaluator’s sequential choice among tests under a fixed budget. The low validation rate makes independent ground-truth failure checks essential. The replication package can inform test generation and validation, but does not appear to implement the proposed framing intervention.

## Agent card

```json
{"id":"T21","short":"Specification-Based Testing of Large Language Models","year":2026,"venue":"arXiv v1, 2026-10-10","status":"preprint","closeness":5,"one_liner":"Maps documented safety claims to prompts and traces validated mutation failures back to claims.","tests_hypotheses":[],"regimes_related":[]}
```
