(() => {
  "use strict";
  const docs = window.READER_DOCUMENTS;
  const path = new URLSearchParams(location.search).get("doc") || "study/REVIEWER.md";
  const documentView = document.getElementById("document");
  const record = Object.hasOwn(docs, path) ? docs[path] : null;
  const pathLabel = document.getElementById("path");
  pathLabel.textContent = path;
  if (!record) {
    documentView.textContent = "This document is not in the offline reader. Rebuild the reader after adding it.";
    document.getElementById("source").hidden = true;
    return;
  }
  document.title = (record.title || path) + " · AI Safety Research";
  documentView.innerHTML = record.html;
  const sourceUrl = new URL("../" + path, location.href);
  const sourceLink = document.getElementById("source");
  sourceLink.href = sourceUrl.href;
  sourceLink.setAttribute("data-reader-skip", "");
  documentView.querySelectorAll("img[src]").forEach(img => { img.src = new URL(img.getAttribute("src"), sourceUrl).href; });
  documentView.querySelectorAll("a[href]").forEach(anchor => {
    const href = anchor.getAttribute("href");
    if (!href.startsWith("#")) anchor.href = new URL(href, sourceUrl).href;
  });
  window.readerConvertLinks(documentView, sourceUrl);
  const headings = document.getElementById("headings");
  documentView.querySelectorAll("h2[id], h3[id], h4[id]").forEach(heading => {
    const link = document.createElement("a"); link.href = "#" + heading.id; link.textContent = heading.textContent;
    link.className = "level-" + heading.tagName.slice(1); headings.append(link);
  });
  const toggle = document.getElementById("toc-toggle"), toc = document.getElementById("toc");
  toggle.addEventListener("click", () => { const open = toc.classList.toggle("open"); toggle.setAttribute("aria-expanded", String(open)); });
  headings.addEventListener("click", () => { toc.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); });
  if (location.hash) requestAnimationFrame(() => { try { document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView(); } catch (_) {} });
})();
