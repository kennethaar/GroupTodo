function surroundingsGrid(path, block, space) {
  const page = getPage(path);
  const grid = el("div", {class: "around", tabindex: "-1"});
  aroundNavKeys(grid);
  aroundPlay(grid);
  const cell = (where, label, kids) => {
    const box = el("div", {class: "acell " + where}, el("span", {class: "alab"}, label));
    for (const k of [].concat(kids)) if (k) box.append(k);
    return box;
  };
  const chip = (text, title, onclick, cls, key) =>
    el("button", {class: "achip " + (cls || ""), title: title || text, onclick,
                  data: key ? {node: key} : {}}, text);
  const toTask = b => () => { closeModal(); openTaskDetail(path, b, space); };
  /* The links are read out, not taken out. They have a column of their own, but
     a todo is often mostly links, and the words left over once you remove them
     are frequently not a sentence anybody could identify. The brackets go; the
     words stay. */
  const words = s => linkWords(s) || "(untitled)";
  const quiet = text => el("span", {class: "anone"}, text);

  /* The project is whichever the line says it is. A link to a project on the
     todo itself wins, then one on the line above it, then the line above that:
     writing

       - [[1/Rewire the workshop]]
         - TODO Pull the cable

     in today's page is how most of them get captured, and the project is the
     point of writing it that way. Only when no line says otherwise does the
     page the todo lives on answer, which for a journal capture is the day. */
  const kind = pageKind(path);
  const chain = page ? projectChainOf(page, block) : [];
  const near = chain[0] || null;
  if (near) {
    /* Outermost first, so the column reads downward the way the plan nests:
       the project, its milestone, the line above this one, this one. */
    grid.append(cell("a-project", chain.length > 1 ? "Project and milestone" : "Project",
      chain.slice().reverse().map((ref, i, all) => {
        const to = findExistingPage(ref);
        return chip(ref.replace(/^[^/]+\//, ""), ref,
          () => { closeModal(); if (to) openPageIn(space, to); else inSpace(space, () => followLink(ref)); },
          i === all.length - 1 ? "" : "up", "p:" + ref);
      })));
  } else {
    grid.append(cell("a-project", kind === "project" ? "Project" : LINK_KIND_WORD[kind] || "Page",
      chip(pageTitle(path), path, () => { closeModal(); openPageIn(space, path); },
        "", "p:" + path)));
  }

  /* The line above, unless the line above is nothing but the project link that
     already answered the cell above it. A heading written only to hang todos
     under is scaffolding, not a parent, and printing it twice says nothing the
     first printing did not. */
  let par = page ? parentOf(page, block) : null;
  const scaffold = b => {
    if (!b || !chain.length) return false;
    let left = linkWords(b.title);
    for (const ref of chain) left = left.replace(ref.replace(/^[^/]+\//, ""), "");
    return !trim(left);
  };
  while (scaffold(par)) par = parentOf(page, par);
  grid.append(cell("a-parent", "Parent",
    par ? chip(words(par.title), par.title, toTask(par), "", "b:" + par.id)
        : quiet("none, it sits at the top")));

  /* The middle is a node like any other, so the arrows can land on it, and
     Enter there is the one thing the grid cannot do by moving: make something
     new under what you are looking at. Two presses, two meanings, and neither
     is a key to remember separately. Enter on a node you have walked to centres
     it; Enter on the one already in the middle grows it. */
  grid.append(cell("a-self", "This todo",
    el("button", {class: "achip aself", data: {node: "b:" + block.id},
      title: "Enter adds a step under this one",
      onclick: () => addChildTodo(path, block, space)},
      (block.state ? block.state + " " : "") + words(block.title))));

  /* The tags are the links in the title, and the context goes first because it
     is the one that decides whether you can do the thing where you are. */
  const refs = linksIn(block.title).map(r => trim(r.split("][")[0]))
    .filter(r => r && !/^\d{4}-\d{2}-\d{2}$/.test(r) && !/^go\//i.test(r))
    // the projects have a cell of their own; they are not also tags
    .filter(r => !chain.includes(r));
  const ctx = refs.filter(r => /^c\//i.test(r));
  const rest = refs.filter(r => !/^c\//i.test(r));
  const tagBox = [];
  /* A tag here is the same handle it is in the line: going there is one of the
     things it offers, and not the one you want most often. */
  for (const r of ctx.concat(rest))
    tagBox.push(chip(/^c\//i.test(r) ? "@" + r.slice(2) : r, r,
      () => linkMenu(r, {path, block, space}, space),
      /^c\//i.test(r) ? "ctx" : "", "p:" + r));
  if (!ctx.length) tagBox.unshift(chip("add context", "A todo with no context cannot be filtered to where you are",
    () => { closeModal(); promptAndInsertContext(path, block); }, "want"));
  grid.append(cell("a-tags", "Tags", tagBox));

  const sibs = (page ? siblingsOf(page, block) : []).filter(b => b !== block && !isMessage(b));
  grid.append(cell("a-sibs", "Siblings" + (sibs.length > 6 ? " · " + sibs.length : ""),
    sibs.length ? sibs.slice(0, 6).map(b => chip(words(b.title), b.title, toTask(b),
                    OPEN_STATES[b.state] ? "" : "done", "b:" + b.id))
                : quiet("nothing beside it")));

  const kids = (block.children || []).filter(b => !isMessage(b));
  grid.append(cell("a-kids", "Children",
    kids.length ? kids.map(b => chip(words(b.title), b.title, toTask(b),
                    OPEN_STATES[b.state] ? "" : "done", "b:" + b.id))
                : quiet("nothing under it")));
  return grid;
}
