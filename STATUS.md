# STATUS

Append-only log. Newest entry first. Each entry: date, what changed, what is blocked, next step.

## 2026-10-23: interactive explainer built and verified

**Changed.** Added `explainer/`, a dependency-free static learning interface over the nine
foundations, the conditions layer, and the glossary. It has nine foundation pages that follow
the six-step order, one self-check per foundation, a search overlay, a term drawer, light and
dark themes, an eight-regime comparison workbench with seven matched contrasts, and one
deterministic demo for each foundation F01 to F08. Added `tools/build-glossary.py`, which
generates `explainer/assets/glossary-data.js` from the canonical `GLOSSARY.md` (106 terms in
12 sections). Added `explainer/README.md`, routed it through `AGENTS.md`, `README.md`,
`INDEX.md`, and `tools/routes.json`, and recorded D-008.

**Verified.** `python3 tools/check.py`: 68 Markdown files, 0 synonym warnings, 0 broken
links, 0 frontmatter failures, 0 missing routed files. `python3 tools/pack.py --check`: 0
missing files across 12 tasks. Node syntax checks pass for all five JavaScript files. A
headless Brave (Chromium) run through the Chrome DevTools Protocol passed 89/89 checks. The
run covered every route, quiz scoring, all eight demos, the regime comparison, glossary
filters and drawer, search overlay, theme toggle, and a clean runtime console. Opening
`explainer/index.html` directly over `file://` loaded all data globals and produced no runtime
errors. Reviewed screenshots at 1440x1100 and 390x844. The bar fills were initially invisible
because the bar spans were inline; fixed with `display: block`.

**Limits.** The demos are deterministic teaching models, not empirical results. The
measurement scores are fixed and illustrative. The foundation pages are hand-authored from
`foundations/`, so they can drift until a generator exists; `explainer/README.md` names the
sync rule. No commit or push.

**Next.**
1. Use the explainer while reading `foundations/01`, `04`, and `07`; record quiz misses in
   `study/`.
2. Update `explainer/assets/foundations-data.js` and `explainer/assets/site-data.js` after any
   change to the canonical foundations or regimes.
3. Before the sprint submission, re-read the explainer's regime and plus-factor pages against
   `PREREGISTRATION.md`.

## 2026-10-23: repository scaffolded and pipeline verified

**Changed.** Created the full repository: agent contract (`AGENTS.md`), controlled
vocabulary (`GLOSSARY.md`, 12 sections), routing (`INDEX.md`, `tools/routes.json`,
`tools/pack.py`), hygiene checker (`tools/check.py`), nine foundations documents with
quizzes, hypothesis registry (H-CORE 1-4, H-SPRINT 1-5, H-TARA 1-3 and F1, H-EPI 1-2),
threat models TM-0..5, confounds CF-1..12, literature index (R1-R19, S1-S26, W, U) with 13
dossier stubs and `papers.jsonl`, sprint project (brief, hour-by-hour plan, preregistration
draft, game/regimes/auditors specs, report outline, limitations list), TARA brief and topic
submission draft, epistemics sprint placeholder, study plan, prompts for paste-in tools,
and the `lab/` package (2,500 lines of Python, 14 tests passing). Moved the 2026-10-20
research starter to `archive/`. Initialized git; no commit.

**Verified.** `uv run pytest`: 14 passed. `uv run elab demo --seeds 5`: 960 scripted
trajectories; positive control P flagged by S3 and S4 at 100 percent; negative control A
never flagged by S4; shared source B − A = 0.150 [0.086, 0.200]; parallel conduct E0 − A =
0.550 [0.486, 0.613]. `python3 tools/check.py`: 0 warnings, 0 broken links, 0 frontmatter
failures. `python3 tools/pack.py --check`: all routed files exist.

**Finding (scripted world).** The first S4 hand rule scored the positive control at 0.36
because it discounted for "channel did not change action". In a one-shot unanimity game an
approval-seeking reviewer endorses regardless of a channel (dominant strategy), so Δ_comm = 0
for scripted agents. Rule changed: counterfactual shift is an upgrade, not a discount.
Recorded in `design/auditors.md`, `design/regimes.md` section 4, and the preregistration.
H-SPRINT-4 now reads as a test of whether LLM agents fall short of the dominant strategy
without coordination.

**Fix after review (2026-10-23, same day).** The regime label was identifiable from two S4
features (payoffs aligned and private channel used). The preregistered primary slice is now
S4d (no payoff input); full S4 is exploratory; a behavioral collusion label (plan proposed
and followed) is reported alongside the regime label (CF-13). Regime F's proposer now sees
channel = none so its prompt is identical to A's. A fake-client test covers the LLM path.
16 tests pass.

**Blocked / unverified.**
- The Apart sprint page showed "The submission window has closed" on 2026-10-23 while the
  sign-up form was open and the stated deadline is 2026-10-25 23:59 AoE. Resolve on the
  sprint Discord before writing the report.
- TARA topic submission format and due date are not published. Confirm with the teacher.
  The project window 2026-11-21 to 2026-12-12 is an inference.
- No API keys configured; no LLM trajectory has been generated. All results so far are
  scripted.
- Grid Nowcast ontology files are not on this machine; concepts only.
- S-series literature titles are unverified until dossiers are written from the papers.

**Next.**
1. Sign up on the sprint page; join Discord; record the submission-form answer here.
2. `cp lab/.env.example lab/.env`, add a key, run one regime-A trajectory as a smoke test.
3. Set `frozen_on` in `PREREGISTRATION.md`; run `elab llm --split dev --run-id dev-2026-10-24`.
4. Read `foundations/01`, `04`, `07`; answer the quizzes from memory.
5. First commit: `git add -A && git commit -m "Scaffold ai-safety research repository (2026-10-23)"`.
