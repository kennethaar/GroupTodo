// Steps (#433): chevrons from left to right, in the order written.
function drawSteps(s) {
  return el("div", {class: "steps"}, ...s.kids.map(b => slidePart(b, "chev", el("span", {}, slideText(b)))));
}
