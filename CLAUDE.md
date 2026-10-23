# CLAUDE.md

@AGENTS.md

## Claude-specific notes

- Auto mode: prefer Bash for file reads and writes; use quoted heredocs (`<<'EOF'`) so
  backticks and dollar signs in Markdown and LaTeX are not expanded.
- Before a long writing task, read `GLOSSARY.md` and use its terms verbatim.
- After any change, run `python3 tools/check.py` and append to `STATUS.md`.
- Memory for this project lives in the Claude memory directory, not in this repository.
