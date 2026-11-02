/* ============================================================
   105_OUTLINER -- the Logseq half of the app
   Keys: Enter new block, Tab/Shift-Tab indent, Ctrl-Enter cycle state,
         Backspace on an empty block deletes it, Up/Down move between blocks
         once there is no line left to move to inside this one.
   ============================================================ */
function siblingsOf(page, block) {
  let found = null;
  const rec = list => {
    if (list.includes(block)) { found = list; return; }
    list.forEach(b => rec(b.children || []));
  };
  rec(page.blocks);
  return found || page.blocks;
}
