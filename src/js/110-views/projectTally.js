/* What a project has finished and dropped, counted the way its open steps are:
   lines on its own page, and lines on day pages that name it. Dropped is kept
   apart from done, so cancelling half a project never reads as progress.
   The prices on its tasks add up the same way, per currency: what the done
   ones cost is spent, what the open ones say is still planned. */
function projectTally(r) {
  return inSpace(r.space, () => {
    let done = 0, dropped = 0;
    const spent = {}, planned = {};
    const count = b => {
      if (isMessage(b)) return;
      if (b.state === "DONE") done++;
      else if (b.state === "CANCELLED") dropped++;
      const into = b.state === "DONE" ? spent : OPEN_STATES[b.state] ? planned : null;
      if (into) for (const p of pricesIn(b.title)) into[p.cur] = (into[p.cur] || 0) + p.amount;
    };
    const page = getPage(r.path);
    if (page) flattenBlocks(page.blocks).forEach(count);
    for (const row of journalActionsFor(r.path)) count(row.block);
    return {done, dropped, spent, planned};
  });
}
