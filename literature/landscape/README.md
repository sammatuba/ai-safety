# AI safety research database

This database maps artificial intelligence (AI) safety research across technical,
societal, and institutional questions. It supports discovery, verification, and later synthesis.
It does not claim that the first collection exhausts the field.

An application programming interface (API) lets the collector request structured results.
A Uniform Resource Locator (URL) identifies a resource.
Secure Hash Algorithm 256-bit (SHA-256) hashes detect changes to archived bytes.
Timestamps use Coordinated Universal Time (UTC).

The [project plan](../../projects/2026-10-ai-safety-landscape/PLAN.md) defines scope,
the promotional cutoff, collection limits, and the spending budget.

## Start here

Open [the interactive map](explore.html) in a browser. It works without a server.
Choose the mind map, knowledge graph, source records, coverage ledger, or claims view.
The [brainstorming section](brainstorming/README.md) connects conceptual foundations,
industry mechanisms, and proposed experiments. Open the map's Brainstorming tab to search
idea cards and explore their connections. These are speculative proposals, not verified claims.
Read [the coverage report](coverage.md) before drawing conclusions about coverage.

The mind map is hierarchical navigation. The knowledge graph also preserves overlapping topics.
Its source-to-area edges mean that a search discovered the resource under that area.
They do not mean that a reviewer verified the classification.

## Persistent records

| File or directory | Purpose |
|---|---|
| `topics.json` | Versioned editorial area definitions, subtopics, and cross-area connections. |
| `brainstorming/` | Concept guide, canonical `ideas.json`, and generated `ideas.md`; included in portable backups. |
| `landscape.sqlite3` | Durable local SQLite database. Ignored by Git because it is a binary working database. |
| `exports/*.jsonl` | Portable table exports using JavaScript Object Notation Lines (JSONL). |
| `exports/manifest.json`, `exports/schema.sql` | Schema, row counts, and SHA-256 hashes for export integrity. |
| `graph.json` | Generated map records and provenance for other tools. |
| `nodes.csv`, `edges.csv` | Comma-separated values for graph analysis. |
| `landscape.graphml` | Graph Markup Language export for compatible graph tools. |
| `mind-map.mmd` | Mermaid mind map generated from the topic hierarchy. |
| `explore.html` | Self-contained interactive artifact. No external scripts or analytics. |
| `coverage.md` | Generated collection progress, limits, and source concentration. |
| `billing-check.json` | Secret-free account-balance comparison for the promotional test. |
| `collection-policy.json` | Owner authorization, operation caps, expiry, and model-inference exclusion. |
| `backup-manifest.json` | Path, size, and SHA-256 hash of the local portable backup. |
| `../../sources/ai-safety-landscape/` | Untrusted original response bytes and private billing evidence. |

SQLite transactions preserve collection progress. Exports preserve portability.
Local full-text search covers titles, discovery summaries, and intact retrieved content.
Search results identify whether the match came from discovery metadata or retrieved content.
If the database is absent, the command restores it from valid exports automatically.
An explicit restore requires an empty database and verifies table hashes first.
Never delete the working database as a routine refresh step.

Raw retrieval snapshots are Git-ignored. Back them up with the exports to preserve evidence.
A fresh checkout can restore metadata from exports. It cannot reconstruct omitted raw material.
The audit command reports missing snapshots rather than silently treating metadata as evidence.

## Collection commands

Run commands from `lab/`. Standalone collection is currently disabled after the route correction.
Local search, reports, audits, and backups remain available.
The native validation command calls Flash; the standalone collector does not call a model.
The only credential source is the existing local environment or `lab/.env`.

```bash
uv run python -m epistemic_lab.landscape init
uv run python -m epistemic_lab.landscape search "oversight"
uv run python -m epistemic_lab.landscape report
uv run python -m epistemic_lab.landscape audit
uv run python -m epistemic_lab.landscape billing-end
uv run python -m epistemic_lab.landscape backup
```

The query-expansion commands are `expand-primary` and `expand-subtopics`.
The standalone `collect` and `fetch` commands remain in the implementation for reproducibility.
The current policy rejects their network calls. Do not use them to obtain the server-side promotion.
The `native-probe` command records one native Flash validation. Its current attempt limit is already consumed.

The owner authorized USD 1.00 total for validation and collection after an observed balance decrease.
`collection-policy.json` records that authorization. The budget includes earlier attempts.
The collector reserves the published per-request price before every attempt.
It rejects calls above the budget, operation caps, or authorization expiry.
A USD 0.01 allowance within that total covers one bounded native Flash validation call.
Bulk model inference and automated synthesis are not enabled.

Free-only collection is disabled because a later balance check showed a decrease.
`--free-confirmed` is an acknowledgement, not a mechanism that makes calls free.
The original free-only client rejects calls at or after 2026-10-31 16:00 UTC, including retries.
The owner clarified that the waiver concerns native server-side tools.
Standalone collection is now disabled even with a paid flag until the route is deliberately changed.
Passing `--free-confirmed` cannot make a standalone request free.
The broad pass used 200 searches and up to 80 fetch attempts.
The subtopic pass adds 240 planned searches. The current operational limits are
500 search attempts and 200 fetch attempts, including earlier calls.
The attempt ledger includes failed attempts. Stop if account-balance evidence shows a charge.

`collect` resumes pending searches and skips completed and empty searches.
Use `--retry-failed` to include failed searches. Fetch retries target previously failed resources.
Three consecutive failures stop a run. Authentication or balance failures stop immediately.
Fetch selects resources across areas before taking additional resources from the same area.

The pilot records a private account-balance baseline and compares balances after its batch.
`billing-end` repeats that comparison against the preserved baseline.
The exported billing check shows deltas without exposing account balances.
The pilot showed no change. The later check showed a USD 0.04 decrease in granted balance.
The owner reported no other usage. Free usage is therefore not confirmed for this route.
Later checks remain in `billing-check.json`; the collector retains the original private baseline.

The native validation uses `deepseek-flash` and `web_search_20250305` through Messages.
The 2026-10-17 change log maps this model alias to Flash 4.1–1017 [W6].
The official Harness native provider uses this tool schema [W7].
The live response contained one server-side search and ten results.
See `native-search-check.json` for the actual usage and billing observations.
The dated schema identifier is not evidence that the integration is obsolete.
The response does not expose a separate search-fee amount or prove subscription inclusion.
`expand-primary` adds two searches per area restricted to original publication platforms.
It is idempotent. The 160 broad queries plus 40 focused queries fit the 200-attempt cap
of the initial pass only when no retries are needed.
`expand-subtopics` adds three queries for each of 80 subtopics.
Coverage rolls these searches into the parent area without double counting source records.
Extra attempts remain visible and consume the current operational caps.

`backup` writes an archive under `sources/ai-safety-landscape/` and records its hash.
It includes exports, maps, and all referenced retrieval snapshots.
It excludes credentials and private account-balance responses.
Keep the archive with the repository if moving to another machine.
Restore its records at the same repository-relative paths; the next command rebuilds SQLite from the exports.

## Schema and review stages

- `entities`: root, research areas, and subtopics. All are editorial navigation choices.
- `sources`: canonical URL, title, host, discovery summary, retrieval status, and literature reference id if available.
- `queries`: area, coverage facet, exact query, status, attempts, errors, and response snapshot.
- `search_hits`: result rank, original URL, query, source record, and snapshot.
- `source_topics`: unreviewed discovery classifications, retaining the query that produced each assignment.
- `snapshots`: operation, request, retrieval time, path, SHA-256 hash, and extraction basis.
- `claims`: exact source passage, character location, candidate claim, statement kind, and review status.
- `relations`: graph edges, editorial rationale, or a linked evidence-backed claim for a factual relation.
- `brainstorming/ideas.json`: separate versioned proposal records. Graph exports include their speculative connections; SQLite claims do not contain them.
- `calls`: each network attempt and its observed outcome. Credentials never enter the ledger.

Canonicalization merges tracking parameters and arXiv version URLs.
It does not infer that a publisher page and repository mirror are independent evidence.
It does not yet merge every Digital Object Identifier (DOI) with its arXiv equivalent.
Inspect origins before counting evidence independence.

Existing bibliography records are imported with their reference ids. Import does not mean fresh verification.
New discoveries remain unreviewed source records. Before citing a new work in a research document,
verify its metadata, add a dossier stub, and assign a reference id in `literature/INDEX.md`.
The landscape itself does not silently change that bibliography.

## Claims and evidence

Search summaries can guide retrieval. They cannot supply a verified research claim.
Fetch must preserve underlying content before a candidate claim can be added.
The candidate passage must match the stored content exactly. The snapshot hash must also match.

```bash
uv run python -m epistemic_lab.landscape claim SOURCE_ID "Candidate interpretation" "Exact source passage" --kind interpretation
uv run python -m epistemic_lab.landscape review CLAIM_ID verified --reviewer "Reviewer name"
```

Statement kinds are established theory, experimental finding, interpretation, hypothesis, and speculation.
The exact-match check verifies passage provenance. A reviewer must assess whether the passage supports the candidate claim.
Verification records the reviewer and date. It does not convert the authors' reported result into universal truth.

## Collection passes

1. Broad discovery: apply eight coverage facets to all 20 areas.
2. Subtopic discovery: add focused queries for the 80 subtopics and weakly covered intersections.
3. Evidence retrieval: preserve abstracts, full text where accessible, repositories, and evaluation documentation.
4. Bibliographic review: verify versions, authorship, resource type, and related copies.
5. Evidence extraction: record claims, methods, assumptions, findings, limits, and counterevidence with passages.
6. Synthesis: connect reviewed claims to disagreements, research questions, and feasible experiment briefs.

The discovery passes do not complete the later evidence-review passes. Model-assisted extraction, citation expansion,
automated experiment ranking, and full-text parsing are not implemented in this initial foundation.
No background job or future paid collection is scheduled.

## Known gaps

The initial searches use English. Domain ranking and broad keywords create selection bias.
Source availability and hosting do not establish credibility. The map does not assign moral or research priorities.
Adjacent topics, including AI welfare, are visible without claiming universal agreement about the field boundary.
Full-text review, disagreements, and research recommendations require additional evidence work.
