/* Add a calendar: its link and a name. It comes into your own area and is
   private; sharing it is a choice made later, on the calendar. */
function drawAddCalendar() {
  const home = calHome(), usable = home && !calAreaShared(home);
  const url = el("input", {placeholder: "https://…", type: "text", autocomplete: "off", spellcheck: "false"});
  const label = el("input", {placeholder: "e.g. Work"});
  const add = async () => {
    const u = calNormalizeUrl(trim(url.value));
    if (!u) { notify("That does not look like a calendar link. It starts with https:// or webcal://.", "warn"); url.focus(); return; }
    if (!trim(label.value)) { notify("Give the calendar a name.", "warn"); label.focus(); return; }
    PREF.set(CAL_HOME_KEY, home);
    setCalFeeds([...calFeeds().filter(f => f.url !== u), {url: u, label: trim(label.value), space: home, also: []}]);
    if (!calStorageKeeps())
      notify("This browser is not keeping settings for this page (a private window, or blocked site data), so the link is gone when you close it.", "warn");
    const m = drawCalendars();
    await syncCalendars({quiet: false, only: u});
    if (m.root.isConnected) drawCalendars();
  };
  for (const i of [url, label]) i.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); add(); } });
  const file = el("input", {type: "file", accept: ".ics,text/calendar", hidden: "", onchange: async e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const [from, to] = calWindow();
    calNameFeed(calHash("file:" + f.name), f.name);
    const r = importCalendarText(await f.text(), home, calHash("file:" + f.name), from, to);
    clearMemo(); render(); flush();
    notify("From " + f.name + ": " + calSummary(r).replace(/^Calendars: /, ""));
    drawCalendars();
  }});
  const m = calScreen({
    title: "Add calendar",
    body: !usable ? el("div", {style: "margin:0 16px"},
      el("p", {class: "hint", style: "text-align:left"}, "Calendars come into an area that is yours alone. Make one first."),
      el("button", {class: "btn primary", onclick: () => { closeModal(); newSpacePrompt(async sp => { await openSpace(sp.name); openCalendars(); }); }}, "+ Create a private area"))
      : el("div", {},
        el("div", {class: "field"}, el("label", {}, "Calendar link"), url),
        el("div", {class: "field"}, el("label", {}, "Name"), label),
        el("p", {class: "hint", style: "padding:0 16px;text-align:left"}, "or"),
        el("div", {style: "padding:0 16px"}, el("button", {class: "textbtn", onclick: () => file.click()}, "Import .ics file"), file)),
    foot: usable ? [el("button", {class: "btn ghost", onclick: drawCalendars}, "Cancel"),
      el("button", {class: "btn primary", onclick: add}, "Add calendar")] : null,
  });
  setTimeout(() => url.focus(), 30);
  return m;
}
