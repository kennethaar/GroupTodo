/* Catch up (#516): the answer pasted so far and the references the prompt gave
   them, kept while the dialog is closed and opened again in the same area. A
   reference (T1, P1) means something only to the prompt it came from, so the
   draft goes when the prompt is made again. */
let CATCHUP_DRAFT = {space: null, answer: "", refs: null};
// Projects done this many days back are named at least, so the AI does not offer them as new.
const CATCHUP_DONE_DAYS = 30;
/* The GTD choice each kind of update gets in the list, the likely one first.
   A new to-do or project gets none: it is captured, and Clarify asks what it is. */
const CATCHUP_CHOICES = {
  next: [["next", "Next"], ["now", "Do now (2 min)"], ["delegate", "Delegate"], ["someday", "Someday"], ["skip", "Skip"]],
  due: [["deadline", "Deadline"], ["start", "Start date"], ["skip", "Skip"]],
  done: [["keep", "Done"], ["skip", "Skip"]],
  wait: [["keep", "Waiting for"], ["skip", "Skip"]],
  note: [["keep", "Note"], ["skip", "Skip"]],
};
/* The lines Catch up put on today's page, by day and clKey, so Clarify takes
   them today; the rest of today's page waits until it is past, as before. */
const CATCHUP_CAPTURED = "catchup.captured";
