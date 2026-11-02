/* ---------- the arrows ----------
   Drawn from the DOM rather than from the percentages, because the label column
   is a fixed width and the tracks are what is left: only the browser knows how
   many pixels that turned out to be. Rows that are not on screen yet get no
   arrow, which is the right answer -- an arrow to nothing is noise. */
function drawChainArrows(body, links, rows) {
  links.textContent = "";
  const byPath = new Map();
  for (const r of rows) if (r.group.project) byPath.set(r.group.path, r);
  if (!byPath.size) return;

  const paint = () => {
    links.textContent = "";
    let base;
    try { base = body.getBoundingClientRect(); } catch (_) { return; }
    if (!base.width) return;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "garrows");
    svg.setAttribute("width", String(base.width));
    svg.setAttribute("height", String(base.height));
    svg.setAttribute("viewBox", "0 0 " + base.width + " " + base.height);
    let any = false;

    for (const [path, row] of byPath) {
      for (const dep of (row.group.deps || [])) {
        const src = byPath.get(dep);
        if (!src) continue;
        const a = body.querySelector('.grow.group[data-row="' + CSS.escape(dep) + '"] .gbar');
        const b = body.querySelector('.grow.group[data-row="' + CSS.escape(path) + '"] .gbar');
        if (!a || !b) continue;
        let ra, rb;
        try { ra = a.getBoundingClientRect(); rb = b.getBoundingClientRect(); } catch (_) { continue; }
        const x1 = ra.right - base.left, y1 = ra.top - base.top + ra.height / 2;
        const x2 = rb.left  - base.left, y2 = rb.top - base.top + rb.height / 2;
        // An elbow, not a curve: the vertical leg says "and then", and a bezier
        // across six rows is a decoration you have to decode.
        const mid = x2 > x1 + 14 ? x1 + Math.min(18, (x2 - x1) / 2) : x1 + 12;
        const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
        p.setAttribute("d", "M" + x1 + "," + y1 + " H" + mid + " V" + y2 + " H" + x2);
        p.setAttribute("class", "garrow" + (row.group.trouble ? " bad" : ""));
        svg.append(p);
        const head = document.createElementNS("http://www.w3.org/2000/svg", "path");
        head.setAttribute("d", "M" + x2 + "," + y2 + " l-5,-3.2 v6.4 z");
        head.setAttribute("class", "garrowhead" + (row.group.trouble ? " bad" : ""));
        svg.append(head);
        any = true;
      }
    }
    if (any) links.append(svg);
  };

  requestAnimationFrame(paint);
  // The label column halves on a narrow screen, so every arrow is in the wrong
  // place after a rotate. The observer dies with the chart it is watching.
  if (typeof ResizeObserver === "function" && !links.__ro) {
    links.__ro = new ResizeObserver(() => requestAnimationFrame(paint));
    try { links.__ro.observe(body); } catch (_) {}
  }
}
