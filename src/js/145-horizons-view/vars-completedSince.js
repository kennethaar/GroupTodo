const completedSince = from =>
  memo("completed:" + from, () => acrossSpaces(() => completedSinceHere(from)));

const REPORT_RANGES = [
  ["week",    "Week",       0],
  ["month",   "Month",      1],
  ["quarter", "Quarter",    3],
  ["half",    "Half year",  6],
  ["year",    "Year",      12],
];

/* Monday, because that is where a week of work starts. */
const weekStartISO = iso => shiftISO(iso, -(((parseISO(iso) || new Date()).getDay() + 6) % 7));
