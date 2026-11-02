/* ============================================================
   113a_WHEN -- the date is already in the words
   "Call Bob fri 2pm" says Friday at two. Making somebody open the panel and
   find a date field to say what they have just typed is a tax on every
   capture, so the end of a captured line is read for a date, a time, a
   repeat, and the Taskwarrior-style words due:, until: and remind:.

   Only the end of the line is read, because that is where people put it and
   because "Ring Mon about the May accounts" is a sentence, not a schedule.
   A bare number is a number: 10.30 is a version and 1/2 is half a cup unless
   something says otherwise (kl., at, by, a year). Whatever was taken is said
   in a toast with one button that puts the words back, so a wrong guess
   costs a click and never a lost word.

   Written into the file the way it was always written -- SCHEDULED:: [[day]]
   -- with the time after the link when there is one, so the date still reads
   in Notepad and every older reader of the property still finds the day.
   ============================================================ */
const WHEN_MONTHS = {
  jan: 1, january: 1, januar: 1, feb: 2, february: 2, februar: 2, mar: 3, march: 3, mars: 3,
  apr: 4, april: 4, may: 5, mai: 5, jun: 6, june: 6, juni: 6, jul: 7, july: 7, juli: 7,
  aug: 8, august: 8, sep: 9, sept: 9, september: 9, oct: 10, october: 10, okt: 10, oktober: 10,
  nov: 11, november: 11, dec: 12, december: 12, des: 12, desember: 12,
};
/* Full names in both languages, and the English short forms. The Norwegian
   short forms are left out on purpose: "man", "tor" and "fre" are words. */
const WHEN_WEEKDAYS = {
  sunday: 0, sun: 0, "søndag": 0, monday: 1, mon: 1, mandag: 1,
  tuesday: 2, tue: 2, tues: 2, tirsdag: 2, wednesday: 3, wed: 3, onsdag: 3,
  thursday: 4, thu: 4, thur: 4, thurs: 4, torsdag: 4, friday: 5, fri: 5, fredag: 5,
  saturday: 6, sat: 6, "lørdag": 6,
};
const WHEN_LOOSE_ONLY = new Set(["tom", "tod", "eod", "sat", "sun", "wed"]);

/* ---------- the words, in any language ----------
   Dates and times are read in English (and the Norwegian above, from before).
   Any other language gives its words in its language file, after these keys:

       when: next => nästa
       when: tomorrow => i morgon, imorgon

   and a phrase is put back into English before it is read, so "nästa onsdag
   kl 13" is "next wednesday kl 13". Several words for one key are separated
   by commas. The word before a time is kl, the 24-hour clock: "at 3" being
   the afternoon is English, and stays with the English word. */
const WHEN_LANG = {
  "when: today": "today", "when: tomorrow": "tomorrow", "when: day after tomorrow": "day after tomorrow",
  "when: next": "next", "when: this": "this", "when: next week": "next week", "when: next month": "next month",
  "when: end of week": "end of week", "when: end of month": "end of month",
  "when: in": "in", "when: on": "on", "when: by": "by", "when: until": "until", "when: every": "every",
  "when: at": "kl",
  "when: minute": "minute", "when: minutes": "minutes", "when: hour": "hour", "when: hours": "hours",
  "when: day": "day", "when: days": "days", "when: week": "week", "when: weeks": "weeks",
  "when: month": "month", "when: months": "months", "when: year": "year", "when: years": "years",
  "when: monday": "monday", "when: tuesday": "tuesday", "when: wednesday": "wednesday",
  "when: thursday": "thursday", "when: friday": "friday", "when: saturday": "saturday", "when: sunday": "sunday",
  "when: january": "january", "when: february": "february", "when: march": "march", "when: april": "april",
  "when: may": "may", "when: june": "june", "when: july": "july", "when: august": "august",
  "when: september": "september", "when: october": "october", "when: november": "november",
  "when: december": "december",
};
