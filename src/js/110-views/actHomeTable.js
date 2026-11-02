function actHomeTable(c, r, f) {
  const all = inS(r, () => looseTargets(r));
  const cols = [all.filter(t => t.kind !== "Responsibility").slice(0, 10), all.filter(t => t.kind === "Responsibility")];
  if (ACT_COL.key !== solKey(r)) ACT_COL = {c: cols[0].length ? 0 : 1, i: 0, key: solKey(r)};
  const take = t => solApply(r, f, t.path);
  const col = (n, title, list, none) => el("section", {},
    el("h4", {}, title + " · " + list.length),
    el("ol", {class: "lsopts"}, ...(list.length ? list.map((t, i) => el("li", {
      class: ACT_COL.c === n && ACT_COL.i === i ? "on" : "", data: {col: n, row: i},
      onclick: () => take(t), onmouseenter: () => { ACT_COL.c = n; ACT_COL.i = i; actColPaint(); }},
      el("span", {class: "nm", translate: "no"}, t.title),
      n ? null : el("span", {class: "chip"}, t.kind))) : [el("li", {class: "open"}, none)])));
  const input = el("input", {class: "newopt", placeholder: "＋ New project for it", "aria-label": "New project in " + r.space,
    // The line's own words, offered on the way in, so the label shows until then.
    onfocus: () => { if (!input.value) { input.value = inS(r, () => bareLineName(r.block)); input.select(); } },
    onkeydown: e => {
      if (e.key !== "Enter" || !trim(input.value)) return;
      e.preventDefault(); f.make(r, trim(input.value)); solAfter(r, f.k);
    }});
  const face = actFace(r, f);
  face.removeAttribute("data-sol-drag");
  face.classList.add("lscard");
  c.append(el("div", {class: "sdduel acthome"}, face,
    el("div", {class: "actcols"},
      col(0, all.filter(t => t.kind !== "Responsibility").length > 10 ? "Projects, the likeliest ten" : "Projects", cols[0], "No projects in this area yet."),
      col(1, "Responsibilities", cols[1], "No responsibilities in this area yet.")),
    el("div", {class: "t-meta"}, input,
      el("button", {class: "textbtn", onclick: () => solOp(r, "skip")}, "Leave it on the day page ›"))));
  SOL_ACTS = new Map(); SOL.shown = null;
  ACT_COL.cols = cols; ACT_COL.take = take;
  return c;
}
