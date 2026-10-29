
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS metadata(key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS entities(
 id TEXT PRIMARY KEY, kind TEXT NOT NULL CHECK(kind IN ('root','area','topic')),
 title TEXT NOT NULL, description TEXT NOT NULL, parent_id TEXT REFERENCES entities(id),
 review_status TEXT NOT NULL DEFAULT 'editorial');
CREATE TABLE IF NOT EXISTS sources(
 id TEXT PRIMARY KEY, canonical_url TEXT NOT NULL UNIQUE, title TEXT NOT NULL,
 host TEXT NOT NULL, kind TEXT NOT NULL, discovery_summary TEXT NOT NULL DEFAULT '',
 discovered_at TEXT NOT NULL, retrieval_status TEXT NOT NULL DEFAULT 'discovered',
 metadata_status TEXT NOT NULL DEFAULT 'unreviewed', reference_id TEXT,
 current_snapshot_id TEXT);
CREATE TABLE IF NOT EXISTS queries(
 id TEXT PRIMARY KEY, topic_id TEXT NOT NULL REFERENCES entities(id), facet TEXT NOT NULL,
 query TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', attempts INTEGER NOT NULL DEFAULT 0,
 error TEXT, searched_at TEXT, snapshot_id TEXT, UNIQUE(topic_id,facet,query));
CREATE TABLE IF NOT EXISTS snapshots(
 id TEXT PRIMARY KEY, provider TEXT NOT NULL, operation TEXT NOT NULL,
 url TEXT NOT NULL, request_json TEXT NOT NULL, relative_path TEXT NOT NULL UNIQUE,
 sha256 TEXT NOT NULL, byte_count INTEGER NOT NULL, retrieved_at TEXT NOT NULL,
 content_basis TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS search_hits(
 query_id TEXT NOT NULL REFERENCES queries(id), rank INTEGER NOT NULL,
 source_id TEXT NOT NULL REFERENCES sources(id), raw_url TEXT NOT NULL,
 snapshot_id TEXT NOT NULL REFERENCES snapshots(id), PRIMARY KEY(query_id,rank));
CREATE TABLE IF NOT EXISTS source_topics(
 source_id TEXT NOT NULL REFERENCES sources(id), topic_id TEXT NOT NULL REFERENCES entities(id),
 basis TEXT NOT NULL, review_status TEXT NOT NULL DEFAULT 'unreviewed',
 PRIMARY KEY(source_id,topic_id,basis));
CREATE TABLE IF NOT EXISTS claims(
 id TEXT PRIMARY KEY, text TEXT NOT NULL, statement_kind TEXT NOT NULL
 CHECK(statement_kind IN ('established','finding','interpretation','hypothesis','speculation')),
 source_id TEXT NOT NULL REFERENCES sources(id), snapshot_id TEXT NOT NULL REFERENCES snapshots(id),
 excerpt TEXT NOT NULL, char_start INTEGER NOT NULL,
 review_status TEXT NOT NULL DEFAULT 'candidate'
 CHECK(review_status IN ('candidate','verified','rejected')),
 reviewed_by TEXT, reviewed_at TEXT);
CREATE TABLE IF NOT EXISTS relations(
 id TEXT PRIMARY KEY, subject_id TEXT NOT NULL REFERENCES entities(id), predicate TEXT NOT NULL,
 object_id TEXT NOT NULL REFERENCES entities(id), assertion_kind TEXT NOT NULL
 CHECK(assertion_kind IN ('editorial','factual')), rationale TEXT NOT NULL,
 claim_id TEXT REFERENCES claims(id), review_status TEXT NOT NULL DEFAULT 'editorial',
 CHECK(assertion_kind != 'factual' OR claim_id IS NOT NULL));
CREATE TABLE IF NOT EXISTS calls(
 id INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT NOT NULL, operation TEXT NOT NULL,
 outcome TEXT NOT NULL, http_status INTEGER, query_id TEXT REFERENCES queries(id),
 source_id TEXT REFERENCES sources(id));
CREATE VIRTUAL TABLE IF NOT EXISTS source_search USING fts5(source_id UNINDEXED,title,summary);
CREATE VIRTUAL TABLE IF NOT EXISTS evidence_search USING fts5(source_id UNINDEXED,snapshot_id UNINDEXED,content);
