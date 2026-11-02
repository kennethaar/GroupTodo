/* "onsdag kl 12", "fri 2pm", "neste onsdag kl 13": a day, then a time on it. */
function dayAndClock(p) {
  const m = /^(.+?)\s+((?:at|kl\.?|klokka|klokken)\s+\S+|\S+)$/.exec(p);
  const time = m && whenClock(m[2]);
  const day = time && (dateFromWords(m[1]) || whenDay(m[1], todayISO()));
  return day ? {day, time} : null;
}
