/* The task board with one column per #tag, for whatever labels a team keeps:
   #urgent, #invoice, #q4. The untagged come first, on the left, so they get
   sorted. A card with two tags stands in both columns. Dropping it on a column
   puts that tag on and takes off the tag of the column it came from, so a drag
   is a move as it is everywhere else on a board; No tag takes them all off. */
function tagBoard(items, key, opts = {}) {
  const tags = Array.from(new Map(items.flatMap(a => tagsIn(a.title)).map(t => [t.toLowerCase(), t])).values())
    .sort((x, y) => x.localeCompare(y));
  const board = el("div", {class: "board ctxboard"});
  const byKey = new Map(tags.map(t => [t.toLowerCase(), t]));
  const order = opts.by ? orderedCols(opts.by, ["", ...byKey.keys()]) : ["", ...byKey.keys()];
  for (const tag of order.map(k => byKey.get(k) || null)) {
    // A column put away (on the Next board) is left out, its cards with it.
    const hk = tag ? tag.toLowerCase() : "";
    if (opts.hidden && opts.hidden.has(hk)) continue;
    const here = items.filter(a => tag ? hasTag(a.title, tag) : !tagsIn(a.title).length);
    const col = boardColumn(
      el("div", {class: "bcol-head"}, el("span", {}, tag ? "#" + tag : "No tag"), el("span", {class: "n"}, String(here.length)),
        opts.hideBtn ? opts.hideBtn(hk) : null),
      (kind, x) => kind === "task" && (tag ? !hasTag(x.action.title, tag) : tagsIn(x.action.title).length > 0),
      (x, many, d) => {
        const a = x.action, b = a.block;
        const off = tag ? (d && d.fromTag && hasTag(b.title, d.fromTag) ? [d.fromTag] : []) : tagsIn(b.title);
        const on = tag ? [tag] : [];
        const apply = (add, drop) => inSpace(a.space, () => {
          let t = b.title;
          for (const g of drop) t = withoutTag(t, g);
          for (const g of add) t = withTag(t, g);
          b.title = t; touch(a.path); render();
        });
        apply(on, off);
        if (!many) notify(tag ? "Tagged #" + tag + (off.length ? " instead of #" + off[0] : "") + "." : "Tags taken off.");
        return () => apply(off, on);
      });
    col.dataset.tag = tag || "";
    // No tag stays put at the left edge while the board scrolls, if it is there.
    if (!tag && !board.children.length) col.classList.add("pin");
    if (opts.by) colDraggable(col, opts.by, hk);
    const k = key + ":#" + (tag ? tag.toLowerCase() : "");
    col.append(fillBoardColumn(el("div", {class: "bcol-body", data: {keepScroll: k}}), here, k, boardCard));
    board.append(col);
  }
  if (!tags.length) board.append(el("div", {class: "empty", style: "align-self:flex-start;font-size:13px;max-width:280px"},
    "No tags yet. Write #anything on a task, #urgent or #invoice, and it gets a column here."));
  return board;
}
