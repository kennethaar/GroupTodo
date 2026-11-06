function projectFieldPills(r, {skip = [], lines = false} = {}) {
  const box = el("div", {class: "pfields" + (lines ? " lines" : "")});
  for (const f of solFields()) {
    if (skip.includes(f.k)) continue;
    let text = projectFieldText(r, f);
    if (lines && text) {
      if (f.k === "orgs" && !f.cur(r).length || f.k === "deadline" && !dateIn(pageProp(r.space, r.path, "deadline"))
        || f.k === "after" && !inS(r, () => dependsOn(r.path).length)) continue;
      if (f.k === "next") text = "\u201c" + text + "\u201d";
      if (f.k === "deadline") text = "Due " + text;
    }
    const open = e => { e.stopPropagation(); e.preventDefault(); openProjectField(r, f.k); };
    box.append(el("span", {class: "pfield" + (text ? "" : " miss"), role: "button", tabindex: "0",
      title: f.label + (text ? ": " + text : " - not set"),
      onclick: open, onkeydown: e => { if (e.key === "Enter" || e.key === " ") open(e); },
      onmousedown: e => e.stopPropagation()},
      lines && text ? el("span", {class: "fi", "aria-hidden": "true"},
        (FIELD_ICON[f.k] || "•").startsWith("<") ? svgIcon(FIELD_ICON[f.k]) : (FIELD_ICON[f.k] || "•")) : null,
      text || "+ " + fieldWord(f)));
  }
  return box;
}
