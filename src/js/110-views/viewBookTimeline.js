function viewBookTimeline(c) {
  c.append(vhead(bookName(), null, viewSeg("book")));
  if (bookScopeBar()) c.append(el("div", {class: "fbar"}, bookScopeBar()));
  const {rows, clashes} = bookTimeline(), byKey = new Map(castEntries().map(e => [e.key, e]));
  const dated = rows.filter(r => r.t), times = [...new Set(dated.map(r => r.t.at))].sort((a, b) => a - b);
  if (!dated.length) {
    c.append(emptyCard("No scene says when it happens yet. Write when:: Day 3 or when:: 1987 under a scene's ## line."));
  } else {
    /* Across: the story's time, one column per moment, as far apart as each
       other however far apart they are. Down: whose eyes it is seen through. */
    const lanes = [...new Set(dated.map(r => r.pov || ""))];
    const grid = el("div", {class: "tlgrid", style: `grid-template-columns:max-content repeat(${times.length}, minmax(120px, 1fr))`});
    grid.append(el("div", {class: "tlcorner"}), ...times.map(t => el("div", {class: "tlhead"}, dated.find(r => r.t.at === t).when)));
    for (const lane of lanes) {
      grid.append(el("div", {class: "tllane"}, lane ? byKey.get(lane)?.name || "" : "No point of view"));
      for (const t of times) grid.append(el("div", {class: "tlcell"}, ...dated.filter(r => r.t.at === t && (r.pov || "") === lane).map(r =>
        el("button", {class: "tlscene" + (r.back ? " back" : ""), title: (r.back ? "Told after a scene that happens later. " : "") + "Open it",
          onclick: () => openScene(r.scene)},
          el("span", {class: "tln"}, String(r.n)), r.scene.name || "Opening"))));
    }
    c.append(el("div", {class: "card tlcard"}, grid));
  }
  const back = rows.filter(r => r.back);
  if (back.length) c.append(section("Told out of order", back.length, el("div", {class: "card rellist"}, ...back.map(r =>
    el("div", {class: "relrow"}, el("span", {class: "nm"}, r.n + ". " + (r.scene.name || "Opening")),
      el("span", {class: "sub"}, r.when + " · told after a later scene"))))));
  if (clashes.length) c.append(section("In two places at once", clashes.length, el("div", {class: "card rellist tlclash"}, ...clashes.map(x =>
    el("div", {class: "relrow"}, el("span", {class: "nm"}, byKey.get(x.who)?.name || ""),
      el("span", {class: "sub"}, x.a.when + ": " + sceneProp(x.a.scene, "place").replace(/\[\[|\]\]/g, "") + " (" + x.a.n + ") and " +
        sceneProp(x.b.scene, "place").replace(/\[\[|\]\]/g, "") + " (" + x.b.n + ")"))))));
  const none = rows.filter(r => !r.t);
  if (none.length) c.append(section("No time in the story yet", none.length, el("div", {class: "card rellist"}, ...none.map(r =>
    el("div", {class: "relrow"}, el("button", {class: "textbtn", onclick: () => r.scene.block ? editScene(r.scene) : openScene(r.scene)},
      r.n + ". " + (r.scene.name || "Opening") + " · " + pageTitle(r.scene.path)),
      el("span", {class: "sub"}, r.when ? "“" + r.when + "” is not read as a time" : "no when::"))))));
  return c;
}
