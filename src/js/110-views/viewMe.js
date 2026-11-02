/* ============================================================
   YOUR PAGE -- your picture, your notes, and everything that links to you
   Every space keeps its own copy of your page, so they sit side by side
   like the journals, each with its notes and what links to you from there.
   ============================================================ */
function viewMe() {
  const me = whoAmI();
  const spaces = visibleSpaces().filter(n => LOADED.has(n));
  const c = el("div", {class: "wrap" + (spaces.length > 1 ? " jwide" : "")});
  if (!me) {
    c.append(vhead("Your page"));
    c.append(emptyCard("Tell GroupToDo your name first. ",
      el("button", {class: "textbtn", onclick: () => promptInput({title: "Your name", value: "", cta: "Save", label: "Full name",
        onSave: n => { for (const s of spaces) inSpace(s, () => setIdentity(n, s)); render(); }})}, "Add your name")));
    return c;
  }
  const refs = spaces.map(s => inSpace(s, () => {
    ensureMemberPage();
    return {space: s, path: personPath(me), hits: backlinksTo(personPath(me))};
  }));
  const linked = refs.reduce((n, r) => n + new Set(r.hits.map(h => h.path)).size, 0);
  const face = avatarNode(me, 72);
  c.append(el("div", {class: "mehead"}, face,
    el("div", {style: "min-width:0"},
      el("h1", {}, me),
      el("div", {class: "sub"}, "In " + Spaces.list.length + (Spaces.list.length === 1 ? " area" : " areas") +
        " · " + myOpen().length + " open · " + waitingRows().length + " owed to you · " +
        linked + (linked === 1 ? " page links here" : " pages link here")),
      el("div", {class: "acts"},
        el("button", {class: "btn sm ghost", onclick: () => promptInput({title: "Your name", value: me, cta: "Save", label: "Full name",
          hint: "Changing it takes your journal, your page and your tasks with it",
          onSave: n => { for (const s of spaces) inSpace(s, () => setIdentity(n, s)); render(); }})}, "Change name")))));
  /* A picture per area: the colleagues in Work see the one you put in Work, and
     the family in Home see the one you put in Home. */
  c.append(el("div", {class: "jgrid"}, ...refs.map(r => el("section", {class: "jcol"},
    el("div", {class: "colhead"}, spaceBadge(r.space, true), el("span", {class: "pv-path"}, r.path)),
    inSpace(r.space, () => el("div", {class: "areaface"}, avatarNode(me, 44),
      el("div", {},
        el("div", {class: "sub"}, avatarOf(me) ? "How you look in " + r.space : "No picture in " + r.space + " yet"),
        el("div", {class: "acts"},
          el("button", {class: "btn sm ghost", onclick: () => pickAvatar(me, null, r.space)},
            avatarOf(me) ? "Change picture" : "Add a picture"),
          avatarOf(me) ? el("button", {class: "btn sm ghost", onclick: () => { inSpace(r.space, () => {
            const path = personPath(me);
            if (!V.pages.has(path)) return;
            const page = getPage(path);
            delete page.props[AVATAR_PROP];
            putPage(path, page);
          }); render(); }}, "Remove") : null)))),
    el("div", {class: "group"}, "Notes", el("span", {class: "plain"}, "· click a line to write, a bullet to focus")),
    inSpace(r.space, () => {
      const node = el("div", {class: "space-journal", data: {space: r.space, path: r.path}},
        pageOutline(r.path, {root: "Your page", rootGo: ["me", {}], title: "Your notes in " + r.space}));
      node.addEventListener("pointerdown", () => activateJournalSpace(r.space), true);
      node.addEventListener("focusin", () => activateJournalSpace(r.space), true);
      return node;
    }),
    inSpace(r.space, () => backlinksSection(r.path) || el("div", {class: "section"},
      el("h3", {}, "Linked references"), emptyCard("Nothing in " + r.space + " links to you yet.")))))));
  return c;
}
