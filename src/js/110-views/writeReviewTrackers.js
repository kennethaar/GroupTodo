function writeReviewTrackers(day, ticks) {
  const path = ensureJournal(day);
  const page = getPage(path);
  let head = page.blocks.find(b => !b.state && plainTitle(b.title).toLowerCase() === "weekly review");
  if (!head) { head = newBlock({title: "Weekly review"}, false); page.blocks.push(head); }
  head.children = head.children || [];
  for (const s of reviewSteps().flatMap(g => g.steps)) {
    const key = "tracker-" + reviewStepSlug(s.text) + "_c";
    const title = key + ":: " + (ticks.has(s.key) ? "x" : "");
    const line = head.children.find(b => parseTracker(b.title)?.key === key);
    if (line) line.title = trim(title);
    else head.children.push(newBlock({title: trim(title)}, false));
  }
  touch(path);
}
