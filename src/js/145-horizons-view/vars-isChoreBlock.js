/* ---------- who did it (#236) ----------
   A chore handed to somebody who takes turns is credited to them, whoever
   ticks it off: Mia emptied the dishwasher, a parent ticked it, Mia gets the
   point. It is the same done_by:: stamp the tick writes, with their name in
   it, so Points, the Report and History need nothing else. The done toast
   has a "By ..." list to say it was somebody else. */
const isChoreBlock = b => !!(b && repeatOf(b) && atHome(blockContext(b)));
