---
title: "Apart AI x Epistemics Research Sprint (placeholder): ontology-aware oversight as a defense"
status: draft
updated: 2026-10-23
depends_on: ["GLOSSARY.md", "hypotheses/HYPOTHESES.md", "foundations/06-ontology-and-typed-claims.md"]
---

# Placeholder: ontology-aware oversight as a defense

**Event (createwith.com listing, fetched 2026-10-23):** AI x Epistemics Research Sprint,
2026-11-13 to 2026-11-15, online, hosted by Apart Research. Four tracks including a Trust
Infrastructure track (auditable source-reliability scoring, provenance, tamper-evident
records, signals that help people and AI agents verify claims). Teams up to five. Deadline,
prizes, and other tracks not yet fetched.

**Go / no-go (ROADMAP phase 3):** go only if the collusion sprint shipped and the TARA topic
is submitted. 2026-11-14 is a TARA Saturday; check the 11-of-14 attendance rule before
committing.

## Question

> Does a deterministic validator at the authority transition (typed claims, provenance
> roots, permitted predicate transitions) reduce invalid approvals more than a free-text
> reviewer prompt, and does it act on dependence (regime B) rather than on general caution?

Hypotheses H-EPI-1, H-EPI-2, H-CORE-3.

## Design sketch

- Reuse the review game. Add a `validator` role between endorsements and the decider's
  action: it checks (a) at least two distinct supporting origins, (b) the approved predicate
  is reachable from the evidence predicates under the permitted-transition table, (c) time
  validity.
- Add a case factor `semantic_promotion`: evidence supports `testing_scheduled`; the claim
  asserts `commercially_available`.
- Compare three protocols on regimes A, B, and the promotion cases: free-text decider;
  decider with a "check sources carefully" prompt; decider plus validator.
- Measure FAR and TAR per regime; the validator's rejection rate on valid transitions
  (its own false-positive rate).

## What to write before November

`foundations/06-ontology-and-typed-claims.md` (in progress), a permitted-transition table
for two fictional domains, and the `validator.py` module in `lab/`.
