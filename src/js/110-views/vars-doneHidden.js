/* Hide done (#321): a page read for what is left shows only that. A done or
   cancelled line goes with everything under it. The page and its Linked
   References each have a switch, and the page remembers both in hide_done::
   (page, links), so it opens the way it was left, on every device.
   A day page is a new file each day, so its own switch (#332) is one switch
   for every journal, every area and every day on this device, and the day
   page itself keeps every line as it was written. */
const HIDE_DONE_PROP = "hide_done";
const dayHideDoneKey = () => "journal.hide_done";
const doneHidden = (path, part) => part === "page" && isJournalPath(path) ? PREF.get(dayHideDoneKey()) === "1"
  : String(getPage(path)?.props?.[HIDE_DONE_PROP] || "")
  .split(",").map(s => trim(s).toLowerCase()).includes(part);
const isClosedLine = b => b.state === "DONE" || b.state === "CANCELLED";
// What Hide done takes away: a closed line counts once, with what is under it.
const closedLineCount = blocks => (blocks || []).reduce((n, b) => n + (isClosedLine(b) ? 1 : closedLineCount(b.children)), 0);
const shownLines = (blocks, opts) => opts && opts.hideDone ? blocks.filter(b => !isClosedLine(b)) : blocks;
