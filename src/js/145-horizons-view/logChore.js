/* The done line, on the page for its day. Taken back by Undo. */
function logChore(words, ctx, size, who, day, space) {
  day = day || todayISO();
  space = space || V.space;
  const b = inSpace(space, () => {
    const path = ensureJournal(day);
    const b = newBlock({state: "DONE", title: choreLine(words, ctx, size)});
    stampAuthor(b);
    setBlockProp(b, REPEAT_PROP, AS_NEEDED);
    setBlockProp(b, "CLOSED", "[[" + day + "]]");
    // A past day gets noon, so the UTC stamp stays on that day.
    const at = day === todayISO() ? nowStamp() : day + "T12:00:00Z";
    if (who) setBlockProp(b, "done_by", trim(who) + " " + at);
    else delete b.props.done_by;
    getPage(path).blocks.push(b);
    touch(path);
    return b;
  });
  clearMemo();
  const undo = () => { inSpace(space, () => dropBlockById(b.id)); clearMemo(); render(); return true; };
  pushUndo({run: undo});
  render();
  notify("Logged: " + trim(words) + (who && !samePerson(who, whoAmI()) ? ", by " + firstNameOf(who) : "") +
    (day === todayISO() ? "" : ", on " + humanDate(day)) + ".", "info", {label: "Undo", run: undo});
  return b;
}
