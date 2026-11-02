/* ---------- points ----------
   A chore done is worth its size: a point for each quarter of an hour by its
   dots, and one for a chore nobody sized. Counted from done_by:: on the
   chores ticked off, so the board is only ever what the file says. */
const chorePoints = title => estTier(title) || 1;
