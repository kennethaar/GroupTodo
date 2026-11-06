function viewContextSort() {
  const box = el("div", {class: "ctxsort"});
  const cols = el("div", {class: "ctxcols"});
  const parentOf = n => n.includes("/") ? n.slice(0, n.lastIndexOf("/")) : "";
  // Folder order, part by part, so home/kitchen comes right under home.
  const order = (a, b) => {
    const x = a.split("/"), y = b.split("/");
    for (let i = 0; i < Math.min(x.length, y.length); i++) {
      const d = x[i].localeCompare(y[i]);
      if (d) return d;
    }
    return x.length - y.length;
  };
  const take = (space, name) => {
    const path = contextPath(name);
    inSpace(space, () => { if (!V.pages.has(path)) putPage(path, pageTemplateFor("c", name)); });
    return {path, space};
  };
  const putIn = (space, name, into) => into ? nestContext(take(space, into), take(space, name)) : unnestContext(take(space, name));
  // Where it can go: not itself, not one inside it, not where it is now.
  const homes = (names, n) => names.filter(p => p !== n && !p.startsWith(n + "/") && p !== parentOf(n));
  const spaces = visibleSpaces().filter(s => LOADED.has(s));
  const byName = new Map(spaces.map(space => [space, inSpace(space, () => contextList()).sort(order)]));
  const otherAreas = space => spaces.filter(s => s !== space);
  const moveMenu = (space, n) => {
    const names = byName.get(space);
    const items = [
      ...(n.includes("/") ? [{kind: "top"}] : []),
      ...homes(names, n).map(to => ({kind: "home", to})),
      ...otherAreas(space).flatMap(s => [{kind: "move", area: s}, {kind: "copy", area: s}]),
    ];
    listPicker({
      title: "Move or copy @" + n, items, typeahead: true,
      label: it => it.kind === "top" ? "On its own, at the top"
        : it.kind === "home" ? "Inside @" + it.to
        : (it.kind === "move" ? "Move to " : "Copy to ") + it.area,
      onPick: it => it.kind === "move" || it.kind === "copy"
        ? transferContextBranch(space, n, it.area, {mode: it.kind})
        : putIn(space, n, it.kind === "top" ? "" : it.to),
    });
  };
  const target = (node, space, into, sameAreaOk) => {
    const ok = d => d.space === space ? sameAreaOk(d.name) : true;
    node.addEventListener("dragover", e => {
      if (!CTX_DRAG || !ok(CTX_DRAG)) return;
      e.preventDefault(); e.stopPropagation(); node.classList.add("over");
      try { e.dataTransfer.dropEffect = (CTX_DRAG.space !== space || e.altKey) ? "copy" : "move"; } catch (_) {}
    });
    node.addEventListener("dragleave", () => node.classList.remove("over"));
    node.addEventListener("drop", e => {
      node.classList.remove("over");
      const d = CTX_DRAG; CTX_DRAG = null;
      if (!d || !ok(d)) return;
      e.preventDefault(); e.stopPropagation();
      if (d.space === space) putIn(space, d.name, into);
      else transferContextBranch(d.space, d.name, space, {mode: e.altKey ? "copy" : "move", into});
    });
    return node;
  };
  for (const space of spaces) {
    const names = byName.get(space);
    // Only one area, and it has nothing: there is no sort to do -- the empty
    // card above already said so. With several areas, an empty one still
    // needs its column, or nothing dragged could ever land there first.
    if (!names.length && spaces.length <= 1) continue;
    const has = new Set(names);
    // How deep it sits: one step for each of its folders that is a context too.
    const depth = n => n.split("/").slice(0, -1).filter((_, i, a) => has.has(a.slice(0, i + 1).join("/"))).length;
    const label = n => has.has(parentOf(n)) ? n.slice(parentOf(n).length + 1) : n;
    const col = el("div", {class: "ctxcol"});
    if (spaces.length > 1) col.append(el("div", {class: "group"}, space));
    const tree = el("div", {class: "ctxtree"},
      target(el("div", {class: "ctxtop", title: "Drop a context here, from this area or another, to put it at the top"},
        svgIcon(ICON_ARROW_UP), " Top"), space, "", n => n.includes("/")));
    for (const n of names) {
      const icon = contextIcon(n);
      const row = el("div", {class: "ctxsrow", draggable: "true", style: "--d:" + depth(n), data: {ctx: n},
        title: "Drag onto a context, or into another area, to nest it there. Alt-drag to copy."},
        el("span", {class: "ctxgrip", "aria-hidden": "true"}, "⠿"),
        el("button", {class: "ctxsname", title: "Open " + contextPath(n), onclick: () => openContextPage(n)},
          (icon ? icon + " " : "") + "@" + label(n)),
        el("button", {class: "iconbtn ctxmore", title: "Move or copy @" + n, "aria-label": "Move or copy @" + n,
          onclick: () => moveMenu(space, n)}, "⋯"));
      row.addEventListener("dragstart", e => {
        CTX_DRAG = {space, name: n};
        row.classList.add("dragging");
        try { e.dataTransfer.setData("text/plain", "@" + n); e.dataTransfer.effectAllowed = "copyMove"; } catch (_) {}
      });
      row.addEventListener("dragend", () => { CTX_DRAG = null; row.classList.remove("dragging"); });
      tree.append(target(row, space, n, d => homes(names, d).includes(n)));
    }
    col.append(tree);
    cols.append(col);
  }
  box.append(cols);
  return box;
}
