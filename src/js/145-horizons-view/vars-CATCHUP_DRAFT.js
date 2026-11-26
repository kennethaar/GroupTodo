/* Catch up (#516): the answer pasted so far and the references the prompt gave
   them, kept while the dialog is closed and opened again in the same area. A
   reference (T1, P1) means something only to the prompt it came from, so the
   draft goes when the prompt is made again. */
let CATCHUP_DRAFT = {space: null, answer: "", refs: null};
// Projects done this many days back are named at least, so the AI does not offer them as new.
const CATCHUP_DONE_DAYS = 30;
// The 3 to 5 active projects GTD aims at: a new one past 5 says so.
const CATCHUP_WIP = 5;
// What to capture (NEXT, TODO, PROJECT) is asked for at most this many times: a short list gets read.
const CATCHUP_NEW_MAX = 10;
/* The GTD choice each kind of change gets in the list, the likely one first:
   clarify (do it, delegate it, defer it, or let it go) rather than yes or no. */
const CATCHUP_CHOICES = {
  next: [["next", "Next"], ["now", "Do now (2 min)"], ["delegate", "Delegate"], ["someday", "Someday"], ["skip", "Skip"]],
  todo: [["next", "Next"], ["now", "Do now (2 min)"], ["delegate", "Delegate"], ["someday", "Someday"], ["skip", "Skip"]],
  due: [["deadline", "Deadline"], ["start", "Start date"], ["skip", "Skip"]],
  project: [["active", "Active"], ["someday", "Someday"], ["skip", "Skip"]],
  done: [["keep", "Done"], ["skip", "Skip"]],
  wait: [["keep", "Waiting for"], ["skip", "Skip"]],
  note: [["keep", "Note"], ["skip", "Skip"]],
};
