/* Convert local Markdown links into offline reader links. */
(() => {
  "use strict";
  const script = document.currentScript;
  const root = new URL("../../", script.src);
  const reader = new URL("../reader.html", script.src);
  const documents = window.READER_DOCUMENTS || {};
  function convert(anchor, base) {
    if (anchor.hasAttribute("data-reader-skip") || anchor.hasAttribute("data-reader-done")) return;
    const raw = anchor.getAttribute("href");
    if (!raw || raw.startsWith("#")) return;
    let target;
    try { target = new URL(raw, base); } catch (_) { return; }
    if (target.origin !== root.origin || !target.pathname.startsWith(root.pathname)) return;
    let path;
    try { path = decodeURIComponent(target.pathname.slice(root.pathname.length)); } catch (_) { return; }
    if (path.endsWith("/")) path += "README.md";
    if (!Object.hasOwn(documents, path)) return;
    const destination = new URL(reader);
    destination.searchParams.set("doc", path);
    destination.hash = target.hash;
    anchor.href = destination.href;
    anchor.setAttribute("data-reader-done", "");
  }
  window.readerConvertLinks = (container, base = document.baseURI) => container.querySelectorAll("a[href]").forEach(a => convert(a, base));
  function initialize() {
    window.readerConvertLinks(document);
    new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
      if (node.nodeType !== 1) return;
      if (node.matches("a[href]")) convert(node, document.baseURI);
      window.readerConvertLinks(node);
    }))).observe(document.body, {childList:true, subtree:true});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize); else initialize();
})();
