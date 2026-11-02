/* This week's #reflection line on one of your day pages, or a new one on today's. */
function reflectionBlock(make) {
  const week = new RegExp("^#reflection\\s+week\\s+" + reflectWeek() + "\\b", "i");
  for (let i = 0; i < REFLECT_DAYS; i++) {
    const path = journalPath(shiftISO(todayISO(), -i));
    const block = V.pages.has(path) && getPage(path).blocks.find(b => !b.state && week.test(b.title || ""));
    if (block) return {path, block};
  }
  if (!make) return null;
  const path = ensureJournal(todayISO());
  const block = newBlock({title: "#reflection Week " + reflectWeek() +
    (V.pages.has(INTENTIONS_PATH) ? " [[_/Intentions]]" : "")}, false);
  getPage(path).blocks.push(block);
  touch(path);
  return {path, block};
}
