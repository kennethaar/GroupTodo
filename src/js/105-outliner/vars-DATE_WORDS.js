/* What the menu offers while a date is still being typed. */
const DATE_WORDS = ["today", "tomorrow", "day after tomorrow", "next week", "this weekend",
  "end of week", "end of month", "next month",
  ...WEEKDAY_WORDS.slice(1), "sunday", ...WEEKDAY_WORDS.slice(1).map(w => "next " + w),
  "in 2 days", "in 3 days", "in 1 week", "in 2 weeks", "in 1 month"];
