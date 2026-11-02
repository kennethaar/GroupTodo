/* One line of an embed, read-only, children and all. A click goes to where
   it is written; a task's state can be ticked from here, since that is what
   an embedded list of tasks is usually for. */
function embedLine(path, b, seen, depth, budget) {
  const space = V.space;
  const node = el("div", {class: "eblk"});
  if (budget.n-- <= 0) { node.append(el("div", {class: "eempty"}, "… and more on the page itself.")); return node; }
  const line = el("div", {class: "eline", title: "Go to this line",
    onclick: e => { if (e.target.closest("[data-link], [data-bref], a[href], .tick")) return; openBlockAt(space, path, b); }});
  if (b.state) line.append(lineStateButton(space, path, b));
  line.append(el("span", {class: "etxt", html: lineHtml(b)}));
  node.append(line);
  for (const l of b.body || []) node.append(el("div", {class: "ebodyline", translate: "no", html: renderInline(l)}));
  const inner = liveMacros(path, b, seen, depth);
  if (inner) node.append(inner);
  const kids = b.children || [];
  if (kids.length && b.collapsed) node.append(el("div", {class: "eempty"}, "▸ " + kids.length + " folded"));
  else for (const k of kids) node.append(embedLine(path, k, seen, depth, budget));
  return node;
}
