function askAliasMerge(path, twins) {
  const ctx = isContextPath(path);
  const title = p => ctx ? "@" + ctxNameOf(p) : pageTitle(p);
  const name = title(path);
  const list = twins.map(title).join(", ");
  const one = () => {
    closeModal();
    let n = 0;
    for (const t of twins) {
      if (ctx) { mergeContextInto(ctxNameOf(t), ctxNameOf(path), title(t) + " is now " + name + "."); n++; }
      else if (mergePageInto(t, path)) n++;
    }
    if (n) render();
  };
  modal({
    center: true, title: list + (twins.length === 1 ? " is a page too" : " are pages too"), hint: "Enter / n",
    body: el("div", {},
      el("div", {class: "field"},
        el("div", {style: "color:var(--fg2);font-size:13.5px"},
          name + " now also goes by " + list + ", and there " + (twins.length === 1 ? "is a page" : "are pages") +
          " by that name. If they are the same, " + name + " takes the lines and links point here.")),
      pickRow("↵", "Make them one", "the lines of " + list + " move to " + name, one),
      pickRow("n", "Keep them apart", "the alias stays, and so does " + list, closeModal)),
    onKey: e => {
      if (e.key === "Enter") { one(); return true; }
      if (e.key === "n") { closeModal(); return true; }
      return false;
    },
  });
}
