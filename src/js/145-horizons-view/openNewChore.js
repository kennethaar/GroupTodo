/* What, where, how often and how long: each picked from a list. As needed
   (#239) has no first one: it waits on Chores for Did it. */
function openNewChore(roomKey) {
  const what = el("input", {placeholder: "Wipe the counters", "aria-label": "What"});
  const room = choreRoomPick(roomKey);
  const firstField = el("div", {class: "field"});
  const freq = fselect("How often", "weekly", [...REPEAT_CHOICES.filter(Boolean).map(r => [r, r[0].toUpperCase() + r.slice(1)]),
    [AS_NEEDED, "As needed"]], v => { firstField.hidden = isAsNeeded(v); });
  const size = choreSizePick();
  const first = fselect("First one", "today", [["today", "Today"], ["tomorrow", "Tomorrow"], ["round", "In one round"]], () => {});
  firstField.append(el("label", {}, "First one"), first);
  const save = () => {
    const words = trim(what.value);
    if (!words) { what.focus(); return; }
    const ctx = room.ctx();
    closeModal();
    const path = ensureRoomPage(ctx);
    const needed = isAsNeeded(freq.value);
    // As needed is a plain line, not a task: never late, never on Next.
    const b = newBlock({state: needed ? "" : "TODO", title: choreLine(words, ctx, Number(size.value))});
    setBlockProp(b, REPEAT_PROP, freq.value);
    const day = first.value === "today" ? todayISO() : first.value === "tomorrow" ? shiftISO(todayISO(), 1)
      : nextRepeatDate(freq.value, todayISO());
    if (!needed) {
      setBlockProp(b, "SCHEDULED", whenValue(day));
      stampAuthor(b);
      stampAddedIfMissing(path, b);
    }
    getPage(path).blocks.push(b);
    touch(path);
    clearMemo();
    const space = V.space;
    pushUndo({run: () => { if (V.space !== space) return false; dropBlockById(b.id); render(); return true; }});
    render();
    notify(needed ? "Added: " + words + ", as needed. Did it on Chores counts it."
      : "Added: " + words + ", " + freq.value + ", first on " + humanDate(day) + ".");
  };
  what.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); save(); } });
  modal({
    center: true, title: "New chore",
    body: el("div", {},
      el("div", {class: "field"}, el("label", {}, "What"), what),
      el("div", {class: "field"}, el("label", {}, "Room"), room.sel, room.input),
      el("div", {class: "field"}, el("label", {}, "How often"), freq),
      el("div", {class: "field"}, el("label", {}, "How long"), size),
      firstField),
    foot: [el("button", {class: "btn ghost", onclick: () => closeModal()}, "Cancel"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: save}, "Add chore")],
  });
  requestAnimationFrame(() => what.focus());
}
