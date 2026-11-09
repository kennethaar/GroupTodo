// A PDF over the page, as a picture opens (openPicture), with Esc and a new tab.
function openPdf(path, name) {
  if (!canShowPdf()) return openPdfTab(path);
  const body = el("iframe", {class: "pdfframe full", title: name, data: {asset: path}});
  const foot = el("button", {type: "button", class: "btn", onclick: () => { closeModal(); openPdfTab(path); }}, "Open in new tab ↗");
  return modal({center: true, title: name || "PDF", hint: "Esc closes", body, foot});
}
