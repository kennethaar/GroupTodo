/* The teleprompter's light (#324): in each outline on screen, the paragraph
   that crosses the middle of the screen, or the one nearest it. The one just
   above and below it are tp-near, shown halfway in size. Each gets its
   height as --tp-h, so the CSS can make room for it to grow. Only what
   changes is touched: taking a class off and back on would restart its
   growth on every scroll. */
function tpLight() {
  const box = $("#content");
  if (!box) return;
  const want = new Map();
  if (tpActive()) {
    const r = box.getBoundingClientRect(), mid = r.top + r.height / 2;
    // An outline inside another (an embed) is counted with the one around it.
    for (const o of box.querySelectorAll(".outline:not(.outline .outline)")) {
      const {node, gap} = tpNearest(o, mid);
      if (!node || gap >= r.height / 2) continue;
      const all = [...o.querySelectorAll(TP_UNITS)], i = all.indexOf(node);
      for (const n of [all[i - 1], all[i + 1]]) if (n) want.set(n, "tp-near");
      want.set(node, "tp-lit");
    }
  }
  const heights = new Map([...want.keys()].map(n => [n, n.offsetHeight]));
  for (const n of box.querySelectorAll(".tp-lit,.tp-near"))
    if (!want.has(n)) n.classList.remove("tp-lit", "tp-near");
  for (const [n, cls] of want) {
    n.style.setProperty("--tp-h", heights.get(n) + "px");
    n.classList.remove(cls === "tp-lit" ? "tp-near" : "tp-lit");
    n.classList.add(cls);
  }
}
