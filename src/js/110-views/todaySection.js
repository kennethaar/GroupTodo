function todaySection(s) {
  const folded = sectionFolded(s.id);
  const head = el("div", {class: "group" + (s.late ? " late" : "")},
    el("button", {class: "sectog", "aria-expanded": String(!folded), title: folded ? "Show" : "Fold away",
      onclick: () => toggleSection(s.id)}, svgIcon(folded ? ICON_CHEVRON_RIGHT : ICON_CARET)),
    el("button", {class: "secbul", title: "Focus on " + s.title, "aria-label": "Focus on " + s.title,
      onclick: () => go("today", {jz: s.id})}, "•"),
    el("button", {class: "sectog", title: folded ? "Show" : "Fold away", onclick: () => toggleSection(s.id)}, s.title),
    s.space ? spaceBadge(s.space) : null,
    el("span", {class: "plain"}, "· " + (s.count != null ? s.count : folded ? s.folded : s.hint)),
    s.edit ? el("button", {class: "jedit", style: "margin-left:auto", title: "The whole day page as text",
      "aria-label": "Edit as Markdown", onclick: s.edit}, svgIcon(ICON_PENCIL)) : null);
  const box = el("div", {}, head);
  if (!folded) box.append(s.body());
  return box;
}
