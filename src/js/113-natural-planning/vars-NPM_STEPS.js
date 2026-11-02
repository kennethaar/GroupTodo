/* ============================================================
   113_NATURAL_PLANNING
   David Allen's natural planning model, one question to a screen: why, what
   done looks like, every idea, sorting them, the next actions, and a last
   look at whether the project is off your mind (#189). It is laid out like
   the weekly review -- the steps down the side, the numpad table for
   sorting -- so there is nothing new to learn.

   Nothing is written to the project until Finish. Until then the answers are
   a draft, kept on this device and in "_npm_for <project>.md" beside the
   project, so a closed tab or another computer carries on where you were. In
   a shared area the draft says who is planning, and somebody else takes it
   over rather than planning beside them. Finish writes the page in one
   change, and Undo takes all of it back. A page planned before is read back
   in, so planning again starts from what is there.

   The page it writes:

       outcome:: ...   purpose:: ...   with:: [[p/...]]   planned:: 2026-10-30
       - ## Purpose & principles
         - Why: ...            - Must achieve: ...      - Principles / - rule
       - ## Outcome
         - Wild success: ...   - How I'll know: ...
       - ## Components
         - ### 1. Mailing list                 its ideas, then its next action
         - ### 2. Template
           after:: 1. Mailing list             cannot start before it
       - TODO ...                              next actions of their own
       - ## Support / ## Later / ## Brainstorm  folded; Brainstorm is every idea, as typed
   ============================================================ */
const NPM_STEPS = [
  {k: "purpose", name: "Purpose", how: "Answer in plain words. Skip what is obvious."},
  {k: "outcome", name: "Outcome", how: "Picture it done. Then say it in one line."},
  {k: "brainstorm", name: "Brainstorm", how: "More is better. Don't judge yet: you sort in the next step."},
  {k: "organise", name: "Organise", how: "Press 1–9 to sort the idea in the middle. Backspace undoes."},
  {k: "next", name: "Next actions", how: "Who, then where, then the verb."},
  {k: "focus", name: "Off your mind?", how: "8 goes back up, 2 back to the actions, 6 writes the page."},
];
// The headings the plan owns on the page. Planning again replaces these and nothing else.
const NPM_HEADS = {purpose: "Purpose & principles", outcome: "Outcome", comps: "Components",
  support: "Support", later: "Later", brainstorm: "Brainstorm"};
// The lines under them, as "Why: ..." -- the answer to each question says which question it was.
const NPM_LINES = [["purpose", "Why"], ["onpurpose", "Must achieve"], ["vision", "Wild success"], ["know", "How I'll know"]];
// A prompt for a mind gone blank, drawn one at a time.
const NPM_TRIGGERS = ["Who has to know?", "What could go wrong?", "Money and costs", "Legal and risks",
  "Tools and materials", "Who could help?", "Dates and deadlines", "What does it replace?",
  "Loose ends from last time", "What is the first draft?", "Where will it live?", "How will you know it worked?"];
// Where the components go on the numpad, in order: the top row, then 4. Four at most (Cowan).
const NPM_COMP_KEYS = ["7", "8", "9", "4"];
const NPM_GRID = ["7", "8", "9", "4", "CARD", "6", "1", "2", "3"];

let NPM = null;          // the plan on screen
let NPM_QUEUE = [];      // projects the weekly review put aside to plan again: {space, path}
let NPM_PENDING = null;  // what is typed in the box but not yet added
let NPM_WRITE_T = 0;

const npmKey = (space, path) => "npm:" + (space || "") + "|" + path;
const npmIn = fn => inSpace(NPM.space, fn);
const npmAskOn = space => PREF.get("npm.ask:" + (space || ""), "1") !== "0";
const npmNum = s => trim(String(s || "").replace(/^\d+\.\s*/, ""));
const npmHeadOf = b => {
  const m = /^##\s+(.+)$/.exec(trim(b.title || ""));
  return m ? Object.keys(NPM_HEADS).find(k => NPM_HEADS[k].toLowerCase() === trim(m[1]).toLowerCase()) || null : null;
};
const npmOpenLine = text => /^- (TODO|DOING|WAIT)\s/.test(text || "");

/* ---------- the draft, on this device and beside the project ---------- */
const npmDraftPath = path => join(path.split("/").slice(0, -1).join("/"), "_npm_for " + baseName(path) + ".md");
