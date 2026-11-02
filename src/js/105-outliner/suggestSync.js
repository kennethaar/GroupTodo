function suggestSync(host, opts = {}) {
  const found = suggestFor(host, opts);
  if (!found) { if (SUGGEST && SUGGEST.host === host) suggestClose(); return; }
  if (!SUGGEST || SUGGEST.host !== host) {
    suggestClose();
    const box = el("div", {class: "linkpop suggest", role: "listbox"});
    document.body.append(box);
    SUGGEST = {host, box, i: 0, opts};
  }
  Object.assign(SUGGEST, found, {opts});
  if (SUGGEST.i >= found.rows.length) SUGGEST.i = 0;
  suggestDraw();
  const r = caretScreenRect(host), box = SUGGEST.box;
  box.style.left = Math.max(8, Math.min(r.left, window.innerWidth - 320)) + "px";
  // Above the line when there is no room under it.
  const below = window.innerHeight - r.bottom;
  if (below < 220 && r.top > 220) { box.style.top = "auto"; box.style.bottom = (window.innerHeight - r.top + 4) + "px"; }
  else { box.style.bottom = "auto"; box.style.top = (r.bottom + 4) + "px"; }
}
