function openHistory(days = 90) {
  const rows = acrossSpaces(() => activityHere(shiftISO(todayISO(), -days)))
    .sort((a, b) => String(b.at).localeCompare(String(a.at)));
  const byDay = new Map();
  for (const r of rows) { if (!byDay.has(r.day)) byDay.set(r.day, []); byDay.get(r.day).push(r); }
  const mark = {done: "✓", added: "+", said: "○"};
  const body = el("div", {});
  body.append(el("div", {class: "field", style: "color:var(--fg2);font-size:13.5px"},
    "Everything that happened in the areas you are showing, newest first."));
  for (const [day, list] of byDay) {
    body.append(section(chatDayLabel(day), list.length, pagedCard(list, r => el("button", {class: "dash-item",
      onclick: () => { closeModal(); inSpace(r.space, () => openTaskDetail(r.path, r.block, r.space)); }},
      el("span", {class: "ricon " + r.kind}, mark[r.kind]),
      el("span", {style: "flex:1;min-width:0", translate: "no", html: renderInline(r.kind === "said"
        ? (r.who ? r.who + " on “" + plainTitle(r.block.title) + "”: " : "") + r.text
        : titleForRow(r.text))}),
      r.decided ? el("span", {class: "chip"}, r.decided) : null,
      spaceTag(r.space),
      r.who && r.kind !== "said" ? el("span", {class: "chip who"}, r.who) : null), "", 25)));
  }
  if (!byDay.size) body.append(el("div", {class: "empty"}, "Nothing has happened yet."));
  body.append(el("div", {style: "padding:12px 16px"},
    el("button", {class: "btn sm ghost", onclick: () => openHistory(days * 4)}, "Go further back")));
  drawer({title: "History", hint: "the last " + days + " days", body});
}
