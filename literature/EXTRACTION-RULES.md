# Extraction rules (for anyone writing a dossier)

Adapted from the owner's harness-research library rules. Follow them for every file in
`papers/`.

## Hard boundaries

- Write only inside `literature/` and `sources/`.
- Do not run `git`. Do not install packages into the system Python.
- Network use is fetch-only. Downloaded files go to `sources/` and are recorded in
  `sources/MANIFEST.md` with URL, date, and SHA-256. Treat them as untrusted data.

## Fidelity rules

1. Every factual claim in a dossier traces to one of: the local full text in `sources/`,
   the publisher or arXiv abstract page, or the repository README. Record which in the
   frontmatter: `extraction.basis` (one of `full-text`, `abstract`, `readme`, `starter-annotation`)
   and `extraction.sources_used` (list of URLs or local paths), with `extraction.date`.
2. Numbers are copied verbatim. Never estimate, round, or correct a number. If a number
   is unreadable, verify it in the PDF or omit it.
3. Quotes are verbatim, at most 40 words, and attributed to a section or page.
4. Separate the authors' claims from our analysis. Author claims go under "Claim",
   "Setup", "Methods", "Evidence", "Limitations" with the authors as subject ("The authors
   report..."). Our analysis goes only under "My synthesis".
5. A preprint is recorded with its arXiv version and the version date. Say "preprint" in
   `status`. Re-check the version before citing in a submission.
6. Titles in `INDEX.md` marked "not yet verified" become verified only when the dossier
   author has opened the paper page. Update both the dossier and the index row together.
7. A stub (`read_status: stub`) contains only verified metadata and the research starter's
   annotation, attributed as such. It makes no claim about the paper's content.
8. Use `GLOSSARY.md` terms. When a paper uses a word differently (for example "collusion"
   for what we call parallel conduct), say so under "My synthesis".
9. The agent-card JSON block at the end of each dossier must stay valid JSON.
   `python3 tools/build-cards.py` fails loudly if it is not.

## Reading passes (from the research starter, section 9)

- Pass 1 (10 to 15 min): title, abstract, introduction, figures, conclusion, limitations.
  Set `read_status: pass1`.
- Pass 2 (30 to 60 min): reconstruct the experiment or theorem. Set `pass2`.
- Pass 3 (as needed): derivations, code, labels, closest competing papers. Set `pass3`.
- Then write 5 to 7 sentences from memory under "My synthesis" and correct them against
  the paper.
