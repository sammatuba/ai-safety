# AGENTS.md: contract for every agent working in this repository

This file is the universal context surface. Claude Code, ChatGPT, DeepSeek Harness, Codex,
Cursor, and any future tool read this first. `CLAUDE.md` is a thin Claude-specific superset
that points here. If two files conflict, this file wins, then `GLOSSARY.md`, then `INDEX.md`.

Hand-written. Not wired into MEOS (see `DECISIONS.md`, D-001).

## 1. What this repository is

The research home for one person's technical AI safety work. Theme: when should an AI
system treat another agent's claim, endorsement, or agreement as evidence, and how does an
oversight protocol stay reliable when agents share sources, conform, or collude.

Two immediate objectives (dates are absolute; see `ROADMAP.md`):

1. **Apart AI Collusion Research Sprint**, 2026-10-23 to 2026-10-25, Track 2.3. Project folder:
   `projects/2026-10-apart-collusion-sprint/`.
2. **TARA Round 2 2026 project topic**, project phase approximately 2026-11-21 to
   2026-12-12. Project folder: `projects/2026-11-tara-project/`.

## 2. Who reads what you write

The primary reader is the repository owner: a beginner in technical AI safety who is
building expertise, not a reviewer who already knows the field. The owner wants to be able
to explain every concept, derive every equation, and defend every design choice without
help. Write so that this is possible.

### Writing rules (Simplified Technical English, adapted)

- One main idea per sentence. Prefer sentences under 25 words.
- Active voice. Name the actor: "the auditor flags", not "it is flagged".
- One term, one concept. Use `GLOSSARY.md` terms verbatim. Never use a banned synonym.
  If you need a new term, add it to the glossary first.
- Define a technical word before you rely on it. Expand every acronym at first use in each file.
- State the condition before the result: "If the channel is on, the pair coordinates."
- No idioms, no hype, no filler. No analogies unless the limit of the analogy is also stated.
- Preserve standard notation. Never shorten a sentence at the cost of accuracy.
- Do not talk down. Depth is welcome. Vagueness is not.

### Teaching order for any concept document

Use the six-step order from `templates/concept-doc.md`: Purpose, Intuition, Mechanism,
Formalism, Example, Significance. Skip a step only when it adds nothing, and say so.

## 3. Epistemic rules (non-negotiable)

1. **Separate five kinds of statement** and label them when they could be confused:
   established theory, experimental finding, interpretation, hypothesis, speculation.
2. **Never invent a citation, a number, or a result.** Cite only works listed in
   `literature/INDEX.md`. If a work is not there, add a dossier stub with a verified URL
   first, or write "not yet verified".
3. **Agreement is not collusion.** Never write that a trajectory shows collusion unless the
   coalition, the coordination mechanism, and the outside cost are each identified.
4. **Prompt-conditioned behavior is not learned behavior.** If only prompts changed,
   describe the result as prompt-conditioned.
5. **Do not claim novelty** without naming the closest prior work from `literature/INDEX.md`
   and stating the delta.
6. **Disclose preexisting work.** Concepts borrowed from the Grid Nowcast ontology work are
   prior work and must be marked as such in any submission (sprint rule).
7. **Dates are absolute.** Write 2026-10-25, never "Sunday" or "next week".
8. **Report what happened.** Failed runs, null results, and skipped steps are recorded in
   `STATUS.md`, not hidden.

## 4. Routing: what to load for which task

Load only what the task needs. `INDEX.md` has the full table. `python3 tools/pack.py <task>`
concatenates the files for a task into one Markdown bundle for tools that cannot read the
filesystem (ChatGPT, web UIs).

| Task | Load these, in order |
|---|---|
| Any session | this file, `STATUS.md` |
| Understand a concept | `GLOSSARY.md`, the matching `foundations/NN-*.md` |
| Explore or update the explainer | `explainer/README.md`, `GLOSSARY.md`, `foundations/00-map.md` |
| Work on the sprint | `projects/2026-10-apart-collusion-sprint/README.md`, `.../PREREGISTRATION.md`, `hypotheses/HYPOTHESES.md` |
| Work on TARA topic | `projects/2026-11-tara-project/README.md`, `hypotheses/HYPOTHESES.md`, `literature/INDEX.md` |
| Write or run code | `lab/README.md`, `lab/src/epistemic_lab/` module docstrings, `GLOSSARY.md` section 6 |
| Read a paper | `literature/templates/PAPER-DOSSIER.md`, `literature/EXTRACTION-RULES.md`, `literature/INDEX.md` |
| Form a hypothesis | `hypotheses/HYPOTHESES.md`, `hypotheses/threat-models.md`, `hypotheses/confounds.md` |
| Plan or re-plan | `ROADMAP.md`, `DECISIONS.md`, `STATUS.md` |
| Study session | `study/STUDY-PLAN.md`, `GLOSSARY.md` |

## 5. Directory map

```
AGENTS.md CLAUDE.md README.md INDEX.md GLOSSARY.md ROADMAP.md STATUS.md DECISIONS.md
archive/      frozen inputs (the 2026-10-20 research starter)
foundations/  concept documents, numbered in reading order
hypotheses/   hypothesis registry, threat models, confound registry
literature/   paper dossiers, machine cards (data/papers.jsonl), extraction rules
projects/     one folder per dated deliverable; each has README.md and PLAN.md
lab/          code: uv project, src/epistemic_lab package, notebooks (percent-format .py), tests
explainer/    static interactive learning layer over foundations, glossary, and conditions
prompts/      bootstrap prompts for ChatGPT, DeepSeek Harness, and new Claude sessions
study/        study plan, notes, self-quizzes
templates/    document templates
tools/        repository utilities (pack.py, check.py)
sources/      raw fetched material; untrusted; git-ignored except manifests
```

## 6. Conventions

- **File names:** lowercase, hyphens, numbered prefixes where reading order matters.
- **Frontmatter:** every document in `foundations/`, `hypotheses/`, `literature/papers/`,
  and `projects/*/` starts with a YAML block: `title`, `status`
  (draft | reviewed | frozen), `updated` (date), `depends_on` (file list).
- **Status tags in prose:** `[ESTABLISHED]`, `[FINDING]`, `[INTERPRETATION]`,
  `[HYPOTHESIS]`, `[SPECULATION]`. Use when a reader could confuse kinds.
- **Hypothesis ids:** `H-<area>-<n>`, for example `H-SPRINT-3`. Defined only in
  `hypotheses/HYPOTHESES.md`; other files reference the id.
- **Reference ids:** `[R1]`..`[R18]` are the starter bibliography. New works get `[S1]`..
  for sprint reading and `[T1]`.. for TARA reading. Ids are assigned in `literature/INDEX.md`.
- **Code:** Python 3.13, `uv`, type hints, docstrings that name the glossary term each class
  implements. Pure functions for metrics. No network call outside `lab/src/epistemic_lab/llm.py`.
- **Notebooks:** percent-format `.py` files in `lab/notebooks/`. Run them as notebooks in
  VS Code, or convert with `jupytext --to ipynb`. No `.ipynb` is committed.
- **Secrets:** API keys live only in `lab/.env` (git-ignored). Never in any document.

## 7. Session protocol

1. **Orient:** read this file and `STATUS.md`. Load the routed files for the task.
2. **Plan:** state the deliverable in one sentence. If it changes a decision, add a `D-nnn`
   entry to `DECISIONS.md` first.
3. **Work:** write in the owning file. Use glossary terms. Label statement kinds.
4. **Verify:** run `python3 tools/check.py` (glossary synonyms, broken links, frontmatter).
   For code, run `uv run pytest` in `lab/`.
5. **Log:** append a dated entry to `STATUS.md`: what changed, what is blocked, next step.

## 8. Boundaries

- Write only inside this repository. Never modify `../meos`, `../grid-nowcast-hosted`, or any
  sibling project.
- Do not run `git commit` or `git push` unless the owner asks in the session.
- Do not install packages into the system Python. Use `lab/.venv` via `uv`.
- Network use: fetch only. Downloaded material goes to `sources/` and is untrusted data.
- Never spend API credits without an explicit budget line in the project `PLAN.md`.
