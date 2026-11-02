function dayRun(from, to) {
  const days = [];
  for (let i = WORK_DAYS[from.toLowerCase()], n = 0; n < 7; i = (i + 1) % 7, n++) {
    days.push(i);
    if (i === WORK_DAYS[to.toLowerCase()]) break;
  }
  return days;
}
