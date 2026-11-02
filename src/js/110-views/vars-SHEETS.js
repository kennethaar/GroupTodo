/* ============================================================
   SHEETS -- trackers added up, a week by its days and a year by its months
   A sheet takes every tracker of one letter and makes each a column:

     tracker-office_t:: 07:12 - 10:00, 10:30 - 12:30
     tracker-home_t:: 17:30 - 19:00

   is a day at the office and an evening at home in the Hours sheet -- where
   the work was done, so the year can count the days you drove in. Amounts does the same for
   _a trackers (what was spent on food, on travel) and Stock for _q (what is
   on the shelf, counted forward from every +3 and -1, and =12 when counted).
   What is the same for all of them is here once; a sheet only says what its
   letter means. How a sheet adds up is yours, on your own page so the phone
   knows too, each key starting with the sheet's id:

     hours_target:: mon-thu 7.5, fri 7      per weekday: a normal day, a budget
     amounts_split:: Home 50, Work 50      a fixed share of every day
     hours_extra:: 1                        added to each day with anything on it
     hours_format:: 0,00                    h:mm, 0.00 or 0,00
     hours_trackers:: office, home          only these, when not all of them
     amounts_unit:: kr

   Hours and Amounts count your own day pages; Stock counts everybody's, as
   a shelf is shared. Without hours_target:: a normal day is work_hours::.
   ============================================================ */
const SHEETS = [
  {id: "hours", letter: "t", title: "Hours", mine: true, total: "Total", time: true, days: true,
   diff: {head: "Flex", target: "A normal day", hint: "Hours per weekday, which flex is counted against. Left empty, your working hours are.",
     of: (total, target) => total - target},
   extra: "Hours added to each day worked, e.g. 1 makes a 7 hour day count as 8.",
   formats: [["h:mm", "7:30"], ["0.00", "7.50"], ["0,00", "7,50"]],
   empty: "Set up a tracker of Hours worked -- one per place you work, like office and home -- and fill in start and end on your days."},
  {id: "amounts", letter: "a", title: "Amounts", mine: true, total: "Total", unit: true, split: true,
   diff: {head: "Under budget", target: "Budget per day", hint: "Per weekday; the week says how far under it you stayed.",
     of: (total, target) => target - total},
   formats: [["0.00", "129.50"], ["0,00", "129,50"], ["0", "130"]],
   empty: "Set up a tracker of An amount -- one per kind, like food and travel -- and write what it came to on your days."},
  {id: "stock", letter: "q", title: "Stock", mine: false, total: "On hand", unit: true, onHand: true,
   formats: [["0", "12"], ["0.00", "12.50"], ["0,00", "12,50"]],
   empty: "Set up a tracker of Stock -- one per thing -- and write +3 when it comes in, -1 when it goes and =12 when you count."},
  /* Not trackers: the clock on the todos of each client's projects. */
  {id: "clients", title: "Clients", mine: true, total: "Total", time: true, source: () => clientEntries(),
   nav: patch => go("projects", Object.assign({sub: "hours", hoursOf: "clients"}, patch)),
   formats: [["h:mm", "7:30"], ["0.00", "7.50"], ["0,00", "7,50"]]},
];
const sheetNav = (S, patch) => S.nav ? S.nav(patch) : go("trackers", Object.assign({trkSheet: S.id}, patch));
const sheetById = id => SHEETS.find(S => S.id === id);
