const WHEN_KIND = {
  by: "DEADLINE", due: "DEADLINE", before: "DEADLINE", innen: "DEADLINE", frist: "DEADLINE",
  on: "SCHEDULED", "på": "SCHEDULED", starts: "SCHEDULED", start: "SCHEDULED", from: "SCHEDULED",
  this: "DEADLINE", denne: "DEADLINE",
  until: "until",
};

/* The next one strictly after `from`: "fri" said on a Friday is next week,
   because "today" is the word for today. */
const nextWeekdayISO = (wd, from) => shiftISO(from, ((wd - weekdayOf(from) + 7) % 7) || 7);
const mondayAfterISO = from => shiftISO(from, 7 - ((weekdayOf(from) + 6) % 7));
