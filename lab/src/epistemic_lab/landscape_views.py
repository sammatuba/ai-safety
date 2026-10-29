"""Generate a mind map and knowledge graph from source records and provenance."""
from __future__ import annotations

import csv
import io
import json
from pathlib import Path
from xml.etree import ElementTree as ET


def brainstorming_records(home: Path, entities: list[dict]) -> dict:
    """Load brainstorm records and validate their editorial knowledge graph links."""
    path = home / "brainstorming" / "ideas.json"
    if not path.exists():
        return {"schema_version": 1, "ideas": []}
    bank = json.loads(path.read_text())
    if bank.get("schema_version") != 1:
        raise ValueError("Unsupported brainstorming schema")
    ideas = bank["ideas"]
    ids = [idea["id"] for idea in ideas]
    if len(ids) != len(set(ids)):
        raise ValueError("Duplicate brainstorm record id")
    topic_ids = {entity["id"] for entity in entities}
    idea_ids = set(ids)
    if idea_ids & topic_ids:
        raise ValueError("Brainstorm record id conflicts with a topic")
    for idea in ideas:
        if not set(idea["topics"]) <= topic_ids:
            raise ValueError(f"Unknown brainstorming topic in {idea['id']}")
        if not set(idea["related"]) <= idea_ids:
            raise ValueError(f"Unknown related brainstorm record in {idea['id']}")
    return bank


def write_idea_cards(home: Path, bank: dict) -> None:
    """Render proposed experiments from canonical brainstorm records, without claim promotion."""
    if not bank["ideas"]:
        return
    lines = ["---", 'title: "Research brainstorming idea cards"', "status: draft",
             f"updated: {bank['updated']}",
             'depends_on: ["literature/landscape/brainstorming/ideas.json"]', "---", "",
             "# Research brainstorming idea cards", "",
             "Generated from `ideas.json`. Edit the canonical records and regenerate the map.", "",
             "[SPECULATION] Every record is a proposal. No experiment result or novelty claim is implied.", "",
             "Read the [concept guide](README.md) and [reference index](../../INDEX.md).", ""]
    fields = [("question", "Question"), ("foundation", "Conceptual basis"),
              ("mechanism", "Mechanism"), ("analogy_limit", "Limit of the industry connection"),
              ("safety_path", "Safety relevance"), ("experiment", "Experiment"),
              ("metrics", "Measures"), ("kill_criterion", "Reason to stop or redesign"),
              ("delta", "Proposed comparison with prior work"), ("next_step", "First check")]
    for idea in bank["ideas"]:
        lines += [f"## {idea['id']} {idea['title']}", "",
                  f"**Lens:** {idea['lens']}. **Industry:** {idea['industry']}. **Scope:** {idea['scope']}.", ""]
        for key, label in fields:
            lines += [f"**{label}:** {idea[key]}", ""]
        lines += ["**Prior work:** " + ", ".join(f"[{ref}]" for ref in idea["prior_work"]) + ".", "",
                  "**Related ideas:** " + ", ".join(idea["related"]) + ".", "",
                  "**Map areas:** " + ", ".join(idea["topics"]) + ".", ""]
    (home / "brainstorming" / "ideas.md").write_text("\n".join(lines))


def write_views(store) -> None:
    """Build portable graph exports and a self-contained interactive artifact."""
    entities=[dict(r) for r in store.db.execute("SELECT * FROM entities ORDER BY id")]
    sources=[dict(r) for r in store.db.execute("SELECT * FROM sources ORDER BY id")]
    relations=[dict(r) for r in store.db.execute("SELECT * FROM relations ORDER BY id")]
    assignments=[dict(r) for r in store.db.execute("SELECT DISTINCT source_id,topic_id FROM source_topics")]
    claims=[dict(r) for r in store.db.execute("SELECT * FROM claims ORDER BY id")]
    coverage=store.coverage()
    queries=[dict(r) for r in store.db.execute("SELECT id,topic_id,facet,query,status,error FROM queries ORDER BY topic_id,facet")]
    snapshots=[dict(r) for r in store.db.execute("SELECT * FROM snapshots ORDER BY id")]
    data={"entities":entities,"sources":sources,"relations":relations,"assignments":assignments,
          "claims":claims,"coverage":coverage,"queries":queries,"snapshots":snapshots}
    bank = brainstorming_records(store.home, entities)
    data["brainstorming"] = bank
    write_idea_cards(store.home, bank)
    billing_path=store.home/"billing-check.json"
    if billing_path.exists():
        data["billing"]=json.loads(billing_path.read_text())
    policy_path=store.home/"collection-policy.json"
    if policy_path.exists():
        data["policy"]=json.loads(policy_path.read_text())
    native_path=store.home/"native-search-check.json"
    if native_path.exists():
        data["native_validation"]=json.loads(native_path.read_text())
    home=store.home
    nodes=[{"id":e["id"],"kind":e["kind"],"title":e["title"],"review_status":e["review_status"]} for e in entities]
    nodes.extend({"id":s["id"],"kind":"source","title":s["title"],"review_status":s["metadata_status"]} for s in sources)
    nodes.extend({"id":idea["id"],"kind":"idea","title":idea["title"],"review_status":"speculation"}
                 for idea in bank["ideas"])
    edges=[{"subject":e["id"],"predicate":"subtopic_of","object":e["parent_id"],"review_status":"editorial","claim_id":""}
           for e in entities if e["parent_id"]]
    edges.extend({"subject":r["subject_id"],"predicate":r["predicate"],"object":r["object_id"],
                  "review_status":r["review_status"],"claim_id":r["claim_id"] or ""} for r in relations)
    edges.extend({"subject":r["source_id"],"predicate":"discovered_under","object":r["topic_id"],
                  "review_status":"unreviewed","claim_id":""} for r in assignments)
    brainstorm_edges = []
    for idea in bank["ideas"]:
        for predicate, targets in (("explores", idea["topics"]), ("related_idea", idea["related"])):
            brainstorm_edges.extend({"subject":idea["id"], "predicate":predicate, "object":target,
                                     "review_status":"speculation", "claim_id":""} for target in targets)
    edges.extend(brainstorm_edges)
    data["brainstorming_relations"] = brainstorm_edges
    (home/"graph.json").write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n")
    for name,rows in (("nodes",nodes),("edges",edges)):
        out=io.StringIO()
        writer=csv.DictWriter(out,fieldnames=list(rows[0]) if rows else [])
        writer.writeheader(); writer.writerows(rows)
        (home/f"{name}.csv").write_text(out.getvalue())
    ns="http://graphml.graphdrawing.org/xmlns"
    ET.register_namespace("",ns)
    root=ET.Element(f"{{{ns}}}graphml")
    for key in ("title","kind","predicate","review_status","claim_id"):
        ET.SubElement(root,f"{{{ns}}}key",{"id":key,"for":"all","attr.name":key,"attr.type":"string"})
    graph=ET.SubElement(root,f"{{{ns}}}graph",{"id":"landscape","edgedefault":"directed"})
    for n in nodes:
        el=ET.SubElement(graph,f"{{{ns}}}node",{"id":n["id"]})
        for k in ("title","kind","review_status"):
            ET.SubElement(el,f"{{{ns}}}data",{"key":k}).text=n[k]
    for i,e in enumerate(edges):
        el=ET.SubElement(graph,f"{{{ns}}}edge",{"id":f"edge-{i}","source":e["subject"],"target":e["object"]})
        for k in ("predicate","review_status","claim_id"):
            ET.SubElement(el,f"{{{ns}}}data",{"key":k}).text=e[k]
    ET.ElementTree(root).write(home/"landscape.graphml",encoding="utf-8",xml_declaration=True)
    mind=["mindmap","  root((AI safety))"]
    for area in [e for e in entities if e["kind"]=="area"]:
        mind.append("    "+area["title"])
        mind.extend("      "+sub["title"] for sub in entities if sub["parent_id"]==area["id"])
    if bank["ideas"]:
        mind.append("    Research brainstorming proposals")
        mind.extend("      " + idea["title"] for idea in bank["ideas"])
    (home/"mind-map.mmd").write_text("\n".join(mind)+"\n")
    total=len(sources)
    retrieved=sum(s["retrieval_status"]=="retrieved" for s in sources)
    verified=sum(c["review_status"]=="verified" for c in claims)
    lines=["# AI safety landscape coverage", "", "Generated from the persistent database. Do not edit this report directly.","",
           f"Areas: {len(coverage)}. Subtopics: {sum(e['kind']=='topic' for e in entities)}. Source records: {total}.",
           f"Retrieved source pages: {retrieved}. Verified research claims: {verified}.","",
           "[INTERPRETATION] The mind map and topic connections are editorial navigation choices.",
           "Search matches are unreviewed discovery links. They do not establish a research claim.","",
           "| Area | Planned | Nonempty | Empty | Failed | Unique sources | Retrieved |",
           "|---|---:|---:|---:|---:|---:|---:|"]
    lines.extend(f"| {r['title']} | {r['planned']} | {r['complete']} | {r['empty']} | {r['failed']} | {r['sources']} | {r['retrieved']} |" for r in coverage)
    if "billing" in data:
        lines += ["","## Billing observations","",
                  "Standalone collection used billed endpoints and is now stopped. The owner authorized USD 1.00 total.",
                  "Account-balance changes are observations, not per-request invoices.","",
                  "```json",json.dumps(data["billing"],indent=2),"```"]
    if "native_validation" in data:
        lines += ["","## Native server-side search validation","",
                  "The separate Flash Messages test returned a server-side web search.",
                  "The response records model-token usage but does not expose a separate search fee.",
                  "The promotion and subscription-token inclusion must not be conflated.","",
                  "```json",json.dumps(data["native_validation"],indent=2),"```"]
    lines += ["","## Limits and next collection steps","",
              "- Completed searches measure execution of the plan, not completeness of the field.",
              "- The first queries use English. Language coverage remains a known gap.",
              "- Search ranking can concentrate attention on popular domains and recent resources.",
              "- A source can appear in several areas. Area counts must not be added as independent evidence.",
              "- A fetched abstract page is not full-text review. Retrieval is not substantive verification.",
              "- Disagreements and experiment options require reviewed passages, not summary aggregation.",
              "- Next: expand subtopic-specific searches, follow references, and assess source diversity.",
              "- Next: verify bibliographic metadata before promoting new works into the literature index.","",
              "## Source concentration","","| Host | Source records |","|---|---:|"]
    lines.extend(f"| {r[0]} | {r[1]} |" for r in store.db.execute("SELECT host,COUNT(*) FROM sources GROUP BY host ORDER BY COUNT(*) DESC,host LIMIT 20"))
    (home/"coverage.md").write_text("\n".join(lines)+"\n")
    # Escape '<' so a retrieved title cannot terminate the embedded JSON script.
    payload=json.dumps(data,ensure_ascii=False).replace("<","\\u003c").replace("\u2028","\\u2028").replace("\u2029","\\u2029")
    (home/"explore.html").write_text(HTML.replace("__DATA__",payload))


HTML=r'''<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>AI safety research landscape</title>
<style>
:root{font-family:system-ui,sans-serif;color:#20312d;background:#f5f4ee;--green:#176750;--line:#d1d9d0}*{box-sizing:border-box}body{margin:0}header{padding:28px 4vw;background:#123c32;color:#f7f8ed}h1{font-size:clamp(24px,4vw,40px);margin:5px 0}p{line-height:1.6}header p{max-width:850px;color:#d6e6dc}.eyebrow{font-size:12px;letter-spacing:2px;text-transform:uppercase}main{padding:24px 4vw;max-width:1600px;margin:auto}.stats{display:flex;gap:14px;flex-wrap:wrap;margin:0 0 22px}.stat{background:white;border:1px solid var(--line);padding:12px 20px;border-radius:10px}.stat strong{font-size:24px;display:block}nav{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}button,input,select{font:inherit;border:1px solid #b1c6b6;border-radius:7px;padding:9px 13px;background:white;color:inherit}button{cursor:pointer}button.active{background:var(--green);color:white}input{min-width:200px;flex:1}a{color:#176750}section{display:none}section.active{display:block}.notice{padding:12px 15px;background:#e8eee3;border-radius:7px;font-size:14px}.layout{display:grid;grid-template-columns:minmax(0,2fr) minmax(280px,1fr);gap:20px}.panel,.card{background:white;border:1px solid var(--line);border-radius:10px;padding:18px}.card{margin:10px 0}.card h3{margin:0 0 8px;font-size:17px}.muted{color:#53655e;font-size:13px}.badge{font-size:11px;padding:3px 7px;border-radius:9px;background:#edf0e7;display:inline-block;margin-right:6px}.toolbar{display:flex;gap:10px;flex-wrap:wrap;margin:15px 0}.tree details{border-left:2px solid #d1dccc;margin:10px 0 10px 14px;padding:3px 0 3px 15px}.tree summary{cursor:pointer;font-weight:600}.tree .leaf{padding:9px 0}.tree p{margin:6px 0;font-size:14px}svg{width:100%;height:auto;min-height:420px}svg text{font-size:11px;fill:#20312d}svg .node{cursor:pointer}svg .node:hover circle{stroke:#aa6d13;stroke-width:4}.scroll{overflow:auto}table{width:100%;border-collapse:collapse;font-size:14px}th,td{text-align:left;padding:11px 8px;border-bottom:1px solid var(--line)}th{background:#edf1e7}pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px}blockquote{border-left:3px solid #a8c3b0;padding-left:12px;margin-left:0}#detail h2{font-size:21px}#results a{overflow-wrap:anywhere}footer{padding:30px 4vw;color:#607268;font-size:12px}@media(max-width:850px){.layout{grid-template-columns:1fr}header{padding:24px}main{padding:20px}svg{min-height:300px}}
</style>
<header><div class="eyebrow">Persistent research foundation · editorial map</div><h1>AI safety research landscape</h1><p>Explore research areas, inspect discovery records, and trace candidate claims to preserved source passages. Coverage and review status remain visible.</p></header>
<main><div id="stats" class="stats"></div><nav aria-label="Views"><button data-view="map" class="active">Mind map</button><button data-view="graph">Knowledge graph</button><button data-view="brainstorming">Brainstorming</button><button data-view="sources">Source records</button><button data-view="coverage">Coverage ledger</button><button data-view="claims">Claims and evidence</button></nav>
<p class="notice">Topic relationships are editorial interpretations. Search matches and generated summaries are discovery material. Retrieved pages still require substantive review.</p>
<section id="map" class="active"><div id="tree" class="tree panel"></div></section>
<section id="graph"><div class="toolbar"><button id="reset-graph">All areas</button><span class="muted">Select an area to explore its subtopics and up to 12 discovered resources.</span></div><div class="layout"><div class="panel"><svg id="network" viewBox="0 0 900 700" role="img" aria-label="Research relationship graph"></svg><p class="muted">Solid lines: navigation. Dashed lines: editorial connections or unreviewed search matches.</p></div><div id="detail" class="panel"></div></div></section>
<section id="sources"><div class="toolbar"><input id="search" type="search" placeholder="Search titles and discovery summaries" aria-label="Search source records"><select id="area-filter" aria-label="Filter area"><option value="">All areas</option></select><select id="status-filter" aria-label="Filter retrieval status"><option value="">All retrieval states</option><option>discovered</option><option>retrieved</option><option>failed</option></select></div><p id="result-count" class="muted"></p><div id="results"></div></section>
<section id="brainstorming"><h2>Research brainstorming</h2><p>Explore proposed connections between epistemology, ontology, game theory, and industry mechanisms. Each idea includes a concrete experiment and a reason to stop or redesign it.</p><p class="notice">These are speculative research proposals. The connections are editorial. Prior work is listed to support comparison, not to establish novelty.</p><p><a href="brainstorming/README.md">Read the concept guide</a> · <a href="brainstorming/ideas.md">Read all idea cards</a></p><div class="toolbar"><input id="idea-search" type="search" placeholder="Search questions, mechanisms, or experiments" aria-label="Search brainstorming"><select id="idea-lens" aria-label="Filter conceptual lens"><option value="">All lenses</option></select></div><p id="idea-count" class="muted"></p><div id="idea-list"></div></section>
<section id="coverage"><p>Counts show execution of the collection plan. They do not measure scientific completeness.</p><div id="coverage-table" class="panel scroll"></div><h2>Search ledger</h2><div id="query-list"></div></section>
<section id="claims"><p>Exact source passages and editorial interpretations are kept separate. A passage match alone does not establish that an interpretation is correct.</p><div id="claim-list"></div></section></main>
<footer>Generated locally from SQLite. This artifact requires no server, external scripts, or analytics. Preserve the database exports and retrieval snapshots for reproducibility.</footer>
<script id="records" type="application/json">__DATA__</script>
<script>
const D=JSON.parse(document.getElementById('records').textContent), $=id=>document.getElementById(id), E=(tag,text,cls)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el}, areas=D.entities.filter(e=>e.kind==='area'), ideas=(D.brainstorming?.ideas||[]).map(i=>({...i,kind:'idea',description:i.question,review_status:'speculation'})), byId=new Map([...D.entities,...D.sources,...ideas].map(e=>[e.id,e]));
function view(id){document.querySelectorAll('section').forEach(e=>e.classList.toggle('active',e.id===id));document.querySelectorAll('nav button').forEach(e=>e.classList.toggle('active',e.dataset.view===id))}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>view(b.dataset.view));
const counts=[['Research areas',areas.length],['Subtopics',D.entities.filter(e=>e.kind==='topic').length],['Source records',D.sources.length],['Pages retrieved',D.sources.filter(s=>s.retrieval_status==='retrieved').length],['Verified claims',D.claims.filter(c=>c.review_status==='verified').length]];
counts.push(['Brainstorm proposals',ideas.length]);
counts.forEach(([label,n])=>{const el=E('div',undefined,'stat');el.append(E('strong',n),E('span',label));$('stats').append(el)});
if(D.policy){const el=E('div',undefined,'stat');el.append(E('strong','US$'+D.policy.authorized_total_usd),E('span','Authorized total collection budget'));$('stats').append(el)}
if(D.billing&&!D.billing.zero_observed_balance_change){const note=E('p','Standalone collection is stopped after observed charges. Native server-side search was tested separately. Model-token billing and search fees are distinct.','notice');document.querySelector('main').prepend(note)}
function topicIds(id){return new Set([id,...D.entities.filter(e=>e.parent_id===id).map(e=>e.id)])}
function areaSources(id){const ids=topicIds(id),set=new Set(D.assignments.filter(a=>ids.has(a.topic_id)).map(a=>a.source_id));return D.sources.filter(s=>set.has(s.id)).sort((a,b)=>(b.retrieval_status==='retrieved')-(a.retrieval_status==='retrieved'))}
function sourceCard(s){const el=E('article',undefined,'card'),a=E('a',s.title);a.href=s.canonical_url;a.target='_blank';a.rel='noopener noreferrer';const h=E('h3');h.append(a);el.append(h);[s.kind,s.retrieval_status,'metadata: '+s.metadata_status].forEach(t=>el.append(E('span',t,'badge')));el.append(E('p',s.canonical_url,'muted'));if(s.discovery_summary)el.append(E('p','Discovery summary (unverified): '+s.discovery_summary));el.append(E('p','Record: '+s.id,'muted'));if(s.current_snapshot_id){const snap=D.snapshots.find(r=>r.id===s.current_snapshot_id);if(snap)el.append(E('p','Preserved snapshot: '+snap.relative_path+' · '+snap.content_basis,'muted'))}return el}
for(const a of areas){const det=E('details'),sum=E('summary',a.title+' · '+areaSources(a.id).length+' sources');det.append(sum,E('p',a.description));const opt=E('option',a.title);opt.value=a.id;$('area-filter').append(opt);for(const t of D.entities.filter(t=>t.parent_id===a.id)){const leaf=E('div',undefined,'leaf');leaf.append(E('strong',t.title),E('p',t.description));const explore=E('button','Explore subtopic · '+areaSources(t.id).length+' sources');explore.onclick=()=>{view('graph');draw(t.id)};leaf.append(explore);det.append(leaf);const option=E('option','↳ '+t.title);option.value=t.id;$('area-filter').append(option)}const b=E('button','Explore area');b.onclick=()=>{view('graph');draw(a.id)};det.append(b);$('tree').append(det)}
function results(){const q=$('search').value.toLowerCase(),area=$('area-filter').value,status=$('status-filter').value;let rows=area?areaSources(area):D.sources;rows=rows.filter(s=>(!status||s.retrieval_status===status)&&(!q||(s.title+' '+s.discovery_summary+' '+s.canonical_url).toLowerCase().includes(q)));$('result-count').textContent=rows.length+' matching records; displaying up to 100.';$('results').replaceChildren(...rows.slice(0,100).map(sourceCard))}
['search','area-filter','status-filter'].forEach(id=>$(id).addEventListener(id==='search'?'input':'change',results));results();
for(const lens of [...new Set(ideas.map(i=>i.lens))].sort()){const option=E('option',lens);option.value=lens;$('idea-lens').append(option)}
function ideaCard(idea){const el=E('article',undefined,'card');el.id='idea-'+idea.id;el.append(E('h3',idea.id+' · '+idea.title));for(const label of ['SPECULATION',idea.lens,idea.industry,idea.scope])el.append(E('span',label,'badge'));el.append(E('p',idea.question));const details=E('details');details.append(E('summary','Concept, experiment, and limits'));for(const [key,label] of [['foundation','Conceptual basis'],['mechanism','Mechanism'],['analogy_limit','Limit of the industry connection'],['safety_path','Safety relevance'],['experiment','Experiment'],['metrics','Measures'],['kill_criterion','Reason to stop or redesign'],['delta','Comparison with prior work'],['next_step','First check']]){const p=E('p');p.append(E('strong',label+': '),document.createTextNode(idea[key]));details.append(p)}details.append(E('p','Prior work: '+idea.prior_work.join(', '),'muted'));el.append(details);const links=E('div',undefined,'toolbar'),graph=E('button','Explore connections');graph.onclick=()=>{view('graph');draw(idea.id)};links.append(graph);for(const id of idea.topics){const topic=byId.get(id),b=E('button',topic.title);b.onclick=()=>{view('graph');draw(id)};links.append(b)}el.append(links);return el}
function ideaResults(){const q=$('idea-search').value.toLowerCase(),lens=$('idea-lens').value,rows=ideas.filter(i=>(!lens||i.lens===lens)&&(!q||JSON.stringify(i).toLowerCase().includes(q)));$('idea-count').textContent=rows.length+' proposed ideas';$('idea-list').replaceChildren(...rows.map(ideaCard))}
$('idea-search').addEventListener('input',ideaResults);$('idea-lens').addEventListener('change',ideaResults);ideaResults();
if(ideas.length){const b=E('button','Explore research brainstorming · '+ideas.length+' proposals');b.onclick=()=>view('brainstorming');$('tree').prepend(b)}
const table=E('table'),head=E('tr');['Area','Planned','Nonempty','Empty','Failed','Sources','Retrieved'].forEach(t=>head.append(E('th',t)));table.append(head);for(const r of D.coverage){const tr=E('tr');['title','planned','complete','empty','failed','sources','retrieved'].forEach(k=>tr.append(E('td',r[k])));table.append(tr)}$('coverage-table').append(table);
for(const a of areas){const det=E('details'),sum=E('summary',a.title),ids=topicIds(a.id);det.append(sum);for(const q of D.queries.filter(q=>ids.has(q.topic_id))){const el=E('div',undefined,'card');el.append(E('strong',q.facet+' · '+q.status),E('p',q.query));if(q.error)el.append(E('p',q.error));det.append(el)}$('query-list').append(det)}
if(!D.claims.length)$('claim-list').append(E('div','No candidate claims have been extracted. This prevents discovery summaries from appearing as verified findings.','panel'));
for(const c of D.claims){const el=E('article',undefined,'card');el.append(E('span',c.statement_kind+' · '+c.review_status,'badge'),E('h3',c.text),E('blockquote',c.excerpt),E('p','Source '+c.source_id+' · Snapshot '+c.snapshot_id+' · Character '+c.char_start,'muted'));if(c.reviewed_by)el.append(E('p','Reviewed by '+c.reviewed_by+' at '+c.reviewed_at));$('claim-list').append(el)}
function svgEl(tag,attrs={}){const el=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));return el}
function draw(selected){const svg=$('network');svg.replaceChildren();let center=selected?byId.get(selected):byId.get('ai-safety'), children=center.kind==='idea'?[...center.topics,...center.related].map(id=>byId.get(id)):selected?[...D.entities.filter(e=>e.parent_id===selected),...areaSources(selected).slice(0,12),...ideas.filter(i=>i.topics.includes(selected))]:areas;const positions=new Map([[center.id,[450,350]]]);children.forEach((n,i)=>{const theta=2*Math.PI*i/children.length-Math.PI/2;positions.set(n.id,[450+310*Math.cos(theta),350+275*Math.sin(theta)])});
function line(a,b,dash){if(!positions.has(a)||!positions.has(b))return;const p=positions.get(a),q=positions.get(b);svg.append(svgEl('line',{x1:p[0],y1:p[1],x2:q[0],y2:q[1],stroke:dash?'#a7b2a7':'#c2d3c2','stroke-dasharray':dash?'5 5':'none'}))}
children.forEach(n=>line(center.id,n.id,!!n.canonical_url||n.kind==='idea'||center.kind==='idea'));if(!selected)D.relations.forEach(r=>line(r.subject_id,r.object_id,true));
for(const n of [center,...children]){const [x,y]=positions.get(n.id),g=svgEl('g',{class:'node',role:'button',tabindex:'0','aria-label':n.title});const circle=svgEl('circle',{cx:x,cy:y,r:n===center?35:18,fill:n.kind==='idea'?'#b67b40':n.canonical_url?'#ccaa61':n.kind==='topic'?'#86b59d':'#176750',stroke:'#fff','stroke-width':2});g.append(circle);const title=svgEl('title');title.textContent=n.title;g.append(title);const text=svgEl('text',{x,y:y+(n===center?53:34),'text-anchor':'middle'});const words=n.title.split(' ');let row='',dy=0;for(const word of words){if((row+' '+word).length>27&&row){const t=svgEl('tspan',{x,dy:dy?14:0});t.textContent=row;text.append(t);row=word;dy++}else row+=(row?' ':'')+word}const last=svgEl('tspan',{x,dy:dy?14:0});last.textContent=row;text.append(last);g.append(text);const action=()=>{if(n.kind==='area'||n.kind==='topic'||n.kind==='idea')draw(n.id);else if(n.canonical_url){$('detail').replaceChildren(sourceCard(n))}else{$('detail').replaceChildren(E('h2',n.title),E('p',n.description),E('p','Editorial navigation node.','muted'))}};g.onclick=action;g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();action()}};svg.append(g)}
$('detail').replaceChildren(E('h2',center.title),E('p',center.description),E('p',selected?'Showing subtopics and selected unreviewed discovery records.':'Select an area. Dashed cross-area connections are editorial interpretations.','muted'));if(center.kind==='idea'){$('detail').replaceChildren(ideaCard(center))}else if(selected){const b=E('button','Browse all area sources');b.onclick=()=>{$('area-filter').value=selected;results();view('sources')};$('detail').append(b);for(const r of D.relations.filter(r=>r.subject_id===selected||r.object_id===selected))$('detail').append(E('p',r.rationale,'muted'))}}
$('reset-graph').onclick=()=>draw();draw();
function hashView(){const id=location.hash.slice(1);if(['map','graph','brainstorming','sources','coverage','claims'].includes(id))view(id)}
window.addEventListener('hashchange',hashView);hashView();
</script></html>'''
