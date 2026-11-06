/* A table block shows its rows as written while the caret is in one of
   them, and as a table again once it leaves. A click on a cell opens the
   row it is in. */
function tableWatch(node, txt, b, path) {
  const own = t => t === txt || (t && t.parentNode === node && t.classList.contains("tblrow"));
  const open = on => {
    node.classList.toggle("tbl-open", on);
    TABLE_OPEN = on ? b.id : null;
    if (document.activeElement !== txt) {
      if (on) txt.textContent = b.title; else txt.innerHTML = lineHtml(b);
    }
  };
  if (!tableRows(b)) return;
  node.classList.add("mdtbl");
  // Asked for, never pushed: only while a row is open, and it keeps the caret where it is.
  txt.after(el("button", {class: "tablemenu", tabindex: "-1", title: "Table", "aria-label": "Table",
    "aria-haspopup": "menu", onmousedown: e => e.preventDefault(),
    onclick: e => { e.stopPropagation(); tableMenu(path, b, txt); }}, "Table ", svgIcon(ICON_CARET)));
  if (TABLE_OPEN === b.id) { node.classList.add("tbl-open"); txt.textContent = b.title; }
  node.addEventListener("focusin", e => { if (own(e.target) && tableRows(b)) open(true); });
  node.addEventListener("focusout", e => { if (own(e.target) && !own(e.relatedTarget)) open(false); });
  txt.addEventListener("mousedown", e => {
    const c = e.target.closest("td[data-bi], th[data-bi]");
    if (!c || node.classList.contains("tbl-open")) return;
    e.preventDefault();
    open(true);
    tableFocusRow(b, +c.dataset.bi);
  });
}
