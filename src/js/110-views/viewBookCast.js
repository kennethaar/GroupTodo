/* ---------- Book › Cast (#247) ----------
   Who and what is in the story, the protagonist first, then by how much they
   are in it. A character shows the four signs of depth: missing ones in the
   warning colour, the two to write on their page one click away. */
function viewBookCast(c) {
  const scope = bookScope(), stats = castStats(scope), hero = stats.hero;
  const chapterName = i => { const ch = stats.chapters[i]; return ch ? (ch.path ? pageTitle(ch.path) : ch.name) : ""; };
  /* This book: who is in its scenes, and who is in no book's yet, as a
     character just made is. Those in the other books are under All books. */
  const series = scope === "book" && bookPaths().length > 1 ? castStats("all") : null;
  const shown = st => !series || st.scenes > 0 || st.entry.key === hero || !series.get(st.entry.key)?.scenes;
  c.append(vhead(bookName(), null, newBtn("character", () => newCastPrompt("character")), viewSeg("book")));
  const heroE = hero ? stats.get(hero).entry : null;
  c.append(el("div", {class: "fbar castbar"},
    el("span", {class: "say"}, "Protagonist"),
    el("button", {class: "fchip casthero", title: "Whose story it is. The depth signs are measured against them.",
      onclick: pickProtagonist}, heroE ? heroE.name : "Pick one"),
    bookScopeBar(),
    el("span", {class: "gap"}),
    el("button", {class: "textbtn", onclick: () => newCastPrompt("place")}, "+ New place"),
    el("button", {class: "textbtn", onclick: () => newCastPrompt("thing")}, "+ New thing")));
  const row = st => {
    const e = st.entry, depth = st.depth, apply = depth ? depth.filter(d => !d.na) : [];
    const facts = [st.scenes ? st.scenes + (st.scenes === 1 ? " scene" : " scenes") : "in no scene yet",
      st.pov ? st.pov + " seen through their eyes" : "", st.spoken ? Math.round(100 * st.share) + "% of the talk" : "",
      st.first != null ? (st.first === st.last ? chapterName(st.first) : chapterName(st.first) + " – " + chapterName(st.last)) : ""].filter(Boolean);
    return el("div", {class: "castrow", data: {key: e.key}},
      el("div", {class: "castmain"},
        el("div", {class: "casttop"},
          e.path ? el("button", {class: "nm", title: "Open the page", onclick: () => openPage(e.path)}, e.name) : el("span", {class: "nm"}, e.name),
          e.key === hero ? el("span", {class: "chip casttag"}, "protagonist") : null,
          e.path ? null : el("button", {class: "textbtn castmake", title: "Named in a scene, with no page yet",
            onclick: () => { makeCastPage(e.name, e.type); render(); }}, "+ Make a page")),
        el("div", {class: "castfacts"}, facts.join(" · ")),
        depth ? el("div", {class: "castdepth"}, ...depth.map(d => {
          const cls = "dep " + (d.na ? "na" : d.ok ? "ok" : "miss"), mark = d.na ? "– " : d.ok ? "✓ " : "✗ ";
          const tip = d.na ? "The protagonist" : d.said || d.tip || d.label;
          return d.prop && e.path && !d.na
            ? el("button", {class: cls, title: d.said || d.ask, onclick: () => askCastValue(e.path, d.prop, d.ask)}, mark + d.label)
            : el("span", {class: cls, title: tip}, mark + d.label);
        })) : null),
      depth ? el("span", {class: "castscore", title: "Signs of depth"},
        el("span", {class: "pbar"}, el("i", {style: "width:" + Math.round(100 * apply.filter(d => d.ok).length / Math.max(1, apply.length)) + "%"})),
        el("span", {class: "ratio"}, apply.filter(d => d.ok).length + "/" + apply.length)) : null);
  };
  for (const [type, title] of CAST_TYPES) {
    const rows = [...stats.values()].filter(st => st.entry.type === type && shown(st))
      .sort((a, b) => (b.entry.key === hero) - (a.entry.key === hero) || b.scenes - a.scenes || a.entry.name.localeCompare(b.entry.name));
    if (!rows.length && type !== "character") continue;
    c.append(section(title, rows.length, rows.length ? el("div", {class: "card castlist"}, ...rows.map(row))
      : emptyCard("No characters yet. + New character adds one. So does a name in a scene's pov:: or with::.")));
  }
  return c;
}
