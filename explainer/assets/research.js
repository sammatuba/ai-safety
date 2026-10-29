/* Interactive study companion. Exercises are deterministic teaching examples. */
(function () {
  "use strict";
  const D = window.STUDY_DATA;
  const pages = D.pages;
  const terms = window.GLOSSARY_DATA.terms;
  const $ = id => document.getElementById(id);
  const esc = value => String(value == null ? "" : value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  let saved;
  try { saved = JSON.parse(localStorage.getItem("evidence-study") || "{}"); } catch (_) { saved = {}; }
  const state = { completed: saved.completed || [], notes: saved.notes || {}, theme: saved.theme || "light" };
  let current;
  let toastTimer;

  function save() {
    try { localStorage.setItem("evidence-study", JSON.stringify(state)); return true; }
    catch (_) { return false; }
  }
  function announce(text) {
    $("announcement").textContent = text;
    $("announcement").classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $("announcement").classList.remove("visible"), 3500);
  }
  function theme(value) {
    state.theme = value;
    document.documentElement.dataset.theme = value;
    $("theme").textContent = value === "light" ? "Dark" : "Light";
    $("theme").setAttribute("aria-label", "Switch to " + (value === "light" ? "dark" : "light") + " theme");
    save();
  }
  function nav() {
    $("chapter-nav").innerHTML = pages.map(p => '<a class="chapter-link ' + (current.id === p.id ? "active" : "") + '" href="#/' + p.id + '"' + (current.id === p.id ? ' aria-current="page"' : '') + '><span class="chapter-number">' + (state.completed.includes(p.id) ? "✓" : String(p.number).padStart(2,"0")) + '</span><span>' + esc(p.title) + '</span></a>').join("");
    $("progress").value = state.completed.length;
    $("progress-text").textContent = state.completed.length + " of " + pages.length;
  }
  function term(name) {
    const entry = terms.find(t => t.term.toLowerCase() === name.toLowerCase());
    $("term-title").textContent = entry ? entry.term : name;
    $("term-definition").innerHTML = entry ? '<p>' + esc(entry.definition) + '</p><p class="small">Controlled vocabulary · ' + esc(entry.section) + '</p><a href="index.html#/glossary">Explore the full glossary</a>' : '<p>Read the canonical glossary for this term.</p>';
    $("term-dialog").showModal();
  }
  function render() {
    const id = location.hash.replace(/^#\/?/, "").split("?")[0] || "start";
    current = pages.find(p => p.id === id) || pages[0];
    document.title = current.title + " · Evidence & Permission";
    nav();
    const index = pages.indexOf(current);
    const relevant = {start:["diagnosis","repair","authority transition"],expenses:["claim","ground truth","repair"],claims:["ontology","typed claim","semantic promotion (ours)"],evidence:["epistemology","underdetermination","Rashomon set","evidence independence"],investigation:["intervention","threat modeling","repair"],coordination:["focal point","coordination","collusion"],risk:["catastrophic AI risk","trusted monitor","false assurance (ours)"],proposal:["construct validity","operationalization","diagnosis"]}[current.id];
    $("study-main").innerHTML = '<div class="chapter-top"><p class="eyebrow">Chapter ' + String(current.number).padStart(2,"0") + ' / ' + pages.length + '</p><h1>' + esc(current.title) + '</h1><p class="chapter-summary">' + esc(current.summary) + '</p><div class="chapter-tools">' + (current.lab ? '<button data-jump="exercise">Try the exercise</button>' : '') + '<button data-jump="self-check">Check your understanding</button><button data-jump="reflection">Keep a note</button></div><div class="term-list">' + relevant.map(t => '<button data-term="' + esc(t) + '">' + esc(t.replace(" (ours)","")) + '</button>').join("") + '</div></div><article class="reading">' + current.html + '</article>' + (current.lab ? '<section id="exercise" class="study-panel"></section>' : '') + '<section id="self-check" class="study-panel"><p class="eyebrow">Pause and explain</p><h2>Check your understanding</h2><p>' + esc(current.quiz.prompt) + '</p><div class="question-options">' + current.quiz.options.map((o,i) => '<button data-answer="' + i + '">' + esc(o) + '</button>').join("") + '</div><div id="quiz-feedback" class="feedback" role="status"></div></section><section id="reflection" class="study-panel notes-panel"><p class="eyebrow">Your own explanation</p><h2>What would you say without the guide?</h2><p class="small">Write a familiar example, a remaining question, or a reason the proposed method could fail.</p><label class="small" for="chapter-notes">Notes for this chapter</label><textarea class="notes" id="chapter-notes" placeholder="Explain the idea in your own words…">' + esc(state.notes[current.id] || "") + '</textarea><p id="notes-status" class="small" role="status">Notes stay in this browser when local storage is available.</p><button id="export-notes">Download all my notes</button></section><footer class="chapter-footer"><button id="mark-read" class="primary">' + (state.completed.includes(current.id) ? "Mark as unread" : "Mark this chapter as read") + '</button><div class="next-prev">' + (index ? '<a class="button" href="#/' + pages[index-1].id + '">← ' + esc(pages[index-1].title) + '</a>' : '<span></span>') + (index < pages.length-1 ? '<a class="button" href="#/' + pages[index+1].id + '">' + esc(pages[index+1].title) + ' →</a>' : '<a class="button" href="../literature/landscape/explore.html#brainstorming">Explore the idea bank →</a>') + '</div><p class="source-links">Canonical reading: ' + current.sources.map(s => '<a href="' + esc(s) + '">' + esc(s.split("/").pop()) + '</a>').join(" · ") + '</p><p class="small">Constructed exercises explain mechanisms. They do not report model performance or estimate catastrophic risk.</p></footer>';
    document.querySelectorAll("[data-jump]").forEach(b => b.onclick = () => $(b.dataset.jump).scrollIntoView({behavior:"auto",block:"start"}));
    document.querySelectorAll("[data-term]").forEach(b => b.onclick = () => term(b.dataset.term));
    document.querySelectorAll("[data-answer]").forEach(b => b.onclick = () => {
      document.querySelectorAll("[data-answer]").forEach(x => x.classList.toggle("selected",x===b));
      const correct = Number(b.dataset.answer) === current.quiz.answer;
      $("quiz-feedback").textContent = (correct ? "Correct. " : "Reconsider the evidence. ") + current.quiz.explanation;
    });
    $("chapter-notes").oninput = e => {
      state.notes[current.id] = e.target.value;
      $("notes-status").textContent = save() ? "Saved in this browser." : "Browser storage is unavailable. Download your notes to keep them.";
    };
    $("export-notes").onclick = () => download("my-research-notes.txt",pages.map(p => p.title + "\n\n" + (state.notes[p.id] || "No note yet.")).join("\n\n---\n\n"));
    $("mark-read").onclick = () => {
      state.completed = state.completed.includes(current.id) ? state.completed.filter(id => id!==current.id) : [...state.completed,current.id];
      save(); nav(); $("mark-read").textContent = state.completed.includes(current.id) ? "Mark as unread" : "Mark this chapter as read";
    };
    if (current.lab === "start") intro();
    if (current.lab === "expenses") expenses();
    if (current.lab === "investigation") investigation();
    if (current.lab === "coordination") coordination();
    if (current.lab === "risk") risk();
    if (current.lab === "form") form();
    $("study-sidebar").classList.remove("open");
    $("mobile-nav").setAttribute("aria-expanded","false");
    window.scrollTo(0,0);
    $("study-main").focus({preventScroll:true});
  }
  function intro() {
    $("exercise").innerHTML = '<p class="eyebrow">Read at your own pace</p><h2>Choose a place to begin</h2><p>Start with the expense example, then inspect the investigation exercise. Return to the sources when you want the assumptions and prior work.</p><div class="home-path">' + pages.slice(1).map(p => '<a href="#/' + p.id + '"><strong>' + p.number + '. ' + esc(p.title) + '</strong><span>' + esc(p.summary) + '</span></a>').join("") + '</div>';
  }
  function expenses() {
    $("exercise").innerHTML = '<p class="eyebrow">Constructed example</p><h2>One summary, three possible failures</h2><p>Change the expense and the failing stage. Compare the real total with the summary. No model is running.</p><div class="control-grid"><label class="field">Rent in pesos<input id="rent" type="number" min="0" max="100000" step="100" value="3000"></label><label class="field">Workflow condition<select id="expense-condition"><option value="import">Import omits rent</option><option value="report">Report omits rent</option><option value="formula">Formula excludes rent</option><option value="clean">Complete, correct workflow</option></select></label></div><div id="expense-output" aria-live="polite"></div>';
    const update = () => {
      const rent = Math.max(0,Math.min(100000,Number($("rent").value)||0));
      const fault = $("expense-condition").value;
      const actual = 2000 + rent;
      const reported = fault === "clean" ? actual : 2000;
      const descriptions = {import:"The imported rows contain food and transport. The rent record never reached the calculation.",report:"The underlying rows contain rent. The summary selects only food and transport.",formula:"All rows are available. The formula adds only the first two rows.",clean:"All rows reach the calculation and report."};
      $("expense-output").innerHTML = '<div class="metric-row"><div class="metric"><span>Actual expenses</span><strong>₱' + actual.toLocaleString() + '</strong></div><div class="metric"><span>Reported expenses</span><strong>₱' + reported.toLocaleString() + '</strong></div></div><p>' + descriptions[fault] + '</p><p class="notice">The correct calculation is 1,000 + 1,000 + ' + rent.toLocaleString() + ' = ' + actual.toLocaleString() + ' pesos. ' + (actual>4000 ? 'That exceeds the 4,000-peso budget.' : 'That is within the 4,000-peso budget.') + '</p><p class="small">If rent is zero, the totals can agree despite a broken workflow. A correct-looking result alone does not establish a correct process.</p>';
    };
    $("rent").oninput=update; $("expense-condition").onchange=update; update();
  }
  function investigation() {
    const cases = ["report","runner","clean","scoring"];
    let caseIndex=0, opened=new Set(), remaining=3;
    $("exercise").innerHTML = '<p class="eyebrow">Deterministic investigation exercise</p><h2>Find the failure, then test a repair</h2><p>Each case begins with the same report: “All required checks passed.” The required checks are A, B, and C. Records are protected from the agent in this exercise.</p><div class="notice warn">You have three evidence requests. Each request costs one teaching token. These costs are illustrative, not prices or measured computation.</div><div class="actions"><button id="new-case">Next case</button><button id="reset-case">Reset this case</button><span id="case-label" class="small"></span></div><div id="evidence-tools" class="actions"></div><div id="observations" aria-live="polite"></div><div class="control-grid"><label class="field">Your diagnosis<select id="diagnosis"><option value="unknown">Cause unresolved</option><option value="runner">Runner omitted a check</option><option value="report">Report omitted a result</option><option value="scoring">Scoring code is wrong</option><option value="clean">No defect found</option></select></label><label class="field">Repair to test<select id="repair"><option value="none">No change</option><option value="runner">Run every required check</option><option value="report">Include every recorded result</option><option value="scoring">Correct the scoring rule</option></select></label></div><div class="actions"><button id="test-repair" class="primary">Execute repair and inspect result</button><button id="choose-approve">Approve now</button><button id="choose-defer">Defer now</button></div><div id="investigation-feedback" class="feedback" role="status"></div><div id="repair-result" aria-live="polite"></div>';
    const labels={execution:"Inspect execution record",outcomes:"Inspect raw outcomes",scoring:"Inspect recorded scores",selection:"Inspect report selection"};
    function facts() {
      const fault=cases[caseIndex];
      return {fault, executed:fault==="runner"?["A","B"]:["A","B","C"],raw:fault==="clean"?"A pass; B pass; C pass.":fault==="runner"?"A pass; B pass. No observation for C.":"A pass; B pass; C fail.",scores:fault==="scoring"||fault==="clean"?"A pass; B pass; C pass.":fault==="runner"?"A pass; B pass. No score for C.":"A pass; B pass; C fail.",selection:fault==="report"?"The report includes A and B. It excludes the recorded result for C.":fault==="runner"?"The report includes A and B. No result for C exists.":"The report includes every recorded score: A, B, and C."};
    }
    function refresh() {
      $("case-label").textContent="Case "+String.fromCharCode(65+caseIndex)+" · "+remaining+" requests left";
      $("evidence-tools").innerHTML=Object.keys(labels).map(key=>'<button data-evidence="'+key+'" '+(opened.has(key)||remaining===0?'disabled':'')+'>'+labels[key]+(opened.has(key)?' · opened':'')+'</button>').join("");
      document.querySelectorAll("[data-evidence]").forEach(b=>b.onclick=()=>{
        const key=b.dataset.evidence;
        if(opened.has(key)||remaining===0)return;
        opened.add(key);remaining--;
        const f=facts();
        const text=key==="execution"?"Completed checks: "+f.executed.join(", ")+".":key==="outcomes"?f.raw:key==="scoring"?f.scores:f.selection;
        const row=document.createElement("div");row.className="observation";
        const strong=document.createElement("strong");strong.textContent=labels[key];row.append(strong,document.createTextNode(text));$("observations").append(row);refresh();
      });
    }
    function reset() {opened=new Set();remaining=3;$("observations").replaceChildren();$("investigation-feedback").textContent="";$("repair-result").replaceChildren();$("diagnosis").value="unknown";$("repair").value="none";refresh();}
    $("new-case").onclick=()=>{caseIndex=(caseIndex+1)%cases.length;reset();};$("reset-case").onclick=reset;
    $("test-repair").onclick=()=>{
      const f=facts(),repair=$("repair").value,diagnosis=$("diagnosis").value;
      const complete=f.fault!=="runner"||repair==="runner";
      const scoringCorrect=f.fault!=="scoring"||repair==="scoring";
      const reportComplete=f.fault!=="report"||repair==="report";
      const restored=complete&&scoringCorrect&&reportComplete;
      const modelPass=f.fault==="clean";
      const causeText={report:"The report omitted a recorded failure.",runner:"The runner omitted required check C.",scoring:"The scoring code incorrectly marked C as a pass.",clean:"The evaluation contains no planted defect."}[f.fault];
      $("investigation-feedback").textContent=(diagnosis==="unknown"?"You retained uncertainty. ":diagnosis===f.fault?"Your selected diagnosis matches this constructed case. ":"Your selected diagnosis does not match this constructed case. ")+"The repair result below is a separate check.";
      $("repair-result").innerHTML='<h3>Executed result in the teaching model</h3><p class="notice '+(restored?'':'bad')+'">Evaluation requirements restored: <strong>'+(restored?'Yes':'No')+'</strong>.</p><p>Required checks complete: '+(complete?'yes':'no')+'. Scores correct: '+(scoringCorrect?'yes':'no')+'. Report complete: '+(reportComplete?'yes':'no')+'.</p><p class="notice '+(modelPass?'':'warn')+'">Model meets the stated test criterion: <strong>'+(modelPass?'Yes':'No')+'</strong>.</p><p>'+causeText+'</p><p class="small">This inspection reveals the constructed case. A repaired evaluation can correctly withhold approval of the unchanged model. No AI system ran.</p>';
    };
    $("choose-approve").onclick=()=>{
      const f=facts();
      const sufficient=opened.has("execution")&&opened.has("outcomes")&&opened.has("scoring");
      $("investigation-feedback").textContent=!sufficient?"The opened evidence does not yet establish complete, correctly scored results. A correct guess would differ from a supported approval.":f.fault!=="clean"?"This approval would violate the case's test criterion. A required observation is missing or C actually fails.":"The opened records support approval under this narrow criterion. This does not establish safety outside the three checks.";
    };
    $("choose-defer").onclick=()=>{
      const f=facts(),supported=opened.has("execution")&&opened.has("outcomes")&&opened.has("scoring");
      $("investigation-feedback").textContent=f.fault==="clean"&&supported?"The opened records support this narrow approval. Continued deferral would withhold useful work without an unmet test condition.":"Deferral is supported while a required condition fails or remains unchecked. You do not need to establish dishonest intent.";
    };
    reset();
  }
  function coordination() {
    $("exercise").innerHTML='<p class="eyebrow">Assumed teaching rule</p><h2>A shared cue is still information</h2><p>In this toy rule, a defective artifact passes if the policy and monitor select the same cue. The rule assumes compatibility; it does not show that real models discover it.</p><div class="control-grid"><label class="field">Policy chooses<select id="policy-cue"><option>A</option><option>B</option><option>C</option></select></label><label class="field">Monitor chooses<select id="monitor-cue"><option>A</option><option>B</option><option>C</option></select></label></div><label class="field"><span><input id="independent-check" type="checkbox"> Require an independent check of the artifact</span></label><div id="cue-result" aria-live="polite"></div><p class="small">Changing a cue here changes a teaching rule. It is not evidence that renaming code prevents real subversion. Prior work: <a href="https://arxiv.org/abs/2507.03010">Järviniemi</a>.</p>';
    const update=()=>{
      const match=$("policy-cue").value===$("monitor-cue").value,checked=$("independent-check").checked;
      $("cue-result").innerHTML='<p class="notice '+(match&&!checked?'bad':'')+'">'+(checked?'The independent check catches the assumed defect, even when the cues match.':match?'The cues match. Under this assumed rule, the defective artifact passes.':'The cues differ. This strategy pair does not produce a passing artifact.')+'</p><p>The carrier is the artifact the monitor reads. Blocking private chat leaves that carrier available.</p>';
    };$("policy-cue").onchange=update;$("monitor-cue").onchange=update;$("independent-check").onchange=update;update();
  }
  function risk() {
    const steps=[
      ["AI helps prepare an evaluation","Assumption: people delegate relevant evaluation work to AI agents. The project does not measure how widespread this practice will become."],
      ["Evidence is omitted or incorrectly scored","Direct target: construct a verifiable defect in a test runner, scoring rule, or report."],
      ["Reviewers endorse an unsupported conclusion","Direct target: measure whether a review protocol finds the defect and preserves useful approvals."],
      ["A human grants additional permission","Decision boundary: test the stated approval rule in the experiment. Real organizational decisions require separate evidence."],
      ["A capable system acts under that permission","Additional assumption: the deployed system has relevant capabilities and access. The small experiment does not establish this condition."],
      ["Other safeguards prove insufficient","Additional assumption: remaining technical and institutional protections do not prevent the harmful outcome."],
      ["Very large-scale harm becomes possible","Conditional consequence: no probability or inevitability follows from this diagram. Local oversight results address only some links."]
    ];
    $("exercise").innerHTML='<p class="eyebrow">Conditional threat model</p><h2>Which link does the experiment test?</h2><p>Select a step. Keep tested mechanisms separate from assumptions about future systems.</p><ol class="risk-steps">'+steps.map((s,i)=>'<li><button data-risk="'+i+'">'+esc(s[0])+'</button></li>').join("")+'</ol><div id="risk-detail" class="notice" role="status"></div>';
    document.querySelectorAll("[data-risk]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-risk]").forEach(x=>x.classList.toggle("selected",x===b));$("risk-detail").textContent=steps[Number(b.dataset.risk)][1];});
    document.querySelector('[data-risk="1"]').click();
  }
  async function copy(text) {
    try {await navigator.clipboard.writeText(text);announce("Copied to clipboard.");return; }catch(_){}
    const box=document.createElement("textarea");box.value=text;box.style.position="fixed";box.style.opacity="0";document.body.append(box);box.select();
    let ok=false;try{ok=document.execCommand("copy");}catch(_){}box.remove();announce(ok?"Copied to clipboard.":"Clipboard access is unavailable. Select and copy the visible answer.");
  }
  function download(name,text) {
    const url=URL.createObjectURL(new Blob([text],{type:"text/plain;charset=utf-8"}));
    const a=document.createElement("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function form() {
    $("exercise").innerHTML='<p class="eyebrow">Copy-ready drafts · you submit the form</p><h2>Three project ideas</h2><p>Choose an idea and copy its fields. Feasibility scores are suggestions for you to choose. Add your personal details in the actual form.</p><label class="field">Idea<select id="form-idea">'+D.form.ideas.map((idea,i)=>'<option value="'+i+'">'+(i+1)+'. '+esc(idea.title)+'</option>').join("")+'</select></label><div id="form-fields"></div><button id="download-answers">Download all three ideas</button><p class="small">The form allows one submission. This page does not submit or send anything.</p>';
    function update() {
      const idea=D.form.ideas[Number($("form-idea").value)];
      const fields=[["title","Project title"],["problem","PROBLEM"],["goal","GOAL"],["plan","PROJECT PLAN"]];
      $("form-fields").innerHTML=fields.map(([key,label])=>'<div class="form-field"><div class="form-field-head"><h3>'+label+'</h3><button data-copy-field="'+key+'">Copy '+label.toLowerCase()+'</button></div><p>'+esc(idea[key])+'</p></div>').join("")+'<p class="form-meta">Suggested feasibility: '+idea.feasibility+'/5.<br>Suggested area: '+esc(idea.area)+'.<br>Collaborator preference: choose your answer in the actual form.</p>';
      document.querySelectorAll("[data-copy-field]").forEach(b=>b.onclick=()=>copy(idea[b.dataset.copyField]));
    }
    $("form-idea").onchange=update;
    $("download-answers").onclick=()=>download("three-project-ideas.txt",D.form.ideas.map((idea,i)=>"IDEA "+(i+1)+"\n\n"+[["title","Project title"],["problem","PROBLEM"],["goal","GOAL"],["plan","PROJECT PLAN"]].map(([key,label])=>label+"\n"+idea[key]).join("\n\n")+"\n\nSuggested feasibility: "+idea.feasibility+"/5\nSuggested area: "+idea.area).join("\n\n====================\n\n"));
    update();
  }
  function search() {
    const q=$("study-search").value.trim().toLowerCase();
    const results=[];
    pages.filter(p=>!q||(p.title+" "+p.summary+" "+p.text).toLowerCase().includes(q)).forEach(p=>results.push({group:"Chapter",title:p.title,sub:p.summary,route:p.id}));
    if(q){terms.filter(t=>(t.term+" "+t.definition).toLowerCase().includes(q)).slice(0,8).forEach(t=>results.push({group:"Glossary",title:t.term,sub:t.definition,term:t.term}));D.ideas.filter(i=>JSON.stringify(i).toLowerCase().includes(q)).slice(0,6).forEach(i=>results.push({group:"Idea "+i.id,title:i.title,sub:i.question,url:"../literature/landscape/explore.html#brainstorming"}));}
    $("search-results").replaceChildren();
    results.slice(0,20).forEach(r=>{const el=document.createElement("div");el.className="search-item";const label=document.createElement("small");label.textContent=r.group;const b=document.createElement("button");b.textContent=r.title;b.onclick=()=>{$("search-dialog").close();if(r.term)term(r.term);else if(r.url)location.href=r.url;else location.hash="/"+r.route;};const p=document.createElement("p");p.textContent=r.sub;el.append(label,b,p);$("search-results").append(el);});
    if(!results.length)$("search-results").textContent="No matching chapter, term, or idea.";
  }
  function openSearch() {$("search-dialog").showModal();search();$("study-search").focus();}
  $("open-search").onclick=openSearch;$("study-search").oninput=search;
  document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>$(b.dataset.close).close());
  $("theme").onclick=()=>theme(state.theme==="light"?"dark":"light");
  $("mobile-nav").onclick=()=>{const open=$("study-sidebar").classList.toggle("open");$("mobile-nav").setAttribute("aria-expanded",String(open));};
  document.addEventListener("keydown",e=>{if(e.key==="/"&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!$("search-dialog").open&&!$("term-dialog").open){e.preventDefault();openSearch();}});
  window.addEventListener("hashchange",render);
  theme(state.theme);render();
})();
