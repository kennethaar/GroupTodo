/* ---------- every conversation, everywhere ----------
   A thread is only useful if you can find it again. This gathers them from
   every space you have shown, every project and every day page, newest first,
   so "where was that said" is one screen rather than a hunt. */
function allThreadsHere() {
  const out = [];
  for (const [path, page] of V.pages) {
    walkBlocks(page.blocks, b => {
      if (isMessage(b)) return;
      const msgs = messagesOf(b);
      if (!msgs.length) return;
      const last = msgs[msgs.length - 1];
      out.push({
        path, block: b, msgs,
        last, at: msgAt(last),
        unread: unreadCount(b),
        flagged: msgs.filter(flaggedByMe).length,
        // A journal is a day, so say which day rather than printing a raw date.
        where: isWeekPath(path) ? baseName(path) : isJournalPath(path) ? chatDayLabel(baseName(path)) : pageTitle(path),
      });
    });
  }
  return out;
}
