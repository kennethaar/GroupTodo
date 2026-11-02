/* Short reference used in links: "1/Fix sink", "c/phone", "2026-09-17" */
function pageRef(path) {
  const sd = statusDirOf(path);
  if (sd) return sd + "/" + baseName(path);
  for (const [pfx, dir] of Object.entries(PREFIX_DIR)) {
    // A context in a folder is named with it: c/home/kitchen.md is [[c/home/kitchen]].
    if (path.startsWith(dir + "/")) return pfx + "/" + (pfx === "c" ? path.slice(dir.length + 1).replace(/\.md$/i, "") : baseName(path));
  }
  if (isJournalPath(path)) {
    const who = journalOwnerOf(path);
    return (who && who !== journalOwner()) ? baseName(path) + " \u00B7 " + who : baseName(path);
  }
  return baseName(path);
}
