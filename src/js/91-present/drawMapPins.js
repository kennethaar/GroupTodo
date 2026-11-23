/* A (map) slide's pins (#488), standing on the slide at their at:: (in % of
   the slide; the tip of the pin is the place). Pins of cards and badges
   that stand at the same place are one pin, named for them all; `data-items`
   says which clicks light it. A travelling pin is one element; `data-run`
   lists its places, one a click. */
function drawMapPins(s) {
  const items = s.map || [];
  let n = 0;
  const fresh = () => { const i = n++; return [50 + (i % SLIDE_PIN_ROW) * 5, 45 + Math.floor(i / SLIDE_PIN_ROW) * 8]; };
  const placeOf = (b, dflt) => slideXY(blockProp(b, "at")) || dflt;
  const pinWords = b => SLIDE_PIN_RE.exec(trim(slideWords(b))) || ["", "📍", ""];
  const box = el("div", {class: "mpins"});
  const stands = [];
  const runs = new Map();
  items.forEach((it, i) => {
    if (it.kind === "pin") {
      if (!runs.has(it.run)) runs.set(it.run, {dflt: fresh(), stops: []});
      const r = runs.get(it.run), [, mark, name] = pinWords(it.block);
      r.stops.push({i, id: it.block.id, at: placeOf(it.block, r.dflt), mark, name});
      return;
    }
    for (const p of it.pins) {
      const [, mark, name] = pinWords(p), at = placeOf(p, fresh());
      const label = [it.name, name].filter(Boolean).join(" · ");
      const same = stands.find(x => x.mark === mark && Math.hypot(x.at[0] - at[0], x.at[1] - at[1]) < SLIDE_PIN_SAME);
      if (same) { same.items.push(i); same.names.push(label); }
      else stands.push({id: p.id, at, mark, items: [i], names: [label]});
    }
  });
  const pin = (mark, at, attrs) => el("span", {class: "mpin later", role: "img", style: `left:${at[0]}%;top:${at[1]}%`, ...attrs}, mark);
  for (const x of stands) box.append(pin(x.mark, x.at, {"data-bid": x.id, "data-items": x.items.join(","),
    title: x.names.join("\n"), "aria-label": x.names.join(", ")}));
  for (const [, r] of runs) box.append(pin(r.stops[0].mark, r.stops[0].at, {class: "mpin travel later", "data-bid": r.stops[0].id,
    "data-run": JSON.stringify(r.stops.map(({i, id, at, name}) => ({i, id, at, name}))), title: r.stops[0].name, "aria-label": r.stops[0].name}));
  return box;
}
