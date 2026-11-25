/* Catch up (#516): the answer pasted so far and the references the prompt gave
   them, kept while the dialog is closed and opened again in the same area. A
   reference (T1, P1) means something only to the prompt it came from, so the
   draft goes when the prompt is made again. */
let CATCHUP_DRAFT = {space: null, answer: "", refs: null};
const CATCHUP_DAYS = 7, CATCHUP_DONE_DAYS = 30;
