function viewChat() {
  const c = el("div", {class: "wrap"});
  c.append(vhead("Chat", "Every conversation, in every area you are showing"));
  const threads = allThreads();
  const mode = state.chatFilter || "all";
  const shown = threads.filter(t =>
    mode === "unread" ? t.unread : mode === "flagged" ? t.flagged : true);

  const bar = el("div", {class: "statefilter"});
  for (const [key, label] of CHAT_FILTERS) {
    const n = key === "unread" ? threads.filter(t => t.unread).length
            : key === "flagged" ? threads.filter(t => t.flagged).length
            : threads.length;
    bar.append(el("button", {class: "chip filter" + (mode === key ? " on" : ""),
      onclick: () => go("chat", {chatFilter: key})},
      (mode === key ? "\u2713 " : "") + label + " " + n));
  }
  c.append(el("div", {class: "section"}, bar));

  if (!shown.length) {
    c.append(section("Chat", 0, emptyCard(
      mode === "flagged" ? "Nothing flagged. The \u2691 on a message keeps it here."
      : mode === "unread" ? "Nothing unread."
      : "No conversations yet. Open a task and say something - everyone in that area sees it.")));
    return c;
  }

  // Clicking a row lands on the task, not merely the page it sits in.
  const chatRow = t => el("button", {class: "chatrow" + (t.unread ? " unread" : ""),
      onclick: () => inSpace(t.space, () => openTaskDetail(t.path, t.block, t.space))},
      avatarNode(msgAuthor(t.last), 34),
      el("div", {class: "chatrow-main"},
        el("div", {class: "chatrow-top"},
          el("span", {class: "task"}, titleForRow(t.block.title)),
          multiSpace() && t.space ? spaceBadge(t.space) : null,
          el("span", {class: "when"}, chatTime(t.at))),
        el("div", {class: "chatrow-last"},
          el("span", {class: "who"}, (samePerson(msgAuthor(t.last), whoAmI()) ? "You" : msgAuthor(t.last)) + ": "),
          linkWords(t.last.title)),
        el("div", {class: "chatrow-where"}, t.where)),
      el("div", {class: "chatrow-marks"},
        t.unread ? el("span", {class: "chip msg b unread"}, t.unread + " new") : null,
        t.flagged ? el("span", {class: "chip flagged"}, "\u2691 " + t.flagged) : null));
  c.append(section(mode === "all" ? "Conversations" : CHAT_FILTERS.find(f => f[0] === mode)[1],
                   shown.length, pagedCard(shown, chatRow)));
  return c;
}
