function choreBoard() {
  const last = PREF.get("chores.board", "") === "last";
  const mon = weekStartISO(todayISO());
  const from = last ? shiftISO(mon, -7) : mon, to = last ? shiftISO(mon, -1) : todayISO();
  const rows = choreTally(from, to);
  const most = Math.max(1, ...rows.map(([, t]) => t.pts));
  const flip = v => { PREF.set("chores.board", v); render(); };
  return el("div", {class: "section choreboard"},
    el("h3", {}, "Points", el("span", {class: "say", style: "margin-left:8px;font-weight:400"},
      "15 minutes of chores is a point")),
    fbar(fchip("This week", !last, () => flip("")), fchip("Last week", last, () => flip("last"))),
    rows.length ? el("div", {class: "card"}, ...rows.map(([name, t], i) => el("div", {class: "reportsum choreboard-row"},
      el("span", {class: "choreboard-at"}, i === 0 ? "🏆" : String(i + 1)),
      el("span", {class: "choreboard-who"}, name),
      el("span", {class: "freshbar"}, el("i", {style: "width:" + Math.round(t.pts / most * 100) + "%"})),
      el("span", {class: "say"}, t.pts + (t.pts === 1 ? " point · " : " points · ") + t.n + " done"))))
      : emptyCard(last ? "No chores were ticked off last week." : "No chores ticked off yet this week."));
}
