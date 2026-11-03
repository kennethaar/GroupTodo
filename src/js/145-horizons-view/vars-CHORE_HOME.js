/* ---------- the chores ----------
   A chore is an open task with repeat:: at @home or a room inside it --
   the floor, the bins, the plants.
   Chores is the home at a glance, read off those same lines: how fresh each
   room (its context) is, what is due, what comes this week, and who has done
   how much. Nothing is stored for it. */
/* Only at home: a repeat at @home or in a room inside it, @home/kitchen. A
   weekly report at the office repeats too, and is not a chore. */
const CHORE_HOME = "home";
const atHome = ctx => !!ctx && (ctx.toLowerCase() === CHORE_HOME || ctx.toLowerCase().startsWith(CHORE_HOME + "/"));
const isChore = a => !!(a.block && OPEN_STATES[a.state] && repeatOf(a.block) && !isAsNeeded(repeatOf(a.block)) && atHome(a.context));
const allChores = () => memo("allChores", () => allLeafActions().filter(isChore));
const choreRows = () => allChores().filter(a => !a.held);
