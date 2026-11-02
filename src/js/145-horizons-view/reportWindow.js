/* The window the report is about: one of the named ranges, or the two dates
   you typed. Both ends are inclusive and both are plain ISO days, which is
   what the files carry, so nothing has to be parsed to compare them. */
function reportWindow() {
  const today = todayISO();
  if (state.reportRange === "custom") {
    const from = state.reportFrom || weekStartISO(today);
    const to   = state.reportTo   || today;
    // Typed the other way round is still a window, so it is read as one.
    return from <= to ? {from, to, custom: true} : {from: to, to: from, custom: true};
  }
  const key = state.reportRange || "week";
  const months = (REPORT_RANGES.find(r => r[0] === key) || REPORT_RANGES[0])[2];
  return {from: months ? addMonths(today, -months) : weekStartISO(today), to: today};
}
