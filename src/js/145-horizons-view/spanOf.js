/* ============================================================
   GANTT -- the plan laid out in time, and movable
   The same tasks again, placed on a calendar line instead of in a list, so
   overlap and drift are visible rather than inferred. Reading was all it did
   at first, which made it the one view where seeing the problem did not let
   you fix it: you spotted the clash here and went somewhere else to move the
   date. Now a bar is a handle -- drag it along to reschedule, drag an end to
   stretch it -- and a project bar drags its whole project with it.

   Nothing is invented by the drag. It writes SCHEDULED:: and DEADLINE:: on the
   task, which is where the plan already lived; Added:: is history and is never
   rewritten, so a task captured in March that you push to May still says it
   was captured in March.
   ============================================================ */

/* A bar needs two ends, and the file does not always have both:
     start  SCHEDULED, else the day it was captured, else its deadline
     end    DEADLINE, else the day it was ticked off, else today -- still running
   A task with none of those gets no bar. It is counted and named underneath
   rather than given an invented span, because a made-up bar is a lie about
   the plan and reads exactly like a real one. */
function spanOf(b, journalDay) {
  const sched  = dateIn(blockProp(b, "SCHEDULED"));
  const dead   = dateIn(blockProp(b, "DEADLINE"));
  const added  = addedDate(b) || journalDay || null;
  const closed = closedOn(b);
  const open   = !!OPEN_STATES[b.state];
  let start = sched || added || dead || closed;
  if (!start) return null;
  let end = dead || (open ? null : closed) || (open ? todayISO() : start);
  if (end < start) end = start;
  return {start, end, open};
}
