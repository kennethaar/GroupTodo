/* One space's day page. Mine is the outline I write in; somebody else's is
   theirs to write, so it is there to read, fold and focus on. */
function journalColumn(space, day, who, trail) {
  return inSpace(space, () => {
    /* Only today's page of mine is made just by looking. Another day is
       started when you say so, so browsing back leaves no empty files. */
    const today = day === todayISO();
    const path = who ? journalPath(day, who) : today ? ensureJournal(day) : journalPath(day);
    const when = ["Today", "Yesterday", "Tomorrow"].includes(humanDate(day)) ? humanDate(day).toLowerCase() : "on " + humanDate(day);
    if (!getPage(path)) return emptyCard(
      who ? firstNameOf(who) + " has not written anything " + when + "."
        : "Nothing written " + when + ". ",
      who ? null : el("button", {class: "textbtn", onclick: () => { inSpace(space, () => ensureJournal(day)); render(); }},
        "Write on this day"));
    const node = el("div", {class: "space-journal", data: {space, path}},
      pageOutline(path, Object.assign({readonly: !!who}, trail)));
    const activate = () => {
      activateJournalSpace(space);
      if (!SPACE_CONTEXT || SPACE_CONTEXT.space !== space) SPACE_CONTEXT = {space, path};
    };
    node.addEventListener("pointerdown", activate, true);
    node.addEventListener("focusin", activate, true);
    return node;
  });
}
