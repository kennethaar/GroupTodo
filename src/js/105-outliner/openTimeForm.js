/* The form /in and /out open. Who and which project start as the last visit's,
   the clock as now, and nothing is written until Save -- so a time that is a
   little off is corrected before it is a fact. `entry` is a #timelog line to
   change; `from` is the line the command was typed on, used for the visit when
   it is an empty line on the same day, and cleared away otherwise. */
function openTimeForm(path, entry, {leaving = false, from = null, project = "", person = "", date = ""} = {}) {
  const space = V.space;
  const last = entry ? null : lastTimeLog();
  const people = acrossNames(() => [...allPeople().map(personName), ...members().map(m => m.name)]);
  const projects = acrossNames(() => ["1", "3", "2"].flatMap(c => projectsIn(c)).map(pageTitle));
  const lists = el("span", {},
    el("datalist", {id: "tlpeople"}, ...people.map(n => el("option", {value: n}))),
    el("datalist", {id: "tlprojects"}, ...projects.map(n => el("option", {value: n}))));
  const who = el("input", {value: entry ? timeLogWho(entry) : person || last?.who || "", list: "tlpeople", placeholder: "Who came"});
  const proj = el("input", {value: entry ? timeLogProj(entry) : project || last?.project || "", list: "tlprojects",
    placeholder: "Which project"});
  const fromDay = from && from.path && dayOfPath(from.path);
  const day = el("input", {type: "date", value: (entry && dayOfPath(path)) || date || fromDay || todayISO()});
  /* Now is only a guess for today: a visit written after the fact starts with
     an empty clock, and moving the day away from today takes the guess back. */
  const isToday = () => (day.value || todayISO()) === todayISO();
  const tin = clockInput(entry ? blockProp(entry, "in") : isToday() ? nowClock() : "");
  const tout = clockInput(leaving && isToday() ? nowClock() : entry ? blockProp(entry, "out") : "");
  let guess = entry ? "" : tin.value;
  day.addEventListener("input", () => {
    if (guess && tin.value === guess && !isToday()) { tin.value = ""; guess = ""; }
    else if (!entry && !tin.value && !trim(hrs.value) && isToday()) guess = tin.value = nowClock();
  });
  const hrs = el("input", {inputmode: "decimal", value: entry ? trim(blockProp(entry, "hours") || "") : "",
    placeholder: "e.g. 3.5", style: "width:90px"});
  const note = el("input", {value: entry ? timeLogNote(entry) : "", placeholder: "What they did (optional)"});
  const sum = el("div", {class: "hint", style: "text-align:left;margin:0;padding:0 16px"});
  const draft = () => {
    // Read the way the fields will be, so a half-typed 084 sums to nothing yet.
    const b = {props: {in: readClock(tin.value) || "", out: readClock(tout.value) || "", hours: tin.value ? "" : hrs.value}};
    const m = timeLogMinutes(b, day.value);
    sum.textContent = !tin.value && !trim(hrs.value) ? "Give the time they came, or the hours."
      : tin.value && !tout.value ? (m ? fmtMinutes(m) + " so far. " : "") + "Out stays empty while they are there."
      : m != null ? fmtMinutes(m) + " on site." : "";
  };
  /* Clock or hours, whichever was written last: hours typed after a start on
     the clock mean hours, and a clock typed after hours means the clock. */
  hrs.addEventListener("input", () => {
    if (!trim(hrs.value)) return;
    tin.value = tout.value = guess = "";
    [tin, tout].forEach(i => i.tidy());
  });
  [tin, tout].forEach(i => i.addEventListener("input", () => { if (trim(i.value)) hrs.value = ""; }));
  [tin, tout, hrs, day].forEach(i => i.addEventListener("input", draft));
  draft();
  /* A name half typed is finished from the list rather than saved as a new
     person: Enter on "Ol" is "Ola Nordmann", and only the next Enter saves. */
  const finish = (input, names) => {
    const v = trim(input.value).toLowerCase();
    if (!v || names.some(n => n.toLowerCase() === v)) return false;
    const hit = names.find(n => n.toLowerCase().startsWith(v));
    if (!hit) return false;
    input.value = hit;
    return true;
  };
  const save = () => {
    const name = trim(who.value), pname = trim(proj.value);
    if (!name) { who.focus(); return; }
    if (badClock(tin, tout)) return;
    if (!tin.value && !trim(hrs.value)) { tin.focus(); return; }
    const date = day.value || todayISO();
    let target = null;
    inSpace(space, () => {
      target = ensureJournal(date);
      const tpage = getPage(target);
      const fb = from && from.block;
      const spare = !!fb && fb !== entry && !trim(fb.title) && !(fb.children || []).length;
      let b = entry;
      if (b) {
        if (path !== target) { removeBlockFrom(getPage(path), b); touch(path); tpage.blocks.push(b); }
      } else if (spare && from.path === target) {
        b = fb;
      } else {
        b = newBlock({}, false);
        if (fb && from.path === target) { const sibs = siblingsOf(tpage, fb); sibs.splice(sibs.indexOf(fb) + 1, 0, b); }
        else tpage.blocks.push(b);
      }
      if (spare && b !== fb && getPage(from.path)) { removeBlockFrom(getPage(from.path), fb); touch(from.path); }
      b.state = null;
      b.title = ["#timelog", "[[" + timeLogPersonRef(name) + "]]", pname ? "[[" + timeLogProjectRef(pname) + "]]" : "",
        linkKnownNames(trim(note.value))].filter(Boolean).join(" ");
      setOrDropProp(b, "in", tin.value);
      setOrDropProp(b, "out", tin.value ? tout.value : "");
      setOrDropProp(b, "hours", tin.value ? "" : trim(hrs.value));
      createLinkedPages(b.title);
      touch(target);
      const m = timeLogMinutes(b, date);
      const first = name.split(/\s+/)[0];
      const msg = tin.value && !tout.value ? first + " in at " + tin.value + (pname ? " on " + pname : "") + "."
        : first + (tout.value ? " out at " + tout.value : "") + " · " + fmtMinutes(m) + (pname ? " on " + pname : "") + ".";
      const showing = state.view === "page" && state.pagePath === target;
      notify(msg, "info", showing ? null : {label: "Show the day", run: () => openPageIn(space, target)});
    });
    closeModal();
    render();
  };
  const field = (label, ...kids) => el("div", {class: "field"}, el("label", {}, label), ...kids);
  modal({
    center: true, title: leaving ? "Leaving" : entry ? "Time on site" : "Arriving", hint: "a #timelog line",
    body: el("div", {}, lists,
      field("Who", who),
      field("Project", proj),
      el("div", {style: "display:flex;gap:10px;flex-wrap:wrap"},
        field("Day", day), field("In", tin), field("Out", tout), field("Or hours", hrs)),
      sum,
      field("Note", note)),
    // Away and back is a second line: 08-12 and 13-16 on one day.
    foot: [entry && !leaving ? el("button", {class: "btn ghost", style: "margin-right:auto",
             onclick: () => { closeModal(); openTimeForm(null, null, {person: trim(who.value), project: trim(proj.value), date: day.value}); }},
             "+ Another time") : null,
           el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
           el("button", {class: "btn primary", onclick: save}, leaving ? "Check out" : entry ? "Save" : "Check in")].filter(Boolean),
    onKey: e => {
      if (e.key !== "Enter") return false;
      if (e.target === who && finish(who, people)) return true;
      if (e.target === proj && finish(proj, projects)) return true;
      save();
      return true;
    },
  });
  setTimeout(() => (leaving ? tout : who.value ? tin : who).focus(), 30);
}
