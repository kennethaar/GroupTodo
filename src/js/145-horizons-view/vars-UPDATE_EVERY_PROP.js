/* How often they want to hear, on their own page: update_every:: 1 month.
   Picked, never typed; without it, once a month. Never: no reminders. */
const UPDATE_EVERY_PROP = "update_every";
const UPDATE_EVERY = [["2 weeks", 14], ["1 month", 30], ["3 months", 91], ["never", null]];
const UPDATE_EVERY_DEFAULT = "1 month";
const everyWords = v => v === "never" ? "no reminders" : "every " + v.replace(/^1 /, "");
