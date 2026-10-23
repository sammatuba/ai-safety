#!/usr/bin/env python3
"""Repository hygiene checks.

Checks:
  1. Banned synonyms from GLOSSARY.md "Do not write" column do not appear in prose
     (reported as warnings; some banned words are legitimate in quotes or code).
  2. Relative Markdown links resolve to files.
  3. Documents in foundations/, hypotheses/, projects/ have YAML frontmatter with
     title, status, updated.
  4. Every file in tools/routes.json exists.

Usage: python3 tools/check.py [--strict]
Exit code 1 only on link, frontmatter, or route failures; synonym hits are warnings
unless --strict.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {".git", ".venv", "lab/.venv", "node_modules", "sources", "archive", "lab/data", "__pycache__"}
FRONTMATTER_DIRS = ["foundations", "hypotheses", "projects", "literature/papers"]

# Narrow list: words that are almost never legitimate in this repository's prose.
BANNED = {
    "echo chamber": "shared-source error",
    "herding": "conformity",
    "bandwagon": "information cascade",
    "cherry-pick": "selective disclosure",
    "red flag": "plus factor",
    "backchannel": "private communication channel",
    "cartel": "coalition (unless quoting a pricing paper)",
    "sanity check": "positive control / negative control / anti-confound check",
    "training set": "dev split",
    "test set": "held-out split",
    "hidden state": "activation",
    "decision agent": "decider",
    "false alarm": "false positive",
}


def md_files() -> list[Path]:
    out = []
    for p in ROOT.rglob("*.md"):
        rel = p.relative_to(ROOT).as_posix()
        if any(rel.startswith(d + "/") or rel == d for d in SKIP_DIRS):
            continue
        if rel == "GLOSSARY.md":
            continue
        out.append(p)
    return sorted(out)


def strip_code(text: str) -> str:
    text = re.sub(r"```.*?```", "", text, flags=re.S)
    return re.sub(r"`[^`\n]*`", "", text)


def check_synonyms(files: list[Path]) -> int:
    hits = 0
    for p in files:
        prose = strip_code(p.read_text(encoding="utf-8")).lower()
        for bad, good in BANNED.items():
            for m in re.finditer(re.escape(bad), prose):
                line = prose.count("\n", 0, m.start()) + 1
                print(f"WARN synonym  {p.relative_to(ROOT)}:{line}  '{bad}' -> use '{good}'")
                hits += 1
    return hits


LINK_RE = re.compile(r"\[[^\]]*\]\(([^)#\s]+)(#[^)]*)?\)")


def check_links(files: list[Path]) -> int:
    bad = 0
    for p in files:
        text = p.read_text(encoding="utf-8")
        for m in LINK_RE.finditer(text):
            target = m.group(1)
            if re.match(r"^[a-z]+://", target) or target.startswith("mailto:"):
                continue
            tpath = (p.parent / target).resolve()
            if not tpath.exists():
                line = text.count("\n", 0, m.start()) + 1
                print(f"FAIL link     {p.relative_to(ROOT)}:{line}  {target}")
                bad += 1
    return bad


FM_RE = re.compile(r"^---\n(.*?)\n---\n", re.S)


def check_frontmatter(files: list[Path]) -> int:
    bad = 0
    for p in files:
        rel = p.relative_to(ROOT).as_posix()
        if not any(rel.startswith(d + "/") for d in FRONTMATTER_DIRS):
            continue
        if p.name.startswith("_") or p.parent.name in {"design", "report", "templates"}:
            continue
        m = FM_RE.match(p.read_text(encoding="utf-8"))
        if not m:
            print(f"FAIL frontmtr {rel}  no YAML frontmatter")
            bad += 1
            continue
        fm = m.group(1)
        for key in ("title", "status", "updated"):
            if not re.search(rf"^{key}:", fm, re.M):
                print(f"FAIL frontmtr {rel}  missing '{key}'")
                bad += 1
    return bad


def check_routes() -> int:
    routes = json.loads((ROOT / "tools" / "routes.json").read_text(encoding="utf-8"))
    bad = 0
    for task, files in routes.items():
        if task.startswith("_"):
            continue
        for rel in files:
            if not (ROOT / rel).exists():
                print(f"FAIL route    {task}: {rel}")
                bad += 1
    return bad


def main() -> int:
    strict = "--strict" in sys.argv
    files = md_files()
    syn = check_synonyms(files)
    links = check_links(files)
    fm = check_frontmatter(files)
    routes = check_routes()
    print(f"\n{len(files)} markdown files checked: {syn} synonym warnings, {links} broken links, "
          f"{fm} frontmatter failures, {routes} missing routed files")
    failed = links + fm + routes + (syn if strict else 0)
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
