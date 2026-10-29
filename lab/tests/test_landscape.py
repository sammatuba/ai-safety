"""Verify provenance, resumability, export integrity, and zero-cost collection gates."""
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import shutil
import zipfile
from decimal import Decimal

import pytest

from epistemic_lab.landscape import Landscape, ROOT, canonical_url, collect, resource_kind
from epistemic_lab.llm import DeepSeekResearchTools, PROMO_END, ResearchToolError


@pytest.fixture
def store(tmp_path):
    home=tmp_path/"literature"/"landscape"
    home.mkdir(parents=True)
    shutil.copy(ROOT/"literature"/"landscape"/"topics.json",home/"topics.json")
    db=Landscape(home,root=tmp_path)
    db.initialize()
    yield db
    db.close()


def query(store):
    return store.db.execute("SELECT * FROM queries ORDER BY id LIMIT 1").fetchone()


def discovered(store):
    q=query(store)
    payload={"query":q["query"],"count":2,"need_content":False}
    raw=json.dumps({"results":[{"title":"A research paper","url":"https://arxiv.org/abs/2401.12345v2",
                                 "summary":"An unverified discovery summary."}]}).encode()
    store.ingest_search(q["id"],payload,raw)
    return store.db.execute("SELECT * FROM sources").fetchone()


def fetched(store):
    src=discovered(store)
    content="The authors report a result under stated assumptions. This is an abstract."
    raw=json.dumps({"title":"A research paper","content":content}).encode()
    store.ingest_fetch(src["id"],{"url":src["canonical_url"]},raw)
    return src,content


def test_topic_coverage_is_broad_and_init_is_idempotent(store):
    assert store.db.execute("SELECT COUNT(*) FROM entities WHERE kind='area'").fetchone()[0]==20
    assert store.db.execute("SELECT COUNT(*) FROM entities WHERE kind='topic'").fetchone()[0]==80
    assert store.db.execute("SELECT COUNT(*) FROM queries").fetchone()[0]==160
    store.initialize()
    assert store.db.execute("SELECT COUNT(*) FROM queries").fetchone()[0]==160
    assert all(len(r[0])<=128 for r in store.db.execute("SELECT query FROM queries"))


def test_primary_expansion_is_bounded_and_idempotent(store):
    assert store.expand_primary()==40
    assert store.expand_primary()==0
    assert store.db.execute("SELECT COUNT(*) FROM queries").fetchone()[0]==200
    assert all(len(r[0])<=128 for r in store.db.execute("SELECT query FROM queries"))


def test_subtopic_expansion_and_parent_coverage(store):
    store.expand_primary()
    assert store.expand_subtopics()==240
    assert store.expand_subtopics()==0
    assert store.db.execute("SELECT COUNT(*) FROM queries").fetchone()[0]==440
    assert all(r['planned']==22 for r in store.coverage())
    assert all(len(r[0])<=128 for r in store.db.execute("SELECT query FROM queries"))


@pytest.mark.parametrize("left,right",[
    ("https://arxiv.org/pdf/2401.12345v2.pdf","https://arxiv.org/abs/2401.12345"),
    ("https://arxiv.org/html/2401.12345v5","https://arxiv.org/abs/2401.12345"),
    ("https://example.com/a/?utm_source=x&b=2#section","https://example.com/a?b=2"),
])
def test_canonicalization(left,right):
    assert canonical_url(left)==right


@pytest.mark.parametrize("url",["file:///etc/passwd","https://key:secret@example.com/","http://localhost/x"])
def test_invalid_resource_urls_are_rejected(url):
    with pytest.raises(ValueError): canonical_url(url)


def test_publication_platform_directories_are_not_papers():
    assert resource_kind("https://aclanthology.org/people/a-researcher")=="web-resource"
    assert resource_kind("https://openreview.net/profile?id=someone")=="web-resource"
    assert resource_kind("https://aclanthology.org/2025.emnlp-main.1653")=="paper"
    assert resource_kind("https://proceedings.mlr.press/v235/greenblatt24a.html")=="paper"


def test_search_is_discovery_and_deduplicates_versions(store):
    src=discovered(store)
    with store.db:
        sid=store.add_source("https://arxiv.org/pdf/2401.12345v9.pdf","Another title")
    assert sid==src["id"]
    assert store.db.execute("SELECT COUNT(*) FROM sources").fetchone()[0]==1
    assert src["retrieval_status"]=="discovered"
    assert src["metadata_status"]=="unreviewed"
    assert store.db.execute("SELECT COUNT(*) FROM claims").fetchone()[0]==0
    assert store.db.execute("SELECT status FROM queries WHERE id=?",(query(store)["id"],)).fetchone()[0]=="complete"
    assert store.audit()["ok"]


def test_empty_search_is_completed_without_claiming_sources(store):
    q=query(store)
    store.ingest_search(q["id"],{"query":q["query"]},b'{"results":[]}')
    assert store.db.execute("SELECT status FROM queries WHERE id=?",(q["id"],)).fetchone()[0]=="empty"


def test_claim_cannot_use_search_summary_as_evidence(store):
    src=discovered(store)
    with pytest.raises(ValueError,match="Retrieve underlying"):
        store.add_claim(src["id"],"Claim","unverified discovery summary")


def test_claim_requires_exact_passage_and_named_review(store):
    src,content=fetched(store)
    with pytest.raises(ValueError,match="exact nonempty"):
        store.add_claim(src["id"],"Claim","A fabricated quotation")
    cid=store.add_claim(src["id"],"The result has stated assumptions.",content.split(". ")[0]+".")
    assert store.db.execute("SELECT review_status FROM claims WHERE id=?",(cid,)).fetchone()[0]=="candidate"
    with pytest.raises(ValueError): store.review_claim(cid,"verified","")
    store.review_claim(cid,"verified","test reviewer")
    assert store.audit()["ok"]


def test_tampered_snapshot_blocks_claim_extraction(store):
    src,content=fetched(store)
    snap=store.db.execute("SELECT * FROM snapshots WHERE operation='fetch'").fetchone()
    (store.root/snap["relative_path"]).write_text('{"content":"changed"}')
    with pytest.raises(ValueError,match="hash mismatch"):
        store.add_claim(src["id"],"Claim",content)
    assert not store.audit()["ok"]


def test_search_indexes_underlying_content_with_distinct_basis(store):
    src,content=fetched(store)
    store.reindex()
    rows=store.search("stated assumptions")
    assert rows[0]['id']==src['id']
    assert rows[0]['match_basis']=='retrieved-content'


def test_factual_relation_requires_provenance(store):
    with pytest.raises(ValueError,match="requires an evidence"):
        store.add_relation("alignment","supports","theory","A factual assertion",factual=True)
    src,content=fetched(store)
    cid=store.add_claim(src["id"],"An interpretation",content)
    with store.db:
        rid=store.add_relation("alignment","supports","theory","A candidate interpretation",cid,True)
    assert store.db.execute("SELECT review_status FROM relations WHERE id=?",(rid,)).fetchone()[0]=="candidate"
    store.review_claim(cid,"rejected","test reviewer")
    assert store.db.execute("SELECT review_status FROM relations WHERE id=?",(rid,)).fetchone()[0]=="rejected"


def test_portable_export_restore_and_parent_order(store,tmp_path):
    src,content=fetched(store)
    store.add_claim(src["id"],"An interpretation",content)
    store.export()
    other=Landscape(tmp_path/"other",root=tmp_path)
    try:
        other.restore(store.home/"exports")
        for table in ("entities","queries","sources","snapshots","claims","relations"):
            assert other.db.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]==store.db.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
        assert other.search("research paper")[0]["id"]==src["id"]
        assert other.audit()["ok"]
    finally: other.close()


def test_restore_rejects_changed_exports(store,tmp_path):
    discovered(store); store.export()
    path=store.home/"exports"/"sources.jsonl"
    path.write_text(path.read_text()+" ")
    other=Landscape(tmp_path/"other",root=tmp_path)
    try:
        with pytest.raises(ValueError,match="hash mismatch"):
            other.restore(store.home/"exports")
        assert other.db.execute("SELECT COUNT(*) FROM entities").fetchone()[0]==0
    finally: other.close()


def test_automatic_restore_prevents_overwriting_existing_exports(store,tmp_path):
    discovered(store); store.export()
    home=tmp_path/"clone"
    home.mkdir()
    shutil.copytree(store.home/"exports",home/"exports")
    other=Landscape(home,root=tmp_path)
    try: assert other.db.execute("SELECT COUNT(*) FROM sources").fetchone()[0]==1
    finally: other.close()


def test_free_route_confirmation_is_required():
    with pytest.raises(ResearchToolError,match="Confirm free coverage"):
        DeepSeekResearchTools(api_key="test-only")


def test_paid_collection_requires_recorded_owner_authorization(store):
    with pytest.raises(ResearchToolError,match="No recorded paid budget"):
        collect(store,fetch=False,limit=1,free_confirmed=False,paid_budget_usd=Decimal("1"))


def test_paid_collection_rejects_excess_budget(store):
    (store.home/"collection-policy.json").write_text(json.dumps({"authorized_total_usd":"1","expires_at":"2030-01-01T00:00:00+00:00"}))
    with pytest.raises(ResearchToolError,match="exceeds recorded"):
        collect(store,fetch=False,limit=1,free_confirmed=False,paid_budget_usd=Decimal("2"))


def test_free_collection_cannot_bypass_observed_billing_stop(store):
    with store.db:
        store.db.execute("INSERT INTO metadata VALUES('billing_stop','observed debit')")
    with pytest.raises(ResearchToolError,match="Free-only collection disabled"):
        collect(store,fetch=False,limit=1,free_confirmed=True)


def test_standalone_route_stop_overrides_a_paid_budget(store):
    (store.home/"collection-policy.json").write_text(json.dumps({"authorized_total_usd":"1","standalone_collection_enabled":False}))
    with pytest.raises(ResearchToolError,match="Standalone collection is disabled"):
        collect(store,fetch=False,limit=1,free_confirmed=False,paid_budget_usd=Decimal("1"))


def test_native_response_preserves_original_server_tool_blocks(store):
    q=query(store)
    body={"model":"deepseek-flash","content":[{"type":"server_tool_use","name":"web_search"},
        {"type":"web_search_tool_result","content":[{"type":"web_search_result","url":"https://arxiv.org/abs/2401.12345","title":"Paper"}]}],
        "usage":{"server_tool_use":{"web_search_requests":1}}}
    raw=json.dumps(body).encode()
    result=store.ingest_search(q["id"],{"query":q["query"]},raw,native_results=[{"url":"https://arxiv.org/abs/2401.12345","title":"Paper"}])
    assert result==1
    snapshot=store.db.execute("SELECT * FROM snapshots").fetchone()
    assert snapshot['operation']=='native-search'
    assert (store.root/snapshot['relative_path']).read_bytes()==raw
    assert store.audit()['ok']


def test_native_search_uses_messages_and_records_actual_server_tool_response():
    captured=[]
    raw=b'{"content":[{"type":"server_tool_use","name":"web_search"}]}'
    class Response:
        def __enter__(self): return self
        def __exit__(self,*args): return False
        def read(self,*args): return raw
    class Opener:
        def open(self,request,**kwargs): captured.append(request); return Response()
    client=DeepSeekResearchTools(free_confirmed=True,api_key='test-only',
                               clock=lambda:datetime(2026,10,28,tzinfo=timezone.utc))
    client.opener=Opener()
    assert client.native_search('AI safety')==raw
    request=captured[0]
    assert request.full_url=='https://api.deepseek.com/anthropic/v1/messages'
    payload=json.loads(request.data)
    assert payload['model']=='deepseek-flash'
    assert payload['tools']==[{'type':'web_search_20250305','name':'web_search','max_uses':1}]
    assert payload['thinking']=={'type':'disabled'}


def test_paid_budget_counts_attempts_before_the_new_run(store,monkeypatch):
    (store.home/"collection-policy.json").write_text(json.dumps({"authorized_total_usd":"1","expires_at":"2030-01-01T00:00:00+00:00"}))
    with store.db:
        store.db.execute("INSERT INTO calls(at,operation,outcome) VALUES('test','search','started')")
    actual_dispatches=[]
    class FakeClient:
        def __init__(self,**kwargs): self.hook=kwargs['on_attempt']
        def request(self,operation,payload):
            self.hook(operation=operation,outcome='started',status=None)
            actual_dispatches.append(1)
            return b'{"results":[]}'
    monkeypatch.setattr('epistemic_lab.landscape.DeepSeekResearchTools',FakeClient)
    with pytest.raises(ResearchToolError,match="Collection stopped"):
        collect(store,fetch=False,limit=1,free_confirmed=False,paid_budget_usd=Decimal("0.001"))
    assert not actual_dispatches


def test_unavailable_fetch_is_recorded_and_collection_continues(store,monkeypatch):
    with store.db:
        for number in (1,2):
            sid=store.add_source(f"https://arxiv.org/abs/2401.1234{number}",f"Paper {number}")
            store.db.execute("INSERT INTO source_topics VALUES(?,?,?,?)",(sid,"alignment","test","unreviewed"))
    attempts=[]
    class FakeClient:
        def __init__(self,**kwargs): self.hook=kwargs['on_attempt']
        def request(self,operation,payload):
            self.hook(operation=operation,outcome='started',status=None)
            attempts.append(payload)
            if len(attempts)==1:
                self.hook(operation=operation,outcome='failed',status=404)
                raise ResearchToolError("DeepSeek fetch returned HTTP 404")
            self.hook(operation=operation,outcome='success',status=200)
            return b'{"title":"Paper","content":"An underlying abstract."}'
    monkeypatch.setattr('epistemic_lab.landscape.DeepSeekResearchTools',FakeClient)
    monkeypatch.setattr('epistemic_lab.landscape.time.sleep',lambda _:None)
    collect(store,fetch=True,limit=2,free_confirmed=True)
    assert len(attempts)==2
    assert dict(store.db.execute("SELECT retrieval_status,COUNT(*) FROM sources GROUP BY retrieval_status"))=={'failed':1,'retrieved':1}


def test_cutoff_prevents_even_a_first_network_attempt():
    client=DeepSeekResearchTools(free_confirmed=True,api_key="test-only",clock=lambda:PROMO_END)
    with pytest.raises(ResearchToolError,match="window ended"):
        client.request("search",{"query":"AI safety"})


def test_standalone_retry_rechecks_budget_before_dispatch(monkeypatch):
    import urllib.error
    calls=[]
    attempts=[]
    class Opener:
        def open(self,*args,**kwargs):
            calls.append(1)
            raise urllib.error.HTTPError("https://api.deepseek.com",429,"rate limit",{},None)
    def hook(**kwargs):
        if kwargs['outcome']=='started':
            attempts.append(1)
            if len(attempts)>1:
                raise ResearchToolError('Paid budget exhausted')
    client=DeepSeekResearchTools(paid_authorized=True,api_key="test-only",on_attempt=hook)
    client.opener=Opener()
    monkeypatch.setattr("epistemic_lab.llm.time.sleep",lambda _:None)
    with pytest.raises(ResearchToolError,match="budget exhausted"):
        client.request("search",{"query":"AI safety"})
    assert len(calls)==1


def test_free_acknowledgement_cannot_make_standalone_requests_free():
    client=DeepSeekResearchTools(free_confirmed=True,api_key='test-only',
                               clock=lambda:datetime(2026,10,28,tzinfo=timezone.utc))
    with pytest.raises(ResearchToolError,match='Standalone Search/Fetch requires paid authorization'):
        client.request('search',{'query':'AI safety'})


def test_generated_view_escapes_untrusted_script_text(store):
    with store.db:
        store.add_source("https://example.com","</script><script>alert(1)</script>")
    store.report()
    html=(store.home/"explore.html").read_text()
    assert "</script><script>alert(1)</script>" not in html
    assert "\\u003c/script>" in html
    assert (store.home/"landscape.graphml").exists()


def test_brainstorm_proposals_export_links_without_becoming_verified_claims(store):
    directory = store.home / "brainstorming"
    directory.mkdir()
    shutil.copy(ROOT / "literature/landscape/brainstorming/ideas.json", directory / "ideas.json")
    store.report()
    graph = json.loads((store.home / "graph.json").read_text())
    ideas = graph["brainstorming"]["ideas"]
    assert ideas
    assert not graph["claims"]
    assert all(edge["review_status"] == "speculation" and not edge["claim_id"]
               for edge in graph["brainstorming_relations"])
    assert {idea["id"] for idea in ideas} <= {edge["subject"] for edge in graph["brainstorming_relations"]}
    assert 'kind' in (store.home / "nodes.csv").read_text()
    assert ',idea,' in (store.home / "nodes.csv").read_text()
    assert "[SPECULATION]" in (directory / "ideas.md").read_text()
    assert 'id="brainstorming"' in (store.home / "explore.html").read_text()


def test_brainstorm_graph_rejects_unknown_topic(store):
    directory = store.home / "brainstorming"
    directory.mkdir()
    bank = {"schema_version": 1, "ideas": [{"id": "B01", "topics": ["missing"], "related": []}]}
    (directory / "ideas.json").write_text(json.dumps(bank))
    with pytest.raises(ValueError, match="Unknown brainstorming topic"):
        store.report()


def test_backup_preserves_evidence_without_private_balance_or_credentials(store):
    fetched(store)
    directory = store.home / "brainstorming"
    directory.mkdir()
    shutil.copy(ROOT / "literature/landscape/brainstorming/ideas.json", directory / "ideas.json")
    (store.home/'native-search-check.json').write_text('{"validation_scope":"protocol only"}')
    private=store.root/"sources"/"ai-safety-landscape"/"billing-baseline.json"
    private.write_text('{"private_balance":"test"}')
    result=store.backup()
    path=store.root/result["path"]
    assert hashlib.sha256(path.read_bytes()).hexdigest()==result["sha256"]
    with zipfile.ZipFile(path) as archive:
        names=archive.namelist()
        assert any(name.endswith('sources.jsonl') for name in names)
        assert any('/snap-' in name for name in names)
        assert any(name.endswith('native-search-check.json') for name in names)
        assert any(name.endswith('brainstorming/ideas.json') for name in names)
        assert any(name.endswith('brainstorming/ideas.md') for name in names)
        assert not any('billing-baseline' in name or name.endswith('.env') for name in names)
