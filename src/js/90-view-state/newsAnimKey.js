/* The NEWS_ANIM key of one new thing: its version, and its issue when it has
   one, since one version may bring several (#471). */
function newsAnimKey(entry, item) {
  return entry.version + (item.issue ? "#" + item.issue : "");
}
