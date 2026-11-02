function liveMacros(path, b, seen = new Set([path]), depth = 0) {
  const ms = macrosIn(b.title);
  if (!ms.length) return null;
  const space = V.space;
  const box = el("div", {class: "macros", data: {space}});
  for (const m of ms) {
    if (m.kind === "query") box.append(queryBox(path, b, m));
    else box.append(embedBox(path, m, seen, depth));
  }
  return box;
}
