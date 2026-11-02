/* The chip under a todo that has been clocked: how long, and whether it runs.
   With the line's page, a click opens the clock's stretches to change. */
function clockChip(b, path = null) {
  const cs = blockClocks(b);
  if (!cs.length) return null;
  const min = cs.reduce((s, c) => s + c.min, 0), on = cs.some(c => c.open);
  const says = (on ? "The clock is running: it stops when the task leaves Doing"
    : cs.length + " stretch" + (cs.length === 1 ? "" : "es") + " of doing it") + (path ? ". Click to change the times" : "");
  return el(path ? "button" : "span", {class: "chip" + (on ? " today" : ""), title: says,
    onmousedown: path ? e => e.preventDefault() : null,
    onclick: path ? e => { e.stopPropagation(); openClockEditor(path, b); } : null},
    "⏱ " + (fmtMinutes(min) || "0 m") + (on ? " running" : ""));
}
