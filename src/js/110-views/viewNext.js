function viewNext() {
  const sub = subNow();
  const c = el("div", {class: "wrap" + (sub === "board" ? " wide" : "")});
  // What is on screen is what leaves: the states and the context you filtered to.
  const twins = nextTwins().length;
  c.append(vhead("Next", null,
    twins ? el("button", {class: "textbtn twinbtn", title: "Next actions with the same or nearly the same words",
      onclick: () => openNextTwins()}, svgIcon(ICON_WARN), " " + twins + " look alike") : null,
    csvBtn(() => sub === "calendar" ? all : acts, "next"), viewSeg("next")));
  const all = nextActions();
  if (sub === "calendar") { c.append(viewCalendar()); return c; }

  const hidden = hiddenStates();
  const stateOn = st => !hidden.has(st);
  const toggleState = st => {
    const next = hiddenStates();
    if (next.has(st)) next.delete(st); else next.add(st);
    if (["TODO", "DOING"].every(s => next.has(s))) next.delete(st === "TODO" ? "DOING" : "TODO");
    setHiddenStates(next); render();
  };
  const types = typeFilter(all, "next.type");
  const est = estFilter(all, "next.est", true);
  /* Chores are upkeep, not the work: one chip takes them off Next while you do it. */
  const chores = all.filter(isChore).length;
  /* On a phone the list is one side or the other, To do or Chores, and the
     chip would only say it twice. */
  const sided = sub !== "board" && PHONE.matches && chores > 0;
  const choresOn = sided || PREF.get("next.chores", "") !== "0";
  const choreChip = () => chores && !sided ? fchip("Chores", choresOn, () => { PREF.set("next.chores", choresOn ? "0" : ""); render(); }, chores) : null;
  let acts = all.filter(a => stateOn(a.state)).filter(types.keep).filter(est.keep).filter(a => choresOn || !isChore(a));
  // Only the contexts something open is waiting in, plus the one you are filtered to.
  const ctxs = Array.from(new Set([...all.map(a => a.context).filter(Boolean),
    ...(state.ctxFilter && state.ctxFilter !== CTX_NONE ? [state.ctxFilter] : [])])).sort();
  const {sel: sortSel, apply: sortActs, dot: sortDot} = taskSort("next", "urgency");

  if (sub === "board") {
    const byTag = PREF.get("next.boardBy", "ctx") === "tag";
    const by = byTag ? "tag" : "ctx";
    if (est.plan) acts = planFill(acts, est.plan);
    sortActs(acts);
    c.append(fbar(fchip("To do", stateOn("TODO"), () => toggleState("TODO"), all.filter(a => a.state === "TODO").length),
      fchip("Doing", stateOn("DOING"), () => toggleState("DOING"), all.filter(a => a.state === "DOING").length),
      choreChip(), boardBySelect("next.boardBy", [["ctx", "By context"], ["tag", "By tag"]]), types.sel, est.sel, sortSel, sortDot,
      el("span", {class: "say right"}, byTag
        ? "Drag a card to another column to tag it that instead."
        : "Drag a card to another column, or onto a context below, to change where it can be done."),
      boardSelHost()));
    BOARD_ITEMS = new Map();
    const putAway = hiddenCols(by);
    if (byTag) {
      const shelf = hiddenColsBar(by, k => k ? "#" + k : "No tag");
      if (shelf) c.append(shelf);
      c.append(boardMarquee(el("div", {class: "boardwrap boardscroll", data: {keepScroll: "nextboard"}},
        tagBoard(acts, "next", {by, hidden: putAway, hideBtn: k => colHideBtn(by, k)})), "task"));
      return c;
    }
    const board = el("div", {class: "board ctxboard"});
    const takesFor = ctx => (kind, x) => kind === "task" && (x.action.context || null) !== ctx;
    const moveTo = ctx => x => {
      const a = x.action, prev = a.context;
      inSpace(a.space, () => ctx ? replaceContextLink(a.path, a.block, ctx) : removeContextLink(a.path, a.block));
      return () => inSpace(a.space, () => prev ? replaceContextLink(a.path, a.block, prev) : removeContextLink(a.path, a.block));
    };
    /* A context with nothing in it is a pill rather than an empty column: drop
       a card on it and it has a todo, so it is a column from then on. */
    const empty = ctxFolderOrder(allContextNames().filter(k => !ctxs.includes(k)));
    /* "No context yet" is the same: a column only while something is in it.
       Emptied, it waits as a pill too, so a card can still be dropped on it to
       take its context off. */
    const unsorted = acts.some(a => !a.context);
    if (empty.length || !unsorted) {
      // One column per context, or per folder of them with its children under it.
      const cols = new Map();
      for (const k of empty) {
        const top = ctxTop(k);
        let col = cols.get(top);
        if (!col) {
          col = el("div", {class: "fcol"});
          if (k !== top) col.append(el("span", {class: "fcolhead"}, "@" + top));
          cols.set(top, col);
        }
        const icon = contextIcon(k);
        col.append(boardDropTarget(el("span", {class: "fchip", title: "Drop a card here to do it at " + contextLabel(k)},
          k === top ? contextLabel(k) : (icon ? icon + " " : "") + k.slice(top.length + 1)), takesFor(k), moveTo(k)));
      }
      const none = unsorted ? null : el("div", {class: "fcol"}, boardDropTarget(el("span",
        {class: "fchip", title: "Drop a card here to take its context off"}, "No context"), takesFor(null), moveTo(null)));
      c.append(el("div", {class: "ctxdrops"}, el("span", {class: "say"}, "Empty contexts"), none, ...cols.values()));
    }
    const shelf = hiddenColsBar(by, k => k ? contextLabel(k) : "No context yet");
    if (shelf) c.append(shelf);
    // Tasks with no context come first, on the left, so they get sorted.
    for (const ctx of orderedCols(by, (unsorted ? ["", ...ctxs] : ctxs)).map(k => k || null)) {
      if (putAway.has(ctx || "")) continue;
      const items = acts.filter(a => (a.context || null) === ctx);
      const col = boardColumn(
        el("div", {class: "bcol-head"}, el("span", {}, ctx ? contextLabel(ctx) : "No context yet"),
          el("span", {class: "n"}, String(items.length)), colHideBtn(by, ctx || "")),
        takesFor(ctx), moveTo(ctx));
      if (!ctx && !board.children.length) col.classList.add("pin");
      colDraggable(col, by, ctx || "");
      col.append(fillBoardColumn(el("div", {class: "bcol-body", data: {keepScroll: "next:" + (ctx || "")}}),
        items, "next:" + (ctx || ""), boardCard));
      board.append(col);
    }
    c.append(boardMarquee(el("div", {class: "boardwrap boardscroll", data: {keepScroll: "nextboard"}}, board), "task"));
    return c;
  }

  const side = sided ? nextSide() : null;
  const guess = PHONE.matches && !state.ctxFilter && side !== "chores" ? nextGuessCtx(acts) : null;
  const ctx = state.ctxFilter || (guess && guess.ctx) || null;
  const kidsChip = ctx && ctx !== CTX_NONE && ctxHasKids(ctx)
    ? ctxKidsChip(acts.filter(a => inContext(a, ctx, true) && a.context !== ctx).length) : null;
  // A guess leaves the chores be: they have their own side.
  if (ctx === CTX_NONE) acts = acts.filter(a => !a.context);
  else if (ctx) acts = acts.filter(a => (guess && isChore(a)) || inContext(a, ctx));
  /* The contexts the board has put away are left off the list as well: one
     chip each, pressed while it is shown, so the two views agree. */
  const putAway = hiddenCols("ctx");
  const ctxChips = ctx ? null : shownChips("ctx", "Contexts shown",
    (acts.some(a => !a.context) || putAway.has("") ? [""] : []).concat(ctxs),
    k => k ? contextLabel(k) : "No context", k => acts.filter(a => (a.context || "") === k).length);
  if (!ctx) acts = acts.filter(a => !putAway.has(a.context || ""));
  const sideN = {todo: acts.filter(a => !isChore(a)).length, chores: acts.filter(isChore).length};
  if (side) acts = acts.filter(a => isChore(a) === (side === "chores"));
  if (est.plan) acts = planFill(acts, est.plan);
  sortActs(acts);
  // Focus deals this very list one at a time (#360); another context ends it.
  if (ENGAGE && (ENGAGE.ctx !== ctx || !document.body.classList.contains("bookfocus"))) ENGAGE = null;
  if (ENGAGE) return engageView(acts, ctx);
  sortSel.classList.add("right");
  const f = textFilter("next", "Filter next actions", acts, taskHay,
    (hits, q) => (ctx ? taskCard : contextGroupedCard)(hits, noMatch(q, side === "chores" ? "No chores now." :
      ctx === CTX_NONE ? "Nothing to do with no context." :
      ctx ? "Nothing to do at " + contextLabel(ctx) + "." : "Nothing on your plate. Add one at the top.")));
  const sideBtn = (id, label) => el("button", {class: "nsidebtn", "aria-pressed": String(side === id),
    title: id === "chores" ? "Chores at home: shown first before and after work, and on days off" : "Next actions: shown first in work hours",
    onclick: () => side === id ? null : setNextSide(id)},
    label, el("span", {class: "nbadge", "aria-label": sideN[id] + " open"}, String(sideN[id])));
  const sides = side ? el("div", {class: "nside", role: "group", "aria-label": "To do or chores"},
    sideBtn("todo", "To do"), sideBtn("chores", "Chores")) : null;
  /* On a phone the list is the screen, as in a plain to-do app: the filters
     fold behind one Filter button, which counts what is filtered away so a
     short list never looks like a bug. A wider screen shows them as before. */
  const filtered = hidden.size + (ctx ? 1 : 0) + (choresOn ? 0 : 1) + (types.cur ? 1 : 0) + (est.cur ? 1 : 0) +
    (ctx ? 0 : putAway.size) + (trim(LIST_Q.get("next") || "") ? 1 : 0);
  const fold = el("div", {class: "nfold" + (NEXT_FILTERS_OPEN ? " open" : "")}, fbar(f.input,
    fchip("To do", stateOn("TODO"), () => toggleState("TODO")),
    fchip("Doing", stateOn("DOING"), () => toggleState("DOING")), choreChip(),
    (ctxs.length || all.some(a => !a.context)) ? fselect("Context", ctx || "", [["", "Anywhere"],
      ...(all.some(a => !a.context) ? [[CTX_NONE, "No context"]] : []),
      ...ctxs.map(k => [k, contextLabel(k)])],
      v => { senseLearn("ctx", v || "*"); if (!v) NEXT_GUESS_OFF = hourKey(); go("next", {ctxFilter: v || null}); }) : null, kidsChip,
    types.sel, est.sel, sortSel, sortDot), ctxChips,
    // Look-alikes are upkeep, not doing: on a phone they wait in here.
    twins ? el("div", {class: "ntwins"}, el("button", {class: "textbtn twinbtn", onclick: () => openNextTwins()},
      svgIcon(ICON_WARN), " " + twins + " look alike")) : null);
  const fbtn = el("button", {class: "textbtn nfiltbtn" + (filtered ? " on" : "") + (twins ? " twins" : ""), "aria-expanded": String(NEXT_FILTERS_OPEN),
    title: filtered ? filtered + " filters on" : "Filter, sort and pick contexts",
    onclick: () => { NEXT_FILTERS_OPEN = !NEXT_FILTERS_OPEN; render(); }},
    "Filter" + (filtered ? " · " + filtered : "") + (NEXT_FILTERS_OPEN ? " ▴" : " ▾"));
  c.querySelector(".vhead-r").prepend(fbtn);
  // Focus once a context is picked: GTD picks where you are first (#360).
  if (ctx && acts.length) fbtn.before(el("button", {class: "textbtn focusbtn",
    title: "One action at a time at " + (ctx === CTX_NONE ? "no context" : contextLabel(ctx)) + ": no sidebar, no bar (Esc leaves)",
    onclick: () => startEngage(ctx)}, "Focus"));
  // One reading column at every width: groups read top down, most urgent first (#315).
  c.classList.add("nextlist");
  if (ctx && side !== "chores") c.classList.add("onectx");
  const guessBar = guess ? el("div", {class: "nguess"},
    el("span", {}, "📍 ", el("strong", {}, contextLabel(guess.ctx))), el("span", {class: "nguess-why"}, guess.why),
    el("button", {class: "textbtn", title: "Show every context for the next hour",
      onclick: () => { senseLearn("ctx", "*"); NEXT_GUESS_OFF = hourKey(); render(); }}, "Show all")) : null;
  c.append(...[sides, guessBar, fold, f.host].filter(Boolean));
  const held = heldActions();
  if (held.length) c.append(el("details", {class: "section fold"},
    el("summary", {}, "On hold", el("span", {class: "n"}, String(held.length))),
    taskCard(held)));
  return c;
}
