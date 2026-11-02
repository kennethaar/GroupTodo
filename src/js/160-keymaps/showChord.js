function showChord(txt) {
  let hud = $("#chord");
  if (!txt) { hud && hud.remove(); return; }
  if (!hud) { hud = el("div", {id: "chord"}); document.body.append(hud); }
  hud.textContent = txt;
}
