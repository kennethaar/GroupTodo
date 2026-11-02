/* The deck still to play, and beside it what this pass has done with. The
   status pass sorts onto the table's own stacks, so it needs no done pile. */
/* big: the deck as it lies on the table, a full-size card like the rest;
   otherwise the small one in the side column, for a phone. */
function solDecks(pass, big = false) {
  const left = SOL.order ? Math.max(0, SOL.order.length - SOL.i - 1) : 0;
  const done = solDeckAns().filter(a => a["p" + pass]).length;
  const open = cls => cls === "donepile" ? {role: "button", tabindex: "0", title: "See the last ones reviewed, and go back to one",
    style: "cursor:pointer", onclick: () => solDoneList(pass),
    onkeydown: e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); solDoneList(pass); } }} : {};
  const pile = (cls, n, word, fill) => el("div", {class: "soldeckpile", ...open(cls)},
    el("div", {class: "soldeckcard " + cls, style: "box-shadow:" + (solEdges(n, fill) || "none")},
      el("b", {}, String(n)), big ? el("span", {}, word) : null),
    big ? null : el("span", {}, word));
  return el("div", {class: "soldecks" + (big ? " big" : "")},
    pile("deck", left, left === 1 ? "card still to sort" : "cards still to sort", "var(--accent-soft)"),
    pass ? pile("donepile", done, "reviewed") : null);
}
