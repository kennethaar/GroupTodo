function remindMeeting(m) {
  // A day or more ahead says the day; nearer, how long until.
  const lead = m.start - Date.now() >= 12 * 36e5
    ? "on " + new Date(m.start).toLocaleDateString(undefined, {weekday: "long", day: "numeric", month: "short"}) + " at " + hhmm(m.start)
    : untilWords(m.start - Date.now());
  const who = trim(blockProp(m.block, "attendees") || "");
  const body = hhmm(m.start) + "–" + hhmm(m.end) + (who ? " · " + linkWords(who) : "");
  const t = el("div", {class: "toast reminder meetrem", role: "alert"},
    el("strong", {}, "\u{1F552} " + m.title + " " + (lead === "now" ? "starts now" : lead)),
    el("p", {}, body));
  const close = () => t.remove();
  t.append(el("div", {class: "acts"},
    el("button", {class: "btn sm primary", onclick: () => { close(); openBlockAt(m.space, m.path, m.block); }}, "Open"),
    el("button", {class: "btn sm ghost", onclick: close}, "OK")));
  $("#toasts").append(t);
  // Gone once the meeting is over, in case nobody was there to see it.
  setTimeout(close, Math.max(6e4, m.end - Date.now()));
  try {
    if (window.Notification?.permission === "granted") {
      const n = new Notification(m.title + " " + (lead === "now" ? "starts now" : lead), {body, tag: "gtd-meet-" + calHash(m.key), icon: "icon.svg"});
      n.onclick = () => { window.focus(); n.close(); close(); openBlockAt(m.space, m.path, m.block); };
    }
  } catch (_) {}
}
