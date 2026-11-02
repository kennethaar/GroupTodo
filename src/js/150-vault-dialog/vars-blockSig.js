/* ---------- block-level merge ----------
   Whole-page last-write-wins loses work: two devices appending to the same
   day's journal is the normal case, not an edge case. So when a page changed
   on BOTH sides since the last sync, merge its blocks instead of picking a
   winner. Blocks are matched on their text, so an append on either side
   survives and a checked-off task propagates. */
const blockSig = b => trim(b.title || "").toLowerCase();
