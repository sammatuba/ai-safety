# Paper dossier template

Every file in `papers/` follows this shape. Replace `{{...}}`. The agent-card JSON block is
extracted by `tools/build-cards.py` into `data/papers.jsonl` and must stay valid JSON.

````markdown
---
id: "{{R14 | S1 | T1}}"
slug: "{{short-kebab-slug}}"
title: "{{full title, or 'title not yet verified'}}"
short: "{{Short name}}"
authors: ["{{Surname, Given}}", "..."]
year: {{2026}}
venue: "{{venue, or 'preprint'}}"
arxiv: "{{id or null}}"
doi: "{{doi or null}}"
urls:
  paper: "{{canonical url}}"
  code: "{{url or null}}"
status: "{{peer-reviewed | preprint | report | web page}}"
read_status: "{{stub | pass1 | pass2 | pass3}}"
closeness: {{1-5}}
extraction:
  basis: "{{full-text | abstract | readme | starter-annotation}}"
  sources_used: ["{{url or local path}}"]
  date: "{{YYYY-MM-DD}}"
updated: "{{YYYY-MM-DD}}"
---

# {{Short name}}: {{title}}

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

## Agent card

```json
{
  "id": "{{R14}}",
  "short": "{{Short name}}",
  "year": {{2026}},
  "venue": "{{venue}}",
  "status": "{{peer-reviewed}}",
  "closeness": {{5}},
  "one_liner": "{{one sentence}}",
  "tests_hypotheses": ["{{H-SPRINT-3}}"],
  "regimes_related": ["{{D}}"]
}
```
````
