/* The line above a project's title that says what it is part of. Each parent
   opens on a click; the click goes no further, so a card it sits on does not
   open as well. */
function parentLine(space, path) {
  const up = [], fp = folderParent(space, path);
  if (fp) up.push(fp);
  for (const p of parentsOfPage(space, path)) if (!up.some(x => x.path === p)) up.push({path: p});
  if (!up.length) return null;
  const name = x => x.path ? inSpace(space, () => pageTitle(x.path)) : x.title;
  const line = el("div", {class: "parentline", title: "Part of " + up.map(name).join(", ")},
    el("span", {class: "up", "aria-hidden": "true"}, "↑"));
  up.forEach((x, i) => {
    if (i) line.append(el("span", {class: "sep"}, "·"));
    if (!x.path) { line.append(el("span", {class: "pl none", title: "A folder, with no page of its own"}, x.title)); return; }
    const open = e => { e.stopPropagation(); e.preventDefault(); openPageIn(space, x.path); };
    line.append(el("span", {class: "pl", role: "link", tabindex: "0", onclick: open,
      onkeydown: e => { if (e.key === "Enter") open(e); },
      onmousedown: e => e.stopPropagation(), onpointerdown: e => e.stopPropagation()}, name(x)));
  });
  return line;
}
