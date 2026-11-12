/* ---------- feedback, reviewed ----------
   A word from somebody else on a task you are part of is feedback, and it
   stays open until the project or to-do it is about has an outcome (#285).
   Reading it, answering it or editing the task does not close it. The outcome
   is written on the comment itself -- who decided, when, and what -- so
   History can say what came of it. Status changes with no words are not
   feedback: they stay in History and never enter the review. */
const HANDLED_PROP = "handled", DECIDED_PROP = "decided";
const isHandled = m => !!trim(blockProp(m, HANDLED_PROP) || "");
const OUTCOME_LABEL = {continue: "Continue", close: "Close", cancel: "Cancelled", someday: "Someday/Maybe",
  keep: "Keep", complete: "Done", takeback: "Take it back"};
// The question before an outcome that leaves open work behind.
const OUTCOME_ASK = {close: "Close", cancel: "Cancel", complete: "Finish"};
