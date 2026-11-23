/* A (map) slide's pins at a step (#488): a pin is lit with the click that
   brings it (or joins it), stays dimmed after, and is not there before. A
   travelling pin stands at the place of the latest click of its own, and
   glides there (CSS) when that changes. */
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
      set(p, stop.i === at ? "now" : "past");
      continue;
    }
    const mine = p.dataset.items.split(",").map(Number);
    set(p, mine.includes(at) ? "now" : mine.some(i => i < at) ? "past" : "later");
  }
}
