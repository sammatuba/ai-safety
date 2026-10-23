# AI safety research: epistemic authority, correlated agreement, and collusion in multi-agent AI

**Owner:** Sam Matuba. **Started:** 2026-10-23. **Status:** active.

One question organizes everything here:

> When should an AI system treat another agent's claim, endorsement, or agreement as
> evidence, and how does an oversight protocol stay reliable when agents share sources,
> conform to each other, or coordinate against it?

This repository is built for one reader who is learning the field while doing the research.
Every concept document teaches before it asserts. Every hypothesis names what would refute
it. Every citation points to a verified source.

## Start here

| If you want to | Open |
|---|---|
| See what is happening now | `STATUS.md` |
| See the whole plan with dates | `ROADMAP.md` |
| Learn the concepts in order | `foundations/00-map.md` |
| Explore the concepts interactively | [explainer/index.html](explainer/index.html), no install (see [explainer/README.md](explainer/README.md)) |
| Look up a term | `GLOSSARY.md` |
| Find a file for a task | `INDEX.md` |
| Work on the Apart sprint (2026-10-23 to 2026-10-25) | `projects/2026-10-apart-collusion-sprint/README.md` |
| Work on the TARA topic submission | `projects/2026-11-tara-project/README.md` |
| Run or write code | `lab/README.md` |
| Start a session in ChatGPT or DeepSeek | `prompts/README.md`, then `python3 tools/pack.py <task>` |

## Immediate objectives

1. **Apart AI Collusion Research Sprint, Track 2.3** ("What should count as convincing
   evidence of collusion?"). Deadline 2026-10-25 23:59 Anywhere on Earth. Deliverable: an
   8-page report with a 150-250 word abstract and a required Limitations and Dual-Use appendix.
2. **TARA Round 2 2026 project topic.** Final presentations 2026-12-12. The three-week
   project phase is approximately 2026-11-21 to 2026-12-12 (confirm with your teacher).

## How the pieces fit

```
foundations/   what is known (theory, findings)      -> teaches you
hypotheses/    what we think and how it could fail    -> commits you
literature/    who already did what                  -> protects you from false novelty
projects/      dated deliverables                     -> ships
lab/           code that produces evidence            -> tests
explainer/     interactive learning layer             -> explores
study/         your learning loop                     -> grows you
```

## Rules in one breath

Use glossary terms verbatim. Label statement kinds. Never invent a citation. Agreement is
not collusion. Prompt-conditioned behavior is not learned behavior. Dates are absolute.
Full contract: `AGENTS.md`.

## First commit

The repository is initialized but nothing is committed. When ready:

```
git add -A && git commit -m "Scaffold ai-safety research repository (2026-10-23)"
```
