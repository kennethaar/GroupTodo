const minutesText = m => m >= 60 ? Math.floor(m / 60) + " h" + (m % 60 ? " " + m % 60 + " min" : "") : m + " min";
// Time due now: by the dots on the chores that are due.
const dueTimeText = s => !s.by.due.length ? "nothing due" : !s.sized ? "not sized" : minutesText(s.mins);
