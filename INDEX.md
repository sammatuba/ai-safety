# INDEX: every file, one line, and what to load for each task

Source of truth for routing: `tools/routes.json`. Bundle for paste-in tools:
`python3 tools/pack.py <task>`. Verify: `python3 tools/pack.py --check`.

## Routing by task

| Task key | Load, in order | Why |
|---|---|---|
| `session` | `AGENTS.md`, `STATUS.md` | Rules and current state. Always first. |
| `concept` | `GLOSSARY.md`, `foundations/00-map.md`, then the numbered document | Terms, then the map, then depth. |
| `sprint` | sprint `README.md`, `PLAN.md`, `PREREGISTRATION.md`, `design/regimes.md`, `design/auditors.md`, `hypotheses/HYPOTHESES.md` | Everything needed to run the sprint. |
| `sprint-report` | `GLOSSARY.md`, sprint `README.md`, `report/OUTLINE.md`, `PREREGISTRATION.md`, hypotheses, `literature/INDEX.md` | Writing the submission. |
| `tara` | TARA `README.md`, `TOPIC-SUBMISSION.md`, hypotheses, `literature/INDEX.md` | Topic submission and project plan. |
| `code` | `lab/README.md`, `GLOSSARY.md`, hypotheses | Implementation. |
| `paper` | `literature/EXTRACTION-RULES.md`, dossier template, `literature/INDEX.md` | Reading one paper into a dossier. |
| `hypothesis` | `hypotheses/HYPOTHESES.md`, `threat-models.md`, `confounds.md` | Adding or revising a hypothesis. |
| `plan` | `ROADMAP.md`, `DECISIONS.md`, `STATUS.md` | Re-planning. |
| `study` | `study/STUDY-PLAN.md`, `GLOSSARY.md`, `foundations/00-map.md` | A learning session. |
| `landscape` | landscape `README.md`, landscape project `PLAN.md`, `topics.json`, `coverage.md` | Persistent field map, source database, and collection ledger. |
| `brainstorm` | brainstorming guide, investigation study guide, prior-work review, candidate briefs, `ideas.json`, glossary, literature index | Conceptual grounds, teaching examples, speculative connections, and proposed experiments. |
| `explainer` | `explainer/README.md`, `GLOSSARY.md`, `foundations/00-map.md` | Running or updating the interactive learning layer. |
| `foundations-all` | all nine foundations documents | Full conceptual load (large). |

## Root

| File | One line |
|---|---|
| `AGENTS.md` | Universal agent contract: who reads, writing rules, epistemic rules, routing, conventions, protocol. |
| `CLAUDE.md` | Claude-specific superset; points to `AGENTS.md`. |
| `README.md` | Human entry point. |
| `INDEX.md` | This file. |
| `GLOSSARY.md` | Controlled vocabulary with banned synonyms. |
| `ROADMAP.md` | Phases, dates, milestones, decision points. |
| `STATUS.md` | Dated log of what changed, what is blocked, what is next. |
| `DECISIONS.md` | Decision records D-nnn with reasons and alternatives. |

## foundations/ (read in order)

| File | One line |
|---|---|
| `00-map.md` | The four lenses (ontology, epistemology, game theory, AI control), how they connect, reading order. |
| `01-evidence-independence.md` | Likelihood ratios, conditional independence, why copies do not add evidence, worked numbers. |
| `02-social-learning.md` | DeGroot consensus, information cascades, Aumann agreement, what each does and does not imply. |
| `03-strategic-communication.md` | Cheap talk, Bayesian persuasion, selective disclosure, truthful-fragment manipulation. |
| `04-collusion-and-plus-factors.md` | What collusion is, the three-part test, parallel conduct, antitrust plus factors mapped to agent trajectories. |
| `05-ai-control-and-oversight.md` | Debate, AI control, trusted monitoring, untrusted agents, where the authority transition sits. |
| `06-ontology-and-typed-claims.md` | Claims versus accepted facts, provenance, semantic promotion, what an ontology can and cannot guarantee. |
| `07-measurement.md` | Precision, recall, false-positive rate, AUROC, Brier, bootstrap by case family, seeds, paired designs. |
| `08-mechanistic-detection.md` | Activations, linear probes, anti-confound checks, how NARCBench frames collusion detection. |

## hypotheses/

| File | One line |
|---|---|
| `HYPOTHESES.md` | Registry: id, statement, prediction, falsifier, status, linked experiment. |
| `threat-models.md` | Who is untrusted, what channel exists, what the coalition wants, what the protocol protects. |
| `confounds.md` | Registry of confounds and the control that handles each. |

## literature/

| File | One line |
|---|---|
| `INDEX.md` | Reference table with ids [R1]..[R18], [S1].., [T1]..; status; closeness to our question. |
| `EXTRACTION-RULES.md` | Fidelity rules for writing dossiers. |
| `templates/PAPER-DOSSIER.md` | Dossier template with machine card. |
| `papers/` | One dossier per work. |
| `data/papers.jsonl` | Machine-readable cards, built from dossiers by `python3 tools/build-cards.py`. |
| `landscape/` | Broad AI safety map, SQLite database, portable graph exports, and DeepSeek collection ledger. |
| `landscape/brainstorming/` | Dedicated concept guide, canonical idea records, and generated cards with speculative graph links. |

## projects/

| Folder | One line |
|---|---|
| `2026-10-apart-collusion-sprint/` | Track 2.3: epistemic plus factors for distinguishing collusion from correlated agreement. |
| `2026-11-tara-project/` | TARA Round 2 2026 project topic: behavioral and mechanistic detection of correlated agreement versus collusion. |
| `2026-11-apart-epistemics-sprint/` | Placeholder: ontology-aware oversight as a defense (Trust Infrastructure track, 2026-11-13 to 2026-11-15). |
| `2026-10-ai-safety-landscape/` | Persistent broad AI safety research database and promotional search collection plan. |

## lab/

| File | One line |
|---|---|
| `README.md` | Setup with `uv`, package layout, how to run the simulator, notebooks, tests, LLM adapter. |
| `pyproject.toml` | Python 3.13 project. |
| `src/epistemic_lab/` | `schemas.py`, `bayes.py`, `cases.py`, `game.py`, `agents.py`, `auditors.py`, `metrics.py`, `llm.py`, `run.py`. |
| `notebooks/` | Percent-format `.py` notebooks, numbered. |
| `tests/` | pytest. |
| `configs/` | Case families and regime definitions (YAML/JSON). |

## prompts/, study/, templates/, tools/

| File | One line |
|---|---|
| `prompts/README.md` | How to start a session in ChatGPT, DeepSeek Harness, or Claude with the right bundle. |
| `prompts/bootstrap.md` | Universal bootstrap prompt. |
| `prompts/modes.md` | EXPLAIN, DECODE, DERIVE, TRACE, PAPER, CRITIQUE, QUIZ, SYNTHESIZE mode definitions. |
| `study/STUDY-PLAN.md` | Week-by-week plan tied to the roadmap. |
| `study/notes/` | Your concept and paper notes. |
| `study/quizzes/` | Self-check questions per foundations document. |
| `templates/*.md` | concept-doc, experiment-brief, decision, preregistration, session-log, topic-submission. |
| `tools/pack.py` | Bundle routed files for paste-in tools. |
| `tools/check.py` | Synonyms, links, frontmatter, routes. |
| `tools/build-cards.py` | Extracts dossier agent cards into `literature/data/papers.jsonl`. |
| `tools/build-glossary.py` | Rebuilds the explainer glossary data from `GLOSSARY.md`. |
| `tools/routes.json` | Routing table. |

## explainer/

| File | One line |
|---|---|
| `README.md` | How to open the guide, what each area covers, and how to keep it aligned with the Markdown sources. |
| `index.html` | Static page shell: top bar, sidebar, search overlay, term drawer. No build step. |
| `research.html` | Eight reading chapters, deterministic exercises, local notes, and three copy-ready project proposals. |
| `assets/styles.css` | Light and dark themes, responsive layout, page and demo styles. |
| `assets/app.js` | Hash routing, rendering, search, glossary, quizzes, and conditions workbench. |
| `assets/demos.js` | Eight deterministic demonstrations, one per foundation F01 to F08. |
| `assets/glossary-data.js` | Generated glossary data. Do not edit by hand. |
| `assets/foundations-data.js` | Explainer content for F00 to F08, aligned with `foundations/`. |
| `assets/site-data.js` | Lenses, reading path, eight regimes, and seven matched contrasts. |
| `assets/research-data.js` | Generated study content from canonical guides and form answers. |
| `assets/research.js`, `assets/research.css` | Study routing, exercises, self-checks, notes, search, and reading layout. |

## archive/

| File | One line |
|---|---|
| `2026-10-20-research-starter.md` | The original scoping document. Frozen. Its bibliography is the seed of `literature/INDEX.md`. |
