/* Hide done (#321): a project page read for what is left shows only that.
   A done or cancelled line goes with everything under it. The choice is the
   app's, on this device, so every page opens the way the last one was left. */
const doneHidden = () => String(PREF.get("page.hideDone", "0")) === "1";
const isClosedLine = b => b.state === "DONE" || b.state === "CANCELLED";
// What Hide done takes away: a closed line counts once, with what is under it.
const closedLineCount = blocks => (blocks || []).reduce((n, b) => n + (isClosedLine(b) ? 1 : closedLineCount(b.children)), 0);
const shownLines = (blocks, opts) => opts && opts.hideDone ? blocks.filter(b => !isClosedLine(b)) : blocks;
