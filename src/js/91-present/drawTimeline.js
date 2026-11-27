// Timeline (#433): a dot per line on one axis, the words above and below by turns.
function drawTimeline(s) {
  return el("div", {class: "timeline"}, ...s.kids.map((b, i) =>
    slidePart(b, i % 2 ? "down" : "up", el("span", {class: "tdot"}), el("span", {class: "ttext"}, slideText(b)))));
}
