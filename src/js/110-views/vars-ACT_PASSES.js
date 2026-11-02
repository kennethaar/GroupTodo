/* ============================================================
   REVIEWING NEXT ACTIONS, AS SOLITAIRE
   The same table as the projects, dealt with your own next actions instead:
   one line on the card, its answers round it where the numpad has them. Four
   passes, one kind of question each, for the same reason the projects have
   theirs -- sorting is quick, wording is slow, and switching between them on
   every card is what makes a review get abandoned:

     1  Still to do   every open action of yours: keep it, it is done, it waits
                      on somebody, not this week or month, let it go, or it was
                      never an action (a note)
     2  Verb          the ones that do not start with a verb you could film
     3  Context       the ones with no context
     4  Home          the ones on day pages that no project or responsibility
                      holds -- the loose actions the projects review files too

   Every answer is written on the line the way the line menu would write it:
   a verb at the start, [[c/...]], waiting_for::, hold::, a state, or the line
   refiled. Only "still to do" leaves nothing on the line, so it is kept on
   this device for the week, like the projects' answers.
   ============================================================ */
const ACT_PASSES = [
  {name: "Still to do", say: "Every next action of yours: still to do, done already, waiting on someone, later, or let go.", steps: ["still"]},
  {name: "Verb", say: "The ones that do not start with something you could film: what do you physically do first?", steps: ["verb"]},
  {name: "Context", say: "The ones with no context: where, or with what, can you do it?", steps: ["context"]},
  {name: "Project or area", say: "The ones on day pages that nothing holds: which project or responsibility are they part of?", steps: ["home"]},
];
const ACT_ASK = {still: "Still yours to do?", verb: "What do you physically do first?",
  context: "Where, or with what, can you do it?", home: "Which project or responsibility is it part of?"};
// The answers to "still to do" that are stacks the sorted actions lie on; a hold is a day, not a stack.
const ACT_STACKS = ["keep", "done", "wait", "cancel", "note"];
const actAnsNow = r => SOL_ANS.get(solKey(r)) || {};    // read only: asking makes no entry

/* Your own open actions you could do: not waiting, not somebody else's, not a
   tour step or a step of a routine you ran, which were worded once in their list.
   Nor a chore on track: it comes round by itself, and Chores shows how fresh
   each room is. Only one missed for whole rounds comes up, to renegotiate (#215). */
const actChoreRounds = () => { const v = trim(String(PREF.get("review.chores", "") || "")), n = Math.floor(+v); return v && n >= 0 ? n : 2; };
const choreStale = a => { const n = actChoreRounds(), f = n ? freshnessOf(a) : null; return !!f && f.rounds >= n; };
const actMineOpen = () => leafActions().filter(a => a.mine && (a.state === "TODO" || a.state === "DOING") && !a.tourStep && !a.checklist);
