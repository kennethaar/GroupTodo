/* ---------- where a project sits ----------
   The same grid one storey up. A project has the same surroundings a todo has,
   they are just called different things: the area it serves instead of the page
   it lives on, its status instead of its parent line, its own todos instead of
   its children, the other projects on the same shelf instead of its siblings.
   Same three columns, same four rows, same keys, so there is one thing to learn
   and not two. */
function projectGrid(path) {
  const grid = el("div", {class: "around", tabindex: "-1"});
  aroundNavKeys(grid);
  aroundPlay(grid);
  const page = getPage(path);
  const cell = (where, label, kids) => {
    const box = el("div", {class: "acell " + where}, el("span", {class: "alab"}, label));
    for (const k of [].concat(kids)) if (k) box.append(k);
    return box;
  };
  const chip = (text, title, onclick, cls, key) =>
    el("button", {class: "achip " + (cls || ""), title: title || text, onclick,
                  data: key ? {node: key} : {}}, text);
  const quiet = text => el("span", {class: "anone"}, text);

  const area = areaOfProject(path);
  grid.append(cell("a-project", "Responsibility",
    area ? chip(area, "a/" + area, () => chipMenu(area, "the responsibility this project serves", [
             ["a", "Go to " + area, "the responsibility page", () => followLink("a/" + area)],
             ["b", "Serve another responsibility", "move it", () => openAreaPicker(path)],
           ]), "", "p:a/" + area)
         : chip("no responsibility", "A project nothing serves is a project nobody misses",
             () => openAreaPicker(path), "want")));

  const code = statusDirOf(path);
  grid.append(cell("a-parent", "Status",
    chip(trim(String(STATUS_TEXT[code] || "no status").replace(/^[-0-9]\s*=\s*/, "")),
      "Move it to another shelf",
      () => openStatusPicker(path))));

  /* Same bargain as a todo: Enter on the middle makes the next step in it. */
  grid.append(cell("a-self", "This project",
    el("button", {class: "achip aself", data: {node: "p:" + path},
      title: "Enter adds the next action",
      onclick: () => openAddNextAction(path)}, pageTitle(path))));

  /* The tags of a project are the links on its page that are not other
     projects or days: the context it is done in, the people in it, the orgs.
     Context first, same as a todo. */
  const refs = [];
  const lineOf = new Map();          // the block to rewrite when one is swapped
  if (page) walkBlocks(page.blocks, b => {
    if (isMessage(b)) return;
    for (const raw of linksIn([b.title, ...(b.body || [])].join("\n"))) {
      const r = trim(raw.split("][")[0]);
      if (!/^[cpoz]\//i.test(r) || refs.includes(r)) continue;
      refs.push(r);
      if (linksIn(b.title).some(x => trim(x.split("][")[0]) === r)) lineOf.set(r, b);
    }
  });
  const ctx = refs.filter(r => /^c\//i.test(r)), rest = refs.filter(r => !/^c\//i.test(r));
  const tags = ctx.concat(rest).slice(0, 12)
    .map(r => chip(/^c\//i.test(r) ? "@" + r.slice(2) : r, r,
      () => linkMenu(r, lineOf.has(r) ? {path, block: lineOf.get(r), space: V.space} : null, V.space),
      /^c\//i.test(r) ? "ctx" : "", "p:" + r));
  grid.append(cell("a-tags", "Tags", tags.length ? tags : quiet("nothing linked yet")));

  const sibs = (area ? projectsInArea(area) : projectsIn(code))
    .filter(p => p !== path);
  grid.append(cell("a-sibs", "Beside it" + (sibs.length > 6 ? " · " + sibs.length : ""),
    sibs.length ? sibs.slice(0, 6).map(p => chip(pageTitle(p), p, () => openPage(p), "", "p:" + p))
                : quiet(area ? "the only project under this responsibility" : "nothing else on this shelf")));

  const todos = page ? flattenBlocks(page.blocks).filter(b => b.state && !isMessage(b)) : [];
  const open = todos.filter(b => OPEN_STATES[b.state]);
  const shown = (open.length ? open : todos).slice(0, 8);
  grid.append(cell("a-kids", "Todos" + (open.length > 8 ? " · " + open.length + " open" : ""),
    shown.length ? shown.map(b => chip(linkWords(b.title) || "(untitled)",
                      b.title, () => openTaskDetail(path, b),
                      OPEN_STATES[b.state] ? "" : "done", "b:" + b.id))
                 : quiet("no steps yet")));
  return grid;
}
