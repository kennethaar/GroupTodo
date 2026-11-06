/* A line's ↻ chip, which opens its Repeats dialog. */
function repeatPill(path, block) {
  const open = e => { e.stopPropagation(); e.preventDefault(); openLineRepeat(path, block); };
  const pill = el("span", {class: "chip b reppill", tabindex: "0", role: "button", title: "Change how often it repeats",
    onclick: open, onkeydown: e => { if (e.key === "Enter" || e.key === " ") open(e); }},
    svgIcon(ICON_REPEAT), " " + repeatOf(block));
  // A press on it is not a press on the line, which would start editing it.
  pill.addEventListener("mousedown", e => e.stopPropagation());
  return pill;
}
