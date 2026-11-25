/* A (map) slide's pins (#488), standing on the slide at their at:: (in % of
   the slide; the tip of the pin is the place). Pins of cards and badges
   that stand at the same place are one pin, named for them all; `data-items`
   says which clicks light it. A travelling pin is one element; `data-run`
   lists its places, one a click. A picture pin shows the picture and its
   line's words as a label beside it, placed apart by label-at:: (#488). */
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
      const r = runs.get(it.run), [, mark, name] = it.pic ? ["", "", it.name] : pinWords(it.block);
      r.stops.push({i, id: it.block.id, at: placeOf(it.block, r.dflt), mark, name, pic: it.pic});
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
  for (const [, r] of runs) {
    const one = r.stops[0], p = pin(one.pic ? "" : one.mark, one.at, {class: "mpin travel later" + (one.pic ? " mpic" : ""), "data-bid": one.id,
      "data-run": JSON.stringify(r.stops.map(({i, id, at, name}) => ({i, id, at, name}))), title: one.name, "aria-label": one.name});
    if (one.pic) p.append(el("img", /^(https?|data|blob):/.test(one.pic) ? {src: one.pic, alt: ""} : {"data-asset": one.pic, alt: ""}),
      el("span", {class: "mlabel", "data-lbid": one.id, "aria-hidden": "true"}));
    box.append(p);
  }
  return box;
}
