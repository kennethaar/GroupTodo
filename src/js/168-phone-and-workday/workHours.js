function workHours() {
  const me = whoAmI();
  const raw = String((me && getPage(personPath(me))?.props?.work_hours) || PREF.get("work_hours", "") || "");
  const m = /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/.exec(raw);
  if (!m) return null;
  let days = [1, 2, 3, 4, 5];
  const d = /\b(sun|mon|tue|wed|thu|fri|sat)\w*\s*-\s*(sun|mon|tue|wed|thu|fri|sat)/i.exec(raw);
  if (/\b(daily|every day|alle dager)\b/i.test(raw)) days = [0, 1, 2, 3, 4, 5, 6];
  else if (d) {
    days = [];
    for (let i = WORK_DAYS[d[1].toLowerCase()], n = 0; n < 7; i = (i + 1) % 7, n++) {
      days.push(i);
      if (i === WORK_DAYS[d[2].toLowerCase()]) break;
    }
  }
  return {start: pad2(+m[1]) + ":" + m[2], end: pad2(+m[3]) + ":" + m[4], days, raw: trim(raw)};
}
