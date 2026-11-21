/* What the slide preview can show (#465), in this order: the slide you left
   last time, the page's talk from the top, a line where it comes in that
   talk, and the talk from that line. ▶ Present's line is the one you were
   in, or the line you focused on (🔍); ☰ › Present from here's (`menuLine`)
   is its own. A line off the slides (a task, a "_ " line, a line drawn in a
   box) comes in where the nearest line above it that is shown does. `on` is
   the one shown first: last time, else where the button starts. */
function slidePeekChoices(path, root = null, menuLine = null) {
  const top = deckSteps(path);
  // By id: the page may have been read again since the button was drawn.
  const within = (b, r, up = 0) => !r || (!!b && up < 50 && (b.id === r.id || within(b._parent, r, up + 1)));
  let line = menuLine;
  if (!line && SLIDE_LINE) {
    walkBlocks(getPage(path)?.blocks || [], b => { if (b.id === SLIDE_LINE) line = b; });
    if (line && !within(line, root)) line = null;
  }
  if (!line) line = root;
  const from = line ? deckSteps(path, line, true) : null;
  // The talk the button presents: from the menu's line, the focused line, or the page.
  const own = menuLine ? from : root ? deckSteps(path, root) : top;
  const choices = [];
  const last = slideLast(path, menuLine || root);
  if (last >= 0 && own.steps.length) choices.push({label: `Last time: slide ${own.steps[Math.min(last, own.steps.length - 1)].s.n} of ${own.slides.length}`,
    deck: own, at: Math.min(last, own.steps.length - 1), kind: "last",
    start: menuLine ? {root: menuLine, on: true} : {root}});
  if (top.steps.length) choices.push({label: "From the top", deck: top, at: 0, kind: "top", start: {}});
  if (line) {
    let i = -1;
    for (let b = line, up = 0; b && i < 0 && up < 50; b = b._parent, up++)
      i = top.steps.findIndex(({s, k}) => (k ? s.parts[k - 1] : s.block)?.id === b.id);
    if (top.steps.length) choices.push({label: "This line, in the whole talk", deck: top, at: Math.max(0, i), kind: "whole", start: {}});
    if (from.steps.length) choices.push({label: "From this line", deck: from, at: 0, kind: "from", start: {root: line, on: true}});
  }
  // ▶ Present starts at the line you are in; on the focused line itself, that is its own talk.
  const starts = menuLine || (root && line === root) ? "from" : line ? "whole" : "top";
  const at = kind => choices.findIndex(c => c.kind === kind);
  return {choices, on: Math.max(0, at("last") >= 0 ? at("last") : at(starts))};
}
