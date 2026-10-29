"""Persistent knowledge graph, source records, provenance, and coverage facets.

Network access lives exclusively in llm.py. Search summaries remain discovery
material. Exact excerpts from retrieval snapshots are required for candidate claims.
"""
from __future__ import annotations

import argparse
from contextlib import contextmanager
from datetime import datetime, timezone
from decimal import Decimal
import hashlib
import fcntl
import json
from pathlib import Path
import re
import sqlite3
import time
import zipfile
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from .llm import DeepSeekResearchTools, ResearchToolError

ROOT = Path(__file__).resolve().parents[3]
DEFAULT_HOME = ROOT / "literature" / "landscape"
SCHEMA_VERSION = 1
TABLES = ("metadata", "entities", "sources", "queries", "snapshots", "search_hits",
          "source_topics", "claims", "relations", "calls")
FACETS = {
    "overview": "survey research agenda",
    "recent": "research after:2025-10-01",
    "evaluation": "evaluation benchmark measurement",
    "failures": "failure limitations negative results",
    "resources": "dataset code reproducibility site:github.com OR site:huggingface.co",
    "questions": "open problems research questions",
    "critique": "critique assumptions counterevidence",
    "replication": "replication baseline ablation",
}
SCHEMA = """
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
"""


def now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def identity(prefix: str, value: str) -> str:
    return prefix + hashlib.sha256(value.encode()).hexdigest()[:20]


def canonical_url(url: str) -> str:
    """Merge tracking variants and arXiv versions; preserve meaningful query fields."""
    parts = urlsplit(url.strip())
    if parts.scheme not in {"http", "https"} or not parts.hostname or parts.username or parts.password:
        raise ValueError("Expected a public HTTP(S) resource URL without credentials")
    host = parts.hostname.lower()
    if host in {"localhost", "127.0.0.1", "::1"}:
        raise ValueError("Local URLs are not research resources")
    host = host.removeprefix("www.")
    if host in {"arxiv.org", "export.arxiv.org"}:
        path = re.sub(r"^/(pdf|html)/", "/abs/", parts.path)
        path = re.sub(r"(?:v\d+)?(?:\.pdf)?$", "", path)
        return "https://arxiv.org" + path.rstrip("/")
    query = [(k,v) for k,v in parse_qsl(parts.query, keep_blank_values=True)
             if not k.lower().startswith("utm_") and k.lower() not in {"fbclid", "gclid"}]
    port = parts.port
    netloc = host + (f":{port}" if port and port not in {80,443} else "")
    return urlunsplit(("https" if host == "doi.org" else parts.scheme, netloc,
                       parts.path.rstrip("/") or "/", urlencode(sorted(query)), ""))


def resource_kind(url: str) -> str:
    """Suggest a resource type from URL shape; this is not metadata verification."""
    parts=urlsplit(url)
    host=parts.hostname or ""
    path=parts.path
    paper=(host=="arxiv.org" and path.startswith("/abs/")) or (
        host=="aclanthology.org" and re.match(r"^/(?:\d{4}\.[\w.-]+\.\d+|[A-Z]\d{2}-\d{4})$",path)) or (
        host=="proceedings.mlr.press" and re.match(r"^/v\d+/[^/]+\.html$",path)) or (
        host=="openreview.net" and path=="/forum") or (host=="doi.org" and path.startswith("/10."))
    if paper:
        return "paper"
    if host in {"github.com","huggingface.co"}:
        return "repository"
    return "web-resource"


class Landscape:
    """Store source records, candidate claims, and knowledge graph provenance."""

    def __init__(self, home: Path = DEFAULT_HOME, root: Path = ROOT):
        self.home = home
        self.root = root
        home.mkdir(parents=True, exist_ok=True)
        fresh = not (home / "landscape.sqlite3").exists()
        self.db = sqlite3.connect(home / "landscape.sqlite3")
        self.db.row_factory = sqlite3.Row
        self.db.executescript(SCHEMA)
        version = self.db.execute("SELECT value FROM metadata WHERE key='schema_version'").fetchone()
        if version and int(version[0]) != SCHEMA_VERSION:
            raise ValueError("Database schema version mismatch")
        self.db.execute("INSERT OR IGNORE INTO metadata VALUES('schema_version',?)", (str(SCHEMA_VERSION),))
        self.db.commit()
        empty = (not self.db.execute("SELECT 1 FROM entities LIMIT 1").fetchone()
                 and not self.db.execute("SELECT 1 FROM sources LIMIT 1").fetchone())
        if (fresh or empty) and (home / "exports" / "manifest.json").exists():
            self.restore(home / "exports")

    def close(self) -> None:
        self.db.close()

    def initialize(self) -> None:
        config = json.loads((self.home / "topics.json").read_text())
        with self.db:
            self.db.execute("INSERT OR IGNORE INTO entities VALUES(?,?,?,?,?,?)",
                            ("ai-safety", "root", "AI safety", config["description"], None, "editorial"))
            for area in config["areas"]:
                self.db.execute("INSERT OR IGNORE INTO entities VALUES(?,?,?,?,?,?)",
                                (area["id"], "area", area["title"], area["description"], "ai-safety", "editorial"))
                for sub in area["topics"]:
                    self.db.execute("INSERT OR IGNORE INTO entities VALUES(?,?,?,?,?,?)",
                                    (sub["id"], "topic", sub["title"], sub["description"], area["id"], "editorial"))
                for facet, suffix in FACETS.items():
                    query = area["search_term"] + " " + suffix
                    if len(query) > 128:
                        raise ValueError(f"Query exceeds provider limit: {area['id']} {facet}")
                    qid = identity("q-", area["id"] + facet + query)
                    self.db.execute("INSERT OR IGNORE INTO queries(id,topic_id,facet,query) VALUES(?,?,?,?)",
                                    (qid, area["id"], facet, query))
            for edge in config.get("connections", []):
                self.add_relation(edge["from"], "related_to", edge["to"], edge["rationale"])
        self.reindex()

    def add_relation(self, subject: str, predicate: str, obj: str, rationale: str,
                     claim_id: str | None = None, factual: bool = False) -> str:
        if not rationale.strip():
            raise ValueError("A graph relation requires a rationale")
        if factual and not claim_id:
            raise ValueError("A factual relation requires an evidence-backed candidate claim")
        status = "editorial"
        if factual:
            claim = self.db.execute("SELECT review_status FROM claims WHERE id=?", (claim_id,)).fetchone()
            if not claim:
                raise ValueError("Unknown claim")
            status = claim[0]
        rid = identity("rel-", "|".join([subject,predicate,obj,claim_id or ""]))
        self.db.execute("INSERT OR IGNORE INTO relations VALUES(?,?,?,?,?,?,?,?)",
                        (rid,subject,predicate,obj,"factual" if factual else "editorial",rationale,claim_id,status))
        return rid

    def add_source(self, url: str, title: str, summary: str = "", reference_id: str | None = None) -> str:
        canon = canonical_url(url)
        sid = identity("src-", canon)
        host = urlsplit(canon).hostname or ""
        kind = resource_kind(canon)
        self.db.execute("""INSERT INTO sources(id,canonical_url,title,host,kind,discovery_summary,
            discovered_at,reference_id) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(canonical_url) DO UPDATE SET
            reference_id=COALESCE(sources.reference_id,excluded.reference_id),
            discovery_summary=CASE WHEN sources.discovery_summary='' THEN excluded.discovery_summary ELSE sources.discovery_summary END""",
                        (sid,canon,title or canon,host,kind,summary,now(),reference_id))
        return sid

    def seed_bibliography(self) -> int:
        count = 0
        text = (self.root / "literature" / "INDEX.md").read_text()
        with self.db:
            for line in text.splitlines():
                if not re.match(r"\| \[(R|S|T|W)\d+\] \|", line):
                    continue
                cells = [s.strip() for s in line.split("|")[1:-1]]
                match = re.search(r"https?://[^\s)]+", cells[3] if len(cells)>3 else "")
                if not match:
                    continue
                self.add_source(match[0], cells[1], reference_id=cells[0].strip("[]"))
                count += 1
        self.reindex()
        return count

    def expand_primary(self) -> int:
        """Add two original-publication searches per area after broad discovery."""
        config=json.loads((self.home/"topics.json").read_text())
        inserted=0
        suffixes={"primary-preprints":"survey site:arxiv.org",
                  "primary-publications":"site:proceedings.mlr.press OR site:aclanthology.org OR site:openreview.net"}
        with self.db:
            for area in config["areas"]:
                for facet,suffix in suffixes.items():
                    query=area["search_term"]+" "+suffix
                    if len(query)>128:
                        raise ValueError("Primary query exceeds provider limit")
                    qid=identity("q-",area["id"]+facet+query)
                    result=self.db.execute("INSERT OR IGNORE INTO queries(id,topic_id,facet,query) VALUES(?,?,?,?)",
                                          (qid,area["id"],facet,query))
                    inserted+=result.rowcount
        return inserted

    def expand_subtopics(self) -> int:
        """Give every subtopic a paper, resource, and limitation search."""
        inserted=0
        suffixes={"subtopic-papers":"survey site:arxiv.org",
                  "subtopic-resources":"dataset code site:github.com OR site:huggingface.co",
                  "subtopic-limitations":"limitations open research questions"}
        with self.db:
            for topic in self.db.execute("SELECT * FROM entities WHERE kind='topic'").fetchall():
                for facet,suffix in suffixes.items():
                    text=topic["title"]+" AI safety "+suffix
                    if len(text)>128:
                        raise ValueError("Subtopic query exceeds provider limit")
                    qid=identity("q-",topic["id"]+facet+text)
                    result=self.db.execute("INSERT OR IGNORE INTO queries(id,topic_id,facet,query) VALUES(?,?,?,?)",
                                          (qid,topic["id"],facet,text))
                    inserted+=result.rowcount
        return inserted

    def save_snapshot(self, operation: str, payload: dict, raw: bytes, url: str,
                      basis: str) -> str:
        digest = hashlib.sha256(raw).hexdigest()
        retrieved_at = now()
        snap_id = identity("snap-", operation + json.dumps(payload,sort_keys=True) + retrieved_at + digest)
        rel = Path("sources/ai-safety-landscape") / f"{snap_id}.json"
        target = self.root / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(raw)
        self.db.execute("INSERT OR IGNORE INTO snapshots VALUES(?,?,?,?,?,?,?,?,?,?)",
                        (snap_id,"deepseek",operation,url,json.dumps(payload,sort_keys=True),
                         str(rel),digest,len(raw),retrieved_at,basis))
        return snap_id

    def ingest_search(self, qid: str, payload: dict, raw: bytes, *, native_results: list | None = None) -> int:
        body = json.loads(raw)
        results = native_results if native_results is not None else body.get("results")
        if not isinstance(results,list):
            raise ValueError("Search response lacks a results array")
        query = self.db.execute("SELECT * FROM queries WHERE id=?",(qid,)).fetchone()
        if not query:
            raise ValueError("Unknown query")
        with self.db:
            snap = self.save_snapshot("native-search" if native_results is not None else "search",payload,raw,
                "https://api.deepseek.com/anthropic/v1/messages" if native_results is not None else "https://api.deepseek.com/v1/tools/search",
                "server-tool-search" if native_results is not None else "search-results")
            self.db.execute("DELETE FROM search_hits WHERE query_id=?",(qid,))
            accepted = 0
            for rank,item in enumerate(results,1):
                if not isinstance(item,dict) or not isinstance(item.get("url"),str):
                    continue
                try:
                    sid = self.add_source(item["url"],item.get("title", ""),item.get("summary", ""))
                except ValueError:
                    continue
                self.db.execute("INSERT INTO search_hits VALUES(?,?,?,?,?)",(qid,rank,sid,item["url"],snap))
                self.db.execute("INSERT OR IGNORE INTO source_topics VALUES(?,?,?,?)",
                                (sid,query["topic_id"],"search:"+qid,"unreviewed"))
                accepted += 1
            self.db.execute("UPDATE queries SET status=?,error=NULL,searched_at=?,snapshot_id=? WHERE id=?",
                            ("complete" if accepted else "empty",now(),snap,qid))
        return accepted

    def ingest_fetch(self, sid: str, payload: dict, raw: bytes) -> str:
        body = json.loads(raw)
        if not isinstance(body.get("content"),str) or not body["content"].strip():
            raise ValueError("Fetch response has no content")
        if not self.db.execute("SELECT 1 FROM sources WHERE id=?",(sid,)).fetchone():
            raise ValueError("Unknown source")
        content = body["content"]
        # A page fetch is not evidence that a complete paper was read.
        basis = "abstract-page" if "/abs/" in payload["url"] else "web-page"
        with self.db:
            snap = self.save_snapshot("fetch",payload,raw,payload["url"],basis)
            self.db.execute("UPDATE sources SET retrieval_status='retrieved',current_snapshot_id=? WHERE id=?",(snap,sid))
            if isinstance(body.get("title"),str) and body["title"].strip():
                self.db.execute("UPDATE sources SET title=? WHERE id=? AND reference_id IS NULL",(body["title"].strip(),sid))
        return snap

    def add_claim(self, sid: str, text: str, excerpt: str, kind: str = "interpretation") -> str:
        source = self.db.execute("SELECT current_snapshot_id FROM sources WHERE id=?",(sid,)).fetchone()
        if not source or not source[0]:
            raise ValueError("Retrieve underlying material before adding a claim")
        snap = self.db.execute("SELECT * FROM snapshots WHERE id=?",(source[0],)).fetchone()
        path = self.root / snap["relative_path"]
        raw = path.read_bytes()
        if hashlib.sha256(raw).hexdigest() != snap["sha256"]:
            raise ValueError("Retrieval snapshot hash mismatch")
        content = json.loads(raw)["content"]
        if not text.strip() or not excerpt.strip() or excerpt not in content:
            raise ValueError("A candidate claim requires an exact nonempty passage from the fetched content")
        cid = identity("claim-",sid+source[0]+text+excerpt)
        with self.db:
            self.db.execute("INSERT OR IGNORE INTO claims VALUES(?,?,?,?,?,?,?,?,?,?)",
                            (cid,text,kind,sid,source[0],excerpt,content.index(excerpt),"candidate",None,None))
        return cid

    def review_claim(self, cid: str, status: str, reviewer: str) -> None:
        if status not in {"verified","rejected"} or not reviewer.strip():
            raise ValueError("Review requires a named reviewer and verified/rejected verdict")
        with self.db:
            result = self.db.execute("UPDATE claims SET review_status=?,reviewed_by=?,reviewed_at=? WHERE id=?",
                                     (status,reviewer,now(),cid))
            if not result.rowcount:
                raise ValueError("Unknown claim")
            self.db.execute("UPDATE relations SET review_status=? WHERE claim_id=?",(status,cid))

    def reindex(self) -> None:
        with self.db:
            for row in self.db.execute("SELECT id,canonical_url,kind FROM sources").fetchall():
                kind=resource_kind(row["canonical_url"])
                if kind!=row["kind"]:
                    self.db.execute("UPDATE sources SET kind=? WHERE id=?",(kind,row["id"]))
            self.db.execute("DELETE FROM source_search")
            self.db.execute("INSERT INTO source_search SELECT id,title,discovery_summary FROM sources")
            self.db.execute("DELETE FROM evidence_search")
            for row in self.db.execute("SELECT id,current_snapshot_id FROM sources WHERE current_snapshot_id IS NOT NULL").fetchall():
                snapshot=self.db.execute("SELECT * FROM snapshots WHERE id=?",(row["current_snapshot_id"],)).fetchone()
                if not snapshot:
                    continue
                path=self.root/snapshot["relative_path"]
                if not path.exists():
                    continue
                raw=path.read_bytes()
                if hashlib.sha256(raw).hexdigest()!=snapshot["sha256"]:
                    continue
                content=json.loads(raw).get("content","")
                self.db.execute("INSERT INTO evidence_search VALUES(?,?,?)",(row["id"],snapshot["id"],content))

    def search(self, term: str, limit: int = 20) -> list[dict]:
        # Quote user input as a literal phrase; do not expose FTS query syntax errors.
        literal = '"' + term.replace('"','""') + '"'
        rows=[{**dict(r),"match_basis":"title-or-discovery-summary"} for r in self.db.execute("""SELECT s.* FROM source_search f
            JOIN sources s ON s.id=f.source_id WHERE source_search MATCH ?
            ORDER BY bm25(source_search) LIMIT ?""",(literal,limit))]
        seen={r["id"] for r in rows}
        for row in self.db.execute("""SELECT s.* FROM evidence_search f JOIN sources s ON s.id=f.source_id
                WHERE evidence_search MATCH ? ORDER BY bm25(evidence_search) LIMIT ?""",(literal,limit)):
            if row["id"] not in seen and len(rows)<limit:
                rows.append({**dict(row),"match_basis":"retrieved-content"})
        return rows

    def export(self, destination: Path | None = None) -> None:
        dest = destination or self.home / "exports"
        dest.mkdir(parents=True,exist_ok=True)
        # A consistent database read and a filesystem lock protect portable exports.
        with (self.home/".export.lock").open("a") as lock:
            fcntl.flock(lock.fileno(),fcntl.LOCK_EX)
            own_transaction=not self.db.in_transaction
            if own_transaction:
                self.db.execute("BEGIN")
            try:
                self._export_tables(dest)
            finally:
                if own_transaction:
                    self.db.rollback()

    def _export_tables(self, dest: Path) -> None:
        (dest/"schema.sql").write_text(SCHEMA)
        for table in TABLES:
            rows = self.db.execute(f"SELECT * FROM {table} ORDER BY 1").fetchall()
            tmp = dest / f"{table}.jsonl.tmp"
            tmp.write_text("".join(json.dumps(dict(r),sort_keys=True,ensure_ascii=False)+"\n" for r in rows))
            tmp.replace(dest / f"{table}.jsonl")
        (dest / "manifest.json").write_text(json.dumps({
            "schema_version":SCHEMA_VERSION,"exported_at":now(),
            "tables":{table:{"rows":self.db.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0],
                "sha256":hashlib.sha256((dest/f"{table}.jsonl").read_bytes()).hexdigest()} for table in TABLES}
        },indent=2)+"\n")

    def restore(self, directory: Path) -> None:
        manifest = json.loads((directory / "manifest.json").read_text())
        if manifest["schema_version"] != SCHEMA_VERSION:
            raise ValueError("Export schema mismatch")
        if self.db.execute("SELECT COUNT(*) FROM sources").fetchone()[0] or self.db.execute("SELECT COUNT(*) FROM entities").fetchone()[0]:
            raise ValueError("Restore requires an empty database")
        contents = {}
        for table in TABLES:
            raw = (directory / f"{table}.jsonl").read_bytes()
            if hashlib.sha256(raw).hexdigest() != manifest["tables"][table]["sha256"]:
                raise ValueError("Export hash mismatch: "+table)
            contents[table] = [json.loads(line) for line in raw.splitlines()]
            if len(contents[table]) != manifest["tables"][table]["rows"]:
                raise ValueError("Export row count mismatch")
        with self.db:
            # Entity ids sort independently of parent ids in portable exports.
            self.db.execute("BEGIN")
            self.db.execute("PRAGMA defer_foreign_keys=ON")
            for table in TABLES:
                for row in contents[table]:
                    keys = list(row)
                    columns = {r[1] for r in self.db.execute(f"PRAGMA table_info({table})")}
                    if set(keys) != columns:
                        raise ValueError("Unexpected export fields: "+table)
                    if table == "snapshots":
                        target = (self.root / row["relative_path"]).resolve()
                        if not target.is_relative_to((self.root / "sources" / "ai-safety-landscape").resolve()):
                            raise ValueError("Snapshot path must remain in the retrieval directory")
                    verb = "INSERT OR REPLACE" if table == "metadata" else "INSERT"
                    self.db.execute(f"{verb} INTO {table} ({','.join(keys)}) VALUES ({','.join('?' for _ in keys)})",list(row.values()))
        self.reindex()

    def audit(self) -> dict:
        issues = []
        for row in self.db.execute("PRAGMA foreign_key_check"):
            issues.append("foreign-key: "+str(tuple(row)))
        snapshots = {r["id"]:r for r in self.db.execute("SELECT * FROM snapshots")}
        for snap in snapshots.values():
            path = self.root / snap["relative_path"]
            if not path.exists():
                issues.append("missing snapshot: "+snap["id"])
            elif hashlib.sha256(path.read_bytes()).hexdigest() != snap["sha256"]:
                issues.append("hash mismatch: "+snap["id"])
        for claim in self.db.execute("SELECT * FROM claims"):
            snap = snapshots.get(claim["snapshot_id"])
            if not snap or not (self.root / snap["relative_path"]).exists():
                issues.append("claim snapshot unavailable: "+claim["id"])
                continue
            content = json.loads((self.root / snap["relative_path"]).read_bytes()).get("content", "")
            start = claim["char_start"]
            if content[start:start+len(claim["excerpt"])] != claim["excerpt"]:
                issues.append("claim passage mismatch: "+claim["id"])
        return {"ok":not issues,"issues":issues,"snapshots":len(snapshots)}

    def backup(self) -> dict:
        """Package portable records and evidence; exclude credentials and private balances."""
        self.report()
        result=self.audit()
        if not result["ok"]:
            raise ValueError("Resolve missing or changed snapshots before creating a backup")
        directory=self.root/"sources"/"ai-safety-landscape"
        directory.mkdir(parents=True,exist_ok=True)
        stamp=datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
        target=directory/f"landscape-backup-{stamp}.zip"
        paths=list((self.home/"exports").glob("*"))
        paths += [self.home/name for name in ("topics.json","collection-policy.json","README.md",
                   "billing-check.json","native-search-check.json","graph.json","landscape.graphml","mind-map.mmd","coverage.md","explore.html")
                  if (self.home/name).exists()]
        paths += [self.root/r[0] for r in self.db.execute("SELECT relative_path FROM snapshots")]
        paths += [path for path in (self.home / "brainstorming").rglob("*") if path.is_file()]
        with zipfile.ZipFile(target,"w",compression=zipfile.ZIP_DEFLATED) as archive:
            for path in paths:
                archive.write(path,path.relative_to(self.root))
        record={"path":str(target.relative_to(self.root)),"created_at":now(),"files":len(paths),
                "sha256":hashlib.sha256(target.read_bytes()).hexdigest(),"bytes":target.stat().st_size,
                "contains":"Portable table exports, generated maps, and hashed retrieval snapshots. Credentials and private balance records are excluded."}
        (self.home/"backup-manifest.json").write_text(json.dumps(record,indent=2)+"\n")
        manifest=self.root/"sources"/"MANIFEST.md"
        if manifest.exists():
            with manifest.open("a") as f:
                f.write(f"\nBackup: `{record['path']}`; SHA-256 `{record['sha256']}`; {record['files']} files.\n")
        return record

    def coverage(self) -> list[dict]:
        rows=[]
        for area in self.db.execute("SELECT id,title FROM entities WHERE kind='area' ORDER BY id").fetchall():
            ids=[r[0] for r in self.db.execute("SELECT id FROM entities WHERE id=? OR parent_id=?",(area["id"],area["id"]))]
            placeholders=','.join('?' for _ in ids)
            statuses=dict(self.db.execute(f"SELECT status,COUNT(*) FROM queries WHERE topic_id IN ({placeholders}) GROUP BY status",ids))
            sources=self.db.execute(f"SELECT COUNT(DISTINCT source_id) FROM source_topics WHERE topic_id IN ({placeholders})",ids).fetchone()[0]
            retrieved=self.db.execute(f"SELECT COUNT(DISTINCT s.id) FROM sources s JOIN source_topics st ON st.source_id=s.id WHERE st.topic_id IN ({placeholders}) AND s.retrieval_status='retrieved'",ids).fetchone()[0]
            rows.append({"id":area["id"],"title":area["title"],"planned":sum(statuses.values()),
                         "complete":statuses.get("complete",0),"empty":statuses.get("empty",0),
                         "failed":statuses.get("failed",0),"sources":sources,"retrieved":retrieved})
        return rows

    def report(self) -> None:
        from .landscape_views import write_views
        self.reindex()
        self.export()
        write_views(self)
        manifest = self.root / "sources" / "MANIFEST.md"
        if manifest.exists():
            original = manifest.read_text()
            marker = "\n<!-- landscape-snapshots -->\n"
            original = original.split(marker)[0]
            lines = ["", "## AI safety landscape retrieval snapshots", "",
                     "Search responses are discovery material. Fetch responses are untrusted source material.", "",
                     "| Retrieved (UTC) | File | URL | SHA-256 | Basis |", "|---|---|---|---|---|"]
            for r in self.db.execute("SELECT * FROM snapshots ORDER BY retrieved_at,id"):
                lines.append(f"| {r['retrieved_at']} | `{r['relative_path']}` | {r['url']} | `{r['sha256']}` | {r['content_basis']} |")
            manifest.write_text(original.rstrip()+marker+"\n".join(lines)+"\n")


def collect(store: Landscape, *, fetch: bool, limit: int, free_confirmed: bool,
            count: int = 10, retry_failed: bool = False, area: str | None = None,
            paid_budget_usd: Decimal = Decimal("0")) -> None:
    """Run a bounded resumable collection. Each API attempt enters the durable ledger."""
    context = {"query_id":None,"source_id":None}
    if not paid_budget_usd.is_finite() or paid_budget_usd < 0:
        raise ValueError("Budget must be nonnegative")
    paid = paid_budget_usd > 0
    policy={}
    if paid:
        policy_path=store.home/"collection-policy.json"
        if not policy_path.exists():
            raise ResearchToolError("No recorded paid budget authorization")
        policy=json.loads(policy_path.read_text())
        if not policy.get("standalone_collection_enabled",True):
            raise ResearchToolError("Standalone collection is disabled; use the native server-side search route")
        if paid_budget_usd > Decimal(policy["authorized_total_usd"]):
            raise ResearchToolError("Requested budget exceeds recorded owner authorization")
        if datetime.now(timezone.utc) >= datetime.fromisoformat(policy["expires_at"]):
            raise ResearchToolError("Recorded paid budget authorization expired")
    elif store.db.execute("SELECT 1 FROM metadata WHERE key='billing_stop'").fetchone():
        raise ResearchToolError("Free-only collection disabled after an observed balance change")
    def on_attempt(*,operation,outcome,status):
        if outcome == "started":
            used = store.db.execute("SELECT COUNT(*) FROM calls WHERE operation=? AND outcome='started'",(operation,)).fetchone()[0]
            attempt_cap=policy.get("fetch_attempt_limit",80) if operation=="fetch" else policy.get("search_attempt_limit",200)
            if used >= attempt_cap:
                raise ResearchToolError("Initial-run API attempt limit reached")
            if paid:
                if datetime.now(timezone.utc) >= datetime.fromisoformat(policy["expires_at"]):
                    raise ResearchToolError("Recorded paid budget authorization expired")
                total_attempts=store.db.execute("SELECT COUNT(*) FROM calls WHERE outcome='started'").fetchone()[0]
                # Reserve the full published price even for potentially free or failed attempts.
                if Decimal(total_attempts+1)*Decimal("0.00075") > paid_budget_usd:
                    raise ResearchToolError("Conservative total API cost would exceed the authorized budget")
        with store.db:
            store.db.execute("INSERT INTO calls(at,operation,outcome,http_status,query_id,source_id) VALUES(?,?,?,?,?,?)",
                             (now(),operation,outcome,status,context["query_id"],context["source_id"]))
    client = DeepSeekResearchTools(free_confirmed=free_confirmed,on_attempt=on_attempt,paid_authorized=paid)
    if fetch:
        # Round-robin by area, rather than letting the largest branch consume the cap.
        candidates = []
        seen = set()
        queues = []
        for topic in store.coverage():
            if area and topic["id"] != area:
                continue
            rows = store.db.execute("""SELECT s.* FROM sources s JOIN source_topics st ON st.source_id=s.id
              WHERE st.topic_id IN (SELECT id FROM entities WHERE id=? OR parent_id=?)
              AND s.retrieval_status=? GROUP BY s.id
              ORDER BY CASE WHEN s.kind='paper' THEN 0 WHEN s.kind='repository' THEN 1 ELSE 2 END,
                (SELECT MIN(h.rank) FROM search_hits h JOIN queries q ON q.id=h.query_id
                 WHERE h.source_id=s.id AND q.topic_id=st.topic_id),s.id""",
              (topic["id"],topic["id"],"failed" if retry_failed else "discovered")).fetchall()
            queues.append(list(rows))
        while any(queues) and len(candidates)<limit:
            for queue in queues:
                while queue:
                    row=queue.pop(0)
                    if row["id"] not in seen:
                        candidates.append(row)
                        seen.add(row["id"])
                        break
                if len(candidates)>=limit:
                    break
    else:
        params = []
        where = "status IN ('pending','failed')" if retry_failed else "status='pending'"
        if area:
            where += " AND topic_id=?"
            params.append(area)
        # Interleave facets across areas so interrupted runs retain broad coverage.
        candidates = store.db.execute(f"SELECT * FROM queries WHERE {where} ORDER BY facet,topic_id LIMIT ?",params+[limit]).fetchall()
    consecutive_failures = 0
    for i,row in enumerate(candidates,1):
        operation = "fetch" if fetch else "search"
        context["query_id"] = None if fetch else row["id"]
        context["source_id"] = row["id"] if fetch else None
        payload = {"url":row["canonical_url"]} if fetch else {"query":row["query"],"count":count,"need_content":False}
        try:
            if not fetch:
                with store.db:
                    store.db.execute("UPDATE queries SET attempts=attempts+1 WHERE id=?",(row["id"],))
            raw = client.request(operation,payload)
            result = store.ingest_fetch(row["id"],payload,raw) if fetch else store.ingest_search(row["id"],payload,raw)
            consecutive_failures = 0
            print(json.dumps({"progress":f"{i}/{len(candidates)}","operation":operation,"id":row["id"],"result":result}),flush=True)
        except (ResearchToolError,ValueError,json.JSONDecodeError) as exc:
            consecutive_failures += 1
            with store.db:
                if fetch:
                    store.db.execute("UPDATE sources SET retrieval_status='failed' WHERE id=?",(row["id"],))
                else:
                    store.db.execute("UPDATE queries SET status='failed',error=? WHERE id=?",(str(exc),row["id"]))
            print(json.dumps({"operation":operation,"id":row["id"],"error":str(exc)}),flush=True)
            if (consecutive_failures>=3 or any(f"HTTP {code}" in str(exc) for code in (400,401,402)) or "window ended" in str(exc)
                    or "limit reached" in str(exc) or "budget" in str(exc)):
                store.report()
                raise ResearchToolError("Collection stopped; inspect the persistent failure ledger") from exc
        if i % 8 == 0:
            store.export()
        time.sleep(0.25)
    store.report()


def billing_check(store: Landscape, *, start: bool) -> dict:
    """Preserve private balance evidence and export only deltas and limitations."""
    client=DeepSeekResearchTools(free_confirmed=True)
    balance=client.balance()
    directory=store.root/"sources"/"ai-safety-landscape"
    directory.mkdir(parents=True,exist_ok=True)
    baseline=directory/"billing-baseline.json"
    calls=store.db.execute("SELECT COUNT(*) FROM calls WHERE outcome='success' AND operation IN ('search','fetch')").fetchone()[0]
    native_calls=store.db.execute("SELECT COUNT(*) FROM calls WHERE outcome='success' AND operation='native-search'").fetchone()[0]
    if start:
        if baseline.exists():
            raise ValueError("A billing baseline already exists; preserve it and use billing-end")
        baseline.write_text(json.dumps({"at":now(),"balance":balance,"successful_tool_calls":calls},indent=2))
        return {"baseline_recorded":True,"successful_tool_calls":calls}
    if not baseline.exists():
        raise ValueError("Record billing-start before a collection batch")
    before=json.loads(baseline.read_text())
    previous={r["currency"]:r for r in before["balance"]["balance_infos"]}
    current={r["currency"]:r for r in balance["balance_infos"]}
    if set(previous)!=set(current):
        raise ValueError("Account balance currencies changed; manual billing review required")
    deltas={currency:{field:str(Decimal(current[currency][field])-Decimal(previous[currency][field]))
             for field in ("total_balance","granted_balance","topped_up_balance")}
            for currency in previous}
    count=calls-before["successful_tool_calls"]
    result={"checked_at":now(),"baseline_at":before["at"],"successful_tool_calls_since_baseline":count,
            "successful_tool_calls_total":calls,
            "balance_changes":deltas,
            "zero_observed_balance_change":all(Decimal(v)==0 for fields in deltas.values() for v in fields.values()),
            "standard_price_usd_for_successful_calls":str(Decimal(count)*Decimal("0.00075")),
            "standard_price_usd_for_all_successful_calls":str(Decimal(calls)*Decimal("0.00075")),
            "model_inference_calls":native_calls,
            "standalone_requests_only_in_price_calculation":True,
            "limitation":"Observed balance changes cannot exclude delayed billing or concurrent account activity."}
    (directory/"billing-followup.json").write_text(json.dumps({"result":result,"balance":balance},indent=2))
    (store.home/"billing-check.json").write_text(json.dumps(result,indent=2)+"\n")
    if not result["zero_observed_balance_change"]:
        store.db.execute("INSERT OR REPLACE INTO metadata VALUES('billing_stop','observed balance change')")
        store.db.commit()
    return result


def native_probe(store: Landscape, query: str) -> dict:
    """Validate one native search and persist its original model and tool response."""
    policy=json.loads((store.home/"collection-policy.json").read_text())
    reserve=Decimal(policy.get("native_model_validation_allowance_usd","0"))
    if reserve<=0:
        raise ResearchToolError("A model-validation allowance must be recorded within the approved total budget")
    attempted=store.db.execute("SELECT COUNT(*) FROM calls WHERE operation='native-search' AND outcome='started'").fetchone()[0]
    if attempted>=policy.get("native_validation_attempt_limit",1):
        raise ResearchToolError("Native search validation attempt limit reached")
    total=store.db.execute("SELECT COUNT(*) FROM calls WHERE outcome='started'").fetchone()[0]
    if Decimal(total)*Decimal("0.00075")+reserve>Decimal(policy["authorized_total_usd"]):
        raise ResearchToolError("Native validation reserve exceeds the total authorized budget")
    if datetime.now(timezone.utc)>=datetime.fromisoformat(policy["expires_at"]):
        raise ResearchToolError("Native validation authorization expired")
    qid=identity("q-","native-validation"+query)
    with store.db:
        store.db.execute("INSERT OR IGNORE INTO queries(id,topic_id,facet,query) VALUES(?,?,?,?)",
                         (qid,"multi-agent","native-validation",query))
    def record(*,operation,outcome,status):
        with store.db:
            store.db.execute("INSERT INTO calls(at,operation,outcome,http_status,query_id) VALUES(?,?,?,?,?)",
                             (now(),operation,outcome,status,qid))
    client=DeepSeekResearchTools(free_confirmed=True,on_attempt=record,timeout=60)
    before=client.balance()
    raw=client.native_search(query)
    body=json.loads(raw)
    blocks=body.get("content",[])
    tool_uses=[b for b in blocks if b.get("type")=="server_tool_use"]
    result_blocks=[b for b in blocks if b.get("type")=="web_search_tool_result"]
    results=[]
    for block in result_blocks:
        for item in block.get("content",[]) if isinstance(block.get("content"),list) else []:
            if item.get("type")=="web_search_result" and item.get("url"):
                results.append({"url":item["url"],"title":item.get("title", ""),"summary":""})
    count=store.ingest_search(qid,{"query":query,"model":"deepseek-flash","max_tokens":512,"max_uses":1},raw,native_results=results)
    after=client.balance()
    previous={r["currency"]:Decimal(r["total_balance"]) for r in before["balance_infos"]}
    current={r["currency"]:Decimal(r["total_balance"]) for r in after["balance_infos"]}
    result={"at":now(),"endpoint":"https://api.deepseek.com/anthropic/v1/messages",
            "requested_model":"deepseek-flash","reported_model":body.get("model"),
            "server_tool_use_blocks":len(tool_uses),"search_result_blocks":len(result_blocks),
            "source_results":count,"usage":body.get("usage",{}),
            "balance_changes":{k:str(current[k]-previous[k]) for k in previous},
            "search_fee_status":"Documented server-side promotion; no per-request fee field returned",
            "model_inference_status":"Token usage recorded; subscription inclusion is not established by this response",
            "validation_passed":bool(tool_uses and result_blocks and count)}
    private=store.root/"sources"/"ai-safety-landscape"/"native-billing-probe.json"
    private.write_text(json.dumps({"before":before,"after":after,"result":result},indent=2))
    (store.home/"native-search-check.json").write_text(json.dumps(result,indent=2)+"\n")
    store.report()
    return result


def main() -> int:
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--home",type=Path,default=DEFAULT_HOME)
    sub=parser.add_subparsers(dest="command",required=True)
    sub.add_parser("init")
    sub.add_parser("expand-primary")
    sub.add_parser("expand-subtopics")
    for cmd in ("collect","fetch","pilot"):
        p=sub.add_parser(cmd)
        p.add_argument("--limit",type=int,default=32)
        p.add_argument("--count",type=int,default=10)
        p.add_argument("--free-confirmed",action="store_true")
        p.add_argument("--retry-failed",action="store_true")
        p.add_argument("--area")
        p.add_argument("--paid-budget-usd",type=Decimal,default=Decimal("0"))
    sub.add_parser("report")
    sub.add_parser("audit")
    sub.add_parser("backup")
    sub.add_parser("billing-start")
    sub.add_parser("billing-end")
    p=sub.add_parser("native-probe"); p.add_argument("query")
    p=sub.add_parser("search"); p.add_argument("text")
    p=sub.add_parser("restore"); p.add_argument("directory",type=Path)
    p=sub.add_parser("claim"); p.add_argument("source_id"); p.add_argument("text"); p.add_argument("excerpt")
    p.add_argument("--kind",choices=["established","finding","interpretation","hypothesis","speculation"],default="interpretation")
    p=sub.add_parser("review"); p.add_argument("claim_id"); p.add_argument("status",choices=["verified","rejected"]); p.add_argument("--reviewer",required=True)
    args=parser.parse_args()
    store=Landscape(args.home)
    try:
        if args.command=="init":
            store.initialize()
            print(json.dumps({"bibliography_rows_imported":store.seed_bibliography()}))
            store.report()
        elif args.command=="expand-primary":
            print(json.dumps({"queries_added":store.expand_primary()})); store.report()
        elif args.command=="expand-subtopics":
            print(json.dumps({"queries_added":store.expand_subtopics()})); store.report()
        elif args.command in {"collect","fetch","pilot"}:
            if not args.paid_budget_usd and store.db.execute("SELECT 1 FROM metadata WHERE key='billing_stop'").fetchone():
                raise ResearchToolError("Collection disabled after an observed balance change; review billing before proceeding")
            policy_path=store.home/"collection-policy.json"
            policy=json.loads(policy_path.read_text()) if args.paid_budget_usd and policy_path.exists() else {}
            maximum=policy.get("fetch_attempt_limit",80) if args.command=="fetch" else policy.get("search_attempt_limit",200)
            if not 1<=args.limit<=maximum:
                parser.error(f"limit must be between 1 and {maximum}")
            if not 1<=args.count<=50:
                parser.error("count must be between 1 and 50")
            if args.area and not store.db.execute("SELECT 1 FROM entities WHERE id=? AND kind IN ('area','topic')",(args.area,)).fetchone():
                parser.error("Unknown area")
            if args.command=="pilot":
                if not args.free_confirmed:
                    raise ResearchToolError("Confirm free coverage for this route before collection")
                billing_check(store,start=True)
            collect(store,fetch=args.command=="fetch",limit=args.limit,count=args.count,
                    free_confirmed=args.free_confirmed,retry_failed=args.retry_failed,area=args.area,
                    paid_budget_usd=args.paid_budget_usd)
            if args.command=="pilot":
                result=billing_check(store,start=False)
                print(json.dumps(result,indent=2))
                return 0 if result["zero_observed_balance_change"] else 1
        elif args.command=="report": store.report()
        elif args.command=="audit":
            result=store.audit(); print(json.dumps(result,indent=2)); return 0 if result["ok"] else 1
        elif args.command=="backup": print(json.dumps(store.backup(),indent=2))
        elif args.command in {"billing-start","billing-end"}:
            result=billing_check(store,start=args.command=="billing-start")
            print(json.dumps(result,indent=2)); return 0 if result.get("zero_observed_balance_change",True) else 1
        elif args.command=="native-probe":
            result=native_probe(store,args.query); print(json.dumps(result,indent=2))
            return 0 if result["validation_passed"] else 1
        elif args.command=="search": print(json.dumps(store.search(args.text),indent=2,ensure_ascii=False))
        elif args.command=="restore": store.restore(args.directory); store.report()
        elif args.command=="claim":
            print(store.add_claim(args.source_id,args.text,args.excerpt,args.kind)); store.report()
        elif args.command=="review":
            store.review_claim(args.claim_id,args.status,args.reviewer); store.report()
        return 0
    except (ResearchToolError,ValueError) as exc:
        print(json.dumps({"error":str(exc)})); return 1
    finally:
        store.close()


if __name__=="__main__":
    raise SystemExit(main())
