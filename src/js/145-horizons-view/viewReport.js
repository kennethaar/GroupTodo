function viewReport() {
  // First time in, four lines on what it is for.
  if (PREF.get("report.seen", "") !== "1") setTimeout(openReportWalkthrough, 60);
  const c = el("div", {});
  const key = state.reportRange || "week";
  const win = reportWindow();
  const by = state.reportBy || "customer";
  const all = completedSince(win.from);
  const dated = all.filter(r => !r.undated && r.when >= win.from && r.when <= win.to);
  const undated = all.filter(r => r.undated).length;
  const approxShown = dated.filter(r => r.approx).length;

  const goReport = patch => go("projects", Object.assign({sub: "report"},
    {reportRange: key, reportWho: state.reportWho, reportSpace: state.reportSpace, reportBy: by}, patch));

  const spaces = visibleSpaces();
  const space = state.reportSpace || "";
  const inSpaceRows = space ? dated.filter(r => (r.space || "") === space) : dated;
  /* Who ticked things off, in this window. Names come from the files rather
     than from the member list, so somebody who has since left still shows up
     against the work they did. */
  const byWho = new Map();
  for (const r of inSpaceRows) {
    const name = r.who || "Nobody named";
    byWho.set(name, (byWho.get(name) || 0) + 1);
  }
  const who = state.reportWho || "";
  const rows = (who ? inSpaceRows.filter(r => (r.who || "Nobody named") === who) : inSpaceRows)
    .sort((a, b) => String(b.when).localeCompare(String(a.when)));

  /* One row: the window, whose work, which space, how it is grouped. Typed
     dates are a window of your own -- the quarter that matters to you rarely
     starts where the calendar's does -- and changing either end redraws at
     once, because there is nothing to submit. Spaces are separate folders, so
     they are split, and "All spaces" stays a choice. */
  const row = fbar(fselect("Period", key, [...REPORT_RANGES.map(([k, label]) => [k, label]), ["custom", "Custom dates\u2026"]],
    v => goReport({reportRange: v})));
  if (key === "custom") {
    const from = el("input", {type: "date", value: win.from, max: todayISO(), "aria-label": "From"});
    const to   = el("input", {type: "date", value: win.to,   max: todayISO(), "aria-label": "To"});
    from.onchange = () => goReport({reportRange: "custom", reportFrom: from.value || win.from, reportTo: to.value || win.to});
    to.onchange   = () => goReport({reportRange: "custom", reportFrom: from.value || win.from, reportTo: to.value || win.to});
    row.append(from, el("span", {class: "say"}, "to"), to);
  }
  row.append(el("span", {class: "gap"}));
  if (byWho.size > 1 || who)
    row.append(fselect("Person", who, [["", "Everyone"], ...Array.from(byWho.keys()).sort().map(n => [n, n])],
      v => goReport({reportWho: v})));
  if (spaces.length > 1)
    row.append(fselect("Area", space, [["", "All areas"], ...spaces.map(n => [n, n])], v => goReport({reportSpace: v})));
  row.append(fselect("Group by", by, REPORT_GROUPS.map(([k, label]) => [k, "By " + label.toLowerCase()]),
    v => goReport({reportBy: v})));
  c.append(row);

  const window_ = humanDate(win.from) + " to " + humanDate(win.to);
  c.append(el("div", {class: "section"},
    el("div", {class: "reportsum"},
      el("b", {}, String(rows.length)),
      " finished, " + window_ +
      (who ? ", by " + who : "") +
      (space ? ", in " + space : "") +
      " · " + new Set(rows.map(r => r.org || "No customer")).size + " customer(s)" +
      " · " + new Set(rows.map(r => r.project || "No project")).size + " project(s)" +
      (who ? "" : " · " + byWho.size + " person(s)"),
      el("button", {class: "btn sm ghost", style: "margin-left:auto",
        onclick: () => copyReport(rows, window_, who, by)}, "Copy as text"),
      el("button", {class: "btn sm ghost", title: "Download as a CSV file, which Excel opens",
        onclick: () => exportTasksCsv(rows, "finished-" + win.from + "-to-" + win.to)}, "Export to Excel"))));

  /* Who carried what: how many, and how long they took by their dots, so a
     household or a team can see whether the load is shared. Only for
     everyone, and only when there is more than one name to set side by side. */
  if (!who && byWho.size > 1) {
    const load = new Map();
    for (const r of inSpaceRows) {
      const name = r.who || "Nobody named";
      const l = load.get(name) || {n: 0, min: 0, chores: 0};
      l.n++; l.min += estMinutes(r.title) || 0;
      if (r.block && repeatOf(r.block)) l.chores++;
      load.set(name, l);
    }
    // By time when any of it is sized, by count when none is.
    const total = [...load.values()].reduce((s, l) => s + l.min, 0);
    const size = l => total ? l.min : l.n;
    const most = Math.max(1, ...[...load.values()].map(size));
    const line = ([name, l]) => el("div", {class: "reportsum", style: "gap:8px"},
      el("span", {style: "min-width:9em"}, name),
      el("span", {class: "freshbar", style: "width:120px"},
        el("i", {style: "width:" + Math.round(size(l) / most * 100) + "%"})),
      el("span", {class: "say"}, l.n + " done" + (l.chores ? ", " + l.chores + " chore(s)" : "") +
        (l.min ? " · " + fmtMinutes(l.min) + " (" + Math.round(l.min / total * 100) + "%)" : "")));
    c.append(section("Who carried what", load.size, el("div", {},
      ...[...load].sort(([, x], [, y]) => (y.min - x.min) || (y.n - x.n)).map(line))));
  }

  const burn = burndownSection(win, space);
  if (burn) c.append(burn);

  if (!rows.length) {
    c.append(section("Finished", 0, emptyCard(
      "Nothing ticked off in this window. Tick a task and it lands here.")));
  } else {
    for (const [k, items] of reportGroups(rows, by))
      c.append(section(reportGroupLabel(k, by), items.length, pagedCard(items, reportRow)));
  }

  // Never quietly drop work: say what has no date and why it cannot be placed.
  if (approxShown) c.append(el("div", {class: "section quiet"},
    el("div", {style: "color:var(--fg3);font-size:12.5px"},
      (approxShown === 1 ? "1 of these was marked DONE without a done date, so it is placed on the day page it was"
                         : approxShown + " of these were marked DONE without a done date, so they are placed on the day page they were") +
      " written on and marked approx.")));
  if (undated) c.append(el("div", {class: "section quiet"},
    el("div", {style: "color:var(--fg3);font-size:12.5px"},
      undated + " finished task(s) carry no date, so they are not counted above. " +
      "A task ticked off in the app is stamped done_by:: with the day; one marked " +
      "DONE by hand on a page other than a day page is not, and nothing can tell when that happened.")));
  return c;
}
