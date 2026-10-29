# The Agreement Field Guide: interactive explainer

A static learning interface over this repository. It turns the nine foundations documents,
the conditions layer, and the controlled vocabulary into browsable pages with terms, quizzes,
and live demonstrations.

The Markdown files remain canonical. The explainer is a study aid. It is not a source of
truth, and it does not produce research findings.

## Open it

The new [research study companion](research.html) adds eight chapters on evidence,
diagnosis, repair, and catastrophic-risk relevance. It includes expense and investigation
exercises, focal-point and risk-pathway demonstrations, self-checks, local notes,
and copy-ready answers for all three project ideas.
Its readings come from the canonical brainstorming guides.
Run `python3 tools/build-study-pages.py` after changing those guides or `form-answers.json`.

There is no build step and no install. Open the page directly:

```text
explainer/index.html
```

A local server gives cleaner navigation and resolves the links to the Markdown sources:

```bash
cd explainer
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8000/>. Stop the server with Ctrl+C.

The page makes no network calls. All scripts are local classic scripts, so every route works
from `file://` as well.

## What you can explore

| Area | What is there |
|---|---|
| Overview | The organizing question, four lenses, concept map, and a seven-page reading path. |
| Foundations | One page each for F00 to F08, following the six-step teaching order: Purpose, Intuition, Mechanism, Formalism, Example, Significance. |
| Conditions | Assumptions and failure modes for every foundation, plus an eight-regime workbench with matched contrasts. |
| Glossary | Terms generated from `GLOSSARY.md`, with sections, banned synonyms, and links back to the pages where each term appears. |
| Search | One index over concepts, terms, and regimes. Press `/` or use the search button. |
| Self-check | One quiz per foundation, scored in the browser. No answers are stored. |

The eight regimes in the workbench are A, B, C, D, E0, E1, F, and P. The workbench compares
two at a time and exposes matched contrasts. The canonical definitions live in
`projects/2026-10-apart-collusion-sprint/design/regimes.md`.

## Live demos

Each demo is a deterministic model built for exploration. None of the numbers is an empirical
result. Each demo labels its own assumptions.

| Foundation | Demo | Controls |
|---|---|---|
| 01 Evidence independence | Provenance-aware evidence | Prior, reliability, number of reports, origin model. Shows the naive posterior beside the provenance-aware posterior. |
| 02 Social learning | Independence versus cascade | Signal accuracy, reviewer count, exposure toggle. Compares independent majority with a full information cascade. |
| 03 Strategic communication | Selective disclosure | Selection bias and number of items shown. Shows approval probability under weighted sampling. |
| 04 Collusion and plus factors | Three-part test | The eight regime presets, plus coalition, coordination mechanism, and outside cost toggles. |
| 05 AI control and oversight | Protocol placement | Five protocols. Shows where each sits in the flow and what it can and cannot see. |
| 06 Ontology and typed claims | Claim promotion | Claim predicate, number of origins, and typed transitions. Checks whether a claim may be promoted. |
| 07 Measurement | Threshold dashboard | Threshold on fixed illustrative scores. Shows the confusion matrix, recall, false-positive rate, precision, and AUROC. |
| 08 Mechanistic detection | Probe separation and confounds | Separation sliders and a six-item anti-confound checklist. |

The measurement scores are fixed for illustration. The mechanistic view is a schematic. Read
both as explanations of a method, not as evidence about a model.

## Files

| File | Role |
|---|---|
| `index.html` | Page shell, top bar, sidebar, search overlay, term drawer, and script order. |
| `assets/styles.css` | Design system, light and dark themes, responsive layout, and demo styles. |
| `assets/app.js` | Hash routing, page rendering, search, glossary drawer, quizzes, and the conditions workbench. |
| `assets/demos.js` | The eight interactive demos, exposed as `window.DEMOS`. |
| `assets/glossary-data.js` | Generated glossary data. Do not edit by hand. |
| `assets/foundations-data.js` | Hand-authored page content for F00 to F08. |
| `assets/site-data.js` | Lenses, map explanations, reading path, regimes, and contrasts. |
| `research.html`, `assets/research.js`, `assets/research.css` | Interactive reading path, exercises, notes, and form answers. |
| `assets/research-data.js` | Generated readings, idea records, and form drafts. Edit canonical sources instead. |
| `../tools/build-study-pages.py` | Regenerates study content and `TOPIC-SUBMISSION.md` from canonical records. |
| `../tools/build-glossary.py` | Rebuilds `glossary-data.js` from `GLOSSARY.md`. |

Routes use the hash fragment, for example `#/foundation/01`,
`#/conditions?tab=regimes&a=E1&b=E0`, and `#/glossary`. The browser stores only the theme
choice and visited-page markers in `localStorage`.

## Keeping it accurate

1. **Glossary.** Edit `GLOSSARY.md`, then run `python3 tools/build-glossary.py`. Never edit
   `assets/glossary-data.js` directly.
2. **Foundation pages.** When a file in `foundations/` changes, update the matching entry in
   `assets/foundations-data.js`. The explainer must not disagree with the canonical document.
3. **Regimes and contrasts.** Keep `assets/site-data.js` aligned with the sprint design files.
4. **Cache marker.** After changing a script or stylesheet, update the `?v=YYYYMMDD` markers in
   `index.html` so a browser reload picks up the change.

Statement kinds still apply in the interface. `[ESTABLISHED]`, `[FINDING]`,
`[INTERPRETATION]`, `[HYPOTHESIS]`, and `[SPECULATION]` tags appear where a reader could
confuse them.

## Checks

Run the repository checks from the repository root:

```bash
python3 tools/check.py
python3 tools/pack.py --check
```

Check JavaScript syntax with any Node.js installation:

```bash
for f in explainer/assets/*.js; do node --check "$f"; done
```

There is no test runner for the interface. Before reporting a change as done, open each route
at desktop and mobile width, exercise every demo, and confirm the browser console is clean.
