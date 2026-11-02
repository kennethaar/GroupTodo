/* ============================================================
   WAITING FOR -- what you handed over and are owed back
   ============================================================ */
function viewWaiting() {
  const sub = subNow();
  const c = el("div", {class: "wrap" + (sub === "board" ? " wide" : "")});
  c.append(vhead("Waiting for", "What you handed over and are owed back",
    csvBtn(() => rows, "waiting-for"), viewSeg("waiting")));
  const due = stakeholdersDue();
  if (due.length) c.append(stakeDueCard(due));
  const f = {late: PREF.get("waiting.late", "") === "1", asked: PREF.get("waiting.notAsked", "") === "1"};
  const flip = k => { PREF.set(k, PREF.get(k, "") === "1" ? "" : "1"); render(); };
  const all = waitingRows().concat(mentionRows());
  const types = typeFilter(all, "waiting.type");
  const est = estFilter(all, "waiting.est");
  // By date by default, the order Waiting for always had.
  const {sel: sortSel, apply: sortRows, dot: sortDot} = taskSort("waiting", "date");
  const rows = sortRows(all.filter(a => (!f.late || (a.due && a.due < todayISO())) && (!f.asked || askedDays(a.block) == null))
    .filter(types.keep).filter(est.keep));
  const nameOf = a => a.mention || a.assignee || "Nobody named";
  const groupBy = list => {
    const by = new Map();
    for (const a of list) { const k = slugPerson(nameOf(a)); if (!by.has(k)) by.set(k, {name: nameOf(a), items: []}); by.get(k).items.push(a); }
    return by;
  };
  const by = groupBy(rows);
  const askLine = name => {
    const owing = (by.get(slugPerson(name)) || {items: []}).items;
    const asked = owing.map(a => askedDays(a.block)).filter(d => d != null);
    const told = owing.map(a => informedDays(a.block)).filter(d => d != null);
    return (isMember(name) ? "in the area" : asked.length ? "asked " + Math.min(...asked) + "d ago" : "never asked") +
      (told.length ? " · told " + Math.min(...told) + "d ago" : "");
  };
  const askBtn = name => name === "Nobody named" ? null : personActionBtn(name, isMember(name));
  const chips = [fchip("Overdue", f.late, () => flip("waiting.late"), all.filter(a => a.due && a.due < todayISO()).length),
    fchip("Not asked yet", f.asked, () => flip("waiting.notAsked")), types.sel, est.sel, sortSel, sortDot,
    el("span", {class: "right"}, ...replyActions(),
      el("button", {class: "textbtn", onclick: showWaitingFeedback}, "As text"))];

  if (sub === "board") {
    const byTag = PREF.get("waiting.boardBy", "person") === "tag";
    c.append(fbar(...chips.slice(0, 2), boardBySelect("waiting.boardBy", [["person", "By person"], ["tag", "By tag"]]), ...chips.slice(2)));
    BOARD_ITEMS = new Map();
    const wby = byTag ? "waiting.tag" : "waiting.person";
    const putAway = hiddenCols(wby);
    if (byTag) {
      const shelf = hiddenColsBar(wby, k => k ? "#" + k : "No tag");
      if (shelf) c.append(shelf);
      c.append(el("div", {class: "boardwrap boardscroll", data: {keepScroll: "waitboard"}},
        tagBoard(rows, "wait", {by: wby, hidden: putAway, hideBtn: k => colHideBtn(wby, k)})));
      c.append(el("p", {class: "hint"}, "Drag a card to another column to tag it that instead."));
      return c;
    }
    /* Only people you are actually waiting on: anything with nobody named
       first, then most-named first as on the People page, then the rest. */
    const names = Array.from(new Map([
      ...(by.has(slugPerson("Nobody named")) ? [[slugPerson("Nobody named"), "Nobody named"]] : []),
      ...peopleRows().filter(p => !p.me && by.has(slugPerson(p.name))).map(p => [slugPerson(p.name), p.name]),
      ...Array.from(by.values()).map(g => [slugPerson(g.name), g.name])]).values());
    const board = el("div", {class: "board ctxboard"});
    const nameOfSlug = new Map(names.map(n => [slugPerson(n), n]));
    const shelf = hiddenColsBar(wby, k => nameOfSlug.get(k) || k);
    if (shelf) c.append(shelf);
    for (const name of orderedCols(wby, names.map(slugPerson)).map(k => nameOfSlug.get(k))) {
      if (putAway.has(slugPerson(name))) continue;
      const items = (by.get(slugPerson(name)) || {items: []}).items;
      const col = boardColumn(
        el("div", {class: "bcol-head"}, name === "Nobody named" ? null : avatarNode(name, 22),
          el("span", {title: name, style: "flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"}, name),
          el("span", {class: "n"}, String(items.length)), colHideBtn(wby, slugPerson(name))),
        // Something to ask somebody is yours, so it is not handed on by a drag.
        (kind, x) => kind === "task" && !x.action.mention && name !== "Nobody named" && !samePerson(nameOf(x.action), name),
        x => {
          const a = x.action, prev = a.assignee;
          inSpace(a.space, () => assignBlock(a.path, a.block, name));
          return () => inSpace(a.space, () => assignBlock(a.path, a.block, prev || ""));
        });
      colDraggable(col, wby, slugPerson(name));
      col.append(el("div", {class: "bcol-sub"}, askLine(name), askBtn(name)));
      col.append(fillBoardColumn(el("div", {class: "bcol-body", data: {keepScroll: "wait:" + slugPerson(name)}}), items, "wait:" + slugPerson(name), boardCard));
      board.append(col);
    }
    if (!names.length) {
      c.append(taskCard([], all.length ? "Nobody owes you anything that matches." : "Nobody owes you anything."));
      return c;
    }
    if (!board.children.length) {
      c.append(taskCard([], "Every column is hidden. Click one above to show it again."));
      return c;
    }
    c.append(el("div", {class: "boardwrap boardscroll", data: {keepScroll: "waitboard"}}, board));
    c.append(el("p", {class: "hint"}, "Drag a card to another person to hand it to them instead."));
    return c;
  }
  /* Grouped by who owes it; the filter keeps the grouping. A person put away
     on the board is left off the list too, with a chip to bring them back. */
  const putAway = hiddenCols("waiting.person");
  const groups = Array.from(by.values()).concat(Array.from(putAway).filter(k => !by.has(k))
    .map(k => ({name: (peopleRows().find(p => slugPerson(p.name) === k) || {name: k}).name, items: []})));
  const peopleChips = shownChips("waiting.person", "People shown",
    groups.sort((x, y) => (x.name === "Nobody named" ? 0 : 1) - (y.name === "Nobody named" ? 0 : 1) || x.name.localeCompare(y.name))
      .map(g => slugPerson(g.name)),
    k => (groups.find(g => slugPerson(g.name) === k) || {name: k}).name, k => (by.get(k) || {items: []}).items.length);
  const listed = rows.filter(a => !putAway.has(slugPerson(nameOf(a))));
  const f2 = textFilter("waiting", "Filter waiting for", listed, taskHay, (hits, q) => {
    if (!hits.length) return taskCard([], noMatch(q, all.length ? "Nobody owes you anything that matches." : "Nobody owes you anything."));
    // Nobody named first, as on the board: those are the ones still to sort out.
    const unnamed = g => g.name === "Nobody named" ? 0 : 1;
    const groups = Array.from(groupBy(hits).values())
      .sort((x, y) => unnamed(x) - unnamed(y) || x.name.localeCompare(y.name));
    /* Each group rations its own rows, which is no ration at all with a few
       rows owed by each of a hundred people: whole groups are drawn up to a
       page's worth of rows, and the rest wait behind "show more". */
    const host = el("div", {});
    let drawn = 0;
    const drawTo = rows => {
      let shown = 0;
      while (drawn < groups.length && (shown < rows || !shown)) {
        const g = groups[drawn++];
        shown += g.items.length;
        host.insertBefore(el("div", {class: "group"},
          g.name === "Nobody named" ? null : avatarNode(g.name, 24),
          el("span", {class: "plain", style: "font-weight:600;color:var(--fg)"}, g.name),
          el("span", {class: "plain"}, "· " + askLine(g.name)), askBtn(g.name)), more);
        host.insertBefore(taskCard(g.items), more);
      }
      const left = groups.length - drawn;
      if (!left) { more.remove(); return; }
      more.set("Show more · " + left + (left === 1 ? " more person" : " more people"), "Show everyone");
    };
    const more = moreRow(() => drawTo(CFG.rowsPerPage), () => drawTo(Infinity));
    host.append(more);
    drawTo(CFG.rowsPerPage);
    return host;
  });
  c.append(fbar(f2.input, ...chips), peopleChips, f2.host);
  return c;
}
