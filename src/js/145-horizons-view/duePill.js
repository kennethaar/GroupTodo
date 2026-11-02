/* The pill itself, on a line and in a list alike, so the two cannot disagree. */
function duePill(a, cls, words) {
  const r = remindInfo(a.block);
  const pill = el("span", {class: "chip b duepill " + cls, tabindex: "0", role: "button",
    title: (r ? r.title + " · " : "") + "Change the time, the reminder, or clear it",
    onclick: e => { e.stopPropagation(); e.preventDefault(); openDueChipMenu(a, pill); },
    onkeydown: e => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); e.preventDefault(); openDueChipMenu(a, pill); } }},
    words, r ? el("span", {class: "bell" + (r.off ? " off" : "")}, r.off ? "\u{1F515}" : "\u{1F514}") : null);
  // A press on it is not a press on the line, which would start editing it.
  pill.addEventListener("mousedown", e => e.stopPropagation());
  return pill;
}
