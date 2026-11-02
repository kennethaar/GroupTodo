/* A project that turns out to be one step becomes a todo: a line on its
   responsibility's page when it has one, else on today's page. When other
   pages link to the project, you choose where those links go: to a plain
   page the todo links to (the project's lines kept on it), to the page the
   todo now sits on, or nowhere. Ctrl-Z puts the project back. */
function projectToTodo(path) {
  const page = getPage(path);
  if (!page) return;
  const linkers = new Set(backlinksTo(path).map(h => h.path).filter(p => p !== path));
  if (!linkers.size) return projectToTodoAs(path, "here");
  const area = areaOfProject(path);
  const homeName = area ? "the " + area + " page" : "today's page";
  const plain = join(PAGES, baseName(path) + ".md");
  let how = V.pages.has(plain) ? "here" : "page";
  const choices = [
    V.pages.has(plain) ? null : ["page", "Keep it as a page: the todo links to it, and so do they"],
    ["here", "Point them to " + homeName + ", where the todo goes"],
    ["leave", "Leave them as they are (they will point at nothing)"],
  ].filter(Boolean);
  modal({
    center: true, title: "Turn “" + pageTitle(path) + "” into a todo",
    body: el("div", {class: "field"},
      el("p", {}, linkers.size + (linkers.size === 1 ? " page links" : " pages link") + " to this project. Where should those links point?"),
      ...radioChoices("todo-links", choices, how, v => { how = v; })),
    foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
           el("button", {class: "btn primary", onclick: () => { closeModal(); projectToTodoAs(path, how); }}, "Turn into a todo")],
  });
}
