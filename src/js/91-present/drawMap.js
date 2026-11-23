/* A (map) slide's column (#488): its text lines as bullets, each card as
   its picture over its lines (the first one the name), each badge as its
   name beside a round logo. Each is a part, lit on its click. The pins are
   drawn on the slide itself (drawMapPins). */
function drawMap(s) {
  const img = src => el("img", /^(https?|data|blob):/.test(src) ? {src, alt: ""} : {"data-asset": src, alt: ""});
  const words = b => trim(String(b.title || "").replace(/!\[[^\]]*\]\([^)]*\)/g, ""));
  return el("div", {class: "mapitems"}, ...(s.map || []).map(it => {
    const b = it.block, data = {"data-bid": b.id};
    if (it.kind === "card") return el("div", {class: "mcard part", ...data}, img(slidePicture(b.title)),
      el("div", {class: "mlines"}, ...it.lines.map((l, i) => el("div", {class: i ? "mline" : "mname"}, slideText(l)))));
    if (it.kind === "badge") return el("div", {class: "mbadge part", ...data},
      el("span", {class: "mbname"}, slideText({title: words(b)})), img(slidePicture(b.title)));
    if (it.kind === "pin") return el("span", {class: "mstep part", ...data, "aria-hidden": "true"});
    return el("div", {class: "mtext part", ...data}, slideText(b));
  }));
}
