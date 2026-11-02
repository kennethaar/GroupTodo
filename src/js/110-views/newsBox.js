function newsBox() {
  if (!whoAmI()) return null;
  const items = acrossSpaces(() => {
    const since = lastSeen();
    if (!since) { markSeen(); return []; }      // a brand new space has no "while you were away"
    return newsSince(since);
  }).sort((x, y) => y.at.localeCompare(x.at));
  if (!items.length) return null;
  const say = n => n.kind === "given" ? (n.who + " handed you ") : n.kind === "said" ? (n.who + " on ") : (n.who + " finished ");
  const ul = el("ul", {});
  for (const n of items.slice(0, 6))
    ul.append(el("li", {}, say(n), el("button", {onclick: () =>
      inSpace(n.space, () => openTaskDetail(n.path, n.block, n.space))}, plainTitle(n.block.title)),
      n.kind === "said" ? ": " + linkWords(n.text) : ""));
  if (items.length > 6) ul.append(el("li", {}, el("button", {onclick: openHistory}, (items.length - 6) + " more in History")));
  return el("div", {class: "news"},
    el("span", {"aria-hidden": "true"}, "●"),
    el("div", {}, el("b", {}, "Since you were last here"), ul),
    el("button", {class: "x", "aria-label": "Dismiss", title: "Dismiss. History keeps it.", onclick: () => {
      acrossSpaces(() => { markSeen(); return []; });
      render();
      notify("Dismissed. History in Journal keeps it, and everything before it.");
    }}, "✕"));
}
