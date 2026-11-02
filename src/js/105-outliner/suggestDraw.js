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
      el("span", {class: "k"}, r.mark || (r.isNew && r.kind !== "context" ? "+" : (KIND_MARK[r.kind] || (r.ref || "").split("/")[0] || "·"))),
      el("span", {style: "min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"},
        r.isNew && mode === "link" ? "Make " + r.ref : r.title),
      el("span", {class: "d"}, detail)));
  });
  const keys = mode === "word" ? "Tab" : SUGGEST_KEYS[suggestKeys()].label;
  box.append(el("div", {class: "suggest-hint"},
    mode === "word" ? "Tab takes it · keep typing to ignore"
    : keys + (mode === "slash" ? " runs it" : " takes it") + " · Esc closes"));
  const cur = box.children[i];
  if (cur) cur.scrollIntoView({block: "nearest"});
}
