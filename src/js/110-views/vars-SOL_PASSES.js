/* The review asks one question at a time. The project lies in the middle and
   the answers to the question it is on are dealt round it, one to a box, where
   the numpad has them. The answer taken goes onto the pile under the project
   and the next question is dealt. The steps down the side say where you are,
   and any of them can be gone back to. */
/* The deck is gone through three times, each pass asking one kind of
   question, so the mind stays in one mode the whole way through: first sort
   every project by status (quick, and what is done or dropped leaves the deck),
   then ask of each project on hold whether it still is, then for what is
   still active say what done looks like and where it fits, and only then the
   very next action and who is in it. A hold taken off comes back in time to
   be asked those, like any active project. */
const SOL_PASSES = [
  {name: "Status", say: "Sort every project: still active, waiting, someday, done or dropped.", steps: ["status"]},
  {k: "hold", name: "On hold", say: "Every project on hold until a day: is it still on hold, or can it be done now?", steps: ["hold"]},
  {name: "Outcome", say: "For what is still active: what done looks like, and where it fits.", steps: ["outcome", "area", "deadline", "after"]},
  {name: "Next action", say: "For what is still active: the very next thing to do, and who is in it.", steps: ["next", "people", "orgs"]},
  {k: "loose", name: "Loose actions", say: "Actions on your day pages that no project or responsibility holds: which one does each belong to?", steps: []},
  {k: "holdopen", name: "On hold, no date", say: "Two projects on hold with no date at a time: pick the one you would rather pick up first. The best few rise to the top.", steps: []},
  {k: "someday", name: "Someday", say: "Two someday/maybe projects at a time: pick the one you would rather do. The best few rise to the top.", steps: []},
];
const SD_PASS = SOL_PASSES.findIndex(p => p.k === "someday");
const HD_PASS = SOL_PASSES.findIndex(p => p.k === "holdopen");
const solPassNo = () => SOL.pass || 0;
const SOL_ASK = {status: "Still the right status?", next: "What is the very next action?", outcome: "What does done look like?",
  deadline: "When does it have to be done?", area: "Which responsibility is it part of?", orgs: "Which organisations is it for?",
  people: "Who else is in it?", after: "Does it wait for another project?", hold: "Still on hold, or can it be done now?"};
/* Where the answers go, best first, in the order the numpad reads, so a list
   that has an order of its own (this week, next week, this month) keeps it. */
const SOL_SPOTS = ["7", "8", "9", "4", "6", "1", "2", "3"];
let SOL_ACTS = new Map();
