/* A file in assets/ as it reads in a line: a paperclip link that downloads
   it. A PDF also gets a caret that unfolds it under the line (#331). The
   arguments arrive escaped, as renderInline has them. */
function assetFileHTML(href, label, bang) {
  const link = `<a class="asset-file" data-asset="${href}" href="#" contenteditable="false" title="Download attachment">\u{1F4CE} ${label}</a>`;
  const path = unesc(href);
  if (!PDF_RE.test(path)) return link;
  const open = pdfOpen(path, bang);
  return link + `<button type="button" class="pdf-fold" contenteditable="false" data-pdf="${href}" data-bang="${bang ? 1 : 0}" aria-expanded="${open}" aria-label="${open ? "Fold away" : "Show here"}: ${label}" title="${open ? "Fold away" : "Show here"}">` +
    `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON_CHEVRON_RIGHT}</svg></button>`;
}
