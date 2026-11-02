// href arrives escaped for HTML, label already escaped and ready to show.
function fileLinkHTML(href, label) {
  const raw = unesc(href);
  const tip = CAP.fromFile ? filePathOf(raw) : filePathOf(raw) + "  (click to copy the path)";
  return `<a class="filelink" href="${esc(fileHref(raw))}" title="${esc(tip)}">\u{1F4C1} ${label}</a>`;
}
