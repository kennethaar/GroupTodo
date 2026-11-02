/* ---------- Syncthing's conflict copies (#221) ----------
   Two devices that save one page before they have synced leave Syncthing
   with two versions, and it keeps one of them beside the page as
   "Boat.sync-conflict-20261031-101500-ABCDEFG.md". Read as a page, that was a
   second Boat with half the work in it. So a conflict copy is not a page: its
   lines are put into the page it is a copy of, and the copy is deleted.

   There is no version the two started from to merge against, so nothing is
   taken out: every line of both is kept, and the same line in both comes out
   once. A task ticked off in one copy and still open in the other is the
   same line, kept as done -- ticking off is what people do, opening a done
   task again is rare. */
const SYNC_COPY_RE = /^(.*)\.sync-conflict-\d{8}-\d{6}-[A-Za-z0-9]+(\.md)$/i;
const syncCopyOf = p => { const m = SYNC_COPY_RE.exec(p || ""); return m ? m[1] + m[2] : null; };

// The words of a line, whatever state it is in: what makes two lines the same line.
const lineKey = b => trim(b.title || "").replace(/\s+/g, " ").toLowerCase();
const isClosed = st => st === "DONE" || st === "CANCELLED";
