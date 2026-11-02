/* ============================================================
   RECURRENCE, OFFERED RATHER THAN SCHEDULED
   A scheduler fills your list while you are on holiday and hands you a wall of
   overdue chores on the Monday. That is the thing people flee, and this app
   already says so about nudges, so recurrence works the other way round:
   NOTHING is created until you tick the last one off, and even then you are
   asked. Miss a week and you have missed a week -- there is no backlog of
   imaginary Mondays waiting for you.

   The spec lives in the file as plain words -- repeat:: every 2 weeks -- so it
   reads the same in Neovim as it does here.
   ============================================================ */
const REPEAT_PROP = "repeat";
const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
