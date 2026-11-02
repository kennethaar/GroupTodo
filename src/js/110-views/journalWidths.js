function journalWidths(grid, spaces) {
  if (spaces.length < 2) return grid;
  const fr = [];
  const load = () => { const saved = jwShares(); spaces.forEach((n, i) => { const v = Number(saved[n]); fr[i] = v > 0 ? v : 1; }); };
  load();
  grid.dataset.jw = spaces.join("|");
  const paint = () => {
    const cols = fr.map(f => "minmax(" + JW_MIN_PX + "px," + f.toFixed(3) + "fr)").join(" ");
    for (const g of new Set([grid, ...document.querySelectorAll(".jgrid.sized")]))
      if (g.dataset.jw === grid.dataset.jw) g.style.setProperty("--jcols", cols);
  };
  const save = () => {
    const all = jwShares();
    spaces.forEach((n, i) => { if (Math.abs(fr[i] - 1) < 0.01) delete all[n]; else all[n] = +fr[i].toFixed(3); });
    PREF.set("today.jwidths", JSON.stringify(all));
  };
  grid.classList.add("sized");
  paint();
  [...grid.children].slice(0, -1).forEach((card, i) => {
    const bar = el("div", {class: "jsplit", role: "separator", "aria-orientation": "vertical",
      title: "Drag to share the width differently; double-click to make them even"});
    bar.addEventListener("dblclick", () => { fr.fill(1); paint(); save(); });
    bar.addEventListener("pointerdown", e => {
      if (e.button) return;
      e.preventDefault();
      bar.setPointerCapture(e.pointerId);
      bar.classList.add("on");
      // The other grid of the pair may have been dragged since this one was drawn.
      load();
      const x0 = e.clientX, a0 = fr[i], b0 = fr[i + 1];
      const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
      const perPx = fr.reduce((t, f) => t + f, 0) / Math.max(1, grid.clientWidth - gap * (fr.length - 1));
      const pair = a0 + b0, least = JW_MIN_PX * perPx;
      const move = ev => {
        const a = Math.min(pair - least, Math.max(least, a0 + (ev.clientX - x0) * perPx));
        fr[i] = a; fr[i + 1] = pair - a;
        paint();
      };
      const up = () => {
        bar.removeEventListener("pointermove", move);
        bar.classList.remove("on");
        save();
      };
      bar.addEventListener("pointermove", move);
      bar.addEventListener("pointerup", up, {once: true});
      bar.addEventListener("pointercancel", up, {once: true});
    });
    card.append(bar);
  });
  return grid;
}
