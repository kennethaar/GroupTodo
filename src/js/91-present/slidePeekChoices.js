/* What the slide preview can show (#465), in this order: the slide you left
   last time, the talk from the top, a line where it is in the whole talk,
   and the talk from that line. ▶ Present's line is the one you were in;
   ☰ › Present from here's (`menuLine`) is its own. `on` is the one shown
   first: last time, else where the button starts. */
function slidePeekChoices(path, root = null, menuLine = null) {
  const top = deckSteps(path, menuLine ? null : root);
  const within = (b, r) => !r || b === r || (b && within(b._parent, r));
  let line = menuLine;
  if (!line && SLIDE_LINE) {
    const page = getPage(path);
    walkBlocks(page?.blocks || [], b => { if (b.id === SLIDE_LINE) line = b; });
    if (line && !within(line, root)) line = null;
  }
  const from = line ? deckSteps(path, line, true) : null;
  // The talk the button presents: from the menu's line, or the page (or its focused line).
  const own = menuLine ? from : top;
  const choices = [];
  const last = slideLast(path, menuLine || root);
  if (last >= 0 && own.steps.length) choices.push({label: `Last time: slide ${own.steps[Math.min(last, own.steps.length - 1)].s.n} of ${own.slides.length}`,
    deck: own, at: Math.min(last, own.steps.length - 1), kind: "last"});
  if (top.steps.length) choices.push({label: "From the top", deck: top, at: 0, kind: "top"});
  if (line) {
    const i = top.steps.findIndex(({s, k}) => (k ? s.parts[k - 1] : s.block) === line);
    if (i >= 0) choices.push({label: "This line, in the whole talk", deck: top, at: i, kind: "whole"});
    if (from.steps.length) choices.push({label: "From this line", deck: from, at: 0, kind: "from"});
  }
  const starts = menuLine ? "from" : line ? "whole" : "top";
  const on = Math.max(0, choices.findIndex(c => c.kind === "last") >= 0
    ? choices.findIndex(c => c.kind === "last") : choices.findIndex(c => c.kind === starts));
  return {choices, on};
}
