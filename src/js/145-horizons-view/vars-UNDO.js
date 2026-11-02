/* ============================================================
   UNDO FOR DELETES
   Deleting was one click and permanent, which is the only genuinely scary
   thing left in the app. It is now one click and reversible for a while.

   What is kept is the removed thing itself, not a snapshot of the page --
   putting a whole page back would quietly discard anything else that changed
   on it in the meantime, which is a worse bug than the one being fixed. A
   block remembers its parent and where it sat; if the shape has moved on by
   the time you undo, it goes back to the end of that parent rather than
   refusing.
   ============================================================ */
const UNDO = [];
const UNDO_KEEP = 20;
