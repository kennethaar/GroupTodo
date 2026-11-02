/* ---------- hours, week by week ----------
   The weeks run Monday to Sunday, numbered the way the calendar on the wall
   numbers them, each a table of who (or which project) and the days. It is
   there so you and whoever was on site can go down the same week line by line,
   so it copies as text too. */
const HOURS_RANGES = [["week", "This week", 0], ["4", "Last 4 weeks", 3], ["13", "Last 13 weeks", 12], ["52", "Last 52 weeks", 51]];
const HOURS_GROUPS = [["person", "By person"], ["project", "By project"]];
const hoursKey = (e, by) => by === "project" ? e.project || "No project" : e.who || "Nobody named";
