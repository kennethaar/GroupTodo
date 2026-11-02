/* [{title, steps: [{title, note, doors}]}], from the page if there is one. */
function reviewSteps() {
  const page = ownReviewList() ? getPage(REVIEW_LIST_PATH) : reviewListPage();
  const step = b => ({title: b.title, note: trim((b.children || []).find(k => trim(k.title))?.title || "")});
  const groups = [];
  for (const b of page.blocks || []) {
    if (!trim(b.title)) continue;
    const kids = (b.children || []).filter(k => trim(k.title));
    if (kids.length) groups.push({title: plainTitle(b.title), steps: kids.map(step)});
    else {
      // A line on its own at the top is a step without a section.
      const last = groups[groups.length - 1];
      if (last && last.loose) last.steps.push(step(b)); else groups.push({title: "", loose: true, steps: [step(b)]});
    }
  }
  const fill = s => {
    s.doors = [...s.title.matchAll(/\[\[go\/([A-Za-z0-9_-]+)(?:\]\[[^\]]*)?\]\]/g)].map(m => m[1]).filter(id => tourDest(id));
    s.text = trim(s.title.replace(/\s*\[\[go\/[^\]]+(?:\]\[[^\]]*)?\]\]/g, ""));
    s.key = s.text.toLowerCase();
    return s;
  };
  for (const g of groups) g.steps.forEach(fill);
  /* The calendar step is done in the Weeks tab, with the calendar beside it
     for a longer look: so in a list written before there was one too (#192). */
  for (const s of groups.flatMap(g => g.steps))
    if (s.doors.includes("agenda") && !s.doors.includes("weeks")) s.doors.unshift("weeks");
  /* Reflect is a step only where there is something to reflect on: intentions,
     or an event or a feeling this week. Then it is one even in a list written
     before the step was, under CREATIVE, so nobody has to set it up (#185). */
  const isReflect = s => s.doors.includes("reflect");
  if (!reflectWanted()) for (const g of groups) g.steps = g.steps.filter(s => !isReflect(s));
  else if (!groups.some(g => g.steps.some(isReflect)) && groups.length) {
    const g = groups.find(x => /^creative$/i.test(x.title)) || groups[groups.length - 1];
    g.steps.push(fill({title: REFLECT_STEP[0], note: REFLECT_STEP[1]}));
  }
  return groups.filter(g => g.steps.length);
}
