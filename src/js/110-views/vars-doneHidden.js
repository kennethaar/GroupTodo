/* Hide done (#321): a project page read for what is left shows only that.
   A done or cancelled line goes with everything under it, on the page itself,
   among its tasks written on day pages and among the lines that link to it.
   The choice is the app's, on this device, so every page opens the way the
   last one was left. */
const doneHidden = () => String(PREF.get("page.hideDone", "0")) === "1";
const isClosedLine = b => b.state === "DONE" || b.state === "CANCELLED";
// What Hide done takes away: a closed line counts once, with what is under it.
const closedLines = (blocks, into = new Set()) => {
  for (const b of blocks || []) isClosedLine(b) ? into.add(b) : closedLines(b.children, into);
  return into;
};
const closedLineCount = blocks => closedLines(blocks).size;
const shownLines = (blocks, opts) => opts && opts.hideDone ? blocks.filter(b => !isClosedLine(b)) : blocks;
// A linked line is closed when it, or a line it hangs under, is done.
const isClosedHit = h => !!h.block && (isClosedLine(h.block) || (h.trail || []).some(isClosedLine));
