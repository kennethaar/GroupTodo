function claimableFor(me) {
  if (!me) return [];
  const out = [];
  const mine = m => samePerson(m, me);
  for (const [path, page] of V.pages) {
    walkBlocks(page.blocks, b => {
      const who = assigneeOf(b);
      if (!who || !OPEN_STATES[b.state]) return;
      if (!nameMatches(who, me)) return;
      // Somebody else of that name is already here; it is theirs, not yours.
      if (isMember(who) && !mine(who)) return;
      // Written with your exact name before you arrived, it is already "yours"
      // -- but it was filed as a WAIT because nobody here could act on it, and
      // nothing flips that back on its own. Those need claiming too.
      if (mine(who) && b.state !== "WAIT") return;
      out.push({path, block: b, named: who, by: trim(blockProp(b, "by") || "")});
    });
  }
  return out;
}
