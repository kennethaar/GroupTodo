function daysToClarify() {
  const today = todayISO(), from = shiftISO(today, -DAY_REVIEW_DAYS), me = journalOwner();
  // Today is still being written, so it waits; only what Catch up put there is asked about now (#516).
  const caught = catchUpCaptured();
  return memo("daysToClarify\u0000" + (V.space || "") + "\u0000" + caught.size,() => allPages(p => isJournalPath(p) && journalOwnerOf(p) === me).filter(p => {
    const day = baseName(p), page = getPage(p);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day < from || day > today || trim(page?.props?.clarified || "")) return false;
    const now = day === today;
    if (now && !caught.size) return false;
    let any = false;
    walkBlocks(page.blocks, b => { if (!any && dayCandidate(b) && (!now || caught.has(clKey(p, b)))) any = true; });
    return any;
  }).sort((a, b) => baseName(a).localeCompare(baseName(b))));
}
