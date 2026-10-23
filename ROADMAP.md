# ROADMAP

The grand plan. Phases have absolute dates. Each phase ends at a decision point with a
written criterion. Execution is tool-agnostic: ideate in ChatGPT, implement in DeepSeek
Harness or Claude Code, run in `lab/`. The repository is the shared state.

## The research program in one paragraph

An oversight protocol can fail even when every agent says only true things, because the
protocol double-counts dependent evidence, lets endorsements become approvals without
checking independence, or lets incentive-aligned agents coordinate against the decider.
Phase 1 asks whether an auditor can tell collusion apart from the innocent explanations
(shared source, conformity, persuasion, parallel conduct, talk without action). Phase 3
asks whether typed claims and provenance constraints prevent the failure. Phase 5 asks
whether the distinction is readable inside an open-weight model. Each phase reuses the
same review game, glossary, and hypothesis registry.

## Phases

| Phase | Dates | Deliverable | Decision point |
|---|---|---|---|
| **0. Scaffold** | 2026-10-23 | This repository, runnable positive control, preregistration draft | Done when `tools/check.py` passes and `lab` tests pass. |
| **1. Apart Collusion Sprint, Track 2.3** | 2026-10-23 to 2026-10-25 (23:59 AoE = 2026-10-26 11:59 UTC) | 8-page report, abstract, limitations appendix, public repo | Submit if the positive control is detected by S3 and S4 auditors and at least one hypothesis has a result with an interval. Otherwise submit a negative result with the same rigor. |
| **2. Consolidate and learn** | 2026-10-26 to 2026-11-12 | Foundations read with quizzes done; 10 dossiers written; TARA topic submitted; sprint feedback logged | Choose TARA primary or fallback (D-007) based on whether regimes produced separable behavior. |
| **3. Apart AI x Epistemics Sprint (optional)** | 2026-11-13 to 2026-11-15 | Ontology-aware oversight defense: typed claims and provenance validator versus free-text reviewer | Go only if Phase 1 shipped and TARA topic is submitted. Falls on a TARA Saturday (2026-11-14): check attendance rule (11 of 14). |
| **4. TARA project prep** | 2026-11-16 to 2026-11-20 | Trajectory dataset exported; open-weight model chosen; activation extraction pipeline tested on 10 examples | Pipeline produces activations and a probe trains on a toy label. |
| **5. TARA project** | approx. 2026-11-21 to 2026-12-12 (confirm with teacher) | Probe results with anti-confound checks; presentation on 2026-12-12 | Presentation delivered. |
| **6. Write-up and next step** | 2026-12-13 to 2027-01-31 | Combined write-up; decide between fellowship application, workshop paper, or extension | Written decision in `DECISIONS.md`. |

## Milestones (checkable)

- [ ] M1 2026-10-23: `uv run pytest` passes; scripted positive control is flagged by the rule auditor at S3 and S4.
- [ ] M2 2026-10-24: `PREREGISTRATION.md` frozen; pilot of 6 case families run under all regimes with one LLM.
- [ ] M3 2026-10-25: held-out evaluation done; report drafted; limitations appendix written.
- [ ] M4 2026-10-26: submitted (or recorded why not).
- [ ] M5 2026-11-05: foundations 00-04 read; quizzes 01-04 answered in `study/notes/`.
- [ ] M6 2026-11-12: TARA topic submitted; dossiers for [R11], [R12], [R14], [R15], [R17], [S-Colosseum] written.
- [ ] M7 2026-11-20: activation pipeline runs end to end on 10 trajectories.
- [ ] M8 2026-12-12: TARA presentation.

## Dependencies

```
sprint regimes + game  ->  labeled trajectories  ->  TARA probe dataset
glossary               ->  every document
hypotheses registry    ->  preregistration (sprint)  ->  report
foundations 01, 04, 07 ->  sprint analysis
foundations 08         ->  TARA project
foundations 06         ->  epistemics sprint (phase 3)
```

## Budget

| Item | Estimate | Source |
|---|---|---|
| Sprint LLM trajectories (192 cells, small model) | USD 2-10 | own estimate; guide says USD 5-30 |
| Sprint LLM-judge auditor calls (up to 400) | USD 1-5 | own estimate |
| TARA activations (1.5B-7B open model, CPU or free Colab GPU) | USD 0 | local |
| Epistemics sprint | USD 5-20 | own estimate |

## What would make us change the plan

- Sprint submission form stays closed: finish the experiment anyway as a preprint-quality
  note; it is the TARA dataset.
- Regimes do not separate (LLM agents ignore payoffs): switch TARA to the fallback
  (behavioral RQ-A), which does not need separable collusion behavior.
- Organizers release labeled Colosseum logs: add as a second dataset, do not replace ours.
