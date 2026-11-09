/* The unfolded PDFs of a line, drawn under it the way an {{embed}} is (#331).
   The browser's own viewer draws the file; a fixed height keeps a long one
   from pushing the rest of the page away. Full size opens the same view over
   the page as a picture does, and Download is what the paperclip does. */
function pdfViews(b) {
  const open = [b.title, ...(b.body || [])].flatMap(pdfLinksIn).filter(p => pdfOpen(p.path, p.bang));
  const seen = new Set();
  const boxes = open.filter(p => !seen.has(p.path) && seen.add(p.path)).map(p => {
    const head = el("div", {class: "pdfhead"},
      el("span", {class: "pdfname"}, p.name),
      el("button", {type: "button", class: "btn sm", onclick: e => { e.stopPropagation(); openPdf(p.path, p.name); }}, "Full size"),
      el("a", {class: "btn sm asset-file", href: "#", data: {asset: p.path}}, "Download"));
    const shown = canShowPdf()
      ? el("iframe", {class: "pdfframe", title: p.name, data: {asset: p.path}})
      : el("div", {class: "pdfnote"}, "This browser does not show a PDF inside the page. ",
          el("button", {type: "button", class: "btn sm", onclick: e => { e.stopPropagation(); openPdfTab(p.path); }}, "Open in new tab ↗"));
    return el("div", {class: "pdfview", contenteditable: "false"}, head, shown);
  });
  return boxes;
}
