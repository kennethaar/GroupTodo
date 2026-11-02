/* ---------- next actions that look alike ----------
   The same todo written twice -- "Call the plumber about the sink" on the
   project and "Call plumber about sink" on the day you thought of it -- is
   one thing to do counted twice. Next compares its open actions the way
   Projects compares projects (projectTwinsOf, on the words of the line) and
   offers each group at once: keep one, and the others go, or say they are not
   the same and they stop being flagged. */
let NEXT_TWINS_KEPT = null;
