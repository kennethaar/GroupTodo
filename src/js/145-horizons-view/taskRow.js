function taskRow(a, opts) {
  // A list in the Journal draws its rows the Journal's way (#160).
  const jr = !!(opts && opts.journal);
  // An action shown from another space must be edited IN that space, or the
  // change would be written through the active space's backend.
  const title = el("div", {class: "t-title", html: estHtml(a.title) + renderInline(titleForLine(a.title))});
  /* Waiting for lists the row under who has it, so a chip saying the same
     again is noise there (#372); how long it has waited is said instead. */
  const waitUnder = opts && opts.waiting;
  let chips = chipsFor(a, jr ? opts : {}).filter(c => !(c.classList.contains("asg") &&
    (pillInTitle(title, c, a.assignee) || (waitUnder && a.assignee && samePerson(a.assignee, waitUnder)))));
  /* The words are shown as written, @context and all, and that says the
     context (#315). A chip is drawn only when the words do not say it -- a
     context from the line above -- and never under a context's own header.
     In the Journal the project is the line above. */
  let lead = null, eyebrow = null;
  // A chore written on its room's own page: the room is said once, by its pill (#209).
  if (opts && (opts.nextNow || jr) && a.context && a.projectPath === contextPath(a.context))
    chips = chips.filter(c => !c.classList.contains("proj"));
  const ctxChip = chips.find(c => c.classList.contains("ctx"));
  const ctxShown = ctxChip && !(opts && opts.grouped) && !title.querySelector(".wikilink.ctx") ? ctxChip : null;
  if (ctxChip) chips = chips.filter(c => c !== ctxChip);
  if (jr) {
    lead = ctxShown;
    eyebrow = chips.find(c => c.classList.contains("proj")) || null;
    if (eyebrow) {
      eyebrow.className = "t-eyebrow";
      eyebrow.tabIndex = 0;
      eyebrow.setAttribute("role", "button");
      eyebrow.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); openProjectChipMenu(a); }
      });
    }
    chips = chips.filter(c => c !== eyebrow);
  }
  else if (ctxShown) title.prepend(ctxShown);
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
  if (waitUnder && a.age > 0)
    info.push(el("span", {class: "t-age", title: "Waiting " + a.age + (a.age === 1 ? " day" : " days")}, a.age + "d"));
  const meta = pills.length || info.length ? el("div", {class: "t-meta"},
    el("span", {class: "t-pills"}, ...pills),
    el("span", {class: "t-info"}, ...info)) : null;
  if (jr) row.append(...[chk, lead, title, eyebrow, meta, menu].filter(Boolean));
  else row.append(el("div", {class: "t-lead"}, chk, menu), el("div", {class: "t-body t-one"}, title, meta));
  return row;
}
