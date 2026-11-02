/* The score orders the list; the number itself is for the curious, so it
   shows when you point at the row. */
function urgencyChip(a) {
  const parts = urgencyParts(a);
  return el("span", {class: "chip urg when onhover", title: "Urgency " + urgencyOf(a) + (parts.length ? ":\n" +
    parts.map(([why, n]) => (n > 0 ? "+" : "") + n + "  " + why).join("\n") : "")},
    "↑" + urgencyOf(a));
}
