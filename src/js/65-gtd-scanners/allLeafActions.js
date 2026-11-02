/* ---------- on hold ----------
   Taskwarrior's wait:, written hold:: [[2026-11-03]]. A task on hold is real
   and stays where it was written, but no list shows it until that day comes:
   the renewal you cannot do before March, the follow-up that makes no sense
   until they have had a week. On the day it simply reappears, with nothing
   to tick off and nobody asked. Holding a line holds the steps under it, the
   way a date on it dates them. Next lists what is on hold at the bottom, and
   when it comes back, so nothing held is lost.

   Only leafActions() hides them. Expiry still sees them, so a held task can
   run past its until:: like any other. */
function allLeafActions() { return memo("allLeafActions", () => acrossSpaces(leafActionsHere)); }
