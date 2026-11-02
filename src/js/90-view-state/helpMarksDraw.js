/* Rows of the legend whose thing is not on the screen just now are dimmed. */
function helpMarksDraw() {
  let layer = $("#helpMarks");
  const id = helpPaneTopic();
  if (!HELP_MARKS || !id || !helpOnScreen(id)) {
    if (layer) layer.remove();
    document.body.classList.remove("helpmarking");
    for (const li of document.querySelectorAll("#pagePane .helplegend li.off")) li.classList.remove("off");
    return;
  }
  if (!layer) { layer = el("div", {id: "helpMarks", "aria-label": "Show me"}); document.body.append(layer); }
  document.body.classList.add("helpmarking");
  const legend = HELP[id].legend || [];
  // On a phone the pane covers the screen, so it steps aside, and with no Esc key Done ends it.
  layer.replaceChildren(el("button", {class: "btn sm primary hmarkdone", onclick: () => helpMarks(false)}, "Done"),
    ...legend.map(([sel, text], i) => {
    const n = helpFind(sel);
    const row = $("#pagePane").querySelector('.helplegend li[data-n="' + i + '"]');
    if (row) row.classList.toggle("off", !n);
    if (!n) return null;
    const r = n.getBoundingClientRect();
    return el("button", {class: "hmark", style: "left:" + Math.max(2, r.left - 4) + "px;top:" + Math.max(2, r.top - 4) + "px",
      title: text, "aria-label": (i + 1) + ": " + text, data: {n: String(i)}, onclick: () => helpExplain(i)}, String(i + 1));
  }).filter(Boolean));
}
