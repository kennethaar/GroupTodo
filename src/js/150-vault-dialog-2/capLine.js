/* ============================================================
   150_VAULT DIALOG -- storage, and serverless sync
   ============================================================ */
function capLine(ok, text) {
  return el("div", {style: "display:flex;gap:8px;align-items:flex-start;font-size:12.5px;margin:3px 0;color:var(--fg2)"},
    el("span", {style: "color:" + (ok ? "var(--ok)" : "var(--fg3)") + ";flex:none"}, ok ? "✓" : "✕"),
    el("span", {}, text));
}
