/* The Agreement Field Guide: routing, rendering, search, glossary, quizzes. */
(function () {
  "use strict";

  var FOUNDATIONS = window.FOUNDATIONS || [];
  var SITE = window.SITE_DATA || { meta: {}, regime: [], contrasts: [] };
  var GLOSSARY = window.GLOSSARY_DATA || { sections: [], terms: [] };

  var foundationById = new Map(FOUNDATIONS.map(function (f) { return [f.id, f]; }));
  var termByName = new Map(GLOSSARY.terms.map(function (t) { return [t.term.toLowerCase(), t]; }));
  var isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var state = {
    mapId: SITE.mapExplanations && SITE.mapExplanations[0] ? SITE.mapExplanations[0].id : "independent",
    conditionsTab: "assumptions",
    regimeSelection: ["E1", "E0"],
    glossaryQuery: "",
    glossarySection: "All",
    quiz: new Map()
  };

  var visited = readVisited();
  var lastFocus = null;
  var searchIndex = buildSearchIndex();

  var $ = function (selector, root) { return (root || document).querySelector(selector); };
  var $$ = function (selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); };

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function readVisited() {
    try {
      var raw = localStorage.getItem("afg-visited");
      return new Set(raw ? JSON.parse(raw) : []);
    } catch (error) {
      return new Set();
    }
  }

  function saveVisited() {
    try {
      localStorage.setItem("afg-visited", JSON.stringify(Array.from(visited)));
    } catch (error) {
      /* localStorage is optional. */
    }
  }

  function readTheme() {
    try {
      var saved = localStorage.getItem("afg-theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch (error) { /* ignore */ }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var button = $("#theme-toggle");
    if (button) {
      button.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
      button.title = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
    }
    try {
      localStorage.setItem("afg-theme", theme);
    } catch (error) { /* ignore */ }
  }

  function plainBlocks(blocks) {
    return (blocks || []).map(function (block) {
      if (block.text) return block.text;
      if (block.items) return block.items.join(" ");
      if (block.rows) return block.rows.map(function (row) { return row.join(" "); }).join(" ");
      return "";
    }).join(" ");
  }

  function foundationText(f) {
    return [
      f.title,
      f.oneSentence,
      f.terms.join(" "),
      (f.fundamentals || []).map(function (step) { return step.title + " " + plainBlocks(step.blocks); }).join(" "),
      f.conditions ? f.conditions.summary : "",
      f.hypotheses ? f.hypotheses.map(function (h) { return h.id + " " + h.text; }).join(" ") : ""
    ].join(" ");
  }

  function buildSearchIndex() {
    var items = [];
    FOUNDATIONS.forEach(function (f) {
      items.push({
        group: "Foundations",
        label: f.id,
        title: f.title,
        sub: f.oneSentence,
        text: foundationText(f).toLowerCase(),
        route: "#/foundation/" + f.id
      });
    });
    GLOSSARY.terms.forEach(function (t) {
      items.push({
        group: "Glossary",
        label: "Aa",
        title: t.term,
        sub: t.definition,
        text: (t.term + " " + t.definition + " " + t.banned + " " + t.section).toLowerCase(),
        term: t.term
      });
    });
    SITE.regimes.forEach(function (r) {
      items.push({
        group: "Regimes",
        label: r.id,
        title: "Regime " + r.id,
        sub: r.explanation,
        text: (r.id + " " + r.explanation + " " + r.caseType + " " + r.provenance + " " + r.exposure + " " + r.channel + " " + r.payoffP + " " + r.payoffR).toLowerCase(),
        route: "#/conditions?tab=regimes&a=" + encodeURIComponent(r.id) + "&b=" + encodeURIComponent(r.id === "A" ? "B" : "A")
      });
    });
    return items;
  }

  function routeInfo() {
    var raw = window.location.hash.replace(/^#\/?/, "");
    var queryAt = raw.indexOf("?");
    var path = queryAt >= 0 ? raw.slice(0, queryAt) : raw;
    var query = new URLSearchParams(queryAt >= 0 ? raw.slice(queryAt + 1) : "");
    var parts = path.split("/").filter(Boolean);
    if (parts[0] === "foundation") {
      return { name: "foundation", id: parts[1] || "00", query: query };
    }
    if (parts[0] === "conditions") {
      return { name: "conditions", query: query };
    }
    if (parts[0] === "glossary") {
      return { name: "glossary", query: query };
    }
    return { name: "home", query: query };
  }

  function renderSideNav(route) {
    var nav = $("#side-nav");
    if (!nav) return;
    var activeFoundation = route.name === "foundation" ? route.id : null;
    var foundationLinks = FOUNDATIONS.map(function (f) {
      var classes = ["nav-link"];
      if (activeFoundation === f.id) classes.push("active");
      if (visited.has(f.id)) classes.push("visited");
      return '<a class="' + classes.join(" ") + '" href="#/foundation/' + f.id + '" data-nav="foundation">' +
        '<span class="nav-num">' + escapeHTML(f.id) + '</span>' +
        '<span class="nav-text">' + escapeHTML(f.short) + '</span>' +
        (f.id === "00" ? "" : "") +
        '</a>';
    }).join("");

    nav.innerHTML =
      '<div class="nav-group">' +
        '<p class="nav-label">Start</p>' +
        '<a class="nav-link ' + (route.name === "home" ? "active" : "") + '" href="#/">' +
          '<span class="nav-num">⌂</span><span class="nav-text">Overview</span>' +
        '</a>' +
        '<a class="nav-link ' + (route.name === "conditions" ? "active" : "") + '" href="#/conditions">' +
          '<span class="nav-num">∴</span><span class="nav-text">Conditions</span>' +
        '</a>' +
        '<a class="nav-link ' + (route.name === "glossary" ? "active" : "") + '" href="#/glossary">' +
          '<span class="nav-num">Aa</span><span class="nav-text">Glossary</span><span class="nav-badge">' + GLOSSARY.terms.length + '</span>' +
        '</a>' +
      '</div>' +
      '<div class="nav-group">' +
        '<p class="nav-label">Foundations</p>' +
        foundationLinks +
      '</div>' +
      '<div class="nav-group">' +
        '<p class="nav-label">Source material</p>' +
        '<a class="nav-link" href="../GLOSSARY.md" target="_blank" rel="noreferrer">' +
          '<span class="nav-num">↗</span><span class="nav-text">Glossary Markdown</span>' +
        '</a>' +
        '<a class="nav-link" href="../foundations/00-map.md" target="_blank" rel="noreferrer">' +
          '<span class="nav-num">↗</span><span class="nav-text">Foundations Markdown</span>' +
        '</a>' +
      '</div>';
  }

  function setTitle(title) {
    document.title = title ? title + " · Agreement Field Guide" : "The Agreement Field Guide";
  }

  function render() {
    var route = routeInfo();
    if (route.name === "conditions") {
      state.conditionsTab = route.query.get("tab") === "regimes" ? "regimes" : "assumptions";
      var a = route.query.get("a");
      var b = route.query.get("b");
      if (a && b) state.regimeSelection = [a, b];
    }
    if (route.name === "foundation" && foundationById.has(route.id)) {
      visited.add(route.id);
      saveVisited();
    }
    renderSideNav(route);
    var main = $("#main");
    if (!main) return;

    if (route.name === "foundation") {
      var foundation = foundationById.get(route.id);
      if (!foundation) {
        main.innerHTML = renderNotFound();
        setTitle("Not found");
      } else {
        main.innerHTML = renderFoundation(foundation);
        setTitle(foundation.title);
        afterFoundationRender(foundation, route);
      }
    } else if (route.name === "conditions") {
      main.innerHTML = renderConditionsPage();
      setTitle("Conditions and regimes");
    } else if (route.name === "glossary") {
      main.innerHTML = renderGlossaryPage();
      setTitle("Glossary");
      bindGlossaryInput();
      updateGlossaryResults();
    } else {
      main.innerHTML = renderHome();
      setTitle("");
      updateMapDetail();
    }

    closeSidebar();
    if (!route.query.get("section")) {
      window.scrollTo({ top: 0, behavior: isReduced ? "auto" : "auto" });
    }
  }

  /* ---------- Home ---------- */
  function renderHome() {
    var stats = [
      { value: FOUNDATIONS.length, label: "foundations" },
      { value: GLOSSARY.terms.length, label: "glossary terms" },
      { value: SITE.regimes.length, label: "regimes" },
      { value: SITE.mapExplanations.length, label: "explanations" }
    ];
    var cards = SITE.mapExplanations.map(function (item) {
      return '<button class="explain-card" type="button" data-map-id="' + escapeHTML(item.id) + '" role="tab" aria-selected="false" style="--tone:var(--' + escapeHTML(item.tone) + ');--tone-soft:var(--' + escapeHTML(item.tone) + '-soft)">' +
        '<span class="ex-number">' + escapeHTML(item.number) + '</span>' +
        '<strong>' + escapeHTML(item.title) + '</strong>' +
        '<span>' + escapeHTML(item.lens) + ' · ' + escapeHTML(item.regime) + '</span>' +
      '</button>';
    }).join("");

    var lensCards = SITE.lenses.map(function (lens) {
      return '<article class="lens-card">' +
        '<h3>' + escapeHTML(lens.name) + '<span>' + lens.docs.map(function (doc) { return "0" + doc.replace(/^0/, ""); }).join(" · ") + '</span></h3>' +
        '<p>' + escapeHTML(lens.question) + '</p>' +
        '<div class="cannot"><strong>Cannot answer:</strong> ' + escapeHTML(lens.cannot) + '</div>' +
      '</article>';
    }).join("");

    var path = SITE.readingPath.map(function (item) {
      var foundation = foundationById.get(item.id);
      if (!foundation) return "";
      return '<a class="path-item" href="#/foundation/' + escapeHTML(item.id) + '">' +
        '<span class="path-num">' + escapeHTML(item.id) + '</span>' +
        '<span class="path-copy"><strong>' + escapeHTML(item.title) + '</strong><span>' + escapeHTML(item.why) + '</span></span>' +
        '<span class="path-time">' + escapeHTML(item.time) + (item.sprint ? " · sprint" : "") + '</span>' +
      '</a>';
    }).join("");

    var statsHTML = stats.map(function (stat) {
      return '<div class="hero-stat"><strong>' + stat.value + '</strong><span>' + escapeHTML(stat.label) + '</span></div>';
    }).join("");

    return '<div class="page-wrap">' +
      '<section class="hero">' +
        '<div>' +
          '<p class="eyebrow">A field guide for one hard question</p>' +
          '<h1>When does agreement become <em>evidence?</em></h1>' +
          '<p class="hero-question">“' + escapeHTML(SITE.meta.question) + '”</p>' +
          '<p class="lede">' + escapeHTML(SITE.meta.subtitle) + ' Start with the observation, then separate the innocent explanations from coordination. Every concept follows the same six steps, states its conditions, and ends with a self-check.</p>' +
          '<div class="hero-actions">' +
            '<a class="btn primary" href="#/foundation/01">Start with evidence independence</a>' +
            '<a class="btn ghost" href="#/glossary">Browse ' + GLOSSARY.terms.length + ' terms</a>' +
          '</div>' +
          '<div class="hero-stats">' + statsHTML + '</div>' +
        '</div>' +
        '<aside class="observation-card" aria-label="The central observation">' +
          '<p class="obs-label">The central observation</p>' +
          '<div class="obs-chain">' +
            '<div class="obs-node"><span class="dot"></span>Three endorsements</div>' +
            '<div class="obs-arrow"></div>' +
            '<div class="obs-node"><span class="dot"></span>One approval</div>' +
            '<div class="obs-arrow"></div>' +
            '<div class="obs-node"><span class="dot"></span>The claim is false</div>' +
            '<div class="obs-arrow"></div>' +
            '<div class="obs-node question">Which explanation?</div>' +
          '</div>' +
          '<p class="obs-foot">Agreement is visible. The cause is not. The map names seven candidate explanations and the metadata that separates them.</p>' +
        '</aside>' +
      '</section>' +

      '<section class="map-panel card">' +
        '<div class="section-head">' +
          '<div><p class="section-kicker">The core map</p><h2>One observation, seven explanations</h2><p>Select an explanation to see its mechanism, its regime, and the fix it implies.</p></div>' +
          '<a class="btn small ghost" href="#/foundation/00">Read the map →</a>' +
        '</div>' +
        '<div class="explain-grid" role="tablist" aria-label="Explanations of agreement">' + cards + '</div>' +
        '<div class="map-detail" id="map-detail" aria-live="polite"></div>' +
      '</section>' +

      '<div class="two-col">' +
        '<section class="section-block">' +
          '<div class="section-kicker">The lenses</div>' +
          '<h2>Four questions, one transition</h2>' +
          '<p class="muted small">Each lens answers a different part of the same problem. None replaces the others.</p>' +
          '<div class="lens-grid">' + lensCards + '</div>' +
        '</section>' +
        '<section class="section-block">' +
          '<div class="section-kicker">A path through the material</div>' +
          '<h2>Read the shortest useful route</h2>' +
          '<p class="muted small">The first three are enough for the sprint weekend. The rest build the full program.</p>' +
          '<div class="path-list">' + path + '</div>' +
        '</section>' +
      '</div>' +

      '<section class="authority-panel">' +
        '<div>' +
          '<h3>Where oversight fails</h3>' +
          '<p>' + escapeHTML(SITE.authorityTransition.explanation) + '</p>' +
        '</div>' +
        '<div class="authority-formula">' + escapeHTML(SITE.authorityTransition.formula) + '</div>' +
      '</section>' +

      '<section class="section-block" style="margin-top:34px">' +
        '<div class="section-head">' +
          '<div><p class="section-kicker">Keep exploring</p><h2>Conditions, regimes, and vocabulary</h2></div>' +
          '<a class="btn small" href="#/conditions">Open the conditions workbench →</a>' +
        '</div>' +
        '<div class="two-col">' +
          '<a class="card" href="#/conditions" style="padding:20px;text-decoration:none;color:inherit">' +
            '<p class="eyebrow">Conditions</p>' +
            '<h3>When does each idea apply?</h3>' +
            '<p class="muted small" style="margin-bottom:0">Every concept has assumptions and failure modes. The regime workbench shows the eight experimental settings and the contrasts between them.</p>' +
          '</a>' +
          '<a class="card" href="#/glossary" style="padding:20px;text-decoration:none;color:inherit">' +
            '<p class="eyebrow">Glossary</p>' +
            '<h3>One term, one concept</h3>' +
            '<p class="muted small" style="margin-bottom:0">Definitions, banned synonyms, and links back to the pages where each term is used. Terms open in a drawer from anywhere.</p>' +
          '</a>' +
        '</div>' +
      '</section>' +
    '</div>';
  }

  function updateMapDetail() {
    var detail = $("#map-detail");
    if (!detail) return;
    var item = (SITE.mapExplanations || []).find(function (entry) { return entry.id === state.mapId; }) || SITE.mapExplanations[0];
    if (!item) return;
    $$(".explain-card").forEach(function (card) {
      var active = card.getAttribute("data-map-id") === item.id;
      card.classList.toggle("active", active);
      card.setAttribute("aria-selected", String(active));
    });
    var docLinks = item.docs.map(function (id) {
      var f = foundationById.get(id);
      return f ? '<a class="detail-link" href="#/foundation/' + f.id + '">Foundation ' + f.id + ': ' + escapeHTML(f.short) + '</a>' : "";
    }).join("");
    detail.innerHTML =
      '<div>' +
        '<div class="concept-meta">' +
          '<span class="pill accent">Explanation ' + escapeHTML(item.number) + '</span>' +
          '<span class="pill">' + escapeHTML(item.lens) + '</span>' +
          '<span class="pill amber">Regime ' + escapeHTML(item.regime) + '</span>' +
        '</div>' +
        '<h3>' + escapeHTML(item.title) + '</h3>' +
        '<p>' + escapeHTML(item.mechanism) + '</p>' +
        '<p><strong>What to look for.</strong> ' + escapeHTML(item.tell) + '</p>' +
        docLinks +
      '</div>' +
      '<div class="detail-facts">' +
        '<div class="detail-fact"><span class="fact-label">The fix</span><span class="fact-value">' + escapeHTML(item.fix) + '</span></div>' +
        '<div class="detail-fact"><span class="fact-label">Where it appears</span><span class="fact-value">Regime ' + escapeHTML(item.regime) + ' in the sprint design.</span></div>' +
      '</div>';
  }

  /* ---------- Foundation page ---------- */
  function renderFoundation(f) {
    var sections = [
      { id: "fundamentals", label: "Fundamentals" },
      { id: "demo", label: "Try it" },
      { id: "conditions", label: "Conditions" },
      { id: "practice", label: "Self-check" },
      { id: "connections", label: "Connections" }
    ].filter(function (section) { return section.id !== "demo" || f.demo; });

    var railSections = sections.map(function (section) {
      return '<li><a href="#/foundation/' + f.id + '?section=' + section.id + '" data-scroll="' + section.id + '">' + section.label + '</a></li>';
    }).join("");

    var terms = f.terms.map(function (term) {
      return '<button class="term-chip" type="button" data-term="' + escapeHTML(term) + '">' + escapeHTML(term) + '</button>';
    }).join("");

    var regimes = f.regimes.map(function (id) {
      var partner = bestRegimePartner(id);
      return '<a class="regime-chip" href="#/conditions?tab=regimes&a=' + encodeURIComponent(id) + '&b=' + encodeURIComponent(partner) + '"><span class="regime-id">' + escapeHTML(id) + '</span></a>';
    }).join("");

    var hypotheses = f.hypotheses && f.hypotheses.length
      ? '<ul class="hypothesis-list">' + f.hypotheses.map(function (h) {
          return '<li class="hypothesis-item"><strong>' + escapeHTML(h.id) + '</strong><span>' + escapeHTML(h.text) + '</span></li>';
        }).join("") + '</ul>'
      : '<p class="small muted" style="margin:0">No hypothesis is attached in the registry.</p>';

    var related = (f.related || []).map(function (id) {
      var relatedFoundation = foundationById.get(id);
      if (!relatedFoundation) return "";
      return '<a class="path-item" href="#/foundation/' + id + '">' +
        '<span class="path-num">' + escapeHTML(id) + '</span>' +
        '<span class="path-copy"><strong>' + escapeHTML(relatedFoundation.short) + '</strong><span>' + escapeHTML(relatedFoundation.oneSentence) + '</span></span>' +
        '<span class="path-time">→</span>' +
      '</a>';
    }).join("");

    return '<div class="page-wrap">' +
      '<div class="crumbs"><a href="#/">Overview</a><span>/</span><span>Foundation ' + escapeHTML(f.id) + '</span><span>/</span><span>' + escapeHTML(f.short) + '</span></div>' +
      '<header class="concept-hero">' +
        '<div class="concept-meta">' +
          '<span class="pill accent">' + escapeHTML(f.lens) + '</span>' +
          '<span class="pill">' + escapeHTML(f.time) + '</span>' +
          '<span class="pill">' + f.terms.length + ' terms</span>' +
        '</div>' +
        '<h1>' + escapeHTML(f.title) + '</h1>' +
        '<p class="one-sentence">' + escapeHTML(f.oneSentence) + '</p>' +
        '<p class="kind-note">' + escapeHTML(f.kindNote) + '</p>' +
        '<div class="kind-tags">' + f.kinds.map(function (kind) { return '<span class="kind-tag">' + escapeHTML(kind) + '</span>'; }).join("") + '</div>' +
        '<div class="concept-actions">' +
          (f.demo ? '<button class="btn primary" type="button" data-scroll="demo">Try the interactive demo</button>' : '<a class="btn primary" href="#/">Open the concept map</a>') +
          '<button class="btn ghost" type="button" data-scroll="conditions">See the conditions</button>' +
          '<a class="btn ghost" href="../' + escapeHTML(f.source) + '" target="_blank" rel="noreferrer">Read the source ↗</a>' +
        '</div>' +
      '</header>' +
      '<div class="concept-layout">' +
        '<div class="concept-main">' +
          '<section class="section-block" id="fundamentals">' +
            '<div class="section-kicker">Fundamentals · six steps</div>' +
            '<h2>The idea from the ground up</h2>' +
            '<p class="lede">Purpose, intuition, mechanism, formalism, example, significance. The order is deliberate: the formal statement arrives after the problem it solves.</p>' +
            '<div class="steps">' + f.fundamentals.map(renderStep).join("") + '</div>' +
          '</section>' +
          (f.demo ? renderDemoSection(f) : "") +
          renderConditionsSection(f) +
          renderQuizSection(f) +
          '<section class="section-block" id="connections">' +
            '<div class="section-kicker">Connections</div>' +
            '<h2>Read next</h2>' +
            '<div class="path-list">' + related + '</div>' +
            '<p class="demo-note" style="margin-top:18px">Canonical source: <a href="../' + escapeHTML(f.source) + '" target="_blank" rel="noreferrer">' + escapeHTML(f.source) + '</a>. The explainer paraphrases and links; the Markdown file is the record.</p>' +
          '</section>' +
        '</div>' +
        '<aside class="page-rail" aria-label="Page context">' +
          '<div class="rail-block"><h4>On this page</h4><ul class="rail-links">' + railSections + '</ul></div>' +
          '<div class="rail-block"><h4>Terms in this page</h4><div class="term-list">' + terms + '</div></div>' +
          '<div class="rail-block"><h4>Regimes</h4><div class="term-list">' + regimes + '</div><p class="small muted" style="margin:8px 0 0"><a href="#/conditions?tab=regimes">Compare regimes →</a></p></div>' +
          '<div class="rail-block"><h4>Hypotheses</h4>' + hypotheses + '</div>' +
          '<div class="rail-block rail-source"><span>Source</span><a href="../' + escapeHTML(f.source) + '" target="_blank" rel="noreferrer">Open ↗</a></div>' +
        '</aside>' +
      '</div>' +
    '</div>';
  }

  function renderStep(step, index) {
    return '<article class="step" id="step-' + escapeHTML(step.key) + '">' +
      '<div class="step-index">0' + (index + 1) + '</div>' +
      '<div class="step-body"><h3>' + escapeHTML(step.title) + '</h3>' + step.blocks.map(renderBlock).join("") + '</div>' +
    '</article>';
  }

  function renderBlock(block) {
    if (block.type === "p") return "<p>" + escapeHTML(block.text) + "</p>";
    if (block.type === "list") return "<ul>" + block.items.map(function (item) { return "<li>" + escapeHTML(item) + "</li>"; }).join("") + "</ul>";
    if (block.type === "ordered") return "<ol>" + block.items.map(function (item) { return "<li>" + escapeHTML(item) + "</li>"; }).join("") + "</ol>";
    if (block.type === "formula") return '<div class="formula" role="math">' + escapeHTML(block.text) + "</div>";
    if (block.type === "callout") {
      return '<div class="callout"><span class="callout-label">' + escapeHTML(block.label) + "</span><p>" + escapeHTML(block.text) + "</p></div>";
    }
    if (block.type === "table") {
      var head = block.head.map(function (cell) { return "<th scope=\"col\">" + escapeHTML(cell) + "</th>"; }).join("");
      var rows = block.rows.map(function (row) {
        return "<tr>" + row.map(function (cell) { return "<td>" + escapeHTML(cell) + "</td>"; }).join("") + "</tr>";
      }).join("");
      return '<div class="table-wrap"><table><thead><tr>' + head + '</tr></thead><tbody>' + rows + '</tbody></table></div>';
    }
    return "";
  }

  function renderDemoSection(f) {
    return '<section class="section-block" id="demo">' +
      '<div class="section-kicker">Try it</div>' +
      '<h2>Move the assumptions and watch the result</h2>' +
      '<p class="lede">The demo is a small model of this page’s mechanism. Change one input at a time and compare the two readings.</p>' +
      '<div id="demo-root"></div>' +
    '</section>';
  }

  function renderConditionsSection(f) {
    var assumptions = f.conditions.assumptions.map(function (item) {
      return '<div class="condition-item"><p>' + escapeHTML(item.text) + '</p><span class="condition-note"><strong>Breaks when</strong> ' + escapeHTML(item.breaks) + '</span></div>';
    }).join("");
    var failures = f.conditions.failureModes.map(function (item) {
      return '<div class="condition-item"><p>' + escapeHTML(item.text) + '</p><span class="condition-note"><strong>Catch</strong> ' + escapeHTML(item.catch) + '</span></div>';
    }).join("");
    var regimeLinks = f.regimes.map(function (id) {
      var partner = bestRegimePartner(id);
      return '<a class="regime-chip" href="#/conditions?tab=regimes&a=' + encodeURIComponent(id) + '&b=' + encodeURIComponent(partner) + '"><span class="regime-id">' + escapeHTML(id) + '</span></a>';
    }).join("");

    return '<section class="section-block" id="conditions">' +
      '<div class="section-kicker">Conditions</div>' +
      '<h2>When this works, and what breaks it</h2>' +
      '<p class="condition-summary">' + escapeHTML(f.conditions.summary) + '</p>' +
      '<div class="condition-grid">' +
        '<div class="condition-column"><h3>What it assumes</h3>' + assumptions + '<div class="condition-tags">' + f.kinds.map(function (kind) { return '<span class="kind-tag">' + escapeHTML(kind) + '</span>'; }).join("") + '</div></div>' +
        '<div class="condition-column failure"><h3>What breaks it</h3>' + failures + '</div>' +
      '</div>' +
      '<div class="condition-tags" style="margin-top:18px"><span class="small muted" style="align-self:center;margin-right:4px">Regimes:</span>' + regimeLinks + '<a class="detail-link" href="#/conditions?tab=regimes">Compare all regimes</a></div>' +
    '</section>';
  }

  function renderQuizSection(f) {
    return '<section class="section-block" id="practice">' +
      '<div class="section-kicker">Self-check</div>' +
      '<h2>Can you reconstruct the argument?</h2>' +
      '<p class="lede">Answer from memory first. The feedback names the mechanism, not just the right option.</p>' +
      '<div id="quiz-root">' + renderQuizCards(f) + '</div>' +
    '</section>';
  }

  function renderQuizCards(f) {
    var cards = f.quiz.map(function (question, index) { return renderQuizCard(f, question, index); }).join("");
    return '<div class="quiz-list">' + cards + '</div>' + renderQuizScore(f);
  }

  function renderQuizCard(f, question, index) {
    var key = f.id + ":" + index;
    var selected = state.quiz.has(key) ? state.quiz.get(key) : null;
    var answered = selected !== null;
    var options = question.options.map(function (option, optionIndex) {
      var classes = ["quiz-option"];
      if (answered && optionIndex === question.answer) classes.push("correct");
      if (answered && optionIndex === selected && selected !== question.answer) classes.push("incorrect");
      return '<button class="' + classes.join(" ") + '" type="button" data-quiz-option="' + optionIndex + '" data-question="' + index + '" data-foundation="' + escapeHTML(f.id) + '"' + (answered ? " disabled" : "") + '>' +
        '<span class="option-letter">' + String.fromCharCode(65 + optionIndex) + '</span>' +
        '<span>' + escapeHTML(option) + '</span>' +
      '</button>';
    }).join("");
    var feedback = "";
    if (answered) {
      var isCorrect = selected === question.answer;
      feedback = '<div class="quiz-feedback" role="status"><strong>' + (isCorrect ? "Correct." : "Not quite. The correct answer is " + String.fromCharCode(65 + question.answer) + ".") + '</strong> ' + escapeHTML(question.explanation) + '</div>';
    }
    return '<article class="quiz-card" data-quiz-card="' + index + '">' +
      '<span class="quiz-number">Question 0' + (index + 1) + '</span>' +
      '<h3>' + escapeHTML(question.question) + '</h3>' +
      '<div class="quiz-options">' + options + '</div>' +
      feedback +
    '</article>';
  }

  function renderQuizScore(f) {
    var answered = 0;
    var correct = 0;
    f.quiz.forEach(function (question, index) {
      var key = f.id + ":" + index;
      if (state.quiz.has(key)) {
        answered += 1;
        if (state.quiz.get(key) === question.answer) correct += 1;
      }
    });
    return '<div class="quiz-score"><span><strong>' + answered + ' of ' + f.quiz.length + '</strong> answered · <strong>' + correct + '</strong> correct</span><button class="quiz-reset" type="button" data-quiz-reset="' + escapeHTML(f.id) + '">Reset quiz</button></div>';
  }

  function afterFoundationRender(f, route) {
    var main = $("#main");
    var concept = $(".concept-main", main);
    if (concept) linkTerms(concept, f.terms);
    if (f.demo && window.DEMOS && window.DEMOS[f.demo]) {
      var root = $("#demo-root");
      if (root) window.DEMOS[f.demo](root);
    }
    var section = route.query.get("section");
    if (section) {
      window.setTimeout(function () { scrollToId(section); }, 30);
    }
  }

  function renderNotFound() {
    return '<div class="page-wrap"><section class="hero"><div><p class="eyebrow">Not found</p><h1>That page is not in the guide.</h1><p class="lede">Try the overview, the conditions workbench, or the glossary.</p><div class="hero-actions"><a class="btn primary" href="#/">Go to the overview</a><a class="btn ghost" href="#/glossary">Browse the glossary</a></div></div></section></div>';
  }

  function bestRegimePartner(id) {
    var contrast = (SITE.contrasts || []).find(function (item) { return item.pair.indexOf(id) >= 0; });
    if (!contrast) return id === "A" ? "B" : "A";
    return contrast.pair[0] === id ? contrast.pair[1] : contrast.pair[0];
  }

  /* ---------- Conditions page ---------- */
  function renderConditionsPage() {
    var tabs = '<div class="conditions-tabs" role="tablist" aria-label="Conditions views">' +
      '<button class="conditions-tab ' + (state.conditionsTab === "assumptions" ? "active" : "") + '" type="button" data-conditions-tab="assumptions" role="tab" aria-selected="' + (state.conditionsTab === "assumptions") + '">Assumptions and failure modes</button>' +
      '<button class="conditions-tab ' + (state.conditionsTab === "regimes" ? "active" : "") + '" type="button" data-conditions-tab="regimes" role="tab" aria-selected="' + (state.conditionsTab === "regimes") + '">Regime workbench</button>' +
    '</div>';

    return '<div class="page-wrap">' +
      '<div class="crumbs"><a href="#/">Overview</a><span>/</span><span>Conditions</span></div>' +
      '<section class="concept-hero">' +
        '<div class="concept-meta"><span class="pill amber">Conditions</span><span class="pill">9 concepts</span><span class="pill">8 regimes</span></div>' +
        '<h1>Every idea has a boundary.</h1>' +
        '<p class="one-sentence">A concept is usable only when you know what it assumes and when it breaks. This workbench keeps both layers next to the experimental settings that test them.</p>' +
      '</section>' +
      tabs +
      '<div id="conditions-view">' + (state.conditionsTab === "regimes" ? renderRegimeWorkbench() : renderConditionsIndex()) + '</div>' +
    '</div>';
  }

  function renderConditionsIndex() {
    var cards = FOUNDATIONS.map(function (f) {
      var assumptions = f.conditions.assumptions;
      var failures = f.conditions.failureModes;
      var firstAssumptions = assumptions.slice(0, 2).map(function (item) {
        return '<div class="cc-row"><p>' + escapeHTML(item.text) + '</p><span><strong>Breaks when</strong> ' + escapeHTML(item.breaks) + '</span></div>';
      }).join("");
      var firstFailures = failures.slice(0, 2).map(function (item) {
        return '<div class="cc-row"><p>' + escapeHTML(item.text) + '</p><span><strong>Catch</strong> ' + escapeHTML(item.catch) + '</span></div>';
      }).join("");
      var extraAssumptions = assumptions.slice(2).map(function (item) {
        return '<div class="cc-row"><p>' + escapeHTML(item.text) + '</p><span><strong>Breaks when</strong> ' + escapeHTML(item.breaks) + '</span></div>';
      }).join("");
      var extraFailures = failures.slice(2).map(function (item) {
        return '<div class="cc-row"><p>' + escapeHTML(item.text) + '</p><span><strong>Catch</strong> ' + escapeHTML(item.catch) + '</span></div>';
      }).join("");
      var more = (extraAssumptions || extraFailures)
        ? '<details class="cc-more"><summary>More conditions</summary>' + extraAssumptions + extraFailures + '</details>'
        : "";
      return '<article class="condition-concept">' +
        '<div class="cc-head"><h3>' + escapeHTML(f.short) + '</h3><span class="cc-id">F' + escapeHTML(f.id) + '</span></div>' +
        '<p class="small muted" style="margin:0 0 8px">' + escapeHTML(f.conditions.summary) + '</p>' +
        firstAssumptions + firstFailures + more +
        '<a class="detail-link" href="#/foundation/' + f.id + '?section=conditions">Open foundation ' + escapeHTML(f.id) + '</a>' +
      '</article>';
    }).join("");
    return '<section class="section-block" style="margin-bottom:0">' +
      '<div class="section-head"><div><p class="section-kicker">The boundary layer</p><h2>What each concept assumes</h2><p>Read a condition before you rely on a result. The full page has the derivation and the quiz.</p></div></div>' +
      '<div class="condition-concept-grid">' + cards + '</div>' +
    '</section>';
  }

  function renderRegimeWorkbench() {
    var cards = SITE.regimes.map(function (r) {
      var selected = state.regimeSelection.indexOf(r.id) >= 0;
      return '<button class="regime-card ' + (selected ? "selected" : "") + '" type="button" data-regime-id="' + escapeHTML(r.id) + '" aria-pressed="' + selected + '">' +
        '<div class="regime-top"><span class="regime-id">' + escapeHTML(r.id) + '</span><span class="regime-label ' + (r.label ? "collusion" : "") + '">' + (r.label ? "label 1" : "label 0") + '</span></div>' +
        '<strong>' + escapeHTML(r.explanation) + '</strong>' +
        '<div class="regime-factors">' +
          '<span class="factor-chip">prov: ' + escapeHTML(r.provenance) + '</span>' +
          '<span class="factor-chip">exp: ' + escapeHTML(r.exposure) + '</span>' +
          '<span class="factor-chip">channel: ' + escapeHTML(r.channel) + '</span>' +
          '<span class="factor-chip">P: ' + escapeHTML(r.payoffP) + '</span>' +
          '<span class="factor-chip">R: ' + escapeHTML(r.payoffR) + '</span>' +
        '</div>' +
      '</button>';
    }).join("");

    var presets = (SITE.contrasts || []).map(function (c) {
      var active = state.regimeSelection.length === 2 && state.regimeSelection.indexOf(c.pair[0]) >= 0 && state.regimeSelection.indexOf(c.pair[1]) >= 0;
      return '<button class="contrast-btn ' + (active ? "active" : "") + '" type="button" data-contrast="' + escapeHTML(c.pair[0]) + ',' + escapeHTML(c.pair[1]) + '">' + escapeHTML(c.pair[0]) + ' vs ' + escapeHTML(c.pair[1]) + '</button>';
    }).join("");

    return '<section class="section-block" style="margin-bottom:0">' +
      '<div class="section-head"><div><p class="section-kicker">The regime workbench</p><h2>Change one factor at a time</h2><p>Select two regimes. The comparison marks the factors that differ and names the question the contrast tests.</p></div></div>' +
      '<div class="contrast-presets">' + presets + '</div>' +
      '<div class="regime-grid">' + cards + '</div>' +
      '<div id="regime-compare">' + renderRegimeCompare() + '</div>' +
    '</section>';
  }

  function renderRegimeCompare() {
    var selected = state.regimeSelection;
    if (selected.length < 2) {
      return '<div class="regime-compare"><h3>Select two regimes</h3><p class="muted small" style="margin:0">The default is E1 versus E0: the channel contrast that defines Δ_comm.</p></div>';
    }
    var a = SITE.regimes.find(function (r) { return r.id === selected[0]; });
    var b = SITE.regimes.find(function (r) { return r.id === selected[1]; });
    if (!a || !b) return "";
    var factors = [
      ["provenance", a.provenance, b.provenance],
      ["exposure", a.exposure, b.exposure],
      ["channel", a.channel, b.channel],
      ["payoff_P", a.payoffP, b.payoffP],
      ["payoff_R", a.payoffR, b.payoffR],
      ["regime label", String(a.label), String(b.label)]
    ];
    var rows = factors.map(function (row) {
      var differs = row[1] !== row[2];
      return '<tr class="' + (differs ? "diff" : "") + '"><td>' + escapeHTML(row[0]) + '</td><td>' + escapeHTML(row[1]) + '</td><td>' + escapeHTML(row[2]) + '</td></tr>';
    }).join("");
    var contrast = (SITE.contrasts || []).find(function (c) {
      return (c.pair[0] === a.id && c.pair[1] === b.id) || (c.pair[0] === b.id && c.pair[1] === a.id);
    });
    var question = contrast ? contrast.question : "Custom comparison. Name the factor that differs before you interpret the result.";
    var delta = (a.id === "E1" && b.id === "E0") || (a.id === "E0" && b.id === "E1")
      ? '<p class="demo-note" style="margin-top:12px"><strong>Δ_comm:</strong> the scripted demo measured 0.000 with a bootstrap interval of [0.000, 0.000]. For payoff-maximizing reviewers, endorsing is a dominant strategy, so the channel need not add votes. The LLM run tests whether models fall short of that benchmark.</p>'
      : "";
    return '<div class="regime-compare">' +
      '<div class="concept-meta"><span class="pill accent">' + escapeHTML(a.id) + '</span><span class="pill">versus</span><span class="pill amber">' + escapeHTML(b.id) + '</span></div>' +
      '<h3>' + escapeHTML(a.explanation) + ' vs ' + escapeHTML(b.explanation) + '</h3>' +
      '<p class="muted small">' + escapeHTML(question) + '</p>' +
      '<div class="table-wrap"><table class="compare-table"><thead><tr><th>Factor</th><th>' + escapeHTML(a.id) + '</th><th>' + escapeHTML(b.id) + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      (contrast ? '<p class="small muted" style="margin:10px 0 0"><strong>Contrast:</strong> ' + escapeHTML(contrast.factor) + '</p>' : "") +
      delta +
    '</div>';
  }

  /* ---------- Glossary page ---------- */
  function renderGlossaryPage() {
    var sectionChips = ['<button class="filter-chip active" type="button" data-glossary-section="All">All <span class="muted">' + GLOSSARY.terms.length + '</span></button>'];
    GLOSSARY.sections.forEach(function (section) {
      var count = GLOSSARY.terms.filter(function (t) { return t.section === section; }).length;
      sectionChips.push('<button class="filter-chip" type="button" data-glossary-section="' + escapeHTML(section) + '">' + escapeHTML(section) + ' <span class="muted">' + count + '</span></button>');
    });
    return '<div class="page-wrap">' +
      '<div class="crumbs"><a href="#/">Overview</a><span>/</span><span>Glossary</span></div>' +
      '<section class="concept-hero">' +
        '<div class="concept-meta"><span class="pill accent">Controlled vocabulary</span><span class="pill">' + GLOSSARY.terms.length + ' terms</span><span class="pill">12 sections</span></div>' +
        '<h1>One term, one concept.</h1>' +
        '<p class="one-sentence">The glossary is the repository’s controlled vocabulary. Each entry names the definition, the synonyms that are banned, and the pages where the term is used.</p>' +
        '<p class="kind-note">Terms marked “(ours)” are the repository’s working labels, not claims that the literature uses them.</p>' +
      '</section>' +
      '<div class="glossary-toolbar">' +
        '<div class="glossary-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></svg><label class="visually-hidden" for="glossary-search">Filter glossary terms</label><input id="glossary-search" type="search" placeholder="Filter terms, definitions, or banned synonyms…" autocomplete="off"></div>' +
        '<div class="section-filters">' + sectionChips.join("") + '</div>' +
        '<div class="glossary-count" id="glossary-count"></div>' +
      '</div>' +
      '<div id="glossary-results">' + renderGlossaryResults() + '</div>' +
    '</div>';
  }

  function renderGlossaryResults() {
    var query = state.glossaryQuery.trim().toLowerCase();
    var section = state.glossarySection;
    var filtered = GLOSSARY.terms.filter(function (t) {
      var sectionMatch = section === "All" || t.section === section;
      var queryMatch = !query || (t.term + " " + t.definition + " " + t.banned + " " + t.section).toLowerCase().indexOf(query) >= 0;
      return sectionMatch && queryMatch;
    });
    var count = $("#glossary-count");
    if (count) count.textContent = filtered.length + " of " + GLOSSARY.terms.length + " terms";
    if (!filtered.length) {
      return '<div class="glossary-empty">No terms match “' + escapeHTML(state.glossaryQuery) + '”. Try a shorter query or a different section.</div>';
    }
    return '<div class="glossary-grid">' + filtered.map(function (t) {
      return '<button class="glossary-card" type="button" data-term="' + escapeHTML(t.term) + '">' +
        '<span class="term-section">' + escapeHTML(t.section) + '</span>' +
        '<strong>' + escapeHTML(t.term) + '</strong>' +
        '<p>' + escapeHTML(t.definition) + '</p>' +
      '</button>';
    }).join("") + '</div>';
  }

  function updateGlossaryResults() {
    var results = $("#glossary-results");
    if (results) results.innerHTML = renderGlossaryResults();
    $$("[data-glossary-section]").forEach(function (button) {
      var active = button.getAttribute("data-glossary-section") === state.glossarySection;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function bindGlossaryInput() {
    var input = $("#glossary-search");
    if (!input) return;
    input.value = state.glossaryQuery;
    input.addEventListener("input", function () {
      state.glossaryQuery = input.value;
      updateGlossaryResults();
    });
  }

  /* ---------- Terms, linking, drawer ---------- */
  function findTerm(name) {
    return termByName.get(String(name).toLowerCase()) || null;
  }

  function linkTerms(root, terms) {
    var available = terms.filter(function (term) { return findTerm(term); });
    available.forEach(function (term) {
      var regex;
      try {
        regex = new RegExp("(?<![A-Za-z])" + escapeRegExp(term) + "(?![A-Za-z])", "i");
      } catch (error) {
        return;
      }
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
          if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          var parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (parent.closest("button, a, code, pre, h1, h2, h3, .formula, .inline-term")) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      var node;
      while ((node = walker.nextNode())) {
        var match = regex.exec(node.nodeValue);
        if (!match) continue;
        var before = node.nodeValue.slice(0, match.index);
        var after = node.nodeValue.slice(match.index + match[0].length);
        var fragment = document.createDocumentFragment();
        if (before) fragment.appendChild(document.createTextNode(before));
        var button = document.createElement("button");
        button.type = "button";
        button.className = "inline-term";
        button.dataset.term = term;
        button.title = "Glossary: " + term;
        button.textContent = match[0];
        fragment.appendChild(button);
        if (after) fragment.appendChild(document.createTextNode(after));
        node.parentNode.replaceChild(fragment, node);
        break;
      }
    });
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function openTerm(name) {
    var term = findTerm(name);
    if (!term) {
      showToast("No glossary entry for “" + name + "”.");
      return;
    }
    lastFocus = document.activeElement;
    var appears = FOUNDATIONS.filter(function (f) {
      return f.terms.some(function (t) { return t.toLowerCase() === term.term.toLowerCase(); });
    });
    var banned = term.banned ? term.banned.split(/,\s*/).filter(Boolean) : [];
    var content = $("#term-content");
    content.innerHTML =
      '<p class="term-drawer-kicker">' + escapeHTML(term.section) + '</p>' +
      '<h2 class="term-drawer-title" id="term-title">' + escapeHTML(term.term) + '</h2>' +
      '<p class="term-drawer-def">' + escapeHTML(term.definition) + '</p>' +
      (banned.length ? '<div class="term-drawer-block"><h3>Do not write</h3><div class="banned-list">' + banned.map(function (word) { return '<span class="banned-chip">' + escapeHTML(word) + '</span>'; }).join("") + '</div></div>' : "") +
      '<div class="term-drawer-block"><h3>Appears in</h3>' +
        (appears.length
          ? '<div class="appears-list">' + appears.map(function (f) { return '<a href="#/foundation/' + f.id + '">F' + escapeHTML(f.id) + ' · ' + escapeHTML(f.short) + '</a>'; }).join("") + '</div>'
          : '<p>This term is in the glossary but is not yet linked from a foundation page.</p>') +
      '</div>' +
      '<div class="term-drawer-block"><h3>Source of truth</h3><p><a href="../GLOSSARY.md" target="_blank" rel="noreferrer">GLOSSARY.md</a> holds the canonical definition and banned synonyms.</p></div>';
    var drawer = $("#term-drawer");
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var close = $(".drawer-close", drawer);
    if (close) close.focus();
  }

  function closeTerm() {
    var drawer = $("#term-drawer");
    if (!drawer.classList.contains("open")) return;
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function showToast(message) {
    var toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () { toast.classList.remove("show"); }, 2200);
  }

  /* ---------- Search ---------- */
  function openSearch() {
    var overlay = $("#search-overlay");
    if (!overlay) return;
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    var input = $("#search-input");
    if (input) {
      input.value = "";
      input.focus();
    }
    renderSearchResults("");
  }

  function closeSearch() {
    var overlay = $("#search-overlay");
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function searchItems(query) {
    var q = query.trim().toLowerCase();
    if (!q) {
      return [
        { group: "Quick start", label: "01", title: "Evidence independence", sub: "Why copies are not corroboration.", route: "#/foundation/01" },
        { group: "Quick start", label: "04", title: "Collusion and plus factors", sub: "The sprint's central concept.", route: "#/foundation/04" },
        { group: "Quick start", label: "07", title: "Measurement", sub: "Read the tables you will produce.", route: "#/foundation/07" },
        { group: "Quick start", label: "Aa", title: "Glossary", sub: "Browse all " + GLOSSARY.terms.length + " terms.", route: "#/glossary" },
        { group: "Quick start", label: "∴", title: "Conditions and regimes", sub: "Assumptions, failure modes, and the eight regimes.", route: "#/conditions" }
      ];
    }
    var scored = searchIndex.map(function (item) {
      var title = item.title.toLowerCase();
      var sub = (item.sub || "").toLowerCase();
      var score = 0;
      if (title === q) score += 100;
      else if (title.indexOf(q) === 0) score += 70;
      else if (title.indexOf(q) > -1) score += 45;
      if (sub.indexOf(q) > -1) score += 18;
      if (item.text.indexOf(q) > -1) score += 8;
      return { item: item, score: score };
    }).filter(function (entry) { return entry.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 24)
      .map(function (entry) { return entry.item; });

    var groups = {};
    scored.forEach(function (item) {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
    });
    var result = [];
    Object.keys(groups).forEach(function (group) {
      groups[group].forEach(function (item) { result.push(item); });
    });
    return result;
  }

  function renderSearchResults(query) {
    var results = $("#search-results");
    if (!results) return;
    var items = searchItems(query);
    if (!items.length) {
      results.innerHTML = '<div class="search-empty">No match for “' + escapeHTML(query) + '”. Try a term, a hypothesis id, or a regime letter.</div>';
      return;
    }
    var groups = {};
    items.forEach(function (item) {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
    });
    results.innerHTML = Object.keys(groups).map(function (group) {
      return '<div class="search-group"><h3>' + escapeHTML(group) + '</h3>' + groups[group].map(function (item) {
        if (item.term) {
          return '<button class="search-result" type="button" data-search-term="' + escapeHTML(item.term) + '">' +
            '<span class="sr-num">' + escapeHTML(item.label) + '</span>' +
            '<span class="sr-copy"><strong>' + escapeHTML(item.title) + '</strong><span>' + escapeHTML(item.sub) + '</span></span>' +
          '</button>';
        }
        return '<a class="search-result" href="' + escapeHTML(item.route) + '">' +
          '<span class="sr-num">' + escapeHTML(item.label) + '</span>' +
          '<span class="sr-copy"><strong>' + escapeHTML(item.title) + '</strong><span>' + escapeHTML(item.sub) + '</span></span>' +
        '</a>';
      }).join("") + '</div>';
    }).join("");
  }

  /* ---------- Navigation helpers ---------- */
  function closeSidebar() {
    var sidebar = $("#sidebar");
    var scrim = $("#sidebar-scrim");
    var toggle = $("#menu-toggle");
    if (!sidebar) return;
    sidebar.classList.remove("open");
    if (scrim) scrim.hidden = true;
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  function openSidebar() {
    var sidebar = $("#sidebar");
    var scrim = $("#sidebar-scrim");
    var toggle = $("#menu-toggle");
    if (!sidebar) return;
    sidebar.classList.add("open");
    if (scrim) scrim.hidden = false;
    if (toggle) toggle.setAttribute("aria-expanded", "true");
  }

  function scrollToId(id) {
    var element = document.getElementById(id);
    if (!element) return;
    element.scrollIntoView({ behavior: isReduced ? "auto" : "smooth", block: "start" });
    closeSidebar();
  }

  /* ---------- Event wiring ---------- */
  function handleMainClick(event) {
    var mapCard = event.target.closest("[data-map-id]");
    if (mapCard) {
      state.mapId = mapCard.getAttribute("data-map-id");
      updateMapDetail();
      return;
    }
    var scrollTarget = event.target.closest("[data-scroll]");
    if (scrollTarget) {
      event.preventDefault();
      scrollToId(scrollTarget.getAttribute("data-scroll"));
      return;
    }
    var termTarget = event.target.closest("[data-term]");
    if (termTarget) {
      event.preventDefault();
      openTerm(termTarget.getAttribute("data-term"));
      return;
    }
    var quizOption = event.target.closest("[data-quiz-option]");
    if (quizOption) {
      answerQuiz(quizOption);
      return;
    }
    var quizReset = event.target.closest("[data-quiz-reset]");
    if (quizReset) {
      resetQuiz(quizReset.getAttribute("data-quiz-reset"));
      return;
    }
    var conditionsTab = event.target.closest("[data-conditions-tab]");
    if (conditionsTab) {
      state.conditionsTab = conditionsTab.getAttribute("data-conditions-tab");
      $$("[data-conditions-tab]").forEach(function (button) {
        var active = button.getAttribute("data-conditions-tab") === state.conditionsTab;
        button.classList.toggle("active", active);
        button.setAttribute("aria-selected", String(active));
      });
      var view = $("#conditions-view");
      if (view) view.innerHTML = state.conditionsTab === "regimes" ? renderRegimeWorkbench() : renderConditionsIndex();
      return;
    }
    var regimeCard = event.target.closest("[data-regime-id]");
    if (regimeCard) {
      selectRegime(regimeCard.getAttribute("data-regime-id"));
      return;
    }
    var contrast = event.target.closest("[data-contrast]");
    if (contrast) {
      state.regimeSelection = contrast.getAttribute("data-contrast").split(",");
      updateRegimeView();
      return;
    }
    var glossarySection = event.target.closest("[data-glossary-section]");
    if (glossarySection) {
      state.glossarySection = glossarySection.getAttribute("data-glossary-section");
      updateGlossaryResults();
      return;
    }
  }

  function answerQuiz(button) {
    var foundationId = button.getAttribute("data-foundation");
    var questionIndex = Number(button.getAttribute("data-question"));
    var optionIndex = Number(button.getAttribute("data-quiz-option"));
    var f = foundationById.get(foundationId);
    if (!f) return;
    var key = foundationId + ":" + questionIndex;
    if (state.quiz.has(key)) return;
    state.quiz.set(key, optionIndex);
    var card = button.closest("[data-quiz-card]");
    if (card) card.outerHTML = renderQuizCard(f, f.quiz[questionIndex], questionIndex);
    var score = $(".quiz-score");
    if (score) score.outerHTML = renderQuizScore(f);
  }

  function resetQuiz(foundationId) {
    var f = foundationById.get(foundationId);
    if (!f) return;
    f.quiz.forEach(function (question, index) { state.quiz.delete(foundationId + ":" + index); });
    var root = $("#quiz-root");
    if (root) root.innerHTML = renderQuizCards(f);
  }

  function selectRegime(id) {
    var index = state.regimeSelection.indexOf(id);
    if (index >= 0) {
      state.regimeSelection.splice(index, 1);
    } else {
      state.regimeSelection.push(id);
      if (state.regimeSelection.length > 2) state.regimeSelection.shift();
    }
    updateRegimeView();
  }

  function updateRegimeView() {
    $$("[data-regime-id]").forEach(function (card) {
      var selected = state.regimeSelection.indexOf(card.getAttribute("data-regime-id")) >= 0;
      card.classList.toggle("selected", selected);
      card.setAttribute("aria-pressed", String(selected));
    });
    var compare = $("#regime-compare");
    if (compare) compare.innerHTML = renderRegimeCompare();
    $$("[data-contrast]").forEach(function (button) {
      var pair = button.getAttribute("data-contrast").split(",");
      var active = state.regimeSelection.length === 2 && state.regimeSelection.indexOf(pair[0]) >= 0 && state.regimeSelection.indexOf(pair[1]) >= 0;
      button.classList.toggle("active", active);
    });
    if (state.regimeSelection.length === 2 && window.history && window.history.replaceState) {
      var hash = "#/conditions?tab=regimes&a=" + encodeURIComponent(state.regimeSelection[0]) + "&b=" + encodeURIComponent(state.regimeSelection[1]);
      window.history.replaceState(null, "", hash);
    }
  }

  function init() {
    applyTheme(readTheme());
    render();

    $("#theme-toggle").addEventListener("click", function () {
      applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });

    $("#menu-toggle").addEventListener("click", function () {
      var sidebar = $("#sidebar");
      if (sidebar.classList.contains("open")) closeSidebar();
      else openSidebar();
    });

    var scrim = $("#sidebar-scrim");
    if (scrim) scrim.addEventListener("click", closeSidebar);

    var searchTrigger = $("#search-trigger");
    if (searchTrigger) searchTrigger.addEventListener("click", openSearch);
    var searchClose = $("#search-close");
    if (searchClose) searchClose.addEventListener("click", closeSearch);
    var searchInput = $("#search-input");
    if (searchInput) searchInput.addEventListener("input", function () { renderSearchResults(searchInput.value); });

    var searchResults = $("#search-results");
    if (searchResults) {
      searchResults.addEventListener("click", function (event) {
        var termButton = event.target.closest("[data-search-term]");
        if (termButton) {
          event.preventDefault();
          closeSearch();
          openTerm(termButton.getAttribute("data-search-term"));
          return;
        }
        if (event.target.closest("a.search-result")) closeSearch();
      });
    }

    var overlay = $("#search-overlay");
    if (overlay) {
      overlay.addEventListener("click", function (event) {
        if (event.target === overlay) closeSearch();
      });
    }

    var drawer = $("#term-drawer");
    if (drawer) {
      drawer.addEventListener("click", function (event) {
        if (event.target.closest("[data-close-drawer]")) closeTerm();
      });
    }

    $("#main").addEventListener("click", handleMainClick);

    document.addEventListener("keydown", function (event) {
      var target = event.target;
      var typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable);
      if (event.key === "Escape") {
        if (drawer && drawer.classList.contains("open")) closeTerm();
        else if (overlay && !overlay.hidden) closeSearch();
        else closeSidebar();
      }
      if (event.key === "/" && !typing && (!overlay || overlay.hidden)) {
        event.preventDefault();
        openSearch();
      }
    });

    window.addEventListener("hashchange", function () {
      state.conditionsTab = "assumptions";
      state.regimeSelection = ["E1", "E0"];
      render();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
