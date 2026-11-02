const KIND_MARK = {person: "p", org: "o", project: "1", area: "a", context: "@", page: "·", date: "📅"};
const LINK_KIND_WORD = {context: "context", person: "person", org: "org", zettel: "note", email: "email", review: "review",
  area: "responsibility", goal: "goal", checklist: "routine", project: "project", journal: "day",
  horizon: "horizon", page: "page"};

/* ---------- dates in words ----------
   The words people actually write. A bare weekday is the next one coming --
   "friday" on a Friday means next week, because a task due today says today. */
const WEEKDAY_WORDS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const MONTH_WORDS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
