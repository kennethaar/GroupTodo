/* Move pre-name journals into this person's folder, once there is a name. */
function migrateJournals() {
  const who = journalOwner();
  if (!who) return 0;
  let moved = 0;
  for (const path of Array.from(V.pages.keys())) {
    if (!isJournalPath(path)) continue;
    const owner = journalOwnerOf(path);
    // "Untitled" is not a person: an earlier build wrote it for anybody who had
    // not named themselves yet. Claim those days along with the flat ones.
    if (owner && owner !== "Untitled") continue;
    if (owner === who) continue;
    const target = join(JOURNALS, who, baseName(path) + ".md");
    if (V.pages.has(target)) { removePage(path); continue; }
    putPage(target, getPage(path));
    removePage(path);
    moved++;
  }
  if (moved) notify("Moved " + moved + " journal day(s) into your own folder.");
  return moved;
}
