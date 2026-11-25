// A map card's lines under its picture, the first one its name (#488).
function mapLines(it) {
  return el("div", {class: "mlines"}, ...it.lines.map((l, i) => el("div", {class: i ? "mline" : "mname"}, slideText(l))));
}
