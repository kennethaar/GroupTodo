/* ---------- changing what the clock wrote ----------
   A clock left running over lunch, or one never started. Each stretch is a
   box on its day, as in a calendar: drag on the empty day for a new one, drag
   a box to move it, its top or bottom edge to change when it starts or ends,
   ✕ to take it off. The same times are fields underneath. Saved, the drawer
   is written back the way Logseq writes it; nothing changes until then. */
const CLOCK_HOUR_PX = 40, CLOCK_SNAP = 5;
const clockAt = (day, h, m, sec) => new Date(day + "T" + pad2(+h) + ":" + pad2(+m) + ":" + pad2(+(sec || 0)));
