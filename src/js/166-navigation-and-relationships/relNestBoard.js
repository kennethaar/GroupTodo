/* With "indent children" on, every card is wrapped and moved under its parent's
   card. A status board lists only leaf tasks, so parents missing from a column
   are added to it, and so are the children of the cards that are there. */
function relNestBoard(root, rows) {
  if (PREF.get("boardNested", "0") !== "1") return;
  const rowMap = new Map(rows.map(r => [relId(r), r]));
  const cards = new Map();
  for (const card of root.querySelectorAll(".bcard[data-rel-id]"))
    if (!cards.has(card.dataset.relId)) cards.set(card.dataset.relId, card);
  const nestable = r => r.block || relKind(r) === "project";
  const supply = (r, body) => {
    const id = relId(r);
    if (cards.has(id)) return;
    const card = relCard(r);
    body.append(card);
    cards.set(id, card);
  };

  const parentOfRow = new Map();
  for (const row of rows)
    for (const child of relChildren(row, rows))
      if (!parentOfRow.has(relId(child))) parentOfRow.set(relId(child), relId(row));
  for (const [id, card] of [...cards]) {
    const seen = new Set([id]);
    for (let next = parentOfRow.get(id); next && !seen.has(next); next = parentOfRow.get(next)) {
      seen.add(next);
      const r = rowMap.get(next);
      if (!r || !nestable(r)) break;
      supply(r, card.closest(".bcol-body"));
    }
  }
  const expand = (r, body, seen) => {
    const id = relId(r);
    if (seen.has(id)) return;
    seen.add(id);
    for (const child of relChildren(r, rows))
      if (nestable(child)) { supply(child, body); expand(child, body, seen); }
  };
  for (const [id, card] of [...cards]) {
    const r = rowMap.get(id);
    if (r && nestable(r)) expand(r, card.closest(".bcol-body"), new Set());
  }

  const parents = new Map();
  for (const row of rows)
    for (const child of relChildren(row, rows)) {
      const id = relId(child);
      if (!parents.has(id) && cards.has(relId(row))) parents.set(id, relId(row));
    }
  // A task's own parent line comes before the project it belongs to.
  for (const row of rows) {
    if (!row.block) continue;
    inSpace(row.space, () => {
      const par = parentOf(getPage(row.path), row.block);
      if (!par || !par.state) return;
      const p = {path: row.path, space: row.space, block: par};
      if (cards.has(relId(p))) parents.set(relId(row), relId(p));
    });
  }

  const wraps = new Map();
  for (const [id, card] of cards) {
    const wrap = el("div", {class: "rel-card-wrap"});
    card.replaceWith(wrap);
    wrap.append(card);
    wraps.set(id, wrap);
  }
  for (const [id, parentId] of parents) {
    const child = wraps.get(id), parent = wraps.get(parentId);
    if (!child || !parent || child === parent) continue;
    let cycle = false;
    const seen = new Set([id]);
    for (let cursor = parentId; cursor; cursor = parents.get(cursor)) {
      if (seen.has(cursor)) { cycle = true; break; }
      seen.add(cursor);
    }
    if (cycle) continue;
    let box = parent.querySelector(":scope > .rel-children");
    if (!box) { box = el("div", {class: "rel-children"}); parent.append(box); }
    box.append(child);
  }
}
