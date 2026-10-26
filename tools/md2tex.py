#!/usr/bin/env python3
"""Markdown subset -> complete LaTeX document. Standard library only.

Usage: python3 tools/md2tex.py in.md out.tex

Handles the subset used by projects/2026-10-apart-collusion-sprint/report/REPORT.md
(the same subset that tools/md2docx.js handles for Word):

- YAML frontmatter and HTML comments are stripped.
- `# Title` -> \\title; the first paragraph `**[AUTHOR: ...]**` -> \\author (red);
  the paragraph that starts with "Apart AI Collusion Research Sprint" -> a centered
  line under the title.
- `## Abstract` -> abstract environment. `## References` is dropped (natbib
  bibliography replaces it; its bracketed ids define the known citation keys).
- `## N. Heading` -> \\section{Heading}; `### N.N Heading` -> \\subsection{Heading};
  `## Appendix X. Heading` -> \\appendix (once) + \\section{Heading};
  `## Other` -> \\section*{Other}; `### Other` -> \\subsection*{Other}.
- Paragraphs, bold, italic, code spans, bullet and numbered lists (one nesting
  level), fenced code blocks (listings), `---` rule, image lines, pipe tables.
- `[S1]`, `[S28], [S29]` -> \\citep{...} when every key is defined in References.
- `[AUTHOR: ...]` -> \\todonote{...} (red, small). `[FINDING]` and the other four
  status tags -> \\statustag{finding} (gray small caps). Other brackets stay text.
- `**Table N.** caption` before a pipe table -> \\caption + \\label{tab:N};
  `![Figure N. caption](figures/x.png)` -> figure[H] + \\label{fig:N}.
  In-text "Table N" / "Figure N" -> Table~\\ref{tab:N} / Figure~\\ref{fig:N}.
- LaTeX specials escaped; a few Unicode symbols mapped to math/LaTeX macros;
  straight double quotes paired to `` ''; URLs -> \\url{}.

Non-ASCII characters without a mapping are passed through with a warning on
stderr (under XeTeX with Latin Modern an unmapped glyph vanishes silently).
"""
from __future__ import annotations

import re
import sys
from dataclasses import dataclass, field

TEXTWIDTH_PT = 469.0  # 6.5in text width at 1in margins on US letter

# --------------------------------------------------------------------------- escaping

UNICODE_MAP = {
    "\u2212": "$-$",          # minus sign
    "\u2265": "$\\geq$",
    "\u2264": "$\\leq$",
    "\u00d7": "$\\times$",
    "\u2192": "$\\rightarrow$",
    "\u2190": "$\\leftarrow$",
    "\u2194": "$\\leftrightarrow$",
    "\u00b1": "$\\pm$",
    "\u2248": "$\\approx$",
    "\u2260": "$\\neq$",
    "\u221e": "$\\infty$",
    "\u201c": "``",
    "\u201d": "''",
    "\u2018": "`",
    "\u2019": "'",
    "\u2013": "--",
    "\u2014": "---",
    "\u2026": "\\ldots{}",
    "\u00a0": "~",
    "\u00b0": "$^{\\circ}$",
    "\u2022": "\\textbullet{}",
    "\u00e9": "\\'e",
    "\u00e8": "\\`e",
    "\u00fc": '\\"u',
    "\u00f6": '\\"o',
    "\u00e4": '\\"a',
    "\u03b1": "$\\alpha$",
    "\u03b2": "$\\beta$",
    "\u03b4": "$\\delta$",
    "\u03b5": "$\\epsilon$",
    "\u03bc": "$\\mu$",
    "\u03c3": "$\\sigma$",
}

SPECIALS = {
    "\\": "\\textbackslash{}",
    "&": "\\&",
    "%": "\\%",
    "$": "\\$",
    "#": "\\#",
    "_": "\\_",
    "{": "\\{",
    "}": "\\}",
    "~": "\\textasciitilde{}",
    "^": "\\textasciicircum{}",
}

_warned: set[str] = set()


def warn(msg: str) -> None:
    if msg not in _warned:
        _warned.add(msg)
        print("md2tex: " + msg, file=sys.stderr)


def escape(text: str, line_no: int = 0) -> str:
    """Escape LaTeX specials and map Unicode symbols in plain prose."""
    out = []
    for ch in text:
        if ch in SPECIALS:
            out.append(SPECIALS[ch])
        elif ch in UNICODE_MAP:
            out.append(UNICODE_MAP[ch])
        elif ord(ch) > 127:
            warn(f"line {line_no}: unmapped non-ASCII character U+{ord(ch):04X} {ch!r} passed through")
            out.append(ch)
        else:
            out.append(ch)
    s = "".join(out)
    # "..." (three periods) -> ellipsis.
    s = s.replace("...", "\\ldots{}")
    return s


def escape_tt(text: str) -> str:
    """Escape for \\texttt{}: specials only; keep quotes and dashes literal."""
    out = []
    for ch in text:
        if ch in SPECIALS:
            out.append(SPECIALS[ch])
        elif ch == "-":
            out.append("-{}")  # prevent -- ligature inside typewriter text
        elif ch in UNICODE_MAP:
            out.append(UNICODE_MAP[ch])
        else:
            out.append(ch)
    return "".join(out)


def pair_quotes(text: str) -> str:
    """Turn straight double quotes into U+201C/U+201D pairs (mapped later to `` '').

    A quote preceded by start-of-text, whitespace, '(' or '[' opens; others close.
    """
    chars = list(text)
    for i, ch in enumerate(chars):
        if ch != '"':
            continue
        prev = chars[i - 1] if i > 0 else " "
        chars[i] = "\u201c" if prev in " \t([{\u2014-" else "\u201d"
    return "".join(chars)


# --------------------------------------------------------------------------- inline

STATUS_TAGS = ("FINDING", "INTERPRETATION", "HYPOTHESIS", "ESTABLISHED", "SPECULATION")
CITE_KEY = r"[A-Z]{1,2}\d+"
RE_CITE_GROUP = re.compile(r"\[(" + CITE_KEY + r")\](?:,\s*\[(" + CITE_KEY + r")\])*")
RE_CITE_ONE = re.compile(r"\[(" + CITE_KEY + r")\]")
RE_URL = re.compile(r"https?://[^\s<>\]\)]+")
RE_TABLE_REF = re.compile(r"\bTable\s+([A-Z]?\d+|[A-Z])(?![\w.])")
RE_FIGURE_REF = re.compile(r"\bFigure\s+(\d+)(?![\w.])")


@dataclass
class Context:
    """Labels known in the document, used to resolve in-text references."""
    cite_keys: set[str] = field(default_factory=set)
    table_labels: set[str] = field(default_factory=set)
    figure_labels: set[str] = field(default_factory=set)
    line_no: int = 0


def render_plain(text: str, ctx: Context) -> str:
    """Prose with no Markdown markup left: refs, cites, tags, URLs, escaping."""
    pieces: list[str] = []
    pos = 0
    # Alternation of constructs that must be found before escaping.
    pattern = re.compile(
        r"(?P<author>\[AUTHOR:)"
        r"|(?P<tag>\[(" + "|".join(STATUS_TAGS) + r")\])"
        r"|(?P<cite>" + RE_CITE_GROUP.pattern + r")"
        r"|(?P<url>" + RE_URL.pattern + r")"
        r"|(?P<tab>" + RE_TABLE_REF.pattern + r")"
        r"|(?P<fig>" + RE_FIGURE_REF.pattern + r")"
    )
    while True:
        m = pattern.search(text, pos)
        if not m:
            pieces.append(escape(text[pos:], ctx.line_no))
            break
        pieces.append(escape(text[pos:m.start()], ctx.line_no))
        if m.group("author"):
            end = text.find("]", m.end())
            if end < 0:
                warn(f"line {ctx.line_no}: [AUTHOR: note without closing bracket")
                pieces.append(escape(text[m.start():], ctx.line_no))
                break
            inner = text[m.end():end].strip()
            pieces.append("\\todonote{AUTHOR: " + render_inline(inner, ctx) + "}")
            pos = end + 1
            continue
        if m.group("tag"):
            pieces.append("\\statustag{" + m.group(0)[1:-1].lower() + "}")
        elif m.group("cite"):
            keys = RE_CITE_ONE.findall(m.group(0))
            if all(k in ctx.cite_keys for k in keys):
                pieces.append("\\citep{" + ",".join(keys) + "}")
            else:
                missing = [k for k in keys if k not in ctx.cite_keys]
                warn(f"line {ctx.line_no}: citation key(s) {missing} not in References; left as text")
                pieces.append(escape(m.group(0), ctx.line_no))
        elif m.group("url"):
            url = m.group(0)
            trail = ""
            while url and url[-1] in ".,;:":
                trail = url[-1] + trail
                url = url[:-1]
            pieces.append("\\url{" + url + "}" + escape(trail, ctx.line_no))
        elif m.group("tab"):
            key = m.group(0).split()[1]
            if key in ctx.table_labels:
                pieces.append("Table~\\ref{tab:" + key + "}")
            else:
                pieces.append(escape(m.group(0), ctx.line_no))
        elif m.group("fig"):
            key = m.group(0).split()[1]
            if key in ctx.figure_labels:
                pieces.append("Figure~\\ref{fig:" + key + "}")
            else:
                pieces.append(escape(m.group(0), ctx.line_no))
        pos = m.end()
    return "".join(pieces)


RE_INLINE = re.compile(r"(\[AUTHOR:[^\]]*\]|`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)")


def render_inline(text: str, ctx: Context) -> str:
    """AUTHOR notes, code spans, bold, italic; everything else goes to render_plain."""
    out: list[str] = []
    last = 0
    for m in RE_INLINE.finditer(text):
        if m.start() > last:
            out.append(render_plain(text[last:m.start()], ctx))
        t = m.group(0)
        if t.startswith("[AUTHOR:"):
            # Handled here, not in render_plain, because the note may contain code spans.
            out.append("\\todonote{AUTHOR: " + render_inline(t[len("[AUTHOR:"):-1].strip(), ctx) + "}")
        elif t.startswith("`"):
            out.append("\\texttt{" + escape_tt(t[1:-1]) + "}")
        elif t.startswith("**"):
            out.append("\\textbf{" + render_inline(t[2:-2], ctx) + "}")
        else:
            out.append("\\emph{" + render_inline(t[1:-1], ctx) + "}")
        last = m.end()
    if last < len(text):
        out.append(render_plain(text[last:], ctx))
    return "".join(out)


def render_text(text: str, ctx: Context) -> str:
    """Entry point for a paragraph or cell: pair quotes outside code spans, then render."""
    parts = re.split(r"(`[^`]+`)", text)
    parts = [p if p.startswith("`") and p.endswith("`") and len(p) > 1 else pair_quotes(p) for p in parts]
    return render_inline("".join(parts), ctx)


# --------------------------------------------------------------------------- blocks

@dataclass
class Block:
    kind: str                 # heading paragraph bullets numbers table code image rule
    text: str = ""
    level: int = 0
    items: list = field(default_factory=list)   # list items: (indent, text) ; table rows
    line_no: int = 0
    caption: str | None = None
    label: str | None = None
    path: str = ""


def parse_blocks(md: str) -> list[Block]:
    md = re.sub(r"\A---\n[\s\S]*?\n---\n", "", md)
    md = re.sub(r"<!--[\s\S]*?-->", "", md)
    lines = md.split("\n")
    blocks: list[Block] = []
    para: list[str] = []
    para_line = 0
    i = 0

    def flush() -> None:
        nonlocal para
        if para:
            blocks.append(Block("paragraph", " ".join(para), line_no=para_line))
            para = []

    while i < len(lines):
        line = lines[i]
        s = line.strip()
        if s.startswith("```"):
            flush()
            start = i
            i += 1
            code: list[str] = []
            while i < len(lines) and not lines[i].strip().startswith("```"):
                code.append(lines[i])
                i += 1
            i += 1
            blocks.append(Block("code", "\n".join(code), line_no=start + 1))
            continue
        if s.startswith("|"):
            flush()
            rows: list[list[str]] = []
            start = i
            while i < len(lines) and lines[i].strip().startswith("|"):
                t = lines[i].strip()
                if not re.match(r"^\|[\s\-:|]+\|$", t):
                    cells = [c.strip() for c in t.strip("|").split("|")]
                    rows.append(cells)
                i += 1
            blocks.append(Block("table", items=rows, line_no=start + 1))
            continue
        if not s:
            flush()
            i += 1
            continue
        if s == "---":
            flush()
            blocks.append(Block("rule", line_no=i + 1))
            i += 1
            continue
        m = re.match(r"^!\[([^\]]*)\]\(([^)]+)\)$", s)
        if m:
            flush()
            blocks.append(Block("image", text=m.group(1), path=m.group(2), line_no=i + 1))
            i += 1
            continue
        m = re.match(r"^(#{1,6})\s+(.*)$", s)
        if m:
            flush()
            blocks.append(Block("heading", m.group(2).strip(), level=len(m.group(1)), line_no=i + 1))
            i += 1
            continue
        indent = len(line) - len(line.lstrip())
        m = re.match(r"^[-*]\s+(.*)$", s)
        if m:
            flush()
            if blocks and blocks[-1].kind == "bullets" and blocks[-1].line_no + len(blocks[-1].items) >= i:
                blocks[-1].items.append((indent, m.group(1)))
            else:
                blocks.append(Block("bullets", items=[(indent, m.group(1))], line_no=i + 1))
            i += 1
            continue
        m = re.match(r"^(\d+)\.\s+(.*)$", s)
        if m:
            flush()
            if blocks and blocks[-1].kind == "numbers" and m.group(1) != "1" and \
                    blocks[-1].line_no + len(blocks[-1].items) >= i:
                blocks[-1].items.append((indent, m.group(2)))
            else:
                blocks.append(Block("numbers", items=[(indent, m.group(2))], line_no=i + 1))
            i += 1
            continue
        # Continuation line of a list item (indented prose under a bullet).
        if indent >= 2 and blocks and blocks[-1].kind in ("bullets", "numbers") and not para \
                and blocks[-1].line_no + len(blocks[-1].items) >= i:
            ind, txt = blocks[-1].items[-1]
            blocks[-1].items[-1] = (ind, txt + " " + s)
            i += 1
            continue
        if not para:
            para_line = i + 1
        para.append(s)
        i += 1
    flush()
    return blocks


RE_TABLE_CAPTION = re.compile(r"^\*\*Table\s+([A-Z]?\d+|[A-Z])\.\*\*\s*(.*)$")
RE_FIGURE_CAPTION = re.compile(r"^Figure\s+(\d+)\.\s*(.*)$")


def attach_captions(blocks: list[Block]) -> list[Block]:
    """Merge `**Table N.** caption` paragraphs into the table that follows them."""
    out: list[Block] = []
    for b in blocks:
        if b.kind == "table" and out and out[-1].kind == "paragraph":
            m = RE_TABLE_CAPTION.match(out[-1].text)
            if m:
                out.pop()
                b.label = m.group(1)
                b.caption = m.group(2)
        if b.kind == "image":
            m = RE_FIGURE_CAPTION.match(b.text)
            if m:
                b.label = m.group(1)
                b.caption = m.group(2)
            else:
                b.caption = b.text
        out.append(b)
    return out


# --------------------------------------------------------------------------- tables

def render_table(b: Block, ctx: Context) -> str:
    rows = b.items
    ncol = max(len(r) for r in rows)
    rows = [r + [""] * (ncol - len(r)) for r in rows]
    # Visible length of a cell after removing markup characters.
    def vis(c: str) -> int:
        return len(re.sub(r"[*`]", "", c))
    maxlen = [max(vis(r[j]) for r in rows) for j in range(ncol)]
    bodylen = [max([vis(r[j]) for r in rows[1:]] or [0]) for j in range(ncol)]

    size = "\\footnotesize" if ncol > 5 else "\\small"
    char_pt = 4.0 if ncol > 5 else 5.0
    colsep = 4.0 if ncol > 7 else 6.0
    natural = sum(maxlen) * char_pt + 2 * colsep * ncol
    wrap = natural > TEXTWIDTH_PT

    if wrap:
        # Columns whose longest cell exceeds the threshold wrap in an X column.
        xcols = [j for j in range(ncol) if maxlen[j] > 12]
        if not xcols:
            xcols = [max(range(ncol), key=lambda j: maxlen[j])]
        # Fixed columns take their natural width; X columns share the rest. If the
        # rest is too small for the body text, lower the threshold.
        fixed = sum(maxlen[j] * char_pt for j in range(ncol) if j not in xcols)
        if TEXTWIDTH_PT - fixed - 2 * colsep * ncol < 60 * len(xcols):
            xcols = [j for j in range(ncol) if maxlen[j] > 8] or xcols
        # Give X columns relative widths from their body lengths, so numeric
        # columns with long headers do not steal width from prose columns.
        weights = {j: max(bodylen[j], 8) for j in xcols}
        mean = sum(weights.values()) / len(weights)
        clipped = {j: min(max(weights[j] / mean, 0.6), 1.8) for j in xcols}
        # tabularx requires the hsize factors to sum to the number of X columns.
        total = sum(clipped.values())
        spec = ""
        for j in range(ncol):
            if j in xcols:
                w = clipped[j] * len(xcols) / total
                spec += ">{\\hsize=%.3f\\hsize\\raggedright\\arraybackslash}X" % w
            else:
                spec += "l"
        env_open = "\\begin{tabularx}{\\textwidth}{" + spec + "}"
        env_close = "\\end{tabularx}"
    else:
        spec = "l" * ncol
        env_open = "\\begin{tabular}{" + spec + "}"
        env_close = "\\end{tabular}"

    lines = []
    lines.append("\\begin{table}[H]")
    lines.append("\\centering")
    lines.append(size)
    if colsep != 6.0:
        lines.append("\\setlength{\\tabcolsep}{%gpt}" % colsep)
    if b.caption is not None:
        lines.append("\\caption{" + render_text(b.caption, ctx) + "}")
        lines.append("\\label{tab:" + b.label + "}")
    lines.append(env_open)
    lines.append("\\toprule")
    lines.append(" & ".join(render_text(c, ctx) for c in rows[0]) + " \\\\")
    lines.append("\\midrule")
    for r in rows[1:]:
        lines.append(" & ".join(render_text(c, ctx) for c in r) + " \\\\")
    lines.append("\\bottomrule")
    lines.append(env_close)
    lines.append("\\end{table}")
    return "\n".join(lines), size


# --------------------------------------------------------------------------- document

PREAMBLE = r"""\documentclass[11pt]{article}
\usepackage[margin=1in]{geometry}
\usepackage[T1]{fontenc}
\usepackage{lmodern}
\usepackage{textcomp}
\usepackage{microtype}
\usepackage{booktabs}
\usepackage{tabularx}
\usepackage{graphicx}
\usepackage{float}
\usepackage{xcolor}
\usepackage{enumitem}
\usepackage{listings}
\usepackage[round]{natbib}
\usepackage[font=small,labelfont=bf]{caption}
\usepackage[colorlinks=true,linkcolor=blue,citecolor=blue,urlcolor=blue]{hyperref}

\setlist{itemsep=2pt,topsep=4pt,parsep=0pt}
\lstset{basicstyle=\ttfamily\footnotesize,breaklines=true,columns=fullflexible,keepspaces=true,frame=single,framerule=0.2pt,rulecolor=\color{gray},xleftmargin=4pt,xrightmargin=4pt}
\newcommand{\todonote}[1]{\textcolor{red}{\small [#1]}}
\newcommand{\statustag}[1]{\textcolor{gray}{{\small\mdseries\textsc{#1}}}}
\urlstyle{same}
\setlength{\parskip}{4pt}
\setlength{\parindent}{0pt}

"""


def convert(md: str) -> tuple[str, dict]:
    blocks = attach_captions(parse_blocks(md))
    ctx = Context()
    info = {"footnotesize_tables": [], "small_tables": [], "uncaptioned_tables": 0,
            "cite_keys": [], "unhandled": []}

    # Pass 1: collect citation keys (from References), table and figure labels.
    in_refs = False
    for b in blocks:
        if b.kind == "heading" and b.level == 2:
            in_refs = b.text.strip().lower() == "references"
        if in_refs and b.kind == "bullets":
            for _, item in b.items:
                m = re.match(r"^\[(" + CITE_KEY + r")\]", item)
                if m:
                    ctx.cite_keys.add(m.group(1))
        if b.kind == "table" and b.label:
            ctx.table_labels.add(b.label)
        if b.kind == "image" and b.label:
            ctx.figure_labels.add(b.label)
    info["cite_keys"] = sorted(ctx.cite_keys)

    # Pass 2: render.
    body: list[str] = []
    title = ""
    author = ""
    subtitle = ""
    seen_title = False
    in_abstract = False
    skipping = False
    appendix_started = False
    abstract_lines: list[str] = []

    def emit(s: str) -> None:
        if in_abstract:
            abstract_lines.append(s)
        else:
            body.append(s)

    for b in blocks:
        ctx.line_no = b.line_no
        if b.kind == "heading":
            text = b.text.strip()
            if b.level == 1:
                if not seen_title:
                    title = render_text(text, ctx)
                    seen_title = True
                    continue
                b.level = 2
            if b.level == 2:
                if in_abstract:
                    body.append("\\begin{abstract}\n" + "\n\n".join(abstract_lines) + "\n\\end{abstract}\n")
                    in_abstract = False
                skipping = False
                low = text.lower()
                if low == "abstract":
                    in_abstract = True
                    continue
                if low == "references":
                    skipping = True
                    continue
                m = re.match(r"^Appendix\s+([A-Z])\.\s*(.*)$", text)
                if m:
                    if not appendix_started:
                        body.append("\\appendix\n\\counterwithin*{table}{section}\n"
                                    "\\counterwithin*{figure}{section}\n"
                                    "\\renewcommand{\\thetable}{\\thesection\\arabic{table}}\n"
                                    "\\renewcommand{\\thefigure}{\\thesection\\arabic{figure}}\n")
                        appendix_started = True
                    body.append("\\section{" + render_text(m.group(2), ctx) + "}\n\\label{sec:" + m.group(1) + "}\n")
                    continue
                m = re.match(r"^(\d+)\.\s*(.*)$", text)
                if m:
                    body.append("\\section{" + render_text(m.group(2), ctx) + "}\n\\label{sec:" + m.group(1) + "}\n")
                    continue
                body.append("\\section*{" + render_text(text, ctx) + "}\n")
                continue
            if skipping:
                continue
            m = re.match(r"^(\d+\.\d+)\.?\s*(.*)$", text)
            if b.level == 3:
                if m:
                    emit("\\subsection{" + render_text(m.group(2), ctx) + "}\n\\label{sec:" + m.group(1) + "}\n")
                else:
                    emit("\\subsection*{" + render_text(text, ctx) + "}\n")
            else:
                emit("\\subsubsection*{" + render_text(text, ctx) + "}\n")
            continue

        if skipping:
            continue

        if b.kind == "paragraph":
            text = b.text
            if seen_title and not author and not body and not in_abstract and text.startswith("**[AUTHOR:"):
                author = text.strip("*").strip()
                continue
            if seen_title and not subtitle and not body and not in_abstract and \
                    text.startswith("Apart AI Collusion Research Sprint"):
                subtitle = render_text(text, ctx)
                continue
            emit(render_text(text, ctx) + "\n")
        elif b.kind in ("bullets", "numbers"):
            env = "itemize" if b.kind == "bullets" else "enumerate"
            out = ["\\begin{" + env + "}"]
            depth = 0
            for indent, item in b.items:
                want = 1 if indent >= 2 else 0
                while depth < want:
                    out.append("\\begin{" + env + "}")
                    depth += 1
                while depth > want:
                    out.append("\\end{" + env + "}")
                    depth -= 1
                rendered = render_text(item, ctx)
                sep = "\\relax " if rendered.startswith("[") else " "
                out.append("\\item" + sep + rendered)
            while depth > 0:
                out.append("\\end{" + env + "}")
                depth -= 1
            out.append("\\end{" + env + "}\n")
            emit("\n".join(out))
        elif b.kind == "table":
            tex, size = render_table(b, ctx)
            if b.label:
                (info["footnotesize_tables"] if size == "\\footnotesize" else info["small_tables"]).append(b.label)
            else:
                info["uncaptioned_tables"] += 1
            emit(tex + "\n")
        elif b.kind == "code":
            emit("\\begin{lstlisting}\n" + b.text + "\n\\end{lstlisting}\n")
        elif b.kind == "image":
            out = ["\\begin{figure}[H]", "\\centering",
                   "\\includegraphics[width=\\linewidth,height=0.42\\textheight,keepaspectratio]{" + b.path + "}"]
            if b.caption:
                out.append("\\caption{" + render_text(b.caption, ctx) + "}")
            if b.label:
                out.append("\\label{fig:" + b.label + "}")
            out.append("\\end{figure}\n")
            emit("\n".join(out))
        elif b.kind == "rule":
            emit("\\noindent\\rule{\\linewidth}{0.4pt}\n")

    if in_abstract:
        body.append("\\begin{abstract}\n" + "\n\n".join(abstract_lines) + "\n\\end{abstract}\n")

    head = [PREAMBLE]
    head.append("\\title{" + title + "}")
    if author:
        head.append("\\author{\\textcolor{red}{" + escape(author) + "}}")
    else:
        head.append("\\author{}")
    head.append("\\date{}")
    head.append("")
    head.append("\\begin{document}")
    head.append("\\maketitle")
    if subtitle:
        head.append("\\vspace{-2em}\n\\begin{center}\\small " + subtitle + "\\end{center}\n")
    doc = "\n".join(head) + "\n" + "\n".join(body)
    doc += "\n\\nocite{*}\n\\bibliographystyle{plainnat}\n\\bibliography{references}\n\n\\end{document}\n"
    return doc, info


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print(__doc__.split("\n\n")[1], file=sys.stderr)
        return 2
    with open(argv[1], encoding="utf-8") as f:
        md = f.read()
    doc, info = convert(md)
    with open(argv[2], "w", encoding="utf-8") as f:
        f.write(doc)
    print(f"wrote {argv[2]}: {len(info['cite_keys'])} citation keys, "
          f"{len(info['small_tables'])} small tables {info['small_tables']}, "
          f"{len(info['footnotesize_tables'])} footnotesize tables {info['footnotesize_tables']}, "
          f"{info['uncaptioned_tables']} uncaptioned tables")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
