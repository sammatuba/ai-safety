---
title: "Sprint execution plan"
status: draft
updated: 2026-10-23
depends_on: ["README.md", "PREREGISTRATION.md"]
---

# Sprint execution plan

Tool-agnostic. Each step names its input file, its output file, and its check. Do the
steps in order. If a step fails its check, stop and log in `STATUS.md`.

## Stop rules

- Do not spend API credit before `PREREGISTRATION.md` has `frozen_on` set.
- Do not run the held-out families until the decision rule is written in
  `design/auditors.md` section 5 and the dev results are logged.
- If by 2026-10-25 12:00 Manila the LLM regimes do not separate (all regimes give the same
  approval rates within noise), switch the report to the scripted-agent study plus the
  Bayesian analysis, and state that LLM behavior under these prompts was not separable.

## Budget

| Line | Calls | Est. tokens | Est. cost (USD) |
|---|---|---|---|
| Pilot: 6 families x 2 truths x 8 regimes = 96 trajectories, about 5 calls each | 480 | 0.7M | 0.5 to 2 |
| Main: 12 families x 2 x 8 = 192 trajectories x 1 seed | 960 | 1.4M | 1 to 4 |
| Extra seeds (optional): x2 more | 1920 | 2.8M | 2 to 8 |
| LLM-judge auditors: 192 x 2 slices (S3, S4) | 384 | 0.6M | 0.5 to 2 |
| **Total** | | | **2 to 15** |

Model: one small instruction model via OpenRouter or Nebius (set `LLM_MODEL` in
`lab/.env`). Record the exact model id, temperature (0.2 for agents, 0 for judges), and date
in `lab/data/runs/<run_id>/meta.json`.

## 2026-10-23 (Friday)

| Step | Input | Output | Check |
|---|---|---|---|
| F1 Read the brief, regimes, auditors | this folder | understanding | You can state the three sprint case types and which regime is each. |
| F2 Set up lab | `lab/README.md` | `lab/.venv` | `uv run pytest` passes. |
| F3 Run scripted demo | `lab/src/epistemic_lab/run.py --demo` | console table | Positive control P flagged by rule auditor at S3 and S4; negative control A not flagged. |
| F4 Read Bayesian demo | `lab/notebooks/01_evidence_independence.py` | your note in `study/notes/` | You can explain why three copies give 80 percent, not 98.5 percent. |
| F5 Sign up; Discord; confirm form status | sprint page | `STATUS.md` entry | Written answer: open or closed. |
| F6 Draft preregistration | `PREREGISTRATION.md` | filled tables | Every hypothesis has a number or direction and a falsifier. |

## 2026-10-24 (Saturday)

| Step | Input | Output | Check |
|---|---|---|---|
| S1 Set `lab/.env`; smoke test one LLM call | `lab/README.md` | cached response | One trajectory under regime A completes and logs. |
| S2 Freeze preregistration | `PREREGISTRATION.md` | `frozen_on: 2026-10-24` | No further edits except the Amendments table. |
| S3 Pilot: 6 dev families x 8 regimes | `lab/configs/cases_dev.json` | `lab/data/runs/pilot/` | 96 trajectories; read 16 by hand (2 per regime); log failure categories. |
| S4 Fix prompts only for parse failures | pilot logs | amended prompts | Record every change in Amendments. Do not tune toward the hypothesis. |
| S5 Dev run (re-run 6 dev families if prompts changed) | configs | `lab/data/runs/dev/` | Approval rates per regime table. |
| S6 Fit and freeze decision rule on dev | `auditors.py` | `design/auditors.md` section 5 | Threshold or logistic weights written with date. |
| S7 Compute dev metrics | `metrics.py` | `report/tables/dev.md` | Per-regime flag rate; FPR; recall; AUROC; intervals. |

## 2026-10-25 (Sunday)

| Step | Input | Output | Check |
|---|---|---|---|
| U1 Held-out run: 6 families x 8 regimes | configs | `lab/data/runs/heldout/` | 96 trajectories. |
| U2 Held-out metrics with bootstrap by family | `metrics.py` | `report/tables/heldout.md` | Each hypothesis marked supported, refuted, or inconclusive. |
| U3 Δ_comm and matched aligned contrast | `metrics.py` | table | Intervals reported. |
| U4 Error analysis: every false positive and miss under S4 | logs | `report/ERRORS.md` | Each assigned a failure category from the glossary. |
| U5 Write report | `report/OUTLINE.md` | PDF via template | 8 pages; abstract 150 to 250 words; positive control reported; variance reported. |
| U6 Limitations and dual-use appendix | `report/LIMITATIONS.md` | appendix | Covers prompt-conditioned behavior, single model, synthetic cases, dual use of plus factors. |
| U7 Public repo | `lab/` | GitHub | README marks preexisting work; run instructions reproduce one figure. |

## 2026-10-26 (Monday, before 19:59 Manila)

| Step | Check |
|---|---|
| M1 Re-read against judging criteria: impact and innovation, execution quality, presentation | Each criterion has one paragraph that answers it. |
| M2 Submit; save confirmation | `STATUS.md` entry with time. |

## Division of labor if a team forms

| Role | Owns |
|---|---|
| Environment | `game.py`, `cases.py`, configs |
| Agents and prompts | `agents.py`, `llm.py`, prompt files |
| Auditors and metrics | `auditors.py`, `metrics.py`, tables |
| Report | `report/`, figures, limitations |
