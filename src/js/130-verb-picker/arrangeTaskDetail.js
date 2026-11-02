function arrangeTaskDetail(path, block, home, open) {
  const sheet = $("#modalRoot .modal");
  if (!sheet) return;
  Object.assign(sheet.dataset, {space: home, path, blockId: block.id});
  // Every edit in this panel is routed to its owning space, keyboard saves included.
  sheet.addEventListener("pointerdown", () => activateJournalSpace(home), true);
  sheet.addEventListener("focusin", () => activateJournalSpace(home), true);
  const header = sheet.querySelector("header");
  header.querySelector("h2")?.remove();
  header.querySelector(".hint")?.remove();
  const body = sheet.querySelector(".body > div");
  const tools = el("nav", {class: "detail-tools", "aria-label": "Task details"});
  const panes = [];
  const showOnly = (pane, btn) => {
    const open = pane.hidden;
    panes.forEach(p => { p.hidden = true; });
    tools.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", "false"));
    pane.hidden = !open;
    if (btn) btn.setAttribute("aria-pressed", String(open));
  };
  const shared = inSpace(home, () => membersNow().length >= 2);
  for (const [kind, label, labels] of DETAIL_GROUPS) {
    const pane = el("div", {class: "detail-pane"});
    pane.hidden = true;
    for (const field of [...body.children]) {
      // The date pair sits in a two-column row, so its first label names it.
      const title = field.querySelector("label")?.textContent.trim();
      if (labels.some(l => title && title.startsWith(l))) pane.append(field);
    }
    body.append(pane);
    panes.push(pane);
    const disabled = kind === "chat" && !shared;
    const btn = el("button", {class: "iconbtn", type: "button",
      title: disabled ? "Chat needs at least two people in this area" : label,
      "aria-label": label, "aria-pressed": "false", disabled, html: detailIcon(kind),
      onclick: () => showOnly(pane, btn)});
    tools.append(btn);
    if (kind === open) showOnly(pane, btn);
  }
  const more = el("div", {class: "detail-pane"},
    el("button", {class: "btn", onclick: () => openItemSpacePicker({path, space: home, id: block.id})},
      "Move to another area (Alt+S)"));
  more.hidden = true;
  body.append(more);
  panes.push(more);
  tools.append(el("button", {class: "iconbtn", title: "More", "aria-label": "More",
    html: detailIcon("more"), onclick: () => showOnly(more)}));
  header.insertBefore(tools, header.lastElementChild);
}
