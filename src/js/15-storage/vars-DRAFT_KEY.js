/* ---------- the line you were typing ----------
   A line is written back to its page when you leave it, so the words in the
   line being typed exist nowhere but the screen until then. A crash, a closed
   laptop or a killed tab took them with it, and neither the debounce nor the
   mirror ever saw them. So every keystroke copies the line to this device,
   and the copy is dropped the moment the line is written back. A copy still
   here at the next start is a line that never made it; you are offered it.

   The copy says which line it belongs to by the text the line had when you
   started typing, because block ids are not stored in the file. When that
   line is no longer there -- edited on another device, say -- the words are
   added as a new line rather than written over anything. */
const DRAFT_KEY = "gtd.linedraft";
