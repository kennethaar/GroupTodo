/* The teleprompter's light (#324): in each outline on screen, the paragraph
   that crosses the middle of the screen, or the one nearest it. */
function tpLight() {
  const box = $("#content");
  if (!box) return;
  for (const n of box.querySelectorAll(".tp-lit")) n.classList.remove("tp-lit");
  if (!tpActive()) return;
  const r = box.getBoundingClientRect(), mid = r.top + r.height / 2;
  // An outline inside another (an embed) is counted with the one around it.
  for (const o of box.querySelectorAll(".outline:not(.outline .outline)")) {
    const {node, gap} = tpNearest(o, mid);
    if (node && gap < r.height / 2) node.classList.add("tp-lit");
  }
}
