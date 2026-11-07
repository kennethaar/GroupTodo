function taskRow(a, opts) {
  // A list in the Journal draws its rows the Journal's way (#160).
  const jr = !!(opts && opts.journal);
  // An action shown from another space must be edited IN that space, or the
  // change would be written through the active space's backend.
  const title = el("div", {class: "t-title", html: estHtml(a.title) + renderInline(titleForLine(a.title))});
  let chips = chipsFor(a, jr ? opts : {}).filter(c => !(c.classList.contains("asg") && pillInTitle(title, c, a.assignee)));
  /* The context stands in front of the words, everywhere, and the words keep
     it where it was written (#315). In the Journal the project is the line
     above. Each is the same chip as before, so a click on it does what it did. */
  let lead = null, eyebrow = null;
  // A chore written on its room's own page: the room is said once, by its pill (#209).
  if (opts && (opts.nextNow || jr) && a.context && a.projectPath === contextPath(a.context))
    chips = chips.filter(c => !c.classList.contains("proj"));
  if (jr) {
    const ctx = chips.find(c => c.classList.contains("ctx"));
    // Grouped by context, the group's head says it (#209).
    if (ctx && !opts.grouped) lead = ctx;
    eyebrow = chips.find(c => c.classList.contains("proj")) || null;
    if (eyebrow) {
      eyebrow.className = "t-eyebrow";
      eyebrow.tabIndex = 0;
      eyebrow.setAttribute("role", "button");
      eyebrow.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); openProjectChipMenu(a); }
      });
    }
    chips = chips.filter(c => !c.classList.contains("ctx") && c !== eyebrow);
  }
  else {
    const ctx = chips.find(c => c.classList.contains("ctx"));
    if (ctx) { title.prepend(ctx); chips = chips.filter(c => c !== ctx); }
  }
  // The Journal's columns already say the area.
  const pills = [!jr && multiSpace() && a.space ? spaceBadge(a.space) : null, ...chips.filter(c => !c.classList.contains("when"))].filter(Boolean);
  const info = chips.filter(c => c.classList.contains("when"));
  const linger = a.state === "WAIT" && LINGER.get(a.block.id);
  if (linger) info.unshift(el("span", {class: "chip linger", data: {until: String(linger.until)}},
    el("span", {class: "secs"}, lingerSays(linger.until)),
    el("button", {class: "textbtn", onclick: e => { e.stopPropagation();
      LINGER.delete(a.block.id);
      inSpace(a.space, () => setBlockState(a.path, a.block, linger.was)); render(); }}, "Undo")));
  const row = el("div", {
    class: "task" + (jr ? " jrow" + (lead ? "" : " noctx") : "") + (state.selected === a.block.id ? " sel" : ""),
    data: {state: a.state || "", id: a.block.id, space: a.space || V.space, path: a.path},
    // A link inside the title is the link's click, not the row's: pressing
    // [[go/todos]] has to go to Todos rather than open the action panel on top
    // of it. The delegated handler on #content does the following.
    onclick: e => {
      if (e.target.closest("[data-link]")) return;
      inSpace(a.space, () => openTaskDetail(a.path, a.block, a.space));
    },
  });
  /* The same box as on the day page, its word always inside: whether a row
     is a plain to do or a stage of a task type is the first thing to read. */
  const chk = el("div", {class: "t-chk"},
    holdable(el("button", {
      class: "tick", data: {state: a.state || ""},
      title: a.state === "DONE" ? "Not done after all (hold for every state)" : "Done (hold for every state)",
    }, ...tickParts(a.state, a.block)), () => {
      keepFocus(idSel(".task", a.block.id, ".tick"), null);
      rowSetState(a, () => setBlockState(a.path, a.block, a.state === "DONE" ? "TODO" : "DONE", {nextNow: !!(opts && opts.nextNow)}));
    }, () => stateMenu(a)));
  const menu = el("button", {class: "iconbtn t-menu", title: "More: the states, refile, open the page", "aria-label": "More",
    onclick: e => { e.stopPropagation(); taskRowMenu(a); }}, "\u22EF");
  const meta = pills.length || info.length ? el("div", {class: "t-meta"},
    el("span", {class: "t-pills"}, ...pills),
    el("span", {class: "t-info"}, ...info)) : null;
  if (jr) row.append(...[chk, lead, title, eyebrow, meta, menu].filter(Boolean));
  else row.append(el("div", {class: "t-lead"}, chk, menu), el("div", {class: "t-body t-one"}, title, meta));
  return row;
}
