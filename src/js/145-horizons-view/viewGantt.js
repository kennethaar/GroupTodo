function viewGantt() {
  const c = el("div", {class: "wrap"});
  const groups = ganttRows();
  const key = state.ganttSpan || "3";
  const months = (GANTT_SPANS.find(s => s[0] === key) || GANTT_SPANS[0])[2];
  const chains = state.ganttChains !== false;
  const datedOnly = !!state.ganttDated;

  /* Every bar, so the window can be worked out before anything is drawn. */
  const all = [];
  let undated = 0;
  for (const g of groups) for (const t of g.tasks) {
    if (t.span) all.push(t.span); else undated++;
  }

  let from, to;
  if (months) {
    // A plan is mostly about what is ahead, with just enough behind to see drift.
    from = addMonths(todayISO(), -Math.max(1, Math.round(months / 3)));
    to   = addMonths(from, months);
  } else if (all.length) {
    from = all.reduce((a, s) => s.start < a ? s.start : a, all[0].start);
    to   = all.reduce((a, s) => s.end   > a ? s.end   : a, all[0].end);
    from = shiftISO(from, -3);
    to   = shiftISO(to, 3);
  } else {
    from = addMonths(todayISO(), -1);
    to   = addMonths(todayISO(), 2);
  }
  const total = Math.max(1, dateDiffDays(from, to));
  const pct = iso => Math.max(0, Math.min(100, (dateDiffDays(from, iso) / total) * 100));
  const inWindow = s => s.end >= from && s.start <= to;
  GWIN = {from, to, total, pct};

  /* Two kinds of control, so two looks: the zoom is one joined bar where
     picking a part un-picks the rest, and the toggles are plain checkboxes
     that never touch each other. The same pill for both made you test which
     one deselected what. */
  const zoom = el("div", {class: "gzoomseg", role: "radiogroup", "aria-label": "Zoom"});
  for (const [k, label] of GANTT_SPANS)
    zoom.append(el("button", {type: "button", role: "radio", class: key === k ? "on" : "",
      "aria-checked": key === k ? "true" : "false",
      onclick: () => go("projects", {sub: "timeline", ganttSpan: k})}, label));
  const tick = (label, on, title, flip) => {
    const input = el("input", {type: "checkbox", onchange: flip});
    input.checked = on;
    return el("label", {class: "gshowbox", title}, input, label);
  };
  c.append(el("div", {class: "section gtools"},
    el("span", {class: "glbl"}, "Zoom"), zoom,
    el("span", {class: "gshow"},
      el("span", {class: "glbl"}, "Show"),
      tick("Dependencies", chains, "Draw the order projects have to happen in",
        () => go("projects", {sub: "timeline", ganttChains: !chains})),
      tick("Dated only", datedOnly, "Only projects with a task that has a SCHEDULED day or a deadline",
        () => go("projects", {sub: "timeline", ganttDated: !datedOnly})))));

  /* Only the groups with something inside the window, and only their dated
     tasks: a row with no bar is a row of nothing. */
  const shown = [];
  let hiddenRows = 0;
  for (const g of groups) {
    if (datedOnly && !(g.project && g.tasks.some(t => isPlanned(t.block)))) continue;
    const tasks = g.tasks.filter(t => t.span && inWindow(t.span));
    if (!tasks.length) { if (g.tasks.some(t => t.span)) hiddenRows++; continue; }
    const start = tasks.reduce((a, t) => t.span.start < a ? t.span.start : a, tasks[0].span.start);
    const end   = tasks.reduce((a, t) => t.span.end   > a ? t.span.end   : a, tasks[0].span.end);
    const openN = tasks.filter(t => OPEN_STATES[t.state]).length;
    /* A project whose last task ends next month is not "on time" if something
       inside it was due a fortnight ago, so the group bar goes red when any
       open task in it has run past its end. The whole point of the row is to
       show that without opening it. */
    const late = tasks.some(t => OPEN_STATES[t.state] && t.span.end < todayISO());
    shown.push({group: g, tasks, start, end, openN, late});
  }
  shown.sort((a, b) => a.start.localeCompare(b.start) || a.group.label.localeCompare(b.group.label));

  if (!shown.length) {
    c.append(section("Timeline", 0, emptyCard(
      all.length && datedOnly ? "No project has a SCHEDULED day or a deadline in this window. " +
                                "Turn off Dated only, or try a longer window."
      : all.length ? "Nothing falls in this window. Try a longer one, or Fit."
                 : "Nothing has a date yet. Give a task a SCHEDULED day or a deadline " +
                   "and it gets a bar here.")));
    return c;
  }

  const chart = el("div", {class: "gantt"});
  chart.append(ganttHeader(from, to, pct));

  /* Today is the line everything is read against. It is a percentage of the
     track, not of the row, so it is handed to the CSS as a variable and each
     track draws its own slice of the same line -- the alternative is one
     absolute overlay whose 100% includes the label column, which would put the
     line in the wrong place. */
  chart.style.setProperty("--gnow",
    (todayISO() >= from && todayISO() <= to) ? pct(todayISO()) + "%" : "-10%");

  const body = el("div", {class: "gbody"});
  /* The arrows between project bars cannot live in any one row, so they are one
     overlay drawn on top of the rows once the browser has laid them out. */
  const links = el("div", {class: "glinks"});
  body.append(links);

  let drawn = 0;
  const drawTo = upto => {
    for (let i = drawn; i < upto; i++) {
      const row = shown[i];
      body.insertBefore(ganttGroupRow(row, pct), more);
      if (state.ganttOpen === row.group.path)
        for (const t of row.tasks) body.insertBefore(ganttTaskRow(t, pct), more);
    }
    drawn = upto;
    const left = shown.length - drawn;
    if (!left) { more.remove(); }
    else more.set("Show " + Math.min(left, CFG.rowsPerPage) + " more · " + left + " below",
                  left > CFG.rowsPerPage ? "Show all " + shown.length : "");
    if (chains) drawChainArrows(body, links, shown.slice(0, drawn));
  };
  const more = moreRow(() => drawTo(Math.min(shown.length, drawn + CFG.rowsPerPage)),
                       () => drawTo(shown.length));
  body.append(more);
  drawTo(Math.min(shown.length, CFG.rowsPerPage));
  chart.append(body);
  /* The key to the colours sits under the bars it explains, inside the frame,
     not below it. How to drag is shown by the grips on the bars; the rest is
     one line of keys and the ? beside it. */
  chart.append(el("div", {class: "graph-legend gfoot"},
    el("span", {class: "glg"}, el("i", {style: "background:var(--todo)"}), "To do"),
    el("span", {class: "glg"}, el("i", {style: "background:var(--doing)"}), "Doing"),
    el("span", {class: "glg"}, el("i", {style: "background:var(--wait)"}), "Waiting for"),
    el("span", {class: "glg"}, el("i", {style: "background:var(--done)"}), "Done"),
    el("span", {class: "glg"}, el("i", {style: "background:var(--late)"}), "Late"),
    el("span", {class: "glg quiet gkeys"},
      el("kbd", {}, "Alt+←/→"), "a day", el("kbd", {}, "+Shift"), "a week",
      helpDot("projects-timeline", "How the Timeline works"))));
  c.append(chart);

  const notes = [];
  if (hiddenRows) notes.push(hiddenRows + " project(s) sit entirely outside this window.");
  if (undated) notes.push(undated + " task(s) have no date at all, so they have no bar - " +
    "a span invented for them would read exactly like a real one.");
  const troubled = shown.filter(r => r.group.trouble);
  if (troubled.length) notes.push(troubled.length + " project(s) start before what they wait " +
    "on has finished - the hatched part of the bar is the overlap.");
  if (notes.length) c.append(el("div", {class: "section quiet"},
    el("div", {style: "color:var(--fg3);font-size:12.5px"}, notes.join(" "))));
  return c;
}
