function openDueChipMenu(a, anchor) {
  const {path, block, space} = a;
  const w = dueWhen(block) || {day: a.due || todayISO(), time: null};
  const today = todayISO();
  const timeIn_ = el("input", {value: w.time || "", placeholder: "14:30, kl 13, in 45 minutes", autocomplete: "off"});
  const dateIn_ = el("input", {type: "date", value: w.day});
  const remindSel = el("select", {});
  remindSel.append(el("option", {value: ""}, (remindUsual() ? leadWords(remindUsual()) + " before" : "At the time") + " (usual)"));
  for (const [v, label] of REMIND_CHOICES) remindSel.append(el("option", {value: v}, label));
  const had = trim(blockProp(block, "remind") || "");
  if (had && !REMIND_CHOICES.some(([v]) => v === had)) remindSel.append(el("option", {value: had}, had + " before"));
  remindSel.value = had;
  let remindTouched = false;
  remindSel.addEventListener("change", () => { remindTouched = true; });

  /* Every change goes through here: the props as they were are kept for
     ctrl-z, and the reminder is armed afresh for the new time. */
  const apply = (day, time, opts = {}) => inSpace(space, () => {
    const before = structuredClone(block.props || {});
    if (day === null) clearDates(path, block);
    else {
      setDue(block, day, time);
      const r = remindTouched ? remindSel.value : opts.now ? (had || "0") : had;
      if (r) setBlockProp(block, "remind", r);
      else for (const k of Object.keys(block.props)) if (k.toLowerCase() === "remind") delete block.props[k];
    }
    remindRearm(block);
    pushUndo({run: () => inSpace(space, () => {
      if (!getPage(path)) return false;
      block.props = structuredClone(before);
      touch(path); render();
      notify("Time put back.");
      return true;
    })});
    touch(path); noteTodoTouched(); render();
    if (day !== null) notify((block.state ? "Now " : "") + humanWhen(day, time) + ".");
  });
  const save = () => {
    const got = whenFromBox(timeIn_.value, dateIn_.value || w.day);
    if (!got) { notify("That is not a time I can read. Try 14:30, 0843, kl 13 or in 45 minutes.", "warn"); timeIn_.focus(); return; }
    closeModal();
    apply(got.day, got.time, {now: got.now});
  };
  timeIn_.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); save(); } });
  dateIn_.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); save(); } });

  /* A shift moves the time from where it is -- or from now, once that has
     gone by, since ten minutes after a time already past is still past. */
  const shift = mins => {
    const ahead = w.time && minutesUntil(w.day, w.time) > 0;
    const m = (ahead ? hmMinutes(w.time) : hmMinutes(nowHM())) + mins;
    closeModal();
    apply(shiftISO(ahead ? w.day : today, Math.floor(m / 1440)), pad2(Math.floor(m % 1440 / 60)) + ":" + pad2(m % 60));
  };
  const btn = (label, run, title) => el("button", {class: "btn sm ghost", title, onclick: run}, label);
  const dayBtn = (label, iso) => btn(label, () => { dateIn_.value = iso; timeIn_.focus(); });
  const row = (label, ...kids) => el("div", {class: "field"}, el("label", {}, label), el("div", {class: "whenrow"}, ...kids));
  const body = el("div", {class: "whenpop"},
    row("Time", timeIn_),
    row("Day", dayBtn("Today", today), dayBtn("Tomorrow", shiftISO(today, 1)), dateIn_),
    row("Move it", btn("+10 min", () => shift(10)), btn("+1 h", () => shift(60)),
      btn("Tomorrow, same time", () => { closeModal(); apply(shiftISO(w.day < today ? today : w.day, 1), w.time); }),
      btn("Next week", () => { closeModal(); apply(shiftISO(w.day < today ? today : w.day, 7), w.time); })),
    row("Reminder, when it has a time", remindSel));
  const m = modal({
    title: humanWhen(w.day, w.time), center: true, body,
    hint: "enter saves · esc closes",
    foot: [
      el("button", {class: "btn ghost", onclick: () => { closeModal(); apply(null); }}, "Clear"),
      el("button", {class: "btn ghost", onclick: () => { closeModal(); inSpace(space, () => openTaskDetail(path, block, space)); }}, "More…"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: save}, "Save")],
  });
  anchorModal(m.root, anchor);
  setTimeout(() => { timeIn_.focus(); timeIn_.select(); }, 30);
}
