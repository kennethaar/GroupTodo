// Hub and spoke (#433): the title in a circle in the middle, the lines round it.
function drawHub(s) {
  const n = s.kids.length, r = 36;
  return el("div", {class: "ring hub"}, el("div", {class: "hubcore"}, s.title), ...s.kids.map((b, i) => {
    const a = i / n * 2 * Math.PI - Math.PI / 2, c = Math.cos(a), sn = Math.sin(a);
    return slidePart(b, "node",
      slideSvg("svg", {viewBox: "0 0 100 100", "aria-hidden": "true"},
        slideSvg("line", {x1: 50 + 15 * c, y1: 50 + 15 * sn, x2: 50 + r * c, y2: 50 + r * sn, class: "sline"})),
      el("span", {class: "ntext", style: `left:${50 + r * c}%;top:${50 + r * sn}%`}, slideWords(b)));
  }));
}
