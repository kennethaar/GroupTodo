/* ============================================================
   66_URGENCY -- which of these first
   Taskwarrior's answer to "what next": one number per task, made of plain
   reasons added up, so the list can be read top to bottom. The coefficients
   are Taskwarrior's wherever it has one, so somebody coming from there finds
   the order they expect; the two that are GroupToDo's own are the context you
   are standing in, and a date on a line above counting for the steps under it
   -- that is what the hierarchy is for. Every reason is shown on the score's
   chip, because an order you cannot question is an order you stop trusting.

     deadline      12 x how close: 0.2 two weeks out, 1.0 a week late
                   (no deadline: the scheduled day, the same way)
     scheduled      5 once its scheduled day has come
     priority       6 / 3.9 / 1.8 for priority:: H / M / L
     doing          4 already started
     here           3 its context is the one you are in
     age            2 x a year on the list
     project        1 in a project
     chat           1 somebody has said something on it
     blocking       8 its project is what another project waits on
     blocked       -5 its project waits on one that is not finished
     waiting       -3 a Waiting for, or handed to somebody else
     chore          6 x how far past its round a repeat is, up to a whole
                   round late, so a daily one a day over beats a monthly
                   one a day over (see freshnessOf)

   A project ranks as its most urgent open action, or by its own deadline and
   its place in a chain when it has none, and a busier one edges ahead of a
   quieter one on a tie.
   ============================================================ */
const URGENCY = {
  due: 12, scheduled: 5, priorityH: 6, priorityM: 3.9, priorityL: 1.8,
  doing: 4, here: 3, age: 2, project: 1, chat: 1, blocking: 8, blocked: -5, waiting: -3, chore: 6,
};
