/* ============================================================
   169_PROJECT_HOLD -- a whole project, out of sight until a day
   The same hold:: as a task's, on the project's page: hold:: [[2027-03-01]].
   Its actions leave every list, it leaves the project list for an On hold
   group under it, and the weekly review stops calling it stuck -- nobody is
   meant to be doing it yet. On the day it all comes back by itself.
   ============================================================ */
function projectHold(path) {
  const day = holdValue(getPage(path)?.props?.hold);
  return day && day > todayISO() ? day : null;
}
