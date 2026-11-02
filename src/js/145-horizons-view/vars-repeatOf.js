const repeatOf = b => trim(blockProp(b, REPEAT_PROP) || "");
const REPEAT_CHOICES = ["", "daily", "weekly", "fortnightly", "monthly", "quarterly", "yearly"];

/* ---------- a rule for when something comes round ----------
   One set of plain words wherever a date comes round -- a routine's cadence::
   and a task's repeat:: alike -- so what the dialog writes is what you would
   have typed:

       daily · every 3 days · every weekday
       weekly · weekly on mon, thu · every 2 weeks on fri
       monthly · monthly on the 15th · monthly on the last friday
       every 3 months on the 2nd tuesday
       yearly · yearly on 15 march · yearly on the first monday of june

   What a rule leaves out comes from the day it starts: "weekly" is the
   weekday it started on, "monthly" the date. */
const RULE_MONTHS = ["january", "february", "march", "april", "may", "june", "july",
  "august", "september", "october", "november", "december"];
const RULE_NTH = {first: 1, "1st": 1, second: 2, "2nd": 2, third: 3, "3rd": 3, fourth: 4, "4th": 4,
  fifth: 5, "5th": 5, last: -1};
const RULE_NTH_WORD = {1: "first", 2: "second", 3: "third", 4: "fourth", 5: "fifth", "-1": "last"};
const RULE_UNIT = {day: "day", week: "week", fortnight: "week", month: "month", quarter: "month", year: "year"};
const RULE_ALIAS = {daily: "1 day", weekly: "1 week", fortnightly: "2 weeks", biweekly: "2 weeks",
  monthly: "1 month", quarterly: "3 months", yearly: "1 year", annually: "1 year", annual: "1 year"};
const ruleOrdinal = n => n + (n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th");
const ruleWeekday = w => { const i = WEEKDAYS.findIndex(d => w.length >= 3 && d.startsWith(w.replace(/s$/, ""))); return i; };
const ruleMonth = w => RULE_MONTHS.findIndex(m => w.length >= 3 && m.startsWith(w.replace(/\.$/, "")));
