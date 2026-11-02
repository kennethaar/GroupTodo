/* ---------- the timer ----------
   A pomodoro in the sidebar. Click it for the usual length (minutes:: on
   pages/8/timer.md, 2 if there is no such page), or press and drag to pick
   1 to max:: minutes (60 if it says nothing), TIMER_PX pixels a minute. Which
   way you drag says how it ends: up rings, left or any other way is silent, only a
   note in the corner; with Ctrl held it rings whichever way. A click rings. Click it while it runs to stop it. The
   end time is kept per device, so a reload does not lose it. style:: dial on
   the same page shows it as a pie instead; see timerDialItem(). */
const TIMER_PATH = join(DIRS.lists, "timer.md");
const TIMER_PX = 4;
let TIMER_SOUND = safeLS.get("gtd.timerSound", "1") === "1";
let TIMER_END = Number(safeLS.get("gtd.timerEnd", 0)) || 0;
let TIMER_LEN = Number(safeLS.get("gtd.timerLen", 0)) || 0;
// When it rang, kept until the alarm is clicked away, so the timer can show
// how long ago that was.
let TIMER_DUE = Number(safeLS.get("gtd.timerDue", 0)) || 0;
let TIMER_TICK = null;
