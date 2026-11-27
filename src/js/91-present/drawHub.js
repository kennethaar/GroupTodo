/* Hub and spoke (#433): the title in a circle in the middle, the lines round
   it. A spoke's own lines are a card right of the hub, one card in one place,
   shown while that spoke is lit (slideBullets), so nothing moves. */
function drawHub(s) {
  const n = s.kids.length, r = 36;
  const ring = el("div", {class: "ring hub"}, el("div", {class: "hubcore"}, s.title), ...s.kids.map((b, i) => {
    const a = i / n * 2 * Math.PI - Math.PI / 2, c = Math.cos(a), sn = Math.sin(a);
    return slidePart(b, "node",
      slideSvg("svg", {viewBox: "0 0 100 100", "aria-hidden": "true"},
        slideSvg("line", {x1: 50 + 15 * c, y1: 50 + 15 * sn, x2: 50 + r * c, y2: 50 + r * sn, class: "sline"})),
      el("span", {class: "ntext", data: {c, s: sn}, style: `left:${50 + r * c}%;top:${50 + r * sn}%`}, slideText(b)));
  }));
  const own = b => (b.children || []).filter(k => slideWords(k) && !slideHidden(k));
  const cards = s.kids.filter(b => own(b).length).map(b => el("div", {class: "card hubcard", "data-bid": b.id},
    el("div", {class: "phead"}, slideText(b)), el("ul", {}, ...own(b).map(k => el("li", {"data-bid": k.id}, slideText(k))))));
  return cards.length ? el("div", {class: "hubwrap"}, ring, el("div", {class: "hubcards"}, ...cards)) : ring;
}
