function hoursWindow() {
  const weeks = (HOURS_RANGES.find(r => r[0] === state.hoursRange) || HOURS_RANGES[0])[2];
  const monday = weekStartISO(todayISO());
  return {from: shiftISO(monday, -7 * weeks), to: shiftISO(monday, 6)};
}
