// i: 0 visits, 1 seconds active, 2 actions
function usageBump(place, i, n) {
  if (!usageOn() || !place) return;
  const days = usageDays(), today = todayISO();
  const day = days[today] || (days[today] = {});
  (day[place] || (day[place] = [0, 0, 0]))[i] += n;
}
