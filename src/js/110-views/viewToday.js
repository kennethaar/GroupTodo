function viewToday() {
  if (state.sub === "week") return viewJournalWeek();
  const today = todayISO();
  const me = whoAmI();
  const who = state.todayWho && !samePerson(state.todayWho, me) && !isMe(state.todayWho) ? state.todayWho : "";
  const nm = who ? firstNameOf(who) + "'s" : "Your";
  const acts = who ? openActionsOf(who) : myOpen();
  const now = acts.filter(a => a.due && a.due <= today).sort((x, y) => x.due.localeCompare(y.due));
  const week = acts.filter(a => a.due && a.due > today && a.due <= shiftISO(today, 7))
    .sort((x, y) => x.due.localeCompare(y.due));
  const spaces = who ? [Spaces.active] : visibleSpaces().filter(n => LOADED.has(n));
  /* The journals can show another day; what is due stays about today. */
  const day = state.todayDay && state.todayDay !== today ? state.todayDay : today;
  // The date is in the picker; the weekday, which the picker does not say, goes beside the title.
  const dayName = iso => capitalise(parseISO(iso).toLocaleDateString(undefined, {weekday: "long"}));
  const jTitle = sp => nm + " " + sp + " journal";
  const TODAY_TRAIL = {root: "Journal", rootGo: ["today", {jz: null}]};
  const dayPath = sp => inSpace(sp, () => {
    const path = who ? journalPath(day, who) : day === today ? ensureJournal(day) : journalPath(day);
    // The routines that fall today come onto it as it is first shown (#105).
    if (!who && day === today) pourTodaysRoutines(path);
    return getPage(path) ? path : null;
  });
  /* The day's values, trackers among them, sit above what is due. A tracker
     still written as a line on my page is moved up to them first. */
  /* Trackers belong to one area. Only the areas whose day has some are
     shown, and "+ tracker" is offered once, for the area new ones go to: the
     one that already has trackers, else the area you are in. */
  const daySpaces = who ? [] : spaces.filter(sp => dayPath(sp));
  let trackers = 0;
  const trkIn = new Map();
  for (const sp of daySpaces) inSpace(sp, () => {
    const path = dayPath(sp), page = getPage(path);
    if (hoistDayTrackers(page)) touch(path);
    const n = Object.keys(page.props || {}).filter(k => parseTracker(k + "::") || isDayValueKey(k)).length;
    trkIn.set(sp, n); trackers += n;
  });
  const trkHome = daySpaces.find(sp => trkIn.get(sp)) || (daySpaces.includes(Spaces.active) ? Spaces.active : daySpaces[0]);
  const factSpaces = daySpaces.filter(sp => trkIn.get(sp) || sp === trkHome);
  const trkNode = (sp, path, body) => {
    const node = el("div", {class: "space-journal", data: {space: sp, path}}, ...body);
    const activate = () => {
      activateJournalSpace(sp);
      if (!SPACE_CONTEXT || SPACE_CONTEXT.space !== sp) SPACE_CONTEXT = {space: sp, path};
    };
    node.addEventListener("pointerdown", activate, true);
    node.addEventListener("focusin", activate, true);
    return node;
  };
  /* With journals side by side, the trackers and what is due stand in the
     same columns, as wide as the journal under them: each area's own above
     its journal, and each area adds its own trackers. */
  const byArea = !who && spaces.length > 1;
  const areaCols = cell => journalWidths(el("div", {class: "jgrid"}, ...spaces.map(sp => el("section", {class: "jcard trkcol"},
    el("header", {class: "jhead"}, spaceBadge(sp)), cell(sp)))), spaces);
  const JROW = {journal: true}, DUEROW = {journal: true, todayImplied: true};
  // The Journal is for capture: it never groups by context (#315). Next does.
  const inArea = (list, sp) => byArea ? list.filter(a => a.space === sp) : list;
  const tasksBy = (acts, empty, rowOpts = JROW) => byArea
    ? areaCols(sp => taskCard(inArea(acts, sp), empty, rowOpts)) : taskCard(acts, empty, rowOpts);
  /* What was due and is done today, under what is still open: the count you
     are working down, and the row to open them again (#160). */
  const doneNow = who ? [] : doneToday().filter(a => a.due && a.due <= today);
  const dueCard = (open, done, empty) => {
    const card = taskCard(open, empty, DUEROW);
    if (!done.length) return card;
    const shown = PREF.get("today.done", "") === "1";
    card.append(el("button", {class: "donetoday", "aria-expanded": String(shown),
      onclick: () => { PREF.set("today.done", shown ? "" : "1"); render(); }},
      el("span", {class: "pbar"}, el("i", {style: "width:" + Math.round(100 * done.length / (open.length + done.length)) + "%"})),
      svgIcon(shown ? ICON_CARET : ICON_CHEVRON_RIGHT), " " + done.length + " done today"));
    if (shown) card.append(...done.map(a => taskRow(a, DUEROW)));
    return card;
  };
  const dueBy = empty => byArea
    ? areaCols(sp => dueCard(inArea(now, sp), inArea(doneNow, sp), empty))
    : dueCard(now, doneNow, empty);

  const sections = [
    byArea ? {id: "facts", title: "Trackers", count: trackers,
     body: () => el("div", {}, areaCols(sp => inSpace(sp, () => {
       const path = dayPath(sp);
       if (!path) return trkNode(sp, null, [emptyCard("Nothing tracked on " + dayName(day) + " yet. ",
         el("button", {class: "textbtn", onclick: () => { inSpace(sp, () => ensureJournal(day)); render(); }}, "Track this day"))]);
       return trkNode(sp, path, [dayTrackersBlock(path, {move: sp})]);
     })), sheetsToday(day))} :
    /* A day with no page yet still gets its trackers: yesterday's sleep is
       often filled in today, and that day's page is made for it on the spot. */
    !who && !factSpaces.length ? {id: "facts", title: "Trackers", count: 0,
     body: () => emptyCard("Nothing tracked on " + dayName(day) + " yet. ",
       el("button", {class: "textbtn", onclick: () => { inSpace(Spaces.active, () => ensureJournal(day)); render(); }}, "Track this day"))} : null,
    !byArea && factSpaces.length ? {id: "facts", title: "Trackers", count: trackers,
     body: () => el("div", {class: "card"}, ...factSpaces.map(sp => inSpace(sp, () => {
       const path = dayPath(sp);
       return trkNode(sp, path, [factSpaces.length > 1 ? spaceBadge(sp) : null, dayTrackersBlock(path, {add: sp === trkHome})]);
     })), sheetsToday(day))} : null,
    {id: "due", title: "Due Today & Late", short: "Due", late: now.some(a => a.due < today), count: now.length,
     done: doneNow.length, lateN: now.filter(a => a.due < today).length,
     body: () => dueBy("Nothing due. Nothing late.")},
    {id: "week", title: "Next 7 Days", count: week.length,
     body: () => tasksBy(week, "Nothing in the next seven days.")},
    /* Where you said you are: the oldest few open there, drawn fresh each
       time, so one ticked off makes room for the next. */
    !who && state.context ? (() => {
      const here = oldestTodosForContext(state.context);
      return {id: "ctx", title: "@" + state.context, count: here.length,
        body: () => tasksBy(here, "Nothing open in @" + state.context + ".")};
    })() : null,
    ...spaces.map(sp => {
      const lines = inSpace(sp, () => {
        const pg = getPage(who ? journalPath(day, who) : journalPath(day));
        return pg ? flattenBlocks(pg.blocks).filter(b => trim(b.title)).length : 0;
      });
      const path = who ? null : dayPath(sp);
      return {id: "j:" + sp, title: jTitle(sp), space: sp, folded: lines + (lines === 1 ? " line" : " lines"),
        // The area's badge stands beside it, so the title does not say the area again (#160).
        label: (who ? firstNameOf(who) + "'s journal" : "Journal"),
        edit: path ? () => editAllText({space: sp, path, id: null}) : null,
        hint: who ? "you can read it, fold it and focus on a line" : "click a line to write, a bullet to focus",
        body: () => journalColumn(sp, day, who, Object.assign({title: jTitle(sp), parentGo: ["today", {jz: "j:" + sp}],
          newText: "+ Click here to write a new line…"}, TODAY_TRAIL))};
    }),
  ].filter(Boolean);

  /* Focus on one section: the trail back to Today is all that stays above it. */
  const z = state.jz && sections.find(s => s.id === state.jz);
  if (z) {
    return el("div", {class: "wrap"},
      el("div", {class: "crumbz"},
        el("button", {class: "textbtn", onclick: () => go("today", {jz: null})}, "⤶ Journal"),
        el("span", {}, "›"), z.space ? spaceBadge(z.space) : null, el("b", {}, z.title)),
      z.body());
  }

  const c = el("div", {class: "wrap jview" + (spaces.length > 1 ? " jwide" : "")});
  /* Somebody else's day page is only worth offering if there is one: a member
     who has never written a day here, or nobody but you, and the picker goes. */
  const writers = new Set(acrossSpaces(() => allJournals().map(journalOwnerOf)).filter(Boolean));
  const people = acrossNames(() => members().map(m => m.name))
    .filter(n => !samePerson(n, me) && !isMe(n) && (writers.has(slugPerson(n)) || samePerson(n, who)));
  const toDay = iso => go("today", {sub: null, todayWeek: null, todayDay: iso && iso !== today ? iso : null});
  const picker = el("input", {type: "date", value: day, "aria-label": "Go to a day",
    title: "Go to a day", onchange: e => { if (parseISO(e.target.value)) toDay(e.target.value); },
    onclick: e => { try { e.currentTarget.showPicker(); } catch (_) {} }});
  /* On a phone the box is too narrow to show its date, so the day is said in
     words over it, and a tap on the words opens the same box. */
  const rel = ["Today", "Yesterday", "Tomorrow"].includes(humanDate(day)) ? humanDate(day) : "";
  const pd = parseISO(day);
  const dayWords = el("span", {class: "daylabel", "aria-hidden": "true"},
    dateFormat(pd.getFullYear() === new Date().getFullYear()).format(pd),
    rel ? el("span", {class: "rel"}, " · " + rel) : null);
  /* The page is the journal; it is only Today while it shows today (#140).
     Another day changes nothing beside the date box, so the box stays where
     it was: the way back hangs under it, and past or ahead goes under the
     weekday (#139). */
  const head = vhead("Journal", dayName(day),
    who ? null : journalModes(false, day),
    el("div", {class: "dayhold"},
      el("div", {class: "daynav daybox"},
        el("button", {class: "dayarrow", title: "The day before", "aria-label": "The day before",
          onclick: () => toDay(shiftISO(day, -1))}, svgIcon(ICON_CHEVRON_LEFT)),
        el("label", {class: "daypick"}, dayWords, picker),
        el("button", {class: "dayarrow", title: "The day after", "aria-label": "The day after",
          onclick: () => toDay(shiftISO(day, 1))}, svgIcon(ICON_CHEVRON_RIGHT)),
        who ? null : el("button", {class: "dayarrow dayimport", title: "Import a calendar into your day pages",
          onclick: () => openCalendars()}, svgIcon(ICON_DATE), " Import calendar")),
      day !== today ? el("button", {class: "textbtn backtoday", onclick: () => toDay(null)}, "Back to today") : null),
    people.length ? wideOnly(fselect("Whose day page", who, [["", "Your page"], ...people.map(n => [n, firstNameOf(n) + "'s page"])],
      v => go("today", {todayWho: v || null})), !who) : null,
    wideOnly(focusButton("day", "btn ghost")),
    wideOnly(el("button", {class: "btn ghost", title: "Everything that happened, newest first", onclick: () => openHistory()}, "⏱ History")));
  head.classList.add("todayhead");
  /* On a phone the day is the screen, as Next's list is: the heading is one
     row, and Day or Week, the trackers, what is due and History fold behind
     the ⋯ at its end. Late work marks the ⋯, so it is never out of sight. */
  const phoneBar = el("div", {class: "jfoldbar"}, who ? null : journalModes(false, day),
    who ? null : todayIcon("Trackers", "Trackers", () => {
      PREF.set("today.tab", PREF.get("today.tab", "facts") === "facts" ? "" : "facts"); render(); },
      PREF.get("today.tab", "facts") === "facts"),
    todayIcon("History", "Everything that happened, newest first", () => openHistory()),
    people.length && !who ? todayIcon("People", "Somebody else's day page", () => chipMenu("Whose day page", null,
      people.slice(0, 9).map((n, i) => [String(i + 1), firstNameOf(n) + "'s page", null, () => go("today", {todayWho: n})]))) : null);
  const lateN = now.filter(a => a.due < today).length;
  head.querySelector(".vhead-r").append(el("button", {class: "textbtn jmorebtn" + (lateN ? " late" : ""),
    "aria-expanded": String(JOURNAL_MORE_OPEN), "aria-label": "Day or week, trackers, what is due, history" + (lateN ? ": " + lateN + " late" : ""),
    title: lateN ? lateN + " late" : "Day or week, trackers, what is due, history",
    onclick: () => { JOURNAL_MORE_OPEN = !JOURNAL_MORE_OPEN; render(); }}, "⋯"));
  if (day !== today) {
    head.classList.add("offday");
    head.querySelector(".sub").append(el("span", {class: "when"}, day < today ? "In the past" : "Ahead"));
  }
  c.append(head);
  if (!who) { maybeSyncCalendars(); const cal = calendarProblem(); if (cal) c.append(cal); }
  const coach = coachStrip();
  if (coach) c.append(coach);
  if (!who) { const news = newsBox(); if (news) c.append(news); }
  if (!who) { const cd = countdownStrip(); if (cd) c.append(cd); }
  if (!who) { const bdays = birthdayBox(); if (bdays) c.append(bdays); }
  if (!who) { const morning = morningBox(); if (morning) c.append(morning); }
  /* What is due and the trackers are tabs: one open at a time, and pressing
     the open one again folds it away. */
  /* The @context tab with nothing in it says no more than the @context chip
     at the top, so it goes until there is something there. */
  const tabs = sections.filter(s => !s.space && !(s.id === "ctx" && !s.count));
  /* Open beside done, so the tab shows the way down the list, not only what
     is left of it, and late is the one word in colour. The other lists say
     what they hold in words; an empty one says no 0 (#160). */
  const tabCount = s => s.id === "due"
    ? s.count + s.done ? el("span", {class: "tratio"},
        el("span", {class: "pbar", title: s.done + " of " + (s.count + s.done) + " done"},
          el("i", {style: "width:" + Math.round(100 * s.done / (s.count + s.done)) + "%"})),
        // A phone says it as done of all, so the tab stays one line.
        el("span", {class: "tlong"}, s.count + " open · " + s.done + " done"),
        el("span", {class: "tshort"}, s.done + "/" + (s.count + s.done)),
        s.lateN ? el("span", {class: "tlate"}, " · " + s.lateN + " late") : null) : null
    : !s.count ? null
    : s.id === "facts" ? el("span", {class: "tcount"}, String(s.count))
    : el("span", {class: "tratio"}, s.count + " open");
  const want = PREF.get("today.tab", "facts");
  const openTab = tabs.find(s => s.id === want);
  const fold = el("div", {class: "jfold" + (JOURNAL_MORE_OPEN ? " open" : "")}, phoneBar);
  c.append(fold);
  fold.append(el("div", {class: "ttabs", role: "tablist"}, ...tabs.map(s => el("button", {
    class: "ttab ttab-" + s.id + (s === openTab ? " on" : "") + (s.late ? " late" : ""), role: "tab",
    "aria-selected": String(s === openTab), title: s === openTab ? "Fold away" : "Show",
    onclick: () => { PREF.set("today.tab", s === openTab ? "" : s.id); render(); },
  }, s.short ? [el("span", {class: "tlong"}, s.title), el("span", {class: "tshort"}, s.short)] : s.title, tabCount(s)))));
  if (openTab) fold.append(el("div", {class: "tpanel"}, openTab.body()));
  /* Side by side on a wide screen, one under the other otherwise. */
  const cols = sections.filter(s => s.space);
  const solo = cols.length === 1 && !who;
  const focusBadge = s => {
    const b = spaceBadge(s.space);
    // Alone on a phone the title goes, so the area's name is the way in to focus.
    if (!b || !solo) return b;
    const focus = () => go("today", {jz: s.id});
    b.tabIndex = 0;
    b.setAttribute("role", "button");
    b.title = "Focus on " + s.title;
    b.addEventListener("click", focus);
    b.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); focus(); } });
    return b;
  };
  c.append(journalWidths(el("div", {class: "jgrid"}, ...cols.map(s => el("section", {class: "jcard" + (solo ? " solo" : "")},
    el("header", {class: "jhead"}, focusBadge(s),
      el("button", {class: "jtitle", title: "Focus on " + s.title, onclick: () => go("today", {jz: s.id})}, s.label),
      el("div", {style: "flex:1"}),
      s.edit ? el("button", {class: "jedit upkeep", title: "The whole day page as text",
        "aria-label": "Edit as Markdown", onclick: s.edit}, svgIcon(ICON_PENCIL)) : null,
      s.edit ? el("button", {class: "jedit upkeep", title: "Pin this day page to the right: it stays open while you move about",
        "aria-label": "Pin to the right", onclick: () => pinToSide(s.space, dayPath(s.space))}, svgIcon(ICON_PIN)) : null),
    s.body(),
    // The lines elsewhere that name this day, as any page shows what links to it.
    who ? null : inSpace(s.space, () => backlinksSection(journalPath(day)))))), cols.map(s => s.space)));
  return c;
}
