/* A (map) slide's column (#488): its text lines as bullets, each card as
   its picture over its lines (the first one the name), each badge as its
   name beside a round logo. Each is a part, lit on its click. The pins are
   drawn on the slide itself (drawMapPins). The same card, badge or words
   again is no new part: its first one carries `data-run`, the clicks that
   move it on (slideMapPins), and the click keeps a place of its own. */
function drawMap(s) {
  const items = s.map || [];
  const img = src => el("img", /^(https?|data|blob):/.test(src) ? {src, alt: ""} : {"data-asset": src, alt: ""});
  const words = b => trim(String(b.title || "").replace(/!\[[^\]]*\]\([^)]*\)/g, ""));
  return el("div", {class: "mapitems"}, ...items.map((it, i) => {
    const b = it.block, data = {"data-bid": b.id};
    if (it.kind === "pin" || it.lead !== i) return el("span", {class: "mstep part", ...data, "aria-hidden": "true"});
    const stops = items.map((x, j) => x.lead === i ? {i: j, id: x.block.id} : null).filter(Boolean);
    if (stops.length > 1) data["data-run"] = JSON.stringify(stops);
    if (it.kind === "card") return el("div", {class: "mcard part", ...data}, img(slidePicture(b.title)), mapLines(it));
    if (it.kind === "badge") return el("div", {class: "mbadge part", ...data},
      el("span", {class: "mbname"}, slideText({title: words(b)})), img(slidePicture(b.title)));
    return el("div", {class: "mtext part", ...data}, slideText(b));
  }));
}
