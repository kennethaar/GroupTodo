/* ============================================================
   150_VAULT DIALOG -- storage, and serverless sync
   ============================================================ */
function capLine(ok, text) {
  const mark = svgIcon(ok ? ICON_CHECK : ICON_CLOSE);
  mark.setAttribute("style", "width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round");
  return el("div", {style: "display:flex;gap:8px;align-items:flex-start;font-size:12.5px;margin:3px 0;color:var(--fg2)"},
    el("span", {style: "color:" + (ok ? "var(--ok)" : "var(--fg3)") + ";flex:none;display:inline-flex"}, mark),
    el("span", {}, text));
}
