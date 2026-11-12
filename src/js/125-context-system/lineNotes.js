/* The notes around a line, for a dialog that covers them (#368): the lines it
   is written under, the line, and what is written under it. A project is
   named and given its outcome with the meeting notes it came from in view.
   Null when the line stands alone. */
function lineNotes(path, block) {
  const page = getPage(path);
  if (page) flattenBlocks(page.blocks);
  const trail = [];
  for (let p = block._parent; p && trail.length < 3; p = p._parent) trail.unshift(p);
  const under = [];
  const walk = (kids, depth) => {
    for (const k of kids || []) {
      if (under.length >= 8 || isMessage(k)) continue;
      under.push([k, depth]);
      if (depth < 2) walk(k.children, depth + 1);
    }
  };
  walk(block.children, 1);
  if (!trail.length && !under.length) return null;
  const row = (b, depth, cls = "") => el("li", {class: cls, style: "margin-left:" + depth * 14 + "px", translate: "no",
    html: renderInline(bujoText(b.title || ""))});
  return el("div", {class: "field linenotes"},
    el("label", {}, "From your notes"),
    el("ul", {},
      ...trail.map((b, i) => row(b, i, "up")),
      row(block, trail.length, "this"),
      ...under.map(([b, d]) => row(b, trail.length + d))));
}
