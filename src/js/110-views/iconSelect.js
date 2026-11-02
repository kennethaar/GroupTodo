/* A dropdown drawn as just its icon: the select lies invisibly over the icon,
   so pressing it opens the same native list, a phone's own picker included. */
function iconSelect(icon, label, value, options, onchange) {
  const s = fselect(label, value, options, onchange);
  const now = options.find(([v]) => v === value);
  return el("span", {class: "iconsel", title: label + (now ? ": " + now[1] : "")}, el("span", {"aria-hidden": "true"}, icon), s);
}
