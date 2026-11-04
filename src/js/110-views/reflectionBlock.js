/* This week's #reflection line on the week page, or a new one there. A line an
   older version wrote on a day page is still found. */
function reflectionBlock(make) {
  const week = new RegExp("^#reflection\\s+week\\s+" + reflectWeek() + "\\b", "i");
  const weekPath = journalPath(weekOf(todayISO()));
  const paths = [weekPath];
  for (let i = 0; i < REFLECT_DAYS; i++) paths.push(journalPath(shiftISO(todayISO(), -i)));
  for (const path of paths) {
    const block = V.pages.has(path) && getPage(path).blocks.find(b => !b.state && week.test(b.title || ""));
    if (block) return {path, block};
  }
  if (!make) return null;
  const path = ensureWeek(weekOf(todayISO()));
  const block = newBlock({title: "#reflection Week " + reflectWeek() +
    (V.pages.has(INTENTIONS_PATH) ? " [[_/Intentions]]" : "")}, false);
  getPage(path).blocks.push(block);
  touch(path);
  return {path, block};
}
