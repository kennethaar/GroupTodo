function insertTracker(path, b, title, when) {
  const page = getPage(path);
  if (!page) return;
  const t = parseTracker(title);
  const day = dayOfPath(path);
  // A line on a day the schedule does not include waits for its own days.
  const here = !when || (day && whenOnDay(new Set(trackerTemplateNames(when, day)), day));
  // Half-typed "tracker-" on the line is what the wizard came to replace.
  const spare = (!trim(b.title) || /^tracker-[\p{L}\p{N}_-]*$/u.test(trim(b.title))) && !b.state && !(b.children || []).length;
  if (here && day) {
    const sibs = siblingsOf(page, b), at = sibs.indexOf(b);
    if (spare && at >= 0) sibs.splice(at, 1);
    page.props = page.props || {};
    if (!pageHasTracker(page, t.name)) page.props[t.key] = t.raw;
    else liftTrackerLine(page, t.name);
  } else if (here) {
    if (spare) b.title = title;
    else siblingsOf(page, b).splice(siblingsOf(page, b).indexOf(b) + 1, 0, newBlock({title}, false));
  } else if (spare && /^tracker-/.test(trim(b.title))) b.title = "";
  touch(path);
  if (when) scheduleTracker(t, when, day || todayISO());
  render();
  if (!when && !isJournalPath(path)) notify("Trackers are only counted on day pages, so this one will not show up in Trackers.", "warn");
}
