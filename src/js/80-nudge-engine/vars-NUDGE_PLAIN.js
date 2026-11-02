const NUDGE_PLAIN = {
  stuck  : "projects with nothing to do next",
  loose  : "tasks not attached to anything",
  verb   : "tasks that don't say what to actually do",
  ctx    : "tasks with no place to do them",
  outcome: "projects with no finish line",
  area   : "projects under no responsibility",
  goal   : "goals nobody is working on",
  wait   : "people to chase",
  ask    : "people to send a check-in to",
  tell   : "people due an update on their responsibilities",
  late   : "overdue",
  stale  : "projects older than 6 months",
  nofolder: "this area is not in a folder yet",
  days   : "day pages nobody has gone through",
  tplyear: "templates that stop when the year ends",
};
const DEEP_NUDGES = ["verb", "ctx", "area", "goal", "loose", "outcome", "days"];

/* Why each one is here, in the person's own interest rather than the method's.
   Kept out of the way -- a chip says what is true, this says why anyone should
   care, and only when asked. Where the research is strong it is named; where it
   is folklore it is written as an opinion, because a nudge that oversells itself
   is just advertising. */
const NUDGE_WHY = {
  days:
    "Writing a thing down is only half of getting it out of your head. A line from a meeting " +
    "that never became a task is a promise nobody is keeping; going through the day once " +
    "and deciding is what lets you forget it.",
  tplyear:
    "A template named for a year - 2026, 2026-Monday, 2026-W38 - only applies in that year. " +
    "Without a copy for the next one, the trackers and lines it pours into your days " +
    "quietly stop on the first of January.",
  tell:
    "Somebody who has to ask how it is going has already started to wonder. Telling them " +
    "before they ask is cheaper than answering when they do.",
  late:
    "A date you sail past teaches you to stop believing your own list, and a list you " +
    "do not believe stops getting opened. Moving the date on purpose keeps it honest; " +
    "letting it rot does not.",
  stuck:
    "A project with no next step is the one thing your head refuses to let go of, " +
    "because there is nothing to let go of it to. One concrete next action is what " +
    "makes it quiet.",
  loose:
    "A task with no home survives a day and rots over a month: nothing brings it back " +
    "to you at the moment it would have mattered.",
  verb:
    "\u201cSort out the insurance\u201d is a decision you have to make again every time you " +
    "read it. \u201cCall Storebrand\u201d is something your hands can start. This is the " +
    "best-evidenced habit in the whole system: people who write down the specific " +
    "action, and when and where they will do it, follow through markedly more often " +
    "than people who only intend to - psychologists call them implementation intentions.",
  ctx:
    "Most of what blocks a task is being in the wrong place, without the thing you " +
    "need in your hand. A context is what lets the list answer the only question you " +
    "ever really ask it: what can I actually do, here, now?",
  outcome:
    "Written as though it already happened - \u201cSink repaired, no drip\u201d - a project " +
    "gives you something you can recognise when you get there. Without it projects do " +
    "not finish, they only get older.",
  area:
    "A project under no part of your life is usually one you took on without ever " +
    "deciding to.",
  goal:
    "A goal nobody is working on is a wish. Give it a project or let it go - both are " +
    "honest; leaving it to sit there is the one option that costs you something.",
  wait:
    "Anything you handed to someone else is invisible by definition. Keeping the list " +
    "is what makes chasing it feel like admin rather than nagging.",
  stale:
    "Old projects do not sit there harmlessly. They make the whole list feel heavy, " +
    "and a heavy list gets avoided.",
  review:
    "The weekly look is what makes everything else trustworthy. Capture, contexts and " +
    "projects are bookkeeping if nobody ever reads them back.",
  nofolder:
    "Until this area has a folder it exists in one browser on one machine: no .md " +
    "files to open in Neovim or Obsidian, nothing to share with anybody, and nothing " +
    "left if this browser is cleared. Choosing one moves everything already here into " +
    "it. Asked once your list is worth something, not on the first day.",
};

/* A nudge you have quietened. Deliberately per-nudge and time-boxed rather than a
   global off switch: "not now" is almost always what someone means, and a nudge that
   can never come back is a nudge that has to shout the first time. */
const nudgeQuietUntil = id => PREF.get("nudge.quiet." + id, "");
