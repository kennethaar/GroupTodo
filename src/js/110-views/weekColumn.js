/* Your week page in one area. This week's and the ones ahead are made by
   looking, so their routines are there to tick; a past week only when you
   write in it. */
function weekColumn(space, id) {
  return inSpace(space, () => {
    const path = id >= weekOf(todayISO()) ? ensureWeek(id) : journalPath(id);
    if (!getPage(path)) return emptyCard("Nothing written in week " + weekNo(id) + ". ",
      el("button", {class: "textbtn", onclick: () => { inSpace(space, () => ensureWeek(id)); render(); }}, "Write in this week"));
    const node = el("div", {class: "space-journal", data: {space, path}},
      pageOutline(path, {newText: "+ Write a line…", title: id,
        parentGo: ["today", {sub: "week", jz: null}], root: "Journal", rootGo: ["today", {sub: "week", jz: null}]}));
    const activate = () => {
      activateJournalSpace(space);
      if (!SPACE_CONTEXT || SPACE_CONTEXT.space !== space) SPACE_CONTEXT = {space, path};
    };
    node.addEventListener("pointerdown", activate, true);
    node.addEventListener("focusin", activate, true);
    return node;
  });
}
