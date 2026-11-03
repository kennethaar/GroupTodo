function viewBookRevise(c) {
  c.append(vhead(bookName(), null, viewSeg("book")));
  const chapters = bookChapters().filter(ch => ch.path);
  if (!chapters.length) { c.append(emptyCard("No chapter has a page yet. Add one under Chapters.")); return c; }
  const looks = chapters.map(ch => ({ch, look: proseLook(chapterText(ch.path))}));
  const head = el("div", {class: "revrow revhead"}, ...["Chapter", "Reads", "Words a sentence", "Long", "Talk", "Telling", "-ly", "Again"]
    .map(t => el("span", {}, t)));
  const rows = looks.map(({ch, look}) => {
    const open = REV.open === ch.path;
    const cell = (n, warn) => el("span", {class: warn ? "warn" : ""}, String(n));
    return el("div", {class: "revitem" + (open ? " open" : "")},
      el("button", {class: "revrow", "aria-expanded": String(open), onclick: () => { REV.open = open ? null : ch.path; render(); }},
        el("span", {class: "nm"}, pageTitle(ch.path)),
        el("span", {class: look.lix >= 50 ? "warn" : "", title: "LIX " + Math.round(look.lix)}, lixWord(look.lix)),
        cell(look.avg.toFixed(1), look.avg > 22),
        cell(look.long.length, look.long.length > 0),
        el("span", {}, Math.round(100 * look.talk) + "%"),
        cell(look.filters.length, look.filters.length > look.words / 200),
        cell(look.adverbs.length, look.adverbs.length > look.words / 150),
        cell(look.repeats.length, look.repeats.length > 0)),
      open ? reviseDetail(ch.path, look) : null);
  });
  c.append(el("div", {class: "card revtable"}, head, ...rows));
  const all = chapters.flatMap(ch => chapterText(ch.path));
  const top = topWords(all);
  if (top.length) c.append(section("Words you use most", null, el("div", {class: "card revwords"},
    ...top.map(([w, n]) => el("span", {class: "chip"}, w + " ", el("small", {}, String(n)))))));
  const clashes = factClashes();
  if (clashes.length) c.append(section("Not as their page says", clashes.length, el("div", {class: "card rellist"}, ...clashes.map(x =>
    el("div", {class: "relrow"}, el("span", {class: "nm"}, x.who + ": " + x.key + " " + x.fact + ", but " + x.said),
      el("button", {class: "textbtn", onclick: () => openPage(x.path)}, x.text))))));
  return c;
}
