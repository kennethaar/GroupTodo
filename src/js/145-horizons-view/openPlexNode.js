/* Double-click opens the page here rather than leaving: the whole point of a
   plex is that you keep your place while you look around. */
function openPlexNode(g, nd) {
  /* A task node is a task. Opening it is the task panel the rest of the app
     uses, not a page dialog about a page it does not have. */
  if (nd.task) {
    const hit = inSpace(nd.space, () => findBlock(nd.blockId));
    if (hit) { openTaskDetail(hit.path, hit.block, nd.space); return; }
    notify("That task is no longer there.", "warn");
    return;
  }
  const {parents, children} = plexRelatives(g, nd.key);
  const open = nd.ghost ? 0 : inSpace(nd.space, () => {
    const page = getPage(nd.path);
    if (!page) return 0;
    let n = 0;
    walkBlocks(page.blocks, b => { if (OPEN_STATES[b.state] && !isMessage(b)) n++; });
    return n;
  });

  const listOf = (idxs, dir) => {
    if (!idxs.length) return el("div", {style: "color:var(--fg3);font-size:12.5px"},
      dir === "in" ? "Nothing points here yet." : "This points at nothing yet.");
    const box = el("div", {style: "display:flex;gap:6px;flex-wrap:wrap"});
    for (const i of idxs) {
      const other = g.nodes[i];
      box.append(el("button", {class: "chip filter", title: "Go there",
        onclick: () => { closeModal(); go("pages", {sub: "mindmap", graphFocus: other.key}); }}, other.label));
    }
    return box;
  };

  modal({
    center: true,
    title: nd.label,
    hint: nd.ghost ? "no page yet" : (LINK_KIND_WORD[nd.kind] || nd.kind || "page"),
    body: el("div", {},
      nd.ghost ? el("div", {class: "field"},
        el("div", {style: "font-size:13.5px;color:var(--fg2)"},
          "Something links here, but no page has been made yet. Opening it makes one.")) : null,
      !nd.ghost && open ? el("div", {class: "field"},
        el("div", {style: "font-size:13.5px"}, open + " open task" + (open === 1 ? "" : "s") + " on this page.")) : null,
      !nd.ghost ? el("div", {class:"field"},el("label",{},"Where it sits"),inSpace(nd.space,()=>projectGrid(nd.path))) : null,
      el("div", {class: "field"}, el("label", {}, "Points here"), listOf(parents, "in")),
      el("div", {class: "field"}, el("label", {}, "Points at"), listOf(children, "out"))),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Stay here"),
      el("button", {class: "btn ghost", onclick: () => { closeModal(); go("pages", {sub: "mindmap", graphFocus: nd.key}); }},
        "Centre on it"),
      el("button", {class: "btn primary", onclick: () => {
        closeModal();
        if (nd.ghost) inSpace(nd.space, () => followLink(nd.ref));
        else openPageIn(nd.space, nd.path);
      }}, "Open the page"),
    ],
  });
}
