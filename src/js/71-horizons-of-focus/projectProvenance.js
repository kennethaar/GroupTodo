/* ---------- what the question is about ----------
   This dialog used to ask what done looks like without saying what for. Asked
   out of the weekly review it arrives on its own, with nothing on screen to
   say which project it means, and you cannot state an outcome for a project
   you cannot name.

   So it names it. And when the page is empty, naming it is not enough either:
   a project that is nothing but a title exists because somebody wrote
   [[1/Something]] in a line somewhere, and that line is the only record of
   what they meant. So the empty case shows where it came from - the area it
   sits under, and the lines that started it, in full. */
function projectProvenance(path) {
  const page = getPage(path);
  const open = openTodoCount(path);
  const body = (page ? flattenBlocks(page.blocks) : [])
    .filter(b => trim(b.title) && !isMessage(b)).length;
  const area = areaOfProject(path);
  const box = el("div", {class: "prov"});
  box.append(el("div", {class: "provhead"},
    el("span", {class: "chip"}, STATUS_TEXT[statusDirOf(path)] ?
      trim(String(STATUS_TEXT[statusDirOf(path)]).replace(/^[-0-9]\s*=\s*/, "")) : "project"),
    el("b", {}, pageTitle(path)),
    area ? el("span", {class: "chip"}, area) : null));

  if (body) {
    box.append(el("div", {class: "provnote"},
      open + " open step" + (open === 1 ? "" : "s") + " on this page."));
    return box;
  }

  /* Nothing on the page, so the question has to be answered from whatever
     started it. */
  const from = backlinksTo(path).slice(0, 5);
  if (!from.length) {
    box.append(el("div", {class: "provnote"},
      "Nothing on this page yet, and nothing links to it. The name is all there is " +
      "to go on."));
    return box;
  }
  box.append(el("div", {class: "provnote"}, "Nothing on this page yet. It was started here:"));
  const list = el("div", {class: "provlist"});
  for (const h of from) {
    const row = el("button", {class: "provrow", title: "Open " + h.path,
      onclick: () => { closeModal(); openPage(h.path); }},
      el("span", {class: "nm"}, linkWords(h.block.title) || "(a line with no words)"),
      el("span", {class: "p"}, pageTitle(h.path)));
    list.append(row);
  }
  box.append(list);
  return box;
}
