function nextWeekday(dow, strictlyAfter = true) {
  const t = parseISO(todayISO());
  let n = (dow - t.getDay() + 7) % 7;
  if (n === 0 && strictlyAfter) n = 7;
  return shiftISO(todayISO(), n);
}
