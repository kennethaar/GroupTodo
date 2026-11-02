/* The close-up of one room: the same facts, each with its label. */
function roomCloseup(name, s, held) {
  const pct = s.pct ?? 100;
  const row = (label, ...v) => el("div", {class: "closeup-r"}, el("span", {class: "closeup-k"}, label),
    el("span", {class: "closeup-v"}, ...v));
  const t = a => titleForRow(a.title);
  const st = s.stalest, sr = st ? choreRounds(st) : 0;
  return el("div", {class: "card chorecloseup"},
    el("div", {class: "chorehome-h"}, el("span", {}, name), el("div", {style: "flex:1"}),
      el("strong", {style: "color:" + freshColor(pct)}, s.pct == null ? "–" : s.pct + "% fresh")),
    el("span", {class: "freshbar"}, el("i", {style: "width:" + pct + "%;background:" + freshColor(pct)})),
    el("div", {class: "closeup-n"}, ...[["Chores", s.n], ["Due now", s.by.due.length],
      ["Coming up this week", s.by.soon.length], ["Fresh", s.by.fresh.length]].map(([k, v]) =>
      el("span", {}, el("span", {class: "closeup-k"}, k), " ", el("b", {}, String(v))))),
    row("Time due now", dueTimeText(s) + (s.by.due.length ? " (" + s.by.due.length + " due, " + s.sized + " sized)" : "")),
    row("Stalest", ...(st ? [t(st), " · " + sr.toFixed(1) + " rounds",
      sr >= 1.5 ? el("span", {class: "chip late", style: "margin-left:6px"}, "late") : null] : ["none"])),
    row("Next up", ...(s.next ? [t(s.next), " · " + (s.next.due ? humanDate(s.next.due) : "no date"),
      s.who ? " · " + s.who + "’s turn" : ""] : ["none"])),
    row("Last done", ...(s.last ? [titleForRow(s.last.title), " · " + (s.last.day ? humanDate(s.last.day) : "no date"),
      s.last.who ? " · by " + s.last.who : ""] : ["none yet"])),
    row("On hold", held.length ? String(held.length) : "none"));
}
