/* to: {name, org}. start: {path, block, space}, the line it began from, ticked
   by itself; without one, everything is ticked. First the responsibilities
   they are a stakeholder in, a summary of each project under it; then the
   lines of yours that name them. */
function openSendUpdate(to, start = null) {
  const me = whoAmI();
  if (!me) { notify("Put your name in first - the update has to say who it is from.", "warn"); return; }
  const name = to.name;
  const found = informAbout(to);
  if (start && !found.some(a => a.block === start.block)) {
    const a = allLeafActions().find(x => x.block === start.block);
    found.unshift(a || {path: start.path, block: start.block, space: start.space, title: start.block.title, state: start.block.state});
  }
  const resp = stakeIn(to);
  const projs = resp.flatMap(area => respSummary(area, to).map(p => ({kind: "proj", p, area})));
  if (!found.length && !projs.length) {
    notify("Nothing of yours that is open names " + name + ", and no responsibility has them as a stakeholder.", "warn");
    return;
  }
  const aboutOf = new Map(found.map(a => [a, askProjectOf(a)]));
  // By project, in the order they first turn up, the line you started from first.
  const order = [...new Set(found.map(a => aboutOf.get(a)))];
  found.sort((x, y) => order.indexOf(aboutOf.get(x)) - order.indexOf(aboutOf.get(y)));

  const commentBox = () => el("textarea", {rows: 1, placeholder: "What should they read? (optional)",
    style: "font-size:12.5px;min-height:30px;margin-top:4px"});
  const tasks = found.map(a => {
    const st = inSpace(a.space, () => informStatusOf(a.block));
    const stages = inSpace(a.space, () => taskStage(a.block));
    const sel = el("select", {style: "flex:0 0 auto;max-width:44%"});
    const opts = [...(st ? [] : [["", "No status"]]),
      ...(stages ? stages.stages.map(s => ["\u0001" + s.name, s.name]) : INFORM_STATES)];
    for (const [v, label] of opts) sel.append(el("option", {value: v}, label));
    sel.value = st;
    // As written, less your #tags: taking their name out leaves "the quote for".
    const title = el("input", {type: "text", value: askUntagged(a.title), style: "flex:1;min-width:0",
      "aria-label": "The line as they read it"});
    const lines = contextLinesOf(a.block);
    return {kind: "task", a, was: st, sel, title, comment: commentBox(), lines, ctx: new Set(lines.map((_, j) => j)),
      on: !start || a.block === start.block};
  });
  for (const r of projs) {
    r.title = el("input", {type: "text", value: r.p.title, style: "flex:1;min-width:0", "aria-label": "The project as they read it"});
    r.comment = commentBox();
    r.lines = r.p.lines;
    r.ctx = new Set(r.lines.map((_, j) => j));
    r.on = !start;
  }
  const rows = [...projs, ...tasks];
  const named = {on: false};
  const summary = el("div", {style: "color:var(--fg3);font-size:12.5px;margin-top:8px"});
  const refresh = () => {
    const n = rows.filter(r => r.on).length;
    summary.textContent = n
      ? n + (n === 1 ? " goes" : " go") + " to " + name + ", each with its status, your word on it, and the lines " +
        "under it you leave ticked." + (projs.length ? " Projects under their responsibilities are named." : "") +
        (tasks.length ? (named.on ? " The projects of the other lines are named." : " The other lines go without their projects, unless you name them.") : "")
      : "Nothing ticked - there would be nothing to tell.";
  };
  const toggle = (on, flip, size = 22) => {
    const box = el("button", {class: "spacetoggle" + (on() ? " on" : ""),
      style: size < 22 ? "width:" + size + "px;height:" + size + "px;font-size:11px;flex:0 0 auto" : "flex:0 0 auto",
      onclick: () => { flip(); box.className = "spacetoggle" + (on() ? " on" : ""); box.textContent = on() ? "✓" : ""; refresh(); }},
      on() ? "✓" : "");
    return box;
  };
  const rowNode = r => {
    const meta = r.kind === "proj"
      ? ["done since " + humanDate(r.area.since), r.lines.length ? "untick a line to leave it out" : "nothing else to say about it"]
      : [informedDays(r.a.block) != null ? "told " + informedDays(r.a.block) + "d ago" : "never told",
         ackedDays(r.a.block) != null ? "got it " + ackedDays(r.a.block) + "d ago" : null,
         askedDays(r.a.block) != null ? "asked " + askedDays(r.a.block) + "d ago" : null,
         r.lines.length ? "the lines under it go along unless you untick them" : null];
    const label = c => (c.label ? INFORM_NOTE.en.lines[c.label] + " " : "") + c.text;
    return el("div", {style: "display:flex;gap:10px;align-items:flex-start;margin:7px 0"},
      toggle(() => r.on, () => { r.on = !r.on; }),
      el("div", {style: "min-width:0;flex:1"},
        el("div", {style: "display:flex;gap:8px;align-items:center"}, r.title,
          r.kind === "proj" ? el("span", {class: "chip", style: "flex:0 0 auto"}, INFORM_NOTE.en.projects[r.p.code]) : r.sel),
        r.comment,
        el("div", {style: "color:var(--fg3);font-size:12px"}, meta.filter(Boolean).join(" · ")),
        ...r.lines.map((line, j) => el("div", {style: "display:flex;gap:8px;align-items:flex-start;margin:4px 0 0 " + (line.depth * 16) + "px"},
          toggle(() => r.ctx.has(j), () => { if (r.ctx.has(j)) r.ctx.delete(j); else r.ctx.add(j); }, 16),
          el("span", {style: "color:var(--fg2);font-size:12.5px;min-width:0"}, label(line))))));
  };
  const head = (text, sub) => el("div", {style: "font-weight:600;font-size:13px;margin:12px 0 0"}, text,
    sub ? el("span", {style: "font-weight:400;color:var(--fg3)"}, " · " + sub) : null);
  const card = el("div", {style: "max-height:46vh;overflow:auto"});
  for (const area of resp) {
    card.append(head(area.title, "responsibility · " + (area.told ? "told " + dateDiffDays(area.told, todayISO()) + "d ago" : "never told")));
    const mine = projs.filter(r => r.area === area);
    if (!mine.length) card.append(el("div", {style: "color:var(--fg3);font-size:12.5px;margin:4px 0"}, "No active project under it."));
    for (const r of mine) card.append(rowNode(r));
  }
  let about = null;
  if (resp.length && tasks.length) card.append(el("div", {style: "color:var(--fg3);font-size:11.5px;text-transform:uppercase;letter-spacing:.05em;margin:16px 0 2px"},
    "Lines that name " + firstNameOf(name)));
  for (const r of tasks) {
    const p = aboutOf.get(r.a);
    if (p !== about) card.append(head(p || "Not in a project"));
    about = p;
    card.append(rowNode(r));
  }
  refresh();

  const area = (start && start.space) || (found[0] && found[0].space) || (resp[0] && resp[0].space) || Spaces.active || "";
  const send = sheet => {
    const chosen = rows.filter(r => r.on);
    if (!chosen.length) { notify("Tick at least one line to tell them about.", "warn"); return; }
    const anyProj = chosen.some(r => r.kind === "proj");
    const items = chosen.map(r => r.kind === "proj" ? {
      t: trim(r.title.value) || r.p.title, status: "P:" + r.p.code, core: INFORM_PROJECT_CORE[r.p.code],
      comment: r.comment.value, project: r.p.title, head: r.area.title,
      context: r.lines.filter((_, j) => r.ctx.has(j)),
    } : {
      // The task's area and id::, so a reply to the mail finds its way back.
      ref: (r.a.space || V.space) + "-" + inSpace(r.a.space, () => ensureBlockId(r.a.path, r.a.block)),
      t: trim(r.title.value) || plainTitle(r.a.title), status: r.sel.value,
      core: inSpace(r.a.space, () => informCore(r.a.block, r.sel.value)),
      comment: r.comment.value, project: aboutOf.get(r.a) || "",
      ...(anyProj && !named.on ? {head: "\u0001other"} : {}),
      context: r.lines.filter((_, j) => r.ctx.has(j)),
    });
    const file = sheet ? "update-for-" + slugPerson(name).toLowerCase().replace(/[^\w-]+/g, "-") + "_" + fileWhen() + ".html" : null;
    closeModal();
    openInformNote(to, items, {file, named: named.on, area,
      sheetOf: sheet ? () => informSheetHtml({to: name, from: me, items, named: named.on}) : null,
      sent: () => informSent(name, chosen, items, to)});
  };

  modal({
    center: true, title: "Send " + name + " an update",
    hint: (projs.length ? projs.length + (projs.length === 1 ? " project" : " projects") + (found.length ? ", " : "") : "") +
      (found.length ? found.length + " open" : ""),
    body: el("div", {},
      el("div", {class: "field"},
        el("label", {}, "What to tell them about"),
        card, summary),
      tasks.length ? el("div", {class: "field"},
        el("div", {style: "display:flex;gap:10px;align-items:center"},
          toggle(() => named.on, () => { named.on = !named.on; }),
          el("span", {}, "Name the projects in what they get"))) : null,
      el("div", {class: "field"},
        el("div", {style: "color:var(--fg3);font-size:12.5px"},
          "Write the email: each line numbered in the mail itself, where it stands and your word on it, " +
          "with a link to ask about it and one to say Got it. Make the sheet: the same as one HTML page to attach and keep. " +
          "Either way, once it is sent each line is marked as told, what you wrote goes in its chat or on the " +
          "responsibility's page, and a status you changed here can go to the task."))),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("button", {class: "btn ghost", onclick: () => send(true)}, "Make the sheet"),
      el("button", {class: "btn primary", onclick: () => send(false)}, "Write the email"),
    ],
  });
}
