/* Joining somebody's area is arriving in the middle of things. Say what is
   already here and whose it is -- before the first task lands among theirs --
   and how working alongside them goes, since none of that is visible from a
   list that simply looks full. */
function openJoinedSummary(space, then) {
  if (!LOADED.has(space)) { if (then) then(); return; }
  const others = areaOthers(space);
  const {projects, open, mineGiven, handed, theirs} = inSpace(space, () => {
    const projects = allPages(p => statusDirOf(p));
    const open = openOf(leafActionsHere().filter(a => !a.held));
    return {
      projects, open,
      mineGiven: open.filter(a => a.assignee && a.mine).length,
      handed: open.filter(a => a.assignee && !a.mine).length,
      theirs: open.filter(a => !a.assignee && !a.mine).length,
    };
  });
  const byStatus = d => projects.filter(p => statusDirOf(p) === d);
  const active = byStatus("1");
  const quiet = t => el("div", {style: "color:var(--fg3);font-size:12.5px;margin-top:4px;line-height:1.5"}, t);
  const line = t => el("div", {style: "font-size:13px;color:var(--fg2);margin-top:6px;line-height:1.5"}, t);
  const counts = [["1", "active"], ["3", "waiting"], ["2", "someday"]]
    .map(([d, w]) => byStatus(d).length ? byStatus(d).length + " " + w : null).filter(Boolean).join(", ");
  modal({
    center: true, title: "You are in " + space,
    onClose: () => { if (then) then(); },
    body: el("div", {},
      el("div", {class: "field"},
        el("label", {}, "Already here"),
        others.length
          ? el("div", {style: "font-size:13.5px"}, others.slice(0, 12).join(", ") +
              (others.length > 12 ? " and " + (others.length - 12) + " more" : ""))
          : el("div", {style: "font-size:13.5px"}, "Nobody has put their name in it yet."),
        quiet("This folder is theirs as much as yours: everything in it, and everything you add, " +
              "is read by everybody it is shared with.")),
      el("div", {class: "field"},
        el("label", {}, "Projects you now share"),
        el("div", {style: "font-size:13.5px"}, projects.length ? projects.length + " - " + counts : "None yet."),
        active.length ? quiet(active.slice(0, 8).map(pageTitle).join(" · ") +
                              (active.length > 8 ? " · …" : "")) : null),
      el("div", {class: "field"},
        el("label", {}, "Open tasks"),
        el("div", {style: "font-size:13.5px"}, open.length ? open.length + " open" : "None open."),
        open.length ? quiet([
          mineGiven ? mineGiven + " already handed to you - they are in your lists now" : null,
          handed ? handed + " handed to somebody - you see those as waiting" : null,
          theirs ? theirs + " on other people's day pages - theirs, not yours" : null,
        ].filter(Boolean).join(". ") || "None of them is handed to anybody: on a project, a task is everybody's until somebody takes it.") : null),
      el("div", {class: "field"},
        el("label", {}, "Working alongside them"),
        line("• To hand a task to somebody, click it and pick them under “Who is doing it”. " +
             "It turns up in their lists, and in your Waiting for list until it is done."),
        line("• A task somebody hands you shows up with your own. Tick it off once and it is done for both of you."),
        line("• A task on a project with nobody named is open to anybody in the area. Your day pages are " +
             "filed under your name, but the others can read them too."),
        line("• Anything just for you belongs in an area of your own: + New area in the area menu, top right, " +
             "in a folder nobody else has."),
        line("• N adds a task, / searches, ? shows every key."))),
    foot: [el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: () => closeModal()}, "Start")],
  });
}
