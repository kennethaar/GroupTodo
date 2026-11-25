/* The Slide layout menu (#433): every layout with the mark it writes, the
   one the marks give now (`now`, null for none) ticked. The line tools and
   the bar under picked lines both open it; onPick gets the layout. */
function slideMenuPop(now, onPick, owned = true) {
  now = now || "auto";
  const pop = el("div", {class: "ebpop ebsub", role: "menu", "aria-label": "Slide layout"});
  for (const [lay, name, mark] of SLIDE_MENU) {
    // A layout word (Map) goes on the slide's own line: only offered when there is one (#488).
    if (!owned && /^\(\p{L}+\)$/u.test(mark)) continue;
    const on = lay === now || (lay === "split" && now === "quadrant");
    pop.append(el("button", {
      class: "ebtn", tabindex: "-1", role: "menuitemradio", "aria-checked": String(on), data: {lay},
      onclick: () => onPick(lay),
    }, el("span", {class: "ebcheck", "aria-hidden": "true"}, on ? "✓" : ""), el("span", {class: "elb"}, name),
      el("span", {class: "ebmark", "aria-hidden": "true"}, mark)));
  }
  return pop;
}
