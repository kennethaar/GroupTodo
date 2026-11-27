/* Catch up (#516): the answer pasted so far and the references the prompt gave
   them, kept while the dialog is closed and opened again in the same area. A
   reference (T1, P1) means something only to the prompt it came from, so the
   draft goes when the prompt is made again. */
let CATCHUP_DRAFT = {space: null, answer: "", refs: null};
// Projects done this many days back are named at least, so the AI does not offer them as new.
const CATCHUP_DONE_DAYS = 30;
/* The GTD choice each kind of update gets in the list, the likely one first.
   A new line (next action, to-do, project, a project's progress) gets none:
   it is taken or not, and the mini review asks what it is (#516 follow-up). */
const CATCHUP_CHOICES = {
  next: [["take", "Take"], ["skip", "Skip"]],
  due: [["deadline", "Deadline"], ["start", "Start date"], ["skip", "Skip"]],
  done: [["keep", "Done"], ["skip", "Skip"]],
  wait: [["keep", "Waiting for"], ["skip", "Skip"]],
  note: [["keep", "Note"], ["skip", "Skip"]],
};
/* The lines Catch up put on today's page, by day and clKey, so Clarify takes
   them today; the rest of today's page waits until it is past, as before. */
const CATCHUP_CAPTURED = "catchup.captured";
/* The mini review Apply starts (#516 follow-up): the lines the AI wrote, by
   block id; where you were, to go back to; the phase, "clarify" (Quick asks
   to do or note) then "sort" (Review actions, only what the to-dos still
   need), then "done"; and the day page they are on. null when none runs. */
let CU_RUN = null;
// Its What's new animation, offered the first time a mini review starts.
const CU_NEWS = "1.230.0#516";
// The heading the AI's lines go under on today's page: by:: AI, and the mark in its words.
const CU_MARK = "✦";
const isCatchUpHead = b => blockProp(b, "by") === "AI" && (b.title || "").startsWith(CU_MARK);
