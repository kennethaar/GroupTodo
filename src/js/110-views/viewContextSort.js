function viewContextSort(acts) {
  const box = el("div", {class: "ctxsort"});
  box.append(el("p", {class: "hint"}, "Drag a context onto another to put it inside. Drag it to the top line to take it out."));
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
  const target = (node, space, into, ok) => {
    node.addEventListener("dragover", e => {
      if (!CTX_DRAG || CTX_DRAG.space !== space || !ok(CTX_DRAG.name)) return;
      e.preventDefault(); e.stopPropagation(); node.classList.add("over");
    });
    node.addEventListener("dragleave", () => node.classList.remove("over"));
    node.addEventListener("drop", e => {
      node.classList.remove("over");
      const d = CTX_DRAG; CTX_DRAG = null;
      if (!d || d.space !== space || !ok(d.name)) return;
      e.preventDefault(); e.stopPropagation();
      putIn(space, d.name, into);
    });
    return node;
  };
  const spaces = visibleSpaces().filter(s => LOADED.has(s));
  for (const space of spaces) {
    const names = inSpace(space, () => contextList()).sort(order);
    if (!names.length) continue;
    const has = new Set(names);
    // How deep it sits: one step for each of its folders that is a context too.
    const depth = n => n.split("/").slice(0, -1).filter((_, i, a) => has.has(a.slice(0, i + 1).join("/"))).length;
    const label = n => has.has(parentOf(n)) ? n.slice(parentOf(n).length + 1) : n;
    if (spaces.length > 1) box.append(el("div", {class: "group"}, space));
    const tree = el("div", {class: "ctxtree"},
      target(el("div", {class: "ctxtop"}, "↑ Top: drop here to take a context out"), space, "", n => n.includes("/")));
    for (const n of names) {
      const here = acts.filter(a => (a.space || V.space) === space && a.context === n).length;
      const icon = contextIcon(n);
      const move = () => listPicker({
        title: "Move @" + n, items: [...(n.includes("/") ? [""] : []), ...homes(names, n)], typeahead: true,
        label: p => p ? "Inside @" + p : "On its own, at the top", onPick: p => putIn(space, n, p),
      });
      const row = el("div", {class: "ctxsrow", draggable: "true", style: "--d:" + depth(n), data: {ctx: n},
        title: "Drag onto another context to put it inside"},
        el("span", {class: "ctxgrip", "aria-hidden": "true"}, "⠿"),
        el("button", {class: "ctxsname", title: "Open " + contextPath(n), onclick: () => openContextPage(n)},
          (icon ? icon + " " : "") + "@" + label(n)),
        el("span", {class: "ctxn"}, here ? here + " to do" : ""),
        el("button", {class: "textbtn ctxmove", title: "Put it inside another context, or take it out", onclick: move}, "Move…"));
      row.addEventListener("dragstart", e => {
        CTX_DRAG = {space, name: n};
        row.classList.add("dragging");
        try { e.dataTransfer.setData("text/plain", "@" + n); e.dataTransfer.effectAllowed = "move"; } catch (_) {}
      });
      row.addEventListener("dragend", () => { CTX_DRAG = null; row.classList.remove("dragging"); });
      tree.append(target(row, space, n, d => homes(names, d).includes(n)));
    }
    box.append(tree);
  }
  return box;
}
