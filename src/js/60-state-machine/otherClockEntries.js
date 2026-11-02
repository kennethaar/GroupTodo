/* Your other clocked tasks, in every area that is open, to draw beside the
   one being changed: what else the day held, and where this one can start. */
function otherClockEntries(block) {
  const out = [];
  for (const [name, rec] of LOADED) inSpace(name, () => {
    for (const page of rec.pages.values()) walkBlocks(page.blocks, b => {
      if (b === block || !b.state || !logbookOf(b)) return;
      const who = assigneeOf(b);
      if (who && !samePerson(who, whoAmI())) return;
      for (const c of clockEntries(b)) out.push({...c, title: titleForRow(b.title)});
    });
  });
  return out;
}
