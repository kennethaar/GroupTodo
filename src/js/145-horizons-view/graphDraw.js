/* o.sel is the node picked by a click, which stays lit until another is
   picked; hovering lights another for as long as the pointer is on it.
   o.match is the set a search found, ringed so they stand out of the crowd. */
function graphDraw(cv, g, hoverIdx, o = {}) {
  const w = cv.clientWidth, h = cv.clientHeight;
  if (!w || !h) return;
  const dpr = window.devicePixelRatio || 1;
  const pw = Math.round(w * dpr), ph = Math.round(h * dpr);
  if (cv.width !== pw || cv.height !== ph) { cv.width = pw; cv.height = ph; }
  const x = cv.getContext("2d");
  if (!x) return;
  x.setTransform(dpr, 0, 0, dpr, 0, 0);
  x.clearRect(0, 0, w, h);

  // Read the theme rather than hard-coding, so the graph follows light mode.
  const css = getComputedStyle(document.documentElement);
  const v = (name, fallback) => trim(css.getPropertyValue(name)) || fallback;
  const line = v("--border2", "#333a4a"), fg = v("--fg", "#e6e9ef"), fg2 = v("--fg2", "#a4acbd");
  if (!g.view) graphFit(g, w, h);
  const selIdx = o.sel ?? -1, match = o.match || null;
  const fi = hoverIdx >= 0 ? hoverIdx : selIdx;
  const hov = fi >= 0 ? g.nodes[fi] : null;
  const near = new Set();
  if (hov) {
    near.add(fi);
    for (const [a, b] of g.edges) {
      if (a === fi) near.add(b);
      else if (b === fi) near.add(a);
    }
  }

  /* A thousand lines at the alpha that suits ten is a grey sheet with dots on
     it, so the more there are, the fainter each one gets. */
  /* Each topic sits on a faint wash of its own colour, so the subjects can be
     seen as subjects before any name is readable. */
  if (g.topics && g.topics.length > 1) {
    for (const t of g.topics) {
      const r = (t.spread * 1.35 + 18) * g.view.scale;
      const cx = t.x * g.view.scale + g.view.ox, cy = t.y * g.view.scale + g.view.oy;
      const grad = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      const hue = (t.id * 137.508) % 360;
      grad.addColorStop(0, "hsla(" + hue + ",70%,55%,0.13)");
      grad.addColorStop(1, "hsla(" + hue + ",70%,55%,0)");
      x.globalAlpha = 1;
      x.fillStyle = grad;
      x.beginPath();
      x.arc(cx, cy, r, 0, Math.PI * 2);
      x.fill();
    }
  }
  const edgeAlpha = Math.max(0.1, Math.min(0.62, 8 / Math.sqrt(g.edges.length || 1)));
  x.lineWidth = 1;
  for (const [a, b] of g.edges) {
    const n1 = g.nodes[a], n2 = g.nodes[b];
    if (n1.off || n2.off) continue;
    const lit = hov && (a === fi || b === fi);
    // Faint enough to stay behind the dots, solid enough to actually see:
    // at 0.4 on a dark background the links read as nothing at all.
    x.globalAlpha = hov ? (lit ? 0.95 : edgeAlpha * 0.25) : edgeAlpha;
    x.strokeStyle = lit ? v("--accent", "#6aa3ff") : v("--fg3", "#6d7689");
    x.beginPath();
    x.moveTo(gX(g, n1), gY(g, n1));
    x.lineTo(gX(g, n2), gY(g, n2));
    x.stroke();
  }

  const labelAll = g.nodes.length <= 70;
  const sans = v("--sans", "sans-serif");
  x.font = "11px " + sans;
  x.textAlign = "center";
  x.textBaseline = "top";
  /* Two names written on top of each other are worse than one name: where hubs
     sit close together, the first one drawn keeps the space and the rest go
     unlabelled until you hover them. */
  const taken = [];
  const roomFor = (cx, cy, tw, force) => {
    const box = [cx - tw / 2 - 2, cy - 1, cx + tw / 2 + 2, cy + 13];
    if (!force) {
      for (const t of taken)
        if (box[0] < t[2] && box[2] > t[0] && box[1] < t[3] && box[3] > t[1]) return false;
    }
    taken.push(box);
    return true;
  };
  for (let i = 0; i < g.nodes.length; i++) {
    const nd = g.nodes[i];
    if (nd.off) continue;
    /* A dot stays a dot at any size, but a bolt or a bust at three pixels is a
       smudge, so a shaped node never shrinks below the size it reads at. */
    const r = Math.max(graphRadius(nd), graphShape(nd) === "dot" ? 0 : 6.5);
    const px = gX(g, nd), py = gY(g, nd);
    const dim = (hov && !near.has(i)) || (match && !hov && !match.has(i));
    x.globalAlpha = dim ? 0.2 : 1;
    const colour = v(GRAPH_KIND_VAR[nd.kind] || "--fg2", "#a4acbd");
    // Hollow means something links here but there is no page behind it yet.
    graphFace(x, nd, px, py, i === fi ? r + 2 : r,
              {colour, bg: v("--bg2", "#161920"), hollow: !!nd.ghost, sans: sans});
    if (i === hoverIdx || i === selIdx || (match && match.has(i))) {
      // A ring rather than another pass over the outline: it has to read the
      // same whether the shape under it is a bolt, a bust or a letter.
      x.globalAlpha = 1;
      x.strokeStyle = i === selIdx || i === hoverIdx ? v("--fg", "#e6e9ef") : v("--accent", "#6aa3ff");
      x.lineWidth = i === selIdx ? 2.2 : 1.5;
      x.beginPath();
      x.arc(px, py, r + 4, 0, Math.PI * 2);
      x.stroke();
      x.lineWidth = 1;
    }
  }
  /* Names come in as you zoom, the best-connected first, the way Obsidian
     fades them in: zoomed out you see the shape, zoomed in you read it. The
     hovered node and its neighbours are always named. */
  const sc = g.view.scale;
  const fade = labelAll ? 1 : Math.max(0, Math.min(1, (sc - 0.7) / 0.5));
  const order = g.nodes.map((_, i) => i).sort((a, b) =>
    (b === fi) - (a === fi) || near.has(b) - near.has(a) ||
    (match ? match.has(b) - match.has(a) : 0) || g.nodes[b].deg - g.nodes[a].deg);
  for (const i of order) {
    const nd = g.nodes[i];
    if (nd.off) continue;
    const always = i === fi || (hov && near.has(i)) || (match && !hov && match.has(i));
    const big = nd.hub || nd.deg >= 6;
    const a = always ? 1 : hov || match ? 0 : big ? Math.max(fade, 0.85) : fade;
    if (a <= 0.02) continue;
    const r = Math.max(graphRadius(nd), graphShape(nd) === "dot" ? 0 : 6.5);
    const px = gX(g, nd), py = gY(g, nd);
    if (px < -100 || py < -40 || px > w + 100 || py > h + 20) continue;
    x.globalAlpha = i === fi ? 1 : 0.85 * a;
    x.fillStyle = i === fi ? fg : fg2;
    const text = nd.label.length > 30 ? nd.label.slice(0, 29) + "…" : nd.label;
    if (roomFor(px, py + r + 3, x.measureText(text).width, i === fi))
      x.fillText(text, px, py + r + 3);
  }
  x.globalAlpha = 1;
}
