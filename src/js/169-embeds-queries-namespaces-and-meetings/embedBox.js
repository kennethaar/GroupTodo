function embedBox(fromPath, m, seen, depth) {
  const space = V.space;
  const box = el("div", {class: "embedbox"});
  const head = (label, open) => el("div", {class: "ehead"},
    el("span", {class: "eic", "aria-hidden": "true"}, "⧉"),
    open ? el("button", {class: "textbtn", title: "Open it, to edit it there", onclick: e => { e.stopPropagation(); open(); }}, label)
         : el("span", {}, label));
  if (m.page) {
    const target = findExistingPage(m.page);
    if (!target) {
      box.append(head("No page called “" + m.page + "” yet", null));
      return box;
    }
    box.append(head(pageTitle(target), () => openPageIn(space, target)));
    if (seen.has(target) || depth >= EMBED_MAX_DEPTH) {
      box.append(el("div", {class: "eempty"}, seen.has(target) ? "Already shown above, so not again here." : "Nested too deep to show here."));
      return box;
    }
    const page = getPage(target);
    const next = new Set(seen).add(target);
    const budget = {n: EMBED_MAX_LINES};
    const body = el("div", {class: "ebody"});
    for (const c of page.blocks || []) body.append(embedLine(target, c, next, depth + 1, budget));
    if (!(page.blocks || []).length) body.append(el("div", {class: "eempty"}, "Nothing on that page yet."));
    box.append(body);
    return box;
  }
  const hit = blockById(m.id);
  if (!hit) { box.append(head("The line this showed has gone", null)); return box; }
  const key = hit.path + "\u0000" + m.id.toLowerCase();
  box.append(head("from " + pageTitle(hit.path), () => openBlockAt(space, hit.path, hit.block)));
  if (seen.has(key) || depth >= EMBED_MAX_DEPTH) {
    box.append(el("div", {class: "eempty"}, "Already shown above, so not again here."));
    return box;
  }
  const body = el("div", {class: "ebody"});
  body.append(embedLine(hit.path, hit.block, new Set(seen).add(key), depth + 1, {n: EMBED_MAX_LINES}));
  box.append(body);
  return box;
}
