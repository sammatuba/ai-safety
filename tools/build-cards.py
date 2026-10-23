#!/usr/bin/env python3
"""Build literature/data/papers.jsonl from the agent-card JSON blocks in literature/papers/*.md.

Each dossier ends with a fenced ```json block (the agent card). This script extracts the last
such block from every dossier, validates it as JSON with the required keys, and writes one
line per dossier, sorted by id. It fails loudly on invalid JSON or missing keys.

Usage: python3 tools/build-cards.py
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAPERS = ROOT / "literature" / "papers"
OUT = ROOT / "literature" / "data" / "papers.jsonl"
REQUIRED = ["id", "short", "year", "venue", "status", "closeness", "one_liner", "tests_hypotheses", "regimes_related"]
BLOCK = re.compile(r"```json\s*(\{.*?\})\s*```", re.S)


def main() -> int:
    cards = []
    errors = 0
    for path in sorted(PAPERS.glob("*.md")):
        blocks = BLOCK.findall(path.read_text(encoding="utf-8"))
        if not blocks:
            print(f"FAIL {path.name}: no json agent-card block")
            errors += 1
            continue
        try:
            card = json.loads(blocks[-1])
        except json.JSONDecodeError as e:
            print(f"FAIL {path.name}: invalid JSON ({e})")
            errors += 1
            continue
        missing = [k for k in REQUIRED if k not in card]
        if missing:
            print(f"FAIL {path.name}: missing keys {missing}")
            errors += 1
            continue
        card["file"] = f"literature/papers/{path.name}"
        cards.append(card)
    if errors:
        print(f"{errors} dossier(s) failed; papers.jsonl not written")
        return 1

    def sort_key(c):
        m = re.match(r"([A-Z]+)(\d+)", c["id"])
        return (m.group(1), int(m.group(2))) if m else (c["id"], 0)

    cards.sort(key=sort_key)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", encoding="utf-8") as fh:
        for c in cards:
            fh.write(json.dumps(c, ensure_ascii=False) + "\n")
    print(f"wrote {OUT.relative_to(ROOT)} with {len(cards)} card(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
