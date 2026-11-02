/* Every visit on every day page in the areas on screen, oldest first. */
function timeLogEntries() {
  return memo("timeLog", () => acrossSpaces(() => {
    const out = [];
    for (const path of allPages(p => isJournalPath(p))) {
      const date = dayOfPath(path), page = date && getPage(path);
      if (!page) continue;
      walkBlocks(page.blocks, b => {
        if (isTimeLog(b)) out.push({date, path, block: b, space: V.space,
          who: timeLogWho(b), project: timeLogProj(b), at: clockMin(blockProp(b, "in"))});
      });
    }
    return out;
  }).sort((a, b) => a.date.localeCompare(b.date) || (a.at ?? 0) - (b.at ?? 0)));
}
