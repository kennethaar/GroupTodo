/* What, where, how often and how long: each picked from a list. As needed
   (#239) has no first one: it waits on Chores for Did it. */
function openNewChore(roomKey, draft = {}) {
  const MORE = "";
  const names = el("datalist", {id: "newchore-names"}, ...choreRecent().map(r => el("option", {value: r.words})));
  const what = el("input", {placeholder: "Wipe the counters", "aria-label": "What", list: "newchore-names"});
  const room = choreRoomPick(roomKey);
  const firstField = el("div", {class: "field"});
  const cap = t => t[0].toUpperCase() + t.slice(1);
  const presets = [...REPEAT_CHOICES.filter(Boolean), AS_NEEDED];
  // Custom... and Pick a date... close this dialog for theirs and come back with the answer.
  const detour = (run, back) => {
    const snap = {what: what.value, room: room.sel.value, roomNew: room.input.value, size: size.value, freq: freq.value, first: first.value};
    let answered = false;
    const reopen = extra => { answered = true; openNewChore(roomKey, {...snap, ...extra}); };
    run(reopen, snap);
    MODAL_CLOSE = () => setTimeout(() => { if (!answered) reopen(back(snap)); }, 0);
  };
  let freqWas = draft.freq || "weekly", firstWas = draft.first || "today";
  const freqOpts = [...REPEAT_CHOICES.filter(Boolean).map(r => [r, cap(r)]), [AS_NEEDED, "As needed"]];
  if (!presets.includes(freqWas)) freqOpts.push([freqWas, cap(formatRule(parseRule(freqWas)) || freqWas)]);
  freqOpts.push([MORE, "Custom…"]);
  const freq = fselect("How often", freqWas, freqOpts, v => {
    if (v !== MORE) { freqWas = v; firstField.hidden = isAsNeeded(v); return; }
    freq.value = freqWas;
    detour(reopen => openRecurrenceDialog({title: "How often?", spec: presets.includes(freqWas) ? "" : freqWas,
      onSave: ({spec}) => reopen(spec ? {freq: spec} : {})}), snap => ({}));
  });
  const size = choreSizePick();
  const firstOpts = [["today", "Today"], ["tomorrow", "Tomorrow"], ["round", "In one round"]];
  if (/^on:/.test(firstWas)) firstOpts.push([firstWas, humanDate(firstWas.slice(3))]);
  firstOpts.push([MORE, "Pick a date…"]);
  const first = fselect("First one", firstWas, firstOpts, v => {
    if (v !== MORE) { firstWas = v; return; }
    first.value = firstWas;
    detour(reopen => {
      const d = el("input", {type: "date", value: /^on:/.test(firstWas) ? firstWas.slice(3) : todayISO(), "aria-label": "Pick a date"});
      const ok = () => { const day = dateIn(d.value); if (!day) { d.focus(); return; } closeModal(); reopen({first: "on:" + day}); };
      modal({center: true, title: "First one", body: el("div", {class: "field"}, el("label", {}, "Pick a date"), d),
        foot: [el("button", {class: "btn ghost", onclick: () => closeModal()}, "Cancel"), el("div", {style: "flex:1"}),
          el("button", {class: "btn primary", onclick: ok}, "Save")]});
    }, snap => ({}));
  });
  firstField.append(el("label", {}, "First one"), first);
  firstField.hidden = isAsNeeded(freq.value);
  if (draft.what) what.value = draft.what;
  if (draft.room !== undefined) { room.sel.value = draft.room; room.sel.dispatchEvent(new Event("change")); room.input.value = draft.roomNew || ""; }
  if (draft.size) size.value = draft.size;
  const save = () => {
    const words = trim(what.value);
    if (!words) { what.focus(); return; }
    const ctx = room.ctx();
    closeModal();
    const path = ensureRoomPage(ctx);
    const needed = isAsNeeded(freq.value);
    // As needed is a plain line, not a task: never late, never on Next.
    const b = newBlock({state: needed ? "" : "TODO", title: choreLine(words, ctx, size.value)});
    setBlockProp(b, REPEAT_PROP, freq.value);
    const day = first.value === "today" ? todayISO() : first.value === "tomorrow" ? shiftISO(todayISO(), 1)
      : /^on:/.test(first.value) ? first.value.slice(3) : nextRepeatDate(freq.value, todayISO());
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
    body: el("div", {}, names,
      el("div", {class: "field"}, el("label", {}, "What"), what),
      el("div", {class: "field"}, el("label", {}, "Room"), room.sel, room.input),
      el("div", {class: "field"}, el("label", {}, "How often"), freq),
      el("div", {class: "field"}, el("label", {}, "Duration"), size),
      firstField),
    foot: [el("button", {class: "btn ghost", onclick: () => closeModal()}, "Cancel"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: save}, "Add chore")],
  });
  if (!draft.what) requestAnimationFrame(() => what.focus());
}
