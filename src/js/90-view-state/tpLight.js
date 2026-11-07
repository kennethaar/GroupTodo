/* The teleprompter's light (#324): in each outline on screen, the paragraph
   that crosses the middle of the screen, or the one nearest it. The one just
   above and below it are tp-near, shown a little larger. Every paragraph
   keeps the same room above and below (--tp-room), so nothing moves when the
   light does. Each grown one gets its size as --tp-s, held to what fits that
   room: a short one grows the full step, a long one less. Only what changes
   is touched: taking a class off and back on would restart its growth on
   every scroll. */
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
  // Between the lit one and its neighbour the room is shared: 70% for the lit, 30% for the neighbour.
  const room = parseFloat(getComputedStyle(box).getPropertyValue("--tp-room")) || 0;
  const size = (n, cls) => {
    const h = n.offsetHeight || 1;
    return cls === "tp-lit" ? Math.min(1.08, 1 + 1.4 * room / h) : Math.min(1.03, 1 + 0.6 * room / h);
  };
  const sizes = new Map([...want].map(([n, cls]) => [n, size(n, cls)]));
  for (const n of box.querySelectorAll(".tp-lit,.tp-near"))
    if (!want.has(n)) n.classList.remove("tp-lit", "tp-near");
  for (const [n, cls] of want) {
    n.style.setProperty("--tp-s", sizes.get(n).toFixed(4));
    n.classList.remove(cls === "tp-lit" ? "tp-near" : "tp-lit");
    n.classList.add(cls);
  }
}
