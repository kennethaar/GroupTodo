/* Month columns across the top, and the faint lines under them that make a bar
   readable as "ends in March" rather than "ends somewhere over there". */
function ganttHeader(from, to, pct) {
  const head = el("div", {class: "ghead"}, el("div", {class: "glabel ghcol"}, "Project"));
  const track = el("div", {class: "gtrack"});
  let m = from.slice(0, 7) + "-01";
  if (m < from) m = addMonths(m, 1);
  // The year on the first month and on every January, so "Feb" is never a guess.
  for (let first = true; m <= to; m = addMonths(m, 1), first = false) {
    const left = pct(m);
    track.append(el("div", {class: "gtick", style: "left:" + left + "%"}));
    track.append(el("div", {class: "gmon", style: "left:" + left + "%"},
      new Date(m + "T00:00:00Z").toLocaleDateString(undefined,
        {month: "short", year: first || m.slice(5, 7) === "01" ? "numeric" : undefined, timeZone: "UTC"})));
  }
  /* The line through every row is today, and says so once, here. Near an edge
     the badge hangs inwards instead of being half cut off. */
  const today = todayISO();
  if (today >= from && today <= to) {
    const at = pct(today);
    track.append(el("div", {class: "gtoday" + (at < 8 ? " l" : at > 92 ? " r" : ""),
      style: "left:" + at + "%", title: dateIn(today)},
      "Today · " + new Date(today + "T00:00:00Z").toLocaleDateString(undefined,
        {month: "short", day: "numeric", timeZone: "UTC"})));
  }
  head.append(track);
  return head;
}
