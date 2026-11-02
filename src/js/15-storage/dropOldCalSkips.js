/* The first build wrote cal_skip:: for meetings nobody deleted -- a synced
   copy of a day without them yet was taken for a deletion -- and the import
   then kept them away. Those lines go wherever they are found. Deletes since
   are on cal_deleted::, so no "done once" flag is needed: one kept in GTD.md
   was lost whenever another device or tab wrote that file, and every reload
   then wiped the meetings you had deleted since. */
function dropOldCalSkips() {
  for (const p of allPages(isJournalPath)) {
    const page = getPage(p);
    if (page?.props?.cal_skip == null) continue;
    delete page.props.cal_skip;
    touch(p);
  }
}
