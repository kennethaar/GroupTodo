function openLogChore(roomKey) {
  const recent = choreRecent();
  const list = el("datalist", {id: "logchore-recent"}, ...recent.map(r => el("option", {value: r.words})));
  const what = el("input", {placeholder: "Laundry", "aria-label": "What", list: "logchore-recent"});
  const room = choreRoomPick(roomKey);
  const size = choreSizePick();
  const crew = choreCrew(), me = whoAmI();
  const who = crew.length > 1 ? fselect("Who did it", (crew.find(m => m.me) || crew[0]).name,
    crew.map(m => [m.name, m.me ? "Me" : m.name]), () => show()) : null;
  const dayInput = el("input", {type: "date", value: shiftISO(todayISO(), -2), max: todayISO(), "aria-label": "Day"});
  dayInput.hidden = true;
  const when = fselect("When", "today", [["today", "Today"], ["yesterday", "Yesterday"], ["day", "Another day…"]], v => {
    dayInput.hidden = v !== "day";
    if (!dayInput.hidden) dayInput.focus();
    show();
  });
  const dayOf = () => when.value === "yesterday" ? shiftISO(todayISO(), -1)
    : when.value === "day" && dateIn(dayInput.value) && dayInput.value <= todayISO() ? dayInput.value : todayISO();
  // What it writes, so the line in the file is no surprise.
  const where = el("label", {}), line = el("div", {class: "logchore-line"});
  function show() {
    const day = dayOf(), by = who ? who.value : me;
    where.textContent = day === todayISO() ? "Goes on today's page" : "Goes on the page for " + humanDate(day);
    line.textContent = "DONE " + choreLine(trim(what.value) || "…", room.ctx(), size.value) +
      (by ? "  done_by:: " + by : "");
  }
  what.addEventListener("input", () => {
    const r = recent.find(r => r.words.toLowerCase() === trim(what.value).toLowerCase());
    if (r) { room.set(r.ctx); size.value = r.size; }
    show();
  });
  for (const n of [room.sel, room.input, size, dayInput]) { n.addEventListener("input", show); n.addEventListener("change", show); }
  const save = () => {
    const words = trim(what.value);
    if (!words) { what.focus(); return; }
    const ctx = room.ctx();
    closeModal();
    ensureRoomPage(ctx);
    logChore(words, ctx, size.value, who ? who.value : me, dayOf());
  };
  what.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); save(); } });
  modal({
    center: true, title: "Log a chore",
    body: el("div", {}, list,
      el("div", {class: "field"}, el("label", {}, "What"), what),
      el("div", {class: "field"}, el("label", {}, "Room"), room.sel, room.input),
      el("div", {class: "field"}, el("label", {}, "Duration"), size),
      who ? el("div", {class: "field"}, el("label", {}, "Who did it"), who) : null,
      el("div", {class: "field"}, el("label", {}, "When"), when, dayInput),
      el("div", {class: "field"}, where, line)),
    foot: [el("button", {class: "btn ghost", onclick: () => closeModal()}, "Cancel"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: save}, "Log it")],
  });
  show();
  requestAnimationFrame(() => what.focus());
}
