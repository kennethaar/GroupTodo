function boardCard(a) {
  const title = el("div", {class: "bcard-title", html: estHtml(a.title) + renderInline(titleForRow(a.title))});
  const who = a.assignee ? el("span", {class: "chip who"}, "\u2192 " + a.assignee) : null;
  const whoInTitle = pillInTitle(title, who, a.assignee);
  /* The same box as the list rows, so a card is ticked off where it stands:
     a tap is done, holding is every state. */
  const tick = holdable(el("button", {
    class: "tick", data: {state: a.state || ""},
    title: a.state === "DONE" ? "Not done after all (hold for every state)" : "Done (hold for every state)",
  }, ...tickParts(a.state, a.block)), () => {
    rowSetState(a, () => setBlockState(a.path, a.block, a.state === "DONE" ? "TODO" : "DONE"));
  }, () => stateMenu(a));
  /* Reachable with Tab and opened with Enter, as a button would be: a card you
     cannot reach with Tab is a card half the people here cannot open. Not a
     button itself, since the box inside it is one. */
  const card = el("div", {
    class: "bcard", draggable: "true", role: "button", tabindex: "0",
    data: {id: a.block.id},
    // A link inside the title is the link's click, not the card's -- the same
    // rule the list rows follow, so [[go/todos]] goes to Todos.
    onclick: e => {
      if (boardPickClick(e, "task", a.block.id)) return;
      if (e.target.closest("[data-link]")) return;
      inSpace(a.space, () => openTaskDetail(a.path, a.block, a.space));
    },
    onkeydown: e => {
      if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); e.currentTarget.click(); }
    },
  },
    el("div", {class: "bcard-top"}, tick, title),
    el("div", {class: "bcard-meta"},
      multiSpace() && a.space ? spaceBadge(a.space) : null,
      a.project ? el("span", {class: "chip proj"}, a.project) : null,
      a.context ? el("span", {class: "chip ctx"}, "@" + a.context) : null,
      a.due ? el("span", {class: "chip " + (a.due < todayISO() ? "late" : a.due === todayISO() ? "today" : "")},
        humanDate(a.due)) : null,
      a.mention ? el("span", {class: "chip who"}, "to ask " + firstNameOf(a.mention)) : null,
      whoInTitle ? null : who,
      messagesOf(a.block).length ? el("span", {class: "chip msg"}, "\u25CB " + messagesOf(a.block).length) : null,
      // As on the list: only while Next is sorted by it, since the rows are shared.
      a._showUrgency && (state.view === "next" || state.view === "waiting") ? urgencyChip(a) : null));
  // A task that names two people stands in both their columns, as itself and
  // as something to ask; each card has to be told apart from the other.
  return makeCardDraggable(card, "task", {action: a}, a.block.id + (a.mention ? "~" + slugPerson(a.mention) : ""));
}
