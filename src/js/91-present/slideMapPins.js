/* A (map) slide's pins at a step (#488): a pin is lit with the click that
   brings it (or joins it), stays dimmed after, and is not there before. A
   travelling pin stands at the place of the latest click of its own, and
   glides there (CSS) when that changes. A card, badge or words that come
   again do the same (#488 follow-up): shifted to the latest place given,
   showing that line's words, and Alt+drag places the line it is on now.
   A picture pin's label shows the words of the line it is on, apart from the
   picture by the latest label-at:: given. */
function slideMapPins(slide, step) {
  const at = step.k - 1;
  const set = (p, st) => { for (const c of ["now", "past", "later"]) p.classList.toggle(c, c === st); };
  for (const p of slide.querySelectorAll(".mpin")) {
    if (p.dataset.run) {
      const stops = JSON.parse(p.dataset.run).filter(x => x.i <= at);
      const stop = stops[stops.length - 1];
      if (!stop) { set(p, "later"); continue; }
      p.style.left = stop.at[0] + "%"; p.style.top = stop.at[1] + "%";
      p.dataset.bid = stop.id;
      p.title = stop.name; p.setAttribute("aria-label", stop.name || "Pin");
      const label = p.querySelector(".mlabel"), it = (step.s.map || [])[stop.i];
      if (label && it) {
        if (label.dataset.lbid !== stop.id || !label.firstChild) label.replaceChildren(slideText(it.label));
        label.dataset.lbid = stop.id;
        let off = null;
        for (const x of stops) off = slideXY(slideArrOwner(step.s, "label", x.id)?.get()) || off;
        label.style.translate = off ? `${off[0]}cqw ${off[1]}cqh` : "";
      }
      set(p, stop.i === at ? "now" : "past");
      continue;
    }
    const mine = p.dataset.items.split(",").map(Number);
    set(p, mine.includes(at) ? "now" : mine.some(i => i < at) ? "past" : "later");
  }
  const items = step.s.map || [];
  for (const p of slide.querySelectorAll(".mapitems > .part[data-run]")) {
    const stops = JSON.parse(p.dataset.run).filter(x => x.i <= at);
    if (!stops.length) continue;
    // A line with no place of its own stays where the one before put it.
    let shift = null;
    for (const x of stops) shift = slideXY(slideArrOwner(step.s, "line", x.id)?.get()) || shift;
    p.style.translate = shift ? `${shift[0]}cqw ${shift[1]}cqh` : "";
    const stop = stops[stops.length - 1], it = items[stop.i];
    if (p.dataset.bid !== stop.id && it) {
      p.dataset.bid = stop.id;
      if (it.kind === "card") p.querySelector(".mlines")?.replaceWith(mapLines(it));
      else if (it.kind === "badge") p.querySelector(".mbname")?.replaceChildren(slideText({title: trim(String(it.block.title || "").replace(/!\[[^\]]*\]\([^)]*\)/g, ""))}));
      else p.replaceChildren(slideText(it.block));
    }
    set(p, stop.i === at ? "now" : "past");
  }
}
