/* ============================================================
   105b_LINE_SELECTION -- several lines at once, with the mouse
   ------------------------------------------------------------
   Every line in the outline is its own contenteditable, which is what lets a
   line keep its own links, its own state button and its own raw text while you
   are in it. The price was that a browser will not run a text selection across
   two of them: dragging down the page selected inside the first line and
   stopped there, so moving five lines somewhere else meant five trips, and
   there was no way at all to copy a piece of a page out to anywhere.

   So the drag means what it looks like it means: pick the lines. Press on a
   line, drag onto another, and every line between them is picked -- children
   travelling with their parent, because a line and what hangs under it is one
   thing. Then ctrl-c copies them as markdown, ctrl-x cuts them, delete throws
   them away, ctrl-v puts what is in the clipboard in their place, and ctrl-z
   takes any of it back.

   A press that does not leave the line it started on is left alone entirely,
   so clicking into a line and selecting a word inside it works as it always
   did.
   ============================================================ */
const LINE_SEL = {path: null, ids: [], anchor: null, head: null};

/* ---------- picking lines from the keyboard ----------
   Esc on a line picks that line. Shift and an arrow then reach further up or
   down from where the pick started; the arrows alone move a one-line pick;
   Enter goes back into the line the pick ended on. The anchor is where it
   started and the head where it has got to, and every line between them is
   picked, the same as a drag. */
const blkEl = id => $('.blk[data-id="' + id + '"]');
