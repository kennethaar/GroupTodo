/* A phrase as a row: a day, or a day and a time. In 45 minutes is a moment, so
   it is reminded then; 14:30 is the next time the clock says it. */
function dateSuggestion(w) {
  const rel = whenFromNow(w);
  if (rel) return {kind: "date", title: w, iso: rel.day, time: rel.time, now: true};
  const both = dayAndClock(w);
  if (both) return {kind: "date", title: w, iso: both.day, time: both.time};
  const time = whenClock(w);
  if (time) return {kind: "date", title: w, iso: time > nowHM() ? todayISO() : shiftISO(todayISO(), 1), time};
  // The words the capture box reads too: "neste onsdag", "i morgen".
  return {kind: "date", title: w, iso: dateFromWords(w) || whenDay(w, todayISO())};
}
