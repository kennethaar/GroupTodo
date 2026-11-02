function newsSince(since) {
  const me = whoAmI();
  if (!me) return [];
  const out = [];
  for (const [path, page] of V.pages) {
    walkBlocks(page.blocks, b => {
      const at = trim(blockProp(b, "assigned_at") || "");
      const who = assigneeOf(b);
      const by = trim(blockProp(b, "by") || "");
      // Handed to me by somebody else, since I last looked.
      if (who && samePerson(who, me) && at && at > since && !samePerson(by, me) &&
          OPEN_STATES[b.state])
        out.push({kind: "given", path, block: b, at, who: by || "somebody"});
      // Somebody said something on a task I am part of -- mine, or one I wrote.
      if (isMessage(b)) return;
      for (const m of messagesOf(b)) {
        if (samePerson(msgAuthor(m), me)) continue;
        if (msgAt(m) <= since) continue;
        // "Mine" is wider than by::, which is only stamped on a state change:
        // a task you simply typed carries no author at all. It is yours if it
        // is on your day page, if you wrote it, if it is assigned to you, or
        // if you have already said something in the thread.
        const involved = samePerson(assigneeOf(b), me) || samePerson(by, me) ||
                         (isJournalPath(path) && myJournal(path)) ||
                         messagesOf(b).some(x => samePerson(msgAuthor(x), me));
        if (!involved) continue;
        out.push({kind: "said", path, block: b, at: msgAt(m), who: msgAuthor(m), text: m.title});
      }
      // Something I handed over, now done by them.
      const raw = trim(blockProp(b, "done_by") || "");
      const {who: doer, iso: when} = splitStamp(raw);
      if (raw && samePerson(by, me) && !samePerson(doer, me)) {
        if (when && when > since)
          out.push({kind: "finished", path, block: b, at: when, who: doer});
      }
    });
  }
  return out.sort((x, y) => y.at.localeCompare(x.at));
}
