function openMeetingForm(path, block) {
  const day = dayOfPath(path);
  const [from0, to0] = String(blockProp(block, "time") || "").split(/\s*[–-]\s*/);
  const people = acrossNames(() => [...allPeople().map(personName), ...members().map(m => m.name)]);
  const list = el("datalist", {id: "meetpeople"}, ...[...new Set(people)].map(n => el("option", {value: n})));
  const title = el("input", {value: meetingTitle(block), placeholder: "What the meeting is about"});
  const date = el("input", {type: "date", value: dateIn(blockProp(block, "date")) || day || todayISO()});
  const from = clockInput(from0);
  const to = clockInput(to0);
  const who = el("input", {value: linkWords(blockProp(block, "attendees") || ""), list: "meetpeople",
    placeholder: "Names, separated by commas"});
  const agenda = el("textarea", {placeholder: "One point per line", style: "min-height:120px"});
  agenda.value = (block.children || []).map(c => c.title).filter(t => trim(t)).join("\n");
  /* A meeting from your calendar, in your own area: which other areas it also
     shows in, this one apart from the rest of its calendar. */
  const feed = blockProp(block, "cal_feed"), home = calHome();
  const also = feed && V.space === home ? calAlso(calFeedOf(feed)) : null;
  const others = also ? Spaces.list.map(s => s.name).filter(n => n !== home) : [];
  const shownIn = also ? calTargets(block, also) : [];
  const where = others.map(n => el("input", {type: "checkbox", value: n, checked: shownIn.includes(n) ? "" : null}));
  const save = () => {
    if (badClock(from, to)) return;
    const words = trim(title.value);
    if (!words) { title.focus(); return; }
    const chosen = where.filter(t => t.checked).map(t => t.value);
    // Chosen here, it stays this meeting's own, whatever its calendar is set to later.
    if (also && (chosen.length !== shownIn.length || chosen.some(n => !shownIn.includes(n)))) {
      setOrDropProp(block, "cal_share", chosen.length ? chosen.join(", ") : "-");
      const [from, to] = calWindow();
      const r = routeCalendarMeetings(home, feed, also, from, to);
      for (const n of where.filter(t => t.checked && !LOADED.has(t.value)).map(t => t.value))
        loadSpaceRecord(n).then(() => { routeCalendarMeetings(home, feed, also, from, to, n); clearMemo(); flush(); render(); }).catch(() => {});
      if (r.sent || r.taken) flush();
    }
    block.title = "#meeting " + linkKnownNames(words);
    setOrDropProp(block, "date", date.value && date.value !== day ? date.value : "");
    setOrDropProp(block, "time", from.value ? from.value + (to.value ? "–" + to.value : "") : "");
    setOrDropProp(block, "attendees", who.value.split(",").map(trim).filter(Boolean).map(linkKnownNames).join(", "));
    /* The agenda is the lines under the meeting, in the order written here. A
       point kept keeps its own lines under it; one taken out goes, unless
       something was written under it or it is a task. */
    const old = (block.children || []).slice(), next = [];
    for (const text of agenda.value.split("\n").map(trim).filter(Boolean)) {
      const at = old.findIndex(c => trim(c.title) === text);
      next.push(at >= 0 ? old.splice(at, 1)[0] : newBlock({title: text}, false));
    }
    block.children = [...next, ...old.filter(c => (c.children || []).length || c.state)];
    block.collapsed = false;
    touch(path);
    closeModal();
    render();
    focusBlock(block.id);
  };
  const field = (label, ...kids) => el("div", {class: "field"}, el("label", {}, label), ...kids);
  modal({
    center: true, title: isMeeting(block) ? "Meeting" : "Make it a meeting", hint: "a #meeting line",
    body: el("div", {}, list,
      field("Title", title),
      el("div", {style: "display:flex;gap:10px;flex-wrap:wrap"},
        field("Day", date), field("From", from), field("To", to)),
      field("Attendees", who),
      field("Agenda", agenda),
      others.length ? field("Also show in (everyone there sees it, and what is written under it)",
        el("div", {style: "display:flex;gap:12px;flex-wrap:wrap"}, ...others.map((n, i) =>
          el("label", {style: "display:flex;gap:4px;align-items:center"}, where[i], n)))) : null),
    foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
           el("button", {class: "btn primary", onclick: save}, "Save meeting")],
    onKey: e => {
      if (e.key === "Enter" && (e.target !== agenda || e.ctrlKey || e.metaKey)) { save(); return true; }
      return false;
    },
  });
  setTimeout(() => title.focus(), 30);
}
