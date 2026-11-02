/* ============================================================
   145_HORIZONS_VIEW
   ============================================================ */
function horizonRow(h, body, action) {
  return el("div", {class: "section"},
    el("h3", {},
      el("span", {style: "color:var(--accent);font-family:var(--mono);font-size:11px"}, h.alt),
      el("span", {}, h.h + " · " + h.name),
      action ? el("span", {style: "margin-left:auto"}, action) : null),
    body);
}
