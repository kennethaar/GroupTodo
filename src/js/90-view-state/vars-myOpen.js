/* The counts are true totals across the spaces on screen. */
const myOpen = () => memo("myOpen", () => leafActions().filter(a => OPEN_STATES[a.state] && a.mine));
const dueNow = () => myOpen().filter(a => a.due && a.due <= todayISO());
/* What you are owed: anything handed to somebody else, and anything of yours
   that is waiting on somebody nobody named. Somebody else's own work is not
   something you are waiting for. */
const waitingRows = () => memo("waitingRows", () => leafActions().filter(a => OPEN_STATES[a.state] &&
  ((a.assignee && !samePerson(a.assignee, whoAmI()) && !(a.state !== "WAIT" && isHousehold(a.assignee)))
   || (a.state === "WAIT" && a.mine))));
const visibleProjects = code => projectsInVisible(code);
