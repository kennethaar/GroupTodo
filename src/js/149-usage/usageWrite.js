/* Finished days onto the page, then off this device. Without an area of your
   own they wait here, the last few months of them. */
function usageWrite() {
  if (!V.loaded) return;
  const today = todayISO(), days = usageDays(), device = usageDevice();
  const done = Object.keys(days).filter(d => d < today).sort();
  if (!done.length) return;
  const home = usageHome();
  if (!home) {
    let pruned = false;
    for (const d of done) if (dateDiffDays(d, today) > USAGE_KEEP_DAYS) { delete days[d]; pruned = true; }
    if (pruned) usageSave();
    return;
  }
  inSpace(home, () => {
    const page = getPage(USAGE_PATH) || putPage(USAGE_PATH, usageNewPage());
    const have = new Set(page.blocks.map(b => (USAGE_LINE_RE.exec(trim(b.title || "")) || []).slice(1, 3).join(" ")));
    for (const d of done) {
      const line = usageLine(d, device, days[d]);
      if (line && !have.has(d + " " + device)) page.blocks.push(newBlock({title: line}, false));
    }
    touch(USAGE_PATH);
  });
  for (const d of done) delete days[d];
  usageSave();
}
