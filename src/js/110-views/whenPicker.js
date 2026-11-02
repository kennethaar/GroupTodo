/* ---------- the schedule picker ----------
   The same question in the wizard and behind the When button. value() is the
   schedule, null for none, or {invalid} saying what is missing. */
function whenPicker(from, init, opts = {}) {
  const im = init ? whenMode(init) : null;
  let often = !init || im === "dates" ? "once" : im;
  const days = new Set(init && init.days ? init.days : [weekdayOf(from)]);
  const mdays = new Set(init && init.mdays ? init.mdays : [+from.slice(8)]);
  const months = new Set(init && init.months ? init.months : [+from.slice(5, 7)]);
  const nDays = el("input", {type: "number", min: "2", max: "60", value: String(im === "ndays" ? init.n : 2), style: "width:4.5em"});
  const nWeeks = el("input", {type: "number", min: "1", max: "12", value: String(im === "nweeks" ? init.n : 2), style: "width:4.5em"});
  const start = el("input", {type: "date", value: init && init.start ? init.start : from});
  const node = el("div", {}), where = el("div", {class: "hint"});
  const value = () => {
    if (often === "once") return null;
    if (often === "daily") return {mode: "daily"};
    if ((often === "weekly" || often === "nweeks") && !days.size) return {invalid: "Pick at least one day."};
    if (often === "weekly") return {mode: "weekly", days: [...days]};
    if (often === "monthdays") return mdays.size ? {mode: "monthdays", mdays: [...mdays]} : {invalid: "Pick at least one day of the month."};
    if (often === "months") return months.size ? {mode: "months", months: [...months]} : {invalid: "Pick at least one month."};
    const s = dateIn(start.value) || from;
    if (often === "ndays") return {mode: "ndays", n: Math.max(2, Math.min(60, parseInt(nDays.value, 10) || 2)), start: s};
    return {mode: "nweeks", n: Math.max(1, Math.min(12, parseInt(nWeeks.value, 10) || 1)), days: [...days], start: s};
  };
  const sayWhere = () => {
    const w = value();
    if (!w) { where.textContent = opts.none ? "In no template: it is only on the days you write it on yourself."
      : "Only on this line. Nothing is added to other days."; return; }
    if (w.invalid) { where.textContent = w.invalid; return; }
    const names = trackerTemplateNames(w, from), set = new Set(names);
    const next = [];
    for (let d = todayISO(), i = 0; next.length < 4 && i < 400; d = shiftISO(d, 1), i++) if (whenOnDay(set, d)) next.push(humanDate(d));
    const mode = whenMode(w);
    where.textContent = "Written into " + whereWords(names) + " in Settings, so those days get it by themselves. " +
      (mode === "monthdays" ? "These carry on every year."
        : mode === "ndays" || mode === "nweeks" ? "Kept written about four months ahead as the days go by."
        : "These run out when the year ends; you are reminded in December.") +
      (next.length ? " Next: " + next.join(", ") + "." : "");
  };
  const chips = (list, set, label) => {
    const row = el("div", {class: "trkdays"});
    for (const v of list) row.append(el("button", {type: "button", class: "fchip", "aria-pressed": String(set.has(v)),
      onclick: () => { set.has(v) ? set.delete(v) : set.add(v); draw(); }}, label(v)));
    return row;
  };
  const weekdayChips = () => chips([1, 2, 3, 4, 5, 6, 0], days, d => WEEKDAY_NAMES[d][0].slice(0, 3));
  const row = (...kids) => el("div", {class: "trkevery"}, ...kids);
  const draw = () => {
    node.textContent = "";
    const opt = (id, label, hint) => el("button", {class: "trkkind" + (often === id ? " on" : ""), type: "button",
      onclick: () => { often = id; draw(); }}, el("b", {}, label), el("span", {}, hint));
    node.append(el("div", {class: "trkkinds"},
      opt("once", opts.none ? "No schedule" : "Just here", opts.none ? "only where you write it" : "this line only"),
      opt("daily", "Every day", "on every day page"),
      opt("weekly", "Some weekdays", "pick the days"),
      opt("ndays", "Every few days", "every 2nd, 3rd…"),
      opt("nweeks", "Every few weeks", "every other Monday…"),
      opt("monthdays", "Days of the month", "the 1st, the 15th…"),
      opt("months", "Some months", "every day in those")));
    if (often === "weekly") node.append(weekdayChips());
    if (often === "ndays") node.append(row("Every", nDays, "days, from", start));
    if (often === "nweeks") node.append(row("Every", nWeeks, "weeks, from", start), weekdayChips());
    if (often === "monthdays") node.append(chips(Array.from({length: 31}, (_, i) => i + 1), mdays, String));
    if (often === "months") node.append(chips(Array.from({length: 12}, (_, i) => i + 1), months, m => capitalise(MONTH_WORDS[m - 1])));
    node.append(where);
    sayWhere();
  };
  for (const i of [nDays, nWeeks, start]) i.addEventListener("input", sayWhere);
  draw();
  return {node, value};
}
