/* ============================================================
   145_WEEDING + REVIEW dashboards
   Port of: init.lua 92_MORNING_ROUTINE + weekly_review_dashboard
   ============================================================ */
function openWeeding(next) {
  const stalest = stalestActiveProjects(CFG.weedCount);
  /* A fix opens its own dialog over the review, and the review comes back
     when that one is answered or left, so a morning is not a single repair. */
  const fixThen = fn => { closeModal({keepQueue: true}); fn(); askAfterModal(() => openWeeding(next)); };
  const finish = () => { PREF.set(MORNING_KEY, todayISO()); closeModal(); render(); };
  const onward = () => { finish(); (next || (() => openContextPicker("Where are you now?", surfaceContext)))(); };
  const body = el("div", {});
  if (!weedingWorthIt()) {
    body.append(el("div", {class: "field"},
      el("div", {style: "color:var(--fg2);font-size:13px"},
        `Weeding ranks the stalest of many projects. With ${projectsIn("1").length} active ` +
        `and ${openOf(leafActions()).length} open tasks there is little to rank, ` +
        `so GroupToDo will not bring this up by itself until there are ` +
        `${CFG.weedMinProjects} projects and ${CFG.weedMinTodos} tasks.`)));
  }
  if (!stalest.length) body.append(el("div", {class: "empty"}, "No active projects. Create one, or capture into today."));
  stalest.forEach((p, i) => {
    const sec = el("div", {class: "dash-sec"});
    const flags = [];
    if (!p.anyTodo)  flags.push("no next action");
    if (!outcomeOf(p.path)) flags.push("no outcome");
    // Context and verb belong to a task, so they are flagged on its row below.
    sec.append(el("h4", {},
      el("span", {}, (i + 1) + ". " + p.title),
      p.ageDays != null ? el("span", {class: "n"}, p.ageDays + "d old") : null,
      p.idleDays != null ? el("span", {class: "n"}, "idle " + p.idleDays + "d") : null,
      ...flags.map(f => el("span", {class: "chip miss"}, f))));
    if (p.ageDays != null && p.ageDays > CFG.staleProjectDays) {
      sec.append(el("div", {class: "dash-item", style: "color:var(--warn)"},
        el("span", {}, "Older than 6 months. Still real? Park it in 2/ or kill it in _/."),
        el("button", {class: "fix", onclick: () => fixThen(() => openStatusPicker(p.path))}, "change status")));
    }
    for (const t of p.todos) {
      const open = () => {
        closeModal({keepQueue: true});
        openTaskDetail(p.path, t.block);
        notify("Opened " + plainTitle(t.title) + ".", "info", {label: "Back to the review", run: () => openWeeding(next)});
      };
      sec.append(el("div", {class: "dash-item"},
        stateChip(t.state, t.block),
        el("button", {style: "flex:1;min-width:0;text-align:left;color:inherit", title: "Open the task",
          translate: "no", html: renderInline(t.title), onclick: open}),
        t.missingContext ? el("button", {class: "chip miss", title: "Where can this be done?",
          onclick: () => fixThen(() => promptAndInsertContext(p.path, t.block))}, "+ context") : null,
        t.missingVerb ? el("button", {class: "chip miss", title: "What would a camera see?",
          onclick: () => fixThen(() => openVerbPicker(p.path, t.block))}, "+ verb") : null));
    }
    sec.append(el("div", {style: "display:flex;gap:6px;padding:6px 16px 10px;flex-wrap:wrap"},
      el("button", {class: "btn sm ghost", onclick: () => {
        closeModal({keepQueue: true}); openPage(p.path);
        notify("Opened " + p.title + ".", "info", {label: "Back to the review", run: () => openWeeding(next)});
      }}, "open"),
      el("button", {class: "btn sm ghost", onclick: () => fixThen(() => openAddNextAction(p.path))}, "+ next action"),
      el("button", {class: "btn sm ghost", onclick: () => fixThen(() => openOutcomePrompt(p.path))}, "outcome"),
      el("button", {class: "btn sm ghost", onclick: () => fixThen(() => openStatusPicker(p.path))}, "status"),
      el("button", {class: "btn sm ghost", onclick: () => { updateReviewed(p.path); closeModal(); openWeeding(next); }}, "mark reviewed")));
    body.append(sec);
  });
  modal({
    title: "Morning weeding", hint: "5 minutes · w continues",
    body,
    foot: [el("button", {class: "btn ghost", title: "Finish the review for today", onclick: () => { finish(); notify("Morning review done."); }}, "Done"),
           el("button", {class: "btn primary", onclick: onward}, "Done → context")],
    onKey: e => { if (e.key === "w") { onward(); return true; } return false; },
  });
}
