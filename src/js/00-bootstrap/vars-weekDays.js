const weekDays = id => { const mon = weekMonday(id); return mon ? [0, 1, 2, 3, 4, 5, 6].map(n => shiftISO(mon, n)) : []; };
const shiftWeek = (id, n) => weekOf(shiftISO(weekMonday(id), 7 * n));
const weekNo = id => +(WEEK_RE.exec(id || "") || [])[2] || 0;
