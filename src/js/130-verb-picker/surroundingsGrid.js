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
  // The nearest project's own chip always offers a way out, not just a way
  // there -- the GTD hygiene "refile" action used to be a standalone button
  // that worked regardless of whether a task was already filed; it still
  // needs to, now that it lives on the Project chip instead.
  const goTo = (ref, to) => () => { closeModal(); if (to) openPageIn(space, to); else inSpace(space, () => followLink(ref)); };
  if (near) {
    /* Outermost first, so the column reads downward the way the plan nests:
       the project, its milestone, the line above this one, this one. */
    grid.append(cell("a-project", chain.length > 1 ? "Project and milestone" : "Project",
      chain.slice().reverse().map((ref, i, all) => {
        const to = findExistingPage(ref);
        const last = i === all.length - 1;
        return chip(ref.replace(/^[^/]+\//, ""), ref,
          !last ? goTo(ref, to) : () => chipMenu(ref, "where it's filed", [
            ["a", "Go to " + ref.replace(/^[^/]+\//, ""), "", goTo(ref, to)],
            ["b", "Refile to another project", "moves it", () => openRefile(path, block)],
          ]),
          last ? "" : "up", "p:" + ref);
      })));
  } else if (kind === "project") {
    grid.append(cell("a-project", "Project",
      chip(pageTitle(path), path, () => chipMenu(pageTitle(path), "this project", [
        ["a", "Go to " + pageTitle(path), "", goTo(path, path)],
        ["b", "Refile to another project", "moves it", () => openRefile(path, block)],
      ]), "", "p:" + path)));
  } else {
    // Nothing fewer than a project link says where this belongs: the GTD
    // hygiene nudge to refile it, right where Project already sits, instead
    // of a separate standalone "refile" button elsewhere in the panel.
    grid.append(cell("a-project", LINK_KIND_WORD[kind] || "Page",
      chip("! " + pageTitle(path), "GTD hygiene: refile this into a project or responsibility",
        () => { closeModal(); openRefile(path, block); }, "want", "p:" + path)));
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
    // A tag says the name, as the line does, never its folder (P12, #317).
    tagBox.push(chip(/^c\//i.test(r) ? "@" + r.slice(2) : linkWords("[[" + r + "]]"), r,
      () => linkMenu(r, {path, block, space}, space),
      /^c\//i.test(r) ? "ctx" : "", "p:" + r));
  if (!ctx.length) tagBox.unshift(chip("add context", "A todo with no context cannot be filtered to where you are",
    () => { closeModal(); promptAndInsertContext(path, block); }, "want"));
  grid.append(cell("a-tags", "Tags", tagBox));
  return grid;
}
