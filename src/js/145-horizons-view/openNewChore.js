/* What, where, how often and how long: each picked from a list. The room
   the view is narrowed to is the one picked to start with. */
function openNewChore(roomKey) {
  const NEW = "\u0002";
  const what = el("input", {placeholder: "Wipe the counters", "aria-label": "What"});
  const rooms = ctxFolderOrder(allContextNames().filter(k => atHome(k) && k.includes("/")));
  const newRoom = el("input", {placeholder: "kitchen", "aria-label": "New room"});
  const roomSel = fselect("Room", "", [...rooms.map(k => [k, roomLabel(k)]), ["", "No room"], [NEW, "New room…"]], v => {
    newRoom.hidden = v !== NEW;
    if (!newRoom.hidden) newRoom.focus();
  });
  roomSel.value = roomKey && rooms.includes(roomKey.slice(1)) ? roomKey.slice(1) : "";
  newRoom.hidden = true;
  const freq = fselect("How often", "weekly", REPEAT_CHOICES.filter(Boolean).map(r => [r, r[0].toUpperCase() + r.slice(1)]), () => {});
  const size = fselect("How long", "0", [["0", "Not sized"], ["1", "15 minutes"], ["2", "30 minutes"],
    ["3", "45 minutes"], ["4", "An hour or more"]], () => {});
  const first = fselect("First one", "today", [["today", "Today"], ["tomorrow", "Tomorrow"], ["round", "In one round"]], () => {});
  const save = () => {
    const words = trim(what.value);
    if (!words) { what.focus(); return; }
    const room = roomSel.value === NEW ? trim(newRoom.value).replace(/^@/, "") : roomSel.value;
    // Every chore is at home: a new room is made inside @home, as @home is written.
    const ctx = ctxSlug(!room ? CHORE_HOME : atHome(room) ? room : CHORE_HOME + "/" + room);
    closeModal();
    const path = contextPath(ctx);
    if (!getPage(path)) putPage(path, pageTemplateFor("c", ctx));
    const b = newBlock({state: "TODO", title: withEst(words, Number(size.value)) + " [[c/" + ctx + "]]"});
    setBlockProp(b, REPEAT_PROP, freq.value);
    const day = first.value === "today" ? todayISO() : first.value === "tomorrow" ? shiftISO(todayISO(), 1)
      : nextRepeatDate(freq.value, todayISO());
    setBlockProp(b, "SCHEDULED", whenValue(day));
    stampAuthor(b);
    stampAddedIfMissing(path, b);
    getPage(path).blocks.push(b);
    touch(path);
    const space = V.space;
    pushUndo({run: () => { if (V.space !== space) return false; dropBlockById(b.id); render(); return true; }});
    render();
    notify("Added: " + words + ", " + freq.value + ", first on " + humanDate(day) + ".");
  };
  what.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); save(); } });
  modal({
    center: true, title: "New chore",
    body: el("div", {},
      el("div", {class: "field"}, el("label", {}, "What"), what),
      el("div", {class: "field"}, el("label", {}, "Room"), roomSel, newRoom),
      el("div", {class: "field"}, el("label", {}, "How often"), freq),
      el("div", {class: "field"}, el("label", {}, "How long"), size),
      el("div", {class: "field"}, el("label", {}, "First one"), first)),
    foot: [el("button", {class: "btn ghost", onclick: () => closeModal()}, "Cancel"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: save}, "Add chore")],
  });
  requestAnimationFrame(() => what.focus());
}
