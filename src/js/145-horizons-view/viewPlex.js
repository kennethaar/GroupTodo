function viewPlex() {
  const c = el("div", {class: "wrap"});
  const g = plexGraph();
  const focusKey = plexDefaultFocus(g);
  state.graphFocus = focusKey;
  // The keyboard points at the middle until an arrow key moves it off.
  if (!PLEX.cursor || !g.nodes.some(n => n.key === PLEX.cursor)) PLEX.cursor = focusKey;
  const cv = el("canvas", {class: "graphcv"});
  const stage = el("div", {class: "graph plex"}, cv);
  const edit = () => !!state.graphEdit;

  const head = el("div", {class: "section", style: "display:flex;gap:8px;align-items:center;flex-wrap:wrap"},
    el("h2", {style: "margin:0;flex:1"},
      focusKey ? (g.nodes.find(n => n.key === focusKey) || {}).label : "Nothing linked yet"),
    el("button", {class: "btn sm " + (edit() ? "primary" : "ghost"),
      onclick: () => { state.graphEdit = !state.graphEdit; render(); }},
      edit() ? "Editing" : "Edit"));
  c.append(head, stage);

  if (!g.nodes.length) {
    c.append(el("div", {class: "section quiet"}, el("div", {style: "color:var(--fg3)"},
      "Nothing to draw yet. Pages join the plex as soon as something links to them.")));
    return c;
  }

  const keyline = el("span", {class: "glg"});
  c.append(el("div", {class: "graph-legend"},
    el("span", {class: "glg"}, "Above: what points here. Below: what this points at. Sides: shares a parent."),
    el("span", {class: "glg"}, "Bolt: a todo, coloured by its state, hollow once it is closed. " +
      "Bust: a person. House: an org. Flag: a project. @: a context. Dot: any other page."),
    keyline,
    el("span", {class: "glg quiet"}, edit()
      ? "Drag one dot onto another to link them. Drag into space, or double-click space, to make a page."
      : "Click a dot to move the middle. Double-click it to look at it without leaving. Space edits it.")));

  let hover = null;
  const targets = (w, h) => plexTargets(g, state.graphFocus, w, h);
  const kick = () => plexAnimate(cv, g, targets, () => hover);
  requestAnimationFrame(kick);

  const nodeAt = (e) => {
    const r = cv.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    let best = null, bestD = Infinity;
    for (const [k, p] of PLEX.pos) {
      const dx = p.x - px, dy = p.y - py, d = dx * dx + dy * dy;
      const reach = p.r + 10;
      if (d <= reach * reach && d < bestD) { best = k; bestD = d; }
    }
    return best;
  };
  const nodeOf = key => {
    const t = plexTargets(g, state.graphFocus, cv.clientWidth, cv.clientHeight).get(key);
    return t ? g.nodes[t.idx] : null;
  };
  const byKey = key => g.nodes.find(n => n.key === key) || null;

  /* Moving the middle redraws the whole screen rather than only the canvas:
     the relatives list below it is the same information, and a list that
     disagrees with the picture above it is worse than no list. The dots animate
     across anyway, because their positions outlive the redraw. */
  const recentre = key => {
    if (!key) return;
    state.graphFocus = key;
    PLEX.cursor = key;
    render();
  };

  const syncKeyline = () => {
    const cur = byKey(PLEX.cursor);
    const mid = PLEX.cursor === state.graphFocus;
    keyline.textContent = "Keys: arrows walk the dots, enter centres the one you are on"
      + ", enter on the middle adds a step under it, space edits it, o opens it"
      + ", backspace goes back up."
      + (cur ? "  On: " + cur.label + (mid ? " (the middle)" : "") : "");
  };
  syncKeyline();

  /* Arrow keys pick the nearest dot in the direction pressed, measured on the
     picture itself rather than along a list: the plex is a map, and up on a map
     means up. Straight ahead beats near, so pressing down from a project walks
     into its tasks instead of sideways into its siblings. */
  const step = (dx, dy) => {
    const w = cv.clientWidth, h = cv.clientHeight;
    const ts = targets(w, h);
    const fromKey = ts.has(PLEX.cursor) ? PLEX.cursor : state.graphFocus;
    const from = ts.get(fromKey);
    if (!from) return;
    let best = null, bestScore = Infinity;
    for (const [k, t] of ts) {
      if (k === fromKey) continue;
      const vx = t.x - from.x, vy = t.y - from.y;
      const along = vx * dx + vy * dy;
      if (along <= 8) continue;
      const across = Math.abs(vx * -dy + vy * dx);
      if (across > along * 2.6 + 40) continue;
      const score = along + across * 2.2;
      if (score < bestScore) { bestScore = score; best = k; }
    }
    if (!best) return;
    PLEX.cursor = best;
    syncKeyline();
    kick();
  };

  const onKey = e => {
    if (!cv.isConnected) { document.removeEventListener("keydown", onKey); return; }
    if ($("#modalRoot").firstChild) return;
    if (/^(INPUT|TEXTAREA)$/.test(e.target.tagName) || e.target.isContentEditable) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const arrows = {ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0]};
    if (arrows[e.key]) { e.preventDefault(); step(arrows[e.key][0], arrows[e.key][1]); return; }
    if (e.key === "Enter") {
      e.preventDefault();
      if (PLEX.cursor && PLEX.cursor !== state.graphFocus) { recentre(PLEX.cursor); return; }
      plexAddChild(byKey(state.graphFocus), () => render());
      return;
    }
    if (e.key === "Backspace") {
      e.preventDefault();
      const rel = plexRelatives(g, state.graphFocus);
      if (rel.parents.length) recentre(g.nodes[rel.parents[0]].key);
      else notify("Nothing points at this one, so there is no way back up.");
      return;
    }
    /* Space edits what the dot is; o opens it. Editing is the thing you reach
       for in the middle of thinking, so it gets the big key. */
    if (e.key === " ") {
      e.preventDefault();
      const nd = byKey(PLEX.cursor) || byKey(state.graphFocus);
      if (nd) plexEditNode(nd, () => render());
      return;
    }
    if (e.key === "o") {
      e.preventDefault();
      const nd = byKey(PLEX.cursor) || byKey(state.graphFocus);
      if (nd) openPlexNode(g, nd);
    }
  };
  // One listener at a time, however many times this screen is drawn.
  if (PLEX.key) document.removeEventListener("keydown", PLEX.key);
  PLEX.key = onKey;
  document.addEventListener("keydown", onKey);

  cv.addEventListener("mousemove", e => {
    if (PLEX.drag) {
      const r = cv.getBoundingClientRect();
      PLEX.drag.x = e.clientX - r.left;
      PLEX.drag.y = e.clientY - r.top;
      kick();
    }
    const k = nodeAt(e);
    if (k === hover && !PLEX.drag) return;
    hover = k;
    cv.style.cursor = k ? (edit() ? "grab" : "pointer") : "default";
    const nd = k ? nodeOf(k) : null;
    cv.title = nd ? nd.label + "  · " +
      (nd.task ? nd.state + " on " + pageTitle(nd.path) : nd.ghost ? "no page yet" : nd.path) : "";
    kick();
  });
  cv.addEventListener("mouseleave", () => { hover = null; PLEX.drag = null; kick(); });

  cv.addEventListener("mousedown", e => {
    if (!edit()) return;
    const k = nodeAt(e);
    if (!k) return;
    const r = cv.getBoundingClientRect();
    PLEX.drag = {from: k, x: e.clientX - r.left, y: e.clientY - r.top};
    e.preventDefault();
    kick();
  });
  cv.addEventListener("mouseup", e => {
    const d = PLEX.drag;
    PLEX.drag = null;
    if (!d) return;
    const onto = nodeAt(e);
    const fromNode = nodeOf(d.from);
    if (!fromNode) { kick(); return; }
    if (onto && onto !== d.from) {
      const toNode = nodeOf(onto);
      if (fromNode.task || toNode.task) {
        notify("Links join pages. To move a task, open it and refile it.", "warn");
        kick(); return;
      }
      const ref = toNode.ghost ? toNode.ref : inSpace(toNode.space, () => pageRef(toNode.path));
      if (fromNode.ghost) { notify("Make " + fromNode.label + " a page first, then it can link out.", "warn"); kick(); return; }
      if (linkPages(fromNode, ref)) { notify(fromNode.label + " now links to " + toNode.label); render(); }
      else { notify("That link is already there."); kick(); }
      return;
    }
    // Dragged out into nothing: a new child, born attached to what it came from.
    if (fromNode.ghost) { notify("Make " + fromNode.label + " a page first.", "warn"); kick(); return; }
    plexAddChild(fromNode, () => render());
  });

  /* A single click moves the middle and a double click opens the modal, so the
     single one waits long enough to find out which it was. Neither leaves the
     graph: looking around is the whole job of this screen. */
  let pending = null;
  cv.addEventListener("click", e => {
    const k = nodeAt(e);
    if (pending) { clearTimeout(pending); pending = null; }
    if (!k) return;
    pending = setTimeout(() => {
      pending = null;
      recentre(k);
    }, 200);
  });
  cv.addEventListener("dblclick", e => {
    if (pending) { clearTimeout(pending); pending = null; }
    const k = nodeAt(e);
    if (k) { const nd = nodeOf(k); if (nd) openPlexNode(g, nd); return; }
    if (edit()) plexNameModal(nodeOf(state.graphFocus), () => render());
  });

  /* The same relatives as buttons, because a canvas is invisible to a keyboard
     and to a screen reader, and because unlinking wants a list and not a drag. */
  const rel = plexRelatives(g, state.graphFocus);
  const here = g.nodes[rel.i];
  const sideList = (idxs, dir) => {
    const box = el("div", {class: "pagelist"});
    if (!idxs.length) {
      box.append(el("div", {class: "dash-item", style: "color:var(--fg3)"},
        dir === "in" ? "Nothing points here yet." : "This points at nothing yet."));
      return box;
    }
    for (const i of idxs) {
      const other = g.nodes[i];
      const row = el("div", {class: "dash-item"},
        el("button", {class: "nm", style: "all:unset;flex:1;cursor:pointer",
          onclick: () => go("pages", {sub: "mindmap", graphFocus: other.key})}, other.label));
      if (edit() && here && !here.ghost && !here.task && !other.task && dir === "out")
        row.append(el("button", {class: "btn sm ghost", onclick: () => {
          const ref = other.ghost ? other.ref : inSpace(other.space, () => pageRef(other.path));
          if (unlinkPages(here, ref)) { notify("Unlinked " + other.label); render(); }
        }}, "Unlink"));
      box.append(row);
    }
    return box;
  };
  const panel = el("details", {class: "section", open: edit() ? "" : null},
    el("summary", {}, "The same relatives as a list"),
    el("div", {class: "field"}, el("label", {}, "Points here"), sideList(rel.parents, "in")),
    el("div", {class: "field"}, el("label", {}, "Points at"), sideList(rel.children, "out")));
  if (edit() && here && !here.ghost)
    panel.append(el("button", {class: "btn sm ghost", onclick: () => plexAddChild(here, () => render())},
      here.task || inSpace(here.space, () => statusDirOf(here.path))
        ? "Add a step under this one" : "Add a page linked to this one"));
  c.append(panel);
  return c;
}
