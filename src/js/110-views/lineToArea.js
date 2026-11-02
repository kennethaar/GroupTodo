/* A line on a day page, or any page that is not a project: Alt+I, or the
   line menu, links it to a responsibility. A line that links a project turns
   that project into one instead. */
function lineToArea(path, block) {
  const linked = linksIn(block.title).map(findExistingPage).find(p => p && statusDirOf(p) && !isHorizonPage(p));
  if (linked) { projectToArea(linked); return; }
  const linkedArea = linksIn(block.title).map(findExistingPage).find(p => p && pageKind(p) === "area");
  if (linkedArea) { notify("Already under " + pageTitle(linkedArea) + "."); return; }
  const bare = bareLineName(block);
  const {items, same} = rankedAreas(bare);
  if (!items.length) { newAreaPrompt(p => insertMakeLink(path, block, pageRef(p))); return; }
  listPicker({
    title: "Responsibility for this line",
    hint: bare ? "“" + bare + "” · type the name · enter picks · esc cancels" : "",
    items, typeahead: true,
    label: r => r.label,
    detail: r => r.path === null ? "new responsibility" : r === same ? "same name" : r.score > 0 ? "similar" : "",
    onPick: r => insertMakeLink(path, block, r.path ? pageRef(r.path) : "a/" + slugify(r.label)),
    footer: el("button", {class: "btn ghost", onclick: () => { closeModal();
      newAreaPrompt(p => insertMakeLink(path, block, pageRef(p))); }}, "+ another name"),
  });
}
