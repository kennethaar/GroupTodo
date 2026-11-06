function viewProjects() {
  const sub = subNow();
  const c = el("div", {class: "wrap" + (sub === "list" ? " lwide" : sub === "report" || sub === "hours" ? "" : " wide")});
  const org = state.org || "";
  /* Every name against every other, while the names are still coming in from
     the folder, would be paid again at each step of the read: the look-alikes
     wait until it is done. */
  const twins = LOADING.size ? 0 : projectTwins().length;
  const head = vhead("Projects", org || "What you have committed to finishing",
    org ? el("button", {class: "textbtn", onclick: () => go("projects", {org: null})}, "× clear") : null,
    twins ? el("button", {class: "textbtn twinbtn", title: "Projects with the same or nearly the same name",
      onclick: () => openTwins()}, svgIcon(ICON_WARN), " " + twins + " look alike") : null,
    csvBtn(allTasks, "all-tasks", "Export all tasks"),
    newBtn("project", () => newProjectPrompt()), viewSeg("projects"));
  head.classList.add("projhead");
  if (!org) head.classList.add("tagline");
  c.append(head);
  /* On a phone the look-alikes are a banner of their own, gone once put away
     until the number changes, and New project is the round button at the
     bottom right, where a thumb reaches it. */
  if (twins && PREF.get("projects.twinsHidden", 0) !== twins) {
    const banner = el("div", {class: "twinbanner"},
      el("button", {class: "twingo", title: "Projects with the same or nearly the same name", onclick: () => openTwins()},
        el("span", {}, svgIcon(ICON_WARN), " " + twins + " projects look alike"), el("span", {class: "chev", "aria-hidden": "true"}, "›")),
      el("button", {class: "iconbtn", "aria-label": "Put away", title: "Put away until the number changes",
        onclick: () => { PREF.set("projects.twinsHidden", twins); banner.remove(); }}, svgIcon(ICON_CLOSE)));
    c.append(banner);
  }
  c.append(el("button", {class: "fab", "aria-label": "New project", title: "New project",
    onclick: () => newProjectPrompt()}, "+"));
  const every = STATUS_CHIPS.flatMap(code => visibleProjects(code));
  const inOrg = r => !org || projectOrgs(r).some(o => o.toLowerCase() === org.toLowerCase());
  const orgs = allOrgNames();
  const orgSel = orgs.length ? fselect("Organisation", org, [["", "All organisations"], ...orgs.map(o => [o, o])],
    v => go("projects", {org: v || null})) : null;
  if (orgSel) orgSel.classList.add("right");

  if (sub === "timeline") { c.append(viewGantt()); return c; }
  if (sub === "report") { c.append(viewReport()); return c; }
  if (sub === "hours") { c.append(viewHours()); return c; }
  if (sub === "board") { c.append(viewProjectBoard()); return c; }

  const area = areaFilter(every, "projects.area");
  /* All is every status in one list, so the numbers in "243 - Title" can be
     read off top to bottom, whichever folder each project sits in. */
  const code = state.statusCode === "all" ? "all" : STATUS_DIRS[state.statusCode] ? state.statusCode : "1";
  const inCode = r => code === "all" || effStatus(r) === code;
  const rows = every.filter(inOrg).filter(area.keep);
  const heldOf = r => inSpace(r.space, () => projectHold(r.path));
  const held = rows.filter(r => inCode(r) && heldOf(r)).sort((x, y) => heldOf(x).localeCompare(heldOf(y)));
  /* All leaves out the statuses put away on the board, with a chip each to
     bring them back, so the list and the board agree. */
  const putAway = hiddenCols("projects.status");
  const statusChips = code === "all" ? shownChips("projects.status", "Statuses shown",
    STATUS_CHIPS.filter(k => putAway.has(k) || rows.some(r => effStatus(r) === k)),
    k => STATUS_LABEL[k], k => rows.filter(r => effStatus(r) === k && !heldOf(r)).length) : null;
  const shown = rows.filter(r => inCode(r) && !heldOf(r) && (code !== "all" || !putAway.has(effStatus(r))));
  shown.forEach(r => { r._all = code === "all"; });
  const psort = projectSort();
  psort.apply(shown);
  const f = textFilter("projects", "Filter projects", shown,
    r => [rowTitle(r), ...inSpace(r.space, () => pageAliases(r.path)), areaOfRow(r), ...projectOrgs(r), ...projectPeople(r)].join(" "),
    (hits, q) => pagedCard(hits, projectRow, noMatch(q, code === "all" ? "No projects." : "No " + STATUS_LABEL[code].toLowerCase() + " projects.")));
  const nFilters = (area.cur ? 1 : 0) + (org ? 1 : 0);
  const filterBtn = area.opts.length || orgs.length ? el("button", {class: "iconbtn sheetbtn" + (nFilters ? " on" : ""),
    "aria-label": "Filter" + (nFilters ? " (" + nFilters + ")" : ""), title: "Area and organisation",
    onclick: () => openProjectFilters(area, orgs)}, svgIcon(ICON_FUNNEL), nFilters ? el("small", {}, String(nFilters)) : null) : null;
  const sortBtn = el("button", {class: "iconbtn sheetbtn", "aria-label": "Sort", title: "Sort: " + psort.opts.find(o => o[0] === psort.sort)[1],
    onclick: () => openProjectSort(psort)}, svgIcon(ICON_SORT));
  const bar = fbar(searchBox(f.input), filterBtn, sortBtn,
    el("div", {class: "fchips"}, ...STATUS_CHIPS.map(k => fchip(STATUS_LABEL[k], code === k,
      () => go("projects", {statusCode: k}), rows.filter(r => effStatus(r) === k).length)),
      fchip("All", code === "all", () => go("projects", {statusCode: "all"}), rows.length)),
    area.sel, orgSel, psort.sel);
  bar.classList.add("projbar");
  c.append(bar, statusChips || "", f.host);
  if (held.length) c.append(el("details", {class: "section fold"},
    el("summary", {}, "On hold", el("span", {class: "n"}, String(held.length))),
    el("div", {class: "card"}, ...held.map(r => el("div", {class: "task prow2"},
      el("div", {class: "t-body"},
        el("div", {class: "t-title"}, el("button", {class: "textbtn", style: "font-weight:600",
          onclick: () => openPageIn(r.space, r.path)}, rowTitle(r))),
        el("div", {class: "t-meta"},
          el("button", {class: "chip b", title: "Change the day, or bring it back now",
            onclick: () => inSpace(r.space, () => openProjectHold(r.path))}, holdArrow(heldOf(r))),
          spaceTag(r.space))))))));
  return c;
}
