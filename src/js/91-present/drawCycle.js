/* Cycle (#433): the lines round a ring, clockwise from the top, each with
   the arrow on to the next; the last one feeds the first. slideCycleFit
   widens it when the words would run into each other (#479). */
function drawCycle(s) {
  const shape = cycleShape(s.kids.length);
  return el("div", {class: "ring cycle"}, ...s.kids.map((b, i) => slidePart(b, "node",
    slideSvg("svg", {viewBox: "0 0 100 100", "aria-hidden": "true"},
      slideSvg("path", {d: shape[i].arc, class: "sline"}),
      slideSvg("path", {d: shape[i].head, class: "shead"})),
    el("span", {class: "ntext", style: `left:${shape[i].left}%;top:${shape[i].top}%`}, slideText(b)))));
}
