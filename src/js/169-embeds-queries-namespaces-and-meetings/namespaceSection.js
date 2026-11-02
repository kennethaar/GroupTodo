function namespaceSection(path) {
  const ns = namespaceMembers(path);
  if (!ns) return null;
  const space = V.space;
  const tree = {name: ns.root, path: null, kids: new Map()};
  for (const m of ns.members) {
    let node = tree;
    for (const s of m.segs.slice(1)) {
      const k = s.toLowerCase();
      if (!node.kids.has(k)) node.kids.set(k, {name: s, path: null, kids: new Map()});
      node = node.kids.get(k);
    }
    if (!node.path || m.path.length < node.path.length) node.path = m.path;
  }
  let shown = 0;
  const draw = node => {
    const li = el("li", {});
    const label = node.path
      ? el("button", {class: "nsname" + (node.path === path ? " here" : ""), "aria-current": node.path === path ? "page" : null,
          title: node.path === path ? "This page" : "Open " + pageTitle(node.path),
          onclick: () => { if (node.path !== path) openPageIn(space, node.path); }}, node.name)
      : el("span", {class: "nsname none", title: "No page by this name yet"}, node.name);
    li.append(label);
    const kids = [...node.kids.values()].sort((a, b) => a.name.localeCompare(b.name));
    if (kids.length && shown < NS_MAX) {
      const ul = el("ul", {});
      for (const k of kids) { if (shown++ >= NS_MAX) { ul.append(el("li", {class: "nsmore"}, "…")); break; } ul.append(draw(k)); }
      li.append(ul);
    }
    return li;
  };
  return el("div", {class: "section quiet nstree"},
    el("h3", {}, el("span", {}, "Namespace"), el("span", {class: "n"}, String(ns.members.length))),
    el("div", {class: "card"}, el("ul", {class: "nsroot"}, draw(tree))));
}
