function viewChores() {
  const c = el("div", {class: "wrap"});
  const all = choreRows(), held = allChores().filter(a => a.held), needed = asNeededChores();
  c.append(vhead("Chores", "The home at a glance",
    all.length ? el("button", {class: "textbtn awaybtn", title: "Hold every chore until you are back",
      onclick: () => openChoresAway()}, "Away until…") : null,
    all.length ? el("button", {class: "textbtn printbtn", title: "Print what is due now and this week, by room",
      onclick: () => printChores([...by.due, ...by.soon], rooms, roomOf, nameOf,
        [room ? nameOf(room) : "", PREF.get("chores.group", "") === "chore" ? "by chore" : "", person ? firstNameOf(person) : everyone ? "" : firstNameOf(whoAmI())])}, "Print") : null,
    el("button", {class: "textbtn logchore", title: "Count something done at home that has no rhythm, like the laundry",
      onclick: () => openLogChore(PREF.get("chores.room", ""))}, "+ Log a chore"),
    newBtn("chore", () => openNewChore(PREF.get("chores.room", "")))));
  if (!all.length && held.length) {
    const back = held.map(a => a.held).sort().pop();
    c.append(el("div", {class: "card"}, el("div", {class: "empty"},
      "You are away until " + humanDate(back) + ". Every chore waits until then. ",
      el("button", {class: "btn sm primary", onclick: () => choresBack(held)}, "Back now"))));
    if (needed.length) c.append(asNeededFold(needed));
    return c;
  }
  if (!all.length) {
    if (needed.length) c.append(asNeededFold(needed), choreBoard());
    else c.append(emptyCard("No chores yet. A chore is a task that repeats at @home or a room in it, like @home/kitchen. ",
      el("button", {class: "textbtn", onclick: () => openNewChore("")}, "+ Add one")));
    return c;
  }

  /* A room is the first folder inside @home: @home/kitchen/fridge is in the
     kitchen. A chore at @home itself is "@", in no room. */
  const roomOf = a => {
    const top = a.context.split("/").slice(0, 2).join("/");
    return top.includes("/") ? "@" + top : "@";
  };
  const byName = [...new Set(all.map(roomOf))].sort((x, y) => (x === "@") - (y === "@") || x.localeCompare(y));
  const room = byName.includes(PREF.get("chores.room", "")) ? PREF.get("chores.room", "") : "";
  const pick = k => { PREF.set("chores.room", room === k ? "" : k); render(); };
  const home = freshScore(all);
  const nameOf = k => k === "@" ? "Rest of home" : roomLabel(k.slice(1));
  const sum = new Map(byName.map(k => [k, roomSummary(all.filter(a => roomOf(a) === k),
    ctx => (ctx.includes("/") ? "@" + ctx.split("/").slice(0, 2).join("/") : "@") === k)]));
  /* Sorted by name, or by freshness either way; the board's columns follow it. */
  const sort = ["stale", "fresh"].includes(PREF.get("chores.sort", "")) ? PREF.get("chores.sort", "") : "";
  const pctOf = k => sum.get(k).pct ?? 100;
  const rooms = sort ? [...byName].sort((x, y) => (sort === "stale" ? pctOf(x) - pctOf(y) : pctOf(y) - pctOf(x))) : byName;
  const several = byName.length > 1 || byName[0] !== "@";
  const board = several && PREF.get("chores.layout", "") === "board";
  const layout = v => { PREF.set("chores.layout", v); render(); };
  c.append(el("div", {class: "card chorehome"},
    el("div", {class: "chorehome-h"}, el("span", {}, "Home"),
      home == null ? null : el("strong", {style: "color:" + freshColor(home),
        title: "100% is every chore just done, 0% all due"}, home + "% fresh"),
      several ? el("div", {class: "chorehome-tools"},
        el("span", {class: "chorelayout"}, fchip("Grid", !board, () => layout("")), fchip("Board", board, () => layout("board"))),
        fselect("Sort rooms", sort, [["", "Name"], ["stale", "Stalest first"], ["fresh", "Freshest first"]],
          v => { PREF.set("chores.sort", v); render(); })) : null),
    several && !board ? el("div", {class: "chorerooms"}, ...rooms.map(k => {
      const pct = sum.get(k).pct;
      return el("button", {class: "choreroom", "aria-pressed": String(room === k),
        title: room === k ? "Show every room again" : "Show only this room", onclick: () => pick(k)},
        el("span", {class: "choreroom-n"}, nameOf(k)),
        el("span", {class: "freshbar"}, el("i", {style: "width:" + (pct ?? 0) + "%;background:" + freshColor(pct ?? 0)})),
        el("span", {class: "choreroom-p"}, pct == null ? "–" : pct + "%"));
    })) : null));
  /* The board: a column for each band, red, yellow and green, in the order of
     the sort. A room's column comes from its freshness, so nothing is dragged. */
  if (board) {
    const bands = sort === "fresh" ? [...CHORE_BANDS].reverse() : CHORE_BANDS;
    c.append(el("div", {class: "chorecols"}, ...bands.map(band => {
      const list = rooms.filter(k => CHORE_BANDS[freshBand(pctOf(k))] === band);
      const open = CHORE_COLS_OPEN.has(band.id), shown = open ? list : list.slice(0, CHORE_COL_MAX);
      return el("div", {class: "chorecol " + band.id},
        el("div", {class: "chorecol-h", style: "border-color:var(--" + band.tone + ")"},
          el("span", {style: "color:var(--" + band.tone + ")"}, band.label), " ",
          el("span", {class: "say"}, band.range), el("span", {class: "n"}, String(list.length))),
        ...shown.map(k => roomCard(nameOf(k), sum.get(k), room === k, () => pick(k))),
        list.length > shown.length ? el("button", {class: "textbtn chorecol-more",
          onclick: () => { CHORE_COLS_OPEN.add(band.id); render(); }}, "+ " + (list.length - shown.length) + " more") : null,
        !list.length ? el("div", {class: "say chorecol-none"}, "No room") : null);
    })));
    if (room) c.append(roomCloseup(nameOf(room), sum.get(room), held.filter(a => roomOf(a) === room)));
  }

  /* Mine, one person's or everyone's, once there is more than one of you.
     A person's is what is handed to them, so a child can be shown just
     theirs on the family tablet (#236). */
  const crew = choreCrew(), shared = crew.length > 1, whoPref = PREF.get("chores.who", "");
  const others = crew.filter(m => !m.me);
  const person = (others.find(m => samePerson(m.name, whoPref)) || {}).name || "";
  const everyone = !shared || whoPref === "all";
  const inRoom = all.filter(a => !room || roomOf(a) === room);
  const keep = a => everyone || (person ? !!a.assignee && samePerson(a.assignee, person) : a.mine);
  const setWho = v => { PREF.set("chores.who", v); render(); };
  if (shared) c.append(Object.assign(fbar(
    fchip("Mine", !everyone && !person, () => setWho(""), inRoom.filter(a => a.mine).length),
    ...others.map(m => fchip(firstNameOf(m.name), person === m.name, () => setWho(m.name),
      inRoom.filter(a => a.assignee && samePerson(a.assignee, m.name)).length)),
    fchip("Everyone", everyone, () => setWho("all"), inRoom.length)), {className: "fbar chorewho"}));
  const rows = inRoom.filter(keep);
  const by = {due: [], soon: [], fresh: []};
  for (const a of rows) by[choreGroup(a)].push(a);
  /* Group by Room (the sections below) or by Chore (#260); Print follows it. */
  const byChore = PREF.get("chores.group", "") === "chore";
  c.append(el("div", {class: "chorehome-tools"}, fselect("Group by", byChore ? "chore" : "", [["", "Room"], ["chore", "Chore"]],
    v => { PREF.set("chores.group", v); render(); })));
  const opts = {journal: true, nextNow: true};
  if (byChore) {
    c.append(...choreByChore(rows, roomOf).map(g => section(g.name, null, taskCard(g.list, null, opts),
      el("span", {class: "say", style: "margin-left:8px;font-weight:400"}, g.says), "choregroup")));
    if (!rows.length) c.append(emptyCard("Nothing to group here."));
  } else {
    const total = list => { const t = choreTotal(list); return t ? el("span", {class: "say", style: "margin-left:8px;font-weight:400"}, "· " + t) : null; };
    const rounds = a => (freshnessOf(a) || {rounds: 0}).rounds;
    const byDay = (x, y) => (x.due || "9").localeCompare(y.due || "9");
    by.due.sort((x, y) => rounds(y) - rounds(x));
    by.soon.sort(byDay); by.fresh.sort(byDay);
    c.append(section("Due now", by.due.length, taskCard(by.due, "Nothing due. The home is on top of things.", opts), total(by.due)));
    const fold = (title, list, sum) => list.length ? el("details", {class: "section fold"},
      el("summary", {}, title, el("span", {class: "n"}, String(list.length)), sum || null), taskCard(list, null, opts)) : null;
    c.append(...[fold("Coming up this week", by.soon, total(by.soon)), fold("Fresh", by.fresh), fold("On hold", held)].filter(Boolean));
  }
  const neededHere = needed.filter(a => !room || (a.ctx.includes("/") ? "@" + a.ctx.split("/").slice(0, 2).join("/") : "@") === room);
  if (neededHere.length) c.append(asNeededFold(neededHere));
  c.append(choreBoard());
  return c;
}
