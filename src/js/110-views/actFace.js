function actFace(r, f) {
  const ctx = inS(r, () => blockContext(r.block));
  const day = isJournalPath(r.path) ? dateIn(baseName(r.path)) : null;
  const where = !isJournalPath(r.path) ? inS(r, () => pageTitle(r.path)) : r.project || (day ? "day page of " + humanDate(day) : "a day page");
  const meta = el("div", {class: "t-meta"}, spaceBadge(r.space),
    el("span", {class: "chip", translate: "no"}, where),
    ctx ? el("span", {class: "chip"}, "@" + ctx) : null,
    r.state === "DOING" ? el("span", {class: "chip"}, "Doing") : null,
    r.due ? el("span", {class: "chip"}, "due " + humanDate(r.due)) : null,
    r.age && !isChore(r) ? el("span", {class: "chip"}, r.age === 1 ? "1 day old" : r.age + " days old") : null);
  // A stale chore says how far behind it is: the reason it is on the table.
  const fr = isChore(r) ? inS(r, () => freshnessOf(r)) : null;
  if (fr) meta.append(el("span", {class: "chip", translate: "no"}, "repeat:: " + repeatOf(r.block)), inS(r, () => freshnessBar(r)),
    el("span", {class: "chip late actstale"}, Math.floor(fr.rounds) + " rounds missed"));
  const title = el("h3", {translate: "no"}, plainTitle(r.block.title));
  if (!f) return el("div", {class: "solcard won"}, title, meta,
    el("div", {class: "t-meta"}, el("span", {class: "chip ok"}, "Answered")),
    el("button", {class: "btn primary", onclick: () => solPassDone(r)}, "Next card ›"));
  return el("div", {class: "solcard", data: {solDrag: "1"}, tabindex: "0", title: "Drag onto an answer, or use the arrow keys"},
    title, meta,
    el("div", {class: "t-meta"},
      el("button", {class: "textbtn", onclick: () => inS(r, () => openTaskDetail(r.path, r.block, r.space))}, "Open the line"),
      el("button", {class: "textbtn", onclick: () => previewPage(r.space, r.path, true)}, "Open the page")),
    el("div", {class: "solq"}, el("b", {}, ACT_ASK[f.k])));
}
