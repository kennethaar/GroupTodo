function viewGraphMap() {
  const c = el("div", {});
  const full = graphFull();
  const g = mapGraph();
  const hide = new Set(PREF.get("map.hidden", MAP_HIDE_DEFAULT).split(",").filter(Boolean));
  const loners = PREF.get("map.loners", "1") === "1";
  const counts = {};
  for (const nd of full.nodes) counts[nd.kind] = (counts[nd.kind] || 0) + 1;
  const toggleKind = k => {
    hide.has(k) ? hide.delete(k) : hide.add(k);
    PREF.set("map.hidden", [...hide].join(","));
    render();
  };

  /* ---------- the filter row: what is on the picture, and finding a page ---------- */
  const search = el("input", {type: "search", placeholder: "Find a page", "aria-label": "Find a page on the map", value: MAP.q});
  const kinds = Object.keys(PAGE_KINDS).filter(k => k !== "journal" && counts[k]);
  c.append(fbar(search,
    ...kinds.map(k => fchip(PAGE_KINDS[k], !hide.has(k), () => toggleKind(k), counts[k])),
    el("span", {class: "gap"}),
    counts.journal ? fchip("Day pages", !hide.has("journal"), () => toggleKind("journal"), counts.journal) : null,
    fchip("Unlinked", loners, () => { PREF.set("map.loners", loners ? "0" : "1"); render(); }, g.loners.length)));

  if (!full.nodes.length) {
    c.append(emptyCard(
      "Nothing to draw yet. Type [[ in any line to link one page to another, and the map starts here."));
    return c;
  }

  const cv = el("canvas", {class: "graphcv", tabindex: "0", "aria-label": "Map of pages and their links"});
  const zoomBtn = (label, title, fn) => el("button", {title, "aria-label": title, onclick: fn}, label);
  const stage = el("div", {class: "graph"}, cv);
  const side = el("aside", {class: "gside"});
  c.append(el("div", {class: "gmap"}, stage, side));

  /* The simulation runs while it is warm and stops when it has settled, so an
     idle map costs nothing. Scroll to zoom around the pointer, drag the
     background to pan, drag a node to pull its neighbours along. */
  const fresh = !g.nodes.some(n => GRAPH_POS.has(n.key));
  const newcomers = fresh ? [] : g.nodes.map((n, i) => i).filter(i => !GRAPH_POS.has(g.nodes[i].key));
  let hover = -1, alpha = fresh ? 1 : 0.25, target = 0;
  let autoFit = true, running = false, seeded = false, match = null;
  const selIdx = () => MAP.sel ? g.nodes.findIndex(nd => nd.key === MAP.sel) : -1;
  const alphaDecay = 1 - Math.pow(0.001, 1 / 300);
  const redraw = () => graphDraw(cv, g, hover, {sel: selIdx(), match});
  const tick = () => {
    if (!cv.isConnected) { running = false; return; }
    const w = cv.clientWidth, h = cv.clientHeight;
    if (w && h) {
      if (!seeded) { graphSeed(g); g.view = null; seeded = true; }
      alpha += (target - alpha) * alphaDecay;
      graphStep(g, alpha);
      if (growing && growing.all && autoFit) growCamera(w, h);
      else if (autoFit) graphFit(g, w, h, g.view ? 0.15 : 0);
      redraw();
    }
    if (alpha > 0.002 || target) requestAnimationFrame(tick); else { running = false; graphPosSave(); }
  };
  const heat = a => { alpha = Math.max(alpha, a); if (!running) { running = true; requestAnimationFrame(tick); } };

  /* The camera glides rather than jumps, so you can see where you went. */
  const glide = want => {
    autoFit = false;
    let n = 0;
    const step = () => {
      if (!g.view || !cv.isConnected) return;
      for (const k of ["scale", "ox", "oy"]) g.view[k] += (want[k] - g.view[k]) * 0.25;
      redraw();
      if (++n < 24) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const zoomBy = f => {
    if (!g.view) return;
    const v = g.view, w = cv.clientWidth / 2, h = cv.clientHeight / 2;
    const ns = Math.max(0.08, Math.min(6, v.scale * f));
    glide({scale: ns, ox: w - (w - v.ox) * ns / v.scale, oy: h - (h - v.oy) * ns / v.scale});
  };
  const centreOn = i => {
    const nd = g.nodes[i];
    if (!nd || nd.x == null || !g.view) return;
    const scale = Math.max(g.view.scale, 1.2);
    glide({scale, ox: cv.clientWidth / 2 - nd.x * scale, oy: cv.clientHeight / 2 - nd.y * scale});
  };
  const fit = () => { autoFit = true; heat(0.05); };
  stage.append(el("div", {class: "gzoom"},
    zoomBtn("▶", "Watch it grow, oldest first", () => grow()),
    zoomBtn("+", "Zoom in", () => zoomBy(1.4)),
    zoomBtn("−", "Zoom out", () => zoomBy(1 / 1.4)),
    zoomBtn("⤢", "Fit everything", fit),
    zoomBtn("↻", "Lay it out again", () => { graphPosClear(); render(); })));
  const more = n => { PREF.set("map.cap", n ? String(n) : "all"); render(); };
  if (g.dropped) stage.append(el("div", {class: "gnote"},
    "The " + g.nodes.length + " best-connected of " + (g.nodes.length + g.dropped) + ". ",
    el("button", {class: "textbtn", onclick: () => more(g.nodes.length + CFG.graphStep)},
      "Show " + Math.min(CFG.graphStep, g.dropped) + " more"),
    g.dropped > CFG.graphStep ? el("button", {class: "textbtn", onclick: () => more(0)}, "Show all") : null));
  else if (mapCap() !== CFG.graphStep && g.nodes.length > CFG.graphStep) stage.append(el("div", {class: "gnote"},
    "All " + g.nodes.length + " pages. ",
    el("button", {class: "textbtn", onclick: () => { PREF.set("map.cap", "best"); render(); }}, "Back to the best-connected " + CFG.graphStep)));

  /* ---------- watching it grow ----------
     Every page arrives on the day it was made -- a day page on its day, any
     other page on its created:: date, or with the first page that links it
     -- next to a neighbour already there, and the picture settles as it
     goes, so the clusters can be seen forming. Press again to stop.

     A map with no layout yet is always drawn this way: two seconds for every
     thousand pages, oldest first, starting close in on the first few and
     pulling back only as fast as the picture needs the room. */
  const clock = el("div", {class: "gclock", hidden: true});
  stage.append(clock);
  let growing = null;
  // The camera while it grows: it only ever backs away, and slowly.
  const growCamera = (w, h) => {
    const v = g.view, was = g.view && {...g.view};
    if (!v) return;
    graphFit(g, w, h, 0);
    const want = g.view;
    g.view = was;
    const scale = v.scale + (Math.min(want.scale, v.scale) - v.scale) * 0.035;
    const cx = (w / 2 - want.ox) / want.scale, cy = (h / 2 - want.oy) / want.scale;
    const curx = (w / 2 - v.ox) / v.scale, cury = (h / 2 - v.oy) / v.scale;
    const nx = curx + (cx - curx) * 0.06, ny = cury + (cy - cury) * 0.06;
    g.view = {scale, ox: w / 2 - nx * scale, oy: h / 2 - ny * scale};
  };
  const grow = (only = null) => {
    if (growing) { growing.stop(); return; }
    const all = !only;
    // Oldest first; a page with no date at all comes in at the end.
    const order = (only || g.nodes.map((nd, i) => i)).sort((a, b) =>
      (!g.nodes[a].born) - (!g.nodes[b].born) ||
      String(g.nodes[a].born || "").localeCompare(String(g.nodes[b].born || "")) || g.nodes[b].deg - g.nodes[a].deg);
    const nbr = g.nodes.map(() => []);
    for (const [a, b] of g.edges) { nbr[a].push(b); nbr[b].push(a); }
    for (const i of order) g.nodes[i].off = true;
    /* Two seconds for every thousand pages, and never so quick it cannot be
       seen. A few new pages on a map already drawn just slide in. */
    const ms = all ? Math.max(3000, order.length * 2) : Math.max(600, order.length * 2);
    let t0 = null, shown = 0, stopped = false;
    clock.hidden = !all;
    if (all) autoFit = true;
    target = all ? 0.35 : 0.12; heat(all ? 1 : 0.3);
    growing = {all, stop: () => { stopped = true; }};
    const frame = now => {
      if (!cv.isConnected) return;
      // Wait for the first tick to have seeded the picture and sized the canvas.
      if (!seeded || !cv.clientWidth) { requestAnimationFrame(frame); return; }
      if (t0 == null) {
        t0 = now;
        if (all) g.view = {scale: 2.6, ox: cv.clientWidth / 2, oy: cv.clientHeight / 2};
      }
      const want = stopped ? order.length : Math.min(order.length, Math.ceil((now - t0) / ms * order.length));
      for (; shown < want; shown++) {
        const i = order[shown], nd = g.nodes[i];
        const near = nbr[i].map(j => g.nodes[j]).find(o => !o.off);
        // A page with nothing on the picture yet to sit by starts near the middle.
        const spread = near ? 30 : 12 + 5 * Math.sqrt(shown);
        const at = near || {x: 0, y: 0};
        nd.x = at.x + (Math.random() - 0.5) * spread; nd.y = at.y + (Math.random() - 0.5) * spread;
        nd.vx = nd.vy = 0; nd.off = false;
      }
      const last = shown ? g.nodes[order[shown - 1]] : null;
      clock.textContent = (last && last.born ? humanDate(last.born) + " · " : "") + shown + " of " + order.length;
      heat(all ? 0.35 : 0.12);
      if (shown < order.length) { requestAnimationFrame(frame); return; }
      growing = null; target = 0;
      graphPosSave();
      setTimeout(() => { clock.hidden = true; }, 1500);
    };
    requestAnimationFrame(frame);
  };
  if (fresh) grow(); else if (newcomers.length) grow(newcomers); else heat(alpha);

  /* Picking a page. Inside the picture it only relights the canvas and the
     panel; a page the picture left out needs the picture drawn again. */
  const select = key => {
    MAP.sel = key || null;
    const i = selIdx();
    if ((MAP.sel && i < 0) || PREF.get("graph.depth", "all") !== "all") { render(); return; }
    drawSide();
    redraw();
    if (i >= 0) centreOn(i);
  };

  /* ---------- the panel ---------- */
  const row = (nd, onclick, extra) => el("button", {class: "dash-item", onclick},
    kindDot(nd.kind), el("span", {class: "nm"}, nd.label),
    nd.ghost ? el("span", {class: "chip"}, "not made") : null,
    extra || el("span", {class: "p"}, String(nd.deg)));
  const list = (title, items, make, empty) => section(title, items.length,
    items.length ? el("div", {class: "pagelist"}, ...items.slice(0, 8).map(make),
      items.length > 8 ? el("div", {class: "dash-item p"}, (items.length - 8) + " more") : null)
      : el("p", {class: "hint"}, empty));
  function drawSide() {
    side.replaceChildren();
    const rel = MAP.sel ? mapRelations(MAP.sel) : null;
    if (rel && rel.node) {
      const nd = rel.node;
      const open = nd.ghost ? [] : openTasksOn(nd.space, nd.path);
      side.append(
        el("div", {class: "pv-top"}, el("span", {class: "chip"}, PAGE_KIND_ONE[nd.kind] || "Page"), spaceTag(nd.space),
          el("button", {class: "gclose", title: "Let go (Esc)", "aria-label": "Let go", onclick: () => select(null)}, "×")),
        el("h2", {class: "gtitle"}, nd.label),
        el("p", {class: "hint"}, nd.ghost ? "Linked to, but there is no page yet."
          : rel.out.length + " out · " + rel.inn.length + " in" + (open.length ? " · " + open.length + " open" : "")),
        el("div", {class: "acts"},
          el("button", {class: "btn sm primary", onclick: () => openGraphNode(nd)}, nd.ghost ? "Make this page" : "Open"),
          nd.ghost ? null : el("button", {class: "btn sm ghost", onclick: () => previewPage(nd.space, nd.path)}, "Side panel"),
          el("button", {class: "btn sm ghost", onclick: () => go("pages", {sub: "mindmap", graphFocus: nd.key})}, "Mind map")),
        el("div", {class: "fbar"}, el("span", {class: "say"}, "Show"),
          ...MAP_DEPTHS.map(([k, label]) => fchip(label, PREF.get("graph.depth", "all") === k,
            () => { PREF.set("graph.depth", k); render(); }))),
        list("Links to", rel.out, o => row(o, () => select(o.key)), "It links to nothing yet."),
        list("Linked from", rel.inn, o => row(o, () => select(o.key)), "Nothing links here yet."));
      return;
    }
    const hubs = g.nodes.filter(nd => nd.deg > 0).sort((a, b) => b.deg - a.deg || a.label.localeCompare(b.label));
    const ghosts = full.nodes.filter(nd => nd.ghost).sort((a, b) => b.deg - a.deg || a.label.localeCompare(b.label));
    side.append(
      el("h2", {class: "gtitle"}, g.nodes.length + " pages · " + g.edges.length + " links"),
      el("p", {class: "hint"}, "Click a page to see what it is tied to. " +
        (g.hidden ? g.hidden + " hidden by the filters above." : "")),
      list("Hubs", hubs, nd => row(nd, () => select(nd.key)), "No links yet. Type [[ in a line to make one."),
      list("Not made yet", ghosts, nd => row(nd, () => select(nd.key)),
        "Every link leads to a page that exists."),
      list("Nothing links here", g.loners, nd => row(nd, () => previewPage(nd.space, nd.path), el("span", {class: "p"}, PAGE_KIND_ONE[nd.kind] || "")),
        "Every page is tied to something."));
  }
  drawSide();

  /* ---------- finding a page ---------- */
  const find = () => {
    const q = MAP.q.trim().toLowerCase();
    match = q ? new Set(g.nodes.map((nd, i) => nd.label.toLowerCase().includes(q) ? i : -1).filter(i => i >= 0)) : null;
    redraw();
  };
  search.addEventListener("input", () => { MAP.q = search.value; find(); });
  search.addEventListener("keydown", e => {
    if (e.key === "Escape") { e.preventDefault(); MAP.q = search.value = ""; find(); }
    if (e.key !== "Enter") return;
    e.preventDefault();
    const q = MAP.q.trim().toLowerCase();
    if (!q) return;
    const best = full.nodes.filter(nd => nd.label.toLowerCase().includes(q))
      .sort((a, b) => b.label.toLowerCase().startsWith(q) - a.label.toLowerCase().startsWith(q) || b.deg - a.deg)[0];
    if (best) select(best.key); else notify("No page called that.");
  });
  if (MAP.q) find();
  if (selIdx() >= 0) requestAnimationFrame(() => requestAnimationFrame(() => centreOn(selIdx())));

  /* Esc lets go, / finds. One listener at a time, however often this is drawn. */
  if (MAP.key) document.removeEventListener("keydown", MAP.key);
  MAP.key = e => {
    if (!cv.isConnected) { document.removeEventListener("keydown", MAP.key); MAP.key = null; return; }
    if ($("#modalRoot").firstChild || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
    if (e.key === "Escape" && MAP.sel) { e.preventDefault(); select(null); }
    else if (e.key === "/") { e.preventDefault(); search.focus(); }
    else if (e.key === "Enter" && MAP.sel) { e.preventDefault(); const nd = mapRelations(MAP.sel).node; if (nd) openGraphNode(nd); }
  };
  document.addEventListener("keydown", MAP.key);

  /* ---------- pointer ---------- */
  const local = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const at = e => {
    const [px, py] = local(e);
    let best = -1, bestD = Infinity;
    for (let i = 0; i < g.nodes.length; i++) {
      const nd = g.nodes[i];
      if (nd.x == null || nd.off || !g.view) continue;
      const sx = gX(g, nd) - px, sy = gY(g, nd) - py;
      const d = sx * sx + sy * sy;
      const reach = graphRadius(nd) * g.view.scale + 8;   // a small dot needs a thumb-sized target
      if (d <= reach * reach && d < bestD) { best = i; bestD = d; }
    }
    return best;
  };
  cv.addEventListener("wheel", e => {
    if (!g.view) return;
    e.preventDefault();
    autoFit = false;
    const [px, py] = local(e), v = g.view;
    const ns = Math.max(0.08, Math.min(6, v.scale * Math.exp(-e.deltaY * 0.0015)));
    v.ox = px - (px - v.ox) * ns / v.scale;
    v.oy = py - (py - v.oy) * ns / v.scale;
    v.scale = ns;
    redraw();
  }, {passive: false});

  let drag = null;
  cv.style.touchAction = "none";
  cv.addEventListener("pointerdown", e => {
    if (e.button !== 0 || !g.view) return;
    cv.setPointerCapture(e.pointerId);
    const i = at(e), [px, py] = local(e);
    drag = {i, px, py, ox: g.view.ox, oy: g.view.oy, moved: false};
    if (i >= 0) { const nd = g.nodes[i]; nd.fx = nd.x; nd.fy = nd.y; }
  });
  cv.addEventListener("pointermove", e => {
    if (drag) {
      const [px, py] = local(e), v = g.view;
      if (!drag.moved && Math.hypot(px - drag.px, py - drag.py) < 4) return;
      drag.moved = true;
      autoFit = false;
      if (drag.i >= 0) {
        const nd = g.nodes[drag.i];
        nd.fx = (px - v.ox) / v.scale; nd.fy = (py - v.oy) / v.scale;
        target = 0.3; heat(0.3);
      } else {
        v.ox = drag.ox + px - drag.px; v.oy = drag.oy + py - drag.py;
        cv.style.cursor = "grabbing";
        redraw();
      }
      return;
    }
    const i = at(e);
    if (i === hover) return;
    hover = i;
    cv.style.cursor = i >= 0 ? "pointer" : "grab";
    cv.title = i < 0 ? "" : g.nodes[i].label + "  ·  " + (g.nodes[i].ghost ? "no page yet" : g.nodes[i].path);
    redraw();
  });
  const release = e => {
    if (!drag) return;
    const d = drag; drag = null;
    if (d.i >= 0) { const nd = g.nodes[d.i]; nd.fx = nd.fy = null; target = 0; }
    cv.style.cursor = hover >= 0 ? "pointer" : "grab";
    if (d.moved || e.type !== "pointerup") return;
    if (d.i >= 0) select(g.nodes[d.i].key === MAP.sel ? null : g.nodes[d.i].key);
    else if (MAP.sel) select(null);
  };
  cv.addEventListener("pointerup", release);
  cv.addEventListener("pointercancel", release);
  cv.addEventListener("mouseleave", () => { if (drag) return; hover = -1; cv.title = ""; redraw(); });
  cv.addEventListener("dblclick", e => { const i = at(e); if (i >= 0) openGraphNode(g.nodes[i]); else fit(); });

  /* What the shapes and colours mean, for the kinds on the picture. */
  const shown = [...new Set(g.nodes.map(nd => nd.kind))];
  c.append(el("div", {class: "graph-legend"},
    ...shown.map(k => el("span", {class: "glg"}, el("i", {style: "background:var(" + (GRAPH_KIND_VAR[k] || "--fg2") + ")"}), PAGE_KINDS[k] || k)),
    el("span", {class: "glg"}, el("i", {style: "background:transparent;box-shadow:inset 0 0 0 1.4px var(--fg3)"}), "Not made yet"),
    el("span", {class: "glg quiet"}, "Bigger = more links · click picks, double-click opens · drag to pull, scroll to zoom · / finds, Esc lets go")));

  /* A canvas is invisible to a keyboard and a screen reader, so the same pages
     are reachable as a plain list underneath. Not a fallback -- the real thing,
     in the shape a reader can use. */
  const ranked = g.nodes.slice().sort((a, b) => b.deg - a.deg || a.label.localeCompare(b.label));
  const ul = pagedCard(ranked, nd => row(nd, () => openGraphNode(nd)));
  ul.className = "pagelist";
  c.append(el("details", {class: "section"}, el("summary", {}, "The same pages as a list"), ul));
  return c;
}
