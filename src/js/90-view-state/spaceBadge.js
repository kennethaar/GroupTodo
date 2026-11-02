/* ---------- which space a thing lives in ---------- */
function spaceBadge(name, big) {
  if (!Spaces.get(name)) return null;
  return el("span", {class: "sp" + (big ? " lg" : ""), style: "--sc:" + spaceColor(name),
    title: "Lives in the " + name + " area"}, name);
}
