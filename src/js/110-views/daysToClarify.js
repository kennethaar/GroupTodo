function daysToClarify() {
  const today = todayISO(), from = shiftISO(today, -DAY_REVIEW_DAYS), me = journalOwner();
  return memo("daysToClarify\u0000" + (V.space || ""), () => allPages(p => isJournalPath(p) && journalOwnerOf(p) === me).filter(p => {
    const day = baseName(p), page = getPage(p);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day < from || day >= today || trim(page?.props?.clarified || "")) return false;
    let any = false;
    walkBlocks(page.blocks, b => { if (!any && dayCandidate(b)) any = true; });
    return any;
  }).sort((a, b) => baseName(a).localeCompare(baseName(b))));
}
