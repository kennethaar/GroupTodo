/* Which project a line belongs to (#401): type to find one, the busiest this
   week on top, or name a new one. On a day page the line goes under the
   project's line; on a page it moves to the project. */
function pickLineProject(path, block) {
  const space = V.space, act = projectActivity(), ranked = projectsByActivity();
  const input = el("input", {type: "text", placeholder: "Find or name a project", "aria-label": "Project",
    oninput: () => { hi = 0; draw(); }});
  const list = el("div", {});
  let rows = [], hi = 0;
  const file = p => inSpace(space, () => {
    ASK_PROJECT.id = null;
    if (isJournalPath(path)) fileUnderProject(path, block, p);
    else if (p !== path) refileBlock(path, block, p);
    render();
  });
  const take = r => { closeModal(); r.run(); };
  const row = p => ({label: pageTitle(p), detail: act.get(p) ? act.get(p) + " this week" : "", run: () => {
    file(p);
    notify("Under " + pageTitle(p) + ". Ctrl+Z takes it back.");
  }});
  function draw() {
    const q = trim(input.value), low = q.toLowerCase();
    const hits = ranked.filter(p => !low || pageTitle(p).toLowerCase().includes(low));
    const top = low ? [] : hits.filter(p => act.get(p)).slice(0, 5);
    const rest = hits.filter(p => !top.includes(p));
    rows = [...top, ...rest].map(row);
    if (q && !ranked.some(p => pageTitle(p).toLowerCase() === low)) rows.push({label: "+ New project “" + q + "”",
      detail: "Active", run: () => {
        const p = inSpace(space, () => createProjectPage(q));
        file(p);
        notify("Project made: " + pageTitle(p) + ".", "info",
          {label: "What does done look like?", run: () => inSpace(space, () => askProjectOutcome(p, () => {}))});
      }});
    list.textContent = "";
    const head = text => el("div", {class: "pickhead"}, text);
    rows.forEach((r, i) => {
      if (top.length && i === 0) list.append(head("Most active"));
      if (top.length && i === top.length) list.append(head("All projects"));
      const b = pickRow(i === hi ? "›" : "", r.label, r.detail, () => take(r));
      if (i === hi) b.classList.add("on");
      list.append(b);
    });
    if (!rows.length) list.append(el("div", {class: "empty"}, "No projects yet. Type a name to make one."));
  }
  draw();
  modal({
    title: "Which project?", hint: "type to find · ↑↓ · enter · esc",
    body: el("div", {class: "projpick"}, el("div", {class: "filterbox"}, input), list),
    foot: [el("button", {class: "btn ghost", onclick: () => { ASK_PROJECT.id = null; closeModal(); render(); }}, "Not in a project")],
    onKey: e => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (rows.length) hi = (hi + (e.key === "ArrowUp" ? -1 : 1) + rows.length) % rows.length;
        draw(); return true;
      }
      if (e.key === "Enter" && rows[hi]) { take(rows[hi]); return true; }
      return false;
    },
  });
  requestAnimationFrame(() => input.focus());
}
