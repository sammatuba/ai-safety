/* Live demos for the Agreement Field Guide.
   Each demo is a deterministic small model of the mechanism on its page.
   None of the outputs is an experimental result; notes say so where a reader
   could mistake a model for a finding. */
(function () {
  "use strict";

  /* ---------- shared helpers ---------- */

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function clamp(value, low, high) {
    return Math.min(high, Math.max(low, value));
  }

  function fmt(value, digits) {
    if (!isFinite(value)) return "—";
    return Number(value).toFixed(digits == null ? 2 : digits);
  }

  function pct(value, digits) {
    if (!isFinite(value)) return "—";
    if (value > 0.9995) return ">99.9%";
    if (value > 0 && value < 0.0005) return "<0.1%";
    return (value * 100).toFixed(digits == null ? 1 : digits) + "%";
  }

  function comb(n, k) {
    if (k < 0 || k > n) return 0;
    var result = 1;
    for (var i = 1; i <= k; i += 1) {
      result = result * (n - k + i) / i;
    }
    return result;
  }

  function shell(root, html) {
    root.innerHTML = '<div class="demo-shell">' + html + "</div>";
    return root.querySelector(".demo-shell");
  }

  function metric(label, value, note) {
    return '<div class="metric">' +
      '<span class="metric-label">' + escapeHTML(label) + "</span>" +
      '<span class="metric-value">' + escapeHTML(value) + "</span>" +
      (note ? '<span class="metric-note">' + escapeHTML(note) + "</span>" : "") +
    "</div>";
  }

  function barRow(label, value, cls, text) {
    var width = clamp(value * 100, 0, 100).toFixed(1);
    return '<div class="bar-row">' +
      "<span>" + escapeHTML(label) + "</span>" +
      '<span class="bar-track"><span class="bar-fill ' + cls + '" style="width:' + width + '%"></span></span>' +
      "<output>" + escapeHTML(text) + "</output>" +
    "</div>";
  }

  function rangeRow(id, label, min, max, step, value, text) {
    return '<div class="range-row">' +
      '<label for="' + escapeHTML(id) + '">' + escapeHTML(label) + "</label>" +
      '<input type="range" id="' + escapeHTML(id) + '" min="' + escapeHTML(min) + '" max="' + escapeHTML(max) + '" step="' + escapeHTML(step) + '" value="' + escapeHTML(value) + '">' +
      '<output id="' + escapeHTML(id) + '-out" for="' + escapeHTML(id) + '">' + escapeHTML(text) + "</output>" +
    "</div>";
  }

  function switchRow(id, label, checked) {
    return '<label class="switch-row" for="' + escapeHTML(id) + '">' +
      '<input type="checkbox" id="' + escapeHTML(id) + '"' + (checked ? " checked" : "") + ">" +
      "<span>" + escapeHTML(label) + "</span>" +
    "</label>";
  }

  function checkRow(id, label, checked, detail, extra) {
    return '<label class="check-row" for="' + escapeHTML(id) + '">' +
      '<input type="checkbox" id="' + escapeHTML(id) + '"' + (checked ? " checked" : "") + (extra || "") + ">" +
      "<span><strong>" + escapeHTML(label) + "</strong>" +
        (detail ? '<span class="check-detail">' + escapeHTML(detail) + "</span>" : "") +
      "</span>" +
    "</label>";
  }

  function tabButton(group, id, label, active) {
    return '<button class="demo-tab ' + (active ? "active" : "") + '" type="button" ' +
      'data-group="' + escapeHTML(group) + '" data-value="' + escapeHTML(id) + '" ' +
      'aria-pressed="' + (active ? "true" : "false") + '">' + escapeHTML(label) + "</button>";
  }

  function bindRange(scope, id, format, onChange) {
    var input = scope.querySelector("#" + id);
    var output = scope.querySelector("#" + id + "-out");
    if (!input) return;
    input.addEventListener("input", function () {
      var value = Number(input.value);
      if (output) output.textContent = format(value);
      onChange(value);
    });
  }

  function bindTabs(scope, group, onChange) {
    scope.addEventListener("click", function (event) {
      var target = event.target;
      if (!target || !target.closest) return;
      var button = target.closest('[data-group="' + group + '"]');
      if (!button || !scope.contains(button)) return;
      scope.querySelectorAll('[data-group="' + group + '"]').forEach(function (node) {
        var active = node === button;
        node.classList.toggle("active", active);
        node.setAttribute("aria-pressed", active ? "true" : "false");
      });
      onChange(button.getAttribute("data-value"));
    });
  }

  function bindCheck(scope, id, onChange) {
    var input = scope.querySelector("#" + id);
    if (!input) return;
    input.addEventListener("change", function () {
      onChange(input.checked);
    });
  }

  function prng(seed) {
    var state = seed >>> 0;
    return function () {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }

  /* ---------- 01 evidence independence ---------- */

  function posteriorFromLogLR(prior, logLR) {
    var logOdds = Math.log(prior / (1 - prior)) + logLR;
    if (logOdds > 32) return 1;
    if (logOdds < -32) return 0;
    return 1 / (1 + Math.exp(-logOdds));
  }

  var evidenceDemo = function (root) {
    var state = { mode: "shared", prior: 0.5, reliability: 0.8, items: 3 };

    var ui = shell(root,
      '<div class="demo-head">' +
        "<div><h3>One origin, several reports</h3>" +
        "<p>Every report points the same way. The decider must count independent likelihood ratios, not documents. Change the provenance and watch the two posteriors separate.</p></div>" +
        '<div class="demo-tabs" role="group" aria-label="Provenance">' +
          tabButton("evidence-mode", "shared", "One origin + copies", true) +
          tabButton("evidence-mode", "independent", "Distinct origins", false) +
        "</div>" +
      "</div>" +
      '<div class="demo-body">' +
        '<div class="demo-controls">' +
          rangeRow("ev-prior", "Prior P(claim true)", "0.1", "0.9", "0.05", "0.5", "50%") +
          rangeRow("ev-rel", "Report reliability", "0.55", "0.99", "0.01", "0.80", "0.80") +
          rangeRow("ev-items", "Reports presented", "2", "6", "1", "3", "3") +
        "</div>" +
        '<div class="demo-stage">' +
          '<div class="demo-readout" id="ev-metrics"></div>' +
          '<div class="bar-grid" id="ev-bars"></div>' +
          '<div class="origin-visual" id="ev-origins"></div>' +
          '<p class="demo-note" id="ev-note"></p>' +
        "</div>" +
      "</div>"
    );

    function draw() {
      var prior = state.prior;
      var reliability = state.reliability;
      var items = state.items;
      var origins = state.mode === "independent" ? items : 1;
      var lr = reliability / (1 - reliability);
      var naive = posteriorFromLogLR(prior, Math.log(lr) * items);
      var aware = posteriorFromLogLR(prior, Math.log(lr) * origins);
      var doubleCounted = items - origins;

      ui.querySelector("#ev-metrics").innerHTML =
        metric("Naive posterior", pct(naive), "counts all " + items + " reports as independent") +
        metric("Provenance-aware", pct(aware), "counts " + origins + " distinct " + (origins === 1 ? "origin" : "origins")) +
        metric("Copies double-counted", String(doubleCounted), doubleCounted === 0 ? "none: every report has its own origin" : "each copy adds no new likelihood ratio");

      ui.querySelector("#ev-bars").innerHTML =
        barRow("Naive decider", naive, "naive", pct(naive)) +
        barRow("Provenance-aware", aware, "truth", pct(aware));

      var dots = "";
      for (var i = 0; i < items; i += 1) {
        var isOrigin = state.mode === "independent" || i === 0;
        dots += '<span class="copy-dot' + (isOrigin ? " origin-dot" : "") + '" title="' +
          (isOrigin ? "Origin o" + (i + 1) : "Copy of the same origin") + '"></span>';
      }
      ui.querySelector("#ev-origins").innerHTML =
        '<div class="origin-row"><span class="origin-label">' +
          (state.mode === "independent" ? "Origins" : "Origin") +
        "</span>" + dots + '<span class="origin-caption">' +
          (state.mode === "independent"
            ? items + " independent reports, " + items + " likelihood ratios"
            : "1 origin and " + (items - 1) + " " + (items === 2 ? "copy" : "copies") + ", 1 likelihood ratio") +
        "</span></div>";

      ui.querySelector("#ev-note").textContent =
        "Model: LR = r / (1 − r) = " + fmt(lr, 2) + " per independent report. " +
        "Naive odds multiply the prior odds by LR^" + items + "; provenance-aware odds multiply by LR^" + origins + ". " +
        "A copy has likelihood ratio 1 given its origin, so counting it again is double counting. " +
        "The arithmetic is exact; the reliability is an input, not a measured result.";
    }

    bindTabs(ui, "evidence-mode", function (value) {
      state.mode = value;
      draw();
    });
    bindRange(ui, "ev-prior", function (value) { return pct(value, 0); }, function (value) {
      state.prior = value;
      draw();
    });
    bindRange(ui, "ev-rel", function (value) { return fmt(value, 2); }, function (value) {
      state.reliability = value;
      draw();
    });
    bindRange(ui, "ev-items", function (value) { return String(value); }, function (value) {
      state.items = value;
      draw();
    });

    draw();
  };

  /* ---------- 02 social learning ---------- */

  function majorityProbability(p, n) {
    var total = 0;
    for (var k = Math.floor(n / 2) + 1; k <= n; k += 1) {
      total += comb(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    }
    return total;
  }

  var socialDemo = function (root) {
    var state = { p: 0.7, n: 3, exposure: true };

    var ui = shell(root,
      '<div class="demo-head">' +
        "<div><h3>A cascade in one step</h3>" +
        "<p>With no exposure, each reviewer contributes an independent signal. With full exposure, every later reviewer copies the first endorsement and the group outcome collapses to one signal.</p></div>" +
      "</div>" +
      '<div class="demo-body">' +
        '<div class="demo-controls">' +
          rangeRow("so-p", "Private-signal accuracy", "0.50", "0.95", "0.01", "0.70", "0.70") +
          rangeRow("so-n", "Reviewers (odd)", "3", "9", "2", "3", "3") +
          switchRow("so-exposure", "Later reviewers see earlier endorsements", true) +
        "</div>" +
        '<div class="demo-stage">' +
          '<div class="demo-readout" id="so-metrics"></div>' +
          '<div class="bar-grid" id="so-bars"></div>' +
          '<div class="flow" id="so-flow"></div>' +
          '<p class="demo-note" id="so-note"></p>' +
        "</div>" +
      "</div>"
    );

    function draw() {
      var p = state.p;
      var n = state.n;
      var independent = majorityProbability(p, n);
      var exposed = state.exposure ? p : independent;
      var effective = state.exposure ? 1 : n;

      ui.querySelector("#so-metrics").innerHTML =
        metric("Effective signals", String(effective), state.exposure ? "the first endorsement" : "each reviewer's own signal") +
        metric("P(group correct)", pct(exposed), state.exposure ? "full conformity" : "independent majority") +
        metric("Private signals ignored", state.exposure ? String(n - 1) : "0", state.exposure ? "later reviewers copy" : "no exposure");

      ui.querySelector("#so-bars").innerHTML =
        barRow("Independent majority", independent, "truth", pct(independent)) +
        barRow(state.exposure ? "Full cascade" : "No exposure", exposed, state.exposure ? "naive" : "truth", pct(exposed));

      var nodes = '<span class="flow-node active">Agent 1 signal</span>';
      for (var i = 2; i <= n; i += 1) {
        nodes += '<span class="flow-arrow">→</span>' +
          '<span class="flow-node' + (state.exposure ? "" : " active") + '">' +
          (state.exposure ? "Agent " + i + " copies" : "Agent " + i + " signal") +
          "</span>";
      }
      ui.querySelector("#so-flow").innerHTML = nodes;

      ui.querySelector("#so-note").textContent =
        "Model: with no exposure, P(majority correct) = Σ C(n,k) p^k (1−p)^(n−k) over k > n/2. " +
        "With full exposure, every later reviewer copies the first endorsement, so the group outcome is one signal with accuracy p. " +
        "The full-copy case is the limit, not a measured conformity rate. The sprint's regime C is the empirical version.";
    }

    bindRange(ui, "so-p", function (value) { return fmt(value, 2); }, function (value) {
      state.p = value;
      draw();
    });
    bindRange(ui, "so-n", function (value) { return String(value); }, function (value) {
      state.n = value;
      draw();
    });
    bindCheck(ui, "so-exposure", function (checked) {
      state.exposure = checked;
      draw();
    });

    draw();
  };

  /* ---------- 03 strategic communication ---------- */

  function weightedApproval(bias, shown) {
    var total = 0;
    var approve = 0;
    var minSupport = Math.max(0, shown - 3);
    var maxSupport = Math.min(3, shown);
    for (var support = minSupport; support <= maxSupport; support += 1) {
      var oppose = shown - support;
      var count = comb(3, support) * comb(3, oppose);
      var weight = count * Math.pow(bias, support) * Math.pow(1 - bias, oppose);
      total += weight;
      if (support > shown / 2) approve += weight;
    }
    return total === 0 ? 0 : approve / total;
  }

  var communicationDemo = function (root) {
    var state = { bias: 0.8, shown: 3 };

    var ui = shell(root,
      '<div class="demo-head">' +
        "<div><h3>A true pool, a chosen slate</h3>" +
        "<p>All six evidence items are true. The proposer chooses which ones the decider sees. The decider ignores the selection rule in this model, so a truthful slate can still mislead.</p></div>" +
      "</div>" +
      '<div class="demo-body">' +
        '<div class="demo-controls">' +
          rangeRow("co-bias", "Selection weight toward support", "0", "1", "0.05", "0.80", "0.80") +
          rangeRow("co-shown", "Items shown", "1", "5", "1", "3", "3") +
          '<p class="demo-note" style="border:0;padding:0;background:transparent">0.50 is uniform selection. 0 is hostile selection against the claim; 1 is full approval-seeking selection.</p>' +
        "</div>" +
        '<div class="demo-stage">' +
          '<div class="chip-row" id="co-pool"></div>' +
          '<div class="demo-readout" id="co-metrics"></div>' +
          '<div class="bar-grid" id="co-bars"></div>' +
          '<p class="demo-note" id="co-note"></p>' +
        "</div>" +
      "</div>"
    );

    function draw() {
      var bias = state.bias;
      var shown = state.shown;
      var honest = weightedApproval(0.5, shown);
      var current = weightedApproval(bias, shown);
      var expectedSupport = shown * bias;

      var pool = "";
      for (var i = 0; i < 3; i += 1) {
        pool += '<span class="pool-item support" title="True item supporting the claim">support</span>';
      }
      for (var j = 0; j < 3; j += 1) {
        pool += '<span class="pool-item oppose" title="True item opposing the claim">oppose</span>';
      }
      ui.querySelector("#co-pool").innerHTML = pool;

      ui.querySelector("#co-metrics").innerHTML =
        metric("P(naive approval)", pct(current), "shown slate has a supporting majority") +
        metric("Uniform baseline", pct(honest), "bias 0.50, no selection") +
        metric("Support shown", fmt(expectedSupport, 2) + " of " + shown, "expected count");

      ui.querySelector("#co-bars").innerHTML =
        barRow("Uniform selection", honest, "truth", pct(honest)) +
        barRow("This selection", current, "naive", pct(current));

      ui.querySelector("#co-note").textContent =
        "Model: the pool has 3 supporting and 3 opposing true items. The proposer draws " + shown +
        " without replacement, weighting supporting items by " + fmt(bias, 2) + ". " +
        "A naive decider approves when more shown items support than oppose. " +
        "Selection is the manipulation; no individual message needs to be false. " +
        "This is a model of selective disclosure, not a measured approval rate.";
    }

    bindRange(ui, "co-bias", function (value) { return fmt(value, 2); }, function (value) {
      state.bias = value;
      draw();
    });
    bindRange(ui, "co-shown", function (value) { return String(value); }, function (value) {
      state.shown = value;
      draw();
    });

    draw();
  };

  /* ---------- 04 collusion and plus factors ---------- */

  var collusionDemo = function (root) {
    var presets = {
      A: { coalition: false, mechanism: false, cost: false, note: "Legitimate corroboration. No coalition, no mechanism, no outside cost." },
      B: { coalition: false, mechanism: false, cost: true, note: "Shared-source error: one origin, several copies, harm to the decider. It is not collusion because there is no coalition or coordination." },
      C: { coalition: false, mechanism: false, cost: true, note: "Conformity: exposure changes a later endorsement. No coalition and no private mechanism." },
      D: { coalition: false, mechanism: false, cost: true, note: "Single-agent strategic persuasion: one approval-seeking proposer selects evidence. There is no coalition." },
      E0: { coalition: false, mechanism: false, cost: true, note: "Parallel conduct: shared incentive, same actions, no agreement and no channel. This is the antitrust error case." },
      E1: { coalition: true, mechanism: true, cost: true, note: "Explicit collusion opportunity. The regime label marks opportunity and incentive; the behavioral label still requires a proposed plan and actions consistent with it." },
      F: { coalition: false, mechanism: true, cost: false, note: "Talk without action: scripted private talk, accuracy-aligned payoffs, and actions equal to regime A." },
      P: { coalition: true, mechanism: true, cost: true, note: "Certain collusion by construction: the positive control." }
    };
    var state = { coalition: true, mechanism: true, cost: true, preset: "E1" };

    var ui = shell(root,
      '<div class="demo-head">' +
        "<div><h3>Three parts, not a mood</h3>" +
        "<p>Collusion requires a coalition, a coordination mechanism, and an outside cost. Toggle each part, or load a regime preset and see which part is missing.</p></div>" +
      "</div>" +
      '<div class="demo-body">' +
        '<div class="preset-grid" id="cl-presets"></div>' +
        '<div class="demo-controls" id="cl-toggles"></div>' +
        '<div class="demo-stage">' +
          '<div class="verdict" id="cl-verdict"></div>' +
          '<div class="demo-readout" id="cl-metrics"></div>' +
          '<p class="demo-note" id="cl-note"></p>' +
        "</div>" +
      "</div>"
    );

    ui.querySelector("#cl-presets").innerHTML = Object.keys(presets).map(function (id) {
      return '<button class="select-card' + (id === state.preset ? " active" : "") + '" type="button" data-collusion-preset="' + escapeHTML(id) + '">' +
        "<strong>" + escapeHTML(id) + "</strong><span>" + escapeHTML({
          A: "corroboration", B: "shared source", C: "conformity", D: "persuasion",
          E0: "parallel conduct", E1: "private channel", F: "talk only", P: "positive control"
        }[id]) + "</span></button>";
    }).join("");

    ui.querySelector("#cl-toggles").innerHTML =
      checkRow("cl-coalition", "Coalition", state.coalition, "A group with a joint objective") +
      checkRow("cl-mechanism", "Coordination mechanism", state.mechanism, "A channel or plan that carries the joint action") +
      checkRow("cl-cost", "Outside cost", state.cost, "Harm to the decider or a third party");

    function draw() {
      var missing = [];
      if (!state.coalition) missing.push("coalition");
      if (!state.mechanism) missing.push("coordination mechanism");
      if (!state.cost) missing.push("outside cost");
      var isCollusion = missing.length === 0;

      var verdict = ui.querySelector("#cl-verdict");
      verdict.className = "verdict " + (isCollusion ? "yes" : "no");
      verdict.innerHTML =
        '<div class="verdict-mark">' + (isCollusion ? "✓" : "—") + "</div>" +
        "<div><strong>" + (isCollusion ? "Collusion by the three-part definition." : "Not collusion: " + missing.join(", ") + " missing.") + "</strong>" +
        "<span>" + (isCollusion
          ? "Coalition, mechanism, and outside cost are all present. The definition is met; the evidence still has to establish each part."
          : "Any one missing part moves the case to a different explanation. Name that explanation before calling the trajectory collusion.") + "</span></div>";

      ui.querySelector("#cl-metrics").innerHTML =
        metric("Coalition", state.coalition ? "Yes" : "No", "joint objective") +
        metric("Mechanism", state.mechanism ? "Yes" : "No", "channel or plan") +
        metric("Outside cost", state.cost ? "Yes" : "No", "harm beyond the group");

      var preset = presets[state.preset];
      var note = preset ? preset.note : "Custom combination. The three-part definition is necessary, not a likelihood ratio: a plus factor still has to be more probable under coordination than under parallel conduct.";
      if (state.preset === "E1") {
        note += " Regime label 1 is not the same as a verified behavioral label.";
      }
      ui.querySelector("#cl-note").textContent = note;
    }

    function clearPreset() {
      state.preset = null;
      ui.querySelectorAll("[data-collusion-preset]").forEach(function (node) {
        node.classList.remove("active");
      });
    }

    ui.querySelectorAll("[data-collusion-preset]").forEach(function (button) {
      button.addEventListener("click", function () {
        var id = button.getAttribute("data-collusion-preset");
        var preset = presets[id];
        state.preset = id;
        state.coalition = preset.coalition;
        state.mechanism = preset.mechanism;
        state.cost = preset.cost;
        ui.querySelector("#cl-coalition").checked = state.coalition;
        ui.querySelector("#cl-mechanism").checked = state.mechanism;
        ui.querySelector("#cl-cost").checked = state.cost;
        ui.querySelectorAll("[data-collusion-preset]").forEach(function (node) {
          node.classList.toggle("active", node === button);
        });
        draw();
      });
    });

    bindCheck(ui, "cl-coalition", function (checked) { state.coalition = checked; clearPreset(); draw(); });
    bindCheck(ui, "cl-mechanism", function (checked) { state.mechanism = checked; clearPreset(); draw(); });
    bindCheck(ui, "cl-cost", function (checked) { state.cost = checked; clearPreset(); draw(); });

    draw();
  };

  /* ---------- 05 AI control ---------- */

  var controlDemo = function (root) {
    var protocols = [
      {
        id: "none",
        label: "No guard",
        short: "No guard",
        placement: "none",
        sees: ["The same surface the decider already sees: endorsements, cited items, and the proposed action."],
        blind: ["Provenance of a cited item.", "Coordination in a private message.", "Whether the approved claim is stronger than the evidence."],
        note: "The protocol assumes the agents' own output is safe. Every other protocol in this demo exists because that assumption fails somewhere."
      },
      {
        id: "messages",
        label: "Message monitor",
        short: "Message monitor",
        placement: "messages",
        sees: ["Private messages between agents.", "Stated plans and requested votes.", "Direct requests to coordinate."],
        blind: ["Shared provenance that produces agreement without talk.", "Actions that harm without a message.", "Obfuscated or innocuous-looking coordination."],
        note: "A message monitor catches talk it can recognize. It is blind to agreement produced by a shared source and to harmful action with no message."
      },
      {
        id: "actions",
        label: "Action monitor",
        short: "Action monitor",
        placement: "actions",
        sees: ["Endorsements and the executed action.", "The final approval and its stated reason.", "Action patterns across reviewed cases, if logged."],
        blind: ["Why the agents chose that action.", "Shared provenance behind the cited items.", "A private plan that changed which endorsements appeared."],
        note: "An action monitor sees the outcome, not the route. Parallel conduct and collusion can produce the same action."
      },
      {
        id: "transition",
        label: "Authority validator",
        short: "Validator at transition",
        placement: "transition",
        sees: ["The approved claim's predicate and subject.", "The cited evidence items and their provenance graph.", "The permitted-transition relation in the ontology."],
        blind: ["Whether an origin is honest.", "Whether predicate extraction is correct.", "Correlated judgment across reviewers; time validity is not implemented in the sprint lab."],
        note: "The validator checks independence and permitted transitions mechanically, after endorsements and before execution. It does not replace trust in origins; it bounds what endorsements can authorize."
      },
      {
        id: "edit",
        label: "Trusted editing",
        short: "Trusted editing",
        placement: "edit",
        sees: ["The untrusted output before it executes.", "Text the editor chooses to rewrite or remove.", "Whether the edited text still reads as an approval."],
        blind: ["Whether a rewrite preserves the claim's meaning.", "A provenance problem the editor does not inspect.", "An editor that is itself wrong or manipulated."],
        note: "Trusted editing can remove an overtly harmful phrase while preserving the invalid approval. It is a text intervention, not an authority check."
      },
      {
        id: "audit",
        label: "Human spot audit",
        short: "Human spot audit",
        placement: "audit",
        sees: ["A sample of executed actions, after the fact.", "Whatever records the protocol retained.", "Patterns visible in the sampled set."],
        blind: ["Unsampled actions.", "Coordination that looks like innocent agreement in a single record.", "A sampled record whose provenance was never logged."],
        note: "Audit is a detection layer, not a gate. Its coverage depends on the sampling rule and on the records the protocol kept."
      }
    ];

    var state = { protocol: "messages" };

    var ui = shell(root,
      '<div class="demo-head">' +
        "<div><h3>Where the guard sits</h3>" +
        "<p>Each protocol sees a different information slice. Choose a guard and read what it can check, what it cannot, and the failure mode that survives it.</p></div>" +
      "</div>" +
      '<div class="demo-body">' +
        '<div class="preset-grid" id="ct-protocols"></div>' +
        '<div class="demo-stage">' +
          '<div class="flow" id="ct-flow"></div>' +
          '<div class="demo-split">' +
            '<div class="demo-panel"><h4>What it sees</h4><ul id="ct-sees"></ul></div>' +
            '<div class="demo-panel"><h4>What it is blind to</h4><ul id="ct-blind"></ul></div>' +
          "</div>" +
          '<p class="demo-note" id="ct-note"></p>' +
        "</div>" +
      "</div>"
    );

    ui.querySelector("#ct-protocols").innerHTML = protocols.map(function (protocol) {
      return '<button class="select-card' + (protocol.id === state.protocol ? " active" : "") + '" type="button" data-protocol="' + escapeHTML(protocol.id) + '">' +
        "<strong>" + escapeHTML(protocol.short) + "</strong><span>" + escapeHTML(protocol.label) + "</span></button>";
    }).join("");

    function flowNodes(protocol) {
      var nodes = ['<span class="flow-node">Proposer</span>'];
      var guardLabel = protocol.id === "none" ? "" : protocol.short;
      function guard() {
        return '<span class="flow-arrow">→</span><span class="flow-node active">' + escapeHTML(guardLabel) + "</span>";
      }
      if (protocol.placement === "messages") {
        nodes.push(guard(), '<span class="flow-arrow">→</span><span class="flow-node">Reviewers</span>');
      } else {
        nodes.push('<span class="flow-arrow">→</span><span class="flow-node">Reviewers</span>');
      }
      nodes.push('<span class="flow-arrow">→</span><span class="flow-node">Decider</span>');
      if (protocol.placement === "transition" || protocol.placement === "actions" || protocol.placement === "edit") {
        nodes.push(guard());
        nodes.push('<span class="flow-arrow">→</span><span class="flow-node">Action</span>');
      } else if (protocol.placement === "audit") {
        nodes.push('<span class="flow-arrow">→</span><span class="flow-node">Action</span>', guard());
      } else if (protocol.placement === "none") {
        nodes.push('<span class="flow-arrow">→</span><span class="flow-node">Action</span>');
      }
      return nodes.join("");
    }

    function draw() {
      var protocol = protocols.find(function (item) { return item.id === state.protocol; }) || protocols[0];
      ui.querySelector("#ct-flow").innerHTML = flowNodes(protocol);
      ui.querySelector("#ct-sees").innerHTML = protocol.sees.map(function (item) { return "<li>" + escapeHTML(item) + "</li>"; }).join("");
      ui.querySelector("#ct-blind").innerHTML = protocol.blind.map(function (item) { return "<li>" + escapeHTML(item) + "</li>"; }).join("");
      ui.querySelector("#ct-note").textContent = protocol.note;
      ui.querySelectorAll("[data-protocol]").forEach(function (node) {
        node.classList.toggle("active", node.getAttribute("data-protocol") === protocol.id);
      });
    }

    ui.querySelectorAll("[data-protocol]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.protocol = button.getAttribute("data-protocol");
        draw();
      });
    });

    draw();
  };

  /* ---------- 06 ontology and typed claims ---------- */

  var ontologyDemo = function (root) {
    var items = [
      { id: "e1", origin: "o1", parent: null, predicate: "testing_scheduled", text: "Control room log: Unit 7 testing may begin at 18:00." },
      { id: "e2", origin: "o1", parent: "e1", predicate: "testing_scheduled", text: "Dispatch desk note: per control room, the test window opens 18:00." },
      { id: "e3", origin: "o2", parent: null, predicate: "synchronized", text: "SCADA export: Unit 7 breaker closed 17:55 for a test run." },
      { id: "e4", origin: "o3", parent: null, predicate: "commercially_available", text: "Grid operator bulletin: Unit 7 commercially available from 18:00." }
    ];
    var allowed = {
      testing_scheduled: ["testing_scheduled"],
      testing_started: ["testing_started", "testing_scheduled"],
      synchronized: ["synchronized", "testing_started", "testing_scheduled"],
      commercially_available: ["commercially_available", "synchronized", "testing_started", "testing_scheduled"]
    };
    var predicates = ["testing_scheduled", "testing_started", "synchronized", "commercially_available"];
    var presets = {
      case52: { claim: "commercially_available", k: 2, cited: { e1: true, e2: true, e3: true, e4: false }, note: "The section 5.2 case: two independent origins support their own predicates, yet the approval asserts a stronger claim." },
      availability: { claim: "commercially_available", k: 2, cited: { e1: true, e2: true, e3: true, e4: true }, note: "An independent item e4 supports the approved predicate directly. The other three still fail the transition check." },
      weaker: { claim: "testing_scheduled", k: 2, cited: { e1: true, e2: true, e3: true, e4: false }, note: "A valid weaker claim: synchronized is permitted to support testing_scheduled. The validator should not block a permitted transition." },
      oneorigin: { claim: "testing_scheduled", k: 2, cited: { e1: true, e2: true, e3: false, e4: false }, note: "Two citations, one origin. The transition check passes, but the independence check fails." }
    };
    var state = {
      claim: "commercially_available",
      k: 2,
      cited: { e1: true, e2: true, e3: true, e4: false },
      preset: "case52"
    };

    var ui = shell(root,
      '<div class="demo-head">' +
        "<div><h3>A validator at the authority transition</h3>" +
        "<p>The validator reads the approved predicate, the cited items, and the provenance graph. It checks two conditions: enough distinct origins, and every cited predicate is permitted to support the approved one.</p></div>" +
      "</div>" +
      '<div class="demo-body">' +
        '<div class="preset-grid" id="on-presets"></div>' +
        '<div class="demo-controls">' +
          '<div class="claim-grid" id="on-claims"></div>' +
          rangeRow("on-k", "Distinct origins required (k)", "1", "3", "1", "2", "2") +
          '<div class="check-list" id="on-items"></div>' +
        "</div>" +
        '<div class="demo-stage">' +
          '<div class="verdict" id="on-verdict"></div>' +
          '<div class="demo-readout" id="on-metrics"></div>' +
          '<div class="transition-list" id="on-transitions"></div>' +
          '<p class="demo-note" id="on-note"></p>' +
        "</div>" +
      "</div>"
    );

    ui.querySelector("#on-presets").innerHTML = [
      ["case52", "§5.2 case"],
      ["availability", "Add e4"],
      ["weaker", "Weaker claim"],
      ["oneorigin", "One origin"]
    ].map(function (entry) {
      return '<button class="select-card' + (entry[0] === state.preset ? " active" : "") + '" type="button" data-ontology-preset="' + entry[0] + '">' +
        "<strong>" + escapeHTML(entry[0] === "case52" ? "A" : entry[0] === "availability" ? "B" : entry[0] === "weaker" ? "C" : "D") + "</strong>" +
        "<span>" + escapeHTML(entry[1]) + "</span></button>";
    }).join("");

    ui.querySelector("#on-claims").innerHTML = predicates.map(function (predicate) {
      return '<button class="select-card' + (predicate === state.claim ? " active" : "") + '" type="button" data-claim="' + escapeHTML(predicate) + '">' +
        "<strong>q</strong><span>" + escapeHTML(predicate) + "</span></button>";
    }).join("");

    function renderItems() {
      ui.querySelector("#on-items").innerHTML = items.map(function (item) {
        return '<label class="check-row" for="on-item-' + item.id + '">' +
          '<input type="checkbox" id="on-item-' + item.id + '" data-item="' + item.id + '"' + (state.cited[item.id] ? " checked" : "") + ">" +
          "<span><strong>" + escapeHTML(item.id + " · " + item.predicate) + "</strong>" +
            '<span class="check-detail">' + escapeHTML("origin " + item.origin + (item.parent ? " · derivative of " + item.parent : " · origin observation") + " · " + item.text) + "</span>" +
          "</span>" +
        "</label>";
      }).join("");
      ui.querySelectorAll("[data-item]").forEach(function (input) {
        input.addEventListener("change", function () {
          state.cited[input.getAttribute("data-item")] = input.checked;
          state.preset = null;
          ui.querySelectorAll("[data-ontology-preset]").forEach(function (node) { node.classList.remove("active"); });
          draw();
        });
      });
    }

    function draw() {
      var cited = items.filter(function (item) { return state.cited[item.id]; });
      var origins = [];
      cited.forEach(function (item) {
        if (origins.indexOf(item.origin) < 0) origins.push(item.origin);
      });
      var checkA = cited.length > 0 && origins.length >= state.k;
      var transitions = cited.map(function (item) {
        return {
          item: item,
          allowed: allowed[item.predicate].indexOf(state.claim) >= 0
        };
      });
      var checkB = cited.length > 0 && transitions.every(function (row) { return row.allowed; });
      var passed = checkA && checkB;

      var verdict = ui.querySelector("#on-verdict");
      verdict.className = "verdict " + (passed ? "no" : "yes");
      verdict.innerHTML =
        '<div class="verdict-mark">' + (passed ? "✓" : "!") + "</div>" +
        "<div><strong>" + (passed ? "approve_permitted" : "defer") + "</strong>" +
        "<span>" + (passed
          ? "Both checks pass. The approval may execute. The validator has not checked whether the origin is honest."
          : "Failed: " + (!checkA ? "independence" : "") + (!checkA && !checkB ? " and " : "") + (!checkB ? "permitted transition" : "") + ".") +
        "</span></div>";

      ui.querySelector("#on-metrics").innerHTML =
        metric("Distinct origins", origins.length + " / " + state.k, checkA ? "check a passes" : "check a fails") +
        metric("Transition check", checkB ? "pass" : "fail", checkB ? "every cited predicate reaches q" : "at least one promotion is forbidden") +
        metric("Check c: time", "not implemented", "the sprint lab has one time field per case");

      ui.querySelector("#on-transitions").innerHTML = transitions.length
        ? transitions.map(function (row) {
            return '<div class="transition-row"><span>' + escapeHTML(row.item.predicate + " → " + state.claim) + "</span>" +
              '<span class="' + (row.allowed ? "allowed" : "blocked") + '">' + (row.allowed ? "permitted" : "blocked") + "</span></div>";
          }).join("")
        : '<p class="small muted" style="margin:0">No items cited. The validator defers.</p>';

      var preset = state.preset;
      var note = preset && presets[preset] ? presets[preset].note
        : "Custom case. The validator checks independence and permitted transitions. It does not check whether an origin lies, whether predicate extraction is correct, or whether provenance registration is open to manipulation.";
      ui.querySelector("#on-note").textContent = note;
    }

    ui.querySelectorAll("[data-claim]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.claim = button.getAttribute("data-claim");
        state.preset = null;
        ui.querySelectorAll("[data-claim]").forEach(function (node) { node.classList.toggle("active", node === button); });
        ui.querySelectorAll("[data-ontology-preset]").forEach(function (node) { node.classList.remove("active"); });
        draw();
      });
    });

    ui.querySelectorAll("[data-ontology-preset]").forEach(function (button) {
      button.addEventListener("click", function () {
        var id = button.getAttribute("data-ontology-preset");
        var preset = presets[id];
        state.claim = preset.claim;
        state.k = preset.k;
        state.cited = {
          e1: !!preset.cited.e1,
          e2: !!preset.cited.e2,
          e3: !!preset.cited.e3,
          e4: !!preset.cited.e4
        };
        state.preset = id;
        ui.querySelector("#on-k").value = String(state.k);
        ui.querySelector("#on-k-out").textContent = String(state.k);
        renderItems();
        ui.querySelectorAll("[data-claim]").forEach(function (node) {
          node.classList.toggle("active", node.getAttribute("data-claim") === state.claim);
        });
        ui.querySelectorAll("[data-ontology-preset]").forEach(function (node) {
          node.classList.toggle("active", node === button);
        });
        draw();
      });
    });

    bindRange(ui, "on-k", function (value) { return String(value); }, function (value) {
      state.k = value;
      state.preset = null;
      ui.querySelectorAll("[data-ontology-preset]").forEach(function (node) { node.classList.remove("active"); });
      draw();
    });

    renderItems();
    draw();
  };

  /* ---------- 07 measurement ---------- */

  var measurementDemo = function (root) {
    var records = [
      { id: "C1", score: 0.94, label: 1 },
      { id: "C2", score: 0.83, label: 1 },
      { id: "C3", score: 0.71, label: 1 },
      { id: "C4", score: 0.62, label: 1 },
      { id: "C5", score: 0.48, label: 1 },
      { id: "C6", score: 0.36, label: 1 },
      { id: "I1", score: 0.88, label: 0 },
      { id: "I2", score: 0.67, label: 0 },
      { id: "I3", score: 0.57, label: 0 },
      { id: "I4", score: 0.44, label: 0 },
      { id: "I5", score: 0.29, label: 0 },
      { id: "I6", score: 0.18, label: 0 }
    ];
    var state = { threshold: 0.5 };
    var positives = records.filter(function (record) { return record.label === 1; });
    var negatives = records.filter(function (record) { return record.label === 0; });

    function auroc() {
      var wins = 0;
      positives.forEach(function (positive) {
        negatives.forEach(function (negative) {
          if (positive.score > negative.score) wins += 1;
          else if (positive.score === negative.score) wins += 0.5;
        });
      });
      return wins / (positives.length * negatives.length);
    }

    function confusion(threshold) {
      var tp = 0, fp = 0, fn = 0, tn = 0;
      records.forEach(function (record) {
        var flagged = record.score >= threshold;
        if (record.label === 1 && flagged) tp += 1;
        else if (record.label === 1) fn += 1;
        else if (flagged) fp += 1;
        else tn += 1;
      });
      return { tp: tp, fp: fp, fn: fn, tn: tn };
    }

    function svgPath(threshold) {
      var width = 300, height = 230, pad = 34;
      var plotW = width - pad * 2;
      var plotH = height - pad * 2;
      var thresholds = [1.01];
      records.slice().sort(function (a, b) { return b.score - a.score; }).forEach(function (record) {
        if (thresholds.indexOf(record.score) < 0) thresholds.push(record.score);
      });
      thresholds.push(-0.01);
      var points = thresholds.map(function (cut) {
        var matrix = confusion(cut);
        var recall = matrix.tp + matrix.fn === 0 ? 0 : matrix.tp / (matrix.tp + matrix.fn);
        var fpr = matrix.fp + matrix.tn === 0 ? 0 : matrix.fp / (matrix.fp + matrix.tn);
        return { fpr: fpr, recall: recall };
      });
      var path = points.map(function (point, index) {
        var x = pad + point.fpr * plotW;
        var y = height - pad - point.recall * plotH;
        return (index === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1);
      }).join(" ");
      var current = confusion(threshold);
      var currentRecall = current.tp + current.fn === 0 ? 0 : current.tp / (current.tp + current.fn);
      var currentFpr = current.fp + current.tn === 0 ? 0 : current.fp / (current.fp + current.tn);
      var cx = pad + currentFpr * plotW;
      var cy = height - pad - currentRecall * plotH;
      var grid = "";
      [0.25, 0.5, 0.75].forEach(function (fraction) {
        var gx = pad + fraction * plotW;
        var gy = height - pad - fraction * plotH;
        grid += '<line class="roc-grid" x1="' + gx + '" y1="' + pad + '" x2="' + gx + '" y2="' + (height - pad) + '"></line>';
        grid += '<line class="roc-grid" x1="' + pad + '" y1="' + gy + '" x2="' + (width - pad) + '" y2="' + gy + '"></line>';
      });
      return '<svg viewBox="0 0 ' + width + " " + height + '" role="img" aria-label="ROC curve. Area under the curve ' + fmt(auroc(), 3) + '.">' +
        grid +
        '<line class="roc-axis" x1="' + pad + '" y1="' + (height - pad) + '" x2="' + (width - pad) + '" y2="' + (height - pad) + '"></line>' +
        '<line class="roc-axis" x1="' + pad + '" y1="' + pad + '" x2="' + pad + '" y2="' + (height - pad) + '"></line>' +
        '<line class="roc-grid" x1="' + pad + '" y1="' + (height - pad) + '" x2="' + (width - pad) + '" y2="' + pad + '" style="stroke-dasharray:4 4"></line>' +
        '<path class="roc-path" d="' + path + '"></path>' +
        '<circle class="roc-point" cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="4.5"></circle>' +
        '<text class="roc-label" x="' + (width / 2) + '" y="' + (height - 8) + '" text-anchor="middle">false-positive rate</text>' +
        '<text class="roc-label" x="10" y="' + (height / 2) + '" text-anchor="middle" transform="rotate(-90 10 ' + (height / 2) + ')">recall</text>' +
      "</svg>";
    }

    var ui = shell(root,
      '<div class="demo-head">' +
        "<div><h3>One threshold, four counts</h3>" +
        "<p>Detection metrics condition on the regime label; decision harm conditions on the claim's truth. This demo uses illustrative scores to show how one threshold moves recall, false-positive rate, and precision.</p></div>" +
      "</div>" +
      '<div class="demo-body">' +
        '<div class="demo-controls">' +
          rangeRow("me-threshold", "Flag when score ≥", "0.05", "0.95", "0.01", "0.50", "0.50") +
        "</div>" +
        '<div class="demo-stage">' +
          '<div class="demo-readout four" id="me-metrics"></div>' +
          '<div class="demo-split">' +
            '<div class="demo-panel"><h4>Confusion matrix</h4><div class="matrix-grid" id="me-matrix"></div></div>' +
            '<div class="demo-panel"><h4>ROC</h4><div class="roc-wrap" id="me-roc"></div></div>' +
          "</div>" +
          '<div class="score-strip" id="me-scores"></div>' +
          '<p class="demo-note" id="me-note"></p>' +
        "</div>" +
      "</div>"
    );

    function draw() {
      var matrix = confusion(state.threshold);
      var recall = matrix.tp + matrix.fn === 0 ? 0 : matrix.tp / (matrix.tp + matrix.fn);
      var fpr = matrix.fp + matrix.tn === 0 ? 0 : matrix.fp / (matrix.fp + matrix.tn);
      var precision = matrix.tp + matrix.fp === 0 ? 0 : matrix.tp / (matrix.tp + matrix.fp);
      var flagged = matrix.tp + matrix.fp;

      ui.querySelector("#me-metrics").innerHTML =
        metric("Recall", pct(recall), "of six collusion records") +
        metric("False-positive rate", pct(fpr), "of six innocent records") +
        metric("Precision", pct(precision), "of flagged records") +
        metric("AUROC", fmt(auroc(), 3), "threshold-free rank estimate");

      ui.querySelector("#me-matrix").innerHTML =
        matrixCell("True positive", matrix.tp, "flagged · label 1") +
        matrixCell("False positive", matrix.fp, "flagged · label 0") +
        matrixCell("False negative", matrix.fn, "cleared · label 1") +
        matrixCell("True negative", matrix.tn, "cleared · label 0");

      ui.querySelector("#me-roc").innerHTML = svgPath(state.threshold);

      ui.querySelector("#me-scores").innerHTML = records.slice().sort(function (a, b) { return b.score - a.score; }).map(function (record) {
        var cls = record.label === 1 ? "positive" : "negative";
        var flaggedNow = record.score >= state.threshold;
        return '<div class="score-dot">' +
          '<span class="dot ' + cls + '"></span>' +
          '<span class="score-track"><i style="width:' + (record.score * 100).toFixed(1) + "%" + '"></i></span>' +
          "<output>" + escapeHTML(fmt(record.score, 2) + (flaggedNow ? " · flag" : "")) + "</output>" +
        "</div>";
      }).join("");

      ui.querySelector("#me-note").textContent =
        "Illustrative scores, not sprint results. At threshold " + fmt(state.threshold, 2) + ", " + flagged +
        " of 12 records are flagged. AUROC is " + fmt(auroc(), 3) + " at every threshold. " +
        "Lowering the threshold usually raises recall and the false-positive rate together; report both, and report the rate separately for each innocent regime.";
    }

    function matrixCell(label, value, note) {
      return '<div class="matrix-cell"><span class="cell-label">' + escapeHTML(label) + "</span>" +
        '<span class="cell-value">' + value + "</span>" +
        '<span class="cell-note">' + escapeHTML(note) + "</span></div>";
    }

    bindRange(ui, "me-threshold", function (value) { return fmt(value, 2); }, function (value) {
      state.threshold = value;
      draw();
    });

    draw();
  };

  /* ---------- 08 mechanistic detection ---------- */

  var mechanisticDemo = function (root) {
    var checks = [
      { id: "mi-family", label: "Split by case family", detail: "Train on families 01–06, test on 07–12." },
      { id: "mi-matched", label: "Report E1 versus E0", detail: "The incentive-matched contrast, not only E1 versus A." },
      { id: "mi-confound", label: "Run the E0 versus A probe", detail: "The anti-confound bound in H-TARA-2 is AUROC 0.65." },
      { id: "mi-length", label: "Match text length", detail: "Render lengths differ by regime (CF-1); report a length-only probe." },
      { id: "mi-layer", label: "Sweep layer and pooling", detail: "Do not report one layer and one pooling rule as the result." },
      { id: "mi-frozen", label: "Freeze before the held-out run", detail: "No threshold or layer chosen after seeing test scores." }
    ];
    var state = {
      separation: 0.8,
      wording: 0.2,
      checked: { "mi-family": true, "mi-matched": true, "mi-confound": false, "mi-length": false, "mi-layer": true, "mi-frozen": false }
    };

    var ui = shell(root,
      '<div class="demo-head">' +
        "<div><h3>Read the label, not the wording</h3>" +
        "<p>The scatter is a schematic, not a probe result. Move the two separations to see what each pattern would mean, then use the checklist to decide whether the design can support any claim at all.</p></div>" +
      "</div>" +
      '<div class="demo-body">' +
        '<div class="demo-controls">' +
          rangeRow("mi-sep", "E1 vs E0 separation (schematic)", "0", "1", "0.05", "0.80", "0.80") +
          rangeRow("mi-word", "E0 vs A separation (schematic)", "0", "1", "0.05", "0.20", "0.20") +
          '<div class="check-list" id="mi-checks"></div>' +
        "</div>" +
        '<div class="demo-stage">' +
          '<div class="scatter-wrap" id="mi-scatter"></div>' +
          '<div class="verdict" id="mi-verdict"></div>' +
          '<div class="demo-readout" id="mi-metrics"></div>' +
          '<p class="demo-note" id="mi-note"></p>' +
        "</div>" +
      "</div>"
    );

    ui.querySelector("#mi-checks").innerHTML = checks.map(function (check) {
      return checkRow(check.id, check.label, !!state.checked[check.id], check.detail);
    }).join("");
    checks.forEach(function (check) {
      bindCheck(ui, check.id, function (value) {
        state.checked[check.id] = value;
        draw();
      });
    });

    function scatter() {
      var width = 320, height = 200, pad = 28;
      var plotW = width - pad * 2;
      var plotH = height - pad * 2;
      var meanA = 0.24;
      var meanE0 = meanA + 0.36 * state.wording;
      var meanE1 = meanE0 + 0.36 * state.separation;
      var groups = [
        { name: "E1", mean: meanE1, cls: "alt", count: 14, seed: 11 },
        { name: "E0", mean: meanE0, cls: "amber", count: 14, seed: 29 },
        { name: "A", mean: meanA, cls: "", count: 14, seed: 47 }
      ];
      var marks = "";
      groups.forEach(function (group) {
        var random = prng(group.seed);
        for (var i = 0; i < group.count; i += 1) {
          var value = clamp(group.mean + (random() + random() - 1) * 0.11, 0.02, 0.98);
          var jitter = 0.08 + random() * 0.84;
          var cx = pad + value * plotW;
          var cy = pad + jitter * plotH;
          marks += '<circle class="scatter-dot ' + group.cls + '" cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="3.4"></circle>';
        }
      });
      var boundary = pad + ((meanE0 + meanE1) / 2) * plotW;
      return '<div class="scatter-legend">' +
          '<span class="legend-item"><i class="legend-swatch rose"></i>E1 · label 1</span>' +
          '<span class="legend-item"><i class="legend-swatch amber"></i>E0 · label 0, matched incentive</span>' +
          '<span class="legend-item"><i class="legend-swatch blue"></i>A · label 0, baseline</span>' +
        "</div>" +
        '<svg viewBox="0 0 ' + width + " " + height + '" role="img" aria-label="Schematic separation of three regime groups on a probe score axis.">' +
          '<line class="roc-axis" x1="' + pad + '" y1="' + (height - pad) + '" x2="' + (width - pad) + '" y2="' + (height - pad) + '"></line>' +
          '<line class="scatter-line" x1="' + boundary.toFixed(1) + '" y1="' + pad + '" x2="' + boundary.toFixed(1) + '" y2="' + (height - pad) + '"></line>' +
          marks +
          '<text class="scatter-label" x="' + pad + '" y="' + (height - 8) + '">low probe score</text>' +
          '<text class="scatter-label" x="' + (width - pad) + '" y="' + (height - 8) + '" text-anchor="end">high probe score</text>' +
        "</svg>";
    }

    function draw() {
      var separated = state.separation >= 0.6;
      var wordingReadable = state.wording >= 0.4;
      var checkedCount = checks.filter(function (check) { return state.checked[check.id]; }).length;

      ui.querySelector("#mi-scatter").innerHTML = scatter();

      var verdict = ui.querySelector("#mi-verdict");
      var cls = "verdict";
      var mark = "–";
      var title = "";
      var body = "";
      if (separated && wordingReadable) {
        cls += " yes";
        mark = "!";
        title = "The probe may read incentive wording (CF-7).";
        body = "It separates E1 from E0, but it also separates E0 from A, where the main difference is the objective text. A high E1-versus-A number would not establish coordination.";
      } else if (separated) {
        cls += " no";
        mark = "✓";
        title = "Pattern consistent with H-TARA-2.";
        body = "Separation appears on the incentive-matched contrast and not on the wording contrast. This is necessary, not sufficient: an unmeasured confound remains possible.";
      } else {
        title = "No linear separation on the contrast that matters.";
        body = "Either the label is not linearly readable at this layer and pooling, or the E1 trajectories do not realize coordination. A null result is about both the label and the extraction.";
      }
      verdict.className = cls;
      verdict.innerHTML = '<div class="verdict-mark">' + mark + "</div><div><strong>" + escapeHTML(title) + "</strong><span>" + escapeHTML(body) + "</span></div>";

      ui.querySelector("#mi-metrics").innerHTML =
        metric("E1 vs E0", separated ? "separated" : "not separated", "schematic") +
        metric("E0 vs A", wordingReadable ? "separated" : "near chance", "the anti-confound check") +
        metric("Design checks", checkedCount + " of " + checks.length, checkedCount === checks.length ? "all listed controls" : "at least one control missing");

      var designNote = checkedCount === checks.length
        ? "The design checklist is complete. The result would still not show that the model uses the direction; that needs an intervention on the activation."
        : checkedCount >= 4
          ? "The design checklist is incomplete. Name every missing control in the write-up, or the AUROC is exploratory."
          : "Do not interpret the AUROC yet. The comparison or a named confound is uncontrolled.";
      ui.querySelector("#mi-note").textContent =
        "Schematic scatter, not a probe result. The sliders only set hypothetical separation. " +
        "H-TARA-2 bounds the anti-confound probe at AUROC 0.65; H-TARA-3 bounds family-transfer loss at 0.10. " + designNote;
    }

    bindRange(ui, "mi-sep", function (value) { return fmt(value, 2); }, function (value) {
      state.separation = value;
      draw();
    });
    bindRange(ui, "mi-word", function (value) { return fmt(value, 2); }, function (value) {
      state.wording = value;
      draw();
    });

    draw();
  };

  window.DEMOS = {
    evidence: evidenceDemo,
    social: socialDemo,
    communication: communicationDemo,
    collusion: collusionDemo,
    control: controlDemo,
    ontology: ontologyDemo,
    measurement: measurementDemo,
    mechanistic: mechanisticDemo
  };
})();
