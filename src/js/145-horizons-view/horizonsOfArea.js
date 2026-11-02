/* One area's own ladder, from its purpose (or the mission it inherits) down. */
function horizonsOfArea(name) {
  const c = el("div", {class: "wrap"});
  c.append(vhead("Horizons", null,
    el("button", {class: "textbtn push", onclick: () => go("horizons", {horizonArea: null})}, "‹ All areas")));
  c.append(el("div", {class: "areahead"}, spaceBadge(name, true),
    el("span", {class: "sub"}, inSpace(name, () => horizonProfile().label))));
  const inner = inSpace(name, () => {
    HORIZON_SINGLE_SPACE = true;
    try { return viewHorizons(); } finally { HORIZON_SINGLE_SPACE = false; }
  });
  while (inner.firstChild) c.append(inner.firstChild);
  return c;
}
