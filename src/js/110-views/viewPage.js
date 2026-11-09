function viewPage() {
  const path = state.pagePath;
  if (!path || !V.pages.has(path)) { state.view = "today"; return viewToday(); }
  const kind = pageKind(path);
  const c = el("div", {class: "wrap" + (isJournalPath(path) && multiSpace() ? " jwide" : "")});
  const code = isHorizonPage(path) ? null : statusDirOf(path);
  const tracker = isTrackerPage(path) ? trackerOfPage(path) : null;
  const icon = kind === "context" ? trim(getPage(path)?.props?.icon || "")
    : tracker && trackerGroup(tracker)?.code === "i" ? tapIcon({name: tracker, raw: ""}) : "";

  // The area it lives in is also where you move it from: the same menu as Alt+S.
  const badge = spaceBadge(V.space, true);
  if (badge && Spaces.list.length > 1) {
    const space = V.space;
    badge.style.cursor = "pointer";
    badge.title = "Lives in the " + space + " area. Click to move it to another (Alt+S)";
    badge.onclick = () => openItemSpacePicker({space, path});
  }
  c.append(el("div", {class: "pcrumbs"}, badge,
    el("span", {}, tracker ? "Tracker" : PAGE_KIND_ONE[kind] || "Page"), el("span", {class: "pv-path"}, path)));
  // A tracker is renamed on every line it is on, so its page's name goes with Rename below.
  const named = !isJournalPath(path) && !tracker;
  const titleEl = el("h1", {
    class: "ptitle", contenteditable: named ? "true" : "false", spellcheck: "false",
    title: named ? "Click to rename" : "",
    onkeydown: e => {
      if (e.key === "Enter") { e.preventDefault(); e.target.blur(); }
      else if (e.key === "Escape") { e.preventDefault(); e.target.textContent = pageTitle(path); e.target.blur(); }
    },
    onblur: e => {
      const next = trim(e.target.textContent);
      if (next && next !== pageTitle(path)) renamePage(path, next);
      else e.target.textContent = pageTitle(path);
    },
  }, pageTitle(path));
  // A tracker's folder has no page of its own: up from it is the Trackers view.
  c.append(tracker ? el("div", {class: "parentline"}, el("span", {class: "up", "aria-hidden": "true"}, "↑"),
      el("span", {class: "pl", role: "link", tabindex: "0", onclick: () => go("trackers"),
        onkeydown: e => { if (e.key === "Enter") go("trackers"); }}, "Trackers"))
    : parentLine(V.space, path) || "");
  // The pane's 📌 on the full page too; drawn in the pane, its own bar has it.
  const space = V.space, pinned = isSidePinned(space, path);
  const pinLabel = pinned ? "Unpin from the right" : "Pin to the right: it stays while you move about";
  c.append(el("div", {class: "pagehead"}, icon ? el("span", {class: "picon"}, icon) : null, titleEl,
    el("div", {class: "acts"},
      SIDE_DRAWING ? null : el("button", {class: "btn sm ghost panepin" + (pinned ? " on" : ""), title: pinLabel,
        "aria-label": pinLabel, "aria-pressed": String(pinned),
        onclick: () => pinned ? unpinSide() : pinToSide(space, path)}, svgIcon(ICON_PIN)),
      el("button", {class: "btn sm ghost", title: "A link you can paste into chat or email",
        onclick: () => copyLinkTo(deepLink(path), pageTitle(path))}, "Copy link"),
      el("button", {class: "btn sm ghost", title: "Show the file in Explorer: copies a line for Win+R",
        onclick: () => revealInExplorer(path)}, "Explorer"),
      code && !SIDE_DRAWING ? el("button", {class: "btn sm ghost npmbtn", title: "Natural planning: why, outcome, ideas, next actions (w n)",
        onclick: () => npmOpen(space, path)}, svgIcon(ICON_SPARKLE), " " + npmLabel(space, path)[0]) : null,
      isJournalPath(path) ? null : el("button", {class: "btn sm ghost",
        onclick: () => go("pages", {sub: "mindmap", graphFocus: (V.space || "") + "\u0000" + path})}, "Mind map"),
      // A chapter has Focus in its own bar; one button per page (#323).
      SIDE_DRAWING || isChapterPage(path) ? null : focusButton("page", "btn sm ghost"),
      putsBack(path) && getPage(path).blocks.length ? el("button", {class: "btn sm ghost", title: "What was refiled here, to put back",
        onclick: () => openPutBack(path)}, "Put back") : null,
      el("button", {class: "btn sm ghost", title: "More", "aria-label": "More", onclick: () => openPageMenu(path)}, "⋯"))));

  if (tracker) c.append(trackerPageLine(tracker));
  if (isTemplatePath(path)) c.append(templateHelp());
  // The tour explains itself on its own page and nowhere else.
  if (isTourProject(path)) { const tc = tourCard(path); if (tc) c.append(tc); }
  /* A day page is where a meeting gets written down, so the one explanation
     the app offers about writing lines lives where the writing happens. */
  if (kind === "journal") { const mc = meetingNotesCard(path); if (mc) c.append(mc); }
  if (kind === "person") c.append(personPanel(personName(path), path));
  if (kind === "recipe") c.append(recipeBar(path));
  if (code) { const plan = npmPanel(path); if (plan) c.append(plan); }

  // A chapter of the book (#244): Outline or Prose, and today's words.
  const chapter = !SIDE_DRAWING && isChapterPage(path), prose = chapter && bookMode() === "prose";
  if (chapter) followChapter(path);
  if (chapter) c.append(chapterBar(path));
  /* Hide done (#321), offered only where something is done. Linked References
     has its own switch; the page remembers both. A day page only hides: its
     switch is the Journal column's, kept for every day (#332), and stands in
     each area's column when the day is drawn side by side. */
  const columns = !SIDE_DRAWING && state.view === "page" && isJournalPath(path);
  const closed = prose || columns ? 0 : closedLineCount(getPage(path).blocks);
  const hideDone = closed > 0 && doneHidden(path, "page");
  if (closed) c.append(fbar(switchBtn("Hide done", hideDone,
    () => setDoneHidden(path, "page", !doneHidden(path, "page")), closed)));
  c.append(el("div", {class: "section"}, outlineFor(path, prose ? {prose: true, newText: "New paragraph"}
    : {facts: true, hideDone})));
  if (tracker) c.append(trackerPreview(tracker));
  if (isStateList(path)) c.append(...tasksOfTypeSections(path));
  /* The outline shows this page's own lines. A task written in a day page with
     [[1/this project]] is this project's too; it shows once, in Linked
     References at the foot, ticked there and edited where it lives (#322). */
  if (code) {
    const time = projectTimeSection(path);
    if (time) c.append(time);
    const clocked = projectClockSection(path);
    if (clocked) c.append(clocked);
    const cost = projectCostSection(path);
    if (cost) c.append(cost);
  }
  if (kind === "context") {
    const ctx = path.slice(DIRS.contexts.length + 1).replace(/\.md$/i, "");
    const all = nextActions(), here = all.filter(a => inContext(a, ctx));
    if (ctxHasKids(ctx)) c.append(fbar(ctxKidsChip(all.filter(a => inContext(a, ctx, true) && a.context !== ctx).length)));
    c.append(section("Things you can do here", here.length, taskCard(here, "Nothing open here.")));
    // Rooms in a home, tools in a toolbox: where you put one context inside another.
    c.append(el("div", {class: "section"}, el("button", {class: "textbtn ctxnest",
      onclick: () => relChildPicker({path, space: V.space})}, "+ Put a context inside @" + ctx)));
  }
  if (kind === "org" || kind === "area") {
    const name = baseName(path);
    const ps = workingProjects().filter(r => r.space === V.space &&
      (kind === "org" ? projectOrgs(r).some(o => o.toLowerCase() === name.toLowerCase())
                      : areaOfProject(r.path) === name));
    c.append(section("Projects", ps.length, pagedCard(ps, projectRow, "None yet.")));
    if (kind === "area") c.append(areaStakeholdersSection(path));
  }
  /* Who works there, and everything still open that is theirs: what names the
     organisation on its line, and what its people carry or are named in. */
  if (kind === "org") {
    const name = baseName(path), who = orgPeople(name);
    const people = peopleRows().filter(r => who.some(n => samePerson(n, r.name)));
    c.append(section("People", people.length, pagedCard(people, personRow,
      "Nobody yet. Open a person's page and say where they work, or name them Anna Berg - " + name + ".")));
    const open = orgOpenWork(name);
    c.append(section("Open", open.length, taskCard(open, "Nothing open names " + name + " or its people.")));
    const tell = informAbout({name, org: true}).length || stakeIn({name, org: true}).length;
    c.append(el("div", {class: "section"},
      tell ? el("button", {class: "btn sm ghost", onclick: () => openSendUpdate({name, org: true})}, svgIcon(ICON_MAIL), " Send " + name + " an update") : null,
      el("div", {style: tell ? "margin-top:8px" : ""}, stakeholderLine({name, org: true}))));
  }
  // The other pages in its namespace, when it has one: Work, Work/Clients, Work/Clients/Acme.
  const ns = namespaceSection(path);
  if (ns) c.append(ns);
  const linkedReferences = el("div", {class: "deferred-backlinks"});
  c.append(linkedReferences);
  deferPageSection(linkedReferences, () => backlinksSection(path));
  return c;
}
