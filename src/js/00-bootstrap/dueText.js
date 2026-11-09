/* What a due pill says. Days late, how late is all that matters: the date
   itself is on hover and in the pill's menu. */
function dueText(day, time, open = true) {
  const rel = open ? relDue(day) : "";
  if (/ late$/.test(rel)) return {words: rel, ago: true};
  return {words: humanWhen(day, time) + (rel ? " · " + rel : ""), ago: false};
}
