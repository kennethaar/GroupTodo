function suggestDraw() {
  const {box, rows, i, mode} = SUGGEST;
  box.textContent = "";
  rows.forEach((r, n) => {
    const detail = r.detail != null ? r.detail
      : r.accept === "date" ? humanWhen(r.iso, r.time)
      : r.isNew ? "new " + (LINK_KIND_WORD[r.kind] || "page")
      : (LINK_KIND_WORD[r.kind] || r.kind || "");
    box.append(el("button", {
      class: "pick" + (n === i ? " cur" : ""),
      onmousedown: e => e.preventDefault(),          // keep the caret where it is
      onclick: () => suggestAccept(n),
    },
      el("span", {class: "k"}, (() => { const m = r.mark || (r.isNew && r.kind !== "context" ? "+" : (KIND_MARK[r.kind] || (r.ref || "").split("/")[0] || "·"));
        return m.startsWith("<") ? svgIcon(m) : m; })()),
      el("span", {style: "min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"},
        r.isNew && mode === "link" ? "Make " + r.ref : r.title),
      /* With several areas on, the same name can be a person in each, and
         the area is what tells them apart (#258). A row has one only then:
         acrossSpaces marks the rows, and leaves them alone with one area. The
         badge is the area's own name and colour, so renaming it renames this,
         and nothing of it goes into the line: taking the row writes [[p/...]]. */
      r.kind === "person" && r.space ? spaceBadge(r.space) : null,
      el("span", {class: "d"}, detail)));
  });
  const keys = SUGGEST_KEYS[suggestKeys()].label;
  box.append(el("div", {class: "suggest-hint"},
    mode === "word" ? keys + " takes it · keep typing to ignore"
    : keys + (mode === "slash" ? " runs it" : " takes it") + " · Esc closes"));
  const cur = box.children[i];
  if (cur) cur.scrollIntoView({block: "nearest"});
}
