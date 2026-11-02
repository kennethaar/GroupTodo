/* ============================================================
   168_SPACES_SIDE_BY_SIDE
   Several spaces open at once: one day page per space, side by side, and
   lines and pages carried between them -- moved, copied, or kept as synced
   copies that follow each other's edits.
   ============================================================ */

/* The line, page or card that Alt-S would move: whatever was last pressed or
   focused, wherever on screen it is. */
let SPACE_CONTEXT = null;
