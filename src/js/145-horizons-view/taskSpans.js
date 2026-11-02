/* ---------- burndown ----------
   How many tasks were open on each day of the window, as one line: the list
   going down is the work getting done, and the list going up is more arriving
   than leaving. Every task counts from the day it was added until the day it
   was closed, whoever did it, in the space(s) the report is showing. The line
   alone does not say why it moved, so hovering a day says what was added and
   what was finished on it, and the sentence underneath says where the pace
   leads. The same numbers are in a table, because a picture means nothing to
   a screen reader. */
function taskSpans() {
  return memo("taskSpans", () => acrossSpaces(() => {
    const out = [];
    for (const [path, page] of V.pages) {
      if (isStencilPath(path) || path === SETTINGS_PATH) continue;
      const journalDay = isJournalPath(path) ? dateIn(baseName(path)) : null;
      walkBlocks(page.blocks, b => {
        if (!b.state || isMessage(b)) return;
        const raw = blockProp(b, "Added") || "";
        const added = dateIn(raw) || journalDay;
        let closed = null;
        if (!OPEN_STATES[b.state]) {
          closed = (/\]\]\s*-\s*\[\[(\d{4}-\d{2}-\d{2})\]\]/.exec(raw) || [])[1]
                || dateIn(blockProp(b, "CLOSED")) || dateIn(blockProp(b, "done_by"));
          if (!closed) return;                 // closed, but nobody knows when
        }
        out.push({added: added || "0000-00-00", closed});
      });
    }
    return out;
  }));
}
