/* ---------- history ----------
   Everything that happened in the spaces on screen, newest first, a day at a
   time: what was finished, what was added, and what was said. */
function activityHere(fromDay) {
  const out = [];
  for (const [path, page] of V.pages) {
    if (isStencilPath(path)) continue;
    walkBlocks(page.blocks, b => {
      if (isMessage(b)) return;
      if (b.state) {
        const added = addedDate(b);
        if (added && added >= fromDay) out.push({kind: "added", day: added, at: added, path, block: b,
          who: blockProp(b, "by") || journalOwnerOf(path) || "", text: b.title});
        if (b.state === "DONE") {
          const when = closedOn(b);
          if (when && when >= fromDay) out.push({kind: "done", day: when, at: when + "T99", path, block: b,
            who: closedBy(b) || "", text: b.title});
        }
      }
      for (const m of messagesOf(b)) {
        const day = dateIn(msgAt(m));
        if (day && day >= fromDay) out.push({kind: "said", day, at: msgAt(m), path, block: b,
          who: msgAuthor(m), text: m.title, decided: trim(blockProp(m, DECIDED_PROP) || "")});
      }
    });
  }
  return out;
}
