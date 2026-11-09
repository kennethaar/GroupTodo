// The caret beside a PDF folds it in and out without opening the line (#331).
document.addEventListener("click", e => {
  const btn = e.target.closest && e.target.closest("button.pdf-fold[data-pdf]");
  if (!btn) return;
  e.preventDefault();
  e.stopPropagation();
  const path = btn.dataset.pdf;
  PREF.set(pdfFoldKey(path), pdfOpen(path, btn.dataset.bang === "1") ? "0" : "1");
  render();
}, true);
