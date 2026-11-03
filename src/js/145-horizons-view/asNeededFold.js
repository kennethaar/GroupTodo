function asNeededFold(list) {
  const last = a => choresDone().find(d => choreKey(d.title) === choreKey(a.title));
  return el("details", {class: "section fold asneeded", open: true},
    el("summary", {}, "As needed", el("span", {class: "n"}, String(list.length))),
    el("div", {class: "card"}, ...list.map(a => {
      const l = last(a);
      return el("div", {class: "asneeded-row"},
        el("span", {class: "asneeded-t"}, choreWords(a.title)),
        el("span", {class: "asneeded-r"}, a.ctx.includes("/") ? roomLabel(a.ctx) : ""),
        el("span", {class: "asneeded-l", title: l && l.who ? "Last done by " + l.who : ""},
          l && l.day ? "done " + daysAgoText(l.day) : "not done yet"),
        el("button", {class: "btn sm didit", title: "Log it as done by you, today",
          onclick: () => logChore(choreWords(a.title), a.ctx, estTier(a.title), inSpace(a.space || V.space, whoAmI), todayISO(), a.space)}, "Did it"));
    })));
}
