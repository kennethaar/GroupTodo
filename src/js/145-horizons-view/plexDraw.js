function plexDraw(cv, g, targets, hoverKey) {
  const w = cv.clientWidth, h = cv.clientHeight;
  if (!w || !h) return;
  const dpr = window.devicePixelRatio || 1;
  if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
  const x = cv.getContext("2d");
  if (!x) return;
  x.setTransform(dpr, 0, 0, dpr, 0, 0);
  x.clearRect(0, 0, w, h);

  const css = getComputedStyle(document.documentElement);
  const v = (n, f) => trim(css.getPropertyValue(n)) || f;
  const accent = v("--accent", "#6aa3ff"), fg = v("--fg", "#e6e9ef"), fg2 = v("--fg2", "#a4acbd");
  const sans = v("--sans", "sans-serif");
  const here = PLEX.pos.get(plexFocus());

  /* Links first, as curves through the middle: a straight line between two
     dots says "these two", a curve that bends toward the centre says "both of
     these belong to the one in the middle", which is the thing being shown. */
  x.lineWidth = 1.4;
  for (const [a, b] of g.edges) {
    const ka = g.nodes[a].key, kb = g.nodes[b].key;
    const pa = PLEX.pos.get(ka), pb = PLEX.pos.get(kb);
    if (!pa || !pb) continue;
    const lit = ka === plexFocus() || kb === plexFocus();
    x.globalAlpha = Math.min(pa.a, pb.a) * (lit ? 0.85 : 0.22);
    x.strokeStyle = lit ? accent : fg2;
    x.beginPath();
    x.moveTo(pa.x, pa.y);
    if (here) x.quadraticCurveTo((pa.x + pb.x) / 2 * 0.6 + here.x * 0.4,
                                 (pa.y + pb.y) / 2 * 0.6 + here.y * 0.4, pb.x, pb.y);
    else x.lineTo(pb.x, pb.y);
    x.stroke();
  }

  if (PLEX.drag) {
    const from = PLEX.pos.get(PLEX.drag.from);
    if (from) {
      x.globalAlpha = .9; x.strokeStyle = accent; x.setLineDash([5, 4]);
      x.beginPath(); x.moveTo(from.x, from.y); x.lineTo(PLEX.drag.x, PLEX.drag.y); x.stroke();
      x.setLineDash([]);
    }
  }

  x.textBaseline = "top";
  /* Two names written on top of each other are worse than one name, and a name
     written across a dot is worse than both. So every dot reserves its own
     patch first, the names are drawn afterwards in a pass of their own, and a
     name that cannot find space is simply left out -- walking onto the dot, or
     pointing at it, is how you read that one. */
  const taken = [];
  const free = box => {
    for (const t of taken)
      if (box[0] < t[2] && box[2] > t[0] && box[1] < t[3] && box[3] > t[1]) return false;
    return true;
  };
  const jobs = [];

  // Nearest last, so the middle is never drawn under something behind it.
  const drawn = [...PLEX.pos.entries()]
    .filter(([k]) => targets.has(k))
    .sort((p, q) => (targets.get(q[0]).ring) - (targets.get(p[0]).ring));

  for (const [k, pos] of drawn) {
    const t = targets.get(k);
    const nd = g.nodes[t.idx];
    const focused = k === plexFocus();
    const hot = k === hoverKey;
    x.globalAlpha = pos.a * (nd.task && !OPEN_STATES[nd.state] ? 0.55 : 1);
    const colour = v(GRAPH_KIND_VAR[nd.kind] || "--fg2", "#a4acbd");
    const rad = pos.r + (hot ? 2 : 0);
    /* The silhouette says what the thing is -- bolt, bust, house, flag, @ --
       and the colour is left to say what state it is in. A closed todo is
       drawn hollow, like a page nobody has made yet. */
    const hollow = nd.ghost || (nd.task && !OPEN_STATES[nd.state]);
    graphFace(x, nd, pos.x, pos.y, rad,
              {colour, bg: v("--bg2", "#161920"), hollow, sans: sans});
    if (focused) {
      x.globalAlpha = pos.a;
      x.strokeStyle = accent; x.lineWidth = 2;
      x.beginPath(); x.arc(pos.x, pos.y, pos.r + 5, 0, Math.PI * 2); x.stroke();
    }
    /* Where the keyboard is. Dashed, so it reads as "about to be chosen"
       rather than as "chosen", which is what the solid ring in the middle
       already says. */
    if (k === PLEX.cursor && !focused) {
      x.globalAlpha = 1;
      x.strokeStyle = accent; x.lineWidth = 1.8; x.setLineDash([4, 3]);
      x.beginPath(); x.arc(pos.x, pos.y, pos.r + 6, 0, Math.PI * 2); x.stroke();
      x.setLineDash([]);
    }
    // The dot keeps its own space, so no name is ever written across it.
    taken.push([pos.x - rad - 2, pos.y - rad - 2, pos.x + rad + 2, pos.y + rad + 2]);
    // Ring two is the depth cue, so it carries no words unless you point at it.
    const marked = focused || hot || k === PLEX.cursor;
    if (t.ring === 2 && !marked) continue;
    const name = nd.label + (nd.more ? " (+" + nd.more + " more)" : "");
    /* Shorter the further out it sits. A ring of thirty-character names is a
       wall of text with a map somewhere behind it. */
    const cap = marked ? 34 : t.ring === 2 ? 18 : 24;
    jobs.push({pos, t, marked, focused, text: name.length > cap ? name.slice(0, cap - 1) + "…" : name});
  }

  /* Names last, and the ones that matter first: whatever is marked wins its
     space outright -- it is the answer to "what am I on" -- and gets a patch of
     background behind it so it stays readable where it has to overlap. */
  x.textAlign = "center";
  jobs.sort((p, q) => (q.marked - p.marked) || ((p.t.rank || 0) - (q.t.rank || 0)));
  for (const job of jobs) {
    const {pos, t} = job;
    x.font = (job.focused ? "600 13px " : "11.5px ") + v("--sans", "sans-serif");
    const tw = x.measureText(job.text).width;
    /* Which way the name hangs off its dot. Overhead for what points here,
       underfoot for what this points at, beside it out on the flanks -- so the
       names fan out the way the dots do instead of all queueing downward. The
       second spot is where it goes when the first one is already spoken for,
       which is most of what saves a name from being dropped. */
    const under = [pos.x, pos.y + pos.r + 6], over = [pos.x, pos.y - pos.r - 17];
    const spots = t.label === "above" ? [over, under]
                : t.label === "left"  ? [[pos.x - pos.r - 6 - tw / 2, pos.y - 6], under, over]
                : t.label === "right" ? [[pos.x + pos.r + 6 + tw / 2, pos.y - 6], under, over]
                : [under, over];
    let box = null, tx = 0, ty = 0;
    for (const [sx, sy] of spots) {
      // A name half off the canvas is not a name.
      tx = Math.max(tw / 2 + 4, Math.min(w - tw / 2 - 4, sx));
      ty = Math.max(2, Math.min(h - 16, sy));
      const cand = [tx - tw / 2 - 3, ty - 2, tx + tw / 2 + 3, ty + 15];
      if (free(cand) || job.marked) { box = cand; break; }
    }
    if (!box) continue;
    taken.push(box);
    if (job.marked) {
      x.globalAlpha = pos.a * 0.88;
      x.fillStyle = v("--bg", "#0f1115");
      if (x.roundRect) { x.beginPath(); x.roundRect(box[0], box[1], box[2] - box[0], box[3] - box[1], 4); x.fill(); }
      else x.fillRect(box[0], box[1], box[2] - box[0], box[3] - box[1]);
    }
    x.globalAlpha = pos.a;
    x.fillStyle = job.marked ? fg : fg2;
    x.fillText(job.text, tx, ty);
  }
  x.globalAlpha = 1;
}
