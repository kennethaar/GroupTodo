/* The areas one calendar's meetings also show in. Your own area is left out:
   they show there anyway. Only an area with other people asks first. */
function drawCalendarSharing(url, chosen = null) {
  const f = calFeeds().find(x => x.url === url);
  if (!f) return drawCalendars();
  const name = f.label || calHost(f.url);
  const have = calAlso(f), want = new Set(chosen || have);
  const targets = Spaces.list.map(s => s.name).filter(n => LOADED.has(n) && n !== calHome());
  const ticks = targets.map(n => el("label", {class: "calpick"},
    el("input", {type: "checkbox", checked: want.has(n) ? "" : null, onchange: e => { e.target.checked ? want.add(n) : want.delete(n); }}), n));
  const apply = () => {
    const say = [];
    for (const n of targets) if (want.has(n) !== have.includes(n)) say.push(calSetAlso(url, n, want.has(n)));
    clearMemo(); flush(); render();
    if (say.length) notify(say.join(" "));
    drawCalendarSettings(url);
  };
  const save = () => {
    const risky = targets.filter(n => want.has(n) && !have.includes(n) && calAreaShared(n));
    if (!risky.length) return apply();
    const who = risky.join(", ");
    calScreen({
      title: "Share with " + who + "?",
      body: el("p", {style: "padding:0 16px;margin:6px 0"}, "People in " + who + " can see these meetings, including attendees and agendas."),
      foot: [el("button", {class: "btn ghost", onclick: () => drawCalendarSharing(url, [...want])}, "Cancel"),
        el("button", {class: "btn primary", onclick: apply}, "Share")],
    });
  };
  return calScreen({
    title: "Show meetings in", back: name, backTo: () => drawCalendarSettings(url),
    body: targets.length ? el("div", {style: "padding:4px 16px"}, ...ticks)
      : el("p", {class: "hint", style: "text-align:left;padding:0 16px"}, "No other areas."),
    foot: targets.length ? [el("button", {class: "btn ghost", onclick: () => drawCalendarSettings(url)}, "Cancel"),
      el("button", {class: "btn primary", onclick: save}, "Save")] : null,
  });
}
