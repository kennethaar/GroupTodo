/* ---------- when it comes round: one dialog for routines and tasks ----------
   The everyday answers in a row, and Custom for the rest: every so many days,
   weeks, months or years; which weekdays; a date in the month or the first,
   second ... last weekday of it; the same for a year. A routine also says
   when it starts, at what time and when it ends. It writes the words
   parseRule reads, so the file says what the dialog said. */
function openRecurrenceDialog({title, spec = "", starts = null, ends = "", time = "", schedule = false, onSave}) {
  const today = todayISO();
  let rule = parseRule(spec);
  const startIn = el("input", {type: "date", value: starts || today});
  const wdOf = () => (parseISO(startIn.value) || parseISO(today)).getDay();
  const dOf = () => (parseISO(startIn.value) || parseISO(today));
  const PRESETS = [
    ["", schedule ? "As needed" : "Never"],
    ["daily", "Daily"], ["weekday", "Every weekday"], ["weekly", "Weekly"],
    ["monthly", "Monthly"], ["yearly", "Yearly"], ["custom", "Custom…"],
  ];
  const presetRule = p => ({
    daily: {freq: "day", n: 1}, weekday: {freq: "week", n: 1, days: [1, 2, 3, 4, 5]},
    weekly: {freq: "week", n: 1, days: [wdOf()]}, monthly: {freq: "month", n: 1, mday: dOf().getDate()},
    yearly: {freq: "year", n: 1, mday: dOf().getDate(), month: dOf().getMonth()},
  })[p] || null;
  const presetOf = r => {
    if (!r) return "";
    if (r.n !== 1) return "custom";
    if (r.freq === "day") return "daily";
    if (r.freq === "week") return String(r.days) === "1,2,3,4,5" ? "weekday" : !r.days || r.days.length === 1 ? "weekly" : "custom";
    if (r.nth) return "custom";
    return r.freq === "month" ? "monthly" : r.freq === "year" ? "yearly" : "custom";
  };
  let preset = presetOf(rule);

  /* -- Custom -- */
  const nIn = el("input", {type: "number", min: "1", max: "999", value: String(rule?.n || 1), style: "width:5em"});
  const unitIn = el("select", {}, ...["day", "week", "month", "year"].map(u => el("option", {value: u}, u + "s")));
  unitIn.value = rule?.freq || "week";
  const days = new Set(rule?.days || [wdOf()]);
  const dayRow = el("div", {class: "seg", style: "margin-top:8px"});
  const drawDays = () => {
    dayRow.textContent = "";
    for (const d of [1, 2, 3, 4, 5, 6, 0])
      dayRow.append(el("button", {class: days.has(d) ? "on" : "", onclick: () => {
        if (days.has(d) && days.size > 1) days.delete(d); else days.add(d);
        drawDays(); sync();
      }}, capitalise(WEEKDAYS[d].slice(0, 3))));
  };
  const nthSel = () => el("select", {}, ...[1, 2, 3, 4, 5, -1].map(n => el("option", {value: String(n)}, RULE_NTH_WORD[n])));
  const wdSel = () => el("select", {}, ...[1, 2, 3, 4, 5, 6, 0].map(d => el("option", {value: String(d)}, capitalise(WEEKDAYS[d]))));
  const monSel = () => el("select", {}, ...RULE_MONTHS.map((m, i) => el("option", {value: String(i)}, capitalise(m))));
  const byNth = !!rule?.nth;
  const mdayIn = el("input", {type: "number", min: "1", max: "31", value: String(rule?.mday || dOf().getDate()), style: "width:4.5em"});
  const nthIn = nthSel(), wdIn = wdSel(), monIn = monSel(), monIn2 = monSel();
  nthIn.value = String(rule?.nth || 1);
  wdIn.value = String(rule?.wd ?? wdOf());
  monIn.value = monIn2.value = String(rule?.month ?? dOf().getMonth());
  const radio = (name, on) => el("input", {type: "radio", name, checked: on, style: "width:auto;margin-right:6px"});
  const byDate = radio("rr-on", !byNth), byWeekday = radio("rr-on", byNth);
  const dateLine = el("label", {class: "rrline"}, byDate, "On the ", mdayIn, el("span", {class: "rrmon"}, " of ", monIn));
  const nthLine = el("label", {class: "rrline"}, byWeekday, "On the ", nthIn, " ", wdIn, el("span", {class: "rrmon"}, " of ", monIn2));
  const dayOfBox = el("div", {style: "margin-top:8px"}, dateLine, nthLine);
  const customBox = el("div", {class: "field rrule"},
    el("label", {}, "Repeat every"),
    el("div", {class: "rrline"}, nIn, " ", unitIn),
    dayRow, dayOfBox);
  const customRule = () => {
    const r = {freq: unitIn.value, n: Math.max(1, Math.min(999, parseInt(nIn.value, 10) || 1))};
    if (r.freq === "week") r.days = [...days].sort();
    if (r.freq === "month" || r.freq === "year") {
      if (byWeekday.checked) Object.assign(r, {nth: Number(nthIn.value), wd: Number(wdIn.value)});
      else r.mday = Math.max(1, Math.min(31, parseInt(mdayIn.value, 10) || 1));
      if (r.freq === "year") r.month = Number(byWeekday.checked ? monIn2.value : monIn.value);
    }
    return r;
  };

  /* -- presets -- */
  const presetRow = el("div", {class: "seg"});
  const drawPresets = () => {
    presetRow.textContent = "";
    for (const [k, label] of PRESETS)
      presetRow.append(el("button", {class: preset === k ? "on" : "", onclick: () => { preset = k; drawPresets(); sync(); }}, label));
  };

  /* -- a routine's start, time and end -- */
  const startWhen = el("div", {class: "seg"});
  let startMode = starts && starts > today ? "on" : "today";
  const timeIn = clockInput(/^\d{1,2}:\d{2}/.test(time) ? time.padStart(5, "0") : "");
  const afterM = /^after\s+(\d+)/i.exec(ends || "");
  let endMode = afterM ? "after" : dateIn(ends) ? "on" : "never";
  const endIn = el("input", {type: "date", value: dateIn(ends) || shiftISO(today, 90), style: "width:auto"});
  const timesIn = el("input", {type: "number", min: "1", value: afterM ? afterM[1] : "10", style: "width:5em"});
  const endWhen = el("div", {class: "seg"});
  const segOf = (host, opts, cur, set) => {
    host.textContent = "";
    for (const [k, label] of opts) host.append(el("button", {class: cur === k ? "on" : "", onclick: () => { set(k); sync(); }}, label));
  };
  const scheduleBox = schedule ? el("div", {},
    el("div", {class: "field rrule"}, el("label", {}, "Starts"), startWhen,
      el("div", {class: "rrline rrstart", style: "margin-top:8px"}, startIn)),
    el("div", {class: "field rrule"}, el("label", {}, "At a time (optional)"), timeIn,
      el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"}, "Its steps are scheduled then, with a reminder before.")),
    el("div", {class: "field rrule"}, el("label", {}, "Ends"), endWhen,
      el("div", {class: "rrline rrend", style: "margin-top:8px"}, endIn, el("span", {class: "rrtimes"}, "after ", timesIn, " times")))) : null;

  const preview = el("div", {style: "color:var(--fg2);font-size:12.5px;line-height:1.5"});
  const current = () => preset === "custom" ? customRule() : presetRule(preset);
  const startDay = () => startMode === "today" ? today : startMode === "next" ? shiftISO(today, 1) : (startIn.value || today);
  function sync() {
    drawPresets();
    customBox.style.display = preset === "custom" ? "" : "none";
    const u = unitIn.value;
    dayRow.style.display = u === "week" ? "" : "none";
    dayOfBox.style.display = u === "month" || u === "year" ? "" : "none";
    for (const m of customBox.querySelectorAll(".rrmon")) m.style.display = u === "year" ? "" : "none";
    if (schedule) {
      scheduleBox.style.display = preset ? "" : "none";
      segOf(startWhen, [["today", "Today"], ["next", "The next time it falls"], ["on", "On a day…"]], startMode, k => startMode = k);
      startIn.parentNode.style.display = startMode === "on" ? "" : "none";
      segOf(endWhen, [["never", "Never"], ["on", "On a day…"], ["after", "After a number of times"]], endMode, k => endMode = k);
      endIn.style.display = endMode === "on" ? "" : "none";
      endIn.parentNode.querySelector(".rrtimes").style.display = endMode === "after" ? "" : "none";
      endIn.parentNode.style.display = endMode === "never" ? "none" : "";
    }
    const r = current();
    if (!r) { preview.textContent = schedule ? "Not on a schedule: add it to a page when it comes round." : "Does not repeat."; return; }
    const from = schedule ? startDay() : today;
    let next = ruleDates(r, from, from, endMode === "after" && schedule ? Math.min(4, parseInt(timesIn.value, 10) || 1) : 4);
    if (schedule && endMode === "on") next = next.filter(d => d <= endIn.value);
    preview.textContent = "“" + formatRule(r) + "” — " +
      (next.length ? (schedule ? "on your day page " : "next ") + next.map(humanDate).join(", ") : "never falls");
  }
  for (const x of [nIn, unitIn, mdayIn, nthIn, wdIn, monIn, monIn2, startIn, endIn, timesIn])
    x.addEventListener(x.tagName === "SELECT" ? "change" : "input", sync);
  for (const x of [mdayIn, monIn]) x.addEventListener("focus", () => { byDate.checked = true; sync(); });
  for (const x of [nthIn, wdIn, monIn2]) x.addEventListener("focus", () => { byWeekday.checked = true; sync(); });
  byDate.addEventListener("change", sync); byWeekday.addEventListener("change", sync);
  drawDays();
  modal({
    center: true, title,
    body: el("div", {},
      el("div", {class: "field"}, el("label", {}, "How often"), presetRow),
      customBox, scheduleBox,
      el("div", {class: "field"}, preview)),
    foot: [
      el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
      el("button", {class: "btn primary", onclick: () => {
        if (badClock(timeIn)) return;
        const r = current();
        const out = {spec: r ? formatRule(r) : ""};
        if (schedule && r) {
          out.starts = startDay();
          out.time = timeIn.value || "";
          out.ends = endMode === "on" ? endIn.value && "[[" + endIn.value + "]]"
                   : endMode === "after" ? "after " + Math.max(1, parseInt(timesIn.value, 10) || 1) : "";
        }
        closeModal();
        onSave(out);
      }}, "Save"),
    ],
  });
  sync();
}
