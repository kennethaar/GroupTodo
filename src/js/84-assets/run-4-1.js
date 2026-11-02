document.addEventListener("click", e => {
  const link = e.target.closest && e.target.closest("a.filelink[href]");
  if (!link) return;
  e.preventDefault();
  e.stopPropagation();
  const href = link.getAttribute("href");
  if (CAP.fromFile) { window.open(href, "_blank"); return; }
  copyText(filePathOf(href), "Path copied. Browsers do not open local files from a web page: paste it into Explorer.", "Local path");
}, true);
