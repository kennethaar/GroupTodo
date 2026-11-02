const humanWhen = (day, time) => humanDate(day) + (time ? " " + time : "");

/* The line, read: what stays as the title, and what was taken out of it. */
/* A repeat said in one word at the end of a line: "Vacuum weekly". Also the
   rules that start with one, "weekly on mon, thu". */
const REPEAT_WORD_RE = /^(daily|weekly|fortnightly|biweekly|monthly|quarterly|yearly|annually)\b/;
