/* Local reviewer navigation. Canonical explanations remain in Markdown. */
(() => {
  "use strict";
  const modules = [
    ["00", "Map the problem", "Name the explanations of agreement and a wrong decision.", "00-map"],
    ["01", "Evidence independence", "Derive updates for independent observations and copied reports.", "01-evidence-independence"],
    ["02", "Social learning", "Explain conformity and information cascades.", "02-social-learning"],
    ["03", "Strategic communication", "Explain selective disclosure and common incentives.", "03-strategic-communication"],
    ["04", "Collusion and plus factors", "Identify a coalition, coordination mechanism, and outside cost.", "04-collusion-and-plus-factors"],
    ["05", "AI control and oversight", "Draw the protocol, trust boundaries, and authority transition.", "05-ai-control-and-oversight"],
    ["06", "Ontology and typed claims", "Distinguish claim types, provenance, and truth.", "06-ontology-and-typed-claims"],
    ["07", "Measurement", "Compute rates and assess matched comparisons and uncertainty.", "07-measurement"],
    ["08", "Mechanistic detection", "Explain probes, confounds, and held-out tests.", "08-mechanistic-detection"]
  ];
  const library = [
    ["Complete reviewer", "Full explanations, study exercises, and research workflow", "../study/REVIEWER.md"],
    ["Foundations and demos", "Interactive foundations, conditions, quizzes, and glossary", "index.html"],
    ["Earlier study companion", "Investigation exercises and earlier project form answers", "research.html"],
    ["Research landscape map", "Discovery records, speculative ideas, coverage, and graph", "../literature/landscape/explore.html"],
    ["Literature index", "Verified bibliography, papers, and dossiers", "../literature/INDEX.md"],
    ["Current TARA project", "Latest proposal drafts and older form answers", "../projects/2026-11-tara-project/README.md"],
    ["Collusion sprint", "Completed project, report, design, and research artifacts", "../projects/2026-10-apart-collusion-sprint/README.md"],
    ["Laboratory", "Code, setup, notebooks, and tests", "../lab/README.md"],
    ["Glossary", "Controlled terms and definitions", "../GLOSSARY.md"],
    ["Repository index", "Directory map and task routing", "../INDEX.md"],
    ["Status and session history", "Current state, failures, limits, and next steps", "../STATUS.md"],
    ["Decision records", "Recorded decisions and alternatives", "../DECISIONS.md"],
    ["Historical roadmap", "Earlier plan, dates, and milestones; may lag the current portfolio", "../ROADMAP.md"],
    ["Research notes", "Study notes and active recall", "../study/notes/"],
    ["Source material", "Untrusted downloads and local backups; some are excluded from Git", "../sources/README.md"]
  ];
  const $ = id => document.getElementById(id);
  const key = "ai-safety-reviewer-v1";
  let state = {done: [], note: ""};
  let storageAvailable = true;
  try { const previous = JSON.parse(localStorage.getItem(key) || "{}"); if (Array.isArray(previous.done)) state.done = previous.done; if (typeof previous.note === "string") state.note = previous.note; } catch (_) { storageAvailable = false; }
  function save() { try { localStorage.setItem(key, JSON.stringify(state)); storageAvailable = true; } catch (_) { storageAvailable = false; } $("save-status").textContent = storageAvailable ? "Saved in this browser." : "Browser storage unavailable; download your notes."; }
  function element(tag, text, className) { const item = document.createElement(tag); if (text !== undefined) item.textContent = text; if (className) item.className = className; return item; }
  function link(text, href) { const item = element("a", text); item.href = href; return item; }
  function drawModules() {
    const query = $("filter").value.trim().toLowerCase();
    const shown = modules.filter(m => m.join(" ").toLowerCase().includes(query));
    $("modules").replaceChildren();
    $("count").textContent = state.done.length + " of " + modules.length + " modules marked reviewed · " + shown.length + " shown";
    for (const [id, title, prompt, slug] of shown) {
      const box = element("article", undefined, "module"), head = element("div", undefined, "module-head"), check = element("input"), label = element("label", id + " · " + title), description = element("p", prompt), links = element("div", undefined, "links");
      check.type = "checkbox"; check.id = "module-" + id; check.checked = state.done.includes(id); label.htmlFor = check.id;
      check.addEventListener("change", () => { state.done = check.checked ? [...new Set([...state.done, id])] : state.done.filter(x => x !== id); save(); drawModules(); $("module-" + id)?.focus(); });
      links.append(link("Read foundation", "../foundations/" + slug + ".md"), link("Quiz and answers", "../study/quizzes/" + slug + ".md"), link("Interactive page", "index.html#/foundation/" + id));
      head.append(check, label); box.append(head, description, links); $("modules").append(box);
    }
    if (!shown.length) $("modules").append(element("p", "No modules match this search."));
  }
  function drawLibrary() {
    const query = $("library-filter").value.trim().toLowerCase();
    const shown = library.filter(item => item.join(" ").toLowerCase().includes(query));
    $("library-list").replaceChildren();
    for (const [name, description, href] of shown) { const item = element("div", undefined, "library-item"); item.append(link(name, href), element("p", description, "small")); $("library-list").append(item); }
    if (!shown.length) $("library-list").append(element("p", "No library items match this search."));
  }
  $("filter").addEventListener("input", drawModules); $("library-filter").addEventListener("input", drawLibrary);
  $("note").value = state.note;
  $("note").addEventListener("input", () => { state.note = $("note").value; save(); });
  $("export").addEventListener("click", () => { const url = URL.createObjectURL(new Blob([state.note], {type: "text/plain;charset=utf-8"})); const a = document.createElement("a"); a.href = url; a.download = "ai-safety-study-notes.txt"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); });
  if (!storageAvailable) $("save-status").textContent = "Browser storage unavailable; download your notes.";
  drawModules(); drawLibrary();
})();
