/* A cycle's boxes may touch, but none may lie over another box's words
   (#479). The ring first grows wider, an oval up to the slide's width; if the
   words still meet a box, they get smaller a step at a time. Measured once
   the body is drawn. */
function slideCycleFit(slide) {
  const ring = slide.querySelector(".ring.cycle");
  if (!ring || !ring.offsetHeight) return;
  const parts = [...ring.children], texts = parts.map(p => p.querySelector(".ntext"));
  const place = k => {
    ring.style.aspectRatio = String(k);
    ring.style.setProperty("--k", k);
    cycleShape(parts.length, k).forEach((g, i) => {
      const svg = parts[i].querySelector("svg"), [line, head] = svg.querySelectorAll("path");
      svg.setAttribute("viewBox", `0 0 ${100 * k} 100`);
      line.setAttribute("d", g.arc); head.setAttribute("d", g.head);
      Object.assign(texts[i].style, {left: g.left + "%", top: g.top + "%"});
    });
  };
  const words = t => {
    const r = t.getBoundingClientRect(), c = getComputedStyle(t), px = k => parseFloat(c[k]) || 0;
    return {left: r.left + px("paddingLeft") + px("borderLeftWidth"), right: r.right - px("paddingRight") - px("borderRightWidth"),
      top: r.top + px("paddingTop") + px("borderTopWidth"), bottom: r.bottom - px("paddingBottom") - px("borderBottomWidth")};
  };
  const meet = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
  const clear = () => {
    const boxes = texts.map(t => t.getBoundingClientRect());
    return texts.every((t, i) => { const w = words(t); return boxes.every((b, j) => i === j || !meet(w, b)); });
  };
  const most = Math.max(1, (ring.parentElement?.clientWidth || 0) / ring.offsetHeight);
  ring.style.setProperty("--cyclefit", 1);
  let k = 1;
  place(k);
  while (!clear() && k < most) place(k = Math.min(most, Math.round((k + 0.1) * 100) / 100));
  for (let fit = 0.95; !clear() && fit >= 0.5; fit = Math.round((fit - 0.05) * 100) / 100)
    ring.style.setProperty("--cyclefit", fit);
}
