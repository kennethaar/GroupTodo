/* ============================================================
   WEEKLY REVIEW -- a handful of steps, and what is worth a look
   ============================================================ */
const attention = () => memo("attention", () => computeNudges().filter(n => n.id !== "clean"));

/* ---------- the steps, kept as a routine ----------
   The weekly review is a list you run every week, so it lives where routines
   live: pages/8/Weekly review.md, in Settings, where you can reword a
   step, drop one, or add your own. Until somebody edits it the app uses the
   list below, so nothing is written into a shared folder just for looking.

   The page reads as an outline: a top line is a section (CLEAR, CURRENT,
   CREATIVE), the lines under it are the steps, and the first line under a step
   says what it means. A [[go/...]] link in a step is a door to the part of the
   app that step is done in. */
const REVIEW_LIST_PATH = join(DIRS.lists, "Weekly review.md");
const REFLECT_STEP = ["Reflect: toward and away from your intentions [[go/reflect]]",
  "Look back on the week's events and feelings. Which moved you toward what you want, and which away?"];
/* In David Allen's order. Get clear: loose papers, the inboxes to zero, then
   your head. Get current: the action lists, the calendar back and ahead,
   waiting for, the projects, the checklists. Get creative: someday/maybe,
   then the higher horizons. */
const REVIEW_STEPS = [
  ["CLEAR", [
    ["Papers", "Process all loose physical papers and notes to zero."],
    ["Clarify: what on your day pages is a to do? [[go/days]]",
     "Each loose line of the last two weeks, one at a time: a to do, a waiting-for, a project, an idea for later, or a note."],
    ["Phone messages", "Clear voice messages, texts, and communication apps."],
    ["Downloads folder", "Organize or delete all downloaded files."],
    ["Mind dump [[go/today]]", "Write down all uncaptured thoughts, ideas, and open loops."],
  ]],
  ["CURRENT", [
    ["Next actions: still yours, a verb, a context, a home [[go/actions]]",
     "Go through your next actions one card at a time: done, waiting or later, what you physically do, where, and which project."],
    ["Calendar two weeks back and four weeks forward [[go/weeks]] [[go/agenda]]",
     "Review the past two weeks for loose ends and preview the upcoming four weeks."],
    ["Context and send reminders of waiting-for [[go/context]] [[go/waiting]]",
     "Check next-action context lists and follow up on waiting-for items."],
    ["Projects next action? Move to Someday/Maybe or Done [[go/solitaire]]",
     "Ensure each project has an active next action, or archive it to Someday or Maybe or Done."],
    ["Routines and checklists [[go/checklists]]", "Review recurring checklists and standard operating procedures."],
  ]],
  ["CREATIVE", [
    ["Check Someday/Maybe to Projects? [[go/duel]] [[go/someday]]",
     "Review Someday or Maybe lists to decide if any should become active projects."],
    ["Projects on hold with no date: pick one up? [[go/holdduel]]",
     "Weigh the projects on hold without a date two at a time, and take one off hold if it is time."],
    ["Horizons of focus [[go/horizons]]", "Review your higher-level commitments and goals."],
    REFLECT_STEP,
    ["Celebrate! [[go/report]]", "Acknowledge your weekly progress and completed work."],
  ]],
];
/* The five lines every vault was started with before the list followed the
   three parts. A list still word for word that one is read as the built-in
   list; one somebody has changed is theirs and is read as it is. */
const OLD_STARTER_STEPS = ["Empty the inbox", "Review every project for a next action",
  "Chase anything waiting on someone else", "Scan the calendar two weeks out", "Reread someday/maybe"];
