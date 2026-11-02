/* On a project's page: how much time it has had, the last eight weeks as
   bars, and who put it in. Only once somebody has been there. */
function projectTimeSection(path) {
  const name = baseName(path).toLowerCase(), title = pageTitle(path).toLowerCase();
  const rows = timeLogEntries().filter(e => e.space === V.space &&
    [name, title].includes(e.project.toLowerCase()));
  if (!rows.length) return null;
  const monday = weekStartISO(todayISO());
  const weekSum = from => rows.filter(e => e.date >= from && e.date <= shiftISO(from, 6)).reduce((s, e) => s + timeLogMin(e), 0);
  const total = rows.reduce((s, e) => s + timeLogMin(e), 0);
  const weeks = Array.from({length: 8}, (_, i) => shiftISO(monday, -7 * (7 - i)));
  const sums = weeks.map(weekSum), top = Math.max(...sums, 1);
  /* Every week with time says how much, in the same h and m as the total. */
  const bars = el("div", {class: "hbars", role: "img",
    "aria-label": "Hours per week, last 8 weeks: " + weeks.map((w, i) => "week " + isoWeek(w)[0] + " " + (fmtMinutes(sums[i]) || "0 m")).join(", ")},
    ...weeks.map((w, i) => el("div", {class: "hbar" + (i === 7 ? " now" : ""), title: weekLabel(w) + ": " + (fmtMinutes(sums[i]) || "0 m")},
      el("span", {class: "v"}, fmtMinutes(sums[i] || null)),
      el("i", {style: "height:" + Math.round(sums[i] / top * 100) + "%"}),
      // The week we are in is named, so nobody has to know its number.
      el("span", {class: "w"}, "W" + isoWeek(w)[0] + (i === 7 ? " (now)" : "")))));
  const byWho = new Map();
  for (const e of rows) byWho.set(e.who || "Nobody named", (byWho.get(e.who || "Nobody named") || 0) + timeLogMin(e));
  // One person needs only the name; several, each with their share.
  const who = [...byWho.entries()].sort((a, b) => b[1] - a[1]);
  const people = who.map(([k, m]) => el("span", {}, " · " + k + (who.length > 1 ? " " + fmtMinutes(m) : "")));
  const visits = rows.length + (rows.length === 1 ? " visit" : " visits");
  return section("Time on site", null, el("div", {class: "card sitetime"},
    el("div", {class: "st-top"},
      el("div", {},
        el("div", {class: "st-total"}, fmtMinutes(total) || "0 m", el("span", {}, " total")),
        el("div", {class: "st-who", translate: "no"}, visits, ...people)),
      el("span", {class: "st-acts"},
        el("button", {class: "btn sm primary", onclick: () => openTimeForm(null, null, {project: pageTitle(path)})}, "Check in"),
        el("button", {class: "btn sm ghost", onclick: () => go("projects", {sub: "hours", hoursBy: "person", hoursRange: "13"})}, "All hours"))),
    bars));
}
