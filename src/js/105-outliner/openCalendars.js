async function openCalendars() {
  // Every area can take a calendar, not only the ones on screen: read the rest in first.
  await Promise.all(Spaces.list.filter(s => !LOADED.has(s.name)).map(s => loadSpaceRecord(s.name).catch(() => null)));
  const spaces = Spaces.list.map(s => s.name).filter(n => LOADED.has(n));
  const mine = spaces.filter(n => !calAreaShared(n));
  const rows = el("div", {style: "padding:0 16px"});
  /* What happened, said here in the dialog where you are looking, and kept
     until the next thing happens: not only in a toast that is gone in seconds. */
  const status = el("div", {class: "calstatus", role: "status", "aria-live": "polite"});
  const say = (text, kind = "") => { status.className = "calstatus" + (kind ? " " + kind : ""); status.textContent = ""; if (text) status.append(...[].concat(text)); };
  const lastSaid = () => {
    let last = null;
    try { last = JSON.parse(PREF.get("calendar.result", "null")); } catch (_) {}
    if (!last) return say(calFeeds().length ? "Not imported yet." : "");
    const when = "Last import " + new Date(last.at).toLocaleString() + " (" + calAgo(last.at) + "). ";
    if (last.failed && last.failed.length) say([when, el("b", {}, "Not fetched: "), last.failed.join("; ") + "."], "bad");
    else say(when + calSummary(last), "ok");
  };
  // The one button says what it will do: save the link in the box, or just fetch.
  const label_ = () => { btn.textContent = trim(url.value) ? "Save and import" : "↻ Import now"; };
  /* Ticks for the other areas a calendar's meetings also show in. */
  const alsoTicks = (chosen, onTick) => {
    const others = spaces.filter(n => n !== area.value);
    if (!others.length) return el("span", {class: "hint"}, "No other areas yet.");
    return el("div", {style: "display:flex;gap:12px;flex-wrap:wrap"}, ...others.map(n =>
      el("label", {style: "display:flex;gap:4px;align-items:center", title: calAreaShared(n) ? calSharedNote(n) : null},
        el("input", {type: "checkbox", checked: chosen.includes(n) ? "" : null, onchange: e => onTick(n, e.target.checked)}),
        n + (calAreaShared(n) ? " 👥" : ""))));
  };
  // One calendar's meetings shown in, or taken out of, one more area, straight away.
  const setAlso = (url_, n, on) => {
    const feeds = calFeeds(), f = feeds.find(x => x.url === url_);
    if (!f) return;
    f.also = on ? [...new Set([...(f.also || []), n])] : (f.also || []).filter(x => x !== n);
    setCalFeeds(feeds);
    const feed = calFeedId(f.url), name = f.label || calHost(f.url);
    if (on) {
      const r = routeCalendarMeetings(calHome(), feed, calAlso(f), ...calWindow(), n);
      say(r.sent ? name + ": " + r.sent + (r.sent === 1 ? " meeting" : " meetings") + " now shown in " + n + "."
        : name + ": its meetings are shown in " + n + " from the next import.", "ok");
    } else {
      const k = unrouteCalendar(feed, n);
      say(name + ": no longer shown in " + n + (k ? "; " + k + (k === 1 ? " meeting" : " meetings") + " taken off there" : "") +
        ". A meeting someone wrote under stays there.", "ok");
    }
    clearMemo(); flush(); render();
  };
  let openRow = null;     // the link whose "Also show in" ticks are open
  const draw = () => {
    rows.textContent = "";
    const feeds = calFeeds();
    if (!feeds.length) rows.append(el("p", {class: "hint", style: "text-align:left"}, "No calendar links yet."));
    feeds.forEach((f, i) => {
      const also = calAlso(f);
      const ticks = el("div", {style: "margin:4px 0 10px 28px", hidden: openRow === f.url ? null : ""},
        alsoTicks(also, (n, on) => { openRow = f.url; setAlso(f.url, n, on); draw(); }));
      rows.append(el("div", {class: "pick", style: "cursor:default"},
        el("span", {class: "k"}, "📅"),
        el("span", {style: "flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis", title: f.url}, f.label || calHost(f.url)),
        el("button", {class: "textbtn", title: "Other areas this calendar's meetings also show in",
          onclick: () => { ticks.hidden = !ticks.hidden; openRow = ticks.hidden ? null : f.url; }}, also.length ? "also in " + also.join(", ") : "Also show in…"),
        el("button", {class: "textbtn", title: "Forget this link. Its meetings stay until you clear them below", onclick: () => {
          setCalFeeds(calFeeds().filter((_, j) => j !== i)); draw(); lastSaid(); drawOnPages();
          if (onPages.childElementCount) say("Link removed. Its meetings are still on your day pages: Clear, below, takes them off.");
        }}, "Remove")), ticks);
    });
  };
  const url = el("input", {placeholder: "Paste the secret iCal address: https://… .ics or webcal://…", type: "text",
    autocomplete: "off", spellcheck: "false"});
  const label = el("input", {placeholder: "e.g. Work calendar"});
  /* Your own area, for every calendar. A shared area is listed, greyed out, so
     it is plain why it is not offered. Changing it takes the meetings off the
     old one (all but those written under) and brings them into the new one. */
  const area = el("select", {}, ...spaces.map(n => el("option", {value: n, disabled: calAreaShared(n) || null},
    calAreaShared(n) ? n + " — " + calSharedNote(n) : n)));
  area.value = calHome();
  area.onchange = async () => {
    const was = calHome();
    PREF.set(CAL_HOME_KEY, area.value);
    setCalFeeds(calFeeds().map(f => ({...f, space: area.value})));
    for (const f of calFeeds()) unrouteCalendar(calFeedId(f.url), was);
    newAlso = newAlso.filter(n => n !== area.value);
    newTicks.replaceChildren(alsoTicks(newAlso, tickNew));
    draw(); clearMemo(); flush(); render();
    if (calFeeds().length) { say("Bringing your calendars into " + area.value + "…"); await syncCalendars({quiet: true}); lastSaid(); }
  };
  // The areas a new link's meetings also show in.
  let newAlso = [];
  const tickNew = (n, on) => { newAlso = on ? [...newAlso, n] : newAlso.filter(x => x !== n); };
  const newTicks = el("div", {}, alsoTicks(newAlso, tickNew));

  /* Whatever is in the box is kept: by the button, by Enter, and by closing. */
  const keep = () => {
    const raw = trim(url.value);
    if (!raw) return true;
    const u = calNormalizeUrl(raw);
    if (!u) { say("That does not look like a calendar link. It starts with https:// or webcal://, and Outlook's ends in .ics.", "bad"); url.focus(); return false; }
    if (!area.value || calAreaShared(area.value)) { say(area.value ? calSharedWhy(area.value) + "." : "Make a private area first, then add the link to it.", "bad"); return false; }
    PREF.set(CAL_HOME_KEY, area.value);
    setCalFeeds([...calFeeds().filter(f => f.url !== u), {url: u, label: trim(label.value), space: area.value, also: newAlso}]);
    url.value = ""; label.value = ""; newAlso = [];
    newTicks.replaceChildren(alsoTicks(newAlso, tickNew));
    label_();
    draw();
    if (!calStorageKeeps())
      say("Saved for now, but this browser is not keeping settings for this page (a private window, or blocked site data), " +
        "so the link is gone when you close it.", "bad");
    return true;
  };
  const run = async () => {
    if (!keep()) return;
    if (!calFeeds().length) { say("Paste a calendar link first.", "bad"); url.focus(); return; }
    if (CAL_SYNCING) { say("Already importing. One moment."); return; }
    btn.disabled = true;
    say("Saved. Fetching " + calFeeds().length + (calFeeds().length === 1 ? " calendar" : " calendars") + "…");
    try { await syncCalendars({quiet: true}); } finally { btn.disabled = false; }
    lastSaid();
  };
  url.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); run(); } });
  label.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); run(); } });
  const btn = el("button", {class: "btn primary", onclick: run});
  url.addEventListener("input", label_);
  label_();

  const file = el("input", {type: "file", accept: ".ics,text/calendar", onchange: async e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!area.value || calAreaShared(area.value)) { e.target.value = ""; say(area.value ? calSharedWhy(area.value) + "." : "Make a private area first.", "bad"); return; }
    const [from, to] = calWindow();
    calNameFeed(calHash("file:" + f.name), f.name);
    const r = importCalendarText(await f.text(), area.value, calHash("file:" + f.name), from, to);
    clearMemo(); render(); flush();
    drawOnPages();
    say("From " + f.name + ": " + calSummary(r).replace(/^Calendars: /, ""), "ok");
  }});

  /* Meetings on your day pages from a calendar that is no longer listed above:
     a removed link, an imported .ics file, or the same calendar added twice
     under two links. Each can be cleared off. A listed calendar is not offered,
     since its next fetch would put them all back: remove its link first. */
  const onPages = el("div", {});
  const drawOnPages = () => {
    onPages.textContent = "";
    // A listed calendar's meetings, in your own area or shown on in another, are not offered.
    const live = new Set(calFeeds().map(f => calFeedId(f.url)));
    const names = calNames();
    const left = calImported().filter(g => !live.has(g.feed));
    if (!left.length) return;
    const day = iso => new Date(iso + "T12:00").toLocaleDateString(undefined, {month: "short", day: "numeric"});
    onPages.append(el("label", {style: "display:block;margin:12px 0 4px"}, "Still on your day pages, from calendars no longer listed"));
    for (const g of left) onPages.append(el("div", {class: "pick", style: "cursor:default"},
      el("span", {class: "k"}, "📅"),
      el("span", {style: "flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis",
        title: g.sample ? "For example: " + g.sample : null},
        (names[g.feed] || "A removed calendar") + " · " + g.n + (g.n === 1 ? " meeting" : " meetings") + ", " +
        (g.first === g.last ? day(g.first) : day(g.first) + " – " + day(g.last))),
      el("span", {class: "d"}, "in " + g.space),
      el("button", {class: "textbtn", title: "Take these meetings off your day pages", onclick: () => {
        const r = clearCalendarMeetings(g.space, g.feed);
        let undone = false;
        const back = () => { if (undone) return false; undone = true; r.undo(); clearMemo(); render(); flush(); return true; };
        pushUndo({run: back, label: "Cleared calendar meetings"});
        clearMemo(); render(); flush();
        drawOnPages();
        const msg = "Cleared " + r.removed + (r.removed === 1 ? " meeting" : " meetings") +
          (r.kept ? "; " + r.kept + " you wrote under stayed, as plain #meeting lines" : "") + ".";
        say(msg, "ok");
        notify(msg, "info", {label: "Undo", run: () => { back(); drawOnPages(); return true; }});
      }}, "Clear")));
  };
  draw();
  drawOnPages();
  lastSaid();
  modal({
    center: true, title: "Calendars", hint: "meetings into your day pages",
    body: el("div", {},
      el("p", {class: "hint", style: "text-align:left;margin-top:0"}, "Each meeting in the next " + CAL_DAYS_AHEAD + " days becomes a #meeting line on that day's page " +
        "in your own area, with its time, attendees and agenda, and also in any area you tick for it. " +
        "The links stay on this device, and serve.py fetches them " +
        "every " + CAL_EVERY_MIN + " minutes while the app is open and when you come back to it. " +
        "↻ Import now, or the ↻ next to Calendars in Settings, fetches straight away."),
      el("p", {class: "hint", style: "text-align:left"}, CAL_LAG_NOTE + " Open the link in a browser to see what it holds right now."),
      calSharedExplainer(),
      mine.length ? null : el("div", {style: "margin:0 16px 12px"},
        el("button", {class: "btn primary", onclick: () => { closeModal(); newSpacePrompt(async sp => { await openSpace(sp.name); openCalendars(); }); }},
          "+ Create a private area for your calendar")),
      el("div", {class: "field"}, el("label", {}, "Your own area: every calendar comes in here"), area),
      rows,
      onPages,
      meetRemindField(),
      el("div", {class: "field"}, el("label", {}, "Add a calendar link (its secret iCal address)"), url),
      el("div", {class: "field"}, el("label", {}, "Name"), label),
      el("div", {class: "field"}, el("label", {}, "Also show its meetings in"), newTicks),
      status,
      el("div", {class: "field"}, el("label", {}, "Or import a downloaded .ics file into your own area"), file)),
    // Closing with a link still in the box keeps it rather than losing it.
    onClose: () => { if (trim(url.value) && calNormalizeUrl(url.value)) { keep(); notify("Calendar link saved. It is fetched within " + CAL_EVERY_MIN + " minutes, or now with ↻ next to Calendars in Settings."); } },
    foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Close"), btn],
  });
  setTimeout(() => url.focus(), 30);
}
