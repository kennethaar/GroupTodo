const ganttBarClass = (stateKey, end) =>
  "gbar " + (OPEN_STATES[stateKey] && end < todayISO() ? "late" : stateKey);

/* ---------- the drag ----------
   One pointer handler for both kinds of row. It never writes while the pointer
   is down: it moves the bar it was given and keeps the day offset, and the
   commit happens once, on release. So a drag across three months is one edit to
   the file, not ninety. */
let GSUPPRESS = 0;
const swallowedDrag = () => Date.now() - GSUPPRESS < 400;
