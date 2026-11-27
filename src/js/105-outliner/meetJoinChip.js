/* A meeting's Join link (join::, #480). It stands out from 5 minutes before
   the meeting until it ends; at other times it is quiet and shows on hover or
   when the line has focus (.soon, kept current by paintJoinChips). */
function meetJoinChip(b, path) {
  const url = trim(blockProp(b, "join") || "");
  if (!/^https:\/\//i.test(url)) return null;
  const a = el("a", {class: "chip join", href: url, target: "_blank", rel: "noopener noreferrer",
    title: "Join the online meeting",
    onmousedown: e => e.stopPropagation(), onclick: e => e.stopPropagation()},
    svgIcon(ICON_PLAY), " Join");
  const day = blockProp(b, "date") ? dateIn(blockProp(b, "date")) : path && dayOfPath(path);
  const clock = meetingClock(b);
  if (day && clock) {
    const d = parseISO(day);
    const at = mins => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, mins).getTime();
    a.dataset.from = at(clock.start) - 5 * 6e4;
    a.dataset.to = clock.end != null ? at(clock.end) : at(clock.start) + 30 * 6e4;
    paintJoinChips([a]);
  }
  return a;
}
