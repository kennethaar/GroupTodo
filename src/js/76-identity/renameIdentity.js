/* Changing your name has to take your things with it, or you end up listed
   twice in People, with yesterday's journal filed under somebody who no longer
   exists and tasks assigned to a name nobody answers to.

   by:: and done_by:: are deliberately left alone: they are a record of who did
   something at the time, not a pointer to a person. */
function renameIdentity(was, now) {
  const from = personPath(was), to = personPath(now);
  if (V.pages.has(from)) {
    const page = getPage(from);
    if (!V.pages.has(to)) {
      page.props = Object.assign({}, page.props, {title: now, member: "true"});
      putPage(to, page);
    }
    removePage(from);
  }

  // Journal days move wholesale: journals/<was>/2026-10-05.md -> <now>/...
  const oldDir = join(JOURNALS, slugPerson(was));
  const newDir = join(JOURNALS, slugPerson(now));
  let days = 0;
  for (const path of Array.from(V.pages.keys())) {
    if (!path.startsWith(oldDir + "/")) continue;
    const target = join(newDir, baseName(path) + ".md");
    if (!V.pages.has(target)) { putPage(target, getPage(path)); days++; }
    removePage(path);
  }

  // Live assignments must follow; history must not.
  let handed = 0;
  for (const [path, page] of V.pages) {
    let hit = false;
    walkBlocks(page.blocks, bl => {
      if (samePerson(assigneeOf(bl), was)) { setBlockProp(bl, ASSIGN_PROP, now); hit = true; handed++; }
    });
    if (hit) touch(path);
  }
  // The old identity's own read-marker is meaningless now.
  notify("You are " + now + " here now" +
    (days ? ", with " + days + " journal day(s)" : "") +
    (handed ? " and " + handed + " assigned task(s)" : "") + " moved across.");
  return {days, handed};
}
