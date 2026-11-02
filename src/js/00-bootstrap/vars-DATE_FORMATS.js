/* toLocaleDateString builds a new formatter on every call, which is most of
   the cost of a list of a thousand dated lines. These are built once. */
const DATE_FORMATS = {};
const dateFormat = sameYear => DATE_FORMATS[sameYear] || (DATE_FORMATS[sameYear] = new Intl.DateTimeFormat(undefined,
  {weekday:"short", day:"numeric", month:"short", year: sameYear ? undefined : "numeric"}));
