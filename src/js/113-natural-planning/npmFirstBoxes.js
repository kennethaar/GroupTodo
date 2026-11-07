/* The other loose actions round the one on the card. A box that would make a loop is off. */
function npmFirstBoxes(cur, loose) {
  const boxes = new Map();
  loose.filter(x => x !== cur).slice(0, NPM_FIRST_KEYS.length).forEach((x, n) => {
    const off = npmLoops(cur.key, x.key, loose);
    const kids = loose.filter(y => npmParent(y.key, loose) === x.key).length;
    boxes.set(NPM_FIRST_KEYS[n], {lbl: "Before", t: trim(x.act.text), to: x.key, off,
      s: off ? "Comes before this one already" : kids ? "Waits for " + kids + " already" : "Waits for it"});
  });
  boxes.set("6", {lbl: "Nothing", t: "Nothing waits for it", s: "It stands on its own", to: ""});
  return boxes;
}
