# CLAUDE.md

@AGENTS.md

## Claude-specific notes

- Auto mode: prefer Bash for file reads and writes; use quoted heredocs (`<<'EOF'`) so
  backticks and dollar signs in Markdown and LaTeX are not expanded.
- Before a long writing task, read `GLOSSARY.md` and use its terms verbatim.
- After any change, run `python3 tools/check.py` and append to `STATUS.md`.
- Memory for this project lives in the Claude memory directory, not in this repository.

<!-- MEOS-REPO:START -->
## MEOS installed

This is a MEOS repository; `.meos/repo.json` is its indicator. The project
SessionStart hook in `.claude/settings.json` runs `bash ./meos start --runtime claude`
and prints the `[MEOS]` brief; if it did not run, run that command yourself from the
Git root. Then read [MEOS lifecycle](.meos/lifecycle.md) and follow the project's own
routes and skills (`.claude/skills/meos-*`). Independent review: `./meos review`
(GPT reviewer through Codex, read-only; never the author).
<!-- MEOS-REPO:END -->
