/* ---------- cutting a whole line to paste elsewhere ----------
   Ctrl-X on a line (with nothing, or all of it, selected) puts the line and
   its children on the clipboard, but leaves them where they are. Pasting that
   same text onto another line -- in any space -- asks how to carry it across,
   so a cut that is never pasted loses nothing. A partial selection is plain
   text editing, as always. */
let PENDING_BRANCH_CUT = null;
