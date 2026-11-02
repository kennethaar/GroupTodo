function queryBox(path, b, m) {
  const space = V.space;
  const box = el("div", {class: "querybox"});
  let res;
  try { res = runQuery(m.q, b); } catch (err) { res = {rows: [], error: String(err.message || err)}; }
  const edit = () => openQueryBuilder({query: m.q, space, onSave: q => inSpace(space, () => {
    b.title = b.title.replace(m.raw, () => "{{query " + q + "}}");
    touch(path); render();
  })});
  box.append(el("div", {class: "ehead"},
    el("span", {class: "eic", "aria-hidden": "true"}, "\u{1F50D}"),
    el("span", {class: "qtext", title: m.q}, m.q || "(empty query)"),
    el("span", {class: "n"}, String(res.rows.length)),
    el("button", {class: "textbtn", title: "Change what it looks for", onclick: e => { e.stopPropagation(); edit(); }}, "Edit")));
  if (!res.rows.length) {
    box.append(el("div", {class: "eempty"}, res.error ? "Could not read the query: " + res.error : "Nothing matches yet."));
    return box;
  }
  const all = QUERY_OPEN.has(b.id);
  const list = el("div", {class: "qrows"});
  let lastPage = null;
  for (const r of res.rows.slice(0, all ? QUERY_ALL_MAX : QUERY_SHOW)) {
    if (r.path !== lastPage) {
      lastPage = r.path;
      list.append(el("button", {class: "qpage", onclick: e => { e.stopPropagation(); openPageIn(space, r.path); }}, pageTitle(r.path)));
      if (res.pages) continue;
    }
    if (!r.block) continue;
    const row = el("div", {class: "qrow", title: "Go to this line",
      onclick: e => { if (e.target.closest("[data-link], [data-bref], a[href], .tick")) return; openBlockAt(space, r.path, r.block); }});
    if (r.block.state) row.append(lineStateButton(space, r.path, r.block));
    if (r.trail.length) row.append(el("span", {class: "qtrail"}, r.trail.map(t => plainTitle(t.title)).filter(Boolean).slice(-2).join(" › ") + " ›"));
    row.append(el("span", {class: "etxt", html: lineHtml(r.block)}));
    list.append(row);
  }
  box.append(list);
  if (res.rows.length > QUERY_SHOW) box.append(el("button", {class: "textbtn qmore", onclick: e => {
    e.stopPropagation();
    if (all) QUERY_OPEN.delete(b.id); else QUERY_OPEN.add(b.id);
    render();
  }}, all ? "Show the first " + QUERY_SHOW : "Show all " + Math.min(res.rows.length, QUERY_ALL_MAX)));
  return box;
}
